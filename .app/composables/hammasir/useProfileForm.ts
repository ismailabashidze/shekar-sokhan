import { ref, reactive, computed, watch, nextTick, onUnmounted } from 'vue'
import { useApplicantProfileService } from './useApplicantProfileService'
import type {
  ProfileFormData,
  ProfileFormErrors,
  ProfileFormState,
  ValidationRule,
  ValidationRules,
  FormSubmissionResult,
  AutoSaveState,
  FormSection,
  PersonalInfoFormData,
  DemographicsFormData,
  PreferencesFormData,
  EducationFormData,
  OccupationFormData,
  LocationFormData,
} from '~/types/hammasir'
import type { UserProfile } from '~/composables/hammasir/useApplicantProfileService'

export const useProfileForm = () => {
  const { updateMyProfile } = useApplicantProfileService()
  
  // Form state
  const formState = reactive<ProfileFormState>({
    data: {
      personalInfo: {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        dateOfBirth: '',
        gender: 'MALE',
        profilePicture: '',
      },
      demographics: {
        education: [],
        occupation: [],
        location: [],
      },
      preferences: {
        communication: {
          email: true,
          sms: false,
        },
        privacy: {
          isProfileVisibleToCounselors: true,
          isProfileVisibleToOtherUsers: false,
          allowDataAnalysisForMatching: true,
        },
      },
    },
    errors: {},
    touched: {},
    loading: false,
    saving: false,
    isDirty: false,
    currentSection: 'personalInfo',
    sections: [
      {
        id: 'personalInfo',
        title: 'اطلاعات شخصی',
        description: 'اطلاعات پایه و شناسایی',
        completed: false,
        required: true,
        progress: 0,
      },
      {
        id: 'demographics',
        title: 'اطلاعات جمعیت‌شناختی',
        description: 'تحصیلات، شغل و محل سکونت',
        completed: false,
        required: true,
        progress: 0,
      },
      {
        id: 'preferences',
        title: 'تنظیمات و ترجیحات',
        description: 'ارتباطات و حریم خصوصی',
        completed: false,
        required: false,
        progress: 0,
      },
    ],
  })

  // Auto-save state
  const autoSave = reactive<AutoSaveState>({
    enabled: true,
    interval: 30000, // 30 seconds
    lastSaved: null,
    pendingChanges: false,
  })

  // Original data for dirty checking
  const originalData = ref<ProfileFormData | null>(null)

  // Validation rules
  const validationRules: ValidationRules = {
    'personalInfo.firstName': { required: true, minLength: 2, maxLength: 50 },
    'personalInfo.lastName': { required: true, minLength: 2, maxLength: 50 },
    'personalInfo.email': { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    'personalInfo.phoneNumber': { required: true, pattern: /^(\+98|0)?9\d{9}$/ },
    'personalInfo.dateOfBirth': { required: true },
    'personalInfo.gender': { required: true },
  }

  // Computed properties
  const currentSectionData = computed(() => {
    switch (formState.currentSection) {
      case 'personalInfo':
        return formState.data.personalInfo
      case 'demographics':
        return formState.data.demographics
      case 'preferences':
        return formState.data.preferences
      default:
        return null
    }
  })

  const overallProgress = computed(() => {
    const totalProgress = formState.sections.reduce((sum, section) => sum + section.progress, 0)
    return Math.round(totalProgress / formState.sections.length)
  })

  const canSubmit = computed(() => {
    const requiredSections = formState.sections.filter(s => s.required)
    return requiredSections.every(s => s.completed) && !formState.saving
  })

  const hasErrors = computed(() => {
    return Object.keys(formState.errors).length > 0
  })

  // Validation functions
  const validateField = (fieldPath: string, value: any): string[] => {
    const rule = validationRules[fieldPath]
    if (!rule) return []

    const errors: string[] = []

    if (rule.required && (!value || (typeof value === 'string' && !value.trim()))) {
      errors.push('این فیلد الزامی است')
    }

    if (value && typeof value === 'string') {
      if (rule.minLength && value.length < rule.minLength) {
        errors.push(`حداقل ${rule.minLength} کاراکتر وارد کنید`)
      }

      if (rule.maxLength && value.length > rule.maxLength) {
        errors.push(`حداکثر ${rule.maxLength} کاراکتر مجاز است`)
      }

      if (rule.pattern && !rule.pattern.test(value)) {
        if (fieldPath.includes('email')) {
          errors.push('فرمت ایمیل صحیح نیست')
        } else if (fieldPath.includes('phoneNumber')) {
          errors.push('شماره تلفن صحیح نیست')
        } else {
          errors.push('فرمت وارد شده صحیح نیست')
        }
      }
    }

    if (rule.custom) {
      const customError = rule.custom(value)
      if (customError) {
        errors.push(customError)
      }
    }

    return errors
  }

  const validateSection = (sectionId: string): boolean => {
    const errors: ProfileFormErrors = {}
    let isValid = true

    if (sectionId === 'personalInfo') {
      const personalInfo = formState.data.personalInfo
      Object.keys(personalInfo).forEach(key => {
        const fieldPath = `personalInfo.${key}`
        const fieldErrors = validateField(fieldPath, personalInfo[key as keyof PersonalInfoFormData])
        if (fieldErrors.length > 0) {
          if (!errors.personalInfo) errors.personalInfo = {}
          errors.personalInfo[key as keyof PersonalInfoFormData] = fieldErrors
          isValid = false
        }
      })
    }

    // Update section errors
    if (Object.keys(errors).length > 0) {
      formState.errors = { ...formState.errors, ...errors }
    } else {
      // Clear section errors
      if (sectionId === 'personalInfo') {
        delete formState.errors.personalInfo
      } else if (sectionId === 'demographics') {
        delete formState.errors.demographics
      } else if (sectionId === 'preferences') {
        delete formState.errors.preferences
      }
    }

    return isValid
  }

  const validateForm = (): boolean => {
    let isValid = true
    formState.sections.forEach(section => {
      if (!validateSection(section.id)) {
        isValid = false
      }
    })
    return isValid
  }

  // Form manipulation functions
  const setFieldValue = (fieldPath: string, value: any) => {
    const keys = fieldPath.split('.')
    let target: any = formState.data
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!target[keys[i]]) {
        target[keys[i]] = {}
      }
      target = target[keys[i]]
    }
    
    target[keys[keys.length - 1]] = value
    
    // Mark field as touched
    formState.touched[fieldPath] = true
    
    // Validate field
    const errors = validateField(fieldPath, value)
    if (errors.length > 0) {
      // Set field errors
      const errorPath = keys.slice(0, -1).join('.')
      if (!formState.errors[errorPath]) {
        formState.errors[errorPath] = {}
      }
      formState.errors[errorPath][keys[keys.length - 1]] = errors
    } else {
      // Clear field errors
      const errorPath = keys.slice(0, -1).join('.')
      if (formState.errors[errorPath]) {
        delete formState.errors[errorPath][keys[keys.length - 1]]
        if (Object.keys(formState.errors[errorPath]).length === 0) {
          delete formState.errors[errorPath]
        }
      }
    }
    
    // Mark as dirty and update auto-save
    markAsDirty()
  }

  const markAsDirty = () => {
    formState.isDirty = true
    autoSave.pendingChanges = true
  }

  const markAsClean = () => {
    formState.isDirty = false
    autoSave.pendingChanges = false
    autoSave.lastSaved = new Date()
  }

  // Section management
  const goToSection = (sectionId: string) => {
    formState.currentSection = sectionId
  }

  const updateSectionProgress = (sectionId: string) => {
    const section = formState.sections.find(s => s.id === sectionId)
    if (!section) return

    let progress = 0
    let completed = false

    if (sectionId === 'personalInfo') {
      const personalInfo = formState.data.personalInfo
      const requiredFields = ['firstName', 'lastName', 'email', 'phoneNumber', 'dateOfBirth', 'gender']
      const completedFields = requiredFields.filter(field => {
        const value = personalInfo[field as keyof PersonalInfoFormData]
        return value && value.toString().trim() !== ''
      })
      progress = (completedFields.length / requiredFields.length) * 100
      completed = progress === 100 && validateSection(sectionId)
    } else if (sectionId === 'demographics') {
      // Demographics has at least one entry in each category
      const { education, occupation, location } = formState.data.demographics
      let score = 0
      if (education.length > 0) score += 33.33
      if (occupation.length > 0) score += 33.33
      if (location.length > 0) score += 33.33
      progress = Math.round(score)
      completed = progress >= 66.67 // At least 2 out of 3 categories
    } else if (sectionId === 'preferences') {
      // Preferences are always completed as they have default values
      progress = 100
      completed = true
    }

    section.progress = Math.round(progress)
    section.completed = completed
  }

  // Array field management (for demographics)
  const addEducation = () => {
    const newEducation: EducationFormData = {
      tempId: `temp_${Date.now()}`,
      institutionName: '',
      degree: '',
      fieldOfStudy: '',
      educationLevel: 'BACHELOR',
      startDate: '',
      endDate: '',
      isCurrent: false,
      isGraduated: false,
    }
    formState.data.demographics.education.push(newEducation)
    markAsDirty()
  }

  const removeEducation = (index: number) => {
    formState.data.demographics.education.splice(index, 1)
    markAsDirty()
    updateSectionProgress('demographics')
  }

  const addOccupation = () => {
    const newOccupation: OccupationFormData = {
      tempId: `temp_${Date.now()}`,
      currentPosition: '',
      companyName: '',
      industry: '',
      employmentType: 'FULL_TIME',
      startDate: '',
      endDate: '',
      isCurrentJob: false,
    }
    formState.data.demographics.occupation.push(newOccupation)
    markAsDirty()
  }

  const removeOccupation = (index: number) => {
    formState.data.demographics.occupation.splice(index, 1)
    markAsDirty()
    updateSectionProgress('demographics')
  }

  const addLocation = () => {
    const newLocation: LocationFormData = {
      tempId: `temp_${Date.now()}`,
      city: '',
      state: '',
      country: 'ایران',
      isCurrent: false,
    }
    formState.data.demographics.location.push(newLocation)
    markAsDirty()
  }

  const removeLocation = (index: number) => {
    formState.data.demographics.location.splice(index, 1)
    markAsDirty()
    updateSectionProgress('demographics')
  }

  // Data loading and saving
  const loadProfile = async (profile: UserProfile) => {
    formState.loading = true
    try {
      // Map profile data to form data
      formState.data.personalInfo = {
        ...profile.personalInfo,
        confirmEmail: profile.personalInfo.email,
      }
      
      formState.data.demographics = profile.demographics
      formState.data.preferences = {
        communication: profile.preferences.communication,
        privacy: {
          isProfileVisibleToCounselors: profile.privacySettings.isProfileVisibleToCounselors,
          isProfileVisibleToOtherUsers: profile.privacySettings.isProfileVisibleToOtherUsers,
          allowDataAnalysisForMatching: profile.privacySettings.allowDataAnalysisForMatching,
        },
      }

      // Store original data for dirty checking
      originalData.value = JSON.parse(JSON.stringify(formState.data))

      // Update section progress
      formState.sections.forEach(section => {
        updateSectionProgress(section.id)
      })

      markAsClean()
    } finally {
      formState.loading = false
    }
  }

  const saveForm = async (): Promise<FormSubmissionResult> => {
    if (!validateForm()) {
      return {
        success: false,
        errors: formState.errors,
        message: 'لطفاً خطاهای فرم را برطرف کنید',
      }
    }

    formState.saving = true
    try {
      // Convert form data to API format
      const profileData: UserProfile = {
        id: '', // Will be set by API
        userId: '', // Will be set by API
        personalInfo: {
          id: '',
          firstName: formState.data.personalInfo.firstName,
          lastName: formState.data.personalInfo.lastName,
          email: formState.data.personalInfo.email,
          phoneNumber: formState.data.personalInfo.phoneNumber,
          dateOfBirth: formState.data.personalInfo.dateOfBirth,
          gender: formState.data.personalInfo.gender,
          profilePicture: formState.data.personalInfo.profilePicture,
        },
        demographics: {
          id: '',
          education: formState.data.demographics.education.map(edu => ({
            ...edu,
            id: edu.tempId?.startsWith('temp_') ? '' : edu.tempId || '',
          })),
          occupation: formState.data.demographics.occupation.map(occ => ({
            ...occ,
            id: occ.tempId?.startsWith('temp_') ? '' : occ.tempId || '',
          })),
          location: formState.data.demographics.location.map(loc => ({
            ...loc,
            id: loc.tempId?.startsWith('temp_') ? '' : loc.tempId || '',
          })),
        },
        preferences: {
          id: '',
          communication: formState.data.preferences.communication,
        },
        privacySettings: {
          id: '',
          isProfileVisibleToCounselors: formState.data.preferences.privacy.isProfileVisibleToCounselors,
          isProfileVisibleToOtherUsers: formState.data.preferences.privacy.isProfileVisibleToOtherUsers,
          allowDataAnalysisForMatching: formState.data.preferences.privacy.allowDataAnalysisForMatching,
        },
        status: 'ACTIVE',
        createdAt: '',
        updatedAt: '',
      }

      const result = await updateMyProfile(profileData)
      markAsClean()

      return {
        success: true,
        data: result,
        message: 'پروفایل با موفقیت ذخیره شد',
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'خطا در ذخیره پروفایل',
      }
    } finally {
      formState.saving = false
    }
  }

  const resetForm = () => {
    if (originalData.value) {
      formState.data = JSON.parse(JSON.stringify(originalData.value))
    }
    formState.errors = {}
    formState.touched = {}
    markAsClean()
  }

  // Auto-save functionality
  const performAutoSave = async () => {
    if (!autoSave.enabled || !autoSave.pendingChanges || formState.saving) {
      return
    }

    try {
      await saveForm()
    } catch (error) {
      console.warn('Auto-save failed:', error)
    }
  }

  // Watch for changes to trigger section progress updates
  watch(
    () => formState.data.personalInfo,
    () => updateSectionProgress('personalInfo'),
    { deep: true }
  )

  watch(
    () => formState.data.demographics,
    () => updateSectionProgress('demographics'),
    { deep: true }
  )

  // Auto-save timer
  let autoSaveTimer: ReturnType<typeof setInterval> | null = null

  const startAutoSave = () => {
    if (autoSaveTimer) return
    
    autoSaveTimer = setInterval(performAutoSave, autoSave.interval)
  }

  const stopAutoSave = () => {
    if (autoSaveTimer) {
      clearInterval(autoSaveTimer)
      autoSaveTimer = null
    }
  }

  // Cleanup on unmount
  onUnmounted(() => {
    stopAutoSave()
  })

  return {
    // State
    formState: readonly(formState),
    autoSave: readonly(autoSave),

    // Computed
    currentSectionData,
    overallProgress,
    canSubmit,
    hasErrors,

    // Form manipulation
    setFieldValue,
    validateField,
    validateSection,
    validateForm,
    markAsDirty,
    markAsClean,

    // Section management
    goToSection,
    updateSectionProgress,

    // Array management
    addEducation,
    removeEducation,
    addOccupation,
    removeOccupation,
    addLocation,
    removeLocation,

    // Data operations
    loadProfile,
    saveForm,
    resetForm,

    // Auto-save
    startAutoSave,
    stopAutoSave,
    performAutoSave,
  }
}