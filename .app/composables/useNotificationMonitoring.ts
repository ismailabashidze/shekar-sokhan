import type PocketBase from 'pocketbase'
import { useNotificationLogger, LogLevel, LogCategory } from './useNotificationLogger'
import { useSystemAlerting } from './useSystemAlerting'

// System metrics interface
export interface SystemMetrics {
  id?: string
  timestamp: string
  notification_delivery_rate: number
  fcm_token_success_rate: number
  template_render_success_rate: number
  database_response_time: number
  error_rate: number
  active_campaigns: number
  pending_notifications: number
  failed_notifications: number
  memory_usage: number
  cpu_usage?: number
  network_latency?: number
  service_worker_status: 'active' | 'inactive' | 'error'
  user_engagement_score: number
  created?: string
  updated?: string

  // Enhanced error handling and memory fallback metadata
  _error_context?: {
    failed_at: string
    retry_attempts: number
    error_type: 'validation' | 'network' | 'server' | 'unknown'
    last_error: string
  }
  _memory_metadata?: {
    stored_at: string
    store_size_before: number
    sync_attempts: number
    last_sync_attempt: string | null
    priority: 'high' | 'normal'
  }
}

// System alert interface
export interface SystemAlert {
  id?: string
  type: 'performance' | 'error' | 'system' | 'business'
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  message: string
  component: string
  metric_name?: string
  metric_value?: number
  threshold?: number
  triggered_at: string
  resolved_at?: string
  acknowledged_at?: string
  acknowledged_by?: string
  auto_resolved: boolean
  created?: string
  updated?: string
}

// Monitoring configuration
export interface MonitoringConfig {
  metricsCollectionInterval: number // milliseconds
  alertThresholds: {
    deliveryRate: number
    errorRate: number
    responseTime: number
    memoryUsage: number
    failedNotifications: number
  }
  enableRealTimeMonitoring: boolean
  enableAutoRecovery: boolean
  retentionDays: number
}

// Performance metrics
export interface PerformanceMetrics {
  avgDeliveryTime: number
  avgResponseTime: number
  successRate: number
  errorCount: number
  throughput: number
  uptime: number
}

// Health check result
export interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy'
  components: {
    database: 'up' | 'down' | 'slow'
    fcm: 'up' | 'down' | 'degraded'
    serviceWorker: 'active' | 'inactive' | 'error'
    templates: 'operational' | 'degraded' | 'failed'
  }
  metrics: SystemMetrics
  alerts: SystemAlert[]
  timestamp: string
}

export const useNotificationMonitoring = () => {
  const { $pb } = useNuxtApp()
  const pb = $pb as PocketBase
  const logger = useNotificationLogger()
  const alerting = useSystemAlerting()

  /**
   * Safe logger wrapper to prevent cascading failures
   * This prevents logger errors from breaking the monitoring system
   */
  const safeLogger = {
    debug: async (category: LogCategory, message: string, details?: any) => {
      try {
        await logger.debug(category, message, details)
      } catch (logError) {
        // Fallback to console logging with structured format
        const timestamp = new Date().toISOString()
        console.debug(`[${timestamp}] [DEBUG] [${category}] ${message}`, {
          details,
          logger_error: logError instanceof Error ? logError.message : String(logError)
        })
      }
    },
    info: async (category: LogCategory, message: string, details?: any) => {
      try {
        await logger.info(category, message, details)
      } catch (logError) {
        const timestamp = new Date().toISOString()
        console.info(`[${timestamp}] [INFO] [${category}] ${message}`, {
          details,
          logger_error: logError instanceof Error ? logError.message : String(logError)
        })
      }
    },
    warn: async (category: LogCategory, message: string, details?: any) => {
      try {
        await logger.warn(category, message, details)
      } catch (logError) {
        const timestamp = new Date().toISOString()
        console.warn(`[${timestamp}] [WARN] [${category}] ${message}`, {
          details,
          logger_error: logError instanceof Error ? logError.message : String(logError)
        })
      }
    },
    error: async (category: LogCategory, message: string, details?: any) => {
      try {
        await logger.error(category, message, details)
      } catch (logError) {
        const timestamp = new Date().toISOString()
        console.error(`[${timestamp}] [ERROR] [${category}] ${message}`, {
          details,
          logger_error: logError instanceof Error ? logError.message : String(logError)
        })
      }
    },
    critical: async (category: LogCategory, message: string, details?: any) => {
      try {
        await logger.critical(category, message, details)
      } catch (logError) {
        const timestamp = new Date().toISOString()
        console.error(`[${timestamp}] 🚨 CRITICAL [${category}] ${message}`, {
          details,
          logger_error: logError instanceof Error ? logError.message : String(logError)
        })
      }
    }
  }

  // Default configuration
  const defaultConfig: MonitoringConfig = {
    metricsCollectionInterval: 60000, // 1 minute
    alertThresholds: {
      deliveryRate: 85, // Alert if below 85%
      errorRate: 5, // Alert if above 5%
      responseTime: 1000, // Alert if above 1000ms
      memoryUsage: 512, // Alert if above 512MB
      failedNotifications: 10 // Alert if above 10 failed notifications
    },
    enableRealTimeMonitoring: true,
    enableAutoRecovery: true,
    retentionDays: 30
  }

  const config = ref<MonitoringConfig>(defaultConfig)
  const currentMetrics = ref<SystemMetrics | null>(null)
  const activeAlerts = ref<SystemAlert[]>([])
  const monitoringInterval = ref<NodeJS.Timeout | null>(null)
  const isMonitoring = ref(false)

  // Memory fallback storage for when database operations fail
  const memoryMetricsStore = ref<SystemMetrics[]>([])
  const memoryAlertsStore = ref<SystemAlert[]>([])
  const maxMemoryEntries = 100

  /**
   * Start monitoring system
   */
  const startMonitoring = async (): Promise<void> => {
    try {
      if (isMonitoring.value) {
        console.log('📊 Monitoring already active')
        return
      }

      console.log('🚀 Starting notification system monitoring')
      isMonitoring.value = true

      // Initial metrics collection
      await collectMetrics()

      // Set up periodic metrics collection
      monitoringInterval.value = setInterval(async () => {
        try {
          await collectMetrics()
          await checkAlerts()
        } catch (error) {
          await safeLogger.error(LogCategory.SYSTEM, 'Monitoring cycle failed', {
            error: error instanceof Error ? error.message : String(error)
          })
        }
      }, config.value.metricsCollectionInterval)

      await safeLogger.info(LogCategory.SYSTEM, 'Monitoring started successfully')

    } catch (error) {
      await safeLogger.error(LogCategory.SYSTEM, 'Failed to start monitoring', {
        error: error instanceof Error ? error.message : String(error)
      })
      throw error
    }
  }

  /**
   * Stop monitoring system
   */
  const stopMonitoring = (): void => {
    if (monitoringInterval.value) {
      clearInterval(monitoringInterval.value)
      monitoringInterval.value = null
    }
    isMonitoring.value = false
    console.log('⏹️ Monitoring stopped')
  }

  /**
   * Validate and sanitize metrics data for PocketBase
   */
  const validateAndSanitizeMetrics = (rawMetrics: any): SystemMetrics => {
    // Helper function to ensure number is valid and within bounds
    const sanitizeNumber = (value: any, min: number = 0, max?: number, noDecimal: boolean = false): number => {
      let num = Number(value)
      if (isNaN(num) || !isFinite(num)) num = min
      if (num < min) num = min
      if (max !== undefined && num > max) num = max
      return noDecimal ? Math.round(num) : num
    }

    // Helper function to ensure service worker status is valid
    const sanitizeServiceWorkerStatus = (status: any): 'active' | 'inactive' | 'error' => {
      const validStatuses = ['active', 'inactive', 'error'] as const
      return validStatuses.includes(status) ? status : 'inactive'
    }

    return {
      timestamp: new Date().toISOString(),
      notification_delivery_rate: sanitizeNumber(rawMetrics.notification_delivery_rate, 0, 100),
      fcm_token_success_rate: sanitizeNumber(rawMetrics.fcm_token_success_rate, 0, 100),
      template_render_success_rate: sanitizeNumber(rawMetrics.template_render_success_rate, 0, 100),
      database_response_time: sanitizeNumber(rawMetrics.database_response_time, 0, undefined, true),
      error_rate: sanitizeNumber(rawMetrics.error_rate, 0, 100),
      active_campaigns: sanitizeNumber(rawMetrics.active_campaigns, 0, undefined, true),
      pending_notifications: sanitizeNumber(rawMetrics.pending_notifications, 0, undefined, true),
      failed_notifications: sanitizeNumber(rawMetrics.failed_notifications, 0, undefined, true),
      memory_usage: sanitizeNumber(rawMetrics.memory_usage, 0, undefined, true),
      cpu_usage: rawMetrics.cpu_usage !== undefined ? sanitizeNumber(rawMetrics.cpu_usage, 0, 100) : undefined,
      network_latency: rawMetrics.network_latency !== undefined ? sanitizeNumber(rawMetrics.network_latency, 0, undefined, true) : undefined,
      service_worker_status: sanitizeServiceWorkerStatus(rawMetrics.service_worker_status),
      user_engagement_score: sanitizeNumber(rawMetrics.user_engagement_score, 0, 100)
    }
  }

  /**
   * Enhanced error diagnostics for API failures with comprehensive 400 error capture
   */
  const captureDetailedError = (error: any, operation: string, data?: any) => {
    // Extract detailed PocketBase error information
    const extractPocketBaseError = (err: any) => {
      const pbError: any = {
        status: err?.status || err?.response?.status,
        statusText: err?.statusText || err?.response?.statusText,
        data: err?.data || err?.response?.data,
        originalError: err?.originalError || err?.response?.originalError
      }

      // For 400 errors, capture validation details
      if (pbError.status === 400) {
        pbError.validation_errors = err?.data?.data || err?.response?.data?.data
        pbError.field_errors = {}

        // Extract field-specific validation errors
        if (pbError.validation_errors && typeof pbError.validation_errors === 'object') {
          Object.keys(pbError.validation_errors).forEach(field => {
            pbError.field_errors[field] = {
              code: pbError.validation_errors[field]?.code,
              message: pbError.validation_errors[field]?.message,
              value: data?.[field] // Include the actual value that failed validation
            }
          })
        }

        // Capture complete request/response cycle for 400 errors
        pbError.request_headers = err?.config?.headers || err?.request?.headers
        pbError.response_headers = err?.response?.headers
        pbError.request_url = err?.config?.url || err?.request?.url
        pbError.request_method = err?.config?.method || err?.request?.method
      }

      return pbError
    }

    const errorInfo = {
      operation,
      timestamp: new Date().toISOString(),
      error_message: error instanceof Error ? error.message : String(error),
      error_name: error instanceof Error ? error.name : 'Unknown',
      error_stack: error instanceof Error ? error.stack : undefined,

      // Enhanced PocketBase error details
      pocketbase_error: extractPocketBaseError(error),

      // Request context
      request_data: data,
      request_data_types: data ? Object.keys(data).reduce((acc: any, key) => {
        acc[key] = typeof data[key]
        return acc
      }, {}) : undefined,
      request_data_size: data ? JSON.stringify(data).length : 0,

      // System context
      user_agent: process.client ? navigator.userAgent : 'server',
      pb_auth_valid: pb.authStore.isValid,
      pb_auth_model: pb.authStore.model?.id ? 'authenticated' : 'anonymous',
      pb_auth_token_length: pb.authStore.token?.length || 0,

      // Environment context
      client_side: process.client,
      memory_usage: process.client && 'memory' in performance
        ? Math.round((performance as any).memory?.usedJSHeapSize / 1024 / 1024) || 0
        : undefined,
      connection_type: process.client && 'connection' in navigator
        ? (navigator as any).connection?.effectiveType
        : undefined,

      // Error classification
      is_network_error: !error?.status && !error?.response?.status,
      is_validation_error: error?.status === 400 || error?.response?.status === 400,
      is_auth_error: error?.status === 401 || error?.response?.status === 401,
      is_permission_error: error?.status === 403 || error?.response?.status === 403,
      is_not_found_error: error?.status === 404 || error?.response?.status === 404,
      is_server_error: (error?.status >= 500 && error?.status < 600) ||
        (error?.response?.status >= 500 && error?.response?.status < 600)
    }

    // Enhanced logging with structured format
    const logLevel = errorInfo.is_server_error || errorInfo.is_network_error ? 'CRITICAL' : 'ERROR'
    console.error(`❌ [${logLevel}] ${operation} failed:`, {
      summary: {
        operation: errorInfo.operation,
        error: errorInfo.error_message,
        status: errorInfo.pocketbase_error.status,
        timestamp: errorInfo.timestamp
      },
      detailed_error: errorInfo,
      // Separate validation errors for easy debugging
      validation_issues: errorInfo.pocketbase_error.field_errors
    })

    // Log specific guidance for common error types
    if (errorInfo.is_validation_error) {
      console.warn('🔍 Validation Error Debugging Tips:', {
        check_data_types: 'Ensure all numeric fields are numbers, not strings',
        check_required_fields: 'Verify all required fields are present',
        check_enum_values: 'Validate enum fields have allowed values',
        check_field_names: 'Confirm field names match collection schema',
        request_data: errorInfo.request_data,
        field_errors: errorInfo.pocketbase_error.field_errors
      })
    }

    return errorInfo
  }

  /**
   * Enhanced memory fallback storage management with compression and metadata
   */
  const addToMemoryStore = (metrics: SystemMetrics) => {
    // Add metadata for better tracking
    const enhancedMetrics = {
      ...metrics,
      _memory_metadata: {
        stored_at: new Date().toISOString(),
        store_size_before: memoryMetricsStore.value.length,
        sync_attempts: 0,
        last_sync_attempt: null as string | null,
        priority: (metrics._error_context ? 'high' : 'normal') as 'high' | 'normal' // Prioritize failed metrics
      }
    }

    memoryMetricsStore.value.push(enhancedMetrics)

    // Keep only the latest entries to prevent memory bloat
    if (memoryMetricsStore.value.length > maxMemoryEntries) {
      // Prioritize keeping high-priority items (failed metrics)
      const highPriority = memoryMetricsStore.value.filter(m => m._memory_metadata?.priority === 'high')
      const normalPriority = memoryMetricsStore.value.filter(m => m._memory_metadata?.priority !== 'high')

      const keepHighPriority = Math.min(highPriority.length, Math.floor(maxMemoryEntries * 0.3))
      const keepNormalPriority = maxMemoryEntries - keepHighPriority

      memoryMetricsStore.value = [
        ...highPriority.slice(-keepHighPriority),
        ...normalPriority.slice(-keepNormalPriority)
      ]
    }

    // Enhanced localStorage persistence with compression and error recovery
    if (process.client) {
      try {
        const storageData = {
          metrics: memoryMetricsStore.value,
          metadata: {
            last_updated: new Date().toISOString(),
            total_entries: memoryMetricsStore.value.length,
            high_priority_entries: memoryMetricsStore.value.filter(m => m._memory_metadata?.priority === 'high').length,
            version: '1.0'
          }
        }

        const serialized = JSON.stringify(storageData)
        localStorage.setItem('monitoring_metrics_fallback', serialized)

        // Also store a backup with timestamp
        const backupKey = `monitoring_metrics_backup_${Date.now()}`
        localStorage.setItem(backupKey, serialized)

        // Clean up old backups (keep only the latest 3)
        const backupKeys = Object.keys(localStorage)
          .filter(key => key.startsWith('monitoring_metrics_backup_'))
          .sort()

        if (backupKeys.length > 3) {
          backupKeys.slice(0, -3).forEach(key => {
            try {
              localStorage.removeItem(key)
            } catch (cleanupError) {
              console.warn('⚠️ Failed to cleanup old backup:', cleanupError)
            }
          })
        }

        console.log(`💾 Stored ${memoryMetricsStore.value.length} metrics in memory fallback (${serialized.length} bytes)`)

      } catch (storageError) {
        console.warn('⚠️ Failed to persist metrics to localStorage:', {
          error: storageError instanceof Error ? storageError.message : String(storageError),
          metrics_count: memoryMetricsStore.value.length,
          storage_quota_exceeded: storageError instanceof Error && storageError.name === 'QuotaExceededError'
        })

        // If quota exceeded, try to free up space
        if (storageError instanceof Error && storageError.name === 'QuotaExceededError') {
          try {
            // Remove old backups first
            const backupKeys = Object.keys(localStorage)
              .filter(key => key.startsWith('monitoring_metrics_backup_'))
            backupKeys.forEach(key => localStorage.removeItem(key))

            // Retry with reduced dataset
            const reducedMetrics = memoryMetricsStore.value.slice(-Math.floor(maxMemoryEntries / 2))
            const reducedData = {
              metrics: reducedMetrics,
              metadata: {
                last_updated: new Date().toISOString(),
                total_entries: reducedMetrics.length,
                reduced_due_to_quota: true,
                version: '1.0'
              }
            }
            localStorage.setItem('monitoring_metrics_fallback', JSON.stringify(reducedData))
            console.log('✅ Reduced memory store size due to storage quota limits')
          } catch (retryError) {
            console.error('❌ Failed to store even reduced metrics:', retryError)
          }
        }
      }
    }
  }

  /**
   * Enhanced memory to database sync with intelligent retry and error handling
   */
  const syncMemoryToDatabase = async (): Promise<{
    synced: number;
    failed: number;
    skipped: number;
    errors: Array<{ id: string; error: string; retryable: boolean }>;
  }> => {
    let synced = 0
    let failed = 0
    let skipped = 0
    const errors: Array<{ id: string; error: string; retryable: boolean }> = []

    if (!pb.authStore.isValid) {
      console.warn('⚠️ Cannot sync memory metrics: PocketBase authentication invalid')
      return { synced: 0, failed: 0, skipped: memoryMetricsStore.value.length, errors: [] }
    }

    const memoryMetrics = [...memoryMetricsStore.value] // Create a copy to avoid modification during iteration
    const syncedIds: string[] = []

    console.log(`🔄 Starting sync of ${memoryMetrics.length} memory metrics to database`)

    for (const metrics of memoryMetrics) {
      if (!metrics.id?.startsWith('memory-')) {
        skipped++
        continue
      }

      try {
        // Update sync attempt metadata
        if (metrics._memory_metadata) {
          metrics._memory_metadata.sync_attempts = (metrics._memory_metadata.sync_attempts || 0) + 1
          metrics._memory_metadata.last_sync_attempt = new Date().toISOString()
        }

        // Skip if too many failed attempts (unless it's high priority)
        const maxSyncAttempts = metrics._memory_metadata?.priority === 'high' ? 10 : 5
        if (metrics._memory_metadata?.sync_attempts && metrics._memory_metadata.sync_attempts > maxSyncAttempts) {
          console.warn(`⚠️ Skipping metric ${metrics.id} - too many sync attempts (${metrics._memory_metadata.sync_attempts})`)
          skipped++
          continue
        }

        // Prepare data for database
        const dbMetrics = {
          ...metrics,
          timestamp: new Date(metrics.timestamp)
        }

        // Remove memory-specific fields
        delete dbMetrics.id
        delete dbMetrics.created
        delete dbMetrics.updated
        delete dbMetrics._memory_metadata
        delete dbMetrics._error_context

        // Validate before sync
        const validatedMetrics = validateAndSanitizeMetrics(dbMetrics)
        const finalDbMetrics = {
          ...validatedMetrics,
          timestamp: new Date(validatedMetrics.timestamp)
        }

        // Attempt database creation
        const result = await pb.collection('system_metrics').create(finalDbMetrics)

        syncedIds.push(metrics.id)
        synced++

        console.log(`✅ Synced memory metric ${metrics.id} to database as ${result.id}`)

      } catch (error) {
        failed++

        const errorInfo = captureDetailedError(error, `Memory sync for ${metrics.id}`, metrics)
        const isRetryable = !errorInfo.is_validation_error && !errorInfo.is_permission_error

        errors.push({
          id: metrics.id,
          error: errorInfo.error_message,
          retryable: isRetryable
        })

        // Log detailed sync failure
        console.warn(`⚠️ Failed to sync memory metric ${metrics.id}:`, {
          error: errorInfo.error_message,
          status: errorInfo.pocketbase_error.status,
          retryable: isRetryable,
          sync_attempts: metrics._memory_metadata?.sync_attempts || 0,
          stored_at: metrics._memory_metadata?.stored_at
        })

        // For non-retryable errors, consider removing after many attempts
        if (!isRetryable && metrics._memory_metadata?.sync_attempts && metrics._memory_metadata.sync_attempts > 3) {
          console.error(`❌ Removing non-retryable metric ${metrics.id} after ${metrics._memory_metadata.sync_attempts} attempts`)
          syncedIds.push(metrics.id) // Mark for removal
        }
      }
    }

    // Remove successfully synced items and permanently failed items
    if (syncedIds.length > 0) {
      const beforeCount = memoryMetricsStore.value.length
      memoryMetricsStore.value = memoryMetricsStore.value.filter(m => !syncedIds.includes(m.id || ''))
      const afterCount = memoryMetricsStore.value.length

      console.log(`🧹 Cleaned up ${beforeCount - afterCount} metrics from memory store (${afterCount} remaining)`)

      // Update localStorage
      if (process.client) {
        try {
          const storageData = {
            metrics: memoryMetricsStore.value,
            metadata: {
              last_updated: new Date().toISOString(),
              last_sync_result: {
                synced,
                failed,
                skipped,
                timestamp: new Date().toISOString()
              },
              total_entries: memoryMetricsStore.value.length,
              version: '1.0'
            }
          }
          localStorage.setItem('monitoring_metrics_fallback', JSON.stringify(storageData))
        } catch (storageError) {
          console.warn('⚠️ Failed to update localStorage after sync:', storageError)
        }
      }
    }

    // Log sync summary
    const summary = {
      synced,
      failed,
      skipped,
      remaining_in_memory: memoryMetricsStore.value.length,
      retryable_errors: errors.filter(e => e.retryable).length,
      non_retryable_errors: errors.filter(e => !e.retryable).length
    }

    if (synced > 0 || failed > 0) {
      console.log('📊 Memory sync completed:', summary)
    }

    // Log to monitoring system
    await safeLogger.info(LogCategory.SYSTEM, 'Memory metrics sync completed', summary)

    return { synced, failed, skipped, errors }
  }

  /**
   * Safe metrics creation with comprehensive error handling and retry logic
   */
  const safeCreateMetrics = async (rawMetrics: any, retryCount: number = 0): Promise<{
    success: boolean;
    data?: SystemMetrics;
    error?: any;
    fallbackData?: SystemMetrics;
    retryAttempt?: number;
    recoveryAction?: string;
  }> => {
    const maxRetries = 3
    const retryDelay = Math.min(1000 * Math.pow(2, retryCount), 10000) // Exponential backoff, max 10s

    try {
      // Pre-validation checks
      if (!pb.authStore.isValid) {
        throw new Error('PocketBase authentication invalid - cannot create metrics')
      }

      // Validate and sanitize the metrics data
      const validatedMetrics = validateAndSanitizeMetrics(rawMetrics)

      // Additional validation for critical fields
      const criticalFieldsValidation = {
        timestamp: validatedMetrics.timestamp && !isNaN(Date.parse(validatedMetrics.timestamp)),
        notification_delivery_rate: typeof validatedMetrics.notification_delivery_rate === 'number' &&
          validatedMetrics.notification_delivery_rate >= 0 &&
          validatedMetrics.notification_delivery_rate <= 100,
        service_worker_status: ['active', 'inactive', 'error'].includes(validatedMetrics.service_worker_status)
      }

      const failedValidations = Object.entries(criticalFieldsValidation)
        .filter(([_, isValid]) => !isValid)
        .map(([field]) => field)

      if (failedValidations.length > 0) {
        throw new Error(`Critical field validation failed: ${failedValidations.join(', ')}`)
      }

      // Convert timestamp to Date object for PocketBase
      const dbMetrics = {
        ...validatedMetrics,
        timestamp: new Date(validatedMetrics.timestamp)
      }

      // Log the attempt for debugging
      if (retryCount > 0) {
        console.log(`🔄 Retry attempt ${retryCount}/${maxRetries} for metrics creation`)
      }

      // Attempt to create the metrics record
      const result = await pb.collection('system_metrics').create(dbMetrics)
      const finalMetrics = {
        ...validatedMetrics,
        id: result.id,
        created: result.created,
        updated: result.updated
      }

      // Success - handle memory sync if needed
      if (memoryMetricsStore.value.length > 0) {
        // Async memory sync without blocking the main operation
        syncMemoryToDatabase()
          .then(({ synced, failed }) => {
            if (synced > 0) {
              console.log(`✅ Synced ${synced} memory metrics to database after successful creation`)
            }
            if (failed > 0) {
              console.warn(`⚠️ Failed to sync ${failed} memory metrics during cleanup`)
            }
          })
          .catch(syncError => {
            console.warn('⚠️ Memory sync operation failed during cleanup:', syncError)
          })
      }

      // Log successful recovery if this was a retry
      if (retryCount > 0) {
        await safeLogger.info(LogCategory.SYSTEM, 'Metrics creation succeeded after retry', {
          retry_attempt: retryCount,
          total_attempts: retryCount + 1,
          metrics_id: result.id
        })
      }

      return {
        success: true,
        data: finalMetrics,
        retryAttempt: retryCount,
        recoveryAction: retryCount > 0 ? 'retry_successful' : 'direct_success'
      }

    } catch (error) {
      // Capture comprehensive error diagnostics
      const errorInfo = captureDetailedError(error, 'System metrics creation', rawMetrics)

      // Determine if this error is retryable
      const isRetryableError = (err: any) => {
        const status = err?.status || err?.response?.status
        // Retry on network errors, 5xx server errors, and some 4xx errors (but not validation errors)
        return !status || // Network error
          (status >= 500 && status < 600) || // Server error
          status === 408 || // Request timeout
          status === 429 || // Rate limit
          status === 502 || // Bad gateway
          status === 503 || // Service unavailable
          status === 504    // Gateway timeout
      }

      // Attempt retry if appropriate
      if (retryCount < maxRetries && isRetryableError(error)) {
        console.warn(`⚠️ Retryable error on attempt ${retryCount + 1}/${maxRetries + 1}, retrying in ${retryDelay}ms...`, {
          error: errorInfo.error_message,
          status: errorInfo.pocketbase_error.status
        })

        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, retryDelay))

        // Recursive retry
        return await safeCreateMetrics(rawMetrics, retryCount + 1)
      }

      // Create fallback metrics for memory storage
      const fallbackMetrics = validateAndSanitizeMetrics(rawMetrics)
      const memoryMetrics = {
        ...fallbackMetrics,
        id: `memory-${Date.now()}-${retryCount}`,
        // Add metadata about the failure
        _error_context: {
          failed_at: new Date().toISOString(),
          retry_attempts: retryCount,
          error_type: (errorInfo.is_validation_error ? 'validation' :
            errorInfo.is_network_error ? 'network' :
              errorInfo.is_server_error ? 'server' : 'unknown') as 'validation' | 'network' | 'server' | 'unknown',
          last_error: errorInfo.error_message
        }
      }

      // Store in memory fallback
      addToMemoryStore(memoryMetrics)

      // Determine recovery action
      let recoveryAction = 'memory_fallback'
      if (retryCount >= maxRetries) {
        recoveryAction = 'max_retries_exceeded'
      } else if (!isRetryableError(error)) {
        recoveryAction = 'non_retryable_error'
      }

      // Enhanced error logging
      await safeLogger.error(LogCategory.SYSTEM, 'Metrics creation failed after all attempts', {
        error_info: errorInfo,
        retry_attempts: retryCount,
        max_retries: maxRetries,
        recovery_action: recoveryAction,
        fallback_id: memoryMetrics.id,
        memory_store_size: memoryMetricsStore.value.length,
        is_retryable: isRetryableError(error),
        next_sync_attempt: 'Will attempt to sync during next successful operation'
      })

      return {
        success: false,
        error: errorInfo,
        fallbackData: memoryMetrics,
        retryAttempt: retryCount,
        recoveryAction
      }
    }
  }

  /**
   * Collect system metrics
   */
  const collectMetrics = async (): Promise<SystemMetrics> => {
    // Safe performance timer to prevent logger failures from breaking metrics collection
    let timer: any = null
    try {
      timer = logger.startPerformanceTimer('collect_metrics')
    } catch (timerError) {
      console.warn('⚠️ Failed to start performance timer:', timerError)
      // Create a fallback timer that does nothing
      timer = {
        end: async () => ({ duration: 0, memoryDelta: 0 })
      }
    }

    try {
      const timestamp = new Date().toISOString()

      // Collect various metrics
      const [
        deliveryMetrics,
        fcmMetrics,
        templateMetrics,
        databaseMetrics,
        campaignMetrics,
        notificationMetrics,
        systemMetrics
      ] = await Promise.all([
        getDeliveryMetrics(),
        getFCMMetrics(),
        getTemplateMetrics(),
        getDatabaseMetrics(),
        getCampaignMetrics(),
        getNotificationMetrics(),
        getSystemMetrics()
      ])

      const rawMetrics = {
        timestamp,
        notification_delivery_rate: deliveryMetrics.successRate,
        fcm_token_success_rate: fcmMetrics.successRate,
        template_render_success_rate: templateMetrics.successRate,
        database_response_time: databaseMetrics.avgResponseTime,
        error_rate: await calculateErrorRate(),
        active_campaigns: campaignMetrics.activeCampaigns,
        pending_notifications: notificationMetrics.pendingCount,
        failed_notifications: notificationMetrics.failedCount,
        memory_usage: systemMetrics.memoryUsage,
        cpu_usage: systemMetrics.cpuUsage,
        network_latency: systemMetrics.networkLatency,
        service_worker_status: await getServiceWorkerStatus(),
        user_engagement_score: await calculateEngagementScore()
      }

      // Store metrics in database with safe creation
      const result = await safeCreateMetrics(rawMetrics)

      if (result.success && result.data) {
        currentMetrics.value = result.data
      } else {
        // Use fallback data if database operation failed
        console.warn('⚠️ Using fallback metrics storage due to database error')
        currentMetrics.value = result.fallbackData || validateAndSanitizeMetrics(rawMetrics)
      }

      // Safe timer end to prevent logger failures
      try {
        await timer.end(LogCategory.PERFORMANCE, {
          metrics_collected: Object.keys(rawMetrics).length,
          database_success: result.success
        })
      } catch (timerError) {
        console.warn('⚠️ Failed to end performance timer:', timerError)
      }

      return currentMetrics.value

    } catch (error) {
      // Safe timer end to prevent logger failures
      try {
        await timer.end(LogCategory.PERFORMANCE, {
          error: error instanceof Error ? error.message : String(error)
        })
      } catch (timerError) {
        console.warn('⚠️ Failed to end performance timer:', timerError)
      }

      // Use safe logger to prevent cascading failures
      await safeLogger.error(LogCategory.SYSTEM, 'Metrics collection failed', {
        error: error instanceof Error ? error.message : String(error)
      })

      throw error
    }
  }

  /**
   * Get delivery metrics
   */
  const getDeliveryMetrics = async () => {
    try {
      const last24Hours = new Date()
      last24Hours.setHours(last24Hours.getHours() - 24)

      const notifications = await pb.collection('notifications').getList(1, 1000, {
        filter: `created >= "${last24Hours.toISOString()}"`,
        fields: 'sent_at,delivered_at,clicked_at'
      })

      const total = notifications.items.length
      const delivered = notifications.items.filter(n => n.delivered_at).length
      const clicked = notifications.items.filter(n => n.clicked_at).length

      return {
        total,
        delivered,
        clicked,
        successRate: total > 0 ? (delivered / total) * 100 : 100,
        clickRate: delivered > 0 ? (clicked / delivered) * 100 : 0
      }
    } catch (error) {
      await safeLogger.error(LogCategory.NOTIFICATION_DELIVERY, 'Failed to get delivery metrics', {
        error: error instanceof Error ? error.message : String(error)
      })
      return { total: 0, delivered: 0, clicked: 0, successRate: 0, clickRate: 0 }
    }
  }

  /**
   * Get FCM metrics
   */
  const getFCMMetrics = async () => {
    try {
      const last24Hours = new Date()
      last24Hours.setHours(last24Hours.getHours() - 24)

      // Get FCM-related logs with safe error handling
      let logs: any[] = []
      try {
        logs = await logger.getLogs({
          category: LogCategory.FCM_TOKEN,
          startDate: last24Hours,
          limit: 1000
        })
      } catch (logRetrievalError) {
        // Prevent circular dependency - don't log this error through safeLogger
        console.warn('⚠️ Failed to retrieve FCM logs for metrics calculation:', logRetrievalError)
        logs = []
      }

      const total = logs.length
      const errors = logs.filter(log => log.level === LogLevel.ERROR || log.level === LogLevel.CRITICAL).length
      const successRate = total > 0 ? ((total - errors) / total) * 100 : 100

      return {
        total,
        errors,
        successRate
      }
    } catch (error) {
      await safeLogger.error(LogCategory.FCM_TOKEN, 'Failed to get FCM metrics', {
        error: error instanceof Error ? error.message : String(error)
      })
      return { total: 0, errors: 0, successRate: 100 }
    }
  }

  /**
   * Get template metrics
   */
  const getTemplateMetrics = async () => {
    try {
      const last24Hours = new Date()
      last24Hours.setHours(last24Hours.getHours() - 24)

      // Get template rendering logs with safe error handling
      let logs: any[] = []
      try {
        logs = await logger.getLogs({
          category: LogCategory.TEMPLATE_RENDERING,
          startDate: last24Hours,
          limit: 1000
        })
      } catch (logRetrievalError) {
        // Prevent circular dependency - don't log this error through safeLogger
        console.warn('⚠️ Failed to retrieve template logs for metrics calculation:', logRetrievalError)
        logs = []
      }

      const total = logs.length
      const errors = logs.filter(log => log.level === LogLevel.ERROR || log.level === LogLevel.CRITICAL).length
      const successRate = total > 0 ? ((total - errors) / total) * 100 : 100

      return {
        total,
        errors,
        successRate
      }
    } catch (error) {
      await safeLogger.error(LogCategory.TEMPLATE_RENDERING, 'Failed to get template metrics', {
        error: error instanceof Error ? error.message : String(error)
      })
      return { total: 0, errors: 0, successRate: 100 }
    }
  }

  /**
   * Get database metrics
   */
  const getDatabaseMetrics = async () => {
    try {
      const startTime = performance.now()

      // Test database response time with a simple query
      await pb.collection('users').getList(1, 1, {
        fields: 'id'
      })

      const responseTime = performance.now() - startTime

      // Get database-related logs for error analysis
      const last24Hours = new Date()
      last24Hours.setHours(last24Hours.getHours() - 24)

      // Get database logs with safe error handling
      let logs: any[] = []
      try {
        logs = await logger.getLogs({
          category: LogCategory.DATABASE,
          startDate: last24Hours,
          limit: 1000
        })
      } catch (logRetrievalError) {
        // Prevent circular dependency - don't log this error through safeLogger
        console.warn('⚠️ Failed to retrieve database logs for metrics calculation:', logRetrievalError)
        logs = []
      }

      const errors = logs.filter(log => log.level === LogLevel.ERROR || log.level === LogLevel.CRITICAL).length

      return {
        avgResponseTime: Math.round(responseTime),
        errors,
        isHealthy: responseTime < 1000 && errors < 10
      }
    } catch (error) {
      await safeLogger.error(LogCategory.DATABASE, 'Failed to get database metrics', {
        error: error instanceof Error ? error.message : String(error)
      })
      return { avgResponseTime: 9999, errors: 1, isHealthy: false }
    }
  }

  /**
   * Get campaign metrics
   */
  const getCampaignMetrics = async () => {
    try {
      const activeCampaigns = await pb.collection('notification_campaigns').getList(1, 1000, {
        filter: 'status = "active"',
        fields: 'id'
      })

      return {
        activeCampaigns: activeCampaigns.items.length
      }
    } catch (error) {
      await safeLogger.error(LogCategory.CAMPAIGNS, 'Failed to get campaign metrics', {
        error: error instanceof Error ? error.message : String(error)
      })
      return { activeCampaigns: 0 }
    }
  }

  /**
   * Get notification metrics
   */
  const getNotificationMetrics = async () => {
    try {
      const [pending, failed] = await Promise.all([
        pb.collection('notifications').getList(1, 1000, {
          filter: 'sent_at = "" && scheduled_for <= @now',
          fields: 'id'
        }),
        pb.collection('notifications').getList(1, 1000, {
          filter: 'sent_at != "" && delivered_at = ""',
          fields: 'id'
        })
      ])

      return {
        pendingCount: pending.items.length,
        failedCount: failed.items.length
      }
    } catch (error) {
      await safeLogger.error(LogCategory.NOTIFICATION_DELIVERY, 'Failed to get notification metrics', {
        error: error instanceof Error ? error.message : String(error)
      })
      return { pendingCount: 0, failedCount: 0 }
    }
  }

  /**
   * Get system metrics
   */
  const getSystemMetrics = async () => {
    try {
      const memoryUsage = process.client && 'memory' in performance
        ? Math.round((performance as any).memory?.usedJSHeapSize / 1024 / 1024) || 0
        : 0

      // Network latency test (simple ping to PocketBase)
      const startTime = performance.now()
      try {
        await pb.health.check()
        const networkLatency = Math.round(performance.now() - startTime)

        return {
          memoryUsage,
          cpuUsage: undefined, // CPU usage not available in browser
          networkLatency
        }
      } catch {
        return {
          memoryUsage,
          cpuUsage: undefined,
          networkLatency: 9999 // High latency indicates network issues
        }
      }
    } catch (error) {
      return {
        memoryUsage: 0,
        cpuUsage: undefined,
        networkLatency: 9999
      }
    }
  }

  /**
   * Calculate error rate
   */
  const calculateErrorRate = async (): Promise<number> => {
    try {
      const last24Hours = new Date()
      last24Hours.setHours(last24Hours.getHours() - 24)

      // Get logs for error rate calculation with safe error handling
      let totalLogs: any[] = []
      let errorLogs: any[] = []

      try {
        const [totalLogsResult, errorLogsResult] = await Promise.all([
          logger.getLogs({
            startDate: last24Hours,
            limit: 10000
          }).catch(error => {
            console.warn('⚠️ Failed to retrieve total logs for error rate calculation:', error)
            return []
          }),
          logger.getLogs({
            level: LogLevel.ERROR,
            startDate: last24Hours,
            limit: 10000
          }).catch(error => {
            console.warn('⚠️ Failed to retrieve error logs for error rate calculation:', error)
            return []
          })
        ])

        totalLogs = totalLogsResult
        errorLogs = errorLogsResult
      } catch (logRetrievalError) {
        // Prevent circular dependency - don't log this error through safeLogger
        console.warn('⚠️ Failed to retrieve logs for error rate calculation:', logRetrievalError)
        totalLogs = []
        errorLogs = []
      }

      const total = totalLogs.length
      const errors = errorLogs.length

      return total > 0 ? (errors / total) * 100 : 0
    } catch (error) {
      return 0
    }
  }

  /**
   * Get service worker status
   */
  const getServiceWorkerStatus = async (): Promise<'active' | 'inactive' | 'error'> => {
    try {
      if (!process.client || !('serviceWorker' in navigator)) {
        return 'inactive'
      }

      const registration = await navigator.serviceWorker.getRegistration()

      if (!registration) {
        return 'inactive'
      }

      if (registration.active) {
        return 'active'
      }

      return 'error'
    } catch (error) {
      return 'error'
    }
  }

  /**
   * Calculate user engagement score
   */
  const calculateEngagementScore = async (): Promise<number> => {
    try {
      const last7Days = new Date()
      last7Days.setDate(last7Days.getDate() - 7)

      const notifications = await pb.collection('notifications').getList(1, 1000, {
        filter: `created >= "${last7Days.toISOString()}"`,
        fields: 'sent_at,delivered_at,clicked_at'
      })

      const total = notifications.items.length
      if (total === 0) return 100

      const delivered = notifications.items.filter(n => n.delivered_at).length
      const clicked = notifications.items.filter(n => n.clicked_at).length

      // Engagement score based on delivery and click rates
      const deliveryRate = (delivered / total) * 100
      const clickRate = delivered > 0 ? (clicked / delivered) * 100 : 0

      // Weighted score: 70% delivery rate + 30% click rate
      return Math.round((deliveryRate * 0.7) + (clickRate * 0.3))
    } catch (error) {
      return 0
    }
  }

  /**
   * Check for alerts based on current metrics
   */
  const checkAlerts = async (): Promise<void> => {
    if (!currentMetrics.value) return

    try {
      const metrics = currentMetrics.value
      const alerts: Omit<SystemAlert, 'id' | 'created' | 'updated'>[] = []

      // Check delivery rate
      if (metrics.notification_delivery_rate < config.value.alertThresholds.deliveryRate) {
        alerts.push({
          type: 'performance',
          severity: metrics.notification_delivery_rate < 50 ? 'critical' : 'high',
          title: 'Low Notification Delivery Rate',
          message: `Notification delivery rate is ${metrics.notification_delivery_rate.toFixed(1)}%, below threshold of ${config.value.alertThresholds.deliveryRate}%`,
          component: 'NOTIFICATION_DELIVERY',
          metric_name: 'notification_delivery_rate',
          metric_value: metrics.notification_delivery_rate,
          threshold: config.value.alertThresholds.deliveryRate,
          triggered_at: new Date().toISOString(),
          auto_resolved: false
        })
      }

      // Check error rate
      if (metrics.error_rate > config.value.alertThresholds.errorRate) {
        alerts.push({
          type: 'error',
          severity: metrics.error_rate > 20 ? 'critical' : 'high',
          title: 'High Error Rate',
          message: `System error rate is ${metrics.error_rate.toFixed(1)}%, above threshold of ${config.value.alertThresholds.errorRate}%`,
          component: 'SYSTEM',
          metric_name: 'error_rate',
          metric_value: metrics.error_rate,
          threshold: config.value.alertThresholds.errorRate,
          triggered_at: new Date().toISOString(),
          auto_resolved: false
        })
      }

      // Check response time
      if (metrics.database_response_time > config.value.alertThresholds.responseTime) {
        alerts.push({
          type: 'performance',
          severity: metrics.database_response_time > 5000 ? 'critical' : 'medium',
          title: 'Slow Database Response',
          message: `Database response time is ${metrics.database_response_time}ms, above threshold of ${config.value.alertThresholds.responseTime}ms`,
          component: 'DATABASE',
          metric_name: 'database_response_time',
          metric_value: metrics.database_response_time,
          threshold: config.value.alertThresholds.responseTime,
          triggered_at: new Date().toISOString(),
          auto_resolved: false
        })
      }

      // Check memory usage
      if (metrics.memory_usage > config.value.alertThresholds.memoryUsage) {
        alerts.push({
          type: 'system',
          severity: metrics.memory_usage > 1024 ? 'critical' : 'medium',
          title: 'High Memory Usage',
          message: `Memory usage is ${metrics.memory_usage}MB, above threshold of ${config.value.alertThresholds.memoryUsage}MB`,
          component: 'SYSTEM',
          metric_name: 'memory_usage',
          metric_value: metrics.memory_usage,
          threshold: config.value.alertThresholds.memoryUsage,
          triggered_at: new Date().toISOString(),
          auto_resolved: false
        })
      }

      // Check failed notifications
      if (metrics.failed_notifications > config.value.alertThresholds.failedNotifications) {
        alerts.push({
          type: 'business',
          severity: metrics.failed_notifications > 50 ? 'critical' : 'high',
          title: 'High Failed Notification Count',
          message: `${metrics.failed_notifications} notifications failed, above threshold of ${config.value.alertThresholds.failedNotifications}`,
          component: 'NOTIFICATION_DELIVERY',
          metric_name: 'failed_notifications',
          metric_value: metrics.failed_notifications,
          threshold: config.value.alertThresholds.failedNotifications,
          triggered_at: new Date().toISOString(),
          auto_resolved: false
        })
      }

      // Check service worker status
      if (metrics.service_worker_status !== 'active') {
        alerts.push({
          type: 'system',
          severity: 'high',
          title: 'Service Worker Issue',
          message: `Service worker status is ${metrics.service_worker_status}`,
          component: 'SERVICE_WORKER',
          metric_name: 'service_worker_status',
          metric_value: (metrics.service_worker_status as string) === 'active' ? 1 : 0,
          threshold: 1,
          triggered_at: new Date().toISOString(),
          auto_resolved: false
        })
      }

      // Save new alerts and trigger alerting system
      for (const alert of alerts) {
        try {
          const savedAlert = await pb.collection('system_alerts').create(alert)
          const fullAlert = { ...alert, id: savedAlert.id }
          activeAlerts.value.push(fullAlert)

          await safeLogger.warn(LogCategory.SYSTEM, `Alert triggered: ${alert.title}`, {
            alert_type: alert.type,
            severity: alert.severity,
            component: alert.component,
            metric_name: alert.metric_name,
            metric_value: alert.metric_value,
            threshold: alert.threshold
          })

          // Process alert through alerting system
          await alerting.processAlert(fullAlert)

        } catch (error) {
          await safeLogger.error(LogCategory.SYSTEM, 'Failed to save alert', {
            alert_title: alert.title,
            error: error instanceof Error ? error.message : String(error)
          })
        }
      }

      // Auto-resolve alerts if conditions are met
      if (config.value.enableAutoRecovery) {
        await autoResolveAlerts()
      }

    } catch (error) {
      await safeLogger.error(LogCategory.SYSTEM, 'Alert checking failed', {
        error: error instanceof Error ? error.message : String(error)
      })
    }
  }

  /**
   * Auto-resolve alerts when conditions improve
   */
  const autoResolveAlerts = async (): Promise<void> => {
    try {
      const unresolvedAlerts = await pb.collection('system_alerts').getList(1, 100, {
        filter: 'resolved_at = ""',
        sort: '-triggered_at'
      })

      for (const alert of unresolvedAlerts.items) {
        let shouldResolve = false

        // Check if conditions have improved
        if (currentMetrics.value) {
          switch (alert.metric_name) {
            case 'notification_delivery_rate':
              shouldResolve = currentMetrics.value.notification_delivery_rate >= (alert.threshold || 0)
              break
            case 'error_rate':
              shouldResolve = currentMetrics.value.error_rate <= (alert.threshold || 100)
              break
            case 'database_response_time':
              shouldResolve = currentMetrics.value.database_response_time <= (alert.threshold || 9999)
              break
            case 'memory_usage':
              shouldResolve = currentMetrics.value.memory_usage <= (alert.threshold || 9999)
              break
            case 'failed_notifications':
              shouldResolve = currentMetrics.value.failed_notifications <= (alert.threshold || 9999)
              break
            case 'service_worker_status':
              shouldResolve = currentMetrics.value.service_worker_status === 'active'
              break
          }
        }

        if (shouldResolve) {
          await pb.collection('system_alerts').update(alert.id, {
            resolved_at: new Date().toISOString(),
            auto_resolved: true
          })

          await safeLogger.info(LogCategory.SYSTEM, `Alert auto-resolved: ${alert.title}`, {
            alert_id: alert.id,
            alert_type: alert.type,
            component: alert.component
          })

          // Remove from active alerts
          activeAlerts.value = activeAlerts.value.filter(a => a.id !== alert.id)
        }
      }
    } catch (error) {
      await safeLogger.error(LogCategory.SYSTEM, 'Auto-resolve alerts failed', {
        error: error instanceof Error ? error.message : String(error)
      })
    }
  }

  /**
   * Perform comprehensive health check
   */
  const performHealthCheck = async (): Promise<HealthCheckResult> => {
    // Safe performance timer to prevent logger failures from breaking health checks
    let timer: any = null
    try {
      timer = logger.startPerformanceTimer('health_check')
    } catch (timerError) {
      console.warn('⚠️ Failed to start health check performance timer:', timerError)
      // Create a fallback timer that does nothing
      timer = {
        end: async () => ({ duration: 0, memoryDelta: 0 })
      }
    }

    try {
      // Collect current metrics
      const metrics = await collectMetrics()

      // Check component health
      const components = {
        database: await checkDatabaseHealth(),
        fcm: await checkFCMHealth(),
        serviceWorker: await checkServiceWorkerHealth(),
        templates: await checkTemplateHealth()
      }

      // Get active alerts
      const alerts = await pb.collection('system_alerts').getList<SystemAlert>(1, 50, {
        filter: 'resolved_at = ""',
        sort: '-triggered_at'
      })

      // Determine overall status
      let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy'

      const criticalAlerts = alerts.items.filter(a => a.severity === 'critical')
      const highAlerts = alerts.items.filter(a => a.severity === 'high')

      if (criticalAlerts.length > 0 || Object.values(components).includes('down')) {
        status = 'unhealthy'
      } else if (highAlerts.length > 0 || Object.values(components).includes('slow') || Object.values(components).includes('degraded')) {
        status = 'degraded'
      }

      const result: HealthCheckResult = {
        status,
        components,
        metrics,
        alerts: alerts.items,
        timestamp: new Date().toISOString()
      }

      // Safe timer end to prevent logger failures
      try {
        await timer.end(LogCategory.SYSTEM, {
          status,
          components_checked: Object.keys(components).length,
          alerts_count: alerts.items.length
        })
      } catch (timerError) {
        console.warn('⚠️ Failed to end health check performance timer:', timerError)
      }

      return result

    } catch (error) {
      // Safe timer end to prevent logger failures
      try {
        await timer.end(LogCategory.SYSTEM, {
          error: error instanceof Error ? error.message : String(error)
        })
      } catch (timerError) {
        console.warn('⚠️ Failed to end health check performance timer:', timerError)
      }

      throw error
    }
  }

  /**
   * Component health checks
   */
  const checkDatabaseHealth = async (): Promise<'up' | 'down' | 'slow'> => {
    try {
      const startTime = performance.now()
      await pb.health.check()
      const responseTime = performance.now() - startTime

      if (responseTime > 2000) return 'slow'
      return 'up'
    } catch {
      return 'down'
    }
  }

  const checkFCMHealth = async (): Promise<'up' | 'down' | 'degraded'> => {
    try {
      // Check recent FCM logs for errors
      const last1Hour = new Date()
      last1Hour.setHours(last1Hour.getHours() - 1)

      // Get FCM logs for health check with safe error handling
      let logs: any[] = []
      try {
        logs = await logger.getLogs({
          category: LogCategory.FCM_TOKEN,
          startDate: last1Hour,
          limit: 100
        })
      } catch (logRetrievalError) {
        // Prevent circular dependency - don't log this error through safeLogger
        console.warn('⚠️ Failed to retrieve FCM logs for health check:', logRetrievalError)
        logs = []
      }

      const errors = logs.filter(log => log.level === LogLevel.ERROR || log.level === LogLevel.CRITICAL)
      const errorRate = logs.length > 0 ? (errors.length / logs.length) * 100 : 0

      if (errorRate > 50) return 'down'
      if (errorRate > 10) return 'degraded'
      return 'up'
    } catch {
      return 'down'
    }
  }

  const checkServiceWorkerHealth = async (): Promise<'active' | 'inactive' | 'error'> => {
    return await getServiceWorkerStatus()
  }

  const checkTemplateHealth = async (): Promise<'operational' | 'degraded' | 'failed'> => {
    try {
      // Check recent template rendering logs
      const last1Hour = new Date()
      last1Hour.setHours(last1Hour.getHours() - 1)

      // Get template rendering logs for health check with safe error handling
      let logs: any[] = []
      try {
        logs = await logger.getLogs({
          category: LogCategory.TEMPLATE_RENDERING,
          startDate: last1Hour,
          limit: 100
        })
      } catch (logRetrievalError) {
        // Prevent circular dependency - don't log this error through safeLogger
        console.warn('⚠️ Failed to retrieve template logs for health check:', logRetrievalError)
        logs = []
      }

      const errors = logs.filter(log => log.level === LogLevel.ERROR || log.level === LogLevel.CRITICAL)
      const errorRate = logs.length > 0 ? (errors.length / logs.length) * 100 : 0

      if (errorRate > 50) return 'failed'
      if (errorRate > 10) return 'degraded'
      return 'operational'
    } catch {
      return 'failed'
    }
  }

  /**
   * Get historical metrics
   */
  const getHistoricalMetrics = async (
    days: number = 7,
    interval: 'hour' | 'day' = 'hour'
  ): Promise<SystemMetrics[]> => {
    try {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      const metrics = await pb.collection('system_metrics').getList<SystemMetrics>(1, 1000, {
        filter: `timestamp >= "${startDate.toISOString()}"`,
        sort: 'timestamp'
      })

      return metrics.items
    } catch (error) {
      await safeLogger.error(LogCategory.SYSTEM, 'Failed to get historical metrics', {
        error: error instanceof Error ? error.message : String(error)
      })
      return []
    }
  }

  /**
   * Get performance summary
   */
  const getPerformanceSummary = async (days: number = 7): Promise<PerformanceMetrics> => {
    try {
      const metrics = await getHistoricalMetrics(days)

      if (metrics.length === 0) {
        return {
          avgDeliveryTime: 0,
          avgResponseTime: 0,
          successRate: 0,
          errorCount: 0,
          throughput: 0,
          uptime: 0
        }
      }

      const avgDeliveryRate = metrics.reduce((sum, m) => sum + m.notification_delivery_rate, 0) / metrics.length
      const avgResponseTime = metrics.reduce((sum, m) => sum + m.database_response_time, 0) / metrics.length
      const avgErrorRate = metrics.reduce((sum, m) => sum + m.error_rate, 0) / metrics.length
      const totalFailed = metrics.reduce((sum, m) => sum + m.failed_notifications, 0)

      // Calculate uptime based on healthy metrics
      const healthyMetrics = metrics.filter(m =>
        m.notification_delivery_rate > 80 &&
        m.error_rate < 10 &&
        m.database_response_time < 2000
      )
      const uptime = (healthyMetrics.length / metrics.length) * 100

      return {
        avgDeliveryTime: Math.round(avgResponseTime),
        avgResponseTime: Math.round(avgResponseTime),
        successRate: Math.round(avgDeliveryRate),
        errorCount: totalFailed,
        throughput: Math.round(metrics.length / days), // metrics per day
        uptime: Math.round(uptime)
      }
    } catch (error) {
      await safeLogger.error(LogCategory.SYSTEM, 'Failed to get performance summary', {
        error: error instanceof Error ? error.message : String(error)
      })

      return {
        avgDeliveryTime: 0,
        avgResponseTime: 0,
        successRate: 0,
        errorCount: 0,
        throughput: 0,
        uptime: 0
      }
    }
  }

  /**
   * Acknowledge alert
   */
  const acknowledgeAlert = async (alertId: string): Promise<void> => {
    try {
      await pb.collection('system_alerts').update(alertId, {
        acknowledged_at: new Date().toISOString(),
        acknowledged_by: pb.authStore.model?.id
      })

      await safeLogger.info(LogCategory.SYSTEM, 'Alert acknowledged', {
        alert_id: alertId,
        acknowledged_by: pb.authStore.model?.id
      })
    } catch (error) {
      await safeLogger.error(LogCategory.SYSTEM, 'Failed to acknowledge alert', {
        alert_id: alertId,
        error: error instanceof Error ? error.message : String(error)
      })
      throw error
    }
  }

  /**
   * Resolve alert manually
   */
  const resolveAlert = async (alertId: string): Promise<void> => {
    try {
      await pb.collection('system_alerts').update(alertId, {
        resolved_at: new Date().toISOString(),
        auto_resolved: false
      })

      // Remove from active alerts
      activeAlerts.value = activeAlerts.value.filter(a => a.id !== alertId)

      await safeLogger.info(LogCategory.SYSTEM, 'Alert resolved manually', {
        alert_id: alertId,
        resolved_by: pb.authStore.model?.id
      })
    } catch (error) {
      await safeLogger.error(LogCategory.SYSTEM, 'Failed to resolve alert', {
        alert_id: alertId,
        error: error instanceof Error ? error.message : String(error)
      })
      throw error
    }
  }

  /**
   * Cleanup old data
   */
  const cleanupOldData = async (): Promise<void> => {
    try {
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - config.value.retentionDays)

      // Cleanup old metrics
      const oldMetrics = await pb.collection('system_metrics').getList(1, 1000, {
        filter: `timestamp < "${cutoffDate.toISOString()}"`,
        fields: 'id'
      })

      for (const metric of oldMetrics.items) {
        await pb.collection('system_metrics').delete(metric.id)
      }

      // Cleanup old resolved alerts
      const oldAlerts = await pb.collection('system_alerts').getList(1, 1000, {
        filter: `resolved_at != "" && resolved_at < "${cutoffDate.toISOString()}"`,
        fields: 'id'
      })

      for (const alert of oldAlerts.items) {
        await pb.collection('system_alerts').delete(alert.id)
      }

      await safeLogger.info(LogCategory.SYSTEM, 'Old monitoring data cleaned up', {
        metrics_deleted: oldMetrics.items.length,
        alerts_deleted: oldAlerts.items.length,
        cutoff_date: cutoffDate.toISOString()
      })
    } catch (error) {
      await safeLogger.error(LogCategory.SYSTEM, 'Failed to cleanup old data', {
        error: error instanceof Error ? error.message : String(error)
      })
    }
  }

  /**
   * Enhanced memory store initialization with recovery and validation
   */
  const initializeMemoryStore = () => {
    if (!process.client) return

    try {
      // Try to load main storage
      const stored = localStorage.getItem('monitoring_metrics_fallback')
      let loadedData: any = null

      if (stored) {
        try {
          const parsedData = JSON.parse(stored)

          // Handle both old format (array) and new format (object with metadata)
          if (Array.isArray(parsedData)) {
            loadedData = { metrics: parsedData, metadata: null }
          } else if (parsedData && parsedData.metrics && Array.isArray(parsedData.metrics)) {
            loadedData = parsedData
          }
        } catch (parseError) {
          console.warn('⚠️ Failed to parse main storage, trying backup:', parseError)
          loadedData = null
        }
      }

      // If main storage failed, try to recover from backup
      if (!loadedData) {
        const backupKeys = Object.keys(localStorage)
          .filter(key => key.startsWith('monitoring_metrics_backup_'))
          .sort()
          .reverse() // Try newest backup first

        for (const backupKey of backupKeys) {
          try {
            const backupData = localStorage.getItem(backupKey)
            if (backupData) {
              const parsedBackup = JSON.parse(backupData)
              if (parsedBackup && parsedBackup.metrics && Array.isArray(parsedBackup.metrics)) {
                loadedData = parsedBackup
                console.log(`✅ Recovered metrics from backup: ${backupKey}`)
                break
              }
            }
          } catch (backupError) {
            console.warn(`⚠️ Failed to load backup ${backupKey}:`, backupError)
          }
        }
      }

      if (loadedData && loadedData.metrics) {
        // Validate and clean the loaded metrics
        const validMetrics = loadedData.metrics
          .filter((metric: any) => {
            // Basic validation
            return metric &&
              typeof metric === 'object' &&
              metric.timestamp &&
              typeof metric.notification_delivery_rate === 'number'
          })
          .slice(-maxMemoryEntries) // Keep only the latest entries

        memoryMetricsStore.value = validMetrics

        // Log recovery information
        const recoveryInfo = {
          loaded_count: validMetrics.length,
          has_metadata: !!loadedData.metadata,
          last_updated: loadedData.metadata?.last_updated,
          high_priority_count: validMetrics.filter((m: any) => m._memory_metadata?.priority === 'high').length,
          oldest_entry: validMetrics.length > 0 ? validMetrics[0]?.timestamp : null,
          newest_entry: validMetrics.length > 0 ? validMetrics[validMetrics.length - 1]?.timestamp : null
        }

        console.log('💾 Initialized memory store from localStorage:', recoveryInfo)

        // If we have metrics in memory, schedule a sync attempt
        if (validMetrics.length > 0) {
          console.log(`🔄 Scheduling sync attempt for ${validMetrics.length} recovered metrics`)

          // Wait a bit for the app to initialize, then try to sync
          setTimeout(async () => {
            try {
              const syncResult = await syncMemoryToDatabase()
              if (syncResult.synced > 0) {
                console.log(`✅ Successfully synced ${syncResult.synced} recovered metrics to database`)
              }
            } catch (syncError) {
              console.warn('⚠️ Failed to sync recovered metrics:', syncError)
            }
          }, 5000) // Wait 5 seconds for app initialization
        }

      } else {
        console.log('📝 No valid metrics found in localStorage, starting with empty memory store')
        memoryMetricsStore.value = []
      }

    } catch (error) {
      console.error('❌ Failed to initialize memory store:', error)
      memoryMetricsStore.value = []

      // Try to clear corrupted storage
      try {
        localStorage.removeItem('monitoring_metrics_fallback')
        console.log('🧹 Cleared corrupted localStorage data')
      } catch (clearError) {
        console.warn('⚠️ Failed to clear corrupted storage:', clearError)
      }
    }
  }

  // Initialize monitoring on mount
  onMounted(() => {
    if (process.client) {
      initializeMemoryStore()
      if (config.value.enableRealTimeMonitoring) {
        startMonitoring()
      }
    }
  })

  // Cleanup on unmount
  onUnmounted(() => {
    stopMonitoring()
  })

  /**
   * Get alerts with filtering and pagination
   */
  const getAlerts = async (options: {
    filter?: string
    sort?: string
    perPage?: number
    page?: number
  } = {}): Promise<{ items: SystemAlert[], totalItems: number, totalPages: number }> => {
    try {
      const result = await pb.collection('system_alerts').getList<SystemAlert>(
        options.page || 1,
        options.perPage || 50,
        {
          filter: options.filter || '',
          sort: options.sort || '-triggered_at'
        }
      )

      return {
        items: result.items,
        totalItems: result.totalItems,
        totalPages: result.totalPages
      }
    } catch (error) {
      await safeLogger.error(LogCategory.SYSTEM, 'Failed to get alerts', {
        error: error instanceof Error ? error.message : String(error),
        options
      })
      return { items: [], totalItems: 0, totalPages: 0 }
    }
  }

  /**
   * Create a new alert
   */
  const createAlert = async (alertData: Omit<SystemAlert, 'id' | 'created' | 'updated'>): Promise<SystemAlert | null> => {
    try {
      const alert = await pb.collection('system_alerts').create<SystemAlert>(alertData)

      await safeLogger.info(LogCategory.SYSTEM, 'Alert created', {
        alert_id: alert.id,
        title: alert.title,
        severity: alert.severity
      })

      return alert
    } catch (error) {
      await safeLogger.error(LogCategory.SYSTEM, 'Failed to create alert', {
        error: error instanceof Error ? error.message : String(error),
        alert_data: alertData
      })
      return null
    }
  }

  /**
   * Get comprehensive diagnostic information about the monitoring system
   */
  const getSystemDiagnostics = async (): Promise<{
    system_status: 'healthy' | 'degraded' | 'critical';
    database_connectivity: 'connected' | 'disconnected' | 'slow';
    memory_fallback: {
      enabled: boolean;
      entries_count: number;
      oldest_entry: string | null;
      newest_entry: string | null;
      high_priority_count: number;
      storage_size_bytes: number;
    };
    recent_errors: Array<{
      timestamp: string;
      operation: string;
      error_type: string;
      retryable: boolean;
      details: string;
    }>;
    performance_metrics: {
      avg_response_time: number;
      error_rate: number;
      success_rate: number;
      last_successful_operation: string | null;
    };
    recommendations: string[];
  }> => {
    const diagnostics = {
      system_status: 'healthy' as 'healthy' | 'degraded' | 'critical',
      database_connectivity: 'connected' as 'connected' | 'disconnected' | 'slow',
      memory_fallback: {
        enabled: true,
        entries_count: memoryMetricsStore.value.length,
        oldest_entry: null as string | null,
        newest_entry: null as string | null,
        high_priority_count: 0,
        storage_size_bytes: 0
      },
      recent_errors: [] as Array<{
        timestamp: string;
        operation: string;
        error_type: string;
        retryable: boolean;
        details: string;
      }>,
      performance_metrics: {
        avg_response_time: 0,
        error_rate: 0,
        success_rate: 100,
        last_successful_operation: null as string | null
      },
      recommendations: [] as string[]
    }

    try {
      // Test database connectivity
      const dbTestStart = performance.now()
      try {
        await pb.health.check()
        const responseTime = performance.now() - dbTestStart

        if (responseTime > 2000) {
          diagnostics.database_connectivity = 'slow'
          diagnostics.system_status = 'degraded'
          diagnostics.recommendations.push('Database response time is slow (>2s). Consider checking network connectivity or database performance.')
        } else {
          diagnostics.database_connectivity = 'connected'
        }

        diagnostics.performance_metrics.avg_response_time = Math.round(responseTime)
        diagnostics.performance_metrics.last_successful_operation = new Date().toISOString()

      } catch (dbError) {
        diagnostics.database_connectivity = 'disconnected'
        diagnostics.system_status = 'critical'
        diagnostics.recommendations.push('Database is not accessible. Check PocketBase connection and authentication.')

        diagnostics.recent_errors.push({
          timestamp: new Date().toISOString(),
          operation: 'database_health_check',
          error_type: 'connectivity',
          retryable: true,
          details: dbError instanceof Error ? dbError.message : String(dbError)
        })
      }

      // Analyze memory fallback status
      if (memoryMetricsStore.value.length > 0) {
        const sortedMetrics = [...memoryMetricsStore.value].sort((a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        )

        diagnostics.memory_fallback.oldest_entry = sortedMetrics[0]?.timestamp || null
        diagnostics.memory_fallback.newest_entry = sortedMetrics[sortedMetrics.length - 1]?.timestamp || null
        diagnostics.memory_fallback.high_priority_count = memoryMetricsStore.value
          .filter(m => m._memory_metadata?.priority === 'high').length

        // Calculate storage size
        try {
          const storageData = localStorage.getItem('monitoring_metrics_fallback')
          diagnostics.memory_fallback.storage_size_bytes = storageData ? storageData.length : 0
        } catch (storageError) {
          diagnostics.memory_fallback.storage_size_bytes = 0
        }

        if (diagnostics.memory_fallback.entries_count > maxMemoryEntries * 0.8) {
          diagnostics.system_status = diagnostics.system_status === 'critical' ? 'critical' : 'degraded'
          diagnostics.recommendations.push(`Memory fallback store is ${Math.round((diagnostics.memory_fallback.entries_count / maxMemoryEntries) * 100)}% full. Consider investigating database connectivity issues.`)
        }

        if (diagnostics.memory_fallback.high_priority_count > 0) {
          diagnostics.system_status = diagnostics.system_status === 'critical' ? 'critical' : 'degraded'
          diagnostics.recommendations.push(`${diagnostics.memory_fallback.high_priority_count} high-priority metrics are stuck in memory fallback. These represent failed database operations.`)
        }
      }

      // Check authentication status
      if (!pb.authStore.isValid) {
        diagnostics.system_status = 'critical'
        diagnostics.recommendations.push('PocketBase authentication is invalid. Re-authentication required for database operations.')
      }

      // Calculate success rate based on memory fallback usage
      const totalOperations = memoryMetricsStore.value.length + 10 // Assume some successful operations
      const failedOperations = memoryMetricsStore.value.length
      diagnostics.performance_metrics.success_rate = Math.round(((totalOperations - failedOperations) / totalOperations) * 100)
      diagnostics.performance_metrics.error_rate = Math.round((failedOperations / totalOperations) * 100)

      // Add general recommendations based on system status
      if (diagnostics.system_status === 'healthy' && diagnostics.recommendations.length === 0) {
        diagnostics.recommendations.push('System is operating normally. All monitoring functions are working as expected.')
      } else if (diagnostics.system_status === 'degraded') {
        diagnostics.recommendations.push('System is experiencing some issues but core functionality remains available.')
      } else if (diagnostics.system_status === 'critical') {
        diagnostics.recommendations.push('System requires immediate attention. Core monitoring functionality may be impaired.')
      }

      // Add memory management recommendations
      if (process.client) {
        try {
          const memoryInfo = (performance as any).memory
          if (memoryInfo && memoryInfo.usedJSHeapSize > 100 * 1024 * 1024) { // 100MB
            diagnostics.recommendations.push('High memory usage detected. Consider refreshing the page if performance degrades.')
          }
        } catch (memoryError) {
          // Memory API not available, skip this check
        }
      }

    } catch (diagnosticError) {
      diagnostics.system_status = 'critical'
      diagnostics.recommendations.push('Failed to perform system diagnostics. System may be in an unstable state.')

      diagnostics.recent_errors.push({
        timestamp: new Date().toISOString(),
        operation: 'system_diagnostics',
        error_type: 'diagnostic_failure',
        retryable: false,
        details: diagnosticError instanceof Error ? diagnosticError.message : String(diagnosticError)
      })
    }

    return diagnostics
  }

  return {
    // Configuration
    config,

    // State
    currentMetrics: readonly(currentMetrics),
    activeAlerts: readonly(activeAlerts),
    isMonitoring: readonly(isMonitoring),

    // Core monitoring functions
    startMonitoring,
    stopMonitoring,
    collectMetrics,
    checkAlerts,
    performHealthCheck,

    // Metrics functions
    getHistoricalMetrics,
    getPerformanceSummary,

    // Alert management
    getAlerts,
    createAlert,
    acknowledgeAlert,
    resolveAlert,

    // Maintenance
    cleanupOldData,

    // Component health checks
    checkDatabaseHealth,
    checkFCMHealth,
    checkServiceWorkerHealth,

    // Memory fallback and diagnostics
    syncMemoryToDatabase,
    captureDetailedError,
    getSystemDiagnostics,
    memoryMetricsStore: readonly(memoryMetricsStore)
  }
}