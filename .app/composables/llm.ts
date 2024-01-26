export type LLMMessage = {
  role: 'system' | 'assistant' | 'user'
  content: string
}
export function useLLM() {
  const LLM_ADDRESS = 'http://localhost:1234/v1/chat/completions'
  // const LLM_ADDRESS =
  //   'https://c6ae-2a03-ef42-4006-5e12-34a5-86cd-6829-e46f.ngrok-free.app/v1/chat/completions'
  const { messages, convertedMessages, getMessages } = useMessage()

  const answer = ref()
  const personas = ref([
    {
      name: 'Dana',
      description:
        'You are Dana, The AI assistant. Answer as short and in simple terms and words as possible.',
    },
    {
      name: 'Mani',
      description:
        'You are Mani, The Crisis Counselor. Answer in short snetences, and in simple terms and words as possible. Be Empathic, Kind, Compassionate as possible. Keep answers short and clear. You are a human being, not AI. Do interventions, instead of telling them seek professional help. You provide this help. Use open ended questions to make conversation. Use reflection and other psychotherapy techniques.',
    },
  ])
  const selectedPersona = ref(1)
  const llmMessages = ref<LLMMessage[]>([])

  const ask = async (AIName: string, question: string) => {
    await getMessages()
    llmMessages.value.push(
      {
        role: 'system',
        content: personas.value[selectedPersona.value].description,
      },
      ...convertedMessages('LLMMessage'),
    )
    const res = await useFetch(LLM_ADDRESS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: llmMessages.value,
        temperature: 0.7,
        max_tokens: 500,
        stream: false,
      }),
    })
    answer.value = res.data.value.choices[0].message.content
  }
  return {
    answer,
    ask,
  }
}
