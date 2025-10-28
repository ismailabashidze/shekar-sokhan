export type SessionType = 'educational' | 'therapic' | 'therapy_journey'
export type SessionStatus = 'inprogress' | 'done' | 'closed' | 'delete'

export type Session = {
  id: string
  session_type: SessionType
  start_time: string
  end_time: string
  user: string
  status: SessionStatus
  count_of_total_messages: number
  total_time_passed: number
  session_analysis_for_system: SessionAnalysis
  goals?: string[] // Array of goal IDs for therapy_journey sessions
  therapist?: string // Therapist ID for therapy_journey sessions
  assessment_id?: string // Assessment ID for linking to original assessment
  created?: string
  updated?: string
}

export type SessionFilter = {
  status?: SessionStatus
  therapistId?: string
  patientId?: string
}

export function useSessions() {
  const nuxtApp = useNuxtApp()

  const getSessions = async (filter?: SessionFilter) => {
    try {
      // For admin viewing another user's sessions
      if (filter?.patientId) {
        return await nuxtApp.$pb.collection('sessions').getFullList({
          sort: '-created',
          filter: `user = "${filter.patientId}"`,
          expand: 'user,therapist,session_analysis_for_system',
        })
      }

      // Regular user or admin viewing their own sessions
      let filterStr = `user = "${nuxtApp.$pb.authStore.model?.id}"`

      if (filter?.status) {
        filterStr += ` && status = "${filter.status}"`
      }
      if (filter?.therapistId) {
        filterStr += ` && therapist = "${filter.therapistId}"`
      }

      return await nuxtApp.$pb.collection('sessions').getFullList({
        sort: '-created',
        filter: filterStr,
        expand: 'user,therapist,session_analysis_for_system',
      })
    } catch (error: any) {
      if (error?.isAbort) {
        console.log('Request was cancelled')
        return []
      }
      throw error
    }
  }

  const getSession = async (id: string) => {
    if (!nuxtApp.$pb.authStore.isValid) {
      throw new Error('User not authenticated')
    }

    try {
      return await nuxtApp.$pb.collection('sessions').getOne(id, {
        expand: 'user,therapist,session_analysis_for_system',
      })
    } catch (error: any) {
      if (error?.isAbort) {
        console.log('Request was cancelled')
        return null
      }
      throw error
    }
  }

  const createSession = async (data: Partial<Session>) => {
    if (!nuxtApp.$pb.authStore.isValid) {
      throw new Error('User not authenticated')
    }

    const sessionData = {
      ...data,
      user: nuxtApp.$pb.authStore.model.id,
      status: data.status || 'inprogress',
      count_of_total_messages: 0,
      total_time_passed: 0,
    }

    try {
      return await nuxtApp.$pb.collection('sessions').create(sessionData)
    } catch (error: any) {
      if (error?.isAbort) {
        console.log('Request was cancelled')
        return null
      }
      throw error
    }
  }

  const updateSession = async (id: string, data: Partial<Session>) => {
    if (!nuxtApp.$pb.authStore.isValid) {
      throw new Error('User not authenticated')
    }

    try {
      return await nuxtApp.$pb.collection('sessions').update(id, data)
    } catch (error: any) {
      if (error?.isAbort) {
        console.log('Request was cancelled')
        return null
      }
      throw error
    }
  }

  return {
    getSessions,
    getSession,
    createSession,
    updateSession,
  }
}
