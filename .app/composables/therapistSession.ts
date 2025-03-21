import type { Session, SessionStatus } from './session'
import { useUser } from './user'

export function useTherapistSession() {
  const nuxtApp = useNuxtApp()
  const { user } = useUser()

  const getCurrentSession = async (therapistId: string) => {
    if (!nuxtApp.$pb.authStore.isValid || !nuxtApp.$pb.authStore.model?.id) {
      throw new Error('User not authenticated')
    }

    try {
      const records = await nuxtApp.$pb.collection('sessions').getFullList({
        sort: '-created',
        filter: `user = "${nuxtApp.$pb.authStore.model.id}" && therapist = "${therapistId}" && status = "inprogress"`,
        expand: 'user,therapist',
      })
      return records[0]
    }
    catch (error: any) {
      if (error?.isAbort) return null
      throw error
    }
  }

  const createSession = async (therapistId: string) => {
    if (!nuxtApp.$pb.authStore.isValid || !nuxtApp.$pb.authStore.model?.id) {
      throw new Error('User not authenticated')
    }

    const sessionData = {
      user: nuxtApp.$pb.authStore.model.id,
      therapist: therapistId,
      status: 'inprogress' as SessionStatus,
      start_time: new Date().toISOString(),
      count_of_total_messages: 0,
      total_time_passed: 0,
      session_type: 'therapic',
    }

    try {
      return await nuxtApp.$pb.collection('sessions').create(sessionData)
    }
    catch (error: any) {
      if (error?.isAbort) return null
      throw error
    }
  }

  const endSession = async (sessionId: string) => {
    if (!nuxtApp.$pb.authStore.isValid || !nuxtApp.$pb.authStore.model?.id) {
      throw new Error('User not authenticated')
    }

    try {
      return await nuxtApp.$pb.collection('sessions').update(sessionId, {
        status: 'done' as SessionStatus,
        end_time: new Date().toISOString(),
      })
    }
    catch (error: any) {
      if (error?.isAbort) return null
      throw error
    }
  }

  const getSessionMessages = async (sessionId: string) => {
    if (!nuxtApp.$pb.authStore.isValid || !nuxtApp.$pb.authStore.model?.id) {
      throw new Error('User not authenticated')
    }

    try {
      return await nuxtApp.$pb.collection('messages').getFullList({
        sort: 'created',
        filter: `conversation = "${sessionId}"`,
      })
    }
    catch (error: any) {
      if (error?.isAbort) return []
      throw error
    }
  }

  const sendSessionMessage = async (sessionId: string, text: string, type: 'sent' | 'received') => {
    if (!nuxtApp.$pb.authStore.isValid || !nuxtApp.$pb.authStore.model?.id) {
      throw new Error('User not authenticated')
    }

    try {
      const message = await nuxtApp.$pb.collection('messages').create({
        text,
        type,
        conversation: sessionId,
        user: nuxtApp.$pb.authStore.model.id,
      })

      // Update session message count
      await nuxtApp.$pb.collection('sessions').update(sessionId, {
        count_of_total_messages: {
          '+': 1,
        },
      })

      return message
    }
    catch (error: any) {
      if (error?.isAbort) return null
      throw error
    }
  }

  return {
    getCurrentSession,
    createSession,
    endSession,
    getSessionMessages,
    sendSessionMessage,
  }
}
