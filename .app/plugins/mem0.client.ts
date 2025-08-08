import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const mem0 = {
    enabled: !!config.mem0ApiKey,
    apiKey: config.mem0ApiKey as string,
    baseUrl: 'https://api.mem0.ai',
  }
  return { provide: { mem0 } }
})


