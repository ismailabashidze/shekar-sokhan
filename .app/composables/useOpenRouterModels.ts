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

export function useOpenRouterModels() {
  const models = ref<OpenRouterModel[]>([])
  const allModels = ref<OpenRouterModel[]>([])
  const selectedModel = ref<string>('anthropic/claude-2')
  const loading = ref(false)
  const error = ref<string | null>(null)
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
          'Authorization': `Bearer ${useRuntimeConfig().openRouterApiKey}`,
          'HTTP-Referer': useRuntimeConfig().public.appUrl || 'http://localhost:3000',
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
      models.value = data.data
      
      // If selected model is not in the list, select the first available one
      if (!allModels.value.find(m => m.id === selectedModel.value) && allModels.value.length > 0) {
        selectedModel.value = allModels.value[0].id
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch models'
      console.error('Error fetching models:', e)
    } finally {
      loading.value = false
    }
  }

  watch(searchQuery, (newQuery) => {
    models.value = filteredModels.value
  })

  // Load models on mount
  onMounted(() => {
    fetchModels()
  })

  // Retry fetching models
  const retryFetch = () => {
    fetchModels()
  }

  return {
    models,
    selectedModel,
    loading,
    error,
    searchQuery,
    fetchModels,
    retryFetch,
  }
}
