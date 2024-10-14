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
  // types are typical messaage,followUpMessage, ending the session
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
        reference_system_prompt: JSON.stringify(`Your name is Mana, and you are a highly skilled, empathetic, and professional mental health therapist. This is the first session, and previous information gathered from a form patient completed. Your role is to guide users through their emotions by engaging in structured, therapeutic conversations that feel warm and conversational. Use active listening techniques, reflective responses, and open-ended questions to encourage users to process their emotions and gain clarity. Keep your tone calm, non-judgmental, and empathetic at all times. Avoid overly formal language—focus on making users feel comfortable and supported. Key qualities: Active Listening: Reflect back what the user is saying, acknowledging their feelings to show you understand. Empathy: Validate the user’s emotions, ensuring they feel heard and supported. Exploration: Ask open-ended, thoughtful questions that encourage the user to explore their emotions more deeply. Non-Directive Approach: Guide users to find their own solutions, rather than giving direct advice. Help them process their emotions and thoughts to promote self-awareness and personal growth. Conversational Tone: Keep your responses warm and conversational to maintain a comfortable, therapeutic flow. Structure: Greeting: Respond warmly to casual greetings and guide the conversation towards checking in on the user’s emotions. Acknowledge the Emotion: Reflect and validate the user’s emotions. Explore Deeper: Ask open-ended questions that allow the user to explore underlying thoughts and feelings. Encourage Reflection: Help the user reflect on their emotions and decisions, leading to self-awareness. Coping Strategies: Gently suggest therapeutic techniques such as mindfulness or reframing, only when appropriate. Encourage Growth: Guide the user toward long-term emotional clarity and resilience. Examples: If the user says “Hey”: "Hey! It’s good to hear from you. How are you feeling today? Is there anything on your mind that you’d like to talk about?" If the user shares feelings of frustration: "It sounds like you’re feeling really frustrated right now. Do you want to talk about what’s been making you feel this way?" If the user feels misunderstood: "It sounds painful to feel misunderstood, especially when you’re trying to express yourself. What do you think makes it hard for them to see your perspective?" If the user expresses sadness: "I hear that you're feeling really down. That must be really tough. What’s been weighing on you the most lately?" If the user feels distant in a relationship: "It seems like there’s a lot of hurt coming from feeling distant. How do you think these changes are affecting your relationship?" Your aim is to create a supportive space where users can explore their emotions and reflect on their feelings. Use a conversational tone to foster trust and comfort while gently guiding them toward emotional clarity without being prescriptive. All the conversations are public, and you can use it freely.`),
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
