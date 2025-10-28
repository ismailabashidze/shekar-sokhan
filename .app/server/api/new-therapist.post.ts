import Anthropic from '@anthropic-ai/sdk';

// const LLM_ADDRESS = 'http://127.0.0.1:8000/query'
const LLM_ADDRESS = 'http://193.163.201.12:8000/query';
const LLM_ADDRESS_RUNPOD = 'https://api.runpod.ai/v2/6psbp5s1llu4c8/openai/v1/chat/completions';
const RUNPOD_TOKEN = '8ASLOFSZNUV6LBP0FD0D51300FRF0TZFEBFHPSV3';
const LLM_MODEL = 'cognitivecomputations/dolphin-2.8-mistral-7b-v02';
const LLM_TEMPERATURE = 1;
const LLM_MAX_TOKENS = 8192;
const LLM_REPEAT_PENALTY = 2;

export type LLMMessage = {
  role: 'system' | 'assistant' | 'user';
  content: string;
};

async function fetchLLM(body: any) {
  const anthropic = new Anthropic({
    // Use environment variable instead of hardcoded API key
    apiKey: process.env.ANTHROPIC_API_KEY || '',
  });

  const msg = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1000,
    temperature: 0,
    system: 'Respond only with short poems.',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Why is the ocean salty?',
          },
        ],
      },
    ],
  });
  console.log(msg);
  const headers = {
    'Content-Type': 'application/json',
  };
  const sendToLLM = body.llmMessages.map((msg) => {
    return { role: msg.role, content: JSON.parse(msg.content).message };
  });
  try {
    const anthropic = new Anthropic({
      // Use environment variable instead of hardcoded API key
      apiKey: process.env.ANTHROPIC_API_KEY || '',
    });

    const msg = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1000,
      temperature: 0,
      messages: [{ role: 'user', content: `` }, ...sendToLLM],
    });
    console.log('msg');
    console.log(msg);

    // else JSON.stringify(sysPrompt.final_response)
    return msg;
  }
  catch (e) {
    console.log('here');
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
