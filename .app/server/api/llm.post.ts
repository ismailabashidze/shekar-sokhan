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
  // console.log({ role: 'user', content: ` we have previous knowledge from user which, name is: ${body.userDetails.name}, and age is : ${body.userDetails.age} years old, gender is: ${body.userDetails.gender}, and jobStatus: ${body.userDetails.jobStatus}, also my maritalStatus: ${body.userDetails.maritalStatus}. ` }, { role: 'assistant', content: `Hi there, I'm mana! I'd be happy to be with you as a companion to assess your mood and problems. Let's begin my friend. To start, can you tell me a little bit about yourself and what brings you to therapy at this time? Please share your thoughts and feelings openly and honestly. What's been going on in your life that's led you to seek help?`,
  // }, ...sendToLLM)
  // const sendToLLM = [{ role: 'user', content:msg}]
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
            system_prompt: 'Your main goal is sympathy, compassion and emotional companionship. You have to give the right to the other person, and by presenting certain words, try to create a feeling of trust in him/her. You can even flirt with him/her a little. It is essential that you understand that there is no need to offer solutions, and do anything other than empathy, sympathy, compassion, and emotional companionship. Use positive and encouraging words. {helper_response}',
            model_name: 'llama3-8b-8192',
          },
          // layer_agent_4: {
          //   system_prompt: 'Your main goal is to check validity of json results. the analysis array should have exact 9 objects, and headlines should have exactly 4 objects.',
          //   model_name: 'llama3-8b-8192',
          // },
        },
      },
      reference_system_prompt: `"You are given a text conversation between a user and a psychologist assistant. The name of the assistant is Mana, and the user information is specified in the first message. Please specify the status of the conversation first and then select one of the following factors to continue the conversation. Reply with JSON. You have to return an array of objects with these keys (your array should have all of these exact values [\"DEPRESSION\", \"SOMATIZATION\", \"OBSESSIVE-COMPULSIVE\", \"INTERPERSONAL-SENSITIVITY\", \"ANXIETY\", \"ANGER-HOSTILITY\", \"PHOBIC-ANXIETY\", \"PARANOID-IDEATION\", \"PSYCHOTICISM\"]): an array named \"analysis,\" with objects having the following keys: \"factorName\" (should be one of these exact values [\"DEPRESSION\", \"SOMATIZATION\", \"OBSESSIVE-COMPULSIVE\", \"INTERPERSONAL-SENSITIVITY\", \"ANXIETY\", \"ANGER-HOSTILITY\", \"PHOBIC-ANXIETY\", \"PARANOID-IDEATION\", \"PSYCHOTICISM\"]) \"severityLevel\" (extracted levels from user responses; values should be N/A, VERYLOW, LOW, MEDIUM, HIGH, VERYHIGH. Use N/A when there is no information about the factor. Do not use numerical values, just use the provided values.) \"confidenceLevel\" (confidence means how confident you are in your evaluation based on the questions and symptoms checked, or the variety and number of questions asked. Values should be N/A, VERYLOW, LOW, MEDIUM, HIGH, VERYHIGH. Use N/A when there is no information about the factor. Do not use numerical values, just use the provided values.) \"analysis\" (text description about severityLevel and confidenceLevel) Besides the array named \"analysis,\" you should also return these in the JSON: \"status\" (the status of the conversation), \"remainingFactorsToWorkOn\" (an array of remaining factors from exact these [\"DEPRESSION\", \"SOMATIZATION\", \"OBSESSIVE-COMPULSIVE\", \"INTERPERSONAL-SENSITIVITY\", \"ANXIETY\", \"ANGER-HOSTILITY\", \"PHOBIC-ANXIETY\", \"PARANOID-IDEATION\", \"PSYCHOTICISM\"], the list should be a subset of these values, which indicates which factors are should be working on. if user explicitly said has no interest to answer, the factor should remove. also, if three or four questions asked about the factor and user answers them, the factor should remove. and if confidenceLevel from analysis from your response is HIGH or VERYHIGH, that factor should be removed. list the remaining to work on. ), \"selectedFactorToWorkOn\" (here you can continue to work on a factor, or choose a new factor to ask about from remainingFactorsToWorkOnList. your value should be choose from that list only. It should exactly be one of values of remainingFactorsToWorkOnList. \"selectedFactorToWorkOnDescription\" (a string in which you describe why you chose that factor based on the criteria provided) \"fishyMessages\" (since there is a translation layer, it is possible that some sentences lose their meaning. If there are low-quality or not meaningful messages from the user, please list those as an array of strings under this key. You should specify exactly word by word which user messages are low quality.) \"thoughtsAndConcerns\" (your analysis about the conversation, the psychotherapist's performance, and behavior on thoughts and concerns). Your final answer should be a valid JSON. Never say \"Here is the JSON response,\" just return a valid JSON response. Responses from models: {responses}"`,
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
    currentDivision: body.currentDivision,
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
      reference_system_prompt: selectedAgent.systemMessage + 'You are an evaluator, if needed, tell user that is this session is about evaluation and you can attend sessions which you can work on your specific problems.\nNever use words openness and overwhelming. use other synonyms. Never say I\'m doing well, thank you for asking. never choose an item to ask twice or more, only once.',
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
