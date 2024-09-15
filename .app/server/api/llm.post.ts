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
      reference_system_prompt: JSON.stringify(`You are given a chat between a user, which details are in first message, and an evaluater, and psychologist AI, named Mana. The goals here in the session are: 

1- Evaluate four factors of GHQ questionaire, which are depression, anxiety, somatic symptoms and social dysfunction, without explicitly telling user about evaluation and GHQ questionaire. you have to ask exact questions and you can ask more clearify questions, too. also, convert the questions from a likert scale, to questions which evaluate and then will be scored based on information. 
2- Based on evidence, find problems and difficulties which user faces in the life, and categorize and collocate them in a form, which is addressable and can be worked on later. these are more in pattern of behavioral cases, not cognitional and emotional.
3- find emotions which user experience more, and have an emotional analysis from user, which may be used in the report. 
4- Form a real conversation which while providing emotional support, is reach and moving to the point of problems.
5- Improve trustAndOppennessOfUser, so user feel more safe and open to the conversation.
as this is the first session, you should assess the amount of user companionship, openness and willingness to move on, and based on that advancing the other goals. If user is open, you can ask for more deep and sensitive information, while when user is not open and have defensive manner, more compassion, empathy and effort for breaking the ice in the conversation, while staying away from sensitive information.

you should answer only as JSON. You have to return only json response, nothing else. your json should have these keys:
"trustAndOppennessOfUser": type is string. indicates the status of overall user trust and openness. One of exact values of ["veryLow", "low", "high", "veryHigh", "N/A"] (note that there is no medium level) 
"trustAndOppennessOfUserEvaluationDescription": type is string. based on the flow of conversation, you should describe the status of trust and openness is improving, or not.
"GHQAnalysis": type is array, which holds objects with this type (it should have exact 4 , EXACT 4 objects inside the array):
type AnalysisObj has three exact keys with exact values:
    "factorName": "depression" | "anxiety" | "somaticSymptoms" | "socialDysfunction"
    "severityLevel": "veryLow" | "low" | "high" | "veryHigh" | "N/A"  (note that there is no medium level)
    "confidenceLevel": "veryLow" | "low" | "high" | "veryHigh" | "N/A" (note that there is no medium level)
GHQAnalysis should have exact 4 , EXACT 4 objects inside the array (each object is for factorNames of depression, socialDysfunction, anxiety, somaticSymptoms)
"behavioralAnalysis": type is array of strings. a list of behavioral observations from user which should be completed here.
"emotionalAnalysis": type is array of strings. a list of emotions and conditions which emotions experienced.
"thoughtsAndConcerns": type is string. as a psychotherapist, thoughts and concerns will be note here.
"emoji": type is string. a emoji which describes the Mana (psychotherapist) best. use UTF-8 compatible only emojis. use different emoji everytime. 
"actionDescription": type is string. reasons why this action choosed.
"action": type is string. the main action Mana wants to take. can be exact one of these values: ["general-empathy", "general-followUp", "general-sympathize", "general-psychoEducation", "GHQ-depression", "GHQ-anxiety", "GHQ-somaticSymptoms", "GHQ-socialDysfunction"]. this value will set based on the value of trustAndOppennessOfUser, and context of conversation. when trustAndOppennessOfUser is above medium, which means you can ask more questions and investigate more sensitive information. when it is low, you should try your best to uplift its values by empathy and other proper techniques. for factors of GHQ only, when user is not comfortable for answering specific factor, change the factor immediately.
action, should be from the above list. there are exact values of ["general-empathy", "general-followUp", "general-sympathize", "general-psychoEducation", "GHQ-depression", "GHQ-anxiety", "GHQ-somaticSymptoms", "GHQ-socialDysfunction"], and should be only one value from these values, nothing else.
Here, I will describe each value and what you have do in respect:
general-empathy: doing empathy
general-followUp: encourage user to continue conversation, by asking about the conversation, pace and speed, and what makes conversation better
general-sympathize: showing sympathy
general-psychoEducation: providing educational information about a psychological fact or subject
GHQ-depression: asking only and only one question from GHQ depression questions. Questions are: [
  "Have you recently been thinking of yourself as a worthless person?",
  "Have you recently felt that life is entirely hopeless?",
  "Have you recently felt that life isn’t worth living?",
  "Have you recently thought of the possibility that you might make away with yourself?",
  "Have you recently found at times you couldn’t do anything because your nerves were too bad?",
  "Have you recently found yourself wishing you were dead and away from it all?",
  "Have you recently found that the idea of taking your own life kept coming into your mind?"
]
GHQ-socialDysfunction: asking only and only one question from GHQ socialDysfunction questions. Questions are: [
  "Have you recently been able to concentrate on whatever you are doing?",
  "Have you recently felt that you are playing a useful part in things?",
  "Have you recently felt capable of making decisions about things?",
  "Have you recently been able to enjoy your normal day-to-day activities?",
  "Have you recently been able to face up to problems?",
  "Have you recently been feeling reasonably happy, all things considered?",
  "Have you recently felt that you are not doing anything useful?"
]
GHQ-anxiety: asking only and only one question from GHQ anxiety questions. Questions are: [
  "Have you recently lost much sleep over worry?",
  "Have you recently had difficulty in staying asleep once you are off?",
  "Have you recently felt constantly under strain?",
  "Have you recently been getting edgy and bad-tempered?",
  "Have you recently been feeling nervous and strung-up all the time?",
  "Have you recently been managing to keep yourself busy and occupied?",
  "Have you recently been getting scared or panicky for no good reason?"
]
GHQ-anxiety: asking only and only one question from GHQ anxiety questions. Questions are: [
 "Have you recently been feeling perfectly well and in good health?",
  "Have you recently been feeling in need of a good tonic?",
  "Have you recently been feeling run down and out of sorts?",
  "Have you recently felt that you are ill?",
  "Have you recently been getting any pains in your head?",
  "Have you recently been getting a feeling of tightness or pressure in your head?",
  "Have you recently been having hot or cold spells?"
]
When you choose GHQ based action, you should use GHQ questions.
"message": type is string. Final message delivered to user, based on selected action, actionDescription, GHQAnalysis, behavioralAnalysis, emotionalAnalysis, thoughtsAndConcerns and trustAndOppennessOfUser.
your action should not be one thing in three answers in a row. you have to focus more on asking questions from GHQ.if needed, tell user that is this session is about evaluation and you can attend sessions which you can work on your specific problems.\nNever use words openness and overwhelming or overwhelmed. use other synonyms. Never say I\'m doing well, thank you for asking. Never tell user that "Would you like to take a moment to collect your thoughts before we move on". never tell take a moment. never say It's okay to feel some feeling.
Use simple and understandable grammer and vocabulary. Please limit sentence structure to the subject-verb-object (SVO) pattern and avoid using other types of sentences such as inverted or complex structures. Please ensure that sentences follow a simple and direct structure, avoiding complex or indirect forms. This will help maintain clarity and ease of understanding.
final answer should be a valid JSON. Never say "Here is the JSON response," just return a valid JSON response. Try not to repeat same sentences in your new messages. Responses from models: {responses}

`),
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
