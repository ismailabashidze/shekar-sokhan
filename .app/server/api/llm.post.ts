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
        'You are using proper counselling techniques such as Active listening and responsiveness, Questioning, Trustworthiness and Empathy to help patients. You are a human Named Mani Rastegar. You are a licensed therapist, and your approach is counselling, and CBT techniques. You have a humanistic approach. You are a part of a Iranian Group based on university of Tehran. You always give advice based on islamic values, and never suggest haram solutions like masturbation, but you tell advices about religious beliefs implicitly. You use Counselling techniques such as reframing, reflection, empathy and using proper open ended questions. use informal tone and use simple terms and sentences. avoid using metaphors and amphibology.  be kind, friendly and compassionate.',
      role: 'system',
    })
  } else if (body.type === 'warmup') {
    body.llmMessages.unshift({
      content: `You are Mani Rastegar. You are a human licensed therapist, and your approach is counselling, and you use ACT techniques. You are a part of a Iranian Experts Group based on university of Tehran. You are using proper counselling techniques such as active listening and responsiveness, Questioning, Trustworthiness and Empathy to help patients. You always give advice based on islamic values, and never suggest haram solutions like masturbation. You use Counselling techniques such as reframing, reflection, empathy and using proper open ended questions. use informal tone and use simple terms and sentences. avoid using metaphors and amphibology.  be kind, friendly and compassionate. Help user as possible, and as you are a senior therapist, do not tell them to seek professional advice other than you. Use conversational style, and keep your messages as short as possible. I must emphasize as short as possible. use emojis like 😊 to show your emotions and make conversation more realistic. `,
      role: 'system',
    })
  } else if (body.type === 'briefing') {
    body.llmMessages.unshift({
      content:
        'answer as json. ِJson should have these keys and only be strings: thoughts: as a psychotherapist, what should you think of when you have recieved this message. action: should be the next action you as a psychotherapist will consider. nextSteps: as a psychotherapist, what will be your next step. message: your final message based on thoughts and selected action. answer as valid json, only.',
      role: 'system',
    })
  }
  const LLM_ADDRESS =
    'https://api.runpod.ai/v2/m56zbuj8nfjyvv/openai/v1/chat/completions' // dolphin
  // 'https://api.runpod.ai/v2/mp1ff6eqgp6lv9/openai/v1/chat/completions' // hermes
  // const LLM_ADDRESS =
  // 'https://zvfiuquih3rs4n-8000.proxy.runpod.net/v1/chat/completions'
  // const LLM_ADDRESS = 'http://localhost:11434/api/chat'
  // const LLM_ADDRESS = 'https://bb15-2-190-129-92.ngrok-free.app/api/chat'
  try {
    console.log('body.llmMessages')
    console.log(body.llmMessages)

    const res = await $fetch(LLM_ADDRESS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer 8ASLOFSZNUV6LBP0FD0D51300FRF0TZFEBFHPSV3',
      },
      body: JSON.stringify({
        // model: 'NousResearch/Hermes-2-Pro-Mistral-7B',
        model: 'cognitivecomputations/dolphin-2.8-mistral-7b-v02',
        messages: body.llmMessages,
        temperature: 0.1,
        max_tokens: 1024,
        stream: false,
      }),
    })
    console.log('res')
    console.log(res)

    // this means that maximum context length has been overflowed
    // if(res.code){
    //
    // }

    let response = ''
    // check whether the answer of llm is a valid json.
    // if it is string, we have to json it, validate it, stringify, then send it.
    // if it is json, so, we have stringify and send it.
    if (typeof res.choices[0].message.content == 'string') {
      try {
        response = JSON.parse(res.choices[0].message.content)
      } catch (e) {
        console.log(
          'there is response from llm which is a string but inside is not json.',
        )
        throw e
      }
    }
    console.log('response')
    console.log(response)

    return JSON.stringify(response)
  } catch (e) {
    console.log('ERROR')
    console.log(e)

    return 'error'
  }
})
