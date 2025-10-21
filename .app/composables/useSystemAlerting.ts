import type PocketBase from 'pocketbase'
import { useNotificationLogger, LogLevel, LogCategory } from './useNotificationLogger'
import { useNotificationErrorHandler } from './useNotificationErrorHandler'
import type { SystemAlert, SystemMetrics } from './useNotificationMonitoring'

// Alert escalation configuration
export interface AlertEscalationConfig {
  enabled: boolean
  escalationLevels: EscalationLevel[]
  maxEscalationLevel: number
  escalationInterval: number // minutes
  autoResolveTimeout: number // minutes
}

export interface EscalationLevel {
  level: number
  severity: 'low' | 'medium' | 'high' | 'critical'
  notificationChannels: NotificationChannel[]
  recipients: string[] // admin user IDs
  requiresAcknowledgment: boolean
  autoRecoveryEnabled: boolean
}

export interface NotificationChannel {
  type: 'in_app' | 'email' | 'sms' | 'webhook' | 'push'
  enabled: boolean
  config: Record<string, any>
}

// Recovery action configuration
export interface RecoveryAction {
  id: string
  name: string
  description: string
  component: string
  trigger: 'automatic' | 'manual'
  conditions: RecoveryCondition[]
  actions: RecoveryStep[]
  cooldownMinutes: number
  maxRetries: number
}

export interface RecoveryCondition {
  metric: string
  operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte'
  value: number
  duration?: number // minutes - condition must persist
}

export interface RecoveryStep {
  type: 'restart_service' | 'clear_cache' | 'refresh_tokens' | 'scale_resources' | 'notify_admin' | 'custom'
  config: Record<string, any>
  timeout: number // seconds
  retryOnFailure: boolean
}

// Alert notification interface
export interface AlertNotification {
  id?: string
  alert_id: string
  recipient_id: string
  channel: string
  status: 'pending' | 'sent' | 'delivered' | 'failed'
  escalation_level: number
  sent_at?: string
  delivered_at?: string
  acknowledged_at?: string
  created?: string
  updated?: string
}

export const useSystemAlerting = () => {
  const { $pb } = useNuxtApp()
  const pb = $pb as PocketBase
  const logger = useNotificationLogger()
  const errorHandler = useNotificationErrorHandler()

  // Default escalation configuration
  const defaultEscalationConfig: AlertEscalationConfig = {
    enabled: true,
    escalationLevels: [
      {
        level: 1,
        severity: 'medium',
        notificationChannels: [
          { type: 'in_app', enabled: true, config: {} },
          { type: 'push', enabled: true, config: {} }
        ],
        recipients: [], // Will be populated with admin users
        requiresAcknowledgment: false,
        autoRecoveryEnabled: true
      },
      {
        level: 2,
        severity: 'high',
        notificationChannels: [
          { type: 'in_app', enabled: true, config: {} },
          { type: 'push', enabled: true, config: {} },
          { type: 'email', enabled: true, config: {} }
        ],
        recipients: [],
        requiresAcknowledgment: true,
        autoRecoveryEnabled: true
      },
      {
        level: 3,
        severity: 'critical',
        notificationChannels: [
          { type: 'in_app', enabled: true, config: {} },
          { type: 'push', enabled: true, config: {} },
          { type: 'email', enabled: true, config: {} },
          { type: 'sms', enabled: false, config: {} }
        ],
        recipients: [],
        requiresAcknowledgment: true,
        autoRecoveryEnabled: false // Critical alerts require manual intervention
      }
    ],
    maxEscalationLevel: 3,
    escalationInterval: 15, // 15 minutes between escalations
    autoResolveTimeout: 60 // Auto-resolve after 1 hour if conditions improve
  }

  // Default recovery actions
  const defaultRecoveryActions: RecoveryAction[] = [
    {
      id: 'restart_fcm_service',
      name: 'Restart FCM Service',
      description: 'Restart Firebase Cloud Messaging service worker',
      component: 'FCM_SERVICE',
      trigger: 'automatic',
      conditions: [
        { metric: 'fcm_token_success_rate', operator: 'lt', value: 50, duration: 5 }
      ],
      actions: [
        {
          type: 'refresh_tokens',
          config: { service: 'fcm' },
          timeout: 30,
          retryOnFailure: true
        },
        {
          type: 'restart_service',
          config: { service: 'service_worker' },
          timeout: 60,
          retryOnFailure: false
        }
      ],
      cooldownMinutes: 30,
      maxRetries: 3
    },
    {
      id: 'clear_notification_cache',
      name: 'Clear Notification Cache',
      description: 'Clear notification cache and refresh data',
      component: 'NOTIFICATION_SYSTEM',
      trigger: 'automatic',
      conditions: [
        { metric: 'database_response_time', operator: 'gt', value: 2000, duration: 10 }
      ],
      actions: [
        {
          type: 'clear_cache',
          config: { cacheType: 'notifications' },
          timeout: 15,
          retryOnFailure: false
        }
      ],
      cooldownMinutes: 15,
      maxRetries: 2
    },
    {
      id: 'refresh_database_connection',
      name: 'Refresh Database Connection',
      description: 'Refresh PocketBase database connection',
      component: 'DATABASE',
      trigger: 'automatic',
      conditions: [
        { metric: 'database_response_time', operator: 'gt', value: 5000, duration: 5 }
      ],
      actions: [
        {
          type: 'custom',
          config: { action: 'refresh_db_connection' },
          timeout: 30,
          retryOnFailure: true
        }
      ],
      cooldownMinutes: 20,
      maxRetries: 2
    }
  ]

  const escalationConfig = ref<AlertEscalationConfig>(defaultEscalationConfig)
  const recoveryActions = ref<RecoveryAction[]>(defaultRecoveryActions)
  const activeEscalations = ref<Map<string, number>>(new Map())
  const recoveryHistory = ref<Map<string, Date>>(new Map())

  /**
   * Initialize alerting system
   */
  const initializeAlerting = async (): Promise<void> => {
    try {
      await logger.info(LogCategory.SYSTEM, 'Initializing system alerting')

      // Load admin users for escalation recipients
      await loadAdminUsers()

      // Start escalation monitoring
      startEscalationMonitoring()

      await logger.info(LogCategory.SYSTEM, 'System alerting initialized successfully')
    } catch (error) {
      await errorHandler.handleSystemError(error, {
        component: 'SYSTEM_ALERTING',
        method: 'initializeAlerting'
      })
    }
  }

  /**
   * Process new alert and trigger notifications
   */
  const processAlert = async (alert: SystemAlert): Promise<void> => {
    const timer = logger.startPerformanceTimer('process_alert')

    try {
      await logger.info(LogCategory.SYSTEM, 'Processing new alert', {
        alert_id: alert.id,
        severity: alert.severity,
        component: alert.component
      })

      // Determine initial escalation level based on severity
      const initialLevel = getInitialEscalationLevel(alert.severity)
      
      // Send initial notifications
      await sendAlertNotifications(alert, initialLevel)

      // Start escalation tracking
      if (alert.id) {
        activeEscalations.value.set(alert.id, initialLevel)
      }

      // Attempt automatic recovery if enabled
      if (shouldAttemptAutoRecovery(alert, initialLevel)) {
        await attemptAutoRecovery(alert)
      }

      await timer.end(LogCategory.SYSTEM, {
        alert_id: alert.id,
        escalation_level: initialLevel
      })

    } catch (error) {
      await timer.end(LogCategory.SYSTEM, {
        error: error instanceof Error ? error.message : String(error)
      })
      
      await errorHandler.handleSystemError(error, {
        component: 'SYSTEM_ALERTING',
        method: 'processAlert',
        alertId: alert.id
      })
    }
  }

  /**
   * Send alert notifications to appropriate channels
   */
  const sendAlertNotifications = async (
    alert: SystemAlert,
    escalationLevel: number
  ): Promise<void> => {
    try {
      const levelConfig = escalationConfig.value.escalationLevels.find(
        level => level.level === escalationLevel
      )

      if (!levelConfig) {
        await logger.warn(LogCategory.SYSTEM, 'No escalation level configuration found', {
          escalation_level: escalationLevel
        })
        return
      }

      // Send notifications through each enabled channel
      for (const channel of levelConfig.notificationChannels) {
        if (!channel.enabled) continue

        for (const recipientId of levelConfig.recipients) {
          await sendChannelNotification(alert, recipientId, channel, escalationLevel)
        }
      }

    } catch (error) {
      await errorHandler.handleSystemError(error, {
        component: 'SYSTEM_ALERTING',
        method: 'sendAlertNotifications',
        alertId: alert.id
      })
    }
  }

  /**
   * Send notification through specific channel
   */
  const sendChannelNotification = async (
    alert: SystemAlert,
    recipientId: string,
    channel: NotificationChannel,
    escalationLevel: number
  ): Promise<void> => {
    try {
      const notification: Omit<AlertNotification, 'id' | 'created' | 'updated'> = {
        alert_id: alert.id!,
        recipient_id: recipientId,
        channel: channel.type,
        status: 'pending',
        escalation_level: escalationLevel
      }

      // Create notification record
      const savedNotification = await pb.collection('alert_notifications').create(notification)

      try {
        switch (channel.type) {
          case 'in_app':
            await sendInAppNotification(alert, recipientId, escalationLevel)
            break
          case 'push':
            await sendPushNotification(alert, recipientId, escalationLevel)
            break
          case 'email':
            await sendEmailNotification(alert, recipientId, escalationLevel)
            break
          case 'sms':
            await sendSMSNotification(alert, recipientId, escalationLevel)
            break
          case 'webhook':
            await sendWebhookNotification(alert, channel.config, escalationLevel)
            break
        }

        // Update notification status
        await pb.collection('alert_notifications').update(savedNotification.id, {
          status: 'sent',
          sent_at: new Date().toISOString()
        })

        await logger.info(LogCategory.SYSTEM, 'Alert notification sent', {
          alert_id: alert.id,
          recipient_id: recipientId,
          channel: channel.type,
          escalation_level: escalationLevel
        })

      } catch (channelError) {
        // Update notification status to failed
        await pb.collection('alert_notifications').update(savedNotification.id, {
          status: 'failed'
        })

        throw channelError
      }

    } catch (error) {
      await errorHandler.handleSystemError(error, {
        component: 'SYSTEM_ALERTING',
        method: 'sendChannelNotification',
        alertId: alert.id,
        recipientId,
        channel: channel.type
      })
    }
  }

  /**
   * Send in-app notification
   */
  const sendInAppNotification = async (
    alert: SystemAlert,
    recipientId: string,
    escalationLevel: number
  ): Promise<void> => {
    try {
      const notification = {
        title: `🚨 System Alert - ${alert.title}`,
        message: `${alert.message}\n\nComponent: ${alert.component}\nSeverity: ${alert.severity}\nEscalation Level: ${escalationLevel}`,
        type: 'system',
        priority: alert.severity === 'critical' ? 'urgent' : 'high',
        recipient_user_id: recipientId,
        action_url: '/admin/monitoring/dashboard',
        action_text: 'View Dashboard',
        metadata: {
          alert_id: alert.id,
          escalation_level: escalationLevel,
          alert_type: 'system_alert'
        },
        scheduled_for: new Date().toISOString()
      }

      await pb.collection('notifications').create(notification)

    } catch (error) {
      await logger.error(LogCategory.SYSTEM, 'Failed to send in-app notification', {
        alert_id: alert.id,
        recipient_id: recipientId,
        error: error instanceof Error ? error.message : String(error)
      })
      throw error
    }
  }

  /**
   * Send push notification
   */
  const sendPushNotification = async (
    alert: SystemAlert,
    recipientId: string,
    escalationLevel: number
  ): Promise<void> => {
    try {
      // Get user's FCM token
      const user = await pb.collection('users').getOne(recipientId, {
        fields: 'fcm_token'
      })

      if (!user.fcm_token) {
        await logger.warn(LogCategory.SYSTEM, 'No FCM token for admin user', {
          user_id: recipientId
        })
        return
      }

      // Send push notification via API
      const response = await $fetch('/api/notifications/send', {
        method: 'POST',
        body: {
          token: user.fcm_token,
          title: `🚨 System Alert`,
          body: alert.title,
          data: {
            alert_id: alert.id!,
            escalation_level: escalationLevel.toString()
          },
          actionUrl: '/admin/monitoring/dashboard'
        }
      })

      if (!response.success) {
        throw new Error(response.error || 'Failed to send push notification')
      }

    } catch (error) {
      await logger.error(LogCategory.SYSTEM, 'Failed to send push notification', {
        alert_id: alert.id,
        recipient_id: recipientId,
        error: error instanceof Error ? error.message : String(error)
      })
      throw error
    }
  }

  /**
   * Send email notification (placeholder - would integrate with email service)
   */
  const sendEmailNotification = async (
    alert: SystemAlert,
    recipientId: string,
    escalationLevel: number
  ): Promise<void> => {
    try {
      // Get user email
      const user = await pb.collection('users').getOne(recipientId, {
        fields: 'email,name'
      })

      // Email content
      const emailContent = {
        to: user.email,
        subject: `🚨 System Alert - ${alert.title}`,
        html: `
          <h2>System Alert Notification</h2>
          <p><strong>Alert:</strong> ${alert.title}</p>
          <p><strong>Message:</strong> ${alert.message}</p>
          <p><strong>Component:</strong> ${alert.component}</p>
          <p><strong>Severity:</strong> ${alert.severity}</p>
          <p><strong>Escalation Level:</strong> ${escalationLevel}</p>
          <p><strong>Triggered At:</strong> ${new Date(alert.triggered_at).toLocaleString()}</p>
          <p><a href="${process.env.NUXT_PUBLIC_APP_URL}/admin/monitoring/dashboard">View Dashboard</a></p>
        `
      }

      // Log email (in production, integrate with email service like SendGrid, Mailgun, etc.)
      await logger.info(LogCategory.SYSTEM, 'Email notification prepared', {
        alert_id: alert.id,
        recipient_email: user.email,
        escalation_level: escalationLevel
      })

      // TODO: Integrate with actual email service
      console.log('📧 Email notification would be sent:', emailContent)

    } catch (error) {
      await logger.error(LogCategory.SYSTEM, 'Failed to send email notification', {
        alert_id: alert.id,
        recipient_id: recipientId,
        error: error instanceof Error ? error.message : String(error)
      })
      throw error
    }
  }

  /**
   * Send SMS notification (placeholder)
   */
  const sendSMSNotification = async (
    alert: SystemAlert,
    recipientId: string,
    escalationLevel: number
  ): Promise<void> => {
    try {
      // Get user phone number
      const user = await pb.collection('users').getOne(recipientId, {
        fields: 'phone'
      })

      if (!user.phone) {
        await logger.warn(LogCategory.SYSTEM, 'No phone number for admin user', {
          user_id: recipientId
        })
        return
      }

      const smsContent = {
        to: user.phone,
        message: `🚨 SYSTEM ALERT: ${alert.title} - ${alert.component} - Level ${escalationLevel}. Check dashboard immediately.`
      }

      // Log SMS (in production, integrate with SMS service like Twilio)
      await logger.info(LogCategory.SYSTEM, 'SMS notification prepared', {
        alert_id: alert.id,
        recipient_phone: user.phone,
        escalation_level: escalationLevel
      })

      // TODO: Integrate with actual SMS service
      console.log('📱 SMS notification would be sent:', smsContent)

    } catch (error) {
      await logger.error(LogCategory.SYSTEM, 'Failed to send SMS notification', {
        alert_id: alert.id,
        recipient_id: recipientId,
        error: error instanceof Error ? error.message : String(error)
      })
      throw error
    }
  }

  /**
   * Send webhook notification
   */
  const sendWebhookNotification = async (
    alert: SystemAlert,
    config: Record<string, any>,
    escalationLevel: number
  ): Promise<void> => {
    try {
      const webhookUrl = config.url
      if (!webhookUrl) {
        throw new Error('Webhook URL not configured')
      }

      const payload = {
        alert_id: alert.id,
        title: alert.title,
        message: alert.message,
        severity: alert.severity,
        component: alert.component,
        escalation_level: escalationLevel,
        triggered_at: alert.triggered_at,
        metric_name: alert.metric_name,
        metric_value: alert.metric_value,
        threshold: alert.threshold
      }

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...config.headers
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        throw new Error(`Webhook failed with status ${response.status}`)
      }

      await logger.info(LogCategory.SYSTEM, 'Webhook notification sent', {
        alert_id: alert.id,
        webhook_url: webhookUrl,
        escalation_level: escalationLevel
      })

    } catch (error) {
      await logger.error(LogCategory.SYSTEM, 'Failed to send webhook notification', {
        alert_id: alert.id,
        webhook_url: config.url,
        error: error instanceof Error ? error.message : String(error)
      })
      throw error
    }
  }

  /**
   * Attempt automatic recovery for alert
   */
  const attemptAutoRecovery = async (alert: SystemAlert): Promise<void> => {
    try {
      await logger.info(LogCategory.SYSTEM, 'Attempting automatic recovery', {
        alert_id: alert.id,
        component: alert.component
      })

      // Find applicable recovery actions
      const applicableActions = recoveryActions.value.filter(action => 
        action.component === alert.component && 
        action.trigger === 'automatic' &&
        isRecoveryActionApplicable(action, alert)
      )

      for (const action of applicableActions) {
        // Check cooldown
        const lastExecution = recoveryHistory.value.get(action.id)
        if (lastExecution) {
          const cooldownMs = action.cooldownMinutes * 60 * 1000
          if (Date.now() - lastExecution.getTime() < cooldownMs) {
            await logger.info(LogCategory.SYSTEM, 'Recovery action in cooldown', {
              action_id: action.id,
              cooldown_remaining: Math.ceil((cooldownMs - (Date.now() - lastExecution.getTime())) / 60000)
            })
            continue
          }
        }

        await executeRecoveryAction(action, alert)
      }

    } catch (error) {
      await errorHandler.handleSystemError(error, {
        component: 'SYSTEM_ALERTING',
        method: 'attemptAutoRecovery',
        alertId: alert.id
      })
    }
  }

  /**
   * Execute recovery action
   */
  const executeRecoveryAction = async (
    action: RecoveryAction,
    alert: SystemAlert
  ): Promise<void> => {
    const timer = logger.startPerformanceTimer('execute_recovery_action')

    try {
      await logger.info(LogCategory.SYSTEM, 'Executing recovery action', {
        action_id: action.id,
        action_name: action.name,
        alert_id: alert.id
      })

      // Record execution time
      recoveryHistory.value.set(action.id, new Date())

      // Execute each recovery step
      for (const step of action.actions) {
        await executeRecoveryStep(step, action, alert)
      }

      await timer.end(LogCategory.SYSTEM, {
        action_id: action.id,
        steps_executed: action.actions.length
      })

      await logger.info(LogCategory.SYSTEM, 'Recovery action completed successfully', {
        action_id: action.id,
        alert_id: alert.id
      })

    } catch (error) {
      await timer.end(LogCategory.SYSTEM, {
        error: error instanceof Error ? error.message : String(error)
      })

      await logger.error(LogCategory.SYSTEM, 'Recovery action failed', {
        action_id: action.id,
        alert_id: alert.id,
        error: error instanceof Error ? error.message : String(error)
      })

      throw error
    }
  }

  /**
   * Execute individual recovery step
   */
  const executeRecoveryStep = async (
    step: RecoveryStep,
    action: RecoveryAction,
    alert: SystemAlert
  ): Promise<void> => {
    try {
      await logger.info(LogCategory.SYSTEM, 'Executing recovery step', {
        step_type: step.type,
        action_id: action.id
      })

      switch (step.type) {
        case 'restart_service':
          await restartService(step.config)
          break
        case 'clear_cache':
          await clearCache(step.config)
          break
        case 'refresh_tokens':
          await refreshTokens(step.config)
          break
        case 'scale_resources':
          await scaleResources(step.config)
          break
        case 'notify_admin':
          await notifyAdminManually(alert, step.config)
          break
        case 'custom':
          await executeCustomAction(step.config, alert)
          break
      }

      await logger.info(LogCategory.SYSTEM, 'Recovery step completed', {
        step_type: step.type,
        action_id: action.id
      })

    } catch (error) {
      await logger.error(LogCategory.SYSTEM, 'Recovery step failed', {
        step_type: step.type,
        action_id: action.id,
        error: error instanceof Error ? error.message : String(error)
      })

      if (!step.retryOnFailure) {
        throw error
      }
    }
  }

  /**
   * Recovery step implementations
   */
  const restartService = async (config: Record<string, any>): Promise<void> => {
    const service = config.service

    switch (service) {
      case 'service_worker':
        if (process.client && 'serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.getRegistration()
          if (registration) {
            await registration.unregister()
            await navigator.serviceWorker.register('/firebase-messaging-sw.js')
          }
        }
        break
      default:
        await logger.warn(LogCategory.SYSTEM, 'Unknown service restart requested', {
          service
        })
    }
  }

  const clearCache = async (config: Record<string, any>): Promise<void> => {
    const cacheType = config.cacheType

    switch (cacheType) {
      case 'notifications':
        if (process.client) {
          localStorage.removeItem('notification_cache')
          sessionStorage.removeItem('notification_cache')
        }
        break
      case 'templates':
        if (process.client) {
          localStorage.removeItem('template_cache')
        }
        break
      default:
        await logger.warn(LogCategory.SYSTEM, 'Unknown cache type for clearing', {
          cache_type: cacheType
        })
    }
  }

  const refreshTokens = async (config: Record<string, any>): Promise<void> => {
    const service = config.service

    switch (service) {
      case 'fcm':
        // Refresh FCM tokens for all users
        if (process.client && 'serviceWorker' in navigator) {
          const { getMessaging, getToken } = await import('firebase/messaging')
          const messaging = getMessaging()
          await getToken(messaging, { 
            vapidKey: process.env.NUXT_PUBLIC_FIREBASE_VAPID_KEY 
          })
        }
        break
      default:
        await logger.warn(LogCategory.SYSTEM, 'Unknown token refresh service', {
          service
        })
    }
  }

  const scaleResources = async (config: Record<string, any>): Promise<void> => {
    // Placeholder for resource scaling (would integrate with cloud provider)
    await logger.info(LogCategory.SYSTEM, 'Resource scaling requested', config)
  }

  const notifyAdminManually = async (
    alert: SystemAlert,
    config: Record<string, any>
  ): Promise<void> => {
    // Send high-priority manual notification to admins
    await sendAlertNotifications(alert, 3) // Highest escalation level
  }

  const executeCustomAction = async (
    config: Record<string, any>,
    alert: SystemAlert
  ): Promise<void> => {
    const action = config.action

    switch (action) {
      case 'refresh_db_connection':
        // Refresh PocketBase connection
        try {
          await pb.health.check()
        } catch (error) {
          // Connection refresh logic would go here
          throw error
        }
        break
      default:
        await logger.warn(LogCategory.SYSTEM, 'Unknown custom action', {
          action,
          alert_id: alert.id
        })
    }
  }

  /**
   * Start escalation monitoring
   */
  const startEscalationMonitoring = (): void => {
    setInterval(async () => {
      await checkEscalations()
    }, 60000) // Check every minute
  }

  /**
   * Check for alerts that need escalation
   */
  const checkEscalations = async (): Promise<void> => {
    try {
      const now = new Date()
      const escalationInterval = escalationConfig.value.escalationInterval * 60 * 1000

      for (const [alertId, currentLevel] of activeEscalations.value.entries()) {
        // Get alert details
        const alert = await pb.collection('system_alerts').getOne<SystemAlert>(alertId)
        
        if (alert.resolved_at || alert.acknowledged_at) {
          // Remove from active escalations if resolved or acknowledged
          activeEscalations.value.delete(alertId)
          continue
        }

        // Check if escalation is needed
        const triggeredAt = new Date(alert.triggered_at)
        const timeSinceTriggered = now.getTime() - triggeredAt.getTime()
        const escalationsNeeded = Math.floor(timeSinceTriggered / escalationInterval)
        const targetLevel = Math.min(
          currentLevel + escalationsNeeded,
          escalationConfig.value.maxEscalationLevel
        )

        if (targetLevel > currentLevel) {
          await escalateAlert(alert, targetLevel)
          activeEscalations.value.set(alertId, targetLevel)
        }
      }

    } catch (error) {
      await errorHandler.handleSystemError(error, {
        component: 'SYSTEM_ALERTING',
        method: 'checkEscalations'
      })
    }
  }

  /**
   * Escalate alert to higher level
   */
  const escalateAlert = async (alert: SystemAlert, newLevel: number): Promise<void> => {
    try {
      await logger.warn(LogCategory.SYSTEM, 'Escalating alert', {
        alert_id: alert.id,
        new_level: newLevel,
        alert_title: alert.title
      })

      // Send notifications for new escalation level
      await sendAlertNotifications(alert, newLevel)

      // Update alert with escalation info
      await pb.collection('system_alerts').update(alert.id!, {
        escalation_level: newLevel,
        escalated_at: new Date().toISOString()
      })

    } catch (error) {
      await errorHandler.handleSystemError(error, {
        component: 'SYSTEM_ALERTING',
        method: 'escalateAlert',
        alertId: alert.id
      })
    }
  }

  /**
   * Utility functions
   */
  const getInitialEscalationLevel = (severity: string): number => {
    switch (severity) {
      case 'critical':
        return 3
      case 'high':
        return 2
      case 'medium':
        return 1
      case 'low':
      default:
        return 1
    }
  }

  const shouldAttemptAutoRecovery = (alert: SystemAlert, level: number): boolean => {
    const levelConfig = escalationConfig.value.escalationLevels.find(l => l.level === level)
    return levelConfig?.autoRecoveryEnabled ?? false
  }

  const isRecoveryActionApplicable = (action: RecoveryAction, alert: SystemAlert): boolean => {
    // Check if any conditions match the current alert
    return action.conditions.some(condition => {
      const metricValue = getMetricValueFromAlert(alert, condition.metric)
      if (metricValue === undefined) return false

      switch (condition.operator) {
        case 'gt':
          return metricValue > condition.value
        case 'lt':
          return metricValue < condition.value
        case 'eq':
          return metricValue === condition.value
        case 'gte':
          return metricValue >= condition.value
        case 'lte':
          return metricValue <= condition.value
        default:
          return false
      }
    })
  }

  const getMetricValueFromAlert = (alert: SystemAlert, metricName: string): number | undefined => {
    if (alert.metric_name === metricName) {
      return alert.metric_value
    }
    return undefined
  }

  const loadAdminUsers = async (): Promise<void> => {
    try {
      const adminUsers = await pb.collection('users').getList(1, 100, {
        filter: 'role = "admin"',
        fields: 'id'
      })

      // Update escalation config with admin user IDs
      escalationConfig.value.escalationLevels.forEach(level => {
        level.recipients = adminUsers.items.map(user => user.id)
      })

      await logger.info(LogCategory.SYSTEM, 'Admin users loaded for alerting', {
        admin_count: adminUsers.items.length
      })

    } catch (error) {
      await logger.error(LogCategory.SYSTEM, 'Failed to load admin users', {
        error: error instanceof Error ? error.message : String(error)
      })
    }
  }

  return {
    // Configuration
    escalationConfig: readonly(escalationConfig),
    recoveryActions: readonly(recoveryActions),
    
    // State
    activeEscalations: readonly(activeEscalations),
    recoveryHistory: readonly(recoveryHistory),
    
    // Core functions
    initializeAlerting,
    processAlert,
    sendAlertNotifications,
    attemptAutoRecovery,
    escalateAlert,
    
    // Recovery functions
    executeRecoveryAction,
    restartService,
    clearCache,
    refreshTokens,
    
    // Utility functions
    getInitialEscalationLevel,
    shouldAttemptAutoRecovery,
    isRecoveryActionApplicable
  }
}