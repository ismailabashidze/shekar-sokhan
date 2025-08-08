import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const apiKey = config.mem0ApiKey as string | undefined
  if (!apiKey) {
    return { ok: false, error: 'MEM0_API_KEY is not configured' }
  }

  const body = await readBody<{ userId: string; content: string; metadata?: any }>(event)
  if (!body?.userId || !body?.content) {
    throw createError({ statusCode: 400, statusMessage: 'userId and content are required' })
  }

  const res = await $fetch('https://api.mem0.ai/v1/memories', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: {
      user_id: body.userId,
      content: body.content,
      metadata: body.metadata || {},
    },
  }).catch((e) => {
    // Normalize error for client
    return { ok: false, error: (e as any)?.data || (e as any)?.message || 'mem0 request failed' }
  })

  return { ok: true, data: res }
})


