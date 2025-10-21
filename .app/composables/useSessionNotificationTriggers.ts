import type PocketBase from 'pocketbase'

// Types for session-based notification triggers
interface SessionData {
  id: string
  user: string
  session_type?: 'educational' | 'therapic' | 'therapy_journey'
  start_time?: string
  end_time?: string
  status: 'inprogress' | 'done' | 'closed' | 'deleted' | 'generatingReport'
  total_time_passed?: number
  count_of_total_messages?: number
}

interface SessionCompletionContext {
  sessionId: string
  userId: string
  sessionType?: string
  duration?: number
  messageCount?: number
  completedAt: string
}

export const useSessionNotificationTriggers = () => {
  const { $pb } = useNuxtApp()
  const pb = $pb as PocketBase
  
  // Get the notification scheduler
  const scheduler = useNotificationScheduler()

  /**
   * Hook into session status changes and trigger notifications when status becomes "done"
   */
  const initializeSessionTriggers = () => {
    if (!process.client) return

    console.log('🎯 Initializing session completion triggers...')

    // Subscribe to session collection changes
    pb.collection('sessions').subscribe('*', async (e) => {
      try {
        const session = e.record as SessionData

        // Only process updates where status changes to "done"
        if (e.action === 'update' && session.status === 'done') {
          console.log('✅ Session completed, triggering notifications:', session.id)
          await handleSessionCompletion(session)
        }
      } catch (error) {
        console.error('❌ Error handling session status change:', error)
      }
    })

    console.log('🔄 Session completion triggers initialized')
  }

  /**
   * Handle session completion and schedule appropriate notifications
   */
  const handleSessionCompletion = async (session: SessionData) => {
    try {
      console.log('🎉 Processing session completion:', session.id)

      // Build session completion context
      const context: SessionCompletionContext = {
        sessionId: session.id,
        userId: session.user,
        sessionType: session.session_type,
        duration: session.total_time_passed,
        messageCount: session.count_of_total_messages,
        completedAt: new Date().toISOString()
      }

      // Cancel any pending notifications from previous sessions for this user
      await scheduler.cancelScheduledNotifications(context.userId, context.sessionId)

      // Schedule new notifications based on session completion
      const scheduledNotifications = await scheduler.scheduleNotifications('session_complete', {
        userId: context.userId,
        sessionId: context.sessionId,
        sessionType: context.sessionType,
        sessionDuration: context.duration,
        additionalData: {
          messageCount: context.messageCount,
          completedAt: context.completedAt,
          sessionType: context.sessionType
        }
      })

      console.log(`📅 Scheduled ${scheduledNotifications.length} notifications for session completion`)

      // Track session completion event
      await trackSessionCompletionEvent(context)

      return scheduledNotifications

    } catch (error) {
      console.error('❌ Error handling session completion:', error)
      throw error
    }
  }

  /**
   * Manually trigger session completion notifications (for testing or manual triggers)
   */
  const triggerSessionCompletionNotifications = async (sessionId: string) => {
    try {
      // Get session data
      const session = await pb.collection('sessions').getOne<SessionData>(sessionId)
      
      if (session.status !== 'done') {
        throw new Error('Session is not completed yet')
      }

      return await handleSessionCompletion(session)

    } catch (error) {
      console.error('❌ Error manually triggering session notifications:', error)
      throw error
    }
  }

  /**
   * Track session completion event for analytics
   */
  const trackSessionCompletionEvent = async (context: SessionCompletionContext) => {
    try {
      // Create a session completion event record for analytics
      await pb.collection('session_events').create({
        session_id: context.sessionId,
        user_id: context.userId,
        event_type: 'session_completed',
        event_data: {
          sessionType: context.sessionType,
          duration: context.duration,
          messageCount: context.messageCount,
          completedAt: context.completedAt
        },
        created: new Date().toISOString()
      }).catch(() => {
        // Ignore errors if session_events collection doesn't exist
        console.debug('Session events collection not available, skipping event tracking')
      })

    } catch (error) {
      console.debug('Could not track session completion event:', error)
    }
  }

  /**
   * Get session completion statistics for a user
   */
  const getSessionCompletionStats = async (userId: string, days: number = 30) => {
    try {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      const sessions = await pb.collection('sessions').getList(1, 1000, {
        filter: `user = "${userId}" && status = "done" && created >= "${startDate.toISOString()}"`,
        sort: '-created'
      })

      const stats = {
        totalSessions: sessions.items.length,
        averageDuration: 0,
        averageMessages: 0,
        sessionTypes: {
          educational: 0,
          therapic: 0,
          therapy_journey: 0
        },
        recentSessions: sessions.items.slice(0, 5)
      }

      if (sessions.items.length > 0) {
        const totalDuration = sessions.items.reduce((sum, s: any) => sum + (s.total_time_passed || 0), 0)
        const totalMessages = sessions.items.reduce((sum, s: any) => sum + (s.count_of_total_messages || 0), 0)
        
        stats.averageDuration = Math.round(totalDuration / sessions.items.length)
        stats.averageMessages = Math.round(totalMessages / sessions.items.length)

        // Count session types
        sessions.items.forEach((session: any) => {
          if (session.session_type && stats.sessionTypes[session.session_type as keyof typeof stats.sessionTypes] !== undefined) {
            stats.sessionTypes[session.session_type as keyof typeof stats.sessionTypes]++
          }
        })
      }

      return stats

    } catch (error) {
      console.error('❌ Error getting session completion stats:', error)
      return null
    }
  }

  /**
   * Check if user has completed sessions recently (for conditional notifications)
   */
  const hasRecentSessionActivity = async (userId: string, hours: number = 24): Promise<boolean> => {
    try {
      const cutoffTime = new Date()
      cutoffTime.setHours(cutoffTime.getHours() - hours)

      const recentSessions = await pb.collection('sessions').getList(1, 1, {
        filter: `user = "${userId}" && status = "done" && created >= "${cutoffTime.toISOString()}"`
      })

      return recentSessions.totalItems > 0

    } catch (error) {
      console.error('❌ Error checking recent session activity:', error)
      return false
    }
  }

  /**
   * Get the most recent completed session for a user
   */
  const getLastCompletedSession = async (userId: string): Promise<SessionData | null> => {
    try {
      const sessions = await pb.collection('sessions').getList<SessionData>(1, 1, {
        filter: `user = "${userId}" && status = "done"`,
        sort: '-created'
      })

      return sessions.items.length > 0 ? sessions.items[0] : null

    } catch (error) {
      console.error('❌ Error getting last completed session:', error)
      return null
    }
  }

  /**
   * Schedule follow-up notifications based on session patterns
   */
  const scheduleFollowUpNotifications = async (userId: string) => {
    try {
      const stats = await getSessionCompletionStats(userId, 7) // Last 7 days
      
      if (!stats || stats.totalSessions === 0) {
        console.log('📭 No recent sessions found, skipping follow-up notifications')
        return []
      }

      // Determine follow-up strategy based on session frequency
      let followUpTrigger: 'user_inactive' | 'system_event' = 'user_inactive'
      
      if (stats.totalSessions >= 5) {
        // Active user - use system event for encouragement
        followUpTrigger = 'system_event'
      }

      // Schedule follow-up notifications
      const followUpNotifications = await scheduler.scheduleNotifications(followUpTrigger, {
        userId,
        additionalData: {
          sessionStats: stats,
          followUpType: 'session_pattern_based'
        }
      })

      console.log(`📬 Scheduled ${followUpNotifications.length} follow-up notifications`)
      return followUpNotifications

    } catch (error) {
      console.error('❌ Error scheduling follow-up notifications:', error)
      return []
    }
  }

  /**
   * Cleanup function to unsubscribe from session changes
   */
  const cleanup = () => {
    try {
      pb.collection('sessions').unsubscribe()
      console.log('🧹 Session notification triggers cleaned up')
    } catch (error) {
      console.warn('⚠️ Error cleaning up session triggers:', error)
    }
  }

  return {
    // Initialization
    initializeSessionTriggers,
    cleanup,

    // Session completion handling
    handleSessionCompletion,
    triggerSessionCompletionNotifications,

    // Analytics and stats
    getSessionCompletionStats,
    hasRecentSessionActivity,
    getLastCompletedSession,

    // Follow-up notifications
    scheduleFollowUpNotifications,

    // Event tracking
    trackSessionCompletionEvent
  }
}