// Hammasir Module Type Exports
// This file serves as the main type export for the Hammasir module

// Form-related types
export type {
  FormValidation,
  FormSection,
  PersonalInfoFormData,
  PersonalInfoFormErrors,
  EducationFormData,
  EducationFormErrors,
  OccupationFormData,
  OccupationFormErrors,
  LocationFormData,
  LocationFormErrors,
  DemographicsFormData,
  DemographicsFormErrors,
  PreferencesFormData,
  PreferencesFormErrors,
  ProfileFormData,
  ProfileFormErrors,
  ProfileFormState,
  ValidationRule,
  ValidationRules,
  FormSubmissionResult,
  AutoSaveState,
  FormWizardState,
} from './forms'

// Profile-related types
export type {
  ProfileCompletionStatus,
  ProfileSectionMeta,
  ProfileAnalytics,
  ProfileDisplayPreferences,
  ProfileExportOptions,
  ProfileSharingSettings,
  HandbookSectionDisplay,
  ProfileDisplayData,
  ProfileEditContext,
  ProfileComparisonData,
  ProfileAccessPermissions,
  ProfileNotificationSettings,
  ProfileBackup,
  ProfileValidationResult,
} from './profile'

// API-related types
export type {
  ApiResponse,
  ApiError,
  PaginatedResponse,
  FileUploadResponse,
  FileUploadProgress,
  ProfileUpdateRequest,
  ProfileUpdateResponse,
  BulkProfileOperation,
  BulkOperationResponse,
  ProfileSearchParams,
  ProfileSearchResponse,
  AnalyticsQuery,
  AnalyticsResponse,
  ValidationResponse,
  ExportRequest,
  ExportResponse,
  ImportRequest,
  ImportResponse,
  ProfileWebhookEvent,
  CacheStatus,
  CacheInvalidationRequest,
  ServiceHealthResponse,
  // Re-exported service types
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
  EmploymentType,
} from './api'

// Utility types for the module
export interface HammasirModuleConfig {
  apiBaseUrl: string
  uploadEndpoint: string
  maxFileSize: number
  allowedFileTypes: string[]
  autoSaveInterval: number
  cacheTimeout: number
  features: {
    analytics: boolean
    handbook: boolean
    export: boolean
    sharing: boolean
    bulkOperations: boolean
  }
}

export interface HammasirModuleState {
  currentUser: UserProfile | null
  isLoading: boolean
  error: string | null
  lastUpdated: Date | null
  config: HammasirModuleConfig
}

// Component prop types
export interface BaseComponentProps {
  loading?: boolean
  disabled?: boolean
  readonly?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'outlined' | 'filled'
}

export interface FormComponentProps extends BaseComponentProps {
  modelValue?: any
  errors?: string[]
  required?: boolean
  placeholder?: string
  helperText?: string
}

export interface DisplayComponentProps extends BaseComponentProps {
  data: any
  showEmpty?: boolean
  emptyText?: string
  compact?: boolean
}

// Event types for components
export interface ProfileEvent {
  type: 'update' | 'save' | 'cancel' | 'validate' | 'export'
  data?: any
  timestamp: Date
  source: string
}

export interface FormEvent extends ProfileEvent {
  field?: string
  value?: any
  isValid?: boolean
}

// Constants
export const HAMMASIR_CONSTANTS = {
  SECTIONS: {
    PERSONAL_INFO: 'personalInfo',
    DEMOGRAPHICS: 'demographics',
    PREFERENCES: 'preferences',
    ANALYTICS: 'analytics',
    HANDBOOK: 'handbook',
    PROGRESS: 'progress',
  },
  FORM_STEPS: {
    PERSONAL: 0,
    EDUCATION: 1,
    OCCUPATION: 2,
    LOCATION: 3,
    PREFERENCES: 4,
    REVIEW: 5,
  },
  VALIDATION_RULES: {
    REQUIRED: 'required',
    MIN_LENGTH: 'minLength',
    MAX_LENGTH: 'maxLength',
    EMAIL: 'email',
    PHONE: 'phone',
    DATE: 'date',
    PATTERN: 'pattern',
  },
  FILE_TYPES: {
    IMAGES: ['image/jpeg', 'image/png', 'image/webp'],
    DOCUMENTS: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  },
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  AUTO_SAVE_INTERVAL: 30000, // 30 seconds
  CACHE_TIMEOUT: 300000, // 5 minutes
} as const