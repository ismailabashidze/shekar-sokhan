import { ref, readonly } from 'vue'
import { useAuth } from './useAuth'
import type {
  CounselorProfileDto,
  SystemNotificationDto,
  SystemNotificationListDto,
  CreateNotificationDto,
  VerificationRequestDto,
  MatchmakingModuleDto,
  UpdateModuleStatusAdminDto,
  FileMetadataDto,
} from '~/types/api'

// Admin state
const adminState = ref({
  counselors: [] as CounselorProfileDto[],
  notifications: [] as SystemNotificationDto[],
  verificationRequests: [] as VerificationRequestDto[],
  modules: [] as MatchmakingModuleDto[],
  files: [] as FileMetadataDto[],
  isLoading: false,
  error: null as string | null,
  totalCounselors: 0,
  totalNotifications: 0,
  totalVerificationRequests: 0,
  totalModules: 0,
  totalFiles: 0,
  currentPage: 1,
  itemsPerPage: 10,
})

// Admin errors
const adminError = ref<string | null>(null)
const isAdminLoading = ref(false)

// Error translation map
const errorTranslations: Record<string, string> = {
  'Counselor not found': 'مشاور یافت نشد',
  'Invalid counselor data': 'داده‌های مشاور نامعتبر است',
  'User not found': 'کاربر یافت نشد',
  'Invalid specialization': 'تخصص نامعتبر است',
  'Invalid availability data': 'داده‌های زمان‌های کاری نامعتبر است',
  'Notification not found': 'اعلان یافت نشد',
  'Invalid notification data': 'داده‌های اعلان نامعتبر است',
  'Notification send failed': 'ارسال اعلان ناموفق بود',
  'Invalid recipient': 'گیرنده نامعتبر است',
  'Verification request not found': 'درخواست تأیید یافت نشد',
  'Invalid verification data': 'داده‌های تأیید نامعتبر است',
  'Module not found': 'ماژول یافت نشد',
  'Invalid module data': 'داده‌های ماژول نامعتبر است',
  'File not found': 'فایل یافت نشد',
  'File access denied': 'دسترسی به فایل رد شد',
  'Invalid file type': 'نوع فایل نامعتبر است',
  'File too large': 'حجم فایل بیش از حد مجاز است',
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
      return 'منبع یافت نشد'
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

// Helper function to get API base URL
const getApiBaseUrl = () => {
  return process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:4000'
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

// Get all counselors (admin only)
const getAllCounselorsAdmin = async (
  page: number = 1,
  limit: number = 10,
  verificationStatus?: string,
  specialization?: string,
): Promise<{ counselors: CounselorProfileDto[], total: number } | null> => {
  isAdminLoading.value = true
  adminError.value = null

  try {
    let url = `/api/v1/counselor/admin/counselors?page=${page}&size=${limit}`

    if (verificationStatus) {
      url += `&verificationStatus=${verificationStatus}`
    }

    if (specialization) {
      url += `&specialization=${specialization}`
    }

    const result = await apiRequest<{ counselors: CounselorProfileDto[], total: number }>(url)

    // Update local state
    if (page === 1) {
      adminState.value.counselors = result.counselors
    }
    else {
      adminState.value.counselors = [
        ...adminState.value.counselors,
        ...result.counselors,
      ]
    }

    adminState.value.totalCounselors = result.total
    adminState.value.currentPage = page
    adminState.value.itemsPerPage = limit

    return result
  }
  catch (error: any) {
    adminError.value = error.message || 'دریافت لیست مشاوران ناموفق بود'
    return null
  }
  finally {
    isAdminLoading.value = false
  }
}

// Get counselor by ID (admin only)
const getCounselorByIdAdmin = async (counselorId: string): Promise<CounselorProfileDto | null> => {
  isAdminLoading.value = true
  adminError.value = null

  try {
    return await apiRequest<CounselorProfileDto>(`/api/v1/counselor/admin/counselors/${counselorId}`)
  }
  catch (error: any) {
    adminError.value = error.message || 'دریافت اطلاعات مشاور ناموفق بود'
    return null
  }
  finally {
    isAdminLoading.value = false
  }
}

// Get system notifications (admin only)
const getSystemNotificationsAdmin = async (
  page: number = 1,
  limit: number = 20,
  type?: string,
): Promise<SystemNotificationListDto | null> => {
  isAdminLoading.value = true
  adminError.value = null

  try {
    let url = `/api/v1/notification/admin/notifications?page=${page}&limit=${limit}`

    if (type) {
      url += `&type=${type}`
    }

    const result = await apiRequest<SystemNotificationListDto>(url)

    // Update local state
    if (page === 1) {
      adminState.value.notifications = result.notifications
    }
    else {
      adminState.value.notifications = [
        ...adminState.value.notifications,
        ...result.notifications,
      ]
    }

    adminState.value.totalNotifications = result.total
    adminState.value.currentPage = page
    adminState.value.itemsPerPage = limit

    return result
  }
  catch (error: any) {
    adminError.value = error.message || 'دریافت اعلان‌های سیستمی ناموفق بود'
    return null
  }
  finally {
    isAdminLoading.value = false
  }
}

// Send system notification (admin only)
const sendSystemNotificationAdmin = async (
  data: CreateNotificationDto,
): Promise<SystemNotificationDto | null> => {
  isAdminLoading.value = true
  adminError.value = null

  try {
    const result = await apiRequest<SystemNotificationDto>('/api/v1/notification/admin/notifications', {
      method: 'POST',
      body: JSON.stringify(data),
    })

    // Add to local state at the beginning
    adminState.value.notifications.unshift(result)
    adminState.value.totalNotifications++

    return result
  }
  catch (error: any) {
    adminError.value = error.message || 'ارسال اعلان سیستمی ناموفق بود'
    return null
  }
  finally {
    isAdminLoading.value = false
  }
}

// Get all verification requests (admin only)
const getAllVerificationRequestsAdmin = async (
  status?: string,
): Promise<VerificationRequestDto[] | null> => {
  isAdminLoading.value = true
  adminError.value = null

  try {
    let url = '/api/v1/counselor/admin/verifications'
    
    if (status) {
      url += `?status=${status}`
    }

    const result = await apiRequest<VerificationRequestDto[]>(url)
    adminState.value.verificationRequests = result
    adminState.value.totalVerificationRequests = result.length
    return result
  }
  catch (error: any) {
    adminError.value = error.message || 'دریافت درخواست‌های تأیید ناموفق بود'
    return null
  }
  finally {
    isAdminLoading.value = false
  }
}

// Update verification status (admin only)
const updateVerificationStatusAdmin = async (
  verificationId: string,
  status: string,
): Promise<VerificationRequestDto | null> => {
  isAdminLoading.value = true
  adminError.value = null

  try {
    const result = await apiRequest<VerificationRequestDto>(
      `/api/v1/counselor/admin/verifications/${verificationId}/status`,
      {
        method: 'PUT',
        body: JSON.stringify({ status }),
      },
    )

    // Update in local state
    const index = adminState.value.verificationRequests.findIndex(v => v.id === verificationId)
    if (index !== -1) {
      adminState.value.verificationRequests[index] = result
    }

    return result
  }
  catch (error: any) {
    adminError.value = error.message || 'به‌روزرسانی وضعیت تأیید ناموفق بود'
    return null
  }
  finally {
    isAdminLoading.value = false
  }
}

// Get all modules (admin only)
const getAllModulesAdmin = async (
  page: number = 1,
  limit: number = 10,
  status?: string,
): Promise<{ modules: MatchmakingModuleDto[], total: number } | null> => {
  isAdminLoading.value = true
  adminError.value = null

  try {
    let url = `/api/v1/matchmaking/admin/modules?page=${page}&limit=${limit}`

    if (status) {
      url += `&status=${status}`
    }

    const result = await apiRequest<{ modules: MatchmakingModuleDto[], total: number }>(url)

    // Update local state
    if (page === 1) {
      adminState.value.modules = result.modules
    }
    else {
      adminState.value.modules = [
        ...adminState.value.modules,
        ...result.modules,
      ]
    }

    adminState.value.totalModules = result.total
    adminState.value.currentPage = page
    adminState.value.itemsPerPage = limit

    return result
  }
  catch (error: any) {
    adminError.value = error.message || 'دریافت لیست ماژول‌ها ناموفق بود'
    return null
  }
  finally {
    isAdminLoading.value = false
  }
}

// Update module status (admin only)
const updateModuleStatusAdmin = async (
  userId: string,
  data: UpdateModuleStatusAdminDto,
): Promise<MatchmakingModuleDto | null> => {
  isAdminLoading.value = true
  adminError.value = null

  try {
    const result = await apiRequest<MatchmakingModuleDto>(
      `/api/v1/matchmaking/admin/modules/${userId}/status`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      },
    )

    // Update in local state
    const index = adminState.value.modules.findIndex(m => m.userId === userId)
    if (index !== -1) {
      adminState.value.modules[index] = result
    }

    return result
  }
  catch (error: any) {
    adminError.value = error.message || 'به‌روزرسانی وضعیت ماژول ناموفق بود'
    return null
  }
  finally {
    isAdminLoading.value = false
  }
}

// Get all files (admin only)
const getAllFilesAdmin = async (
  userId?: string,
  fileType?: string,
  status?: string,
): Promise<FileMetadataDto[] | null> => {
  isAdminLoading.value = true
  adminError.value = null

  try {
    let url = '/api/v1/files/admin'
    
    const params = []
    if (userId) params.push(`userId=${userId}`)
    if (fileType) params.push(`fileType=${fileType}`)
    if (status) params.push(`status=${status}`)
    
    if (params.length > 0) {
      url += `?${params.join('&')}`
    }

    const result = await apiRequest<FileMetadataDto[]>(url)
    adminState.value.files = result
    adminState.value.totalFiles = result.length
    return result
  }
  catch (error: any) {
    adminError.value = error.message || 'دریافت لیست فایل‌ها ناموفق بود'
    return null
  }
  finally {
    isAdminLoading.value = false
  }
}

// Export everything
export const useAdmin = () => {
  return {
    // State
    adminState: readonly(adminState),
    adminError: readonly(adminError),
    isAdminLoading: readonly(isAdminLoading),

    // Methods
    getAllCounselorsAdmin,
    getCounselorByIdAdmin,
    getSystemNotificationsAdmin,
    sendSystemNotificationAdmin,
    getAllVerificationRequestsAdmin,
    updateVerificationStatusAdmin,
    getAllModulesAdmin,
    updateModuleStatusAdmin,
    getAllFilesAdmin,
  }
}