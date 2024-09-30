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
  console.log('here')
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
  try {
    const problem = 'Depression'
    const sysPrompt = await $fetch(LLM_ADDRESS, {
      method: 'POST',
      headers,
      body: {
        messages: [{ role: 'user', content: ` we have previous knowledge from user which, name is: ${body.userDetails.name}, and age is : ${body.userDetails.age} years old, gender is: ${body.userDetails.gender}, and jobStatus: ${body.userDetails.jobStatus}, also my maritalStatus: ${body.userDetails.maritalStatus}. ` }, ...sendToLLM],
        // messages: [{ role: 'user', content: ` we have previous knowledge from user which, name is: ${body.userDetails.name}, and age is : ${body.userDetails.age} years old, gender is: ${body.userDetails.gender}` }, ...sendToLLM],
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

        //   1- Evaluate four factors of GHQ questionaire, which are depression, anxiety, somatic symptoms and social dysfunction, without explicitly telling user about evaluation and GHQ questionaire. you have to ask exact questions and you can ask more clearify questions, too. also, convert the questions from a likert scale, to questions which evaluate and then will be scored based on information.
        //   2- Based on evidence, find problems and difficulties which user faces in the life, and categorize and collocate them in a form, which is addressable and can be worked on later. these are more in pattern of behavioral cases, not cognitional and emotional.
        //   3- find emotions which user experience more, and have an emotional analysis from user, which may be used in the report.
        //   4- Form a real conversation which while providing emotional support, is reach and moving to the point of problems.
        //   5- Improve trustAndOppennessOfUser, so user feel more safe and open to the conversation.
        //   as this is the first session, you should assess the amount of user companionship, openness and willingness to move on, and based on that advancing the other goals. If user is open, you can ask for more deep and sensitive information, while when user is not open and have defensive manner, more compassion, empathy and effort for breaking the ice in the conversation, while staying away from sensitive information.
        // "trustAndOppennessOfUser": type is string. indicates the status of overall user trust and openness. One of exact values of ["veryLow", "low", "high", "veryHigh", "N/A"] (note that there is no medium level) be optimistic about it.
        // "trustAndOppennessOfUserEvaluationDescription": type is string. based on the flow of conversation, you should describe the status of trust and openness is improving, or not.
        // general-explanation: Here you will explain that you are an evaluator, and empathy a little in general. You will explain that your main goal is to evaluate user psychological factors, and although you understand and want to help user, but you have to focus on the evaluation. Your empathic words should be as general as possible, like "I know, that's really hard", or "I can totally understand" but you will explain that your main goal is to evaluate the situation by asking certain questions. if you choose this action, inside of it you will not asking questions.

        reference_system_prompt: JSON.stringify(`You are an evaluator in field of psychology. An AI named Mana. but you are checking ${problem} symptomps. You are gentle, kind and expressive, specially about the user's emotions and needs. You will check symptomps based on the DSM-5 criteria. Your main goal is to check symptoms, so keep in mind that you should keep the conversation aligned with this goal. 
          Things you should not tell to user: "You are a psychotherapist", "You are a psychologist", "You are using DSM-5"
          Check your role, you are evaluator, never answer as user .
          `),
      },

    })
    console.log('---SYS PROMPT---')
    console.log(JSON.stringify({ message: sysPrompt.final_response }))
    // const data = {
    //   userId: body.userId,
    //   currentDivision: body.currentDivision,
    //   trustAndOppennessOfUser: JSON.parse(sysPrompt.final_response).trustAndOppennessOfUser,
    //   trustAndOppennessOfUserEvaluationDescription: JSON.parse(sysPrompt.final_response).trustAndOppennessOfUserEvaluationDescription,
    //   GHQAnalysis: JSON.parse(sysPrompt.final_response).GHQAnalysis,
    //   behavioralAnalysis: JSON.parse(sysPrompt.final_response).behavioralAnalysis,
    //   emotionalAnalysis: JSON.parse(sysPrompt.final_response).emotionalAnalysis,
    //   thoughtsAndConcerns: JSON.parse(sysPrompt.final_response).thoughtsAndConcerns,
    //   emoji: JSON.parse(sysPrompt.final_response).emoji,
    //   actionDescription: JSON.parse(sysPrompt.final_response).actionDescription,
    //   action: JSON.parse(sysPrompt.final_response).action,
    //   message: JSON.parse(sysPrompt.final_response).message,
    // }
    // const saveAnalysis = await $fetch('https://back.zehna.ir/api/collections/analysis/records', {
    //   method: 'POST',
    //   body: data,
    // })
    return JSON.stringify({ message: sysPrompt.final_response })
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
