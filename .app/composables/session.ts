import { useSessionGoals } from './useSessionGoals'

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
  session_analysis_for_system: SessionAnalysis
  created?: string
  updated?: string
}

export type SessionFilter = {
  status?: SessionStatus
  therapistId?: string
  patientId?: string
}

export type AdminSessionFilter = {
  status?: SessionStatus
  session_type?: SessionType
  search?: string
  page?: number
  perPage?: number
  sort?: string
}

export function useSessions() {
  const nuxtApp = useNuxtApp()

  const getSessions = async (filter?: SessionFilter) => {
    if (!nuxtApp.$pb.authStore.isValid) {
      throw new Error('User not authenticated')
    }

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
      return await nuxtApp.$pb.collection('sessions').getOne(id, {
        expand: 'user,therapist,session_analysis_for_system',
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
      const session = await nuxtApp.$pb.collection('sessions').create(sessionData)
      
      // Auto-generate first session goals if this is the user's first session
      if (session && session.id) {
        try {
          const { createFirstSessionGoals } = useSessionGoals()
          await createFirstSessionGoals(
            session.id,
            session.user,
            session.therapist || 'ai-therapist' // Default therapist ID for AI sessions
          )
        } catch (goalError) {
          console.error('Error creating first session goals:', goalError)
          // Don't throw error here to prevent session creation failure
        }
      }
      
      return session
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
      return await nuxtApp.$pb.collection('sessions').update(id, data)
    }
    catch (error: any) {
      if (error?.isAbort) {
        console.log('Request was cancelled')
        return null
      }
      throw error
    }
  }

  const getAllSessionsForAdmin = async (filter?: AdminSessionFilter) => {
    if (!nuxtApp.$pb.authStore.isValid) {
      throw new Error('User not authenticated')
    }

    // Check if user is admin
    const userRole = nuxtApp.$pb.authStore.model?.role
    if (userRole !== 'admin') {
      throw new Error('Access denied: Admin privileges required')
    }

    try {
      // Build filter string
      let filterStr = ''
      const filterConditions = []

      if (filter?.status) {
        filterConditions.push(`status = "${filter.status}"`)
      }
      if (filter?.session_type) {
        filterConditions.push(`session_type = "${filter.session_type}"`)
      }
      if (filter?.search) {
        // Search in user name, email, or therapist name
        const searchTerm = filter.search.toLowerCase()
        filterConditions.push(`(user.name ~ "${searchTerm}" || user.email ~ "${searchTerm}" || therapist.name ~ "${searchTerm}")`)
      }

      if (filterConditions.length > 0) {
        filterStr = filterConditions.join(' && ')
      }

      // Pagination parameters
      const page = filter?.page || 1
      const perPage = filter?.perPage || 10
      const sort = filter?.sort || '-created'

      // Fetch sessions with pagination
      const result = await nuxtApp.$pb.collection('sessions').getList(page, perPage, {
        sort,
        filter: filterStr,
        expand: 'user,therapist,session_analysis_for_system',
      })

      return {
        items: result.items,
        page: result.page,
        perPage: result.perPage,
        totalItems: result.totalItems,
        totalPages: result.totalPages,
      }
    }
    catch (error: any) {
      if (error?.isAbort) {
        console.log('Request was cancelled')
        return {
          items: [],
          page: 1,
          perPage: 10,
          totalItems: 0,
          totalPages: 0,
        }
      }
      throw error
    }
  }

  const getSessionsByUserId = async (userId: string, filter?: { status?: SessionStatus, session_type?: SessionType }) => {
    if (!nuxtApp.$pb.authStore.isValid) {
      throw new Error('User not authenticated')
    }

    // Check if user is admin (required to view other users' sessions)
    const userRole = nuxtApp.$pb.authStore.model?.role
    if (userRole !== 'admin') {
      throw new Error('Access denied: Admin privileges required')
    }

    try {
      // Build filter string
      let filterStr = `user = "${userId}"`
      const filterConditions = [filterStr]

      if (filter?.status) {
        filterConditions.push(`status = "${filter.status}"`)
      }
      if (filter?.session_type) {
        filterConditions.push(`session_type = "${filter.session_type}"`)
      }

      const finalFilter = filterConditions.join(' && ')

      // Fetch all sessions for the user
      const result = await nuxtApp.$pb.collection('sessions').getFullList({
        sort: '-created',
        filter: finalFilter,
        expand: 'user,therapist,session_analysis_for_system',
      })

      return result
    }
    catch (error: any) {
      if (error?.isAbort) {
        console.log('Request was cancelled')
        return []
      }
      throw error
    }
  }

  return {
    getSessions,
    getSession,
    createSession,
    updateSession,
    getAllSessionsForAdmin,
    getSessionsByUserId,
  }
}
