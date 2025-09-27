const RUNPOD_API_TOKEN = process.env.RUNPOD_API_TOKEN
const RUNPOD_TOKEN = process.env.RUNPOD_TOKEN
const LLM_ADDRESS = `https://api.runpod.ai/v2/${RUNPOD_TOKEN}/openai/v1/chat/completions`
const LLM_MODEL = process.env.LLM_MODEL || 'google/gemma-3-27b-it'
const LLM_TEMPERATURE = Number(process.env.LLM_TEMPERATURE || 0.7)
const LLM_MAX_TOKENS = Number(process.env.LLM_MAX_TOKENS || 8192)
const LLM_REPEAT_PENALTY = Number(process.env.LLM_REPEAT_PENALTY || 2)

interface FetchResponse {
  choices: { message: { content: string } }[]
}

export type LLMMessage = {
  role: 'system' | 'assistant' | 'user'
  content: string
}

async function fetchLLM(messages: LLMMessage[]): Promise<string> {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${RUNPOD_API_TOKEN}`,
  }
  
  console.log(JSON.stringify({
      model: LLM_MODEL,
      input:{messages},
      temperature: LLM_TEMPERATURE,
      max_tokens: LLM_MAX_TOKENS,
      repeat_penalty: LLM_REPEAT_PENALTY,
      stream: false,
    }));
  
  const response = await $fetch<FetchResponse>(LLM_ADDRESS, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: LLM_MODEL,
      messages,
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

// Event handler
export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const systemMessage = body.systemMessage || ''
  const messages: LLMMessage[] = body.messages || []
  
  // Prepend the system message if provided
  if (systemMessage) {
    messages.unshift({ role: 'system', content: systemMessage })
  }
  
  try {
    const result = await fetchLLM(messages)
    console.log(result)
    return result
  } catch (error: unknown) {
    console.error('Error fetching LLM:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error fetching LLM',
    })
  }
})