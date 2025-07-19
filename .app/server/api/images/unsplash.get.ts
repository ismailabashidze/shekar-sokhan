export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const config = useRuntimeConfig()
  
  // Unsplash API endpoint
  const API_URL = 'https://api.unsplash.com/search/photos'
  
  // Get API key from runtime config
  const ACCESS_KEY = config.unsplashAccessKey
  
  if (!ACCESS_KEY) {
    // Return mock data when no API key is available
    return {
      results: [
        {
          id: 'mock-1',
          urls: {
            regular: `https://picsum.photos/800/600?random=${Date.now()}`,
            thumb: `https://picsum.photos/300/200?random=${Date.now()}`
          },
          alt_description: query.query || 'Professional image',
          description: `High quality ${query.query} image`,
          user: {
            name: 'Professional Photographer'
          },
          links: {
            html: '#'
          },
          tags: [{ title: query.query }],
          width: 800,
          height: 600
        }
      ]
    }
  }

  try {
    const params = new URLSearchParams({
      query: query.query as string,
      per_page: (query.per_page || 20) as string,
      page: (query.page || 1) as string,
      orientation: (query.orientation || 'landscape') as string
    })

    if (query.color) params.append('color', query.color as string)

    const response = await $fetch(`${API_URL}?${params}`, {
      headers: {
        'Authorization': `Client-ID ${ACCESS_KEY}`
      }
    })

    return response
  } catch (error) {
    console.error('Unsplash API error:', error)
    
    // Return fallback mock data on error
    return {
      results: [
        {
          id: 'fallback-1',
          urls: {
            regular: `https://picsum.photos/800/600?random=${Date.now()}`,
            thumb: `https://picsum.photos/300/200?random=${Date.now()}`
          },
          alt_description: query.query || 'Professional image',
          user: { name: 'Stock Photographer' },
          links: { html: '#' },
          tags: [{ title: query.query }],
          width: 800,
          height: 600
        }
      ]
    }
  }
})