import { ChromaClient } from 'chromadb'

export default defineEventHandler(async (event) => {
  const client = new ChromaClient()
  const test = await client.listCollections()
  return test
})
