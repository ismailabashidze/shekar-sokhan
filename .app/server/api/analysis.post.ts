const LLM_ADDRESS = 'http://localhost:8000/query';
// const LLM_ADDRESS = 'http://193.163.201.12:8000/query'

export type LLMMessage = {
  role: 'system' | 'assistant' | 'user';
  content: string;
};

async function fetchLLM(body: any) {
  setTimeout(async () => {
    const headers = {
      'Content-Type': 'application/json',
    };
    const userDetails = `DETAILS => we have previous knowledge from user which, name is: ${body.userDetails.name}, and age is : ${body.userDetails.age} years old, gender is: ${body.userDetails.gender}, and jobStatus: ${body.userDetails.jobStatus}, also my maritalStatus: ${body.userDetails.maritalStatus}. `;
    const sysPrompt = await $fetch(LLM_ADDRESS, {
      method: 'POST',
      headers,
      body: {
        messages: [{ role: 'user', content: userDetails }, ...body.llmMessages],
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
              system_prompt:
                'Your main goal is sympathy, compassion and emotional companionship. You have to give the right to the other person, and by presenting certain words, try to create a feeling of trust in him/her. You can even flirt with him/her a little. It is essential that you understand that there is no need to offer solutions, and do anything other than empathy, sympathy, compassion, and emotional companionship. Use positive and encouraging words. {helper_response}',
              model_name: 'llama3-8b-8192',
            },
          },
        },
        reference_system_prompt:
          JSON.stringify(`You are given a chat between a user, which details are in first message, and an evaluater, and psychologist AI, named Mana. Your goal is to generate a report based on the conversation, and analysis which has been made and added to the conversation.

you should answer only as JSON. You have to return only json response, nothing else. your json should have these keys:
"summaryOfSession": type is string. about a paragraph, you have to summary the conversation between user and Mana. You have to summary the main conversation, and not analysis.
"headlines": type is array of objects with exact 4 objects and each object should contain exactly two keys: "title", "description". Headlines should contain important informations of the session. should be formed in 4 objects, and each object should have exact 2 keys of "title" and "description". 
"psychotherapistEvaluation": type is string. about a paragraph, evaluate the psychotherapist responses. how well could psychotherapist handle the conversation? How much trust can it make for the user in the first session? Does it ask good and relative questions?
"psychotherapistEvaluationScore": type is number. a number between 0 to 5, for the psychotherapist. 0 is the worst, 5 is the best.
"psychotherapistEvaluationScoreDescription": type is string. information provided about the numeral score for the therapist, and reasons.

"finalTrustAndOppennessOfUser": type is string. indicates the status of overall user trust and openness in the whole conversation. One of exact values of ["veryLow", "low", "high", "veryHigh", "N/A"] (note that there is no medium level) 
"finalTrustAndOppennessOfUserEvaluationDescription": type is string. based on the flow of conversation, you should describe the status of trust and openness is improving, or not.

"DemographicData": type is object. based on the conversation, extract all demographic data and form a json object from them.
"behavioralAnalysisSummary": type is string. based on the lists of behavioralAnalysis, a summary about behavoiral aspects of user in chat.
"emotionalAnalysisSummary": type is string. based on the lists of emotionalAnalysis, a summary about emotional aspects of user in chat.
"thoughtsAndConcernsSummary": type is string. a summary about all of thoughts and concerns for the user.

"GHQCoverageDepression": type is number. Inside conversation, how many questions of the questions related to the depression of the GHQ has been asked? Questions are:
[
  "Have you recently been thinking of yourself as a worthless person?",
  "Have you recently felt that life is entirely hopeless?",
  "Have you recently felt that life isn’t worth living?",
  "Have you recently thought of the possibility that you might make away with yourself?",
  "Have you recently found at times you couldn’t do anything because your nerves were too bad?",
  "Have you recently found yourself wishing you were dead and away from it all?",
  "Have you recently found that the idea of taking your own life kept coming into your mind?"
]
"GHQCoverageSocialDysfunction": type is number. Inside conversation, how many questions of the questions related to the Social Dysfunction of the GHQ has been asked? Questions are:
[
  "Have you recently been able to concentrate on whatever you are doing?",
  "Have you recently felt that you are playing a useful part in things?",
  "Have you recently felt capable of making decisions about things?",
  "Have you recently been able to enjoy your normal day-to-day activities?",
  "Have you recently been able to face up to problems?",
  "Have you recently been feeling reasonably happy, all things considered?",
  "Have you recently felt that you are not doing anything useful?"
]
"GHQCoverageAnxiety": type is number. Inside conversation, how many questions of the questions related to the Anxiety of the GHQ has been asked? Questions are:
[
  "Have you recently lost much sleep over worry?",
  "Have you recently had difficulty in staying asleep once you are off?",
  "Have you recently felt constantly under strain?",
  "Have you recently been getting edgy and bad-tempered?",
  "Have you recently been feeling nervous and strung-up all the time?",
  "Have you recently been managing to keep yourself busy and occupied?",
  "Have you recently been getting scared or panicky for no good reason?"
]
"GHQCoverageSomaticSymptoms": type is number. Inside conversation, how many questions of the questions related to the Somatic Symptoms of the GHQ has been asked? Questions are:
[
  "Have you recently been feeling perfectly well and in good health?",
  "Have you recently been feeling in need of a good tonic?",
  "Have you recently been feeling run down?",
  "Have you recently felt that you are ill?",
  "Have you recently been getting any pains in your head?",
  "Have you recently been getting a feeling of tightness or pressure in your head?",
  "Have you recently been having hot or cold spells?"
]
"GHQFinalReport": type is string. based on the analysis and chat, provide a paragraph about the status of mental health issues based on GHQ. use information with high and veryHigh values of confidenceLevel.

"psychoAnalysis": type is string. based on the information, build up a report in about a paragraph with psycho analysis approach. 
"defenceMechanisms": type is string. based on the information, build up a report in about a paragraph with analysis of defence mechanisms used in the conversation. 
"schemas": type is string. based on the information, if it is possible, list schemas user might have.

"solutions": type is string. based on the information, list of possible solutions with descriptions which can be given to the user.
"planForNextSession": type is string. based on the information, provide a plan for psychotherapist for the next session.

Never use words openness and overwhelming or overwhelmed. use other synonyms.
Use simple and understandable grammer and vocabulary. Please limit sentence structure to the subject-verb-object (SVO) pattern and avoid using other types of sentences such as inverted or complex structures. Please ensure that sentences follow a simple and direct structure, avoiding complex or indirect forms. This will help maintain clarity and ease of understanding.
final answer should be a valid JSON. Never say "Here is the JSON response," just return a valid JSON response. Try not to repeat same sentences in your new messages. Responses from models: {responses}`),
      },
    });
    console.log('---SYS PROMPT---');
    console.log(sysPrompt.final_response);
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
    // console.log('=== data ===')
    // console.log(data)
    // const saveAnalysis = await $fetch('https://pocket.zehna.ir/api/collections/analysis/records', {
    // method: 'POST',
    // body: data,
    // })
    return sysPrompt.final_response;
    // if (isValidJSON(response.final_response).valid) {
    //   if (checkJSONStructure(JSON.parse(response.final_response), ['choosenFactor', 'questionNumbers', 'analysis', 'message', 'estimate']))
    //     return response.final_response
    // }
    // else {
    //   console.log('here')
    //   await fetchLLM(body)
    // }
  }, 0);
  return { message: 'Success', status: 200 };
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  return await fetchLLM(body);
});
