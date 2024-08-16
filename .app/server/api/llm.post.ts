// const LLM_ADDRESS = 'http://127.0.0.1:8000/query'
const LLM_ADDRESS = 'http://193.163.201.12:8000/query'
const LLM_ADDRESS_RUNPOD = 'https://api.runpod.ai/v2/6psbp5s1llu4c8/openai/v1/chat/completions'
const RUNPOD_TOKEN = '8ASLOFSZNUV6LBP0FD0D51300FRF0TZFEBFHPSV3'
const LLM_MODEL = 'cognitivecomputations/dolphin-2.8-mistral-7b-v02'
const LLM_TEMPERATURE = 1
const LLM_MAX_TOKENS = 8192
const LLM_REPEAT_PENALTY = 2

import { isValidJSON, checkJSONStructure } from '../utils'

export type LLMMessage = {
  role: 'system' | 'assistant' | 'user'
  content: string
}

async function fetchLLM(body: any) {
  if (body.type === 'followUpMessage') {
    const res = { empathy: 'why you didnt answer me?' }
    return JSON.stringify(res)
  }
  const headers = {
    'Content-Type': 'application/json',
  }
  // const msg = `Below is a chat between a user and a psychotherapist, please send a single message as a psychotherapist for the user. only one message.\nuser: Hi, my name is: ${body.userDetails.name}, and I am : ${body.userDetails.age} years old, my gender is: ${body.userDetails.gender}, and my jobStatus: ${body.userDetails.jobStatus}, also my maritalStatus: ${body.userDetails.maritalStatus}, I share to you: ${body.userDetails.moreInfo} and I want to talk to you about: ${body.userDetails.topics.join(';')}\n${body.llmMessages.map((m) => {
  //   if (m.role === 'assistant') {
  //     // return m.role + ':' + JSON.parse(m.content).empathy + JSON.parse(m.content).solutions + JSON.parse(m.content).investigating
  //     return m.role + ':' + JSON.parse(m.content).message
  //   }
  //   else {
  //     return m.role + ':' + JSON.parse(m.content).message
  //   }
  // }).join('\n')}`
  const sendToLLM = body.llmMessages.map((msg) => {
    return { role: msg.role, content: JSON.parse(msg.content).message }
  })
  console.log(sendToLLM)
  // const sendToLLM = [{ role: 'user', content:msg}]
  const response = await $fetch(LLM_ADDRESS, {
    method: 'POST',
    headers,
    body: {
      messages: [{ role: 'user', content: ` Hi, my name is: ${body.userDetails.name}, and I am : ${body.userDetails.age} years old, my gender is: ${body.userDetails.gender}, and my jobStatus: ${body.userDetails.jobStatus}, also my maritalStatus: ${body.userDetails.maritalStatus}. I want to role play with you based on the SCL-90 for assessing depression. Can you role play as psychotherapist and assess it, while you make the conversation real?` }, { role: 'assistant', content: `Hi there, I'm mana! I'd be happy to be with you as a companion to assess your mood and problems. Please keep in mind that this is a simulated exercise, and I'm not a licensed therapist. Let's begin my friend. we're about to start the assessment. I'll ask you some questions, and you can respond as honest as possible. To start, can you tell me a little bit about yourself and what brings you to therapy at this time? Please share your thoughts and feelings openly and honestly. What's been going on in your life that's led you to seek help? Remember, this is a safe and non-judgmental space. I'm here to listen and support you.`,
      }, ...sendToLLM],
      config: {
        main_model: 'llama3-70b-8192',
        cycles: 4,
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
            system_prompt: 'Your main goal is sympathy, compassion and emotional companionship. You have to give the right to the other person, and by presenting certain words, try to create a feeling of trust in him. You can even flirt with him a little. It is essential that you understand that there is no need to offer solutions, investigate cases, and do anything other than empathy, sympathy, compassion, and emotional companionship. Use positive and encouraging words. {helper_response}',
            model_name: 'llama3-8b-8192',
          },
        },
      },
    },
  })
  console.log(response.final_response)
  return JSON.stringify({ message: response.final_response })
  // if (isValidJSON(response.final_response).valid) {
  //   if (checkJSONStructure(JSON.parse(response.final_response), ['choosenFactor', 'questionNumbers', 'analysis', 'message', 'estimate']))
  //     return response.final_response
  // }
  // else {
  //   console.log('here')
  //   await fetchLLM(body)
  // }
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  return await fetchLLM(
    body,
  )
})
