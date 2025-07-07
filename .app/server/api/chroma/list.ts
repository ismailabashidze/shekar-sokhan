import { ChromaClient } from 'chromadb'

export default defineEventHandler(async (event) => {
  const client = new ChromaClient()
  return await client.listCollections()
})
