const RUNPOD_TOKEN = process.env.RUNPOD_TOKEN;
const LLM_ADDRESS = process.env.LLM_ADDRESS!;
const LLM_MODEL = process.env.LLM_MODEL;
const LLM_TEMPERATURE = Number(process.env.LLM_TEMPERATURE || 1);
const LLM_MAX_TOKENS = Number(process.env.LLM_MAX_TOKENS || 8192);
const LLM_REPEAT_PENALTY = Number(process.env.LLM_REPEAT_PENALTY || 2);

// Types and Interfaces
interface FetchResponse {
  choices: { message: { content: string } }[];
}

export type LLMMessage = {
  role: 'system' | 'assistant' | 'user';
  content: string;
};

// Helper functions
function hasExactKeys(obj: any, keys: string[]): boolean {
  const objKeys = Object.keys(obj);
  return (
    keys.length === objKeys.length && keys.every(key => objKeys.includes(key))
  );
}

async function fetchLLM(body: any, retries: number = 3): Promise<string> {
  const headers = {
    'Content-Type': 'application/json',
    'Authorizatimeon': `Bearer ${RUNPOD_TOKEN}`,
  };

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Attempt number ${attempt}`);
      const response = await $fetch<FetchResponse>(LLM_ADDRESS, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model: LLM_MODEL,
          messages: body.llmMessages,
          temperature: LLM_TEMPERATURE,
          max_tokens: LLM_MAX_TOKENS,
          repeat_penalty: LLM_REPEAT_PENALTY,
          stream: false,
        }),
      });

      const content = response.choices[0].message.content;
      console.log(content);
      const jsonResponse = JSON.parse(content);
      if (
        hasExactKeys(jsonResponse, [
          'thoughts',
          'action',
          'nextSteps',
          'message',
        ])
      ) {
        return JSON.stringify(jsonResponse);
      }
      else {
        addRetryMessage(body);
      }
    }
    catch (error) {
      console.error('Error:', error);
      if (attempt === retries)
        throw new Error(
          'Maximum retries reached, unable to fetch valid response',
        );
      addRetryMessage(body);
    }
  }
  throw new Error('Failed to obtain a valid response');
}

function addRetryMessage(body: any) {
  body.llmMessages.push({
    role: 'assistant',
    content:
      'You must answer as JSON only. Your JSON should have exactly these keys: thoughts, action, nextSteps, message. Answer properly. Check your answer and ensure that it is in JSON format and with these four keys.',
  });
}

// Event handler
export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (body.type === 'briefing') {
    body.llmMessages.unshift({
      content:
        'answer as json. Json should have these four keys and only be strings: thoughts: as a psychotherapist, what should you think of when you have received this message, especially based on emotions. action: should be the next action you as a psychotherapist will consider. nextSteps: as a psychotherapist, what will be your next step. message: your final message based on thoughts and selected action. answer as valid json, only. your JSON, should have exactly four keys: thoughts, action, nextSteps, message. Remember, You should personally intervene as a psychologist, not insist that a professional psychotherapist is needed.',
      role: 'system',
    });
  }

  try {
    return await fetchLLM(body);
  }
  catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Final error:', error.message);
      return { error: error.message };
    }
    else {
      console.error('Final error:', error);
      return { error: 'An unknown error occurred' };
    }
  }
});
