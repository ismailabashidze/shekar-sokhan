interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface OpenRouterModel {
  id: string
  name: string
  description: string
  context_length: number
  pricing: {
    prompt: string
    completion: string
  }
}

interface OpenRouterOptions {
  model?: string
  temperature?: number
  max_tokens?: number
}

export function useOpenRouter() {
  const config = useRuntimeConfig()
  
  // Chat state
  const processing = ref(false)
  const error = ref<string | null>(null)

  // Models state
  const models = ref<OpenRouterModel[]>([])
  const allModels = ref<OpenRouterModel[]>([])
  const selectedModel = ref<string>('anthropic/claude-2')
  const loading = ref(false)
  const searchQuery = ref('')

  const filteredModels = computed(() => {
    if (!searchQuery.value) return allModels.value
    const query = searchQuery.value.toLowerCase()
    return allModels.value.filter(model => 
      model.name.toLowerCase().includes(query) || 
      model.id.toLowerCase().includes(query) ||
      model.description.toLowerCase().includes(query)
    )
  })

  const fetchModels = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch('https://openrouter.ai/api/v1/models', {
        headers: {
          'Authorization': `Bearer ${config.public.openRouterApiKey}`,
          'HTTP-Referer': config.public.appUrl || 'http://localhost:3000',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      if (!data.data || !Array.isArray(data.data) || data.data.length === 0) {
        throw new Error('No models available')
      }

      allModels.value = data.data
    } catch (e: any) {
      error.value = e.message
      console.error('Error fetching models:', e)
    } finally {
      loading.value = false
    }
  }

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
          model: options.model || selectedModel.value,
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
        buffer = lines.pop() || ''

        for (const line of lines) {
          const trimmedLine = line.trim()
          if (!trimmedLine || trimmedLine.startsWith(':')) {
            continue
          }

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

  // Initialize models on composable creation
  onMounted(() => {
    fetchModels()
  })

  return {
    // Chat functionality
    streamChat,
    processing,
    
    // Models functionality
    models: allModels,
    selectedModel,
    loading,
    error,
    searchQuery,
    filteredModels,
    retryFetch: fetchModels,
  }
}
