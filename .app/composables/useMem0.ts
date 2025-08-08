import type { MemoryItem, MemorySearchOptions, MemoryCategory, MemorySource } from '~/types/memory'

/**
 * Composable for mem0 memory management integration
 * Provides memory storage, retrieval, and management for therapy sessions
 */
export const useMem0 = () => {
  const nuxtApp = useNuxtApp()
  const { user } = useUser()
  const config = useRuntimeConfig()

  // Initialize mem0 client with proper server-side handling
  let memory: any = null
  
  const initializeMemory = async () => {
    if (memory) return memory
    
    // Only initialize on server-side or when needed
    if (process.server || typeof window === 'undefined') {
      try {
        const { Memory } = await import('mem0ai')
        memory = new Memory({
          apiKey: config.public.mem0ApiKey,
        })
      } catch (error) {
        console.warn('Mem0 not available in current environment:', error.message)
        // Return mock for development/testing
        memory = createMockMemory()
      }
    } else {
      // Client-side fallback - use API endpoints instead
      memory = createClientMemory()
    }
    
    return memory
  }

  // Mock memory for development when mem0ai is not available
  const createMockMemory = () => ({
    add: async (data: any) => {
      console.log('Mock mem0.add called with:', data)
      return { id: `mock_${Date.now()}`, success: true }
    },
    search: async (params: any) => {
      console.log('Mock mem0.search called with:', params)
      return []
    },
    update: async (params: any) => {
      console.log('Mock mem0.update called with:', params)
      return { success: true }
    },
    delete: async (id: any) => {
      console.log('Mock mem0.delete called with:', id)
      return { success: true }
    }
  })

  // Client-side memory implementation using API calls
  const createClientMemory = () => ({
    add: async (data: any) => {
      // In a real implementation, this would call an API endpoint
      console.log('Client-side mem0.add called with:', data)
      return { id: `client_${Date.now()}`, success: true }
    },
    search: async (params: any) => {
      // In a real implementation, this would call an API endpoint
      console.log('Client-side mem0.search called with:', params)
      return []
    },
    update: async (params: any) => {
      console.log('Client-side mem0.update called with:', params)
      return { success: true }
    },
    delete: async (id: any) => {
      console.log('Client-side mem0.delete called with:', id)
      return { success: true }
    }
  })

  /**
   * Store a memory item for the current user
   * @param content - The memory content to store
   * @param category - Category of the memory
   * @param options - Additional options for memory storage
   */
  const addMemory = async (
    content: string,
    category: MemoryCategory = 'other',
    options: {
      sourceType?: MemorySource
      sourceId?: string
      sessionId?: string
      importance?: number
      tags?: string[]
      metadata?: Record<string, any>
    } = {}
  ) => {
    try {
      if (!user.value?.id) {
        throw new Error('User not authenticated')
      }

      const userId = user.value.id
      
      // Initialize memory client
      const memoryClient = await initializeMemory()
      
      // Store in mem0
      const memoryResult = await memoryClient.add({
        messages: [{ role: 'user', content }],
        userId,
        metadata: {
          category,
          sourceType: options.sourceType || 'user_input',
          sourceId: options.sourceId,
          sessionId: options.sessionId,
          importance: options.importance || 5,
          tags: options.tags || [],
          ...options.metadata
        }
      })

      // Also store in PocketBase for local tracking and management
      let pbMemory = null
      try {
        pbMemory = await nuxtApp.$pb.collection('memories').create({
          user: userId,
          content,
          category,
          importance: options.importance || 5,
          source_type: options.sourceType || 'user_input',
          source_id: options.sourceId,
          session_id: options.sessionId,
          tags: options.tags || [],
          metadata: {
            mem0_id: memoryResult.id,
            ...options.metadata
          },
          is_active: true,
          last_accessed: new Date().toISOString(),
          access_count: 0
        })
      } catch (pbError) {
        console.warn('PocketBase memories collection not available:', pbError)
        // Continue without PocketBase storage
      }

      return {
        mem0Id: memoryResult.id,
        pbId: pbMemory?.id,
        success: true
      }
    } catch (error) {
      console.error('Error adding memory:', error)
      throw error
    }
  }

  /**
   * Search memories for the current user
   * @param query - Search query
   * @param options - Search options
   */
  const searchMemories = async (
    query: string,
    options: MemorySearchOptions = {}
  ) => {
    try {
      if (!user.value?.id) {
        throw new Error('User not authenticated')
      }

      const userId = user.value.id
      const {
        limit = 10,
        category,
        minImportance = 1,
        sessionId,
        includeMem0 = true
      } = options

      let results = []

      if (includeMem0) {
        // Initialize memory client
        const memoryClient = await initializeMemory()
        
        // Search using mem0
        const mem0Results = await memoryClient.search({
          query,
          userId,
          limit
        })

        results = mem0Results.map((item: any) => ({
          id: item.id,
          content: item.memory,
          score: item.score,
          source: 'mem0',
          metadata: item.metadata
        }))
      }

      // Also search in PocketBase for additional filtering and local data
      let filter = `user = "${userId}" && is_active = true`
      
      if (category) {
        filter += ` && category = "${category}"`
      }
      if (minImportance > 1) {
        filter += ` && importance >= ${minImportance}`
      }
      if (sessionId) {
        filter += ` && session_id = "${sessionId}"`
      }

      let pbResults = { items: [], totalItems: 0 }
      try {
        pbResults = await nuxtApp.$pb.collection('memories').getList(1, limit, {
          filter,
          sort: '-importance,-created',
          expand: 'session_id'
        })
      } catch (pbError) {
        console.warn('PocketBase memories collection not available for search:', pbError)
        // Return empty results if PocketBase fails
      }

      // Update access tracking for retrieved memories
      for (const memory of pbResults.items) {
        try {
          await nuxtApp.$pb.collection('memories').update(memory.id, {
            last_accessed: new Date().toISOString(),
            access_count: (memory.access_count || 0) + 1
          })
        } catch (updateError) {
          console.warn('Could not update memory access count:', updateError)
        }
      }

      // Log search for analytics
      try {
        await nuxtApp.$pb.collection('memory_search_logs').create({
          user: userId,
          query,
          results_count: results.length + pbResults.items.length,
          session_context: sessionId || null
        })
      } catch (logError) {
        console.warn('Could not log search analytics:', logError)
      }

      return {
        mem0Results: results,
        localResults: pbResults.items,
        totalCount: results.length + pbResults.totalItems,
        success: true
      }
    } catch (error) {
      console.error('Error searching memories:', error)
      throw error
    }
  }

  /**
   * Get all memories for the current user with pagination
   */
  const getUserMemories = async (page = 1, perPage = 50, filters: any = {}) => {
    try {
      if (!user.value?.id) {
        throw new Error('User not authenticated')
      }

      let filter = `user = "${user.value.id}" && is_active = true`
      
      if (filters.category) {
        filter += ` && category = "${filters.category}"`
      }
      if (filters.minImportance) {
        filter += ` && importance >= ${filters.minImportance}`
      }
      if (filters.sourceType) {
        filter += ` && source_type = "${filters.sourceType}"`
      }

      try {
        const result = await nuxtApp.$pb.collection('memories').getList(page, perPage, {
          filter,
          sort: '-importance,-created',
          expand: 'session_id,user'
        })
        return result
      } catch (pbError) {
        console.warn('PocketBase memories collection not available:', pbError)
        // Return empty result structure if PocketBase fails
        return {
          items: [],
          page: 1,
          perPage,
          totalItems: 0,
          totalPages: 0
        }
      }
    } catch (error) {
      console.error('Error fetching user memories:', error)
      throw error
    }
  }

  /**
   * Update a memory item
   */
  const updateMemory = async (memoryId: string, updates: Partial<MemoryItem>) => {
    try {
      if (!user.value?.id) {
        throw new Error('User not authenticated')
      }

      // Update in PocketBase
      let updated = null
      try {
        updated = await nuxtApp.$pb.collection('memories').update(memoryId, updates)
      } catch (pbError) {
        console.warn('PocketBase memories collection not available for update:', pbError)
        throw new Error('Cannot update memory: Database not available')
      }

      // If content changed, also update in mem0
      if (updates.content && updated.metadata?.mem0_id) {
        try {
          const memoryClient = await initializeMemory()
          await memoryClient.update({
            memoryId: updated.metadata.mem0_id,
            data: updates.content
          })
        } catch (mem0Error) {
          console.warn('Could not update mem0 memory:', mem0Error)
          // Continue without mem0 update
        }
      }

      return updated
    } catch (error) {
      console.error('Error updating memory:', error)
      throw error
    }
  }

  /**
   * Delete a memory item
   */
  const deleteMemory = async (memoryId: string) => {
    try {
      if (!user.value?.id) {
        throw new Error('User not authenticated')
      }

      // Get memory first to get mem0 ID
      let memory_item = null
      try {
        memory_item = await nuxtApp.$pb.collection('memories').getOne(memoryId)
      } catch (pbError) {
        console.warn('PocketBase memories collection not available for delete:', pbError)
        throw new Error('Cannot delete memory: Database not available')
      }

      // Delete from mem0 if exists
      if (memory_item.metadata?.mem0_id) {
        try {
          const memoryClient = await initializeMemory()
          await memoryClient.delete(memory_item.metadata.mem0_id)
        } catch (mem0Error) {
          console.warn('Could not delete from mem0:', mem0Error)
          // Continue with local delete
        }
      }

      // Soft delete in PocketBase (mark as inactive)
      try {
        await nuxtApp.$pb.collection('memories').update(memoryId, {
          is_active: false
        })
      } catch (pbError) {
        console.warn('Could not mark memory as inactive:', pbError)
        throw new Error('Cannot complete memory deletion')
      }

      return { success: true }
    } catch (error) {
      console.error('Error deleting memory:', error)
      throw error
    }
  }

  /**
   * Get memory statistics for the user
   */
  const getMemoryStats = async () => {
    try {
      if (!user.value?.id) {
        throw new Error('User not authenticated')
      }

      const userId = user.value.id

      try {
        // Get counts by category
        const categories = ['personal_info', 'goals', 'symptoms', 'triggers', 'relationships', 'progress', 'preferences', 'therapy_notes', 'important_events', 'other']
        
        const stats: Record<string, number> = {}
        
        for (const category of categories) {
          try {
            const result = await nuxtApp.$pb.collection('memories').getList(1, 1, {
              filter: `user = "${userId}" && category = "${category}" && is_active = true`
            })
            stats[category] = result.totalItems
          } catch (categoryError) {
            stats[category] = 0
          }
        }

        // Get total memories
        let totalItems = 0
        try {
          const total = await nuxtApp.$pb.collection('memories').getList(1, 1, {
            filter: `user = "${userId}" && is_active = true`
          })
          totalItems = total.totalItems
        } catch (totalError) {
          totalItems = 0
        }

        return {
          total: totalItems,
          byCategory: stats,
          success: true
        }
      } catch (pbError) {
        console.warn('PocketBase memories collection not available for stats:', pbError)
        // Return empty stats if PocketBase fails
        return {
          total: 0,
          byCategory: {},
          success: false
        }
      }
    } catch (error) {
      console.error('Error fetching memory stats:', error)
      throw error
    }
  }

  /**
   * Extract and store memories from therapy session content
   */
  const extractSessionMemories = async (
    sessionContent: string,
    sessionId: string,
    extractionPrompt?: string
  ) => {
    try {
      if (!user.value?.id) {
        throw new Error('User not authenticated')
      }

      const userId = user.value.id
      
      // Initialize memory client
      const memoryClient = await initializeMemory()
      
      // Use mem0 to extract important information from session
      const extractedMemories = await memoryClient.add({
        messages: [
          {
            role: 'system',
            content: extractionPrompt || `
              Extract important personal information, goals, symptoms, triggers, relationships, and therapeutic insights from this therapy session. 
              Focus on information that would be valuable for future therapy sessions. 
              Categorize the information appropriately.
              Extract information in Persian/Farsi language.
            `
          },
          {
            role: 'user',
            content: sessionContent
          }
        ],
        userId,
        metadata: {
          sourceType: 'therapy_session',
          sessionId,
          importance: 8 // Sessions are generally high importance
        }
      })

      return {
        mem0Id: extractedMemories.id,
        success: true
      }
    } catch (error) {
      console.error('Error extracting session memories:', error)
      throw error
    }
  }

  /**
   * Get contextual memories for therapy session
   */
  const getSessionContext = async (currentMessage: string, sessionId?: string, limit = 5) => {
    try {
      if (!user.value?.id) {
        throw new Error('User not authenticated')
      }

      // Search for relevant memories to provide context
      const searchResults = await searchMemories(currentMessage, {
        limit,
        minImportance: 6, // Only high importance memories for context
        sessionId
      })

      // Format for LLM context
      const contextMemories = [
        ...searchResults.mem0Results,
        ...searchResults.localResults.map(item => ({
          content: item.content,
          category: item.category,
          importance: item.importance,
          source: 'local'
        }))
      ]

      return {
        memories: contextMemories,
        contextPrompt: formatMemoriesForPrompt(contextMemories),
        success: true
      }
    } catch (error) {
      console.error('Error getting session context:', error)
      throw error
    }
  }

  /**
   * Format memories for LLM prompt injection
   */
  const formatMemoriesForPrompt = (memories: any[]): string => {
    if (memories.length === 0) return ''

    let prompt = '\n--- اطلاعات مهم از جلسات قبلی ---\n'
    
    memories.forEach((memory, index) => {
      prompt += `${index + 1}. ${memory.content}`
      if (memory.category) {
        prompt += ` (دسته: ${memory.category})`
      }
      if (memory.importance) {
        prompt += ` (اهمیت: ${memory.importance}/10)`
      }
      prompt += '\n'
    })
    
    prompt += '--- پایان اطلاعات ---\n\n'
    return prompt
  }

  return {
    // Core memory functions
    addMemory,
    searchMemories,
    getUserMemories,
    getAllMemories: getUserMemories, // Alias for consistency
    updateMemory,
    deleteMemory,
    getMemoryStats,
    
    // Session-specific functions
    extractSessionMemories,
    getSessionContext,
    formatMemoriesForPrompt
  }
}

export default useMem0