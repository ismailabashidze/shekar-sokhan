import type PocketBase from 'pocketbase'

// Types for retry system
interface RetryConfig {
  maxRetries: number
  baseDelayMinutes: number
  maxDelayMinutes: number
  backoffMultiplier: number
  retryableErrors: string[]
}

interface DeliveryAttempt {
  attemptNumber: number
  timestamp: string
  success: boolean
  errorMessage?: string
  responseData?: any
}

interface DeadLetterNotification {
  id?: string
  original_notification_id: string
  user_id: string
  rule_id: string
  template_id: string
  failure_reason: string
  retry_attempts: number
  last_error: string
  metadata: Record<string, any>
  created?: string
}

export const useNotificationRetrySystem = () => {
  const { $pb } = useNuxtApp()
  const pb = $pb as PocketBase

  // Default retry configuration
  const defaultRetryConfig: RetryConfig = {
    maxRetries: 5,
    baseDelayMinutes: 5, // Start with 5 minutes
    maxDelayMinutes: 1440, // Max 24 hours
    backoffMultiplier: 2, // Double the delay each time
    retryableErrors: [
      'NETWORK_ERROR',
      'TIMEOUT',
      'SERVER_ERROR',
      'RATE_LIMITED',
      'FCM_UNAVAILABLE',
      'TEMPORARY_FAILURE'
    ]
  }

  /**
   * Process failed notification delivery with exponential backoff retry
   */
  const handleDeliveryFailure = async (
    notificationId: string,
    errorMessage: string,
    errorCode?: string,
    retryConfig: Partial<RetryConfig> = {}
  ): Promise<boolean> => {
    try {
      const config = { ...defaultRetryConfig, ...retryConfig }
      
      console.log('🔄 Handling delivery failure for notification:', notificationId, 'Error:', errorMessage)

      // Get the scheduled notification
      const scheduledNotification = await pb.collection('scheduled_notifications').getOne(notificationId)
      
      // Track the delivery attempt
      await trackDeliveryAttempt(notificationId, {
        attemptNumber: scheduledNotification.retry_count + 1,
        timestamp: new Date().toISOString(),
        success: false,
        errorMessage,
        responseData: { errorCode }
      })

      // Check if error is retryable
      if (!isRetryableError(errorMessage, errorCode, config)) {
        console.log('❌ Non-retryable error, moving to dead letter queue')
        await moveToDeadLetterQueue(scheduledNotification, errorMessage, 'NON_RETRYABLE_ERROR')
        return false
      }

      // Check if max retries exceeded
      if (scheduledNotification.retry_count >= config.maxRetries) {
        console.log('❌ Max retries exceeded, moving to dead letter queue')
        await moveToDeadLetterQueue(scheduledNotification, errorMessage, 'MAX_RETRIES_EXCEEDED')
        return false
      }

      // Calculate next retry time with exponential backoff
      const nextRetryTime = calculateNextRetryTime(
        scheduledNotification.retry_count,
        config
      )

      // Update scheduled notification for retry
      await pb.collection('scheduled_notifications').update(notificationId, {
        status: 'pending',
        retry_count: scheduledNotification.retry_count + 1,
        last_attempt: new Date().toISOString(),
        next_retry: nextRetryTime.toISOString(),
        error_message: errorMessage,
        metadata: {
          ...scheduledNotification.metadata,
          lastError: errorMessage,
          lastErrorCode: errorCode,
          retryHistory: [
            ...(scheduledNotification.metadata?.retryHistory || []),
            {
              attempt: scheduledNotification.retry_count + 1,
              timestamp: new Date().toISOString(),
              error: errorMessage
            }
          ]
        }
      })

      console.log(`⏰ Scheduled retry ${scheduledNotification.retry_count + 1}/${config.maxRetries} for ${nextRetryTime.toISOString()}`)
      return true

    } catch (error) {
      console.error('❌ Error handling delivery failure:', error)
      return false
    }
  }

  /**
   * Calculate next retry time using exponential backoff
   */
  const calculateNextRetryTime = (
    currentRetryCount: number,
    config: RetryConfig
  ): Date => {
    const delayMinutes = Math.min(
      config.baseDelayMinutes * Math.pow(config.backoffMultiplier, currentRetryCount),
      config.maxDelayMinutes
    )

    // Add some jitter to prevent thundering herd (±20%)
    const jitter = (Math.random() - 0.5) * 0.4 * delayMinutes
    const finalDelayMinutes = Math.max(1, delayMinutes + jitter)

    const nextRetryTime = new Date()
    nextRetryTime.setMinutes(nextRetryTime.getMinutes() + finalDelayMinutes)

    return nextRetryTime
  }

  /**
   * Check if an error is retryable based on error message and code
   */
  const isRetryableError = (
    errorMessage: string,
    errorCode?: string,
    config: RetryConfig = defaultRetryConfig
  ): boolean => {
    // Check error codes first
    if (errorCode) {
      const retryableCodes = [
        'NETWORK_ERROR',
        'TIMEOUT',
        'SERVER_ERROR',
        'RATE_LIMITED',
        'FCM_UNAVAILABLE',
        'TEMPORARY_FAILURE',
        '500', '502', '503', '504', // HTTP server errors
        'ECONNRESET', 'ENOTFOUND', 'ETIMEDOUT' // Network errors
      ]
      
      if (retryableCodes.includes(errorCode)) {
        return true
      }
    }

    // Check error message patterns
    const retryablePatterns = [
      /network.*error/i,
      /timeout/i,
      /server.*error/i,
      /rate.*limit/i,
      /temporary.*failure/i,
      /service.*unavailable/i,
      /connection.*reset/i,
      /fcm.*unavailable/i
    ]

    return retryablePatterns.some(pattern => pattern.test(errorMessage))
  }

  /**
   * Move failed notification to dead letter queue
   */
  const moveToDeadLetterQueue = async (
    scheduledNotification: any,
    errorMessage: string,
    failureReason: string
  ): Promise<void> => {
    try {
      // Create dead letter notification record
      const deadLetterNotification: DeadLetterNotification = {
        original_notification_id: scheduledNotification.id,
        user_id: scheduledNotification.user_id,
        rule_id: scheduledNotification.rule_id,
        template_id: scheduledNotification.metadata?.template_id || '',
        failure_reason: failureReason,
        retry_attempts: scheduledNotification.retry_count,
        last_error: errorMessage,
        metadata: {
          ...scheduledNotification.metadata,
          originalScheduledFor: scheduledNotification.scheduled_for,
          failedAt: new Date().toISOString(),
          retryHistory: scheduledNotification.metadata?.retryHistory || []
        }
      }

      // Save to dead letter queue
      await pb.collection('dead_letter_notifications').create(deadLetterNotification)

      // Update original notification status
      await pb.collection('scheduled_notifications').update(scheduledNotification.id, {
        status: 'failed',
        error_message: errorMessage,
        metadata: {
          ...scheduledNotification.metadata,
          movedToDeadLetter: true,
          deadLetterReason: failureReason
        }
      })

      console.log('💀 Moved notification to dead letter queue:', scheduledNotification.id)

    } catch (error) {
      console.error('❌ Error moving to dead letter queue:', error)
    }
  }

  /**
   * Track delivery attempt for analytics and debugging
   */
  const trackDeliveryAttempt = async (
    notificationId: string,
    attempt: DeliveryAttempt
  ): Promise<void> => {
    try {
      // Create delivery attempt record
      await pb.collection('notification_delivery_attempts').create({
        notification_id: notificationId,
        attempt_number: attempt.attemptNumber,
        timestamp: attempt.timestamp,
        success: attempt.success,
        error_message: attempt.errorMessage,
        response_data: attempt.responseData || {},
        created: new Date().toISOString()
      }).catch(() => {
        // Ignore if collection doesn't exist
        console.debug('Delivery attempts collection not available')
      })

    } catch (error) {
      console.debug('Could not track delivery attempt:', error)
    }
  }

  /**
   * Process notifications ready for retry
   */
  const processRetryQueue = async (): Promise<number> => {
    try {
      const now = new Date().toISOString()
      
      // Get notifications ready for retry
      const retryNotifications = await pb.collection('scheduled_notifications').getList(1, 100, {
        filter: `status = "pending" && retry_count > 0 && next_retry <= "${now}"`,
        sort: 'next_retry'
      })

      console.log(`🔄 Processing ${retryNotifications.items.length} notifications for retry`)

      let processedCount = 0
      
      for (const notification of retryNotifications.items) {
        try {
          // Attempt to deliver the notification
          const success = await attemptNotificationDelivery(notification)
          
          if (success) {
            // Mark as sent
            await pb.collection('scheduled_notifications').update(notification.id, {
              status: 'sent',
              error_message: null,
              metadata: {
                ...notification.metadata,
                retriedSuccessfully: true,
                finalAttempt: notification.retry_count + 1
              }
            })
            
            console.log('✅ Retry successful for notification:', notification.id)
          } else {
            // Handle failure (will schedule another retry or move to dead letter)
            await handleDeliveryFailure(
              notification.id,
              'Retry attempt failed',
              'RETRY_FAILED'
            )
          }
          
          processedCount++
          
        } catch (error) {
          console.error(`❌ Error processing retry for notification ${notification.id}:`, error)
          await handleDeliveryFailure(
            notification.id,
            error instanceof Error ? error.message : 'Unknown retry error',
            'RETRY_PROCESSING_ERROR'
          )
        }
      }

      return processedCount

    } catch (error) {
      console.error('❌ Error processing retry queue:', error)
      return 0
    }
  }

  /**
   * Attempt to deliver a notification (placeholder - should integrate with actual delivery service)
   */
  const attemptNotificationDelivery = async (notification: any): Promise<boolean> => {
    try {
      // This is a placeholder - in real implementation, this would:
      // 1. Get the template and render the message
      // 2. Get user's FCM token
      // 3. Send via FCM service
      // 4. Handle the response
      
      console.log('📤 Attempting delivery for notification:', notification.id)
      
      // Simulate delivery attempt
      // In real implementation, integrate with FCM service
      const deliverySuccess = Math.random() > 0.3 // 70% success rate for simulation
      
      if (deliverySuccess) {
        await trackDeliveryAttempt(notification.id, {
          attemptNumber: notification.retry_count + 1,
          timestamp: new Date().toISOString(),
          success: true
        })
        return true
      } else {
        await trackDeliveryAttempt(notification.id, {
          attemptNumber: notification.retry_count + 1,
          timestamp: new Date().toISOString(),
          success: false,
          errorMessage: 'Simulated delivery failure'
        })
        return false
      }

    } catch (error) {
      console.error('❌ Error attempting notification delivery:', error)
      return false
    }
  }

  /**
   * Get dead letter queue statistics
   */
  const getDeadLetterStats = async (days: number = 7) => {
    try {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      const deadLetterNotifications = await pb.collection('dead_letter_notifications').getList(1, 1000, {
        filter: `created >= "${startDate.toISOString()}"`,
        sort: '-created'
      })

      const stats = {
        total: deadLetterNotifications.totalItems,
        byReason: {} as Record<string, number>,
        byTemplate: {} as Record<string, number>,
        recentFailures: deadLetterNotifications.items.slice(0, 10)
      }

      // Group by failure reason
      deadLetterNotifications.items.forEach((item: any) => {
        const reason = item.failure_reason || 'UNKNOWN'
        stats.byReason[reason] = (stats.byReason[reason] || 0) + 1

        const templateId = item.template_id || 'UNKNOWN'
        stats.byTemplate[templateId] = (stats.byTemplate[templateId] || 0) + 1
      })

      return stats

    } catch (error) {
      console.error('❌ Error getting dead letter stats:', error)
      return null
    }
  }

  /**
   * Requeue notifications from dead letter queue (manual recovery)
   */
  const requeueFromDeadLetter = async (deadLetterIds: string[]): Promise<number> => {
    try {
      let requeuedCount = 0

      for (const deadLetterId of deadLetterIds) {
        try {
          const deadLetter = await pb.collection('dead_letter_notifications').getOne(deadLetterId)
          
          // Create new scheduled notification
          await pb.collection('scheduled_notifications').create({
            rule_id: deadLetter.rule_id,
            user_id: deadLetter.user_id,
            scheduled_for: new Date().toISOString(), // Schedule immediately
            status: 'pending',
            retry_count: 0, // Reset retry count
            metadata: {
              ...deadLetter.metadata,
              requeuedFrom: deadLetterId,
              requeuedAt: new Date().toISOString()
            }
          })

          // Mark dead letter as requeued
          await pb.collection('dead_letter_notifications').update(deadLetterId, {
            metadata: {
              ...deadLetter.metadata,
              requeued: true,
              requeuedAt: new Date().toISOString()
            }
          })

          requeuedCount++

        } catch (error) {
          console.error(`❌ Error requeuing dead letter ${deadLetterId}:`, error)
        }
      }

      console.log(`🔄 Requeued ${requeuedCount} notifications from dead letter queue`)
      return requeuedCount

    } catch (error) {
      console.error('❌ Error requeuing from dead letter:', error)
      return 0
    }
  }

  return {
    // Core retry functionality
    handleDeliveryFailure,
    processRetryQueue,
    attemptNotificationDelivery,

    // Dead letter queue management
    moveToDeadLetterQueue,
    getDeadLetterStats,
    requeueFromDeadLetter,

    // Utility functions
    calculateNextRetryTime,
    isRetryableError,
    trackDeliveryAttempt,

    // Configuration
    defaultRetryConfig
  }
}