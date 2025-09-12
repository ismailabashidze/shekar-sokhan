interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface AITherapistConfig {
  model?: string
  temperature?: number
  max_tokens?: number
  frequency_penalty?: number
  presence_penalty?: number
  stream?: boolean
  provider?: {
    allow_fallbacks?: boolean
    require_parameters?: boolean
    data_collection?: string
    order?: string[]
    only?: string[]
  }
}

export function useAITherapist() {
  const config = useRuntimeConfig()
  const processing = ref(false)
  const error = ref<string | null>(null)

  const streamChat = async (
    messages: ChatMessage[],
    options: AITherapistConfig = {},
    onChunk: (chunk: any) => void,
  ) => {
    processing.value = true
    error.value = null

    try {
      // Default configuration
      const defaultConfig: AITherapistConfig = {
        model: 'google/gemma-3-27b-it',
        temperature: 0.8,
        max_tokens: 119,
        frequency_penalty: 2,
        presence_penalty: 1,
        stream: true,
        provider: {
          allow_fallbacks: true,
          require_parameters: true,
          data_collection: 'deny',
          order: ['Mistral'],
          only: ['Mistral', 'Groq']
        }
      }

      // Merge provided options with defaults
      const finalConfig = { ...defaultConfig, ...options }

      const payload = {
        model: finalConfig.model,
        messages,
        temperature: finalConfig.temperature,
        max_tokens: finalConfig.max_tokens,
        frequency_penalty: finalConfig.frequency_penalty,
        presence_penalty: finalConfig.presence_penalty,
        stream: finalConfig.stream,
        provider: finalConfig.provider
      }

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.public.openRouterApiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': config.public.appUrl || 'http://localhost:3000',
          'X-Title': 'AI Therapist Chat',
        },
        body: JSON.stringify(payload),
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
        throw new Error(`Chat error: ${errorMessage}`)
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('Response body is not readable')
      }

      const decoder = new TextDecoder()
      let buffer = ''
      let fullResponse = ''

      try {
        // eslint-disable-next-line no-constant-condition
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          // Append new chunk to buffer
          buffer += decoder.decode(value, { stream: true })

          // Process complete lines from buffer
          while (true) {
            const lineEnd = buffer.indexOf('\n')
            if (lineEnd === -1) break

            const line = buffer.slice(0, lineEnd).trim()
            buffer = buffer.slice(lineEnd + 1)

            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') {
                return fullResponse
              }

              try {
                const parsed = JSON.parse(data)
                const content = parsed.choices[0].delta.content
                if (content) {
                  fullResponse += content
                  onChunk(content)
                }
              } catch (e) {
                // Ignore invalid JSON
              }
            }
          }
        }
      } finally {
        reader.cancel()
      }

      return fullResponse
    }
    catch (e: any) {
      error.value = e.message
      throw e
    }
    finally {
      processing.value = false
    }
  }

  return {
    streamChat,
    processing: readonly(processing),
    error: readonly(error),
  }
}