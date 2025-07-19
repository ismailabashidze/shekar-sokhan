export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const config = useRuntimeConfig()
  
  // Pixabay API endpoint
  const API_URL = 'https://pixabay.com/api/'
  
  // Get API key from runtime config
  const API_KEY = config.pixabayApiKey
  
  if (!API_KEY) {
    // Return mock data when no API key is available
    return {
      hits: [
        {
          id: Date.now(),
          webformatURL: `https://picsum.photos/800/600?random=${Date.now() + 10}`,
          previewURL: `https://picsum.photos/300/200?random=${Date.now() + 10}`,
          tags: query.q || 'professional, business, modern',
          user: 'Professional',
          pageURL: '#',
          webformatWidth: 800,
          webformatHeight: 600
        },
        {
          id: Date.now() + 1,
          webformatURL: `https://picsum.photos/800/600?random=${Date.now() + 11}`,
          previewURL: `https://picsum.photos/300/200?random=${Date.now() + 11}`,
          tags: query.q || 'creative, design, modern',
          user: 'Designer',
          pageURL: '#',
          webformatWidth: 800,
          webformatHeight: 600
        }
      ]
    }
  }

  try {
    const params = new URLSearchParams({
      key: API_KEY,
      q: query.q as string,
      per_page: (query.per_page || 20) as string,
      page: (query.page || 1) as string,
      image_type: 'photo',
      safesearch: 'true'
    })

    if (query.orientation) params.append('orientation', query.orientation as string)
    if (query.category) params.append('category', query.category as string)

    const response = await $fetch(`${API_URL}?${params}`)

    return response
  } catch (error) {
    console.error('Pixabay API error:', error)
    
    // Return fallback mock data on error
    return {
      hits: [
        {
          id: Date.now(),
          webformatURL: `https://picsum.photos/800/600?random=${Date.now()}`,
          previewURL: `https://picsum.photos/300/200?random=${Date.now()}`,
          tags: query.q || 'professional, business',
          user: 'Stock Photographer',
          pageURL: '#',
          webformatWidth: 800,
          webformatHeight: 600
        }
      ]
    }
  }
})