// Example usage of useProfileCounselor composable
import { useProfileCounselor } from './useProfileCounselor'

// In a Vue component or composable
export function useProfileCounselorExample() {
  const {
    // State
    counselorProfileState,
    profileError,
    isProfileLoading,
    isProfileUpdating,

    // Computed
    currentCounselorProfile,

    // Methods
    getMyCounselorProfile,
    updateMyCounselorProfile,
    updatePersonalInfo,
    updateProfessionalInfo,
    updateSpecializations,
    updateAvailability,
    updateRates,
  } = useProfileCounselor()

  // Example: Fetch current counselor profile
  const fetchProfile = async () => {
    const profile = await getMyCounselorProfile()
    if (profile) {
      console.log('Fetched counselor profile:', profile)
    }
  }

  // Example: Update entire counselor profile
  const updateProfile = async () => {
    if (!currentCounselorProfile.value) return

    const updatedProfile = await updateMyCounselorProfile(currentCounselorProfile.value)
    if (updatedProfile) {
      console.log('Updated counselor profile:', updatedProfile)
    }
  }

  // Example: Update personal info
  const updatePersonalInformation = async () => {
    if (!currentCounselorProfile.value) return

    const personalInfo = currentCounselorProfile.value.personalInfo
    const updatedProfile = await updatePersonalInfo(personalInfo)
    if (updatedProfile) {
      console.log('Updated personal info:', updatedProfile)
    }
  }

  // Example: Update professional info
  const updateProfessionalInformation = async () => {
    if (!currentCounselorProfile.value) return

    const professionalInfo = currentCounselorProfile.value.professionalInfo
    const updatedProfile = await updateProfessionalInfo(professionalInfo)
    if (updatedProfile) {
      console.log('Updated professional info:', updatedProfile)
    }
  }

  // Example: Update specializations
  const updateCounselorSpecializations = async () => {
    if (!currentCounselorProfile.value) return

    const specializations = currentCounselorProfile.value.specializations
    const updatedProfile = await updateSpecializations(specializations)
    if (updatedProfile) {
      console.log('Updated specializations:', updatedProfile)
    }
  }

  // Example: Update availability
  const updateCounselorAvailability = async () => {
    if (!currentCounselorProfile.value) return

    const availability = currentCounselorProfile.value.availability
    const updatedAvailability = await updateAvailability(availability)
    if (updatedAvailability) {
      console.log('Updated availability:', updatedAvailability)
    }
  }

  // Example: Update rates
  const updateCounselorRates = async () => {
    if (!currentCounselorProfile.value) return

    const rates = currentCounselorProfile.value.rates
    const updatedRates = await updateRates(rates)
    if (updatedRates) {
      console.log('Updated rates:', updatedRates)
    }
  }

  return {
    // State
    counselorProfileState,
    profileError,
    isProfileLoading,
    isProfileUpdating,

    // Computed
    currentCounselorProfile,

    // Methods
    fetchProfile,
    updateProfile,
    updatePersonalInformation,
    updateProfessionalInformation,
    updateCounselorSpecializations,
    updateCounselorAvailability,
    updateCounselorRates,
  }
}
