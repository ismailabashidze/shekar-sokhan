export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const config = useRuntimeConfig()
  
  // Pexels API endpoint
  const API_URL = 'https://api.pexels.com/v1/search'
  
  // Get API key from runtime config
  const API_KEY = config.pexelsApiKey
  
  if (!API_KEY) {
    // Return mock data when no API key is available
    return {
      photos: [
        {
          id: Date.now(),
          src: {
            large: `https://picsum.photos/800/600?random=${Date.now() + 1}`,
            medium: `https://picsum.photos/300/200?random=${Date.now() + 1}`
          },
          alt: query.query || 'Professional image',
          photographer: 'Professional Photographer',
          photographer_url: '#',
          width: 800,
          height: 600
        },
        {
          id: Date.now() + 1,
          src: {
            large: `https://picsum.photos/800/600?random=${Date.now() + 2}`,
            medium: `https://picsum.photos/300/200?random=${Date.now() + 2}`
          },
          alt: query.query || 'Professional image',
          photographer: 'Stock Photographer',
          photographer_url: '#',
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
      page: (query.page || 1) as string
    })

    if (query.orientation) params.append('orientation', query.orientation as string)
    if (query.color) params.append('color', query.color as string)

    const response = await $fetch(`${API_URL}?${params}`, {
      headers: {
        'Authorization': API_KEY
      }
    })

    return response
  } catch (error) {
    console.error('Pexels API error:', error)
    
    // Return fallback mock data on error
    return {
      photos: [
        {
          id: Date.now(),
          src: {
            large: `https://picsum.photos/800/600?random=${Date.now()}`,
            medium: `https://picsum.photos/300/200?random=${Date.now()}`
          },
          alt: query.query || 'Professional image',
          photographer: 'Stock Photographer',
          photographer_url: '#',
          width: 800,
          height: 600
        }
      ]
    }
  }
})