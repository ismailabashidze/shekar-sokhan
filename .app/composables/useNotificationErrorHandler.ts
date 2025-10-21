import type PocketBase from 'pocketbase'
import { useErrorHandler, ErrorCategory, ErrorSeverity } from './useErrorHandler'
import type { ErrorContext } from './useErrorHandler'

/**
 * Notification-specific error handler that wraps the main error handler
 * with notification system context and specialized recovery strategies
 */
export const useNotificationErrorHandler = () => {
  const errorHandler = useErrorHandler()

  /**
   * Handle FCM token-related errors with specialized recovery
   */
  const handleFCMTokenError = async (
    error: any,
    context: Partial<ErrorContext> = {}
  ) => {
    const notificationError = await errorHandler.handleError(error, {
      ...context,
      component: 'FCM_TOKEN_MANAGER',
      method: context.method || 'token_operation'
    }, {
      category: ErrorCategory.FCM,
      severity: ErrorSeverity.HIGH,
      enableFallback: true,
      enableRetry: true
    })

    // Specialized FCM token recovery
    if (notificationError.isRetryable) {
      await attemptFCMTokenRecovery(context)
    }

    return notificationError
  }

  /**
   * Handle notification delivery errors
   */
  const handleDeliveryError = async (
    error: any,
    context: Partial<ErrorContext> = {}
  ) => {
    const severity = determineDeliverySeverity(error)
    
    const notificationError = await errorHandler.handleError(error, {
      ...context,
      component: 'NOTIFICATION_DELIVERY',
      method: context.method || 'send_notification'
    }, {
      category: ErrorCategory.FCM,
      severity,
      enableFallback: true,
      enableRetry: true
    })

    // Use retry system for delivery failures
    if (notificationError.isRetryable) {
      await scheduleDeliveryRetry(notificationError, context)
    }

    return notificationError
  }

  /**
   * Handle notification scheduling errors
   */
  const handleSchedulingError = async (
    error: any,
    context: Partial<ErrorContext> = {}
  ) => {
    const notificationError = await errorHandler.handleError(error, {
      ...context,
      component: 'NOTIFICATION_SCHEDULER',
      method: context.method || 'schedule_notification'
    }, {
      category: ErrorCategory.SYSTEM,
      severity: ErrorSeverity.MEDIUM,
      enableFallback: true,
      enableRetry: true
    })

    // Attempt to reschedule if possible
    if (notificationError.isRetryable) {
      await attemptRescheduling(context)
    }

    return notificationError
  }

  /**
   * Handle template rendering errors
   */
  const handleTemplateError = async (
    error: any,
    context: Partial<ErrorContext> = {}
  ) => {
    const notificationError = await errorHandler.handleError(error, {
      ...context,
      component: 'TEMPLATE_ENGINE',
      method: context.method || 'render_template'
    }, {
      category: ErrorCategory.VALIDATION,
      severity: ErrorSeverity.MEDIUM,
      enableFallback: true,
      enableRetry: false // Template errors usually need manual fix
    })

    // Use fallback template if available
    await useFallbackTemplate(context)

    return notificationError
  }

  /**
   * Handle user group management errors
   */
  const handleUserGroupError = async (
    error: any,
    context: Partial<ErrorContext> = {}
  ) => {
    const notificationError = await errorHandler.handleError(error, {
      ...context,
      component: 'USER_GROUP_MANAGER',
      method: context.method || 'group_operation'
    }, {
      category: ErrorCategory.DATABASE,
      severity: ErrorSeverity.MEDIUM,
      enableFallback: true,
      enableRetry: true
    })

    return notificationError
  }

  /**
   * Handle campaign management errors
   */
  const handleCampaignError = async (
    error: any,
    context: Partial<ErrorContext> = {}
  ) => {
    const notificationError = await errorHandler.handleError(error, {
      ...context,
      component: 'CAMPAIGN_MANAGER',
      method: context.method || 'campaign_operation'
    }, {
      category: ErrorCategory.SYSTEM,
      severity: ErrorSeverity.HIGH,
      enableFallback: true,
      enableRetry: true
    })

    // Pause campaign if critical error
    if (notificationError.severity === ErrorSeverity.CRITICAL) {
      await pauseCampaignOnError(context.campaignId)
    }

    return notificationError
  }

  /**
   * Handle service worker errors
   */
  const handleServiceWorkerError = async (
    error: any,
    context: Partial<ErrorContext> = {}
  ) => {
    const notificationError = await errorHandler.handleError(error, {
      ...context,
      component: 'SERVICE_WORKER',
      method: context.method || 'sw_operation'
    }, {
      category: ErrorCategory.SYSTEM,
      severity: ErrorSeverity.HIGH,
      enableFallback: true,
      enableRetry: true
    })

    // Attempt service worker recovery
    if (notificationError.isRetryable) {
      await attemptServiceWorkerRecovery()
    }

    return notificationError
  }

  /**
   * Handle database connection errors
   */
  const handleDatabaseError = async (
    error: any,
    context: Partial<ErrorContext> = {}
  ) => {
    const notificationError = await errorHandler.handleError(error, {
      ...context,
      component: 'DATABASE',
      method: context.method || 'db_operation'
    }, {
      category: ErrorCategory.DATABASE,
      severity: ErrorSeverity.HIGH,
      enableFallback: true,
      enableRetry: true
    })

    // Use local cache as fallback
    if (notificationError.isRetryable) {
      await enableOfflineMode(context)
    }

    return notificationError
  }

  /**
   * Specialized recovery functions
   */
  const attemptFCMTokenRecovery = async (context: Partial<ErrorContext>) => {
    try {
      console.log('🔄 Attempting FCM token recovery')
      
      // Try to refresh service worker registration
      if (process.client && 'serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js')
        if (registration) {
          console.log('✅ Service worker re-registered for FCM recovery')
          return true
        }
      }
      
      return false
    } catch (recoveryError) {
      console.error('❌ FCM token recovery failed:', recoveryError)
      return false
    }
  }

  const scheduleDeliveryRetry = async (
    notificationError: any,
    context: Partial<ErrorContext>
  ) => {
    try {
      console.log('🔄 Scheduling delivery retry')
      
      // Store retry information in local storage for later processing
      const retryData = {
        notificationId: context.notificationId,
        error: notificationError.message,
        code: notificationError.code,
        retryAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // Retry in 5 minutes
        attempts: 1
      }
      
      const retryQueue = JSON.parse(localStorage.getItem('notification_retry_queue') || '[]')
      retryQueue.push(retryData)
      localStorage.setItem('notification_retry_queue', JSON.stringify(retryQueue))
      
      console.log('✅ Delivery retry scheduled')
    } catch (retryError) {
      console.error('❌ Failed to schedule delivery retry:', retryError)
    }
  }

  const attemptRescheduling = async (context: Partial<ErrorContext>) => {
    try {
      console.log('🔄 Attempting to reschedule notification')
      
      // Store rescheduling information for later processing
      if (context.sessionId && context.userId) {
        const rescheduleData = {
          userId: context.userId,
          sessionId: context.sessionId,
          rescheduleAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // Reschedule in 10 minutes
          originalError: context,
          rescheduled: true
        }
        
        const rescheduleQueue = JSON.parse(localStorage.getItem('notification_reschedule_queue') || '[]')
        rescheduleQueue.push(rescheduleData)
        localStorage.setItem('notification_reschedule_queue', JSON.stringify(rescheduleQueue))
        
        console.log('✅ Notification rescheduled successfully')
      }
    } catch (rescheduleError) {
      console.error('❌ Rescheduling failed:', rescheduleError)
    }
  }

  const useFallbackTemplate = async (context: Partial<ErrorContext>) => {
    try {
      console.log('🔄 Using fallback template')
      
      // Use a simple fallback template
      const fallbackTemplate = {
        title: 'اعلان جدید',
        body: 'شما یک اعلان جدید دارید. لطفاً برنامه را بررسی کنید.',
        action_text: 'مشاهده',
        action_url: '/notifications'
      }
      
      // Store fallback template usage for monitoring
      console.log('✅ Fallback template applied')
      return fallbackTemplate
    } catch (fallbackError) {
      console.error('❌ Fallback template failed:', fallbackError)
    }
  }

  const pauseCampaignOnError = async (campaignId?: string) => {
    if (!campaignId) return
    
    try {
      console.log('⏸️ Pausing campaign due to critical error:', campaignId)
      
      const { $pb } = useNuxtApp()
      const pb = $pb as PocketBase
      await pb.collection('notification_campaigns').update(campaignId, {
        status: 'paused',
        error_message: 'Campaign paused due to critical error',
        paused_at: new Date().toISOString()
      })
      
      console.log('✅ Campaign paused successfully')
    } catch (pauseError) {
      console.error('❌ Failed to pause campaign:', pauseError)
    }
  }

  const attemptServiceWorkerRecovery = async () => {
    try {
      console.log('🔄 Attempting service worker recovery')
      
      if (process.client && 'serviceWorker' in navigator) {
        // Try to re-register service worker
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js')
        
        if (registration) {
          console.log('✅ Service worker recovered successfully')
          return true
        }
      }
      
      return false
    } catch (recoveryError) {
      console.error('❌ Service worker recovery failed:', recoveryError)
      return false
    }
  }

  const enableOfflineMode = async (context: Partial<ErrorContext>) => {
    try {
      console.log('📱 Enabling offline mode')
      
      // Store operations in local storage for later sync
      const offlineQueue = JSON.parse(localStorage.getItem('offline_operations') || '[]')
      
      offlineQueue.push({
        context,
        timestamp: new Date().toISOString(),
        type: 'notification_operation'
      })
      
      localStorage.setItem('offline_operations', JSON.stringify(offlineQueue))
      
      console.log('✅ Offline mode enabled, operations queued')
    } catch (offlineError) {
      console.error('❌ Failed to enable offline mode:', offlineError)
    }
  }

  /**
   * Determine delivery error severity based on error type
   */
  const determineDeliverySeverity = (error: any): ErrorSeverity => {
    const errorMessage = error?.message || error?.toString() || ''
    
    // Critical errors that prevent all deliveries
    if (errorMessage.includes('FCM_UNAVAILABLE') || 
        errorMessage.includes('SERVICE_UNAVAILABLE')) {
      return ErrorSeverity.CRITICAL
    }
    
    // High priority errors that affect delivery
    if (errorMessage.includes('INVALID_TOKEN') || 
        errorMessage.includes('AUTHENTICATION_ERROR')) {
      return ErrorSeverity.HIGH
    }
    
    // Medium priority errors that can be retried
    if (errorMessage.includes('TIMEOUT') || 
        errorMessage.includes('RATE_LIMITED')) {
      return ErrorSeverity.MEDIUM
    }
    
    // Default to medium severity
    return ErrorSeverity.MEDIUM
  }

  /**
   * Wrap any notification operation with error handling
   */
  const withErrorHandling = <T extends any[], R>(
    operation: (...args: T) => Promise<R>,
    context: Partial<ErrorContext> = {},
    errorType: 'fcm' | 'delivery' | 'scheduling' | 'template' | 'usergroup' | 'campaign' | 'serviceworker' | 'database' = 'delivery'
  ) => {
    return async (...args: T): Promise<R> => {
      try {
        return await operation(...args)
      } catch (error) {
        // Handle error based on type
        switch (errorType) {
          case 'fcm':
            await handleFCMTokenError(error, context)
            break
          case 'delivery':
            await handleDeliveryError(error, context)
            break
          case 'scheduling':
            await handleSchedulingError(error, context)
            break
          case 'template':
            await handleTemplateError(error, context)
            break
          case 'usergroup':
            await handleUserGroupError(error, context)
            break
          case 'campaign':
            await handleCampaignError(error, context)
            break
          case 'serviceworker':
            await handleServiceWorkerError(error, context)
            break
          case 'database':
            await handleDatabaseError(error, context)
            break
        }
        
        // Re-throw error after handling
        throw error
      }
    }
  }

  return {
    // Specialized error handlers
    handleFCMTokenError,
    handleDeliveryError,
    handleSchedulingError,
    handleTemplateError,
    handleUserGroupError,
    handleCampaignError,
    handleServiceWorkerError,
    handleDatabaseError,
    
    // Recovery functions
    attemptFCMTokenRecovery,
    scheduleDeliveryRetry,
    attemptRescheduling,
    useFallbackTemplate,
    pauseCampaignOnError,
    attemptServiceWorkerRecovery,
    enableOfflineMode,
    
    // Utility functions
    determineDeliverySeverity,
    withErrorHandling,
    
    // Access to base error handler
    ...errorHandler
  }
}