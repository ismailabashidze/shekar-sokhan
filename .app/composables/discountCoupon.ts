import { useNuxtApp } from '#app'

export type discountCopoun = {
  id: string
  code: string
  amount: number
  duration: number
  isUsed: boolean
  created: string
  updated: string
}

export function useDiscountCopoun() {
  const nuxtApp = useNuxtApp()

  const generateRandomCode = (prefix: string = '', length: number = 8) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = prefix
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  const generateBatchCoupons = async (amount: number, duration: number, count: number, prefix: string = '') => {
    if (!nuxtApp.$pb.authStore.isValid) {
      throw new Error('User not authenticated')
    }

    const coupons = []
    for (let i = 0; i < count; i++) {
      const code = generateRandomCode(prefix)
      const couponData = {
        amount,
        duration,
        code,
        isUsed: false,
      }

      try {
        const coupon = await nuxtApp.$pb.collection('discountCopoun').create(couponData)
        coupons.push(coupon)
      }
      catch (error: any) {
        if (!error?.isAbort) {
          throw error
        }
      }
    }
    return coupons
  }

  const generateCoupon = async (amount: number, duration: number, code: string) => {
    if (!nuxtApp.$pb.authStore.isValid) {
      throw new Error('User not authenticated')
    }

    const couponData = {
      amount,
      duration,
      code,
      isUsed: false,
    }

    try {
      return await nuxtApp.$pb.collection('discountCopoun').create(couponData)
    }
    catch (error: any) {
      if (error?.isAbort) return null
      throw error
    }
  }

  const getCoupons = async () => {
    try {
      return await nuxtApp.$pb.collection('discountCopoun').getFullList({
        sort: '-created',
      })
    }
    catch (error: any) {
      if (error?.isAbort) return []
      throw error
    }
  }

  const validateCoupon = async (code: string) => {
    if (!nuxtApp.$pb.authStore.isValid) {
      throw new Error('User not authenticated')
    }

    try {
      const records = await nuxtApp.$pb.collection('discountCopoun').getFullList({
        filter: `code = "${code}" && isUsed = false`,
      })
      return records[0] || null
    }
    catch (error: any) {
      if (error?.isAbort) return null
      throw error
    }
  }

  const markCouponAsUsed = async (couponId: string) => {
    if (!nuxtApp.$pb.authStore.isValid) {
      throw new Error('User not authenticated')
    }

    try {
      return await nuxtApp.$pb.collection('discountCopoun').update(couponId, {
        isUsed: true,
      })
    }
    catch (error: any) {
      if (error?.isAbort) return null
      throw error
    }
  }

  const deleteCoupons = async (couponIds: string[]) => {
    try {
      await Promise.all(
        couponIds.map(id =>
          nuxtApp.$pb.collection('discountCopoun').delete(id),
        ),
      )
      return true
    }
    catch (error: any) {
      if (error?.isAbort) return false
      throw error
    }
  }

  return {
    generateCoupon,
    generateBatchCoupons,
    getCoupons,
    validateCoupon,
    markCouponAsUsed,
    deleteCoupons,
  }
}
