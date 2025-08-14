// Auth Service interfaces based on OpenAPI spec
export interface AuthTokens {
  accessToken: string
  refreshToken: string
  tokenType?: string
  expiresIn?: number
}

export interface RegisterRequest {
  email: string
  password: string
  acceptTerms?: boolean
}

export interface RegisterResponse {
  userId: string
  emailVerificationRequired?: boolean
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface LogoutRequest {
  refreshToken: string
}

export interface PasswordResetRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  newPassword: string
}

export interface GoogleOAuthUrlResponse {
  url: string
}

export interface GoogleOAuthCallbackRequest {
  code: string
}

export interface EmailVerificationRequest {
  token: string
}

export interface UserInfo {
  userId: string
  email: string
  emailVerified: boolean
}

export interface JwksResponse {
  keys: any[]
}

export function useAuth() {
  const { $fetch } = useNuxtApp()

  const register = async (request: RegisterRequest): Promise<RegisterResponse> => {
    return await $fetch('/api/v1/register', {
      method: 'POST',
      body: request
    })
  }

  const login = async (request: LoginRequest): Promise<AuthTokens> => {
    return await $fetch('/api/v1/login', {
      method: 'POST',
      body: request
    })
  }

  const refreshTokens = async (request: RefreshTokenRequest): Promise<AuthTokens> => {
    return await $fetch('/api/v1/refresh', {
      method: 'POST',
      body: request
    })
  }

  const logout = async (request: LogoutRequest): Promise<void> => {
    return await $fetch('/api/v1/logout', {
      method: 'POST',
      body: request
    })
  }

  const requestPasswordReset = async (request: PasswordResetRequest): Promise<void> => {
    return await $fetch('/api/v1/request-password-reset', {
      method: 'POST',
      body: request
    })
  }

  const resetPassword = async (request: ResetPasswordRequest): Promise<void> => {
    return await $fetch('/api/v1/reset-password', {
      method: 'POST',
      body: request
    })
  }

  const getGoogleOAuthUrl = async (): Promise<GoogleOAuthUrlResponse> => {
    return await $fetch('/api/v1/oauth/google/url', {
      method: 'GET'
    })
  }

  const handleGoogleOAuthCallback = async (request: GoogleOAuthCallbackRequest): Promise<AuthTokens> => {
    return await $fetch('/api/v1/oauth/google/callback', {
      method: 'POST',
      body: request
    })
  }

  const verifyEmail = async (request: EmailVerificationRequest): Promise<void> => {
    return await $fetch('/api/v1/verify-email', {
      method: 'POST',
      body: request
    })
  }

  const getMe = async (): Promise<UserInfo> => {
    return await $fetch('/api/v1/me', {
      method: 'GET'
    })
  }

  const getJwks = async (): Promise<JwksResponse> => {
    return await $fetch('/api/v1/.well-known/jwks.json', {
      method: 'GET'
    })
  }

  return {
    register,
    login,
    refreshTokens,
    logout,
    requestPasswordReset,
    resetPassword,
    getGoogleOAuthUrl,
    handleGoogleOAuthCallback,
    verifyEmail,
    getMe,
    getJwks,
  }
}