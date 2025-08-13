import type { UserProfile, PersonalInfo, EducationInfo, OccupationInfo, LocationInfo } from '~/composables/hammasir/useApplicantProfileService'

// Form validation states
export interface FormValidation {
  isValid: boolean
  errors: Record<string, string[]>
  touched: Record<string, boolean>
}

// Form section states
export interface FormSection {
  id: string
  title: string
  description?: string
  completed: boolean
  required: boolean
  locked?: boolean
  progress: number
}

// Personal Information Form
export interface PersonalInfoFormData extends Omit<PersonalInfo, 'id'> {
  profilePictureFile?: File
  confirmEmail?: string
}

export interface PersonalInfoFormErrors {
  firstName?: string[]
  lastName?: string[]
  email?: string[]
  confirmEmail?: string[]
  phoneNumber?: string[]
  dateOfBirth?: string[]
  gender?: string[]
  profilePicture?: string[]
}

// Education Form
export interface EducationFormData extends Omit<EducationInfo, 'id'> {
  tempId?: string // For new entries
}

export interface EducationFormErrors {
  institutionName?: string[]
  degree?: string[]
  fieldOfStudy?: string[]
  educationLevel?: string[]
  startDate?: string[]
  endDate?: string[]
}

// Occupation Form
export interface OccupationFormData extends Omit<OccupationInfo, 'id'> {
  tempId?: string // For new entries
}

export interface OccupationFormErrors {
  currentPosition?: string[]
  companyName?: string[]
  industry?: string[]
  employmentType?: string[]
  startDate?: string[]
  endDate?: string[]
}

// Location Form
export interface LocationFormData extends Omit<LocationInfo, 'id'> {
  tempId?: string // For new entries
}

export interface LocationFormErrors {
  city?: string[]
  state?: string[]
  country?: string[]
}

// Demographics Form (combines education, occupation, location)
export interface DemographicsFormData {
  education: EducationFormData[]
  occupation: OccupationFormData[]
  location: LocationFormData[]
}

export interface DemographicsFormErrors {
  education?: Record<string, EducationFormErrors>
  occupation?: Record<string, OccupationFormErrors>
  location?: Record<string, LocationFormErrors>
}

// Preferences Form
export interface PreferencesFormData {
  communication: {
    email: boolean
    sms: boolean
  }
  privacy: {
    isProfileVisibleToCounselors: boolean
    isProfileVisibleToOtherUsers: boolean
    allowDataAnalysisForMatching: boolean
  }
}

export interface PreferencesFormErrors {
  communication?: Record<string, string[]>
  privacy?: Record<string, string[]>
}

// Complete Profile Form
export interface ProfileFormData {
  personalInfo: PersonalInfoFormData
  demographics: DemographicsFormData
  preferences: PreferencesFormData
}

export interface ProfileFormErrors {
  personalInfo?: PersonalInfoFormErrors
  demographics?: DemographicsFormErrors
  preferences?: PreferencesFormErrors
}

// Form state management
export interface ProfileFormState {
  data: ProfileFormData
  errors: ProfileFormErrors
  touched: Record<string, boolean>
  loading: boolean
  saving: boolean
  isDirty: boolean
  currentSection: string
  sections: FormSection[]
}

// Validation rules
export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: any) => string | null
}

export interface ValidationRules {
  [fieldName: string]: ValidationRule
}

// Form submission result
export interface FormSubmissionResult {
  success: boolean
  data?: UserProfile
  errors?: ProfileFormErrors
  message?: string
}

// Auto-save state
export interface AutoSaveState {
  enabled: boolean
  interval: number
  lastSaved: Date | null
  pendingChanges: boolean
}

// Form wizard state
export interface FormWizardState {
  currentStep: number
  totalSteps: number
  canGoNext: boolean
  canGoPrevious: boolean
  stepValidation: Record<number, boolean>
}