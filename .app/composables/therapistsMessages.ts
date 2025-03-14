export type MessageType = 'sent' | 'received' | 'separator'

export type Message = {
  id: string
  therapist: string // Relation to therapist record
  user: string // Relation to user record
  type: MessageType
  text: string
  time: string // ISO date string
  created?: string
  updated?: string
}

export function useTherapistsMessages() {
  const nuxtApp = useNuxtApp()
  const selectedTherapistId = ref<string | null>(null)

  const getMessages = async (therapistId: string) => {
    if (!nuxtApp.$pb.authStore.isValid) {
      throw new Error('User not authenticated')
    }
    selectedTherapistId.value = therapistId
    try {
      return await nuxtApp.$pb.collection('therapists_messages').getFullList({
        sort: 'created',
        filter: `therapist = "${therapistId}" && user = "${nuxtApp.$pb.authStore.model.id}"`,
        expand: 'therapist,user',
        batch: 100, // Process in smaller batches
      })
    }
    catch (error: any) {
      if (error?.isAbort) {
        console.log('Request was cancelled')
        return []
      }
      throw error
    }
  }

  const sendMessage = async (therapistId: string, text: string, type: MessageType = 'sent') => {
    if (!nuxtApp.$pb.authStore.isValid) {
      throw new Error('User not authenticated')
    }
    const messageData = {
      therapist: therapistId,
      user: nuxtApp.$pb.authStore.model.id,
      type,
      text,
      time: new Date().toISOString(),
    }

    try {
      return await nuxtApp.$pb.collection('therapists_messages').create(messageData)
    }
    catch (error: any) {
      if (error?.isAbort) {
        console.log('Request was cancelled')
        return null
      }
      throw error
    }
  }

  const createSeparator = async (therapistId: string, text: string = '') => {
    if (!nuxtApp.$pb.authStore.isValid) {
      throw new Error('User not authenticated')
    }
    return await sendMessage(therapistId, text, 'separator')
  }

  const deleteMessage = async (messageId: string) => {
    if (!nuxtApp.$pb.authStore.isValid) {
      throw new Error('User not authenticated')
    }
    try {
      await nuxtApp.$pb.collection('therapists_messages').delete(messageId)
      return true
    }
    catch (error: any) {
      if (error?.isAbort) {
        console.log('Request was cancelled')
        return false
      }
      throw error
    }
  }

  const updateMessage = async (messageId: string, data: Partial<Message>) => {
    if (!nuxtApp.$pb.authStore.isValid) {
      throw new Error('User not authenticated')
    }
    try {
      return await nuxtApp.$pb.collection('therapists_messages').update(messageId, data)
    }
    catch (error: any) {
      if (error?.isAbort) {
        console.log('Request was cancelled')
        return null
      }
      throw error
    }
  }

  const clearMessages = async (therapistId: string) => {
    try {
      // Get all messages for this therapist
      const records = await nuxtApp.$pb.collection('therapists_messages').getFullList({
        filter: `therapist = "${therapistId}" && user = "${nuxtApp.$pb.authStore.model.id}"`,
      })

      // Delete all messages in parallel
      await Promise.all(
        records.map(record =>
          nuxtApp.$pb.collection('therapists_messages').delete(record.id),
        ),
      )

      return true
    }
    catch (error) {
      console.error('Error clearing messages:', error)
      throw error
    }
  }

  return {
    selectedTherapistId,
    getMessages,
    sendMessage,
    createSeparator,
    deleteMessage,
    updateMessage,
    clearMessages,
  }
}
