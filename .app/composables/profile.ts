export interface PersonalInfo {
  id?: string
  firstName?: string
  lastName?: string
  email?: string
  phoneNumber?: string
  dateOfBirth?: string
  gender?: 'MALE' | 'FEMALE'
  profilePicture?: string
}

export interface EducationInfo {
  id?: string
  institution?: string
  degree?: string
  field?: string
  startDate?: string
  endDate?: string
  isCurrentlyEnrolled?: boolean
}

export interface OccupationInfo {
  id?: string
  company?: string
  position?: string
  startDate?: string
  endDate?: string
  isCurrentJob?: boolean
}

export interface LocationInfo {
  id?: string
  city?: string
  state?: string
  country?: string
  isPrimary?: boolean
}

export interface Demographics {
  id?: string
  education?: EducationInfo[]
  occupation?: OccupationInfo[]
  location?: LocationInfo[]
}

export interface CommunicationPreferences {
  email?: boolean
  sms?: boolean
}

export interface Preferences {
  id?: string
  communication?: CommunicationPreferences
}

export interface PrivacySettings {
  id?: string
  isProfileVisibleToCounselors?: boolean
  isProfileVisibleToOtherUsers?: boolean
  allowDataAnalysisForMatching?: boolean
}

export interface UserProfile {
  id?: string
  userId?: string
  personalInfo?: PersonalInfo
  demographics?: Demographics
  preferences?: Preferences
  privacySettings?: PrivacySettings
  status?: 'ACTIVE' | 'PENDING_VERIFICATION' | 'SUSPENDED' | 'DEACTIVATED'
  createdAt?: string
  updatedAt?: string
}

export interface HandbookSection {
  id?: string
  title?: string
  content?: string
  order?: number
}

export interface HumanHandbook {
  id?: string
  userId?: string
  sections?: HandbookSection[]
  lastUpdated?: string
  version?: number
}

export interface ProgressSummary {
  userId?: string
  overallProgress?: number
  lastUpdated?: string
}

export interface ProfileListParams {
  page?: number
  size?: number
  sort?: string
  status?: 'ACTIVE' | 'PENDING_VERIFICATION' | 'SUSPENDED' | 'DEACTIVATED'
  name?: string
}

export function useProfile() {
  const { $fetch } = useNuxtApp()

  const getMyProfile = async (): Promise<UserProfile> => {
    return await $fetch('/api/v1/profile/me')
  }

  const updateMyProfile = async (profile: UserProfile): Promise<UserProfile> => {
    return await $fetch('/api/v1/profile/me', {
      method: 'PUT',
      body: profile
    })
  }

  const getProfiles = async (params?: ProfileListParams): Promise<UserProfile[]> => {
    const query = new URLSearchParams()
    if (params?.page) query.set('page', params.page.toString())
    if (params?.size) query.set('size', params.size.toString())
    if (params?.sort) query.set('sort', params.sort)
    if (params?.status) query.set('status', params.status)
    if (params?.name) query.set('name', params.name)
    
    const url = `/api/v1/profiles${query.toString() ? '?' + query.toString() : ''}`
    return await $fetch(url)
  }

  const getProfileByUserId = async (userId: string): Promise<UserProfile> => {
    return await $fetch(`/api/v1/profiles/${userId}`)
  }

  const updateUserProfile = async (userId: string, profile: UserProfile): Promise<UserProfile> => {
    return await $fetch(`/api/v1/profiles/${userId}`, {
      method: 'PUT',
      body: profile
    })
  }

  const updateUserStatus = async (userId: string, status: UserProfile['status']): Promise<UserProfile> => {
    return await $fetch(`/api/v1/profiles/${userId}/status`, {
      method: 'PATCH',
      body: { status }
    })
  }

  const getHumanHandbook = async (userId: string): Promise<HumanHandbook> => {
    return await $fetch(`/api/v1/profiles/${userId}/handbook`)
  }

  const updateHumanHandbook = async (userId: string, handbook: HumanHandbook): Promise<HumanHandbook> => {
    return await $fetch(`/api/v1/profiles/${userId}/handbook`, {
      method: 'PUT',
      body: handbook
    })
  }

  const getProgressSummary = async (userId: string): Promise<ProgressSummary> => {
    return await $fetch(`/api/v1/profiles/${userId}/progress-summary`)
  }

  return {
    getMyProfile,
    updateMyProfile,
    getProfiles,
    getProfileByUserId,
    updateUserProfile,
    updateUserStatus,
    getHumanHandbook,
    updateHumanHandbook,
    getProgressSummary,
  }
}
  