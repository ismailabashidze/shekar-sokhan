import type PocketBase from 'pocketbase'

// Error types and categories
export enum ErrorCategory {
  NETWORK = 'NETWORK',
  FCM = 'FCM',
  DATABASE = 'DATABASE',
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTHENTICATION',
  PERMISSION = 'PERMISSION',
  SYSTEM = 'SYSTEM',
  USER_INPUT = 'USER_INPUT'
}

export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface ErrorContext {
  userId?: string
  sessionId?: string
  campaignId?: string
  notificationId?: string
  component?: string
  method?: string
  timestamp: string
  userAgent?: string
  url?: string
  additionalData?: Record<string, any>
}

export interface NotificationError {
  id?: string
  code: string
  message: string
  category: ErrorCategory
  severity: ErrorSeverity
  context: ErrorContext
  stackTrace?: string
  isRetryable: boolean
  retryCount: number
  maxRetries: number
  resolved: boolean
  resolvedAt?: string
  created?: string
  updated?: string
}

export interface ErrorHandlerConfig {
  enableLogging: boolean
  enableReporting: boolean
  enableFallbacks: boolean
  maxRetries: number
  retryDelayMs: number
  logLevel: 'debug' | 'info' | 'warn' | 'error'
}

export const useErrorHandler = () => {
  const { $pb } = useNuxtApp()
  const pb = $pb as PocketBase

  // Default configuration
  const defaultConfig: ErrorHandlerConfig = {
    enableLogging: true,
    enableReporting: true,
    enableFallbacks: true,
    maxRetries: 3,
    retryDelayMs: 1000,
    logLevel: 'error'
  }

  const config = ref<ErrorHandlerConfig>(defaultConfig)

  /**
   * Main error handling function with comprehensive error processing
   */
  const handleError = async (
    error: Error | any,
    context: Partial<ErrorContext> = {},
    options: {
      category?: ErrorCategory
      severity?: ErrorSeverity
      enableFallback?: boolean
      enableRetry?: boolean
      customMessage?: string
    } = {}
  ): Promise<NotificationError> => {
    try {
      // Categorize and analyze the error
      const errorAnalysis = analyzeError(error)
      
      // Build comprehensive error context
      const fullContext: ErrorContext = {
        timestamp: new Date().toISOString(),
        userAgent: process.client ? navigator.userAgent : 'server',
        url: process.client ? window.location.href : 'server',
        userId: getCurrentUserId(),
        ...context
      }

      // Create structured error object
      const notificationError: NotificationError = {
        code: errorAnalysis.code,
        message: options.customMessage || errorAnalysis.message,
        category: options.category || errorAnalysis.category,
        severity: options.severity || errorAnalysis.severity,
        context: fullContext,
        stackTrace: error?.stack || new Error().stack,
        isRetryable: errorAnalysis.isRetryable,
        retryCount: 0,
        maxRetries: config.value.maxRetries,
        resolved: false
      }

      // Log the error
      if (config.value.enableLogging) {
        logError(notificationError)
      }

      // Report the error to database
      if (config.value.enableReporting) {
        await reportError(notificationError)
      }

      // Execute fallback strategies if enabled
      if (config.value.enableFallbacks && options.enableFallback !== false) {
        await executeFallbackStrategy(notificationError)
      }

      return notificationError

    } catch (handlingError) {
      // Fallback error handling if main handler fails
      console.error('❌ Error in error handler:', handlingError)
      return createFallbackError(error, context)
    }
  }

  /**
   * Analyze error to determine category, severity, and retry strategy
   */
  const analyzeError = (error: any): {
    code: string
    message: string
    category: ErrorCategory
    severity: ErrorSeverity
    isRetryable: boolean
  } => {
    const errorMessage = error?.message || error?.toString() || 'Unknown error'
    const errorCode = error?.code || error?.status || 'UNKNOWN_ERROR'

    // Network errors
    if (isNetworkError(error)) {
      return {
        code: 'NETWORK_ERROR',
        message: 'Network connection failed',
        category: ErrorCategory.NETWORK,
        severity: ErrorSeverity.MEDIUM,
        isRetryable: true
      }
    }

    // FCM errors
    if (isFCMError(error)) {
      return {
        code: 'FCM_ERROR',
        message: 'Firebase Cloud Messaging error',
        category: ErrorCategory.FCM,
        severity: ErrorSeverity.HIGH,
        isRetryable: true
      }
    }

    // Database errors
    if (isDatabaseError(error)) {
      return {
        code: 'DATABASE_ERROR',
        message: 'Database operation failed',
        category: ErrorCategory.DATABASE,
        severity: ErrorSeverity.HIGH,
        isRetryable: true
      }
    }

    // Authentication errors
    if (isAuthError(error)) {
      return {
        code: 'AUTH_ERROR',
        message: 'Authentication failed',
        category: ErrorCategory.AUTHENTICATION,
        severity: ErrorSeverity.HIGH,
        isRetryable: false
      }
    }

    // Permission errors
    if (isPermissionError(error)) {
      return {
        code: 'PERMISSION_ERROR',
        message: 'Permission denied',
        category: ErrorCategory.PERMISSION,
        severity: ErrorSeverity.MEDIUM,
        isRetryable: false
      }
    }

    // Validation errors
    if (isValidationError(error)) {
      return {
        code: 'VALIDATION_ERROR',
        message: 'Data validation failed',
        category: ErrorCategory.VALIDATION,
        severity: ErrorSeverity.LOW,
        isRetryable: false
      }
    }

    // Default to system error
    return {
      code: errorCode,
      message: errorMessage,
      category: ErrorCategory.SYSTEM,
      severity: ErrorSeverity.MEDIUM,
      isRetryable: false
    }
  }

  /**
   * Error type detection functions
   */
  const isNetworkError = (error: any): boolean => {
    const networkPatterns = [
      /network.*error/i,
      /fetch.*failed/i,
      /connection.*refused/i,
      /timeout/i,
      /econnreset/i,
      /enotfound/i,
      /etimedout/i
    ]
    
    const errorString = error?.message || error?.toString() || ''
    return networkPatterns.some(pattern => pattern.test(errorString)) ||
           error?.code === 'NETWORK_ERROR' ||
           error?.name === 'NetworkError'
  }

  const isFCMError = (error: any): boolean => {
    const fcmPatterns = [
      /firebase/i,
      /fcm/i,
      /messaging/i,
      /push.*notification/i
    ]
    
    const errorString = error?.message || error?.toString() || ''
    return fcmPatterns.some(pattern => pattern.test(errorString)) ||
           error?.code?.includes('FCM') ||
           error?.service === 'messaging'
  }

  const isDatabaseError = (error: any): boolean => {
    const dbPatterns = [
      /database/i,
      /pocketbase/i,
      /sql/i,
      /connection.*failed/i
    ]
    
    const errorString = error?.message || error?.toString() || ''
    return dbPatterns.some(pattern => pattern.test(errorString)) ||
           error?.status >= 500 ||
           error?.code?.includes('DB')
  }

  const isAuthError = (error: any): boolean => {
    return error?.status === 401 ||
           error?.status === 403 ||
           error?.code === 'UNAUTHENTICATED' ||
           error?.message?.includes('authentication')
  }

  const isPermissionError = (error: any): boolean => {
    return error?.status === 403 ||
           error?.code === 'PERMISSION_DENIED' ||
           error?.message?.includes('permission')
  }

  const isValidationError = (error: any): boolean => {
    return error?.status === 400 ||
           error?.code === 'VALIDATION_ERROR' ||
           error?.message?.includes('validation')
  }

  /**
   * Log error with appropriate level and formatting
   */
  const logError = (error: NotificationError): void => {
    const logMessage = `[${error.category}] ${error.code}: ${error.message}`
    const logData = {
      error,
      context: error.context,
      timestamp: error.context.timestamp
    }

    switch (error.severity) {
      case ErrorSeverity.CRITICAL:
        console.error('🚨 CRITICAL:', logMessage, logData)
        break
      case ErrorSeverity.HIGH:
        console.error('❌ HIGH:', logMessage, logData)
        break
      case ErrorSeverity.MEDIUM:
        console.warn('⚠️ MEDIUM:', logMessage, logData)
        break
      case ErrorSeverity.LOW:
        if (config.value.logLevel === 'debug') {
          console.info('ℹ️ LOW:', logMessage, logData)
        }
        break
    }
  }

  /**
   * Report error to database for monitoring and analysis
   */
  const reportError = async (error: NotificationError): Promise<void> => {
    try {
      // Only report significant errors to avoid spam
      if (error.severity === ErrorSeverity.LOW && error.category === ErrorCategory.VALIDATION) {
        return
      }

      await pb.collection('notification_errors').create({
        code: error.code,
        message: error.message,
        category: error.category,
        severity: error.severity,
        context: error.context,
        stack_trace: error.stackTrace,
        is_retryable: error.isRetryable,
        retry_count: error.retryCount,
        max_retries: error.maxRetries,
        resolved: error.resolved,
        user_id: error.context.userId,
        session_id: error.context.sessionId,
        campaign_id: error.context.campaignId,
        notification_id: error.context.notificationId,
        component: error.context.component,
        method: error.context.method
      })

    } catch (reportingError) {
      console.error('❌ Failed to report error to database:', reportingError)
    }
  }

  /**
   * Execute fallback strategies based on error type
   */
  const executeFallbackStrategy = async (error: NotificationError): Promise<void> => {
    try {
      switch (error.category) {
        case ErrorCategory.FCM:
          await handleFCMFallback(error)
          break
        
        case ErrorCategory.NETWORK:
          await handleNetworkFallback(error)
          break
        
        case ErrorCategory.DATABASE:
          await handleDatabaseFallback(error)
          break
        
        case ErrorCategory.AUTHENTICATION:
          await handleAuthFallback(error)
          break
        
        default:
          await handleGenericFallback(error)
          break
      }

    } catch (fallbackError) {
      console.error('❌ Fallback strategy failed:', fallbackError)
    }
  }

  /**
   * FCM-specific fallback strategies
   */
  const handleFCMFallback = async (error: NotificationError): Promise<void> => {
    console.log('🔄 Executing FCM fallback strategy')
    
    // Try to re-register service worker
    try {
      if (process.client && 'serviceWorker' in navigator) {
        await navigator.serviceWorker.register('/firebase-messaging-sw.js')
        console.log('✅ Service worker re-registered as fallback')
      }
    } catch (refreshError) {
      console.error('❌ Service worker re-registration failed:', refreshError)
    }

    // Fall back to in-app notification
    try {
      await showInAppNotificationFallback(error)
    } catch (inAppError) {
      console.error('❌ In-app notification fallback failed:', inAppError)
    }
  }

  /**
   * Network-specific fallback strategies
   */
  const handleNetworkFallback = async (error: NotificationError): Promise<void> => {
    console.log('🔄 Executing network fallback strategy')
    
    // Queue for retry when network is available
    if (process.client && 'navigator' in window && 'onLine' in navigator) {
      if (!navigator.onLine) {
        console.log('📱 Device is offline, queuing for retry')
        await queueForRetry(error)
        
        // Listen for network recovery
        const handleOnline = async () => {
          console.log('🌐 Network recovered, processing queued errors')
          await processQueuedErrors()
          window.removeEventListener('online', handleOnline)
        }
        
        window.addEventListener('online', handleOnline)
      }
    }
  }

  /**
   * Database-specific fallback strategies
   */
  const handleDatabaseFallback = async (error: NotificationError): Promise<void> => {
    console.log('🔄 Executing database fallback strategy')
    
    // Try alternative database operations or cache locally
    try {
      await cacheErrorLocally(error)
    } catch (cacheError) {
      console.error('❌ Local caching failed:', cacheError)
    }
  }

  /**
   * Authentication-specific fallback strategies
   */
  const handleAuthFallback = async (error: NotificationError): Promise<void> => {
    console.log('🔄 Executing auth fallback strategy')
    
    // Try to refresh authentication
    try {
      if (pb.authStore.isValid) {
        await pb.collection('users').authRefresh()
        console.log('✅ Auth token refreshed as fallback')
      }
    } catch (authError) {
      console.error('❌ Auth refresh failed, user may need to re-login:', authError)
      
      // Clear invalid auth state
      pb.authStore.clear()
    }
  }

  /**
   * Generic fallback strategy
   */
  const handleGenericFallback = async (error: NotificationError): Promise<void> => {
    console.log('🔄 Executing generic fallback strategy')
    
    // Log for manual review
    await reportError({
      ...error,
      message: `Generic fallback executed: ${error.message}`
    })
  }

  /**
   * Show in-app notification as fallback for FCM failures
   */
  const showInAppNotificationFallback = async (error: NotificationError): Promise<void> => {
    if (!process.client) return

    try {
      // Create a simple in-app notification
      const notification = document.createElement('div')
      notification.className = 'fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50'
      notification.innerHTML = `
        <div class="flex items-center">
          <span class="mr-2">⚠️</span>
          <span>Notification delivery failed. Please check your connection.</span>
          <button class="ml-4 text-white hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
      `
      
      document.body.appendChild(notification)
      
      // Auto-remove after 5 seconds
      setTimeout(() => {
        if (notification.parentElement) {
          notification.remove()
        }
      }, 5000)

    } catch (fallbackError) {
      console.error('❌ In-app notification fallback failed:', fallbackError)
    }
  }

  /**
   * Queue error for retry when conditions improve
   */
  const queueForRetry = async (error: NotificationError): Promise<void> => {
    try {
      const queueItem = {
        error,
        queuedAt: new Date().toISOString(),
        retryAfter: new Date(Date.now() + config.value.retryDelayMs).toISOString()
      }

      // Store in localStorage for persistence
      const queue = getErrorQueue()
      queue.push(queueItem)
      localStorage.setItem('notification_error_queue', JSON.stringify(queue))

    } catch (queueError) {
      console.error('❌ Failed to queue error for retry:', queueError)
    }
  }

  /**
   * Process queued errors when conditions improve
   */
  const processQueuedErrors = async (): Promise<void> => {
    try {
      const queue = getErrorQueue()
      const now = new Date()

      for (const queueItem of queue) {
        const retryTime = new Date(queueItem.retryAfter)
        
        if (now >= retryTime) {
          console.log('🔄 Retrying queued error:', queueItem.error.code)
          
          // Attempt to resolve the original operation
          await retryOriginalOperation(queueItem.error)
          
          // Remove from queue
          removeFromQueue(queueItem)
        }
      }

    } catch (processError) {
      console.error('❌ Failed to process queued errors:', processError)
    }
  }

  /**
   * Cache error locally for later processing
   */
  const cacheErrorLocally = async (error: NotificationError): Promise<void> => {
    try {
      const cacheKey = `error_cache_${Date.now()}`
      localStorage.setItem(cacheKey, JSON.stringify(error))
      
      // Keep track of cached errors
      const cachedErrors = JSON.parse(localStorage.getItem('cached_errors') || '[]')
      cachedErrors.push(cacheKey)
      localStorage.setItem('cached_errors', JSON.stringify(cachedErrors))

    } catch (cacheError) {
      console.error('❌ Failed to cache error locally:', cacheError)
    }
  }

  /**
   * Retry original operation that caused the error
   */
  const retryOriginalOperation = async (error: NotificationError): Promise<void> => {
    // This would need to be implemented based on the specific operation
    // For now, just log the retry attempt
    console.log('🔄 Retrying original operation for error:', error.code)
  }

  /**
   * Utility functions
   */
  const getCurrentUserId = (): string | undefined => {
    return pb.authStore.model?.id
  }

  const getErrorQueue = (): any[] => {
    try {
      return JSON.parse(localStorage.getItem('notification_error_queue') || '[]')
    } catch {
      return []
    }
  }

  const removeFromQueue = (queueItem: any): void => {
    try {
      const queue = getErrorQueue()
      const filteredQueue = queue.filter(item => item !== queueItem)
      localStorage.setItem('notification_error_queue', JSON.stringify(filteredQueue))
    } catch (error) {
      console.error('❌ Failed to remove item from queue:', error)
    }
  }

  const createFallbackError = (originalError: any, context: Partial<ErrorContext>): NotificationError => {
    return {
      code: 'HANDLER_ERROR',
      message: 'Error handler failed',
      category: ErrorCategory.SYSTEM,
      severity: ErrorSeverity.CRITICAL,
      context: {
        timestamp: new Date().toISOString(),
        ...context
      },
      stackTrace: originalError?.stack,
      isRetryable: false,
      retryCount: 0,
      maxRetries: 0,
      resolved: false
    }
  }

  /**
   * Public API for error recovery and management
   */
  const recoverFromError = async (errorId: string): Promise<boolean> => {
    try {
      const error = await pb.collection('notification_errors').getOne(errorId)
      
      if (error.resolved) {
        console.log('✅ Error already resolved:', errorId)
        return true
      }

      // Attempt recovery based on error type
      const success = await attemptErrorRecovery(error)
      
      if (success) {
        await pb.collection('notification_errors').update(errorId, {
          resolved: true,
          resolved_at: new Date().toISOString()
        })
      }

      return success

    } catch (recoveryError) {
      console.error('❌ Error recovery failed:', recoveryError)
      return false
    }
  }

  const attemptErrorRecovery = async (error: any): Promise<boolean> => {
    // Implement specific recovery strategies based on error type
    switch (error.category) {
      case ErrorCategory.FCM:
        return await recoverFCMError(error)
      case ErrorCategory.NETWORK:
        return await recoverNetworkError(error)
      case ErrorCategory.DATABASE:
        return await recoverDatabaseError(error)
      default:
        return false
    }
  }

  const recoverFCMError = async (error: any): Promise<boolean> => {
    try {
      // Try to re-register service worker for FCM
      if (process.client && 'serviceWorker' in navigator) {
        await navigator.serviceWorker.register('/firebase-messaging-sw.js')
        return true
      }
      return false
    } catch {
      return false
    }
  }

  const recoverNetworkError = async (error: any): Promise<boolean> => {
    // Check if network is available and retry
    if (process.client && navigator.onLine) {
      return true
    }
    return false
  }

  const recoverDatabaseError = async (error: any): Promise<boolean> => {
    try {
      // Test database connection
      await pb.health.check()
      return true
    } catch {
      return false
    }
  }

  return {
    // Core error handling
    handleError,
    analyzeError,
    
    // Error recovery
    recoverFromError,
    processQueuedErrors,
    
    // Configuration
    config,
    
    // Utility functions
    isNetworkError,
    isFCMError,
    isDatabaseError,
    isAuthError,
    isPermissionError,
    isValidationError,
    
    // Error types
    ErrorCategory,
    ErrorSeverity
  }
}