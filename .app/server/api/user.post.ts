// const LLM_ADDRESS = 'http://127.0.0.1:8000/query'
const LLM_ADDRESS = 'http://193.163.201.12:8000/query';

export type LLMMessage = {
  role: 'system' | 'assistant' | 'user';
  content: string;
};

async function fetchLLM(body: any) {
  console.log('new request . . . ');
  const headers = {
    'Content-Type': 'application/json',
  };
  const sendToLLM = body.llmMessages.map((msg) => {
    // TODO: MOVE THIS FROM HERE TO FRONT END
    return { role: msg.role, content: JSON.parse(msg.content).message };
  });
  try {
    const p = await $fetch(`https://pocket.zehna.ir/api/collections/patients/records/${body.pId}`, {
      method: 'GET',
    });
    const sysPrompt = await $fetch(LLM_ADDRESS, {
      method: 'POST',
      headers,
      body: {
        // TODO: ADD THE DETAILS PROVIDED BY THE USER, IN INITIATION LAST STEP. ALSO TRANSLATE THESE TO ENGLISH.
        messages: [{ role: 'assistant', content: `Hi there, how can I help you?` }, ...sendToLLM],
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
        reference_system_prompt: JSON.stringify(p.longDescription),
      },
    });
    console.log('---SYS PROMPT---');
    return JSON.stringify({ message: sysPrompt.final_response, img: p.avatar });
  }
  catch (e) {
    console.log(e);

    return e;
  }
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  return await fetchLLM(
    body,
  );
});
