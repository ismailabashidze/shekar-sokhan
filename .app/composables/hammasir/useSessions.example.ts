// Example usage of useSessions composable
import { useSessions } from './useSessions'

// In a Vue component or composable
export function useSessionsExample() {
  const {
    // State
    sessionsState,
    sessionsError,
    isSessionsLoading,
    isSessionsCreating,
    isSessionsUpdating,

    // Computed
    userSessions,
    currentSession,

    // Methods
    getUserSessions,
    getSessionById,
    createSession,
    updateSession,
    cancelSession,
  } = useSessions()

  // Example: Fetch user sessions
  const fetchSessions = async () => {
    const result = await getUserSessions(1, 10, 'SCHEDULED')
    if (result) {
      console.log('Fetched sessions:', result.sessions)
    }
  }

  // Example: Get a specific session
  const fetchSession = async (sessionId: string) => {
    const session = await getSessionById(sessionId)
    if (session) {
      console.log('Fetched session:', session)
    }
  }

  // Example: Create a new session
  const createNewSession = async () => {
    const newSessionData = {
      counselorId: 'counselor-123',
      scheduledAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // One week from now
      duration: 60, // 60 minutes
      notes: 'Initial consultation session',
    }

    const newSession = await createSession(newSessionData)
    if (newSession) {
      console.log('Created session:', newSession)
    }
  }

  // Example: Update a session
  const updateExistingSession = async (sessionId: string) => {
    const updateData = {
      notes: 'Updated notes for the session',
    }

    const updatedSession = await updateSession(sessionId, updateData)
    if (updatedSession) {
      console.log('Updated session:', updatedSession)
    }
  }

  // Example: Cancel a session
  const cancelExistingSession = async (sessionId: string) => {
    const success = await cancelSession(sessionId)
    if (success) {
      console.log('Session cancelled successfully')
    }
  }

  return {
    // State
    sessionsState,
    sessionsError,
    isSessionsLoading,
    isSessionsCreating,
    isSessionsUpdating,

    // Computed
    userSessions,
    currentSession,

    // Methods
    fetchSessions,
    fetchSession,
    createNewSession,
    updateExistingSession,
    cancelExistingSession,
  }
}