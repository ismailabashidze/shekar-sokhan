import { ChromaClient } from 'chromadb';

export default defineEventHandler(async (event) => {
  const client = new ChromaClient();
  try {
    await client.reset();
    return 'success';
  }
  catch (e) {
    throw e;
  }
});
