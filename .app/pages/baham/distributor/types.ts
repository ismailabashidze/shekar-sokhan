// Interfaces for Distributor Dashboard

export interface DistributorOrder {
  id: string
  buyerName: string
  buyerPhone: string
  quantity_kg: number
  total_price: number
  status: 'pending' | 'confirmed_by_provider' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled'
  delivery_method: 'pickup_from_distributor' | 'direct_delivery'
  delivery_address?: string
  loadDetails: Load
}

export interface Load {
  productName: string
}

export interface ServiceArea {
  id: string
  name: string
  polygonCoordinates: [number, number][]
  capacity: number
}

export interface AssignedLoad {
  loadId: string
  productName: string
  totalQuantity: number
  assignedQuantity: number
  expectedDeliveryDate: string // In Persian calendar format
}

export interface FinancialReport {
  period: string
  totalSales: number
  totalCommission: number
  netIncome: number
}

export interface BusinessProfile {
  companyName: string
  description: string
  licenseNumber: string
  capacity: number
  serviceArea: string
  rating: number
  reviews: number
  services: string[]
}

export interface PerformanceMetrics {
  ordersCompleted: number
  onTimeDelivery: number // Percentage
  customerSatisfaction: number // Percentage
}

export interface Review {
  id: string
  customerName: string
  rating: number
  comment: string
  date: string // In Persian calendar format
}

export interface NotificationSetting {
  id: string
  title: string
  description: string
  enabled: boolean
}

export interface AccountSettings {
  phone: string
  email: string
}

export interface SettlementRequest {
  id: string
  date: string // In Persian calendar format
  amount: number
  status: 'pending' | 'paid' | 'rejected'
  description: string
}