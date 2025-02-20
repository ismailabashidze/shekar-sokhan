interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface OpenRouterOptions {
  model?: string
  temperature?: number
  max_tokens?: number
  response_format?: {
    type: 'json_object'
    schema: object
  }
}

export function useOpenRouter() {
  const processing = ref(false)
  const error = ref<string | null>(null)
  const config = useRuntimeConfig()

  const streamChat = async (
    messages: ChatMessage[],
    options: OpenRouterOptions = {},
    onChunk: (chunk: any) => void,
  ) => {
    processing.value = true
    error.value = null

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.public.openRouterApiKey}`,
          'HTTP-Referer': config.public.appUrl || 'http://localhost:3000',
          'X-Title': 'Therapist Chat',
        },
        body: JSON.stringify({
          model: options.model || 'mistralai/mistral-7b-instruct',
          messages,
          stream: true,
          temperature: options.temperature || 0.7,
          max_tokens: options.max_tokens || 1000,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        let errorMessage: string
        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData?.error?.message || errorData?.message || errorText
        } catch {
          errorMessage = errorText
        }
        throw new Error(`Chat error: ${errorMessage}`)
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error('Failed to create stream reader')
      }

      let buffer = ''
      while (true) {
        const { done, value } = await reader.read()

        if (done) {
          break
        }

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || '' // Keep the incomplete line in the buffer

        for (const line of lines) {
          const trimmedLine = line.trim()
          if (!trimmedLine || trimmedLine.startsWith(':')) {
            continue
          }

          // Handle SSE format
          const data = trimmedLine.startsWith('data: ') ? trimmedLine.slice(6) : trimmedLine

          if (data === '[DONE]') {
            break
          }

          try {
            const parsed = JSON.parse(data)
            onChunk(parsed)
          } catch (e) {
            console.error('Error parsing SSE message:', e)
          }
        }
      }
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      processing.value = false
    }
  }

  return {
    streamChat,
    processing,
    error,
  }
}
