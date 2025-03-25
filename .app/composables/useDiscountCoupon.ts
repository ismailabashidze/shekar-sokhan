export interface DiscountCoupon {
  id: string
  code: string
  amount: number
  isUsed: boolean
  duration: number
  created: string
  updated: string
}

export const useDiscountCoupon = () => {
  const nuxtApp = useNuxtApp()
  const pb = nuxtApp.$pb

  const createCoupon = async (data: Partial<DiscountCoupon>) => {
    try {
      return await pb.collection('discountCopoun').create(data)
    }
    catch (error: any) {
      console.error('Error creating discount coupon:', error)
      throw error
    }
  }

  const getCoupon = async (id: string) => {
    try {
      return await pb.collection('discountCopoun').getOne(id)
    }
    catch (error: any) {
      console.error('Error getting discount coupon:', error)
      throw error
    }
  }

  const updateCoupon = async (id: string, data: Partial<DiscountCoupon>) => {
    try {
      return await pb.collection('discountCopoun').update(id, data)
    }
    catch (error: any) {
      console.error('Error updating discount coupon:', error)
      throw error
    }
  }

  return {
    createCoupon,
    getCoupon,
    updateCoupon,
  }
}
