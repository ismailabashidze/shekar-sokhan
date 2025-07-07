// Composable for managing message analysis

export const useMessageAnalysis = () => {
  const nuxtApp = useNuxtApp()

  /**
   * Create a new message analysis record
   * @param analysisData The analysis result from generateInlineAnalysis
   * @returns The created analysis record
   */
  const createMessageAnalysis = async (analysisData: any) => {
    if (!analysisData) {
      throw new Error('Analysis data is required')
    }

    try {
      return await nuxtApp.$pb.collection('message_analysis').create({
        emotions: analysisData.lastMessage_emotions || [],
        emojis: analysisData.correspondingEmojis || '',
      })
    }
    catch (error) {
      console.error('Error creating message analysis:', error)
      throw error
    }
  }

  /**
   * Link message analysis to a therapist message
   * @param messageId The ID of the therapist message
   * @param analysisId The ID of the message analysis
   */
  const linkAnalysisToMessage = async (messageId: string, analysisId: string) => {
    try {
      return await nuxtApp.$pb.collection('therapists_messages').update(messageId, {
        message_analysis: analysisId,
      })
    }
    catch (error) {
      console.error('Error linking analysis to message:', error)
      throw error
    }
  }

  /**
   * Get message analysis by ID
   * @param analysisId The ID of the message analysis
   * @returns The analysis record
   */
  const getMessageAnalysis = async (analysisId: string) => {
    try {
      return await nuxtApp.$pb.collection('message_analysis').getOne(analysisId)
    }
    catch (error) {
      console.error('Error getting message analysis:', error)
      throw error
    }
  }

  /**
   * Create analysis and link it to message in one operation
   * @param messageId The ID of the therapist message
   * @param analysisData The analysis result from generateInlineAnalysis
   * @returns Object with analysis record and updated message
   */
  const createAndLinkAnalysis = async (messageId: string, analysisData: any) => {
    try {
      // Create analysis record
      const analysisRecord = await createMessageAnalysis(analysisData)

      // Link to message
      const updatedMessage = await linkAnalysisToMessage(messageId, analysisRecord.id)

      return {
        analysis: analysisRecord,
        message: updatedMessage,
      }
    }
    catch (error) {
      console.error('Error creating and linking analysis:', error)
      throw error
    }
  }

  return {
    createMessageAnalysis,
    linkAnalysisToMessage,
    getMessageAnalysis,
    createAndLinkAnalysis,
  }
}
