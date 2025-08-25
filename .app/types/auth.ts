export interface LoginForm {
  phoneNumber: string;
  password: string;
}

export interface RegisterForm {
  phoneNumber: string;
  email: string;
  password: string;
  role: 'buyer' | 'distributor' | 'provider';
  companyName?: string; // for distributor/provider
  businessLicenseNumber?: string; // for distributor/provider
}