export type AssessmentStatus = 'draft' | 'completed' | 'reviewed'

export type TherapyAssessment = {
  id?: string
  // User reference
  user?: string

  // Status
  status: AssessmentStatus

  // Step 1: Main concerns
  mainConcerns: string
  triggerEvents: string
  symptomsStarted: string
  impactOnLife: string

  // Step 2: Current mood & emotional state
  mood: string
  emotionalState: string[] // JSON array
  energyLevel: number
  motivationLevel: number
  socialConnection: number

  // Step 3: Physical & mental levels
  anxietyLevel: number
  sleepQuality: number
  stressLevel: number
  concentrationLevel: number
  physicalSymptoms: string[] // JSON array

  // Step 4: Background & personal info
  age: string
  gender: string
  relationshipStatus: string
  livingStatus: string
  workStatus: string
  lifeGoals: string
  previousTherapy: string
  currentMedication: string
  supportSystem: string

  // Step 5: Therapy preferences
  preferredApproach: string
  timeAvailability: string
  communicationStyle: string
  providerPreference: string
  specificIssues: string[] // JSON array
  copingMethods: string[] // JSON array
  expectations: string

  // Step 6: Demographics
  education: string
  incomeLevel: string
  location: string
  ethnicity: string
  religion: string
  language: string
  familySize: string
  parentalStatus: string

  // System fields
  assessmentVersion?: string
  completionTime?: number
  created?: string
  updated?: string
}

export function useAssessment() {
  const nuxtApp = useNuxtApp()
  const { user } = useUser()

  const createAssessment = async (assessment: Partial<TherapyAssessment>) => {
    // Add user reference and default values
    const assessmentData = {
      ...assessment,
      user: user.value.id || '',
      status: 'completed',
      assessmentVersion: '1.0',
      created: new Date().toISOString(),
    }

    try {
      return await nuxtApp.$pb.collection('therapy_assessments').create(assessmentData)
    }
    catch (error) {
      console.error('Error creating assessment:', error)
      throw error
    }
  }

  const getAssessment = async (id: string) => {
    try {
      return await nuxtApp.$pb.collection('therapy_assessments').getOne(id)
    }
    catch (error) {
      console.error('Error fetching assessment:', error)
      throw error
    }
  }

  const getUserAssessments = async (userId?: string) => {
    const targetUserId = userId || user.value.id
    if (!targetUserId) {
      throw new Error('User ID is required')
    }

    try {
      return await nuxtApp.$pb.collection('therapy_assessments').getFullList({
        filter: `user = "${targetUserId}"`,
        sort: '-created',
      })
    }
    catch (error) {
      console.error('Error fetching user assessments:', error)
      throw error
    }
  }

  const updateAssessment = async (id: string, assessment: Partial<TherapyAssessment>) => {
    try {
      return await nuxtApp.$pb.collection('therapy_assessments').update(id, {
        ...assessment,
        updated: new Date().toISOString(),
      })
    }
    catch (error) {
      console.error('Error updating assessment:', error)
      throw error
    }
  }

  const deleteAssessment = async (id: string) => {
    try {
      return await nuxtApp.$pb.collection('therapy_assessments').delete(id)
    }
    catch (error) {
      console.error('Error deleting assessment:', error)
      throw error
    }
  }

  return {
    createAssessment,
    getAssessment,
    getUserAssessments,
    updateAssessment,
    deleteAssessment,
  }
}
