export type TeamMemberRole =
  | 'reader'
  | 'collaborator'
  | 'manager'
  | 'owner'
  | undefined

export type ProjectType = 'design' | 'development' | 'marketing' | undefined

export interface Customer {
  name?: string
  logo?: string
  location?: string
}

export interface Tool {
  name: string
  logo: string
  description: string
}

export interface TeamMember {
  name: string
  picture: string
  role: TeamMemberRole
}

export interface Project {
  type?: ProjectType
  name?: string
  description?: string
  startDate?: string
  endDate?: string
  customer?: Customer
  budget?: string
  team?: TeamMember[]
  files: FileList | null
  avatar?: File | null
  tools?: Tool[]
}

export interface ProjectStepData {
  preview?: boolean
  name: string
  title: string
  subtitle: string
}

export interface StepData {
  name: string
  title: string
  subtitle?: string
}

export interface PaymentSend {
  recipient: {
    name: string
    picture?: string
    address: {
      lineOne: string
      lineTwo?: string
      city: string
      postalCode: string
      state: string
      country: string
    }
  }
  amount: number
  account: {
    id: number | undefined
    type: string
    label: string
    number: string
    balance: number
  } | null
  routingNumber: string
  prefix: string
  method: string | null
}

export interface PaymentReceive {
  method: 'bank_transfer' | 'payment_link' | 'wire' | null
  amount: number
  account: {
    id: number | undefined
    type: string
    label: string
    number: string
    balance: number
  } | null
  email?: string
}

export interface Invite {
  firstName: string
  lastName: string
  email: string
  role: string | null
}
export type TeamMemberRole =
  | 'reader'
  | 'collaborator'
  | 'manager'
  | 'owner'
  | undefined

export type ProjectType = 'design' | 'development' | 'marketing' | undefined

export interface Customer {
  name?: string
  logo?: string
  location?: string
}

export interface Tool {
  name: string
  logo: string
  description: string
}

export interface TeamMember {
  name: string
  picture: string
  role: TeamMemberRole
}

export interface Project {
  type?: ProjectType
  name?: string
  description?: string
  startDate?: string
  endDate?: string
  customer?: Customer
  budget?: string
  team?: TeamMember[]
  files: FileList | null
  avatar?: File | null
  tools?: Tool[]
}

export interface ProjectStepData {
  preview?: boolean
  name: string
  title: string
  subtitle: string
}

export interface StepData {
  name: string
  title: string
  subtitle?: string
}

export interface PaymentSend {
  recipient: {
    name: string
    picture?: string
    address: {
      lineOne: string
      lineTwo?: string
      city: string
      postalCode: string
      state: string
      country: string
    }
  }
  amount: number
  account: {
    id: number | undefined
    type: string
    label: string
    number: string
    balance: number
  } | null
  routingNumber: string
  prefix: string
  method: string | null
}

export interface PaymentReceive {
  method: 'bank_transfer' | 'payment_link' | 'wire' | null
  amount: number
  account: {
    id: number | undefined
    type: string
    label: string
    number: string
    balance: number
  } | null
  email?: string
}

export interface Invite {
  name: string
  email: string
  role: [] | null
  gender: string
  age: number
  maritalStatus: string
  jobStatus: string
  description: string
}
export interface PsychoReg {
  // Step 1: Personal Information
  firstName: string
  lastName: string
  gender: string
  age: number
  phoneNumber: string
  email: string
  maritalStatus: string
  
  // Step 2: Professional Information  
  licenseStatus: string
  educationLevel: string
  specialization: string[]
  yearsOfExperience: number
  workplace: string
  
  // Step 3: Expertise & Qualifications
  therapyApproaches: string[]
  targetAgeGroups: string[]
  languages: string[]
  certifications: string[]
  
  // Step 4: Availability & Preferences
  availableDays: string[]
  workingHours: {
    start: string
    end: string
  }
  sessionTypes: string[]
  onlineConsultation: boolean
  
  // Step 5: Documents & Agreement
  profilePhoto?: File | null
  licenseDocument?: File | null
  cvDocument?: File | null
  agreementAccepted: boolean
  privacyPolicyAccepted: boolean
}

export interface Clinic {
  id: string
  name: string
  address: string
  phone: string
  email: string
  license: string
  description?: string
  owner: string
  created: string
  updated: string
  status: 'active' | 'inactive' | 'pending' | 'banned' | 'verified'
  verificationStatus: 'pending' | 'approved' | 'rejected' | 'under_review'
  verificationNotes?: string
  verifiedBy?: string
  verifiedAt?: string
  bannedReason?: string
  bannedBy?: string
  bannedAt?: string
}

export interface ClinicPsychologist {
  id: string
  clinic: string
  psychologist: string
  role: 'owner' | 'member'
  created: string
  updated: string
  status: 'active' | 'inactive'
}

export interface ClinicRegistration {
  name: string
  address: string
  phone: string
  email: string
  license: string
  description?: string
  logo?: File | null
  owner?: string // For admin use - user ID
  ownerFirstName: string
  ownerLastName: string
  ownerEmail: string
  ownerPhone: string
}
