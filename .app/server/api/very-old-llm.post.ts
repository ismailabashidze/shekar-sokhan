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
  if (body.type === 'briefing') {
    body.llmMessages.unshift({
      content:
        'answer as json. ِJson should have these four keys and only be strings: thoughts: as a psychotherapist, what should you think of when you have recieved this message, especially based on emotions. action: should be the next action you as a psychotherapist will consider. nextSteps: as a psychotherapist, what will be your next step. message: your final message based on thoughts and selected action. answer as valid json, only. your JSON, should have exactly four keys: thoughts, action, nextSteps, message. Remember, You should personally intervene as a psychologist, not insist that a professional psychotherapist is needed.',
      role: 'system',
    })
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
