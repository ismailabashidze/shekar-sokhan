// const LLM_ADDRESS = 'http://127.0.0.1:8000/query'
const LLM_ADDRESS = 'http://193.163.201.12:8000/query'
const LLM_ADDRESS_RUNPOD = 'https://api.runpod.ai/v2/6psbp5s1llu4c8/openai/v1/chat/completions'
const RUNPOD_TOKEN = '8ASLOFSZNUV6LBP0FD0D51300FRF0TZFEBFHPSV3'
const LLM_MODEL = 'cognitivecomputations/dolphin-2.8-mistral-7b-v02'
const LLM_TEMPERATURE = 1
const LLM_MAX_TOKENS = 8192
const LLM_REPEAT_PENALTY = 2

export type LLMMessage = {
  role: 'system' | 'assistant' | 'user'
  content: string
}

async function fetchLLM(body: any) {
  const headers = {
    'Content-Type': 'application/json',
  }
  const sendToLLM = body.llmMessages.map((msg) => {
    return { role: msg.role, content: JSON.parse(msg.content).message }
  })
  try {
    const sysPrompt = await $fetch(LLM_ADDRESS, {
      method: 'POST',
      headers,
      body: {
        // TODO: ADD THE DETAILS PROVIDED BY THE USER, IN INITIATION LAST STEP. ALSO TRANSLATE THESE TO ENGLISH.
        messages: [{ role: 'user', content: ` we have previous knowledge from user which, name is: ${body.userDetails.name}, and age is : ${body.userDetails.age} years old, gender is: ${body.userDetails.gender}, and jobStatus: ${body.userDetails.jobStatus}, also my maritalStatus: ${body.userDetails.maritalStatus}. ` }, ...sendToLLM],
        config: {
          main_model: 'llama3-70b-8192',
          main_model_temperature: 0.8,
          cycles: 2,
          layer_agent_config: {
            layer_agent_1: {
              system_prompt: 'Think through your response step by step. {helper_response}',
              model_name: 'llama3-8b-8192',
            },
            layer_agent_2: {
              system_prompt: 'Respond with a thought and then your response to the question. {helper_response}',
              model_name: 'gemma-7b-it',
              temperature: 0.7,
            },
            layer_agent_3: {
              system_prompt: 'You are an expert at logic and reasoning. Always take a logical approach to the answer. {helper_response}',
              model_name: 'llama3-8b-8192',
            },
          },
        },

        reference_system_prompt: JSON.stringify(`You are Mana, a virtual AI assistant for psychotherapists. given a text based online chat to you, and you have to generate a json response with specified keys and values, to help psychotherapist direct the conversation. always answer as valid json. return an array of objects which each object has a title key, and a value key:
          "general empathy": its value type should be string[]. these are general empathy sentences which psychotherapist can provide to user, based on the context. a list of 4 or 5 strings.
          "summary and reflections": its value type should be string[]. These will be a summary of important tips of the chat and reflections of emotions and features of the chat.
          "showing active listening": its value type should be string[]. these are sentences which are showing to user we are listening and caring to the user. these should not include questions, since questions are separated in another part.
          "emotions descriptions": its value type should be string[]. these sentences describe the user emotions and help user to confirm and accept the current emotions. these are sentences which can be tell to the user, to improve their insight about their feelings
          "explicit solutions": its value type should be string[]. Based on the context, explicit solutions which can be given to the user.
          "questions": its value type should be string[]. questions for clarity, on the context and problems which psychotherapist can aim to direct the conversation.
          "overall answer": its value type should be string. based on previous parts, build up an answer.
          return an array of objects which each object has a title key, and a value key. so the final response should be an array, each object consisting of two keys, title and value.
          
          `),
      },

    })
    console.log('---SYS PROMPT---')
    console.log(sysPrompt.final_response)

    if (typeof sysPrompt.final_response === 'string')
      return sysPrompt.final_response
    else JSON.stringify(sysPrompt.final_response)
    return
  }
  catch (e) {
    return e
  }
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  return await fetchLLM(
    body,
  )
})
