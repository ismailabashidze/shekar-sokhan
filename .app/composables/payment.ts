import { useNuxtApp } from '#app'

export type PaymentStatus = 'success' | 'pending' | 'failed' | 'refunded' | 'cancelled'

export type Payment = {
  id: string
  user: string
  session?: string
  alternativeDeed?: string
  discountCopoun?: string
  description?: string
  amount: number
  transactionId?: string
  status: PaymentStatus
  created?: string
  updated?: string
}

export type PaymentFilter = {
  status?: PaymentStatus
  userId?: string
  sessionId?: string
}

export function usePayment() {
  const nuxtApp = useNuxtApp()

  const getPayments = async (filter?: PaymentFilter) => {
    if (!nuxtApp.$pb.authStore.isValid) {
      throw new Error('User not authenticated')
    }

    try {
      let filterStr = `user = "${nuxtApp.$pb.authStore.model?.id}"`

      // If admin is viewing another user's payments
      if (filter?.userId) {
        filterStr = `user = "${filter.userId}"`
      }

      // Apply other filters
      if (filter?.status) {
        filterStr += ` && status = "${filter.status}"`
      }
      if (filter?.sessionId) {
        filterStr += ` && session = "${filter.sessionId}"`
      }

      return await nuxtApp.$pb.collection('payments').getFullList({
        sort: '-created',
        filter: filterStr,
        expand: 'user,session',
      })
    }
    catch (error: any) {
      if (error?.isAbort) {
        console.log('Request was cancelled')
        return []
      }
      throw error
    }
  }

  const getPayment = async (id: string) => {
    if (!nuxtApp.$pb.authStore.isValid) {
      throw new Error('User not authenticated')
    }

    try {
      return await nuxtApp.$pb.collection('payments').getOne(id, {
        expand: 'user,session',
      })
    }
    catch (error: any) {
      if (error?.isAbort) {
        console.log('Request was cancelled')
        return null
      }
      throw error
    }
  }

  const createPayment = async (data: Partial<Payment>) => {
    if (!nuxtApp.$pb.authStore.isValid) {
      throw new Error('User not authenticated')
    }

    const paymentData = {
      ...data,
      user: data.user || nuxtApp.$pb.authStore.model.id,
      status: data.status || 'pending',
    }

    try {
      return await nuxtApp.$pb.collection('payments').create(paymentData)
    }
    catch (error: any) {
      if (error?.isAbort) {
        console.log('Request was cancelled')
        return null
      }
      throw error
    }
  }

  const updatePayment = async (id: string, data: Partial<Payment>) => {
    if (!nuxtApp.$pb.authStore.isValid) {
      throw new Error('User not authenticated')
    }

    try {
      return await nuxtApp.$pb.collection('payments').update(id, data)
    }
    catch (error: any) {
      if (error?.isAbort) {
        console.log('Request was cancelled')
        return null
      }
      throw error
    }
  }

  return {
    getPayments,
    getPayment,
    createPayment,
    updatePayment,
  }
}
