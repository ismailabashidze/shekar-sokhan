const LLM_ADDRESS = 'http://127.0.0.1:8000/query'
// const LLM_ADDRESS = 'http://193.163.201.12:8000/query'
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
      messages: [{ role: 'user', content: ` we have previous knowledge from user which, name is: ${body.userDetails.name}, and age is : ${body.userDetails.age} years old, gender is: ${body.userDetails.gender}, and jobStatus: ${body.userDetails.jobStatus}, also my maritalStatus: ${body.userDetails.maritalStatus}. ` }, { role: 'assistant', content: `Hi there, I'm mana! I'd be happy to be with you as a companion to assess your mood and problems. Let's begin my friend. To start, can you tell me a little bit about yourself and what brings you to therapy at this time? Please share your thoughts and feelings openly and honestly. What's been going on in your life that's led you to seek help?`,
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
            system_prompt: 'Your main goal is to evaluate, analyze and diagnose the context and psychological patterns in various systems like CBT format, Schema therapy and other systems.',
            model_name: 'llama3-8b-8192',
          },
        },
      },
      reference_system_prompt: `"You are given a text conversation between a user and a psychologist assistant. Here you will provide with the actual conversation between user and evaluator, and also information gathered along the way of the conversation. There I want you to arrange the data in a good shape for the report which is been built by your information. Answer as json : \"headlines\": a exactly four objects inside an array, which every one has a title and a short description, each indicating the most vital and important information about the user and mental health status of user. \"shortSummary\": about a paragraph, a summary of the conversation. \"SCL-90-Analysis\": brief analysis based on the information provided, for every factor of the SCL-90 questionaire. \"evaluatedTrustOfUser\": the level of trust user showed inside the conversation, which values are : VERYLOW,LOW,MEDIUM,HIGH,VERYHIGH. \"demographicData\": an object consisting of keys: name, lastname, jobTitle, location, anyOtherInfo (which if the data is not present, put an empty string instead). \"sessionGoals\": an array of strings which lists the goals of the session which has been reached.  . Responses from models: {responses}"`,
    },

  })
  console.log('---SYS PROMPT---')
  console.log(sysPrompt.final_response)

  const data = {
    user: body.userId,
    analysis: JSON.parse(sysPrompt.final_response).analysis,
    headlines: JSON.parse(sysPrompt.final_response).headlines,
    status: JSON.parse(sysPrompt.final_response).status,
    selectedFactorToWorkOn: JSON.parse(sysPrompt.final_response).selectedFactorToWorkOn,
    selectedFactorToWorkOnDescription: JSON.parse(sysPrompt.final_response).selectedFactorToWorkOnDescription,
    fishyMessages: [], // todo: convert these messages to ids
    thoughtsAndConcerns: JSON.parse(sysPrompt.final_response).thoughtsAndConcerns,
    // lastMessage: body.lastMessageId ?? '',
  }
  console.log('=== data ===')
  console.log(data)
  const saveAnalysis = await $fetch('https://back.zehna.ir/api/collections/analysis/records', {
    method: 'POST',
    body: data,
  })
  const agentName = ('SCL-90-' + JSON.parse(sysPrompt.final_response).selectedFactorToWorkOn)
  const sysPromptFromBack = await $fetch('https://back.zehna.ir/api/collections/personas/records', {
    method: 'GET',
  })
  const selectedAgent = sysPromptFromBack.items.find(s => s.agentName === agentName)
  const response = await $fetch(LLM_ADDRESS, {
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
      reference_system_prompt: selectedAgent.systemMessage + 'You are an evaluator, if needed, tell user that is this session is about evaluation and you can attend sessions which you can work on your specific problems.\nNever use words openness and overwhelming. use other synonyms.',
    },
  })
  console.log('=== final response ===')
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
