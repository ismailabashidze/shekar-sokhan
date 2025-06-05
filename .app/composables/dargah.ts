import { ref, reactive } from 'vue'

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
 * Interface for transaction status check response
 */
export interface TransactionStatusResponse {
  status: number
  authority: string
  refId?: string
  cardNumber?: string
  msg?: string
  dateTime?: string
  factor_number?: number
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
  }>({})

  const baseUrl = 'https://dargahno.net'

  /**
   * Register a new transaction to start the payment process
   * @param data Transaction data
   * @returns Registered transaction result
   */
  const registerTransaction = async (data: TransactionCreateRequest) => {
    isLoading.value = true
    error.value = null
    
    try {
      // Get the token from the auth store if available
      const authToken = useAuthToken?.() || ''
      
      const response = await fetch(`${baseUrl}/api/v2/transaction/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authToken ? `Bearer ${authToken}` : ''
        },
        body: JSON.stringify(data)
      })
      
      const responseData = await response.json()
      
      if (!response.ok) {
        throw new Error(responseData.detail?.[0]?.msg || 'Failed to register transaction')
      }
      
      result.transaction = responseData
      return responseData as TransactionResult
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to register transaction'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Check the status of a transaction
   * @param data Transaction check data (authority and optional new_price)
   * @returns Transaction status information
   */
  const checkTransactionStatus = async (data: TransactionCheckRequest) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await fetch(`${baseUrl}/api/v2/transaction/check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      
      const responseData = await response.json()
      
      if (!response.ok) {
        throw new Error(responseData.detail?.[0]?.msg || 'Failed to check transaction status')
      }
      
      result.status = responseData
      return responseData as TransactionStatusResponse
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to check transaction status'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Get payment URL for redirecting the user to the payment page
   * @param authority Transaction authority token
   * @returns Full URL to the payment page
   */
  const getPaymentUrl = (authority: string) => {
    return `${baseUrl}/api/v2/transaction/payment/${authority}`
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
   * @returns Status information from the callback URL
   */
  const handleCallback = async () => {
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
        return await checkTransactionStatus({ authority })
      } else {
        error.value = 'Payment was not successful'
        return null
      }
    }
    return null
  }

  // Helper function to get auth token (implement according to your auth system)
  const useAuthToken = () => {
    // This should be replaced with your actual auth token retrieval logic
    if (process.client) {
      return localStorage.getItem('auth_token')
    }
    return null
  }

  return {
    isLoading,
    error,
    result,
    registerTransaction,
    checkTransactionStatus,
    getPaymentUrl,
    redirectToPayment,
    getAuthorityFromUrl,
    handleCallback
  }
}

export default useDargah
