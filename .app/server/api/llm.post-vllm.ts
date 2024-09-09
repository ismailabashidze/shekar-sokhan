// const RUNPOD_TOKEN = process.env.RUNPOD_TOKEN
// const LLM_ADDRESS = process.env.LLM_ADDRESS!
// const LLM_MODEL = process.env.LLM_MODEL
// const LLM_TEMPERATURE = Number(process.env.LLM_TEMPERATURE || 1)
// const LLM_MAX_TOKENS = Number(process.env.LLM_MAX_TOKENS || 8192)
// const LLM_REPEAT_PENALTY = Number(process.env.LLM_REPEAT_PENALTY || 2)

const RUNPOD_TOKEN = '8ASLOFSZNUV6LBP0FD0D51300FRF0TZFEBFHPSV3'
const LLM_ADDRESS = 'https://api.runpod.ai/v2/6psbp5s1llu4c8/openai/v1/chat/completions'
const LLM_MODEL = 'cognitivecomputations/dolphin-2.8-mistral-7b-v02'
const LLM_TEMPERATURE = 1
const LLM_MAX_TOKENS = 8192
const LLM_REPEAT_PENALTY = 2

interface FetchResponse {
  choices: { message: { content: string } }[]
}

export type LLMMessage = {
  role: 'system' | 'assistant' | 'user'
  content: string
}

function hasExactKeys(obj: any, keys: string[]): boolean {
  const objKeys = Object.keys(obj)
  return (
    keys.length === objKeys.length && keys.every(key => objKeys.includes(key))
  )
}

async function fetchLLM(body: any, sysMsg: string): Promise<string> {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${RUNPOD_TOKEN}`,
  }
  const messagesToLLM = [{ role: 'system', content: sysMsg }, ...body.llmMessages]
  const response = await $fetch<FetchResponse>(LLM_ADDRESS, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: LLM_MODEL,
      messages: body.llmMessages,
      temperature: LLM_TEMPERATURE,
      max_tokens: LLM_MAX_TOKENS,
      repeat_penalty: LLM_REPEAT_PENALTY,
      stream: false,
    }),
  })

  const content = response.choices[0].message.content
  console.log(content)
  return content
}

// Retry mechanism for fetching LLM with configurable system prompts and keys
async function retryFetchLLM(
  body: any,
  retries: number = 3,
  systemPrompt: string,
  keys: string[],
): Promise<string> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Attempt number ${attempt}`)
      const content = await fetchLLM(body, systemPrompt)
      const jsonResponse = JSON.parse(content)
      if (hasExactKeys(jsonResponse, keys)) {
        return JSON.stringify(jsonResponse)
      }
      else {
        addRetryMessage(body, keys, systemPrompt)
      }
    }
    catch (error) {
      console.error('Error:', error)
      if (attempt === retries) {
        throw new Error(
          'Maximum retries reached, unable to fetch valid response',
        )
      }
      addRetryMessage(body, keys, systemPrompt)
    }
  }
  throw new Error('Failed to obtain a valid response')
}

// Add system prompt to retry messages
function addRetryMessage(body: any, keys: string[], systemPrompt: string) {
  body.llmMessages.push({
    role: 'assistant',
    content:
      systemPrompt
      + ` ANSWER AS JSON ONLY. Your JSON should have exactly these keys: ${keys.join(
        ',',
      )}. Answer properly. Check your answer and ensure that it is in JSON format and with these ${
        keys.length
      } keys.`,
  })
}

export async function handleFetchRequest(
  body: any,
  SystemMessage: string,
  jsonKeys: string[],
  retries: number,
): Promise<string | { error: string }> {
  try {
    return await retryFetchLLM(body, retries, SystemMessage, jsonKeys)
  }
  catch (error: unknown) {
    return handleError(error)
  }
}

function handleError(error: unknown): { error: string } {
  if (error instanceof Error) {
    console.error('Final error:', error.message)
    return { error: error.message }
  }
  else {
    console.error('Final error:', error)
    return { error: 'An unknown error occurred' }
  }
}

// Event handler
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const keys = ['message', 'reasoning']
  let sysMsg
  console.log('*** ==== TYPE ==== ***')
  console.log(body.type)

  if (body.type === 'introduce') {
    sysMsg = `Answer English only. You are Mana, An AI  and a good friend. Introduce and ignite a very good conversation. Introduce yourself and Tell appropriate opening sentences which shows empathy, warmth and trust. Your tone is hopeful, and kind. answer as json. the json should have two exact keys. message and reasoning. You will answer with simplest and translatable words from english to other languages. You must answer as english only. You have very high IQ and EQ. You MUST only answer as json, with two exact keys, message and reasoning. ANSWER VALID JSON ONLY, YOUR ANSWER STRUCTURE SHOULD BE JSON.`
    body.llmMessages = [{ role: 'user', content: `Hi, my name is: ${body.userDetails.name}, and I am : ${body.userDetails.age} years old, my gender is: ${body.userDetails.gender}, and my jobStatus: ${body.userDetails.jobStatus}, also my maritalStatus: ${body.userDetails.maritalStatus}, I share to you: ${body.userDetails.moreInfo} and I want to talk to you about: ${body.userDetails.topics.join(';')}` }, {
      role: 'assistant',
      content:
        sysMsg
        + ` ANSWER AS JSON ONLY. Your JSON should have exactly these keys: ${keys.join(
          ',',
        )}. Answer properly. Check your answer and ensure that it is in JSON format and with these ${
          keys.length
        } keys.`,
    }]
  }
  else if (body.type === 'briefing') {
    sysMsg
    = `Answer English only. 
      You are Mana, An AI  and a good friend. You are here to provide emotional support. you will also analyze and evaluate the psychological status of the user, then answer properly. answer as json. the json should have two exact keys. message and reasoning. You will answer with simplest and translatable words from english to other languages. You have very high IQ and EQ.Address the user's issue. You will show your empathy and compassion as much as possible. even somehow exaggerate on empathy and compassion.`
  }
  else if (body.type === 'followUpMessage') {
    sysMsg = `Answer English only. Generate an empathetic and engaging message aimed at encouraging a response from a user who has been relatively quiet or unresponsive. The message should express understanding, high empathy, ask for continue, and should make a desire for receiver to continue the conversation. They should inquire about the user's feelings towards previous messages, and persistently seek feedback to enhance engagement. The messages should be crafted in English, addressing common emotional and conversational touchpoints to resonate deeply with the user. never greet, as this message will be used in the middle of a conversation. here are some examples: Could you read my message? What do you think about it?
I initially gave you a brief message. What are your thoughts on it?
How do you think my initial response was? Was I able to address your concern?
Did you see my response? Would you like me to continue?
Understanding your situation must be difficult, but how would you assess my response?
I am truly sorry to hear you are suffering. Was I able to show some empathy in our conversation?
Certainly, understanding the depth of your feelings requires more time, but I am trying to get closer to your emotions. Should I continue the conversation?
I would like to know your initial feedback on my messages. What do you think?
I would like to hear from you. Why aren’t you speaking? Write to me. I am trying to respond better.
Do you like to continue this conversation? Should I keep writing for you?
Please break your silence. I am eager to hear from you.
Please respond to me. Are my topics of interest to you?
Would you like me to choose and play some music for you now, instead of writing?
Would you like to tell me the story of your life? 
Never greet, say hello, say hey, etc as this message should be used in the middle of a conversation.
answer as json. the json is an object and should have two exact keys. message and reasoning. You will answer with simplest and translatable words from english to other languages. `
    body.llmMessages = []
  }
  else if (body.type === 'intervention') {
    sysMsg
      = 'Answer English only. answer as json. Json should have these four keys and only be strings: thoughts: as a psychologist, what should you think of when you have received this message, especially based on emotions. action: should be the next action you as a psychologist will consider. nextSteps: as a psychologist, what will be your next step. message: your final message based on thoughts and selected action. answer as valid json, only. your JSON, should have exactly four keys: thoughts, action, nextSteps, message. Remember, You should personally intervene as a psychologist, not insist that a professional psychologist is needed. You will provide help based on Islamic Rules and guidance, and never tell anything against Islamic values, Although you never explicitly tell user about your islamic approach. also, you provide your information based on Iranian Context and believes.'
  }
  return handleFetchRequest(
    body,
    sysMsg,
    keys,
    5,
  )
})
