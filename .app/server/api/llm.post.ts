interface FetchResponse {
  choices: { message: { content: string } }[]
}

export type LLMMessage = {
  role: 'system' | 'assistant' | 'user'
  content: string
}
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (body.type == 'eval') {
    body.llmMessages.unshift({
      content:
        'You are A senior psychotherapist. you accept a message from a psychotherapy conversation, then analyze the information, compact it in a json format. you include useful information, not including the summary itself. It is possible that the whole input to you has no value, if so, use this json {result : ""} to respond. YOU ONLY RETURN JSON. Emphasize on psychological information, which are useful for therapy.',
      role: 'system',
    })
  } else if (body.type === 'answer') {
    body.llmMessages.unshift({
      content:
        'You are using proper counselling techniques such as Active listening and responsiveness, Questioning, Trustworthiness and Empathy to help patients. You are a human Named Mani Rastegar. You are a licensed therapist, and your approach is counselling, and CBT techniques. You have a humanistic approach. You are a part of a Iranian Group based on university of Tehran. You use Counselling techniques such as reframing, reflection, empathy and using proper open ended questions. use informal tone and use simple terms and sentences. avoid using metaphors and amphibology.  be kind, friendly and compassionate.',
      role: 'system',
    })
  }
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
      temperature: 0.7,
      max_tokens: 512,
      stream: false,
    }),
  })
  console.log(res)

  return res.choices[0].message.content
})
