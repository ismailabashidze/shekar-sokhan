export type MessageType = 'sent' | 'received'

export type Message = {
  id: string
  therapist: string // Relation to therapist record
  user: string // Relation to user record
  type: MessageType
  text: string
  time: string // ISO date string
  conversation: string // Relation to conversation record
  created?: string
  updated?: string
}

export function useTherapistsMessages() {
  const nuxtApp = useNuxtApp()
  const { role } = useUser()

  const isAdmin = computed(() => role.value === 'admin')

  const getMessages = async (sessionId: string) => {
    if (!nuxtApp.$pb.authStore.isValid) {
      throw new Error('User not authenticated')
    }

    try {
      const data = await nuxtApp.$pb.collection('therapists_messages').getFullList({
        sort: 'created',
        filter: `session = "${sessionId}" && user = "${nuxtApp.$pb.authStore.model.id}"`,
        expand: 'therapist,user',
        batch: 100,
      })
      console.log(`session = "${sessionId}" && user = "${nuxtApp.$pb.authStore.model.id}"`)
      return data
    }
    catch (error: any) {
      if (error?.isAbort) {
        console.log('Request was cancelled')
        return []
      }
      throw error
    }
  }

  const getMessagesForAdmin = async (sessionId: string) => {
    if (!nuxtApp.$pb.authStore.isValid) {
      throw new Error('User not authenticated')
    }

    if (!isAdmin.value) {
      throw new Error('Unauthorized: Admin access required')
    }

    try {
      const data = await nuxtApp.$pb.collection('therapists_messages').getFullList({
        sort: 'created',
        filter: `session = "${sessionId}"`,
        expand: 'therapist,user',
        batch: 100,
      })
      console.log(`[Admin] session = "${sessionId}"`)
      return data
    }
    catch (error: any) {
      if (error?.isAbort) {
        console.log('Request was cancelled')
        return []
      }
      throw error
    }
  }

  const sendMessage = async (therapistId: string, sessionId: string, text: string, type: MessageType = 'sent') => {
    if (!nuxtApp.$pb.authStore.isValid) {
      throw new Error('User not authenticated')
    }
    const messageData = {
      therapist: therapistId,
      user: nuxtApp.$pb.authStore.model.id,
      session: sessionId,
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

  return {
    getMessages,
    getMessagesForAdmin,
    sendMessage,
    deleteMessage,
    updateMessage,
  }
}
