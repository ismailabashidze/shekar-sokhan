// API Response types extending the base service types
export interface ApiResponse<T = any> {
  data: T
  message?: string
  status: 'success' | 'error'
  timestamp: string
}

export interface ApiError {
  code: string
  message: string
  details?: Record<string, any>
  field?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  size: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
}

// File upload responses
export interface FileUploadResponse {
  fileId: string
  fileName: string
  fileSize: number
  mimeType: string
  url: string
  thumbnailUrl?: string
}

export interface FileUploadProgress {
  fileId: string
  progress: number
  status: 'uploading' | 'processing' | 'completed' | 'error'
  error?: string
}

// Profile operations
export interface ProfileUpdateRequest {
  personalInfo?: Partial<PersonalInfo>
  demographics?: Partial<Demographics>
  preferences?: Partial<Preferences>
  privacySettings?: Partial<PrivacySettings>
}

export interface ProfileUpdateResponse extends ApiResponse<UserProfile> {
  warnings?: string[]
  validationErrors?: Record<string, string[]>
}

// Bulk operations
export interface BulkProfileOperation {
  operation: 'update' | 'delete' | 'export'
  userIds: string[]
  data?: any
  options?: Record<string, any>
}

export interface BulkOperationResponse {
  totalRequested: number
  successful: number
  failed: number
  results: {
    userId: string
    success: boolean
    error?: ApiError
  }[]
}

// Search and filtering
export interface ProfileSearchParams {
  query?: string
  filters?: {
    status?: string[]
    gender?: string[]
    ageRange?: string
    location?: string[]
    education?: string[]
    verified?: boolean
    completionRange?: string
  }
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  page?: number
  size?: number
}

export interface ProfileSearchResponse extends PaginatedResponse<UserProfile> {
  filters: {
    available: Record<string, any[]>
    applied: Record<string, any>
  }
  aggregations?: {
    status: Record<string, number>
    gender: Record<string, number>
    education: Record<string, number>
    location: Record<string, number>
  }
}

// Analytics and reporting
export interface AnalyticsQuery {
  userId?: string
  dateRange?: {
    start: string
    end: string
  }
  metrics?: string[]
  groupBy?: string
  aggregation?: 'sum' | 'avg' | 'count' | 'min' | 'max'
}

export interface AnalyticsResponse {
  data: {
    labels: string[]
    datasets: {
      label: string
      data: number[]
      metadata?: Record<string, any>
    }[]
  }
  summary: {
    total: number
    average: number
    trend: 'up' | 'down' | 'stable'
    changePercent: number
  }
}

// Validation responses
export interface ValidationResponse {
  isValid: boolean
  errors: {
    field: string
    code: string
    message: string
    value?: any
  }[]
  warnings: {
    field: string
    message: string
    suggestion?: string
  }[]
}

// Import/Export
export interface ExportRequest {
  userIds?: string[]
  fields?: string[]
  format: 'json' | 'csv' | 'pdf'
  includeAnalytics?: boolean
  includeHandbook?: boolean
  language?: 'fa' | 'en'
}

export interface ExportResponse {
  jobId: string
  status: 'queued' | 'processing' | 'completed' | 'failed'
  downloadUrl?: string
  expiresAt?: string
  estimatedSize?: number
}

export interface ImportRequest {
  fileId: string
  format: 'json' | 'csv'
  mapping?: Record<string, string>
  options?: {
    updateExisting?: boolean
    skipErrors?: boolean
    validateOnly?: boolean
  }
}

export interface ImportResponse {
  jobId: string
  status: 'queued' | 'processing' | 'completed' | 'failed'
  results?: {
    processed: number
    successful: number
    failed: number
    errors: {
      row: number
      field: string
      message: string
    }[]
  }
}

// Webhook/Notification types
export interface ProfileWebhookEvent {
  eventType: 'profile.created' | 'profile.updated' | 'profile.deleted' | 'profile.completed'
  userId: string
  data: Partial<UserProfile>
  metadata: {
    source: string
    timestamp: string
    changes?: string[]
  }
}

// Cache management
export interface CacheStatus {
  userId: string
  lastUpdated: string
  expiresAt: string
  size: number
  hitRate: number
}

export interface CacheInvalidationRequest {
  userIds?: string[]
  sections?: string[]
  force?: boolean
}

// Health check and monitoring
export interface ServiceHealthResponse {
  status: 'healthy' | 'degraded' | 'down'
  version: string
  dependencies: {
    name: string
    status: 'healthy' | 'down'
    responseTime?: number
  }[]
  metrics: {
    activeUsers: number
    profilesUpdated24h: number
    averageResponseTime: number
  }
}

// Re-export types from the service for convenience
export type {
  UserProfile,
  PersonalInfo,
  Demographics,
  EducationInfo,
  OccupationInfo,
  LocationInfo,
  Preferences,
  PrivacySettings,
  HumanHandbook,
  ProgressSummary,
  ErrorResponse,
  UserStatusType,
  GenderType,
  EducationLevelType,
  EmploymentType
} from '~/composables/hammasir/useApplicantProfileService'