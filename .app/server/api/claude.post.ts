// import { Anthropic } from '@anthropic-ai/sdk';

// const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
// if (!CLAUDE_API_KEY) {
//   throw new Error('CLAUDE_API_KEY environment variable is required');
// }

// const anthropic = new Anthropic({
//   apiKey: CLAUDE_API_KEY,
// });

// export type ClaudeMessage = {
//   role: 'user' | 'assistant'
//   content: string
// }

// async function fetchClaude(messages: ClaudeMessage[]) {
//   try {
//     const response = await anthropic.messages.create({
//       model: 'claude-3-sonnet-20240229',
//       max_tokens: 4096,
//       temperature: 0.7,
//       messages: messages.map(msg => ({
//         role: msg.role,
//         content: msg.content
//       }))
//     });

//     return response.content[0].text;
//   } catch (error) {
//     console.error('Error calling Claude:', error);
//     throw error;
//   }
// }

// export default defineEventHandler(async (event) => {
//   const body = await readBody(event);

//   if (!Array.isArray(body.messages)) {
//     throw new Error('messages array is required in the request body');
//   }

//   return await fetchClaude(body.messages);
// });
