import { ref, reactive, readonly } from 'vue'

/**
 * Interface for login request
 */
export interface LoginRequest {
  username: string
  password: string
}

/**
 * Alternative login formats to try
 */
export interface LoginAttempt {
  username?: string
  email?: string
  phone?: string
  mobile?: string
  password: string
}

/**
 * Interface for login response (v2 API format)
 */
export interface LoginResponse {
  access_token: string
  token_type: string
  expire_time: number
  user_info: {
    merchent_id: string
    role: string
    account_state: number
  }
}

/**
 * Interface for transaction creation request
 */
export interface TransactionCreateRequest {
  merchent_id: string
  price?: number
  crypto_amount?: number
  crypto_name?: string
  factor_number: number
  callback_url?: string
  ipn?: string
  shop_id?: number
  category?: 'Forwarder' | 'ZarinLink' | 'SimLess' | 'AppLess' | 'Direct' | 'Crypto'
  notify_EndUser?: boolean
  transaction_fee_side?: 'Seller' | 'EndUser'
  agent?: string
  mobile?: string
  name?: string
  email?: string
  description?: string
}

/**
 * Interface for transaction result response
 */
export interface TransactionResult {
  authority: string
  shop_id?: number
  new_price?: number
  zarin_link?: string
  crypto_paylink?: string
  crypto_new_price?: string
}

/**
 * Interface for transaction status check request
 */
export interface TransactionCheckRequest {
  authority: string
  new_price?: string
}

/**
 * Interface for transaction status check response (v2 API format)
 */
export interface TransactionStatusResponse {
  status: number
  factor_number: number
  authority: string
  validate: boolean
  refId?: string
  cardNumber?: string
  msg?: string
  dateTime?: string
  price?: number
  new_price?: number
  callback_url?: string
  name?: string
  mobile?: string
  email?: string
}

/**
 * Composable for Dargah payment gateway integration
 */
export const useDargah = () => {
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const result = reactive<{
    transaction?: TransactionResult
    status?: TransactionStatusResponse
    login?: LoginResponse
  }>({})

  const config = useRuntimeConfig()
  const baseUrl = config.public.dargahBaseUrl || 'https://dargahno.net'

  // Token management
  const authToken = ref<string | null>(null)
  const merchantId = ref<string | null>(null)
  const tokenExpiry = ref<number | null>(null)

  /**
   * Login to Dargah and get access token
   * @param credentials Login credentials
   * @returns Login response with token and merchant_id
   */
  const login = async (credentials: LoginRequest) => {
    isLoading.value = true
    error.value = null

    try {
      console.log('🔑 Attempting login to Dargah with form-encoded data:', {
        username: credentials.username,
        passwordLength: credentials.password?.length || 0,
        baseUrl,
      })

      // Create form-encoded data as per Dargah documentation
      const formData = new URLSearchParams({
        grant_type: 'password',
        username: credentials.username,
        password: credentials.password,
        scope: '',
        client_id: 'string',
        client_secret: 'string',
      })

      const response = await fetch(`${baseUrl}/api/v2/auth/login`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      })

      const responseData = await response.json()

      console.log('🔑 Dargah login response:', {
        status: response.status,
        ok: response.ok,
        data: responseData,
      })

      if (!response.ok) {
        const errorMsg = responseData.detail
          ? (Array.isArray(responseData.detail) ? responseData.detail.map(d => d.msg).join(', ') : responseData.detail)
          : 'Login failed'
        throw new Error(errorMsg)
      }

      // Store auth data - note the response format from docs
      authToken.value = responseData.access_token
      merchantId.value = responseData.user_info?.merchent_id || responseData.merchent_id
      tokenExpiry.value = Date.now() + ((responseData.expire_time || 30) * 60 * 1000) // Convert minutes to milliseconds

      result.login = responseData
      console.log('✅ Login successful, token stored:', {
        tokenType: responseData.token_type,
        expireTime: responseData.expire_time,
        merchantId: merchantId.value,
      })
      return responseData as LoginResponse
    }
    catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed'
      console.error('❌ Login failed:', errorMessage)
      error.value = errorMessage
      throw err
    }
    finally {
      isLoading.value = false
    }
  }

  /**
   * Check if current token is valid
   */
  const isTokenValid = () => {
    return authToken.value && tokenExpiry.value && Date.now() < tokenExpiry.value
  }

  /**
   * Register a new transaction to start the payment process
   * @param data Transaction data
   * @param credentials Optional login credentials if not already authenticated
   * @returns Registered transaction result
   */
  const registerTransaction = async (data: TransactionCreateRequest, credentials?: LoginRequest) => {
    isLoading.value = true
    error.value = null

    try {
      // Check if we need to login first
      if (!isTokenValid()) {
        if (!credentials) {
          throw new Error('Authentication required. Please provide login credentials.')
        }
        await login(credentials)
      }

      // Add required fields based on documentation
      const completeTransactionData = {
        ...data,
        category: data.category || 'Forwarder', // Default to Forwarder as per docs
        transaction_fee_side: data.transaction_fee_side || 'Seller', // Default fee to seller
        shop_id: data.shop_id || '37664064', // Can be null for basic usage
      }

      console.log('💳 Registering transaction with Dargah:', {
        amount: completeTransactionData.price,
        merchantId: completeTransactionData.merchent_id,
        factorNumber: completeTransactionData.factor_number,
        category: completeTransactionData.category,
        authTokenPresent: !!authToken.value,
      })

      const response = await fetch(`${baseUrl}/api/v2/transaction/register`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${authToken.value}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(completeTransactionData),
      })

      const responseData = await response.json()

      console.log('💳 Transaction register response:', {
        status: response.status,
        ok: response.ok,
        data: responseData,
      })

      if (!response.ok) {
        const errorMsg = responseData.detail
          ? (Array.isArray(responseData.detail) ? responseData.detail.map(d => d.msg).join(', ') : responseData.detail)
          : 'Transaction registration failed'
        throw new Error(errorMsg)
      }

      result.transaction = responseData
      console.log('✅ Transaction registered successfully:', {
        authority: responseData.authority,
        newPrice: responseData.new_price,
        shopId: responseData.shop_id,
      })
      return responseData as TransactionResult
    }
    catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to register transaction'
      console.error('❌ Transaction registration failed:', errorMessage)
      error.value = errorMessage
      throw err
    }
    finally {
      isLoading.value = false
    }
  }

  /**
   * Check the status of a transaction
   * @param data Transaction check data (authority and optional new_price)
   * @param credentials Optional login credentials if not already authenticated
   * @returns Transaction status information
   */
  const checkTransactionStatus = async (data: TransactionCheckRequest, credentials?: LoginRequest) => {
    isLoading.value = true
    error.value = null

    try {
      console.log('🔍 Checking transaction status:', {
        authority: data.authority,
        hasCredentials: !!credentials,
      })

      const response = await fetch(`${baseUrl}/api/v2/transaction/check`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const responseData = await response.json()

      console.log('🔍 Transaction check response:', {
        status: response.status,
        ok: response.ok,
        data: responseData,
      })

      if (!response.ok) {
        const errorMsg = responseData.detail
          ? (Array.isArray(responseData.detail) ? responseData.detail.map(d => d.msg).join(', ') : responseData.detail)
          : 'Failed to check transaction status'
        throw new Error(errorMsg)
      }

      result.status = responseData
      console.log('✅ Transaction status checked:', {
        status: responseData.status,
        validate: responseData.validate,
        factorNumber: responseData.factor_number,
      })
      return responseData as TransactionStatusResponse
    }
    catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to check transaction status'
      console.error('❌ Transaction status check failed:', errorMessage)
      error.value = errorMessage
      throw err
    }
    finally {
      isLoading.value = false
    }
  }

  /**
   * Get payment URL for redirecting the user to the payment page
   * @param authority Transaction authority token
   * @returns Full URL to the payment page
   */
  const getPaymentUrl = (authority: string) => {
    return `https://pay.dargahno.net/?authority=${authority}`
  }

  /**
   * Redirect user to the payment page
   * @param authority Transaction authority token
   */
  const redirectToPayment = (authority: string) => {
    if (process.client) {
      window.location.href = getPaymentUrl(authority)
    }
  }

  /**
   * Helper function to extract authority from URL when returning from payment
   * @returns Authority token from URL if present
   */
  const getAuthorityFromUrl = () => {
    if (process.client) {
      const url = new URL(window.location.href)
      return url.searchParams.get('Authority') || null
    }
    return null
  }

  /**
   * Process callback from payment gateway
   * @param credentials Optional login credentials if not already authenticated
   * @returns Status information from the callback URL
   */
  const handleCallback = async (credentials?: LoginRequest) => {
    if (process.client) {
      const url = new URL(window.location.href)
      const authority = url.searchParams.get('Authority')
      const status = url.searchParams.get('Status')

      if (!authority) {
        error.value = 'No authority token found in callback URL'
        return null
      }

      // If Status is OK, verify the payment
      if (status === 'OK') {
        return await checkTransactionStatus({ authority }, credentials)
      }
      else {
        error.value = 'Payment was not successful'
        return null
      }
    }
    return null
  }

  return {
    isLoading,
    error,
    result,
    authToken: readonly(authToken),
    merchantId: readonly(merchantId),
    login,
    isTokenValid,
    registerTransaction,
    checkTransactionStatus,
    getPaymentUrl,
    redirectToPayment,
    getAuthorityFromUrl,
    handleCallback,
  }
}

export default useDargah
