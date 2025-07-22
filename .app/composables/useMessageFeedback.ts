export interface MessageFeedbackData {
  message_id: string
  session_id: string
  user_id: string
  therapist_id: string
  rating?: number
  message_content?: string
  general_text?: string
  general_other?: string
  problems_categories?: Record<string, any>
  problems_other?: string
  quality_categories?: Record<string, any>
  quality_other?: string
  improvements_categories?: Record<string, any>
  improvements_other?: string
}

export const useMessageFeedback = () => {
  const nuxtApp = useNuxtApp()

  const submitFeedback = async (feedbackData: MessageFeedbackData) => {
    try {
      const record = await nuxtApp.$pb
        .collection('message_feedback')
        .create(feedbackData)
      
      return record
    } catch (error) {
      console.error('Error submitting message feedback:', error)
      throw error
    }
  }

  const getFeedbackForMessage = async (messageId: string) => {
    try {
      const record = await nuxtApp.$pb
        .collection('message_feedback')
        .getFirstListItem(`message_id="${messageId}"`)
      
      return record
    } catch (error) {
      if (error.status === 404) {
        return null
      }
      console.error('Error getting message feedback:', error)
      throw error
    }
  }

  const updateFeedback = async (id: string, feedbackData: Partial<MessageFeedbackData>) => {
    try {
      const record = await nuxtApp.$pb
        .collection('message_feedback')
        .update(id, feedbackData)
      
      return record
    } catch (error) {
      console.error('Error updating message feedback:', error)
      throw error
    }
  }

  const deleteFeedback = async (id: string) => {
    try {
      await nuxtApp.$pb
        .collection('message_feedback')
        .delete(id)
      
      return true
    } catch (error) {
      console.error('Error deleting message feedback:', error)
      throw error
    }
  }

  return {
    submitFeedback,
    getFeedbackForMessage,
    updateFeedback,
    deleteFeedback,
  }
}