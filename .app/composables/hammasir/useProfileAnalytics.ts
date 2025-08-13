import { ref, reactive, computed, readonly } from 'vue'
import { useApplicantProfileService } from './useApplicantProfileService'
import type {
  ProfileAnalytics,
  ProfileCompletionStatus,
  ProfileSectionMeta,
  HandbookSectionDisplay,
  UserProfile,
  HumanHandbook,
  ProgressSummary,
} from '~/types/hammasir'

export interface AnalyticsState {
  analytics: ProfileAnalytics | null
  completionStatus: ProfileCompletionStatus | null
  sections: ProfileSectionMeta[]
  handbook: HandbookSectionDisplay[]
  loading: boolean
  error: string | null
  lastUpdated: Date | null
}

export const useProfileAnalytics = () => {
  const {
    getMyProfile,
    getHumanHandbook,
    getProgressSummary,
  } = useApplicantProfileService()

  // State
  const state = reactive<AnalyticsState>({
    analytics: null,
    completionStatus: null,
    sections: [],
    handbook: [],
    loading: false,
    error: null,
    lastUpdated: null,
  })

  // Section definitions
  const sectionDefinitions: Omit<ProfileSectionMeta, 'completed' | 'progress' | 'locked' | 'lastUpdated'>[] = [
    {
      key: 'personalInfo',
      title: 'اطلاعات شخصی',
      description: 'نام، تماس و اطلاعات پایه',
      icon: 'ph:user',
      order: 1,
      required: true,
    },
    {
      key: 'demographics',
      title: 'اطلاعات جمعیت‌شناختی',
      description: 'تحصیلات، شغل و محل سکونت',
      icon: 'ph:graduation-cap',
      order: 2,
      required: true,
    },
    {
      key: 'preferences',
      title: 'تنظیمات',
      description: 'ارتباطات و حریم خصوصی',
      icon: 'ph:gear',
      order: 3,
      required: false,
    },
    {
      key: 'personality',
      title: 'تحلیل شخصیت',
      description: 'آزمون‌های شخصیت‌شناسی',
      icon: 'ph:brain',
      order: 4,
      required: true,
    },
    {
      key: 'values',
      title: 'ارزش‌های زندگی',
      description: 'اولویت‌ها و اهداف',
      icon: 'ph:star',
      order: 5,
      required: true,
    },
    {
      key: 'communication',
      title: 'مهارت‌های ارتباطی',
      description: 'نحوه برقراری ارتباط',
      icon: 'ph:chat-circle',
      order: 6,
      required: false,
    },
    {
      key: 'compatibility',
      title: 'سازگاری',
      description: 'آمادگی برای روابط',
      icon: 'ph:heart',
      order: 7,
      required: true,
    },
  ]

  // Computed properties
  const overallProgress = computed(() => {
    if (!state.completionStatus) return 0
    return state.completionStatus.overallPercentage
  })

  const requiredSections = computed(() => {
    return state.sections.filter(section => section.required)
  })

  const completedRequiredSections = computed(() => {
    return requiredSections.value.filter(section => section.completed).length
  })

  const nextRequiredSection = computed(() => {
    return requiredSections.value.find(section => !section.completed)
  })

  const sectionsByCompletion = computed(() => {
    return [...state.sections].sort((a, b) => {
      // Completed sections last
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1
      }
      // Then by order
      return a.order - b.order
    })
  })

  const handbookByPriority = computed(() => {
    return [...state.handbook].sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 }
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    })
  })

  // Profile analysis
  const analyzeProfile = (profile: UserProfile): ProfileCompletionStatus => {
    const sections = sectionDefinitions.map(def => 
      analyzeSection(def.key, profile)
    )

    const totalSections = sections.length
    const completedSections = sections.filter(s => s.completed).length
    const totalProgress = sections.reduce((sum, s) => sum + s.progress, 0)
    const overallPercentage = Math.round(totalProgress / totalSections)

    const missingFields = sections
      .filter(s => !s.completed && s.required)
      .flatMap(s => getMissingFields(s.key, profile))

    return {
      overallPercentage,
      sectionsCompleted: completedSections,
      totalSections,
      missingFields,
      nextRequiredSection: sections.find(s => !s.completed && s.required)?.key,
    }
  }

  const analyzeSection = (sectionKey: string, profile: UserProfile): ProfileSectionMeta => {
    const definition = sectionDefinitions.find(d => d.key === sectionKey)!
    let progress = 0
    let completed = false
    let locked = false
    let lockedReason: string | undefined

    switch (sectionKey) {
      case 'personalInfo':
        progress = calculatePersonalInfoProgress(profile.personalInfo)
        completed = progress >= 100
        break

      case 'demographics':
        progress = calculateDemographicsProgress(profile.demographics)
        completed = progress >= 70 // At least 70% to be considered complete
        break

      case 'preferences':
        progress = 100 // Always complete as it has defaults
        completed = true
        break

      case 'personality':
        // This would depend on assessment completion
        progress = 0 // Placeholder
        completed = false
        break

      case 'values':
        // This would depend on assessment completion
        progress = 0 // Placeholder
        completed = false
        break

      case 'communication':
        // Optional section
        progress = 0 // Placeholder
        completed = false
        break

      case 'compatibility':
        // Locked until other sections are complete
        const requiredForCompatibility = ['personalInfo', 'demographics', 'personality', 'values']
        const prereqCompleted = requiredForCompatibility.every(key => {
          const section = analyzeSection(key, profile)
          return section.completed
        })
        
        if (!prereqCompleted) {
          locked = true
          lockedReason = 'ابتدا بخش‌های مورد نیاز را تکمیل کنید'
          progress = 0
        } else {
          progress = 0 // Placeholder for assessment
        }
        completed = false
        break
    }

    return {
      ...definition,
      completed,
      progress: Math.round(progress),
      locked,
      lockedReason,
      lastUpdated: profile.updatedAt,
    }
  }

  const calculatePersonalInfoProgress = (personalInfo: any): number => {
    const requiredFields = ['firstName', 'lastName', 'email', 'phoneNumber', 'dateOfBirth', 'gender']
    const completedFields = requiredFields.filter(field => {
      const value = personalInfo[field]
      return value && value.toString().trim() !== ''
    })

    return (completedFields.length / requiredFields.length) * 100
  }

  const calculateDemographicsProgress = (demographics: any): number => {
    let score = 0
    
    // Education (33.33%)
    if (demographics.education && demographics.education.length > 0) {
      const validEducation = demographics.education.filter((edu: any) => 
        edu.institutionName && edu.degree && edu.fieldOfStudy
      )
      if (validEducation.length > 0) score += 33.33
    }

    // Occupation (33.33%)
    if (demographics.occupation && demographics.occupation.length > 0) {
      const validOccupation = demographics.occupation.filter((occ: any) => 
        occ.currentPosition && occ.companyName
      )
      if (validOccupation.length > 0) score += 33.33
    }

    // Location (33.33%)
    if (demographics.location && demographics.location.length > 0) {
      const validLocation = demographics.location.filter((loc: any) => 
        loc.city && loc.country
      )
      if (validLocation.length > 0) score += 33.33
    }

    return score
  }

  const getMissingFields = (sectionKey: string, profile: UserProfile): string[] => {
    const missing: string[] = []

    switch (sectionKey) {
      case 'personalInfo':
        const requiredPersonal = ['firstName', 'lastName', 'email', 'phoneNumber', 'dateOfBirth', 'gender']
        requiredPersonal.forEach(field => {
          const value = profile.personalInfo[field as keyof typeof profile.personalInfo]
          if (!value || value.toString().trim() === '') {
            missing.push(`personalInfo.${field}`)
          }
        })
        break

      case 'demographics':
        if (!profile.demographics.education?.length) {
          missing.push('demographics.education')
        }
        if (!profile.demographics.occupation?.length) {
          missing.push('demographics.occupation')
        }
        if (!profile.demographics.location?.length) {
          missing.push('demographics.location')
        }
        break
    }

    return missing
  }

  // Transform handbook data for display
  const transformHandbookForDisplay = (handbook: HumanHandbook): HandbookSectionDisplay[] => {
    return handbook.sections.map(section => ({
      id: section.id,
      title: section.title,
      analysisType: section.analysisType,
      source: {
        type: section.source.type,
        name: getSourceName(section.source.type),
        completedAt: section.source.analysisDate,
      },
      summary: generateSectionSummary(section.analysis),
      keyInsights: extractKeyInsights(section.analysis),
      recommendations: extractRecommendations(section.analysis),
      visualizations: generateVisualizations(section.analysis),
      lastUpdated: section.createdAt,
      priority: calculatePriority(section.analysis),
    }))
  }

  const getSourceName = (sourceType: string): string => {
    const names: Record<string, string> = {
      'QUESTIONNAIRE': 'پرسش‌نامه',
      'EDUCATION': 'تحلیل تحصیلی',
      'COUNSELING': 'جلسه مشاوره',
    }
    return names[sourceType] || sourceType
  }

  const generateSectionSummary = (analysis: any): string => {
    // This would be based on the actual analysis structure
    return 'خلاصه تحلیل موجود نیست'
  }

  const extractKeyInsights = (analysis: any): string[] => {
    if (!analysis?.insights) return []
    return analysis.insights.map((insight: any) => insight.title || insight.description)
  }

  const extractRecommendations = (analysis: any): string[] => {
    if (!analysis?.recommendations) return []
    return analysis.recommendations.map((rec: any) => rec.title || rec.description)
  }

  const generateVisualizations = (analysis: any): HandbookSectionDisplay['visualizations'] => {
    // This would generate chart data based on analysis
    return []
  }

  const calculatePriority = (analysis: any): 'high' | 'medium' | 'low' => {
    // This would be based on analysis scores and recommendations
    return 'medium'
  }

  // Data loading
  const loadAnalytics = async (userId?: string): Promise<void> => {
    state.loading = true
    state.error = null

    try {
      // REAL ANALYTICS LOADING - COMMENTED OUT
      // const profileService = getMyProfile()
      // const profile = profileService.profile.value
      
      // MOCK DATA - TEMPORARY
      const profile = {
        personalInfo: {
          firstName: 'علی',
          lastName: 'احمدی',
          email: 'ali@example.com',
          phoneNumber: '09123456789',
          dateOfBirth: '1990-05-15',
          gender: 'MALE'
        },
        demographics: {
          education: [{ institutionName: 'دانشگاه تهران', degree: 'کارشناسی ارشد' }],
          occupation: [{ currentPosition: 'توسعه‌دهنده', companyName: 'شرکت فناوری' }],
          location: [{ city: 'تهران', country: 'ایران' }]
        },
        status: 'VERIFIED'
      }
      
      if (profile) {
        // Analyze completion status - create simplified structure for pages
        const personalInfoPercentage = calculatePersonalInfoProgress(profile.personalInfo)
        const educationPercentage = profile.demographics.education?.length > 0 ? 80 : 0
        const occupationPercentage = profile.demographics.occupation?.length > 0 ? 80 : 0
        const locationPercentage = profile.demographics.location?.length > 0 ? 100 : 0
        const preferencesPercentage = 100 // Always consider complete

        const overallPercentage = Math.round(
          (personalInfoPercentage + educationPercentage + occupationPercentage + locationPercentage + preferencesPercentage) / 5
        )

        // Create completion status for pages
        state.completionStatus = {
          overallPercentage,
          personalInfo: { percentage: personalInfoPercentage, isRequired: true },
          education: { percentage: educationPercentage, isRequired: true },
          occupation: { percentage: occupationPercentage, isRequired: true },
          location: { percentage: locationPercentage, isRequired: false },
          preferences: { percentage: preferencesPercentage, isRequired: true }
        }

        // Create analytics for pages
        state.analytics = {
          overallScore: overallPercentage / 100,
          completionLevel: overallPercentage,
          matchingPotential: Math.min(100, overallPercentage + (profile.status === 'VERIFIED' ? 15 : 0)),
          sectionsAnalyzed: [personalInfoPercentage, educationPercentage, occupationPercentage, locationPercentage].filter(p => p > 0).length,
          recommendationsCount: [personalInfoPercentage, educationPercentage, occupationPercentage].filter(p => p < 100).length,
          dataQualityScore: calculateDataQuality(profile),
          sectionBreakdown: {
            personalInfo: personalInfoPercentage,
            education: educationPercentage,
            occupation: occupationPercentage,
            location: locationPercentage,
            preferences: preferencesPercentage
          }
        }
        
        // Analyze original sections
        state.sections = sectionDefinitions.map(def => analyzeSection(def.key, profile))

        // REAL HANDBOOK LOADING - COMMENTED OUT
        // try {
        //   const handbook = await getHumanHandbook(profile.userId)
        //   state.handbook = transformHandbookForDisplay(handbook)
        // } catch (handbookError) {
        //   console.warn('Handbook not available:', handbookError)
        //   state.handbook = []
        // }
        
        // MOCK HANDBOOK - TEMPORARY
        state.handbook = []
      }

      state.lastUpdated = new Date()
    } catch (error: any) {
      state.error = error.message || 'خطا در بارگذاری تحلیل‌ها'
      throw error
    } finally {
      state.loading = false
    }
  }

  // Helper function to calculate data quality
  const calculateDataQuality = (profile: any): number => {
    let score = 0.5
    if (profile.personalInfo.firstName?.length > 2) score += 0.1
    if (profile.personalInfo.email?.includes('@')) score += 0.1
    if (profile.personalInfo.phoneNumber?.length >= 10) score += 0.1
    if (profile.demographics.education?.length > 0) score += 0.1
    if (profile.demographics.occupation?.length > 0) score += 0.1
    if (profile.personalInfo.profilePicture) score += 0.1
    return Math.min(1, score)
  }

  const generateAnalytics = (profile: UserProfile): ProfileAnalytics => {
    // This would generate comprehensive analytics
    // For now, return a basic structure
    return {
      completionHistory: [
        { date: profile.updatedAt, percentage: overallProgress.value, sectionsCompleted: completedRequiredSections.value }
      ],
      assessmentScores: [],
      growthMetrics: {
        personalGrowth: 0,
        relationshipSkills: 0,
        emotionalMaturity: 0,
        lifeSkills: 0,
        overallReadiness: overallProgress.value,
      },
      improvementAreas: [],
    }
  }

  const refreshAnalytics = async (): Promise<void> => {
    await loadAnalytics()
  }

  // Progress tracking
  const trackSectionCompletion = (sectionKey: string): void => {
    const section = state.sections.find(s => s.key === sectionKey)
    if (section) {
      section.completed = true
      section.progress = 100
      section.lastUpdated = new Date().toISOString()
    }

    // Recalculate overall progress
    if (state.completionStatus) {
      const completedCount = state.sections.filter(s => s.completed).length
      state.completionStatus.sectionsCompleted = completedCount
      
      const totalProgress = state.sections.reduce((sum, s) => sum + s.progress, 0)
      state.completionStatus.overallPercentage = Math.round(totalProgress / state.sections.length)
    }
  }

  const getSectionProgress = (sectionKey: string): number => {
    const section = state.sections.find(s => s.key === sectionKey)
    return section?.progress || 0
  }

  const isSectionLocked = (sectionKey: string): boolean => {
    const section = state.sections.find(s => s.key === sectionKey)
    return section?.locked || false
  }

  const getSectionLockReason = (sectionKey: string): string | undefined => {
    const section = state.sections.find(s => s.key === sectionKey)
    return section?.lockedReason
  }

  return {
    // State
    state: readonly(state),

    // Computed
    overallProgress,
    requiredSections,
    completedRequiredSections,
    nextRequiredSection,
    sectionsByCompletion,
    handbookByPriority,

    // Methods
    loadAnalytics,
    refreshAnalytics,
    analyzeProfile,
    analyzeSection,
    trackSectionCompletion,
    getSectionProgress,
    isSectionLocked,
    getSectionLockReason,
  }
}