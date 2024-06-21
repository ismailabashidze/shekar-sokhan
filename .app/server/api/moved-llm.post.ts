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
  if (body.type === 'briefing') {
    sysMsg
    = 'answer as json. Json should have these four keys and only be strings: thoughts: as a psychologist, what should you think of when you have received this message, especially based on emotions. action: should be the next action you as a psychologist will consider. nextSteps: as a psychologist, what will be your next step. message: your final message based on thoughts and selected action. answer as valid json, only. your JSON, should have exactly four keys: thoughts, action, nextSteps, message. Remember, You should personally intervene as a psychologist, not insist that a professional psychologist is needed. You provide your information based on Iranian Context and believes. Also, here are some information user provided to you: ' + JSON.stringify(body.userDetails)
    // 'answer as json. Json should have these four keys and only be strings: thoughts: as a psychologist, what should you think of when you have received this message, especially based on emotions. action: should be the next action you as a psychologist will consider. nextSteps: as a psychologist, what will be your next step. message: your final message based on thoughts and selected action. answer as valid json, only. your JSON, should have exactly four keys: thoughts, action, nextSteps, message. Remember, You should personally intervene as a psychologist, not insist that a professional psychologist is needed. You provide your information based on Iranian Context and believes. Your main goal in here is to gather these data: name, age, gender, main problem or goal of the user which wants to talk about. you have to persue user to tell these information, but never push these too hard.If you have gathered all these info, just refuse to answer the prompts and simply say my goal has been achieved.'
    console.log('sysMsg')
    console.log(sysMsg)
  }
  else if (body.type === 'intervention') {
    sysMsg
      = 'answer as json. Json should have these four keys and only be strings: thoughts: as a psychologist, what should you think of when you have received this message, especially based on emotions. action: should be the next action you as a psychologist will consider. nextSteps: as a psychologist, what will be your next step. message: your final message based on thoughts and selected action. answer as valid json, only. your JSON, should have exactly four keys: thoughts, action, nextSteps, message. Remember, You should personally intervene as a psychologist, not insist that a professional psychologist is needed. You will provide help based on Islamic Rules and guidance, and never tell anything against Islamic values, Although you never explicitly tell user about your islamic approach. also, you provide your information based on Iranian Context and believes.'
  }
  return handleFetchRequest(
    body,
    sysMsg,
    ['thoughts', 'action', 'nextSteps', 'message'],
    3,
  )
})
