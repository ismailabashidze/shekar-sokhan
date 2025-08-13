import { ref, readonly } from 'vue'

// Types based on OpenAPI specification
export interface Gender {
  MALE: 'MALE'
  FEMALE: 'FEMALE'
}

export type GenderType = 'MALE' | 'FEMALE'

export type UserStatusType = 'ACTIVE' | 'PENDING_VERIFICATION' | 'SUSPENDED' | 'DEACTIVATED'

export type EducationLevelType = 'HIGH_SCHOOL' | 'BACHELOR' | 'MASTER' | 'PHD' | 'VOCATIONAL' | 'OTHER'

export type EmploymentType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'FREELANCE' | 'INTERNSHIP'

export type AnalysisSourceType = 'QUESTIONNAIRE' | 'EDUCATION' | 'COUNSELING'

export interface PersonalInfo {
  id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  dateOfBirth: string
  gender: GenderType
  profilePicture?: string
}

export interface EducationInfo {
  id: string
  institutionName: string
  degree: string
  fieldOfStudy: string
  educationLevel: EducationLevelType
  startDate: string
  endDate?: string
  isCurrent: boolean
  isGraduated: boolean
}

export interface OccupationInfo {
  id: string
  currentPosition: string
  companyName: string
  industry: string
  employmentType: EmploymentType
  startDate: string
  endDate?: string
  isCurrentJob: boolean
}

export interface LocationInfo {
  id: string
  city: string
  state: string
  country: string
  isCurrent: boolean
}

export interface Demographics {
  education: EducationInfo[]
  occupation: OccupationInfo[]
  location: LocationInfo[]
}

export interface CommunicationPreferences {
  email: boolean
  sms: boolean
}

export interface PrivacySettings {
  isProfileVisibleToCounselors: boolean
  isProfileVisibleToOtherUsers: boolean
  allowDataAnalysisForMatching: boolean
}

export interface Preferences {
  communication: CommunicationPreferences
  privacy: PrivacySettings
}

export interface HandbookSection {
  id: string
  title: string
  analysisType: string
  source: AnalysisSource
  analysis: any
  createdAt: string
}

export interface HumanHandbook {
  id: string
  userId: string
  sections: HandbookSection[]
  createdAt: string
  updatedAt: string
}

export interface ProgressSummary {
  userId: string
  sectionsCompleted: number
  totalSections: number
  overallProgress: number
  lastUpdated: string
}

export interface UserProfile {
  id: string
  userId: string
  personalInfo: PersonalInfo
  demographics: Demographics
  preferences: Preferences
  privacySettings: PrivacySettings
  status: UserStatusType
  createdAt: string
  updatedAt: string
}

export interface AnalysisSource {
  type: AnalysisSourceType
  sourceId: string
  analysisDate: string
}

export interface HandbookSection {
  id: string
  title: string
  analysisType: string
  source: AnalysisSource
  analysis: any // Analysis type from shared schemas
  createdAt: string
}

export interface HumanHandbook {
  id: string
  userId: string
  sections: HandbookSection[]
  lastUpdated: string
  version: number
}

export interface ProgressSummary {
  userId: string
  overallProgress: number
  lastUpdated: string
}

export interface ErrorResponse {
  timestamp: string
  status: number
  error: string
  message: string
  path: string
}

export interface ListUsersParams {
  page?: number
  size?: number
  sort?: string
  status?: UserStatusType
  name?: string
}

// Composable implementation
export const useApplicantProfileService = () => {
  const baseUrl = '/api/v1'

  // Helper function to handle API calls
  const apiCall = async <T>(
    endpoint: string, 
    options: any = {}
  ): Promise<T> => {
    try {
      const response = await $fetch<T>(`${baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      })
      return response
    } catch (error) {
      console.error(`API Error at ${endpoint}:`, error)
      throw error
    }
  }

  // Get current user's profile with reactive state
  const getMyProfile = () => {
    const profile = ref<UserProfile | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    // Mock data
    const mockProfile: UserProfile = {
      id: 'mock-profile-1',
      userId: 'mock-user-1',
      personalInfo: {
        id: 'personal-1',
        firstName: 'علی',
        lastName: 'احمدی',
        email: 'ali.ahmadi@example.com',
        phoneNumber: '09123456789',
        dateOfBirth: '1990-05-15',
        gender: 'MALE',
        profilePicture: 'https://ui-avatars.com/api/?name=علی+احمدی&background=4F46E5&color=fff&size=200'
      },
      demographics: {
        education: [
          {
            id: 'edu-1',
            institutionName: 'دانشگاه تهران',
            degree: 'کارشناسی ارشد',
            fieldOfStudy: 'مهندسی کامپیوتر',
            educationLevel: 'MASTER',
            startDate: '2010-09-01',
            endDate: '2012-06-30',
            isCurrent: false,
            isGraduated: true
          }
        ],
        occupation: [
          {
            id: 'occ-1',
            currentPosition: 'توسعه‌دهنده نرم‌افزار',
            companyName: 'شرکت فناوری پارس',
            industry: 'فناوری اطلاعات',
            employmentType: 'FULL_TIME',
            startDate: '2020-01-01',
            endDate: '',
            isCurrentJob: true
          }
        ],
        location: [
          {
            id: 'loc-1',
            city: 'تهران',
            state: 'تهران',
            country: 'ایران',
            isCurrent: true
          }
        ]
      },
      preferences: {
        communication: {
          email: true,
          sms: false
        },
        privacy: {
          isProfileVisibleToCounselors: true,
          isProfileVisibleToOtherUsers: false,
          allowDataAnalysisForMatching: true
        }
      },
      privacySettings: {
        isProfileVisibleToCounselors: true,
        isProfileVisibleToOtherUsers: false,
        allowDataAnalysisForMatching: true
      },
      status: 'ACTIVE',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-08-13T10:30:00Z'
    }

    const fetchProfile = async (): Promise<UserProfile> => {
      loading.value = true
      error.value = null
      try {
        // REAL API CALL - COMMENTED OUT
        // const result = await apiCall<UserProfile>('/profile/me', {
        //   method: 'GET',
        // })
        // profile.value = result
        // return result
        
        // MOCK DATA - TEMPORARY
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500))
        profile.value = mockProfile
        return mockProfile
      } catch (err: any) {
        error.value = err.message || 'خطا در بارگذاری پروفایل'
        throw err
      } finally {
        loading.value = false
      }
    }

    const refresh = async () => {
      await fetchProfile()
    }

    // Auto-fetch on creation
    fetchProfile()

    return {
      profile: readonly(profile),
      loading: readonly(loading),
      error: readonly(error),
      refresh
    }
  }

  // Update current user's profile completely
  const updateMyProfile = async (profile: UserProfile): Promise<UserProfile> => {
    // REAL API CALL - COMMENTED OUT
    // return apiCall<UserProfile>('/profile/me', {
    //   method: 'PUT',
    //   body: JSON.stringify(profile),
    // })
    
    // MOCK DATA - TEMPORARY
    await new Promise(resolve => setTimeout(resolve, 300))
    console.log('Mock: Updating profile', profile)
    return profile
  }

  // List users (Admin/Counselor only)
  const listUsers = async (params: ListUsersParams = {}): Promise<UserProfile[]> => {
    const searchParams = new URLSearchParams()
    
    if (params.page !== undefined) searchParams.append('page', params.page.toString())
    if (params.size !== undefined) searchParams.append('size', params.size.toString())
    if (params.sort) searchParams.append('sort', params.sort)
    if (params.status) searchParams.append('status', params.status)
    if (params.name) searchParams.append('name', params.name)

    const queryString = searchParams.toString()
    const endpoint = queryString ? `/profiles?${queryString}` : '/profiles'

    return apiCall<UserProfile[]>(endpoint, {
      method: 'GET',
    })
  }

  // Get profile by user ID
  const getProfileByUserId = async (userId: string): Promise<UserProfile> => {
    return apiCall<UserProfile>(`/profiles/${userId}`, {
      method: 'GET',
    })
  }

  // Update user profile (Admin/User only)
  const updateUserProfile = async (userId: string, profile: UserProfile): Promise<UserProfile> => {
    return apiCall<UserProfile>(`/profiles/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(profile),
    })
  }

  // Update user status (Admin only)
  const updateUserStatus = async (userId: string, status: UserStatusType): Promise<UserProfile> => {
    return apiCall<UserProfile>(`/profiles/${userId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })
  }

  // Get human handbook
  const getHumanHandbook = async (userId: string): Promise<HumanHandbook> => {
    // REAL API CALL - COMMENTED OUT
    // return apiCall<HumanHandbook>(`/profiles/${userId}/handbook`, {
    //   method: 'GET',
    // })
    
    // MOCK DATA - TEMPORARY
    await new Promise(resolve => setTimeout(resolve, 200))
    return {
      id: 'handbook-1',
      userId,
      sections: [
        {
          id: 'section-1',
          title: 'تحلیل شخصیت',
          analysisType: 'personality',
          source: {
            type: 'QUESTIONNAIRE',
            sourceId: 'quest-1',
            analysisDate: '2024-08-01T00:00:00Z'
          },
          analysis: { score: 85, traits: ['responsible', 'organized'] },
          createdAt: '2024-08-01T00:00:00Z'
        }
      ],
      createdAt: '2024-08-01T00:00:00Z',
      updatedAt: '2024-08-13T00:00:00Z'
    }
  }

  // Update human handbook
  const updateHumanHandbook = async (userId: string, handbook: HumanHandbook): Promise<HumanHandbook> => {
    return apiCall<HumanHandbook>(`/profiles/${userId}/handbook`, {
      method: 'PUT',
      body: JSON.stringify(handbook),
    })
  }

  // Get progress summary
  const getProgressSummary = async (userId: string): Promise<ProgressSummary> => {
    // REAL API CALL - COMMENTED OUT
    // return apiCall<ProgressSummary>(`/profiles/${userId}/progress-summary`, {
    //   method: 'GET',
    // })
    
    // MOCK DATA - TEMPORARY
    await new Promise(resolve => setTimeout(resolve, 150))
    return {
      userId,
      sectionsCompleted: 4,
      totalSections: 5,
      overallProgress: 80,
      lastUpdated: '2024-08-13T10:30:00Z'
    }
  }

  // Sync with Keycloak (Internal/Admin only)
  const syncWithKeycloak = async (userId: string): Promise<void> => {
    return apiCall<void>(`/internal/profiles/${userId}/sync/keycloak`, {
      method: 'POST',
    })
  }

  return {
    // Profile operations
    getMyProfile,
    updateMyProfile,
    listUsers,
    getProfileByUserId,
    updateUserProfile,
    updateUserStatus,
    
    // Handbook operations
    getHumanHandbook,
    updateHumanHandbook,
    
    // Progress operations
    getProgressSummary,
    
    // Internal operations
    syncWithKeycloak,
  }
}

// Export types for external use
export type {
  UserProfile,
  PersonalInfo,
  Demographics,
  EducationInfo,
  OccupationInfo,
  LocationInfo,
  Preferences,
  CommunicationPreferences,
  PrivacySettings,
  HumanHandbook,
  HandbookSection,
  AnalysisSource,
  ProgressSummary,
  ErrorResponse,
  ListUsersParams,
}