export interface ProviderLoad {
  id: string
  productId: string
  productName: string
  totalQuantityKg: number
  availableQuantityKg: number
  pricePerKg: number
  status: 'active' | 'completed' | 'expired'
  availabilityDate: Date
  expiryDate: Date
  createdAt: Date
  updatedAt: Date
  requests: LoadRequest[]
  totalSales: number
}

export interface LoadRequest {
  id: string
  orderId: string
  buyerName: string
  quantityKg: number
  requestedAt: Date
  status: 'pending' | 'approved' | 'rejected'
}