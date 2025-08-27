// Example usage of usePublicCounselors composable
import { usePublicCounselors } from './usePublicCounselors'

// In a Vue component or composable
export function usePublicCounselorsExample() {
  const {
    // State
    publicCounselorsState,
    counselorsError,
    isCounselorsLoading,

    // Computed
    publicCounselorsList,
    currentPublicCounselor,

    // Methods
    getPublicCounselors,
    getPublicCounselorById,
    getCounselorAvailability,
    getAvailableTimeSlots,
    requestCounselorConnection,
    getSpecializations,
  } = usePublicCounselors()

  // Example: Fetch public counselors
  const fetchCounselors = async () => {
    const result = await getPublicCounselors(1, 10, 'anxiety', 'psychology')
    if (result) {
      console.log('Fetched counselors:', result.counselors)
    }
  }

  // Example: Get a specific counselor
  const fetchCounselor = async (counselorId: string) => {
    const counselor = await getPublicCounselorById(counselorId)
    if (counselor) {
      console.log('Fetched counselor:', counselor)
    }
  }

  // Example: Get counselor availability
  const fetchAvailability = async (counselorId: string) => {
    const availability = await getCounselorAvailability(counselorId)
    if (availability) {
      console.log('Counselor availability:', availability)
    }
  }

  // Example: Get available time slots
  const fetchTimeSlots = async (counselorId: string) => {
    const today = new Date().toISOString().split('T')[0]
    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    const timeSlots = await getAvailableTimeSlots(counselorId, today, nextWeek)
    if (timeSlots) {
      console.log('Available time slots:', timeSlots)
    }
  }

  // Example: Request connection with counselor
  const requestConnection = async (counselorId: string) => {
    const connection = await requestCounselorConnection({
      counselorId,
      applicantId: 'current-user-id', // This would come from auth context
      notes: 'I would like to schedule a consultation',
    })

    if (connection) {
      console.log('Connection request sent:', connection)
    }
  }

  // Example: Get specializations
  const fetchSpecializations = async () => {
    const specializations = await getSpecializations()
    if (specializations) {
      console.log('Specializations:', specializations)
    }
  }

  return {
    // State
    publicCounselorsState,
    counselorsError,
    isCounselorsLoading,

    // Computed
    publicCounselorsList,
    currentPublicCounselor,

    // Methods
    fetchCounselors,
    fetchCounselor,
    fetchAvailability,
    fetchTimeSlots,
    requestConnection,
    fetchSpecializations,
  }
}
