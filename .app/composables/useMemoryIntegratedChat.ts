/**
 * Example integration of memory system with existing chat functionality
 * This composable shows how to integrate memory analysis with any existing chat system
 */

export const useMemoryIntegratedChat = () => {
  const { analyzeMessageWorth, sendEnhancedMessage } = useEnhancedMessaging()
  const { addMemory } = useMem0()
  const { user } = useUser()
  const toaster = useToaster()

  /**
   * Process user message with automatic memory detection and storage
   * This can be integrated into any existing sendMessage function
   */
  const sendMessageWithMemoryAnalysis = async (
    therapistId: string,
    sessionId: string,
    messageContent: string,
    type: 'sent' | 'received' = 'sent',
    options: {
      showAnalysisToast?: boolean
      showMemoryToast?: boolean
      extractMemories?: boolean
    } = {}
  ) => {
    const {
      showAnalysisToast = false,
      showMemoryToast = true,
      extractMemories = true
    } = options

    try {
      // 1. Send the message using existing system
      const savedMessage = await sendExistingMessage(therapistId, sessionId, messageContent, type)

      // 2. Only analyze user messages (type 'sent') for memory extraction
      if (extractMemories && user.value?.id && type === 'sent') {
        const analysis = await analyzeMessageWorth(messageContent)
        
        // Show analysis result if requested (for debugging)
        if (showAnalysisToast) {
          toaster.show({
            title: analysis.isWorth ? '🎯 اطلاعات مهم شناسایی شد' : '💬 پیام معمولی',
            message: analysis.reason || 'تحلیل انجام شد',
            color: analysis.isWorth ? 'info' : 'muted',
            duration: 2000,
            closable: true
          })
        }

        // 3. If worth storing, create memory and show toast
        if (analysis.isWorth && analysis.extractedInfo) {
          await storeMemoryWithToast(
            analysis.extractedInfo,
            analysis.suggestedCategory || 'other',
            {
              importance: analysis.suggestedImportance || 5,
              sourceType: 'therapy_session',
              sourceId: savedMessage.id,
              sessionId,
              reason: analysis.reason
            },
            showMemoryToast
          )
        }
      }

      return savedMessage

    } catch (error) {
      console.error('Error in memory-integrated chat:', error)
      throw error
    }
  }

  /**
   * Store memory and show toast notification
   */
  const storeMemoryWithToast = async (
    content: string,
    category: any,
    metadata: any,
    showToast = true
  ) => {
    try {
      const memoryResult = await addMemory(content, category, {
        importance: metadata.importance,
        sourceType: metadata.sourceType,
        sourceId: metadata.sourceId,
        sessionId: metadata.sessionId,
        tags: ['auto_extracted', 'analyzed', category],
        metadata: {
          analysis_reason: metadata.reason,
          auto_generated: true
        }
      })

      if (showToast) {
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

        const categoryLabel = categoryLabels[category] || 'اطلاعات جدید'
        const importanceEmoji = metadata.importance >= 8 ? '🔥' : 
                               metadata.importance >= 6 ? '⭐' : '💡'

        toaster.show({
          title: `${importanceEmoji} خاطره جدید ذخیره شد`,
          message: `${categoryLabel}: ${content.substring(0, 50)}${content.length > 50 ? '...' : ''}`,
          color: 'success',
          icon: 'ph:brain-duotone',
          closable: true,
          duration: 4000,
          actions: [
            {
              label: 'مشاهده',
              color: 'primary',
              size: 'sm',
              to: '/memories'
            }
          ]
        })
      }

      return memoryResult

    } catch (error) {
      console.error('Error storing memory:', error)
      throw error
    }
  }

  /**
   * Actual therapist message sending function
   * Uses the existing useTherapistsMessages composable
   */
  const sendExistingMessage = async (
    therapistId: string, 
    sessionId: string, 
    content: string, 
    type: 'sent' | 'received' = 'sent'
  ) => {
    const { sendMessage } = useTherapistsMessages()
    return await sendMessage(therapistId, sessionId, content, type)
  }

  /**
   * Simple wrapper that can replace existing sendMessage calls
   * Matches the signature of useTherapistsMessages().sendMessage
   */
  const sendMessage = async (
    therapistId: string, 
    sessionId: string, 
    content: string, 
    type: 'sent' | 'received' = 'sent'
  ) => {
    return await sendMessageWithMemoryAnalysis(therapistId, sessionId, content, type)
  }

  /**
   * Manual memory extraction from any text
   * Useful for processing existing conversations
   */
  const extractMemoryFromText = async (
    text: string, 
    showToast = true,
    sessionId?: string
  ) => {
    try {
      const analysis = await analyzeMessageWorth(text)
      
      if (analysis.isWorth && analysis.extractedInfo) {
        return await storeMemoryWithToast(
          analysis.extractedInfo,
          analysis.suggestedCategory || 'other',
          {
            importance: analysis.suggestedImportance || 5,
            sourceType: 'user_input',
            sessionId,
            reason: analysis.reason
          },
          showToast
        )
      }
      
      return null

    } catch (error) {
      console.error('Error extracting memory from text:', error)
      return null
    }
  }

  /**
   * Batch process multiple messages for memory extraction
   * Useful for processing chat history
   */
  const batchProcessMessages = async (
    messages: Array<{ content: string, id?: string, sessionId?: string }>,
    showProgress = true
  ) => {
    const results = []
    let processed = 0

    for (const message of messages) {
      try {
        const result = await extractMemoryFromText(
          message.content, 
          false, // Don't show individual toasts
          message.sessionId
        )
        
        if (result) {
          results.push(result)
        }
        
        processed++
        
        if (showProgress && processed % 5 === 0) {
          toaster.show({
            title: 'پردازش پیام‌ها',
            message: `${processed} از ${messages.length} پیام پردازش شد`,
            color: 'info',
            duration: 1000
          })
        }
        
      } catch (error) {
        console.warn(`Error processing message ${message.id}:`, error)
      }
    }

    if (showProgress) {
      toaster.show({
        title: 'پردازش کامل شد',
        message: `${results.length} خاطره جدید از ${processed} پیام استخراج شد`,
        color: 'success',
        icon: 'ph:check-circle-duotone',
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

    return results
  }

  return {
    // Main integration functions
    sendMessage,
    sendMessageWithMemoryAnalysis,
    
    // Manual memory extraction
    extractMemoryFromText,
    batchProcessMessages,
    
    // Utility functions
    storeMemoryWithToast,
    analyzeMessageWorth
  }
}

export default useMemoryIntegratedChat