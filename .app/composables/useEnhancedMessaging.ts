import type { MemoryCategory, MemorySource } from '~/types/memory'

/**
 * Enhanced messaging composable with mem0 integration
 * Automatically stores and retrieves memories during therapy sessions
 */
export const useEnhancedMessaging = () => {
  const { user } = useUser()
  const { saveMessage, getMessages } = useMessage()
  const { 
    addMemory, 
    searchMemories, 
    getSessionContext, 
    extractSessionMemories,
    formatMemoriesForPrompt 
  } = useMem0()

  /**
   * Server-side analysis via API endpoint
   */
  const serverAnalysis = async (content: string) => {
    try {
      const { user } = useUser()
      const response = await $fetch('/api/memory/analyze', {
        method: 'POST',
        body: {
          content,
          userId: user.value?.id || 'test-user'
        }
      })

      if (response.success) {
        return response.analysis
      } else {
        throw new Error(response.error || 'Server analysis failed')
      }
    } catch (error) {
      console.warn('Server analysis failed, using client-side fallback:', error)
      return fallbackAnalysis(content)
    }
  }

  /**
   * Fallback analysis when AI is not available
   */
  const fallbackAnalysis = (content: string) => {
    // Simple rule-based analysis for development/testing
    const personalInfoKeywords = ['نام', 'سن', 'ساله', 'شغل', 'تحصیلات', 'متأهل', 'مجرد', 'هستم']
    const goalsKeywords = ['هدف', 'می‌خواهم', 'میخواهم', 'آرزو', 'تمایل', 'برنامه', 'قصد']
    const symptomsKeywords = ['اضطراب', 'افسرده', 'استرس', 'نگران', 'ترس', 'خواب', 'نمی‌خوابم']
    const relationshipKeywords = ['مادر', 'پدر', 'همسر', 'فرزند', 'دوست', 'خانواده', 'مادرم', 'پدرم']
    
    const lowerContent = content.toLowerCase().trim()
    
    // Check for important information
    let category: MemoryCategory = 'other'
    let importance = 3
    let isWorth = false
    let reason = 'پیام عمومی'
    
    // More specific pattern matching
    if (personalInfoKeywords.some(keyword => lowerContent.includes(keyword))) {
      category = 'personal_info'
      importance = 7
      isWorth = true
      reason = 'حاوی اطلاعات شخصی'
    } else if (goalsKeywords.some(keyword => lowerContent.includes(keyword))) {
      category = 'goals'
      importance = 8
      isWorth = true
      reason = 'بیان هدف یا آرزو'
    } else if (symptomsKeywords.some(keyword => lowerContent.includes(keyword))) {
      category = 'symptoms'
      importance = 8
      isWorth = true
      reason = 'شامل علائم روانی'
    } else if (relationshipKeywords.some(keyword => lowerContent.includes(keyword))) {
      category = 'relationships'
      importance = 7
      isWorth = true
      reason = 'مربوط به روابط خانوادگی'
    }
    
    // Skip very short or common messages
    const commonWords = ['سلام', 'ممنون', 'متشکر', 'خداحافظ', 'چطور', 'خوب']
    if (content.length < 8 || commonWords.some(word => lowerContent.includes(word))) {
      // Only override if not already detected as important
      if (!isWorth) {
        isWorth = false
        reason = 'پیام کوتاه یا تعارفی'
      }
    }
    
    return {
      isWorth,
      reason,
      suggestedCategory: category,
      suggestedImportance: importance,
      extractedInfo: isWorth ? content : undefined
    }
  }

  /**
   * Analyze if a message is worth creating a memory for
   */
  const analyzeMessageWorth = async (content: string): Promise<{
    isWorth: boolean
    reason?: string
    suggestedCategory?: MemoryCategory
    suggestedImportance?: number
    extractedInfo?: string
  }> => {
    try {
      // Check if we have OpenRouter available
      let generateResponse: any
      try {
        const openRouter = useOpenRouter()
        generateResponse = openRouter.generateResponse
      } catch (error) {
        console.warn('OpenRouter not available, using server analysis')
        return await serverAnalysis(content)
      }
      
      const analysisPrompt = `
        پیام زیر را تحلیل کنید و تشخیص دهید آیا اطلاعات مهم و قابل ذخیره‌ای دارد یا خیر:

        "${content}"

        معیارهای ارزیابی:
        - اطلاعات شخصی (نام، سن، شغل، خانواده)
        - اهداف و آرزوها
        - علائم روانی یا مشکلات
        - رویدادهای مهم زندگی
        - روابط و خانواده
        - پیشرفت درمانی
        - محرک‌های استرس
        - اطلاعات پزشکی مهم

        پاسخ را به صورت JSON ارائه دهید:
        {
          "isWorth": true/false,
          "reason": "دلیل تصمیم",
          "category": "personal_info|goals|symptoms|triggers|relationships|progress|preferences|therapy_notes|important_events|other",
          "importance": 1-10,
          "extractedInfo": "اطلاعات استخراج شده برای ذخیره"
        }

        اگر پیام فقط سلام، تشکر یا مکالمه عمومی است، isWorth را false قرار دهید.
      `

      const response = await generateResponse([
        { 
          role: 'system', 
          content: 'شما یک متخصص تحلیل اطلاعات روان‌درمانی هستید که باید تشخیص دهید کدام پیام‌ها حاوی اطلاعات مهم قابل ذخیره هستند.' 
        },
        { role: 'user', content: analysisPrompt }
      ], {
        model: 'anthropic/claude-3.5-haiku',
        temperature: 0.1,
        max_tokens: 300
      })

      // Parse JSON response
      const cleanedResponse = response.trim()
      const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/)
      
      if (!jsonMatch) {
        throw new Error('Invalid JSON response from analysis')
      }

      const analysis = JSON.parse(jsonMatch[0])
      
      return {
        isWorth: analysis.isWorth || false,
        reason: analysis.reason,
        suggestedCategory: analysis.category as MemoryCategory,
        suggestedImportance: analysis.importance,
        extractedInfo: analysis.extractedInfo
      }

    } catch (error) {
      console.warn('Error analyzing message worth:', error)
      // Fall back to basic analysis instead of failing
      return fallbackAnalysis(content)
    }
  }

  /**
   * Send a message with automatic memory extraction and context injection
   */
  const sendEnhancedMessage = async (
    content: string, 
    sessionId?: string,
    options: {
      extractMemories?: boolean
      injectContext?: boolean
      memoryCategories?: MemoryCategory[]
      showToasts?: boolean
    } = {}
  ) => {
    try {
      const { 
        extractMemories = true, 
        injectContext = true,
        memoryCategories = ['personal_info', 'goals', 'symptoms', 'triggers', 'relationships'],
        showToasts = true
      } = options

      let enhancedContent = content

      // 1. Inject relevant memories as context if enabled
      if (injectContext && user.value?.id) {
        try {
          const contextResult = await getSessionContext(content, sessionId)
          if (contextResult.contextPrompt) {
            // Add context to the system message or prepend to user message
            enhancedContent = contextResult.contextPrompt + content
          }
        } catch (error) {
          console.warn('Failed to get session context:', error)
        }
      }

      // 2. Save the message
      const savedMessage = await saveMessage({
        role: 'user',
        content: enhancedContent,
        session: sessionId,
        user: user.value?.id,
        deletionDivider: user.value?.currentDeletionDivider || 0,
        created: new Date().toISOString()
      })

      // 3. Analyze and extract memories from user message if enabled
      if (extractMemories && user.value?.id) {
        try {
          // First analyze if the message is worth storing as a memory
          const analysis = await analyzeMessageWorth(content)
          
          if (analysis.isWorth && analysis.extractedInfo) {
            // Create memory with analyzed information
            const memoryResult = await addMemory(
              analysis.extractedInfo, 
              analysis.suggestedCategory || 'other',
              {
                sourceType: 'therapy_session',
                sourceId: savedMessage.id,
                sessionId: sessionId,
                importance: analysis.suggestedImportance || 5,
                tags: ['auto_extracted', 'therapy', analysis.suggestedCategory || 'other'],
                metadata: {
                  analysis_reason: analysis.reason,
                  original_message: content.substring(0, 100) + (content.length > 100 ? '...' : '')
                }
              }
            )

            // Show toast notification if enabled
            if (showToasts) {
              const toaster = useToaster()
              const categoryLabels: { [key: string]: string } = {
                personal_info: 'اطلاعات شخصی',
                goals: 'اهداف',
                symptoms: 'علائم',
                triggers: 'محرک‌ها',
                relationships: 'روابط',
                progress: 'پیشرفت',
                preferences: 'تنظیمات',
                therapy_notes: 'یادداشت درمانی',
                important_events: 'رویداد مهم',
                other: 'سایر'
              }

              const categoryLabel = categoryLabels[analysis.suggestedCategory || 'other']
              const importanceEmoji = analysis.suggestedImportance && analysis.suggestedImportance >= 8 ? '🔥' : 
                                   analysis.suggestedImportance && analysis.suggestedImportance >= 6 ? '⭐' : '💡'

              toaster.show({
                title: `${importanceEmoji} خاطره جدید ذخیره شد`,
                message: `${categoryLabel}: ${analysis.extractedInfo.substring(0, 60)}${analysis.extractedInfo.length > 60 ? '...' : ''}`,
                color: 'success',
                icon: 'ph:brain-duotone',
                closable: true,
                duration: 5000,
                actions: [
                  {
                    label: 'مشاهده خاطرات',
                    color: 'primary',
                    size: 'sm',
                    to: '/memories'
                  }
                ]
              })
            }
          }
          
          // Also do the comprehensive extraction for additional context (but without toast)
          await extractAndStoreMemories(content, {
            sourceType: 'therapy_session',
            sourceId: savedMessage.id,
            sessionId: sessionId,
            categories: memoryCategories,
            skipToasts: true // Don't show additional toasts for comprehensive extraction
          })
          
        } catch (error) {
          console.warn('Failed to analyze and extract memories:', error)
        }
      }

      return savedMessage

    } catch (error) {
      console.error('Error in enhanced messaging:', error)
      throw error
    }
  }

  /**
   * Process AI response and extract memories
   */
  const processAIResponse = async (
    aiResponse: string,
    userMessage: string,
    sessionId?: string
  ) => {
    try {
      // Save AI response
      const savedResponse = await saveMessage({
        role: 'assistant',
        content: aiResponse,
        session: sessionId,
        user: user.value?.id,
        deletionDivider: user.value?.currentDeletionDivider || 0,
        created: new Date().toISOString()
      })

      // Extract memories from the conversation context
      if (user.value?.id) {
        const conversationContext = `
          مراجع گفت: ${userMessage}
          مشاور پاسخ داد: ${aiResponse}
        `

        await extractAndStoreMemories(conversationContext, {
          sourceType: 'therapy_session',
          sourceId: savedResponse.id,
          sessionId: sessionId,
          importance: 7 // AI responses are generally important
        })
      }

      return savedResponse

    } catch (error) {
      console.error('Error processing AI response:', error)
      throw error
    }
  }

  /**
   * Extract and store memories from content using intelligent parsing
   */
  const extractAndStoreMemories = async (
    content: string,
    options: {
      sourceType?: MemorySource
      sourceId?: string
      sessionId?: string
      importance?: number
      categories?: MemoryCategory[]
      skipToasts?: boolean
    } = {}
  ) => {
    if (!user.value?.id) return

    const {
      sourceType = 'therapy_session',
      sourceId,
      sessionId,
      importance = 6,
      categories = ['personal_info', 'goals', 'symptoms', 'triggers', 'relationships', 'progress'],
      skipToasts = false
    } = options

    try {
      // Use AI to extract structured memories
      const extractionPrompts = {
        personal_info: `اطلاعات شخصی مراجع مانند نام، سن، شغل، تحصیلات، وضعیت تأهل و خانواده را از این متن استخراج کنید:`,
        goals: `اهداف درمانی، آرزوها و انگیزه‌های مراجع را از این متن استخراج کنید:`,
        symptoms: `علائم روانی، احساسات منفی، نشانه‌های اضطراب یا افسردگی را از این متن استخراج کنید:`,
        triggers: `عوامل محرک استرس، موقعیت‌های مشکل‌زا و الگوهای رفتاری مضر را از این متن استخراج کنید:`,
        relationships: `اطلاعات روابط خانوادگی، دوستان، همکاران و مسائل ارتباطی را از این متن استخراج کنید:`,
        progress: `پیشرفت درمانی، بهبودی، تغییرات مثبت و دستاوردهای مراجع را از این متن استخراج کنید:`
      }

      // Extract memories for each category
      for (const category of categories) {
        const prompt = extractionPrompts[category]
        if (!prompt) continue

        try {
          const extractedInfo = await extractSpecificMemory(content, prompt, category)
          if (extractedInfo && extractedInfo.trim()) {
            await addMemory(extractedInfo, category, {
              sourceType,
              sourceId,
              sessionId,
              importance,
              tags: [category, 'extracted', 'therapy']
            })
          }
        } catch (error) {
          console.warn(`Failed to extract ${category} memory:`, error)
        }
      }

      // Also extract general important information
      await extractImportantEvents(content, {
        sourceType,
        sourceId,
        sessionId,
        importance
      })

    } catch (error) {
      console.error('Error in memory extraction:', error)
    }
  }

  /**
   * Extract specific category of memory using AI
   */
  const extractSpecificMemory = async (
    content: string,
    prompt: string,
    category: MemoryCategory
  ): Promise<string | null> => {
    try {
      // Use OpenRouter to extract specific information
      let generateResponse: any
      try {
        const openRouter = useOpenRouter()
        generateResponse = openRouter.generateResponse
      } catch (error) {
        console.warn('OpenRouter not available for specific memory extraction')
        // For development, just return the content if it seems relevant
        if (content.length > 15 && !['سلام', 'ممنون'].some(word => content.includes(word))) {
          return content.substring(0, 100)
        }
        return null
      }
      
      const extractionPrompt = `
        ${prompt}
        
        متن جلسه:
        "${content}"
        
        دستورالعمل‌ها:
        - فقط اطلاعات مرتبط با دسته "${category}" را استخراج کنید
        - اگر اطلاعات مرتبطی وجود ندارد، پاسخ خالی دهید
        - پاسخ باید کوتاه، مفید و قابل استفاده در آینده باشد
        - از زبان فارسی استفاده کنید
        
        استخراج شده:
      `

      const response = await generateResponse([
        { role: 'system', content: 'شما یک متخصص استخراج اطلاعات از جلسات روان‌درمانی هستید.' },
        { role: 'user', content: extractionPrompt }
      ], {
        model: 'anthropic/claude-3.5-haiku',
        temperature: 0.1,
        max_tokens: 200
      })

      // Clean up the response
      const extracted = response.trim()
      return extracted.length > 10 ? extracted : null

    } catch (error) {
      console.error('Error extracting specific memory:', error)
      return null
    }
  }

  /**
   * Extract important events and milestones
   */
  const extractImportantEvents = async (
    content: string,
    options: {
      sourceType?: MemorySource
      sourceId?: string
      sessionId?: string
      importance?: number
    }
  ) => {
    try {
      let generateResponse: any
      try {
        const openRouter = useOpenRouter()
        generateResponse = openRouter.generateResponse
      } catch (error) {
        console.warn('OpenRouter not available for important events extraction')
        return // Skip if no AI available
      }
      
      const prompt = `
        رویدادهای مهم، تصمیمات بزرگ، تغییرات زندگی، بحران‌ها یا نقاط عطف را از این متن جلسه روان‌درمانی استخراج کنید:
        
        "${content}"
        
        فقط رویدادهای واقعاً مهم را که تأثیر قابل توجهی بر زندگی مراجع دارند استخراج کنید.
        اگر رویداد مهمی وجود ندارد، پاسخ خالی دهید.
      `

      const response = await generateResponse([
        { role: 'system', content: 'شما یک روان‌شناس متخصص در تحلیل رویدادهای مهم زندگی هستید.' },
        { role: 'user', content: prompt }
      ], {
        model: 'anthropic/claude-3.5-haiku',
        temperature: 0.1,
        max_tokens: 150
      })

      const extracted = response.trim()
      if (extracted && extracted.length > 10) {
        await addMemory(extracted, 'important_events', {
          ...options,
          importance: (options.importance || 6) + 2, // Important events get higher importance
          tags: ['important', 'milestone', 'life_event']
        })
      }

    } catch (error) {
      console.error('Error extracting important events:', error)
    }
  }

  /**
   * Get personalized therapy context based on stored memories
   */
  const getPersonalizedContext = async (currentMessage: string, sessionId?: string) => {
    try {
      if (!user.value?.id) return ''

      // Search for relevant memories
      const searchResult = await searchMemories(currentMessage, {
        limit: 8,
        minImportance: 5,
        sessionId
      })

      const relevantMemories = [
        ...searchResult.mem0Results,
        ...searchResult.localResults.map(item => ({
          content: item.content,
          category: item.category,
          importance: item.importance
        }))
      ]

      if (relevantMemories.length === 0) return ''

      // Create personalized context
      let context = '\n--- اطلاعات شخصی مراجع ---\n'
      
      const groupedByCategory: { [key: string]: any[] } = {}
      relevantMemories.forEach(memory => {
        const category = memory.category || 'other'
        if (!groupedByCategory[category]) {
          groupedByCategory[category] = []
        }
        groupedByCategory[category].push(memory)
      })

      // Add memories by category
      Object.entries(groupedByCategory).forEach(([category, memories]) => {
        const categoryLabels: { [key: string]: string } = {
          personal_info: 'اطلاعات شخصی',
          goals: 'اهداف درمانی',
          symptoms: 'علائم',
          triggers: 'محرک‌ها',
          relationships: 'روابط',
          progress: 'پیشرفت',
          preferences: 'تنظیمات',
          therapy_notes: 'یادداشت‌های درمانی',
          important_events: 'رویدادهای مهم'
        }

        context += `\n${categoryLabels[category] || category}:\n`
        memories.forEach(memory => {
          context += `- ${memory.content}\n`
        })
      })

      context += '\n--- پایان اطلاعات شخصی ---\n\n'
      context += 'لطفاً از این اطلاعات برای ارائه پاسخ شخصی‌سازی شده و مرتبط استفاده کنید.\n'

      return context

    } catch (error) {
      console.error('Error getting personalized context:', error)
      return ''
    }
  }

  /**
   * End session and generate summary memories
   */
  const endSessionWithMemoryExtraction = async (sessionId: string) => {
    try {
      if (!user.value?.id || !sessionId) return

      // Get all messages from this session
      const messages = await getMessages()
      const sessionMessages = messages.filter(m => m.session === sessionId)

      if (sessionMessages.length === 0) return

      // Create session summary
      const conversationText = sessionMessages
        .map(m => `${m.role === 'user' ? 'مراجع' : 'مشاور'}: ${m.content}`)
        .join('\n')

      // Extract comprehensive session memories
      await extractSessionMemories(conversationText, sessionId)

      // Create session summary memory
      const { generateResponse } = useOpenRouter()
      const summaryPrompt = `
        خلاصه‌ای از این جلسه روان‌درمانی ایجاد کنید:
        
        ${conversationText}
        
        خلاصه باید شامل موارد زیر باشد:
        - موضوعات کلیدی که بحث شد
        - پیشرفت مراجع
        - مسائل مهم که مطرح شد
        - برنامه‌ریزی برای جلسات آینده
        
        خلاصه را در ۲-۳ جمله بنویسید.
      `

      const sessionSummary = await generateResponse([
        { role: 'system', content: 'شما یک روان‌درمانگر متخصص هستید که خلاصه جلسات ایجاد می‌کنید.' },
        { role: 'user', content: summaryPrompt }
      ], {
        model: 'anthropic/claude-3.5-haiku',
        temperature: 0.2,
        max_tokens: 200
      })

      // Store session summary
      await addMemory(sessionSummary, 'therapy_notes', {
        sourceType: 'therapy_session',
        sessionId: sessionId,
        importance: 8,
        tags: ['session_summary', 'therapy', 'important'],
        metadata: {
          session_date: new Date().toISOString(),
          message_count: sessionMessages.length
        }
      })

      return sessionSummary

    } catch (error) {
      console.error('Error ending session with memory extraction:', error)
      throw error
    }
  }

  return {
    // Core enhanced messaging
    sendEnhancedMessage,
    processAIResponse,
    
    // Memory analysis
    analyzeMessageWorth,
    
    // Memory extraction
    extractAndStoreMemories,
    extractSpecificMemory,
    extractImportantEvents,
    
    // Context and personalization
    getPersonalizedContext,
    
    // Session management
    endSessionWithMemoryExtraction
  }
}

export default useEnhancedMessaging