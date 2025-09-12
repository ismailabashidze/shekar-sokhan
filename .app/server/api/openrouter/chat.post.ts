import { type H3Event } from 'h3'

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'

export default defineEventHandler(async (event: H3Event) => {
  console.log('here')

  const config = useRuntimeConfig()

  if (!config.openRouterApiKey) {
    throw createError({
      statusCode: 500,
      message: 'OpenRouter API key not configured',
    })
  }

  const body = await readBody(event)

  try {
    // Create response stream
    console.log('config.openRouterApiKey')
    console.log(config.openRouterApiKey)

    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.openRouterApiKey}`,
        'HTTP-Referer': config.public.appUrl || 'http://localhost:3000',
        'X-Title': 'Therapist Chat',
      },
      body: JSON.stringify({
        include_reasoning: true,
        model: body.model || 'google/gemma-3-27b-it',
        messages: body.messages,
        stream: true,
        transforms: ['middle-out'],
        plugins: [],
        temperature: body.temperature || 0.7,
        max_tokens: body.max_tokens || 0,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      let errorMessage: string
      try {
        const errorData = JSON.parse(errorText)
        errorMessage = errorData?.error?.message || errorData?.message || errorText
      }
      catch {
        errorMessage = errorText
      }

      throw createError({
        statusCode: response.status,
        message: `OpenRouter API error: ${errorMessage}`,
      })
    }

    // Set appropriate headers for streaming
    setHeader(event, 'Content-Type', 'text/event-stream')
    setHeader(event, 'Cache-Control', 'no-cache')
    setHeader(event, 'Connection', 'keep-alive')

    // Create readable stream
    const reader = response.body?.getReader()
    const encoder = new TextEncoder()
    const decoder = new TextDecoder()

    if (!reader) {
      throw createError({
        statusCode: 500,
        message: 'Failed to create stream reader',
      })
    }

    return new ReadableStream({
      async start(controller) {
        try {
          while (true) {
            const { done, value } = await reader.read()

            if (done) {
              controller.close()
              break
            }

            const chunk = decoder.decode(value)
            const lines = chunk
              .split('\n')
              .filter(line => line.trim() !== '')

            for (const line of lines) {
              // Skip OpenRouter processing comments
              if (line.startsWith(':')) {
                continue
              }

              // Remove 'data: ' prefix if present
              const data = line.startsWith('data: ') ? line.slice(6) : line

              if (data === '[DONE]') {
                controller.close()
                break
              }

              try {
                const parsed = JSON.parse(data)
                controller.enqueue(encoder.encode(`data: ${JSON.stringify(parsed)}\n\n`))
              }
              catch (e) {
                console.error('Error parsing SSE message:', e)
              }
            }
          }
        }
        catch (e) {
          console.error('Stream error:', e)
          controller.error(e)
        }
      },
      cancel() {
        reader.cancel()
      },
    })
  }
  catch (error: any) {
    console.error('OpenRouter API error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Internal server error',
    })
  }
})
