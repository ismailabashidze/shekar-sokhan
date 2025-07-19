export interface ImageSource {
  id: string
  url: string
  thumbnail: string
  alt: string
  attribution?: {
    author: string
    source: string
    link?: string
  }
  tags?: string[]
  width?: number
  height?: number
}

export interface ImageSearchOptions {
  query: string
  perPage?: number
  page?: number
  category?: string
  orientation?: 'landscape' | 'portrait' | 'squarish'
  color?: string
}

export const useImageSources = () => {
  // Unsplash API
  const searchUnsplash = async (options: ImageSearchOptions): Promise<ImageSource[]> => {
    try {
      const params = new URLSearchParams({
        query: options.query,
        per_page: (options.perPage || 20).toString(),
        page: (options.page || 1).toString(),
        orientation: options.orientation || 'landscape'
      })

      if (options.color) params.append('color', options.color)

      const response = await $fetch(`/api/images/unsplash?${params}`)
      
      return response.results?.map((image: any) => ({
        id: `unsplash-${image.id}`,
        url: image.urls.regular,
        thumbnail: image.urls.thumb,
        alt: image.alt_description || image.description || options.query,
        attribution: {
          author: image.user.name,
          source: 'Unsplash',
          link: image.links.html
        },
        tags: image.tags?.map((tag: any) => tag.title) || [],
        width: image.width,
        height: image.height
      })) || []
    } catch (error) {
      console.error('Unsplash search error:', error)
      return []
    }
  }

  // Pexels API
  const searchPexels = async (options: ImageSearchOptions): Promise<ImageSource[]> => {
    try {
      const params = new URLSearchParams({
        query: options.query,
        per_page: (options.perPage || 20).toString(),
        page: (options.page || 1).toString()
      })

      if (options.orientation) params.append('orientation', options.orientation)
      if (options.color) params.append('color', options.color)

      const response = await $fetch(`/api/images/pexels?${params}`)
      
      return response.photos?.map((photo: any) => ({
        id: `pexels-${photo.id}`,
        url: photo.src.large,
        thumbnail: photo.src.medium,
        alt: photo.alt || options.query,
        attribution: {
          author: photo.photographer,
          source: 'Pexels',
          link: photo.photographer_url
        },
        width: photo.width,
        height: photo.height
      })) || []
    } catch (error) {
      console.error('Pexels search error:', error)
      return []
    }
  }

  // Pixabay API
  const searchPixabay = async (options: ImageSearchOptions): Promise<ImageSource[]> => {
    try {
      const params = new URLSearchParams({
        q: options.query,
        per_page: (options.perPage || 20).toString(),
        page: (options.page || 1).toString(),
        image_type: 'photo',
        safesearch: 'true'
      })

      if (options.orientation) params.append('orientation', options.orientation)
      if (options.category) params.append('category', options.category)

      const response = await $fetch(`/api/images/pixabay?${params}`)
      
      return response.hits?.map((hit: any) => ({
        id: `pixabay-${hit.id}`,
        url: hit.webformatURL,
        thumbnail: hit.previewURL,
        alt: hit.tags || options.query,
        attribution: {
          author: hit.user,
          source: 'Pixabay',
          link: hit.pageURL
        },
        tags: hit.tags?.split(', ') || [],
        width: hit.webformatWidth,
        height: hit.webformatHeight
      })) || []
    } catch (error) {
      console.error('Pixabay search error:', error)
      return []
    }
  }

  // Lorem Picsum for fallback/testing
  const generateLoremPicsum = (options: ImageSearchOptions): ImageSource[] => {
    const count = options.perPage || 10
    const images: ImageSource[] = []
    
    for (let i = 1; i <= count; i++) {
      const id = Date.now() + i
      images.push({
        id: `picsum-${id}`,
        url: `https://picsum.photos/800/600?random=${id}`,
        thumbnail: `https://picsum.photos/300/200?random=${id}`,
        alt: `${options.query} - Image ${i}`,
        attribution: {
          author: 'Lorem Picsum',
          source: 'Picsum Photos'
        },
        width: 800,
        height: 600
      })
    }
    
    return images
  }

  // Combined search across all sources
  const searchAllSources = async (options: ImageSearchOptions) => {
    const [unsplash, pexels, pixabay] = await Promise.all([
      searchUnsplash({ ...options, perPage: 8 }),
      searchPexels({ ...options, perPage: 8 }),
      searchPixabay({ ...options, perPage: 8 })
    ])

    const picsum = generateLoremPicsum({ ...options, perPage: 6 })

    return { unsplash, pexels, pixabay, picsum }
  }

  // Generate AI-suggested search terms based on content and theme
  const generateSearchTerms = (content: string, theme?: string): string[] => {
    const words = content.toLowerCase()
    const suggestions = []

    // Theme-based keyword mapping for better image search
    const themeKeywords: Record<string, string[]> = {
      'educational': ['education', 'learning', 'books', 'students', 'classroom', 'teaching'],
      'motivational': ['success', 'achievement', 'goals', 'inspiration', 'motivation', 'growth'],
      'social-media': ['social', 'digital', 'community', 'communication', 'networking', 'sharing'],
      'professional': ['business', 'professional', 'office', 'corporate', 'work', 'career'],
      'personal-development': ['growth', 'development', 'self-improvement', 'mindset', 'progress'],
      'storytelling': ['story', 'narrative', 'journey', 'experience', 'adventure', 'memory'],
      'informative': ['information', 'data', 'news', 'research', 'facts', 'knowledge'],
      'entertainment': ['fun', 'entertainment', 'joy', 'celebration', 'happiness', 'party'],
      'technology': ['technology', 'digital', 'innovation', 'computer', 'software', 'modern'],
      'health-wellness': ['health', 'wellness', 'fitness', 'medical', 'healthy', 'exercise'],
      'lifestyle': ['lifestyle', 'daily', 'routine', 'habits', 'living', 'home'],
      'financial': ['finance', 'money', 'investment', 'business', 'economy', 'wealth'],
      'travel': ['travel', 'tourism', 'vacation', 'adventure', 'journey', 'destination'],
      'food-cooking': ['food', 'cooking', 'cuisine', 'restaurant', 'chef', 'kitchen'],
      'art-culture': ['art', 'creative', 'design', 'culture', 'artistic', 'painting'],
      'science': ['science', 'research', 'laboratory', 'discovery', 'innovation', 'experiment'],
      'mental-health': ['mental health', 'therapy', 'wellness', 'mindfulness', 'meditation'],
      'relationship': ['relationship', 'love', 'family', 'friendship', 'connection', 'together'],
      'parenting': ['family', 'children', 'parents', 'kids', 'parenting', 'childhood'],
      'meditation': ['meditation', 'mindfulness', 'peace', 'zen', 'calm', 'spiritual'],
      'self-help': ['self-help', 'improvement', 'growth', 'development', 'progress', 'change']
    }

    // Add theme-based suggestions
    if (theme && themeKeywords[theme]) {
      suggestions.push(...themeKeywords[theme])
    }

    // Persian to English keyword mapping
    const keywordMap: Record<string, string[]> = {
      'آموزش': ['education', 'learning', 'teaching'],
      'انگیزش': ['motivation', 'inspiration', 'success'],
      'تکنولوژی': ['technology', 'digital', 'innovation'],
      'کسب و کار': ['business', 'professional', 'office'],
      'سلامت': ['health', 'wellness', 'medical'],
      'طبیعت': ['nature', 'landscape', 'outdoor'],
      'غذا': ['food', 'cooking', 'restaurant'],
      'سفر': ['travel', 'tourism', 'vacation'],
      'ورزش': ['sports', 'fitness', 'exercise'],
      'هنر': ['art', 'creative', 'design'],
      'خانواده': ['family', 'children', 'parents'],
      'مالی': ['finance', 'money', 'investment'],
      'علم': ['science', 'research', 'knowledge']
    }

    // Check for Persian keywords and add English equivalents
    Object.entries(keywordMap).forEach(([persian, english]) => {
      if (words.includes(persian)) {
        suggestions.push(...english)
      }
    })

    // Add some generic fallbacks
    if (suggestions.length === 0) {
      suggestions.push('professional', 'modern', 'lifestyle', 'creative')
    }

    return [...new Set(suggestions)]
  }

  return {
    searchUnsplash,
    searchPexels,
    searchPixabay,
    generateLoremPicsum,
    searchAllSources,
    generateSearchTerms
  }
}