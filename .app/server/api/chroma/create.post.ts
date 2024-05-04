import { ChromaClient } from 'chromadb'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const client = new ChromaClient()
  const collection = await client.createCollection({ name: body.name })
  return collection
})
