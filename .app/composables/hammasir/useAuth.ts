import { ref, readonly, computed } from 'vue'
import type {
  RegisterDto,
  LoginDto,
  AuthTokensDto,
  RefreshTokenDto,
  EmailDto,
  ResetPasswordDto,
  GoogleOAuthUrlDto,
  GoogleCallbackDto,
  VerifyEmailDto,
  MeResponseDto,
} from '~/types/api'

// Authentication state
const authState = ref({
  user: null as MeResponseDto | null,
  accessToken: '',
  refreshToken: '',
  isAuthenticated: false,
  isInitialized: false,
})

// Auth errors
const authError = ref<string | null>(null)
const isAuthLoading = ref(false)

// Error translation map
const errorTranslations: Record<string, string> = {
  'email must be an email': 'ایمیل باید یک ایمیل معتبر باشد',
  'password must be a string': 'رمز عبور باید یک رشته باشد',
  'email is required': 'ایمیل الزامی است',
  'password is required': 'رمز عبور الزامی است',
  'Invalid credentials': 'ایمیل یا رمز عبور اشتباه است',
  'User not found': 'کاربر یافت نشد',
  'Invalid password': 'رمز عبور اشتباه است',
  'Email already exists': 'این ایمیل قبلاً ثبت شده است',
  'Invalid token': 'توکن نامعتبر است',
  'Token expired': 'توکن منقضی شده است',
  'Invalid refresh token': 'توکن تازه‌سازی نامعتبر است',
  'Refresh token expired': 'توکن تازه‌سازی منقضی شده است',
  'Email not verified': 'ایمیل تأیید نشده است',
  'Account suspended': 'حساب کاربری مسدود شده است',
  'Account not found': 'حساب کاربری یافت نشد',
  'Invalid verification token': 'توکن تأیید نامعتبر است',
  'Verification token expired': 'توکن تأیید منقضی شده است',
  'Password reset token expired': 'توکن بازیابی رمز عبور منقضی شده است',
  'Invalid password reset token': 'توکن بازیابی رمز عبور نامعتبر است',
  'Password too short': 'رمز عبور بسیار کوتاه است',
  'Password too weak': 'رمز عبور بسیار ساده است',
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

// Computed properties
const isAuthenticated = computed(() => authState.value.isAuthenticated)
const currentUser = computed(() => authState.value.user)
const authTokens = computed(() => ({
  accessToken: authState.value.accessToken,
  refreshToken: authState.value.refreshToken,
}))
const userRole = computed(() => {
  // In a real implementation, you would get this from the user object or JWT token
  // For now, we'll return a default value
  return 'USER' // or 'ADMIN' for testing
})

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
  if (authState.value.accessToken && !options.headers?.['X-Skip-Auth']) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${authState.value.accessToken}`,
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

// Register user
const register = async (data: RegisterDto): Promise<{ userId: string, emailVerificationRequired: boolean } | null> => {
  isAuthLoading.value = true
  authError.value = null

  try {
    return await apiRequest<{ userId: string, emailVerificationRequired: boolean }>('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'X-Skip-Auth': 'true',
      },
    })
  }
  catch (error: any) {
    authError.value = error.message || 'ثبت نام ناموفق بود'
    return null
  }
  finally {
    isAuthLoading.value = false
  }
}

// Login user
const login = async (data: LoginDto): Promise<AuthTokensDto | null> => {
  isAuthLoading.value = true
  authError.value = null

  try {
    const tokens = await apiRequest<AuthTokensDto>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'X-Skip-Auth': 'true',
      },
    })

    // Store tokens
    authState.value.accessToken = tokens.accessToken
    authState.value.refreshToken = tokens.refreshToken
    authState.value.isAuthenticated = true

    // Get user info
    await fetchCurrentUser()
    
    // Update premium status based on user's charge status
    // Since we don't have direct access to hasCharge in this auth system,
    // we'll need to update this when the user data is available

    return tokens
  }
  catch (error: any) {
    authError.value = error.message || 'ورود ناموفق بود'
    return null
  }
  finally {
    isAuthLoading.value = false
  }
}

// Logout user
const logout = async (): Promise<boolean> => {
  isAuthLoading.value = true
  authError.value = null

  try {
    if (authState.value.refreshToken) {
      await apiRequest<void>('/api/v1/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ refreshToken: authState.value.refreshToken }),
        headers: {
          'X-Skip-Auth': 'true',
        },
      })
    }

    // Clear auth state
    authState.value.user = null
    authState.value.accessToken = ''
    authState.value.refreshToken = ''
    authState.value.isAuthenticated = false
    
    // Reset premium status to false on logout
    const { setPremiumStatus } = useAIResponseSettings()
    setPremiumStatus(false)

    return true
  }
  catch (error: any) {
    authError.value = error.message || 'خروج ناموفق بود'
    return false
  }
  finally {
    isAuthLoading.value = false
  }
}

// Refresh tokens
const refreshTokens = async (): Promise<AuthTokensDto | null> => {
  if (!authState.value.refreshToken) {
    await logout()
    return null
  }

  try {
    const tokens = await apiRequest<AuthTokensDto>('/api/v1/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken: authState.value.refreshToken }),
      headers: {
        'X-Skip-Auth': 'true',
      },
    })

    // Update tokens
    authState.value.accessToken = tokens.accessToken
    authState.value.refreshToken = tokens.refreshToken

    return tokens
  }
  catch (error) {
    // If refresh fails, logout user
    await logout()
    return null
  }
}

// Fetch current user
const fetchCurrentUser = async (): Promise<MeResponseDto | null> => {
  try {
    const user = await apiRequest<MeResponseDto>('/api/v1/auth/me')
    authState.value.user = user
    authState.value.isAuthenticated = true
    return user
  }
  catch (error) {
    // If fetching user fails, logout
    await logout()
    return null
  }
}

// Request password reset
const requestPasswordReset = async (data: EmailDto): Promise<boolean> => {
  isAuthLoading.value = true
  authError.value = null

  try {
    await apiRequest<void>('/api/v1/auth/request-password-reset', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'X-Skip-Auth': 'true',
      },
    })

    return true
  }
  catch (error: any) {
    authError.value = error.message || 'ارسال ایمیل بازیابی رمز عبور ناموفق بود'
    return false
  }
  finally {
    isAuthLoading.value = false
  }
}

// Reset password
const resetPassword = async (data: ResetPasswordDto): Promise<boolean> => {
  isAuthLoading.value = true
  authError.value = null

  try {
    await apiRequest<void>('/api/v1/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'X-Skip-Auth': 'true',
      },
    })

    return true
  }
  catch (error: any) {
    authError.value = error.message || 'بازیابی رمز عبور ناموفق بود'
    return false
  }
  finally {
    isAuthLoading.value = false
  }
}

// Get Google OAuth URL
const getGoogleOAuthURL = async (): Promise<GoogleOAuthUrlDto | null> => {
  try {
    return await apiRequest<GoogleOAuthUrlDto>('/api/v1/auth/oauth/google/url', {
      headers: {
        'X-Skip-Auth': 'true',
      },
    })
  }
  catch (error) {
    console.error('دریافت آدرس OAuth گوگل ناموفق بود:', error)
    return null
  }
}

// Handle Google OAuth callback
const handleGoogleOAuthCallback = async (data: GoogleCallbackDto): Promise<AuthTokensDto | null> => {
  isAuthLoading.value = true
  authError.value = null

  try {
    const tokens = await apiRequest<AuthTokensDto>('/api/v1/auth/oauth/google/callback', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'X-Skip-Auth': 'true',
      },
    })

    // Store tokens and fetch user
    authState.value.accessToken = tokens.accessToken
    authState.value.refreshToken = tokens.refreshToken
    authState.value.isAuthenticated = true
    await fetchCurrentUser()

    return tokens
  }
  catch (error: any) {
    authError.value = error.message || 'احراز هویت با گوگل ناموفق بود'
    return null
  }
  finally {
    isAuthLoading.value = false
  }
}

// Verify email
const verifyEmail = async (data: VerifyEmailDto): Promise<boolean> => {
  isAuthLoading.value = true
  authError.value = null

  try {
    await apiRequest<void>('/api/v1/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'X-Skip-Auth': 'true',
      },
    })

    // Refresh user data to update verification status
    if (authState.value.isAuthenticated) {
      await fetchCurrentUser()
    }

    return true
  }
  catch (error: any) {
    authError.value = error.message || 'تأیید ایمیل ناموفق بود'
    return false
  }
  finally {
    isAuthLoading.value = false
  }
}

// Initialize auth state from storage (if applicable)
const initializeAuth = async (): Promise<void> => {
  // In a real app, you might load tokens from localStorage/cookies here
  // For now, we'll just mark as initialized
  authState.value.isInitialized = true
}

// Export everything
export const useAuth = () => {
  return {
    // State
    authState: readonly(authState),
    authError: readonly(authError),
    isAuthLoading: readonly(isAuthLoading),

    // Computed
    isAuthenticated,
    currentUser,
    authTokens,
    userRole,

    // Methods
    register,
    login,
    logout,
    refreshTokens,
    fetchCurrentUser,
    requestPasswordReset,
    resetPassword,
    getGoogleOAuthURL,
    handleGoogleOAuthCallback,
    verifyEmail,
    initializeAuth,
  }
}

// Utility function to get auth headers for API calls
export const getAuthHeaders = () => {
  if (authState.value.accessToken) {
    return {
      Authorization: `Bearer ${authState.value.accessToken}`,
    }
  }
  return {}
}
