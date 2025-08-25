export interface User {
  id: string;
  nationalCode: string;
  phoneNumber: string;
  email: string;
  role: 'buyer' | 'distributor' | 'provider' | 'admin';
  isVerified: boolean;
  createdAt: Date;
}

export interface AdminUser extends User {
  orderCount: number;
  lastActivity: Date;
}

export interface SystemFinancial {
  totalCommission: number;
  pendingSettlements: number;
  completedSettlements: number;
}