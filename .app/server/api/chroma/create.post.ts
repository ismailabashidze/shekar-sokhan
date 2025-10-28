import { ChromaClient } from 'chromadb';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const client = new ChromaClient();
  return await client.createCollection({ name: body.name });
});
