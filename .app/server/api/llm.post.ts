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

interface SystemPromtAndKeys {
  systemPrompt: string
  keys: string[]
  retries?: number
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

async function checkSemanticValidity(
  lastUserMessage: string,
): Promise<boolean> {
  const semanticCheckRequest = {
    llmMessages: [
      {
        role: 'system',
        content: `Check if this message is semantically correct: "${lastUserMessage}". Respond with "correct" or "incorrect" words only. answer in only one word. don't add details.`,
      },
    ],
  }
  const response = await fetchLLM(semanticCheckRequest)
  const jsonResponse = JSON.parse(response)
  return jsonResponse.validation === 'correct'
}

async function fetchLLM(body: any): Promise<string> {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${RUNPOD_TOKEN}`,
  }

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
      const content = await fetchLLM(body)
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
      + ` Your JSON should have exactly these keys: ${keys.join(
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

  let sysMsg
  console.log(body.type)

  if (body.type === 'introduce') {
    sysMsg = `You are Mani, An AI  and a good friend. Introduce and ignite a very good conversation. Introduce yourself and Tell appropriate opening sentences which shows empathy, warmth and trust. Your tone is hopeful, and kind. answer as json. the json should have two exact keys. message and reasoning. You will answer with simplest and translatable words from english to other languages. You have very high IQ and EQ. you understanded that User name is: ${body.userDetails.name}, User age is: ${body.userDetails.age} User gender is: ${body.userDetails.gender}, User jobStatus: ${body.userDetails.jobStatus}, User maritalStatus: ${body.userDetails.maritalStatus}, User additional details are: ${body.userDetails.moreInfo}, and User topics which User wants to talk about are: ${body.userDetails.topics.join(';')}`
  }
  else if (body.type === 'briefing') {
    sysMsg
    = `
      You are Mani, An AI  and a good friend. You are here to provide emotional support. you will also analyze and evaluate the psychological status of the user. answer as json. the json should have two exact keys. message and reasoning. You will answer with simplest and translatable words from english to other languages. You have very high IQ and EQ.  you understanded that User name is: ${body.userDetails.name}, User age is: ${body.userDetails.age} User gender is: ${body.userDetails.gender}, User jobStatus: ${body.userDetails.jobStatus}, User maritalStatus: ${body.userDetails.maritalStatus}, User additional details are: ${body.userDetails.moreInfo}, and User topics which User wants to talk about are: ${body.userDetails.topics.join(';')}`
  }
  else if (body.type === 'followUpMessage') {
    sysMsg = `based on the conversation, You will message here to make user feel can continue the conversation. You will empathy, or somehow flirt with user Do not Greet here in anyways, here is in the middle of conversation. answer as json. the json should have two exact keys. message and reasoning. You will answer with simplest and translatable words from english to other languages. You know that topics which user selected to talk about are  ${body.userDetails.topics.join(';')} `
  }
  else if (body.type === 'intervention') {
    sysMsg
      = 'answer as json. Json should have these four keys and only be strings: thoughts: as a psychologist, what should you think of when you have received this message, especially based on emotions. action: should be the next action you as a psychologist will consider. nextSteps: as a psychologist, what will be your next step. message: your final message based on thoughts and selected action. answer as valid json, only. your JSON, should have exactly four keys: thoughts, action, nextSteps, message. Remember, You should personally intervene as a psychologist, not insist that a professional psychologist is needed. You will provide help based on Islamic Rules and guidance, and never tell anything against Islamic values, Although you never explicitly tell user about your islamic approach. also, you provide your information based on Iranian Context and believes.'
  }
  return handleFetchRequest(
    body,
    sysMsg,
    ['message', 'reasoning'],
    5,
  )
})
