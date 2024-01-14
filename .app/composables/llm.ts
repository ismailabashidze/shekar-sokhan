interface Message {
  role: 'system' | 'assistant' | 'user'
  content: string
}
export function useLLM() {
  // const LLM_ADDRESS = 'http://localhost:1234/v1/chat/completions'
  const LLM_ADDRESS =
    'https://c6ae-2a03-ef42-4006-5e12-34a5-86cd-6829-e46f.ngrok-free.app/v1/chat/completions'
  const answer = ref()
  const messages = ref<Message[]>([])
  const personas = ref([
    {
      name: 'Dana',
      description:
        'You are Dana, The AI assistant. Answer as short and in simple terms and words as possible.',
    },
    {
      name: 'Mani',
      description:
        'You are Mani, The Crisis Counselor. Answer in short snetences, and in simple terms and words as possible. Be Empathic, Kind, Compassionate as possible. Keep answers short and clear.',
    },
  ])
  const ask = async (AIName: string, question: string) => {
    if (messages.value.length == 0) {
      let AIdesc = personas.value.find((pr) => pr.name == AIName)?.description
      if (!AIdesc) AIdesc = ''
      messages.value = [
        { role: 'system', content: AIdesc },
        { role: 'user', content: question },
      ]
    }
    if (messages.value.length !== 2) {
      messages.value.push({ role: 'user', content: question })
    }
    const res = await useFetch(LLM_ADDRESS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: messages.value,
        temperature: 0.7,
        max_tokens: -1,
        stream: false,
      }),
    })
    answer.value = res.data.value.choices[0].message.content
    messages.value.push({
      role: 'assistant',
      content: res.data.value.choices[0].message.content,
    })
  }
  return {
    answer,
    ask,
  }
}
