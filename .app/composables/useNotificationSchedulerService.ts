import type PocketBase from 'pocketbase'

/**
 * Main notification scheduler service that integrates all components
 * This is the primary interface for the notification scheduling system
 */
export const useNotificationSchedulerService = () => {
  const { $pb } = useNuxtApp()
  const pb = $pb as PocketBase

  // Get all the component services
  const scheduler = useNotificationScheduler()
  const sessionTriggers = useSessionNotificationTriggers()
  const retrySystem = useNotificationRetrySystem()
  const deduplication = useNotificationDeduplication()

  // Service state
  const isInitialized = ref(false)
  const isProcessing = ref(false)
  const lastProcessTime = ref<Date | null>(null)
  const processingInterval = ref<NodeJS.Timeout | null>(null)

  /**
   * Initialize the notification scheduler service
   */
  const initialize = async () => {
    if (!process.client || isInitialized.value) {
      return
    }

    try {
      console.log('🚀 Initializing notification scheduler service...')

      sessionTriggers.initializeSessionTriggers()
      await deduplication.cleanupExpiredFingerprints()

      isInitialized.value = true
      console.log('✅ Notification scheduler service initialized')

    } catch (error) {
      console.error('❌ Error initializing notification scheduler service:', error)
    }
  }

  /**
   * Start background processing for scheduled notifications and retries
   */
  const startBackgroundProcessing = () => {
    if (processingInterval.value) {
      return // Already running
    }

    console.log('⏰ Starting notification worker health checks...')

    processingInterval.value = setInterval(async () => {
      await getScheduledNotificationStats()
    }, 5 * 60 * 1000)

    setTimeout(() => {
      getScheduledNotificationStats()
    }, 10000)
  }

  /**
   * Stop background processing
   */
  const stopBackgroundProcessing = () => {
    if (processingInterval.value) {
      clearInterval(processingInterval.value)
      processingInterval.value = null
      console.log('⏹️ Stopped background notification processing')
    }
  }

  /**
   * Process scheduled notifications that are ready to be sent
   */
  const processScheduledNotifications = async () => {
    if (isProcessing.value) {
      console.log('⏭️ Processing already in progress, skipping')
      return
    }

    try {
      isProcessing.value = true
      const startTime = new Date()
      
      console.log('🔄 Refreshing scheduled notification stats...')

      const stats = await getScheduledNotificationStats()

      lastProcessTime.value = startTime

      console.log('📊 Scheduled notification stats:', stats)

    } catch (error) {
      console.error('❌ Error refreshing notification stats:', error)
    } finally {
      isProcessing.value = false
    }
  }

  /**
   * Process a single notification
   */
  const processNotification = async (_notification: any): Promise<boolean> => {
    console.warn('processNotification is deprecated on client side; handled by server worker.')
    return false
  }

  /**
   * Render notification content from template
   */
  const renderNotificationContent = async (
    template: any,
    notification: any,
    user: any
  ) => {
    try {
      // Get template engine
      const templateEngine = useTemplateEngine()

      // Prepare template variables
      const variables = {
        user: {
          name: user.name || 'کاربر',
          email: user.email || '',
          role: user.role || 'user'
        },
        session: notification.session_id ? {
          id: notification.session_id,
          type: notification.metadata?.sessionType || 'therapy'
        } : null,
        system: {
          appName: 'ذهنا',
          currentDate: new Date().toLocaleDateString('fa-IR'),
          currentTime: new Date().toLocaleTimeString('fa-IR')
        },
        ...notification.metadata?.templateVariables || {}
      }

      // Render template
      const renderedContent = await templateEngine.renderTemplate(template, variables)

      return {
        title: renderedContent.title,
        message: renderedContent.body,
        actionUrl: renderedContent.actionUrl,
        actionText: renderedContent.actionText,
        priority: notification.metadata?.priority || 'medium',
        type: template.category || 'system'
      }

    } catch (error) {
      console.error('❌ Error rendering notification content:', error)
      
      // Fallback content
      return {
        title: 'اعلان جدید',
        message: 'شما یک اعلان جدید دارید.',
        priority: 'medium',
        type: 'system'
      }
    }
  }

  /**
   * Send notification via FCM
   */
  const sendNotification = async (
    _user: any,
    _content: any,
    _notification: any
  ): Promise<boolean> => {
    console.warn('sendNotification is deprecated on client side; handled by server worker.')
    return false
  }

  /**
   * Create notification record in user's history
   */
  const createNotificationRecord = async (
    user: any,
    content: any,
    scheduledNotification: any
  ) => {
    try {
      await pb.collection('notifications').create({
        title: content.title,
        message: content.message,
        type: content.type,
        priority: content.priority,
        recipient_user_id: user.id,
        campaign_id: scheduledNotification.campaign_id,
        template_id: scheduledNotification.metadata?.template_id,
        action_url: content.actionUrl,
        action_text: content.actionText,
        scheduled_for: scheduledNotification.scheduled_for,
        sent_at: new Date().toISOString(),
        is_read: false,
        metadata: {
          ...scheduledNotification.metadata,
          originalScheduledNotificationId: scheduledNotification.id,
          deliveryMethod: 'fcm'
        }
      })

    } catch (error) {
      console.error('❌ Error creating notification record:', error)
    }
  }

  /**
   * Manually trigger session completion notifications (for testing)
   */
  const triggerSessionNotifications = async (sessionId: string) => {
    try {
      return await sessionTriggers.triggerSessionCompletionNotifications(sessionId)
    } catch (error) {
      console.error('❌ Error triggering session notifications:', error)
      throw error
    }
  }

  /**
   * Get service statistics
   */
  const getServiceStats = async () => {
    try {
      const [
        scheduledStats,
        retryStats,
        deduplicationStats,
        deadLetterStats
      ] = await Promise.all([
        getScheduledNotificationStats(),
        retrySystem.getDeadLetterStats(),
        deduplication.getDeduplicationStats(),
        retrySystem.getDeadLetterStats()
      ])

      return {
        scheduled: scheduledStats,
        retries: retryStats,
        deduplication: deduplicationStats,
        deadLetter: deadLetterStats,
        service: {
          isInitialized: isInitialized.value,
          isProcessing: isProcessing.value,
          lastProcessTime: lastProcessTime.value
        }
      }

    } catch (error) {
      console.error('❌ Error getting service stats:', error)
      return null
    }
  }

  /**
   * Get scheduled notification statistics
   */
  const getScheduledNotificationStats = async () => {
    try {
      const [pending, sent, failed] = await Promise.all([
        pb.collection('scheduled_notifications').getList(1, 1, { filter: 'status = "pending"' }),
        pb.collection('scheduled_notifications').getList(1, 1, { filter: 'status = "sent"' }),
        pb.collection('scheduled_notifications').getList(1, 1, { filter: 'status = "failed"' })
      ])

      return {
        pending: pending.totalItems,
        sent: sent.totalItems,
        failed: failed.totalItems,
        total: pending.totalItems + sent.totalItems + failed.totalItems
      }

    } catch (error) {
      console.error('❌ Error getting scheduled notification stats:', error)
      return { pending: 0, sent: 0, failed: 0, total: 0 }
    }
  }

  /**
   * Cleanup function
   */
  const cleanup = () => {
    stopBackgroundProcessing()
    sessionTriggers.cleanup()
    isInitialized.value = false
    console.log('🧹 Notification scheduler service cleaned up')
  }

  // Auto-initialize on client side
  if (process.client) {
    onMounted(() => {
      initialize()
    })

    onUnmounted(() => {
      cleanup()
    })
  }

  return {
    // Service state
    isInitialized: readonly(isInitialized),
    isProcessing: readonly(isProcessing),
    lastProcessTime: readonly(lastProcessTime),

    // Core methods
    initialize,
    cleanup,
    processScheduledNotifications,
    triggerSessionNotifications,

    // Background processing
    startBackgroundProcessing,
    stopBackgroundProcessing,

    // Statistics
    getServiceStats,
    getScheduledNotificationStats,

    // Component access
    scheduler,
    sessionTriggers,
    retrySystem,
    deduplication
  }
}