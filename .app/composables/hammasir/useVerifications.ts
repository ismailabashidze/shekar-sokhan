import { ref, readonly, computed } from 'vue'
import { useAuth } from './useAuth'
import type {
  VerificationDocumentDto,
  VerificationStatusDto,
  VerificationRequestDto,
  KeycloakConsistencyValidationDto,
  SyncStatusDto,
} from '~/types/api'

// Verification state
const verificationState = ref({
  documents: [] as VerificationDocumentDto[],
  status: null as VerificationStatusDto | null,
  requests: [] as VerificationRequestDto[],
  isLoading: false,
  isSubmitting: false,
  isSyncing: false,
  error: null as string | null,
  syncStatus: null as SyncStatusDto | null,
  validation: null as KeycloakConsistencyValidationDto | null,
})

// Verification errors
const verificationError = ref<string | null>(null)
const isVerificationLoading = ref(false)
const isVerificationSubmitting = ref(false)
const isVerificationSyncing = ref(false)

// Error translation map
const errorTranslations: Record<string, string> = {
  'Verification not found': 'تأیید صلاحیت یافت نشد',
  'Invalid verification data': 'داده‌های تأیید صلاحیت نامعتبر است',
  'Verification submission failed': 'ثبت درخواست تأیید صلاحیت ناموفق بود',
  'Document upload failed': 'آپلود مدرک ناموفق بود',
  'User not found': 'کاربر یافت نشد',
  'Counselor not found': 'مشاور یافت نشد',
  'Invalid document type': 'نوع مدرک نامعتبر است',
  'Document not found': 'مدرک یافت نشد',
  'Sync validation failed': 'اعتبارسنجی همگام‌سازی ناموفق بود',
}

// Function to translate error messages
const translateError = (error: any): string => {
  // Convert error to string if it's not already
  const errorMessage = typeof error === 'string'
    ? error
    : error?.message
      ? error.message
      : JSON.stringify(error)

  // Check if we have a direct translation
  if (errorTranslations[errorMessage]) {
    return errorTranslations[errorMessage]
  }

  // Handle HTTP status codes (only if errorMessage is a string)
  if (typeof errorMessage === 'string') {
    if (errorMessage.startsWith('HTTP 400:')) {
      return 'درخواست نامعتبر است'
    }
    if (errorMessage.startsWith('HTTP 401:')) {
      return 'احراز هویت ناموفق بود'
    }
    if (errorMessage.startsWith('HTTP 403:')) {
      return 'دسترسی غیرمجاز'
    }
    if (errorMessage.startsWith('HTTP 404:')) {
      return 'تأیید صلاحیت یافت نشد'
    }
    if (errorMessage.startsWith('HTTP 409:')) {
      return 'تداخل در درخواست'
    }
    if (errorMessage.startsWith('HTTP 422:')) {
      return 'اطلاعات ارسالی نامعتبر است'
    }
    if (errorMessage.startsWith('HTTP 429:')) {
      return 'تعداد درخواست‌ها بیش از حد مجاز است'
    }
    if (errorMessage.startsWith('HTTP 500:')) {
      return 'خطای سرور'
    }
    if (errorMessage.startsWith('HTTP 502:')) {
      return 'خطای دروازه'
    }
    if (errorMessage.startsWith('HTTP 503:')) {
      return 'سرویس در دسترس نیست'
    }
    if (errorMessage.startsWith('HTTP 504:')) {
      return 'وقفه در پاسخ سرور'
    }
  }

  // Default fallback
  return errorMessage
}

// Computed properties
const userVerificationDocuments = computed(() => verificationState.value.documents)
const userVerificationStatus = computed(() => verificationState.value.status)
const verificationRequests = computed(() => verificationState.value.requests)
const currentSyncStatus = computed(() => verificationState.value.syncStatus)
const keycloakValidation = computed(() => verificationState.value.validation)

// Helper function to get API base URL
const getApiBaseUrl = () => {
  return process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'
}

// Helper function for API requests
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> => {
  const url = `${getApiBaseUrl()}${endpoint}`

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  // Add auth header if available and not explicitly excluded
  const authStore = useAuth()
  if (authStore.authTokens.value.accessToken && !options.headers?.['X-Skip-Auth']) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${authStore.authTokens.value.accessToken}`,
    }
  }

  try {
    const response = await fetch(url, config)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const errorMessage = errorData.message || `HTTP ${response.status}: ${response.statusText}`
      throw new Error(translateError(errorMessage))
    }

    return await response.json()
  }
  catch (error) {
    console.error(`API request failed for ${url}:`, error)
    throw new Error(translateError(error))
  }
}

// Get my verification documents
const getMyVerificationDocuments = async (): Promise<VerificationDocumentDto[] | null> => {
  isVerificationLoading.value = true
  verificationError.value = null

  try {
    const documents = await apiRequest<VerificationDocumentDto[]>('/api/v1/counselor/me/documents')
    verificationState.value.documents = documents
    return documents
  }
  catch (error: any) {
    verificationError.value = error.message || 'دریافت مدارک تأیید صلاحیت ناموفق بود'
    return null
  }
  finally {
    isVerificationLoading.value = false
  }
}

// Register verification document
const registerVerificationDocument = async (
  data: Omit<VerificationDocumentDto, 'id' | 'createdAt' | 'updatedAt'>
): Promise<VerificationDocumentDto | null> => {
  isVerificationSubmitting.value = true
  verificationError.value = null

  try {
    const newDocument = await apiRequest<VerificationDocumentDto>('/api/v1/counselor/me/documents', {
      method: 'POST',
      body: JSON.stringify(data),
    })

    // Add to local state
    verificationState.value.documents.push(newDocument)

    return newDocument
  }
  catch (error: any) {
    verificationError.value = error.message || 'ثبت مدرک تأیید صلاحیت ناموفق بود'
    return null
  }
  finally {
    isVerificationSubmitting.value = false
  }
}

// Submit verification request
const submitVerificationRequest = async (): Promise<boolean> => {
  isVerificationSubmitting.value = true
  verificationError.value = null

  try {
    await apiRequest<void>('/api/v1/counselor/verification/me', {
      method: 'PUT',
    })

    // Update local status if it exists
    if (verificationState.value.status) {
      verificationState.value.status.status = 'PENDING_REVIEW'
    }

    return true
  }
  catch (error: any) {
    verificationError.value = error.message || 'ثبت درخواست تأیید صلاحیت ناموفق بود'
    return false
  }
  finally {
    isVerificationSubmitting.value = false
  }
}

// Get my verification status
const getMyVerificationStatus = async (): Promise<VerificationStatusDto | null> => {
  isVerificationLoading.value = true
  verificationError.value = null

  try {
    const status = await apiRequest<VerificationStatusDto>('/api/v1/counselor/verification/me')
    verificationState.value.status = status
    return status
  }
  catch (error: any) {
    verificationError.value = error.message || 'دریافت وضعیت تأیید صلاحیت ناموفق بود'
    return null
  }
  finally {
    isVerificationLoading.value = false
  }
}

// Get all verification requests (admin only)
const getAllVerificationRequests = async (
  status?: string
): Promise<VerificationRequestDto[] | null> => {
  isVerificationLoading.value = true
  verificationError.value = null

  try {
    let url = '/api/v1/counselor/admin/verifications'

    if (status) {
      url += `?status=${status}`
    }

    const requests = await apiRequest<VerificationRequestDto[]>(url)
    verificationState.value.requests = requests
    return requests
  }
  catch (error: any) {
    verificationError.value = error.message || 'دریافت لیست درخواست‌های تأیید صلاحیت ناموفق بود'
    return null
  }
  finally {
    isVerificationLoading.value = false
  }
}

// Update verification status (admin only)
const updateVerificationStatus = async (
  verificationId: string,
  status: 'APPROVED' | 'REJECTED' | 'PENDING_REVIEW' | 'IN_PROGRESS',
  notes?: string
): Promise<VerificationRequestDto | null> => {
  isVerificationSubmitting.value = true
  verificationError.value = null

  try {
    const updatedRequest = await apiRequest<VerificationRequestDto>(
      `/api/v1/counselor/admin/verifications/${verificationId}/status`,
      {
        method: 'PUT',
        body: JSON.stringify({ status, notes }),
      }
    )

    // Update in local state
    const index = verificationState.value.requests.findIndex(r => r.id === verificationId)
    if (index !== -1) {
      verificationState.value.requests[index] = updatedRequest
    }

    return updatedRequest
  }
  catch (error: any) {
    verificationError.value = error.message || 'به‌روزرسانی وضعیت تأیید صلاحیت ناموفق بود'
    return null
  }
  finally {
    isVerificationSubmitting.value = false
  }
}

// Validate Keycloak consistency
const validateKeycloakConsistency = async (counselorId: string): Promise<KeycloakConsistencyValidationDto | null> => {
  isVerificationLoading.value = true
  verificationError.value = null

  try {
    const validation = await apiRequest<KeycloakConsistencyValidationDto>(
      `/api/v1/counselor/internal/counselors/${counselorId}/validate/keycloak-consistency`
    )
    verificationState.value.validation = validation
    return validation
  }
  catch (error: any) {
    verificationError.value = error.message || 'اعتبارسنجی یکپارچگی Keycloak ناموفق بود'
    return null
  }
  finally {
    isVerificationLoading.value = false
  }
}

// Get sync status
const getSyncStatus = async (counselorId: string): Promise<SyncStatusDto | null> => {
  isVerificationLoading.value = true
  verificationError.value = null

  try {
    const syncStatus = await apiRequest<SyncStatusDto>(
      `/api/v1/counselor/internal/counselors/${counselorId}/sync/status`
    )
    verificationState.value.syncStatus = syncStatus
    return syncStatus
  }
  catch (error: any) {
    verificationError.value = error.message || 'دریافت وضعیت همگام‌سازی ناموفق بود'
    return null
  }
  finally {
    isVerificationLoading.value = false
  }
}

// Sync with Keycloak
const syncWithKeycloak = async (counselorId: string): Promise<boolean> => {
  isVerificationSyncing.value = true
  verificationError.value = null

  try {
    await apiRequest<void>(`/api/v1/counselor/internal/counselors/${counselorId}/sync/keycloak`, {
      method: 'POST',
    })
    return true
  }
  catch (error: any) {
    verificationError.value = error.message || 'همگام‌سازی با Keycloak ناموفق بود'
    return false
  }
  finally {
    isVerificationSyncing.value = false
  }
}

// Export everything
export const useVerifications = () => {
  return {
    // State
    verificationState: readonly(verificationState),
    verificationError: readonly(verificationError),
    isVerificationLoading: readonly(isVerificationLoading),
    isVerificationSubmitting: readonly(isVerificationSubmitting),
    isVerificationSyncing: readonly(isVerificationSyncing),

    // Computed
    userVerificationDocuments,
    userVerificationStatus,
    verificationRequests,
    currentSyncStatus,
    keycloakValidation,

    // Methods
    getMyVerificationDocuments,
    registerVerificationDocument,
    submitVerificationRequest,
    getMyVerificationStatus,
    getAllVerificationRequests,
    updateVerificationStatus,
    validateKeycloakConsistency,
    getSyncStatus,
    syncWithKeycloak,
  }
}