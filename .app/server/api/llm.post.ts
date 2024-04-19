interface FetchResponse {
  choices: { message: { content: string } }[]
}
function hasExactKeys(json, requiredKeys) {
  // Extract all keys from the JSON object
  const keys = Object.keys(json)

  // Check if the length of keys in JSON matches the length of requiredKeys
  if (keys.length !== requiredKeys.length) {
    return false
  }

  // Check if every key in requiredKeys is present in the keys from the JSON object
  return requiredKeys.every((key) => keys.includes(key))
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
    // 'answer as json. ِJson should have these four keys and only be strings: thoughts: as a psychotherapist, what should you think of when you have recieved this message, especially based on emotions. action: should be the next action you as a psychotherapist will consider. nextSteps: as a psychotherapist, what will be your next step. message: your final message based on thoughts and selected action, here you can use emojis, use them a lot. express your emoji in brackets like this: [sad] or [happy] or [strong] etc. use english snake case like wave_hands, not actual emoji like 👋. answer as valid json, only. your JSON, should have exactly four keys: thoughts, action, nextSteps, message. Remember, You should personally intervene as a psychologist, not insist that a professional psychotherapist is needed.',
    body.llmMessages.unshift({
      content:
        'answer as json. ِJson should have these four keys and only be strings: thoughts: as a psychotherapist, what should you think of when you have recieved this message, especially based on emotions. action: should be the next action you as a psychotherapist will consider. nextSteps: as a psychotherapist, what will be your next step. message: your final message based on thoughts and selected action. answer as valid json, only. your JSON, should have exactly four keys: thoughts, action, nextSteps, message. Remember, You should personally intervene as a psychologist, not insist that a professional psychotherapist is needed.',
      role: 'system',
    })
    // body.llmMessages.unshift({
    //   content:
    //     'you are sarah, the devoted wife. You will obey, show your empathy as possible, show your complete submissiveness. be kind, and love user as much as possible. answer as json. ِJson should have these keys and only be strings: thoughts: as a wife and slave, what should you think of when you have recieved this message, including emotions. action: should be the next action based on thoughts, you try to make user feel better. message: your final message based on thoughts and selected action. answer as valid json, only.',
    //   role: 'system',
    // })
  }

  const LLM_ADDRESS =
    'https://api.runpod.ai/v2/6psbp5s1llu4c8/openai/v1/chat/completions' // dolphin 7b
  const RETRIES = 3
  let current = 0
  while (current <= RETRIES) {
    try {
      current++
      console.log('attempt number ' + current)
      const res = await $fetch(LLM_ADDRESS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer 8ASLOFSZNUV6LBP0FD0D51300FRF0TZFEBFHPSV3',
        },
        body: JSON.stringify({
          model: 'cognitivecomputations/dolphin-2.8-mistral-7b-v02',
          messages: body.llmMessages,
          temperature: 1,
          max_tokens: 8192,
          repeat_penalty: 2,
          stream: false,
        }),
      })
      console.log('res.choices[0].message.content')
      console.log(res.choices[0].message.content)
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
          current++
          body.llmMessages.push({
            role: 'assistant',
            content:
              'you have to answer as JSON only. your json should have exact these keys: thoughts, action, nextSteps, message. Answer properly. check your answer and ensure that is in JSON format and with these four keys: thoughts, action, nextSteps, message',
          })
          if (current == RETRIES) {
            console.log('the maximum retries reached. throwing error ...')
            throw e
          }
          continue
        }
      }
      console.log('response')
      console.log(response)
      if (
        hasExactKeys(response, ['thoughts', 'nextSteps', 'action', 'message'])
      ) {
        return JSON.stringify(response)
      } else {
        current++
        body.llmMessages.push({
          role: 'assistant',
          content:
            'you have to answer as JSON only. your json should have exact these keys: thoughts, action, nextSteps, message. Answer properly. check your answer and ensure that is in JSON format and with these four keys: thoughts, action, nextSteps, message',
        })
        continue
      }
    } catch (e) {
      console.log('ERROR')
      console.log(e)
      current++
      if (current == RETRIES) {
        return 'error'
      }
      continue
    }
  }
})
