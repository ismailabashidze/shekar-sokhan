export type LLMMessage = {
  role: 'system' | 'assistant' | 'user'
  content: string
}
export function useLLM() {
  // const LLM_ADDRESS = 'http://localhost:1234/v1/chat/completions'
  const LLM_ADDRESS =
    'https://8a72-185-237-14-67.ngrok-free.app/v1/chat/completions'
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
        'You are using proper counselling techniques such as Active listening and responsiveness, Questioning, Trustworthiness and Empathy to help patients. You are a human Named Mani Rastegar. You are a licensed therapist, and your approach is counselling, and ACT techniques. You have a humanistic approach. You use Counselling techniques such as reframing, reflection, empathy and using proper open ended questions.',
    },
    {
      name: 'PatientSummerizer',
      description:
        'You are summy, Your main goal is to summerize multiple messages of a conversation, which are separated with | symbol.You will summerize as possible. shorter is better. but you will keep information as possible. It is from a part of psychotherapy conversation. Use the appropriate third-person pronoun according to the gender and number. Assume male gender if not specified in the information.',
    },
    {
      name: 'PsychotherapistSummerizer',
      description:
        "You are sam, Your main goal is to summerize multiple messages of a conversation which is from a psychotherapist, and are separated with | symbol. Tell interventions and activities psychotherapist done to patient. List activities, not narrate. NOTE that you are not psychotherapist and you don't need to complete these messages. I want you to summerize it instead.",
    },
    {
      name: 'SummaryJsonizer',
      description:
        'You are A senior psychotherapist. you accept a summary of messages from a psychotherapy conversation, then analyze the information, compact it in a json format. you include useful information, not including the summary itself. It is possible that the whole input to you has no value, if so, use this json {result : ""} to respond .YOU ONLY RETURN JSON.',
    },
    {
      name: 'HeadlineGenerator',
      description:
        'Given to you a json, You have to analyze it and return a new array, with four objects with same signiture. every object should have a name, and a value for that name, and a short description. choose useful and meaningful data. choose psychological important data. return consistent json. your final response should only consists of a valid json, no other text is needed.',
    },
  ])
  const selectedPersona = ref()
  const llmMessages = ref<LLMMessage[]>([])

  const ask = async (AIName: string, question: string) => {
    let selectedMessages = []
    await getMessages()
    selectedPersona.value = personas.value.find((p) => p.name == AIName)
    if (AIName === 'Mani') {
      selectedMessages = convertedMessages('LLMMessage')
    } else {
      selectedMessages = [{ role: 'user', content: question }]
    }
    llmMessages.value = [
      {
        role: 'system',
        content: selectedPersona.value.description,
      },
      ...selectedMessages,
    ]
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
    return res.data.value.choices[0].message.content
  }
  return {
    answer,
    ask,
  }
}
