import type PocketBase from 'pocketbase'

// Log levels and categories
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL'
}

export enum LogCategory {
  NOTIFICATION_DELIVERY = 'NOTIFICATION_DELIVERY',
  FCM_TOKEN = 'FCM_TOKEN',
  SCHEDULING = 'SCHEDULING',
  TEMPLATE_RENDERING = 'TEMPLATE_RENDERING',
  USER_GROUPS = 'USER_GROUPS',
  CAMPAIGNS = 'CAMPAIGNS',
  SERVICE_WORKER = 'SERVICE_WORKER',
  DATABASE = 'DATABASE',
  AUTHENTICATION = 'AUTHENTICATION',
  SYSTEM = 'SYSTEM',
  PERFORMANCE = 'PERFORMANCE',
  USER_INTERACTION = 'USER_INTERACTION'
}

export interface LogEntry {
  id?: string
  level: LogLevel
  category: LogCategory
  message: string
  details?: Record<string, any>
  user_id?: string
  session_id?: string
  campaign_id?: string
  notification_id?: string
  component?: string
  method?: string
  duration_ms?: number
  memory_usage?: number
  error_stack?: string
  user_agent?: string
  ip_address?: string
  timestamp: string
  created?: string
}

export interface LoggerConfig {
  enableConsoleLogging: boolean
  enableDatabaseLogging: boolean
  enableLocalStorage: boolean
  enablePerformanceLogging: boolean
  minLogLevel: LogLevel
  maxLocalStorageEntries: number
  batchSize: number
  flushIntervalMs: number
  enableSensitiveDataLogging: boolean
}

export const useNotificationLogger = () => {
  const { $pb } = useNuxtApp()
  const pb = $pb as PocketBase

  // Prevent circular logging dependencies
  const isLogging = ref(false)

  // Default configuration
  const defaultConfig: LoggerConfig = {
    enableConsoleLogging: true,
    enableDatabaseLogging: true,
    enableLocalStorage: true,
    enablePerformanceLogging: true,
    minLogLevel: LogLevel.INFO,
    maxLocalStorageEntries: 1000,
    batchSize: 10,
    flushIntervalMs: 30000, // 30 seconds
    enableSensitiveDataLogging: false
  }

  const config = ref<LoggerConfig>(defaultConfig)
  const logBuffer = ref<LogEntry[]>([])
  const flushTimer = ref<NodeJS.Timeout | null>(null)

  /**
   * Main logging function
   */
  const log = async (
    level: LogLevel,
    category: LogCategory,
    message: string,
    details?: Record<string, any>,
    context?: {
      userId?: string
      sessionId?: string
      campaignId?: string
      notificationId?: string
      component?: string
      method?: string
      duration?: number
      error?: Error
    }
  ): Promise<void> => {
    try {
      // Prevent circular logging dependencies
      if (isLogging.value) {
        console.warn('⚠️ Circular logging detected, falling back to console:', { level, category, message })
        return
      }

      // Check if log level meets minimum threshold
      if (!shouldLog(level)) {
        return
      }

      // Set logging flag to prevent recursion
      isLogging.value = true

      // Create log entry
      const logEntry: LogEntry = {
        level,
        category,
        message,
        details: sanitizeDetails(details),
        user_id: context?.userId || getCurrentUserId(),
        session_id: context?.sessionId,
        campaign_id: context?.campaignId,
        notification_id: context?.notificationId,
        component: context?.component,
        method: context?.method,
        duration_ms: context?.duration,
        memory_usage: getMemoryUsage(),
        error_stack: context?.error?.stack,
        user_agent: process.client ? navigator.userAgent : 'server',
        ip_address: await getClientIP(),
        timestamp: new Date().toISOString()
      }

      // Console logging
      if (config.value.enableConsoleLogging) {
        logToConsole(logEntry)
      }

      // Local storage logging
      if (config.value.enableLocalStorage && process.client) {
        logToLocalStorage(logEntry)
      }

      // Database logging (buffered)
      if (config.value.enableDatabaseLogging) {
        addToBuffer(logEntry)
      }

    } catch (loggingError) {
      console.error('❌ Logging failed:', loggingError)
    } finally {
      // Always reset the logging flag
      isLogging.value = false
    }
  }

  /**
   * Convenience methods for different log levels
   */
  const debug = (category: LogCategory, message: string, details?: Record<string, any>, context?: any) => {
    return log(LogLevel.DEBUG, category, message, details, context)
  }

  const info = (category: LogCategory, message: string, details?: Record<string, any>, context?: any) => {
    return log(LogLevel.INFO, category, message, details, context)
  }

  const warn = (category: LogCategory, message: string, details?: Record<string, any>, context?: any) => {
    return log(LogLevel.WARN, category, message, details, context)
  }

  const error = (category: LogCategory, message: string, details?: Record<string, any>, context?: any) => {
    return log(LogLevel.ERROR, category, message, details, context)
  }

  const critical = (category: LogCategory, message: string, details?: Record<string, any>, context?: any) => {
    return log(LogLevel.CRITICAL, category, message, details, context)
  }

  /**
   * Performance logging utilities
   */
  const startPerformanceTimer = (operation: string): PerformanceTimer => {
    const startTime = performance.now()
    const startMemory = getMemoryUsage()

    return {
      operation,
      startTime,
      startMemory,
      end: async (category: LogCategory, details?: Record<string, any>, context?: any) => {
        const endTime = performance.now()
        const endMemory = getMemoryUsage()
        const duration = endTime - startTime
        const memoryDelta = endMemory - startMemory

        if (config.value.enablePerformanceLogging) {
          await log(LogLevel.INFO, category, `Performance: ${operation}`, {
            ...details,
            duration_ms: Math.round(duration),
            memory_delta: memoryDelta,
            start_memory: startMemory,
            end_memory: endMemory
          }, {
            ...context,
            duration: Math.round(duration)
          })
        }

        return {
          duration,
          memoryDelta
        }
      }
    }
  }

  interface PerformanceTimer {
    operation: string
    startTime: number
    startMemory: number
    end: (category: LogCategory, details?: Record<string, any>, context?: any) => Promise<{
      duration: number
      memoryDelta: number
    }>
  }

  /**
   * Specialized logging methods for notification events
   */
  const logNotificationDelivery = async (
    notificationId: string,
    status: 'sent' | 'delivered' | 'failed' | 'clicked' | 'dismissed',
    details?: Record<string, any>
  ) => {
    await info(LogCategory.NOTIFICATION_DELIVERY, `Notification ${status}`, {
      notification_id: notificationId,
      status,
      ...details
    }, {
      notificationId
    })
  }

  const logFCMTokenEvent = async (
    event: 'generated' | 'refreshed' | 'validated' | 'expired' | 'invalid',
    details?: Record<string, any>
  ) => {
    await info(LogCategory.FCM_TOKEN, `FCM token ${event}`, {
      event,
      ...details
    })
  }

  const logSchedulingEvent = async (
    event: 'scheduled' | 'cancelled' | 'executed' | 'failed',
    ruleId?: string,
    details?: Record<string, any>
  ) => {
    await info(LogCategory.SCHEDULING, `Notification ${event}`, {
      event,
      rule_id: ruleId,
      ...details
    })
  }

  const logTemplateEvent = async (
    event: 'rendered' | 'failed' | 'fallback_used',
    templateId?: string,
    details?: Record<string, any>
  ) => {
    await info(LogCategory.TEMPLATE_RENDERING, `Template ${event}`, {
      event,
      template_id: templateId,
      ...details
    }, {
      templateId
    })
  }

  const logCampaignEvent = async (
    event: 'created' | 'started' | 'paused' | 'completed' | 'failed',
    campaignId?: string,
    details?: Record<string, any>
  ) => {
    await info(LogCategory.CAMPAIGNS, `Campaign ${event}`, {
      event,
      campaign_id: campaignId,
      ...details
    }, {
      campaignId
    })
  }

  const logUserInteraction = async (
    action: string,
    details?: Record<string, any>
  ) => {
    await info(LogCategory.USER_INTERACTION, `User ${action}`, {
      action,
      ...details
    })
  }

  /**
   * System health logging
   */
  const logSystemHealth = async () => {
    try {
      const healthData = {
        memory_usage: getMemoryUsage(),
        timestamp: new Date().toISOString(),
        user_agent: process.client ? navigator.userAgent : 'server',
        online: process.client ? navigator.onLine : true,
        connection: process.client && 'connection' in navigator ? {
          effective_type: (navigator as any).connection?.effectiveType,
          downlink: (navigator as any).connection?.downlink,
          rtt: (navigator as any).connection?.rtt
        } : null
      }

      await info(LogCategory.SYSTEM, 'System health check', healthData)
    } catch (healthError) {
      console.error('❌ System health logging failed:', healthError)
    }
  }

  /**
   * Database operations logging
   */
  const logDatabaseOperation = async (
    operation: string,
    collection: string,
    success: boolean,
    duration?: number,
    details?: Record<string, any>
  ) => {
    const level = success ? LogLevel.INFO : LogLevel.ERROR

    await log(level, LogCategory.DATABASE, `Database ${operation}`, {
      operation,
      collection,
      success,
      duration_ms: duration,
      ...details
    }, {
      duration
    })
  }

  /**
   * Internal logging utilities
   */
  const shouldLog = (level: LogLevel): boolean => {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR, LogLevel.CRITICAL]
    const minIndex = levels.indexOf(config.value.minLogLevel)
    const currentIndex = levels.indexOf(level)
    return currentIndex >= minIndex
  }

  const logToConsole = (logEntry: LogEntry): void => {
    const timestamp = new Date(logEntry.timestamp).toLocaleTimeString()
    const prefix = `[${timestamp}] [${logEntry.level}] [${logEntry.category}]`

    const logData = {
      message: logEntry.message,
      details: logEntry.details,
      context: {
        user_id: logEntry.user_id,
        session_id: logEntry.session_id,
        campaign_id: logEntry.campaign_id,
        notification_id: logEntry.notification_id,
        component: logEntry.component,
        method: logEntry.method,
        duration_ms: logEntry.duration_ms
      }
    }

    switch (logEntry.level) {
      case LogLevel.DEBUG:
        console.debug(prefix, logData)
        break
      case LogLevel.INFO:
        console.info(prefix, logData)
        break
      case LogLevel.WARN:
        console.warn(prefix, logData)
        break
      case LogLevel.ERROR:
        console.error(prefix, logData)
        break
      case LogLevel.CRITICAL:
        console.error('🚨 CRITICAL:', prefix, logData)
        break
    }
  }

  const logToLocalStorage = (logEntry: LogEntry): void => {
    try {
      const storageKey = 'notification_logs'
      const existingLogs = JSON.parse(localStorage.getItem(storageKey) || '[]')

      // Add new log entry
      existingLogs.push(logEntry)

      // Maintain max entries limit
      if (existingLogs.length > config.value.maxLocalStorageEntries) {
        existingLogs.splice(0, existingLogs.length - config.value.maxLocalStorageEntries)
      }

      localStorage.setItem(storageKey, JSON.stringify(existingLogs))
    } catch (storageError) {
      console.error('❌ Local storage logging failed:', storageError)
    }
  }

  const addToBuffer = (logEntry: LogEntry): void => {
    logBuffer.value.push(logEntry)

    // Flush buffer if it reaches batch size
    if (logBuffer.value.length >= config.value.batchSize) {
      flushBuffer()
    }

    // Set up flush timer if not already set
    if (!flushTimer.value) {
      flushTimer.value = setTimeout(() => {
        flushBuffer()
        flushTimer.value = null
      }, config.value.flushIntervalMs)
    }
  }

  const flushBuffer = async (): Promise<void> => {
    if (logBuffer.value.length === 0) return

    try {
      const logsToFlush = [...logBuffer.value]
      logBuffer.value = []

      // Clear timer
      if (flushTimer.value) {
        clearTimeout(flushTimer.value)
        flushTimer.value = null
      }

      // Send logs to database
      await sendLogsToDatabase(logsToFlush)

    } catch (flushError) {
      console.error('❌ Buffer flush failed:', flushError)

      // Put logs back in buffer for retry
      logBuffer.value.unshift(...logBuffer.value)
    }
  }

  const sendLogsToDatabase = async (logs: LogEntry[]): Promise<void> => {
    try {
      // Send logs in batches to avoid overwhelming the database
      const batchPromises = logs.map(logEntry =>
        pb.collection('notification_logs').create({
          level: logEntry.level,
          category: logEntry.category,
          message: logEntry.message,
          details: logEntry.details || {},
          user_id: logEntry.user_id,
          session_id: logEntry.session_id,
          campaign_id: logEntry.campaign_id,
          notification_id: logEntry.notification_id,
          component: logEntry.component,
          method: logEntry.method,
          duration_ms: logEntry.duration_ms,
          memory_usage: logEntry.memory_usage,
          error_stack: logEntry.error_stack,
          user_agent: logEntry.user_agent,
          ip_address: logEntry.ip_address,
          timestamp: logEntry.timestamp
        }).catch(error => {
          // Handle auto-cancellation gracefully
          if (error instanceof Error && error.message.includes('autocancelled')) {
            console.debug('Log save request was auto-cancelled, this is normal')
            return null
          }
          // Handle collection not found or other database errors
          if (error instanceof Error && (
            error.message.includes('404') ||
            error.message.includes('not found') ||
            error.message.includes('400') ||
            error.message.includes('Failed to create')
          )) {
            console.warn('⚠️ notification_logs collection not available')
            return null
          }
          console.error('❌ Failed to save log entry:', error)
          return null
        })
      )

      await Promise.all(batchPromises)
      console.debug(`✅ Flushed ${logs.length} log entries to database`)

    } catch (dbError) {
      console.error('❌ Database logging failed:', dbError)
      throw dbError
    }
  }

  /**
   * Utility functions
   */
  const sanitizeDetails = (details?: Record<string, any>): Record<string, any> | undefined => {
    if (!details) return undefined

    const sanitized = { ...details }

    // Remove sensitive data if not enabled
    if (!config.value.enableSensitiveDataLogging) {
      const sensitiveKeys = ['password', 'token', 'secret', 'key', 'auth', 'credential']

      for (const key of Object.keys(sanitized)) {
        if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
          sanitized[key] = '[REDACTED]'
        }
      }
    }

    return sanitized
  }

  const getCurrentUserId = (): string | undefined => {
    return pb.authStore.model?.id
  }

  const getMemoryUsage = (): number => {
    if (process.client && 'memory' in performance) {
      return Math.round((performance as any).memory?.usedJSHeapSize / 1024 / 1024) || 0
    }
    return 0
  }

  const getClientIP = async (): Promise<string | undefined> => {
    // In a real implementation, you might want to get this from a service
    // For now, return undefined as IP detection requires server-side logic
    return undefined
  }

  /**
   * Log retrieval and analysis
   */
  const getLogs = async (
    filters: {
      level?: LogLevel
      category?: LogCategory
      userId?: string
      sessionId?: string
      campaignId?: string
      notificationId?: string
      component?: string
      startDate?: Date
      endDate?: Date
      limit?: number
    } = {}
  ): Promise<LogEntry[]> => {
    try {
      // Prevent circular dependencies by avoiding logging during log retrieval
      const wasLogging = isLogging.value
      isLogging.value = true
      // Build filter string for PocketBase
      const filterParts: string[] = []

      if (filters.level) {
        filterParts.push(`level = "${filters.level}"`)
      }
      if (filters.category) {
        filterParts.push(`category = "${filters.category}"`)
      }
      if (filters.userId) {
        filterParts.push(`user_id = "${filters.userId}"`)
      }
      if (filters.sessionId) {
        filterParts.push(`session_id = "${filters.sessionId}"`)
      }
      if (filters.campaignId) {
        filterParts.push(`campaign_id = "${filters.campaignId}"`)
      }
      if (filters.notificationId) {
        filterParts.push(`notification_id = "${filters.notificationId}"`)
      }
      if (filters.component) {
        filterParts.push(`component = "${filters.component}"`)
      }
      if (filters.startDate) {
        filterParts.push(`timestamp >= "${filters.startDate.toISOString()}"`)
      }
      if (filters.endDate) {
        filterParts.push(`timestamp <= "${filters.endDate.toISOString()}"`)
      }

      const filterString = filterParts.join(' && ')
      const limit = filters.limit || 100

      const result = await pb.collection('notification_logs').getList<LogEntry>(1, limit, {
        filter: filterString,
        sort: '-timestamp'
      })

      return result.items

    } catch (error) {
      // Handle auto-cancellation gracefully
      if (error instanceof Error && error.message.includes('autocancelled')) {
        console.debug('Request was auto-cancelled, this is normal')
        return []
      }
      console.error('❌ Failed to retrieve logs:', error)
      return []
    } finally {
      // Restore previous logging state
      isLogging.value = false
    }
  }

  const getLogStats = async (days: number = 7) => {
    try {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      const logs = await getLogs({
        startDate,
        limit: 10000
      })

      const stats = {
        total: logs.length,
        byLevel: {} as Record<LogLevel, number>,
        byCategory: {} as Record<LogCategory, number>,
        byComponent: {} as Record<string, number>,
        errorRate: 0,
        avgDuration: 0,
        recentErrors: [] as LogEntry[]
      }

      let totalDuration = 0
      let durationCount = 0
      let errorCount = 0

      logs.forEach(log => {
        // Count by level
        stats.byLevel[log.level] = (stats.byLevel[log.level] || 0) + 1

        // Count by category
        stats.byCategory[log.category] = (stats.byCategory[log.category] || 0) + 1

        // Count by component
        if (log.component) {
          stats.byComponent[log.component] = (stats.byComponent[log.component] || 0) + 1
        }

        // Track errors
        if (log.level === LogLevel.ERROR || log.level === LogLevel.CRITICAL) {
          errorCount++
          if (stats.recentErrors.length < 10) {
            stats.recentErrors.push(log)
          }
        }

        // Calculate average duration
        if (log.duration_ms) {
          totalDuration += log.duration_ms
          durationCount++
        }
      })

      stats.errorRate = logs.length > 0 ? (errorCount / logs.length) * 100 : 0
      stats.avgDuration = durationCount > 0 ? totalDuration / durationCount : 0

      return stats

    } catch (error) {
      console.error('❌ Failed to get log stats:', error)
      return null
    }
  }

  /**
   * Cleanup and maintenance
   */
  const clearLocalLogs = (): void => {
    if (process.client) {
      localStorage.removeItem('notification_logs')
    }
  }

  const cleanupOldLogs = async (olderThanDays: number = 30): Promise<number> => {
    try {
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - olderThanDays)

      const oldLogs = await pb.collection('notification_logs').getList(1, 1000, {
        filter: `timestamp < "${cutoffDate.toISOString()}"`,
        fields: 'id'
      })

      let deletedCount = 0
      for (const log of oldLogs.items) {
        try {
          await pb.collection('notification_logs').delete(log.id)
          deletedCount++
        } catch (deleteError) {
          console.error('❌ Failed to delete log:', deleteError)
        }
      }

      console.log(`✅ Cleaned up ${deletedCount} old log entries`)
      return deletedCount

    } catch (error) {
      console.error('❌ Log cleanup failed:', error)
      return 0
    }
  }

  // Initialize flush timer on mount
  onMounted(() => {
    if (process.client) {
      // Set up periodic system health logging
      setInterval(logSystemHealth, 5 * 60 * 1000) // Every 5 minutes
    }
  })

  // Cleanup on unmount
  onUnmounted(() => {
    if (flushTimer.value) {
      clearTimeout(flushTimer.value)
    }
    flushBuffer()
  })

  return {
    // Configuration
    config,

    // Main logging methods
    log,
    debug,
    info,
    warn,
    error,
    critical,

    // Performance logging
    startPerformanceTimer,

    // Specialized logging methods
    logNotificationDelivery,
    logFCMTokenEvent,
    logSchedulingEvent,
    logTemplateEvent,
    logCampaignEvent,
    logUserInteraction,
    logSystemHealth,
    logDatabaseOperation,

    // Log retrieval and analysis
    getLogs,
    getLogStats,

    // Buffer management
    flushBuffer,

    // Cleanup
    clearLocalLogs,
    cleanupOldLogs,

    // Constants
    LogLevel,
    LogCategory
  }
}