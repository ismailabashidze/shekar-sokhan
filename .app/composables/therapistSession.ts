import type { Session, SessionStatus } from './session'
import { useUser } from './user'

export function useTherapistSession() {
  const nuxtApp = useNuxtApp()
  const { user } = useUser()

  const getCurrentSession = async (therapistId: string) => {

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

  const createSession = async (therapistId: string, sessionType: string) => {
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
      session_type: sessionType || 'therapic',
    }

    try {
      return await nuxtApp.$pb.collection('sessions').create(sessionData)
    }
    catch (error: any) {
      if (error?.isAbort) return null
      throw error
    }
  }

  const endSession = async (sessionId: string, analysisId: string) => {
    try {
      const session = await nuxtApp.$pb.collection('sessions').getOne(sessionId)
      const messagesResult = await nuxtApp.$pb.collection('therapists_messages').getList(1, 1000, {
        filter: `session = "${sessionId}"`,
      })
      const messageCount = messagesResult.items.length

      // Calculate session duration
      const startTime = new Date(session.start_time || session.created)
      const endTime = new Date()
      const totalTimePassedMinutes = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60))

      return await nuxtApp.$pb.collection('sessions').update(sessionId, {
        status: 'done',
        end_time: endTime.toISOString(),
        count_of_total_messages: messageCount,
        total_time_passed: totalTimePassedMinutes,
        session_analysis_for_system: analysisId
      })
    }
    catch (error: any) {
      console.error('Error ending session:', error)
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
