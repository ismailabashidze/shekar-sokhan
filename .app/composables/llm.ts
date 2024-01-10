export function useLLM() {
  // const LLM_ADDRESS = 'http://localhost:1234/v1/chat/completions'
  const LLM_ADDRESS = 'https://rnwua-185-237-14-67.a.free.pinggy.online'
  // https://rnwua-185-237-14-67.a.free.pinggy.online
  const answer = ref()
  const ask = async (systemMsg: string, question: string) => {
    const res = await useFetch(LLM_ADDRESS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: systemMsg },
          { role: 'user', content: question },
        ],
        temperature: 0.7,
        max_tokens: -1,
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
