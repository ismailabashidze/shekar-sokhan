import { ref, readonly } from 'vue'
import type {
  UploadTokenRequestDto,
  UploadTokenResponseDto,
  DownloadTokenRequestDto,
  DownloadTokenResponseDto,
  FileMetadataDto,
  FileAccessValidationDto,
} from '~/types/api'

// File state
const fileState = ref({
  isFileLoading: false,
  fileError: null as string | null,
})

// File errors
const fileError = ref<string | null>(null)
const isFileLoading = ref(false)

// Error translation map
const errorTranslations: Record<string, string> = {
  'File not found': 'فایل یافت نشد',
  'File access denied': 'دسترسی به فایل رد شد',
  'Invalid file type': 'نوع فایل نامعتبر است',
  'File too large': 'حجم فایل بیش از حد مجاز است',
  'Upload failed': 'آپلود فایل ناموفق بود',
  'Download failed': 'دانلود فایل ناموفق بود',
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
      return 'فایل یافت نشد'
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
  const authStore = useAuth() // Assuming useAuth is available globally
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

// Generate upload token
const generateUploadToken = async (data: UploadTokenRequestDto): Promise<UploadTokenResponseDto | null> => {
  isFileLoading.value = true
  fileError.value = null

  try {
    return await apiRequest<UploadTokenResponseDto>('/api/v1/files/upload-token', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }
  catch (error: any) {
    fileError.value = error.message || 'دریافت توکن آپلود ناموفق بود'
    return null
  }
  finally {
    isFileLoading.value = false
  }
}

// Upload file directly
const uploadFile = async (file: File, uploadUrl: string): Promise<boolean> => {
  isFileLoading.value = true
  fileError.value = null

  try {
    const response = await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    return true
  }
  catch (error: any) {
    fileError.value = error.message || 'آپلود فایل ناموفق بود'
    return false
  }
  finally {
    isFileLoading.value = false
  }
}

// Generate download token
const generateDownloadToken = async (data: DownloadTokenRequestDto): Promise<DownloadTokenResponseDto | null> => {
  isFileLoading.value = true
  fileError.value = null

  try {
    return await apiRequest<DownloadTokenResponseDto>('/api/v1/files/download-token', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }
  catch (error: any) {
    fileError.value = error.message || 'دریافت توکن دانلود ناموفق بود'
    return null
  }
  finally {
    isFileLoading.value = false
  }
}

// Download file
const downloadFile = async (downloadUrl: string, filename: string): Promise<boolean> => {
  isFileLoading.value = true
  fileError.value = null

  try {
    const response = await fetch(downloadUrl)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    return true
  }
  catch (error: any) {
    fileError.value = error.message || 'دانلود فایل ناموفق بود'
    return false
  }
  finally {
    isFileLoading.value = false
  }
}

// Get file metadata
const getFileMetadata = async (fileId: string): Promise<FileMetadataDto | null> => {
  isFileLoading.value = true
  fileError.value = null

  try {
    return await apiRequest<FileMetadataDto>(`/api/v1/files/${fileId}/metadata`)
  }
  catch (error: any) {
    fileError.value = error.message || 'دریافت اطلاعات فایل ناموفق بود'
    return null
  }
  finally {
    isFileLoading.value = false
  }
}

// Validate file access
const validateFileAccess = async (fileId: string): Promise<FileAccessValidationDto | null> => {
  isFileLoading.value = true
  fileError.value = null

  try {
    return await apiRequest<FileAccessValidationDto>(`/api/v1/files/${fileId}/validate-access`)
  }
  catch (error: any) {
    fileError.value = error.message || 'اعتبارسنجی دسترسی به فایل ناموفق بود'
    return null
  }
  finally {
    isFileLoading.value = false
  }
}

// Export everything
export const useFile = () => {
  return {
    // State
    fileState: readonly(fileState),
    fileError: readonly(fileError),
    isFileLoading: readonly(isFileLoading),

    // Methods
    generateUploadToken,
    uploadFile,
    generateDownloadToken,
    downloadFile,
    getFileMetadata,
    validateFileAccess,
  }
}
