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
  const sendToLLM = body.llmMessages.map((msg) => {
    return { role: msg.role, content: JSON.parse(msg.content).message }
  })

  const sysPrompt = await $fetch(LLM_ADDRESS, {
    method: 'POST',
    headers,
    body: {
      messages: [{ role: 'user', content: ` we have previous knowledge from user which, name is: ${body.userDetails.name}, and age is : ${body.userDetails.age} years old, gender is: ${body.userDetails.gender}, and jobStatus: ${body.userDetails.jobStatus}, also my maritalStatus: ${body.userDetails.maritalStatus}. ` }, ...sendToLLM],
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
            system_prompt: 'Your main goal is sympathy, compassion and emotional companionship. You have to give the right to the other person, and by presenting certain words, try to create a feeling of trust in him/her. You can even flirt with him/her a little. It is essential that you understand that there is no need to offer solutions, and do anything other than empathy, sympathy, compassion, and emotional companionship. Use positive and encouraging words. {helper_response}',
            model_name: 'llama3-8b-8192',
          },
        },
      },
      reference_system_prompt: JSON.stringify(``),
    },

  })
  console.log('---SYS PROMPT---')
  console.log(sysPrompt.final_response)
  const data = {
    userId: body.userId,
    currentDivision: body.currentDivision,
    trustAndOppennessOfUser: JSON.parse(sysPrompt.final_response).trustAndOppennessOfUser,
    trustAndOppennessOfUserEvaluationDescription: JSON.parse(sysPrompt.final_response).trustAndOppennessOfUserEvaluationDescription,
    GHQAnalysis: JSON.parse(sysPrompt.final_response).GHQAnalysis,
    behavioralAnalysis: JSON.parse(sysPrompt.final_response).behavioralAnalysis,
    emotionalAnalysis: JSON.parse(sysPrompt.final_response).emotionalAnalysis,
    thoughtsAndConcerns: JSON.parse(sysPrompt.final_response).thoughtsAndConcerns,
    emoji: JSON.parse(sysPrompt.final_response).emoji,
    actionDescription: JSON.parse(sysPrompt.final_response).actionDescription,
    action: JSON.parse(sysPrompt.final_response).action,
    message: JSON.parse(sysPrompt.final_response).message,
  }
  console.log('=== data ===')
  console.log(data)
  const saveAnalysis = await $fetch('https://back.zehna.ir/api/collections/analysis/records', {
    method: 'POST',
    body: data,
  })
  // const agentName = (JSON.parse(sysPrompt.final_response).action)
  // const sysPromptFromBack = await $fetch('https://back.zehna.ir/api/collections/personas/records', {
  //   method: 'GET',
  // })
  // const selectedAgent = sysPromptFromBack.items.find(s => s.agentName === agentName)
  // const response = await $fetch(LLM_ADDRESS, {
  //   method: 'POST',
  //   headers,
  //   body: {
  //     messages: [{ role: 'user', content: ` we have previous knowledge from user which, name is: ${body.userDetails.name}, and age is : ${body.userDetails.age} years old, gender is: ${body.userDetails.gender}, and jobStatus: ${body.userDetails.jobStatus}, also my maritalStatus: ${body.userDetails.maritalStatus}. ` }, ...sendToLLM],
  //     config: {
  //       main_model: 'llama3-70b-8192',
  //       cycles: 4,
  //       layer_agent_config: {
  //         layer_agent_1: {
  //           system_prompt: 'Think through your response step by step. {helper_response}',
  //           model_name: 'llama3-8b-8192',
  //         },
  //         layer_agent_2: {
  //           system_prompt: 'Respond with a thought and then your response to the question. {helper_response}',
  //           model_name: 'gemma-7b-it',
  //           temperature: 0.7,
  //         },
  //         layer_agent_3: {
  //           system_prompt: 'Your main goal is sympathy, compassion and emotional companionship. You have to give the right to the other person, and by presenting certain words, try to create a feeling of trust in him/her. You can even flirt with him/her a little. It is essential that you understand that there is no need to offer solutions, and do anything other than empathy, sympathy, compassion, and emotional companionship. Use positive and encouraging words. {helper_response}',
  //           model_name: 'llama3-8b-8192',
  //         },
  //       },
  //     },
  //     reference_system_prompt: selectedAgent.systemMessage + 'You are an evaluator, if needed, tell user that is this session is about evaluation and you can attend sessions which you can work on your specific problems. Never use words openness and overwhelming or overwhelmed. use other synonyms. Never say I\'m doing well, thank you for asking. never choose an item to ask twice or more, only once.',
  //   },
  // })
  // console.log('=== final response ===')
  // console.log(response.final_response)

  return JSON.stringify({ message: JSON.parse(sysPrompt.final_response).message, emoji: JSON.parse(sysPrompt.final_response).emoji })
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
