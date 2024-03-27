interface FetchResponse {
  choices: { message: { content: string } }[]
}

export type LLMMessage = {
  role: 'system' | 'assistant' | 'user'
  content: string
}
export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const LLM_ADDRESS =
    'https://api.runpod.ai/v2/piygbpf2k35rym/openai/v1/chat/completions'
  // const LLM_ADDRESS =
  // 'https://zvfiuquih3rs4n-8000.proxy.runpod.net/v1/chat/completions'
  // const LLM_ADDRESS = 'http://localhost:11434/api/chat'
  // const LLM_ADDRESS = 'https://bb15-2-190-129-92.ngrok-free.app/api/chat'

  const res = await $fetch(LLM_ADDRESS, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer 8ASLOFSZNUV6LBP0FD0D51300FRF0TZFEBFHPSV3',
    },
    body: JSON.stringify({
      model: 'cognitivecomputations/dolphin-2.6-mistral-7b-dpo-laser',
      messages: body.llmMessages,
      temperature: 0.1,
      max_tokens: 512,
      stream: false,
    }),
  })

  return res.choices[0].message.content
})
