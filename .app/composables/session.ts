export type SessionType = 'educational' | 'therapic'
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
  analysis: any
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
    if (!nuxtApp.$pb.authStore.isValid) {
      throw new Error('User not authenticated')
    }

    try {
      let filterStr = `user = "${nuxtApp.$pb.authStore.model?.id}"`

      if (filter?.status) {
        filterStr += ` && status = "${filter.status}"`
      }
      if (filter?.therapistId) {
        filterStr += ` && therapist = "${filter.therapistId}"`
      }
      if (filter?.patientId) {
        filterStr += ` && patient = "${filter.patientId}"`
      }

      return await nuxtApp.$pb.collection('conversations').getFullList({
        sort: '-created',
        filter: filterStr,
        expand: 'user',
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

  const getSession = async (id: string) => {
    if (!nuxtApp.$pb.authStore.isValid) {
      throw new Error('User not authenticated')
    }

    try {
      return await nuxtApp.$pb.collection('conversations').getOne(id, {
        expand: 'user',
      })
    }
    catch (error: any) {
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
      return await nuxtApp.$pb.collection('conversations').create(sessionData)
    }
    catch (error: any) {
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
      return await nuxtApp.$pb.collection('conversations').update(id, data)
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
    getSessions,
    getSession,
    createSession,
    updateSession,
  }
}
