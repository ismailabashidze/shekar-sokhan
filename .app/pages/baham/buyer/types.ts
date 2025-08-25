export interface Product {
  id: string;
  name: string;
  category: string;
  description?: string;
}

export interface Load {
  id: string;
  providerId: string;
  product: Product;
  totalQuantityKg: number;
  availableQuantityKg: number;
  pricePerKg: number;
  status: 'active' | 'completed' | 'expired';
  availabilityDate: Date;
  expiryDate: Date;
}

export interface Order {
  id: string;
  buyerId: string;
  loadId: string;
  distributorId?: string;
  quantityKg: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  deliveryMethod: 'pickup_from_distributor' | 'direct_delivery';
  deliveryAddress?: Address;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  id: string;
  title: string;
  addressLine: string;
  city: string;
  isDefault: boolean;
}

export interface Distributor {
  id: string;
  companyName: string;
  serviceArea: string;
  contactInfo: string;
}

export interface Ticket {
  id: string;
  subject: string;
  status: 'open' | 'in_progress' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
}