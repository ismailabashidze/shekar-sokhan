import { ChromaClient } from 'chromadb'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const client = new ChromaClient()
  const collection = await client.getCollection({ name: body.name })
  return collection
})
