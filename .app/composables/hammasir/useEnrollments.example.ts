// Example usage of useEnrollments composable
import { useEnrollments } from './useEnrollments'

// In a Vue component or composable
export function useEnrollmentsExample() {
  const {
    // State
    enrollmentsState,
    enrollmentsError,
    isEnrollmentsLoading,
    isEnrollmentsCreating,
    isEnrollmentsUpdating,

    // Computed
    userEnrollments,
    currentEnrollment,

    // Methods
    getMyEnrollments,
    enrollInCourse,
    getEnrollmentById,
    cancelEnrollment,
    handlePaymentCallback,
  } = useEnrollments()

  // Example: Fetch user enrollments
  const fetchEnrollments = async () => {
    const result = await getMyEnrollments(1, 10, 'IN_PROGRESS')
    if (result) {
      console.log('Fetched enrollments:', result.enrollments)
    }
  }

  // Example: Enroll in a course
  const enrollInNewCourse = async () => {
    const enrollmentData = {
      courseId: 'course-123',
    }

    const newEnrollment = await enrollInCourse(enrollmentData)
    if (newEnrollment) {
      console.log('Enrolled in course:', newEnrollment)
    }
  }

  // Example: Get a specific enrollment
  const fetchEnrollment = async (enrollmentId: string) => {
    const enrollment = await getEnrollmentById(enrollmentId)
    if (enrollment) {
      console.log('Fetched enrollment:', enrollment)
    }
  }

  // Example: Cancel an enrollment
  const cancelExistingEnrollment = async (enrollmentId: string) => {
    const success = await cancelEnrollment(enrollmentId)
    if (success) {
      console.log('Enrollment cancelled successfully')
    }
  }

  // Example: Handle payment callback
  const processPaymentCallback = async () => {
    const paymentData = {
      enrollmentId: 'enrollment-123',
      status: 'SUCCESSFUL',
      paymentId: 'payment-456',
    }

    const success = await handlePaymentCallback(paymentData)
    if (success) {
      console.log('Payment callback processed successfully')
    }
  }

  return {
    // State
    enrollmentsState,
    enrollmentsError,
    isEnrollmentsLoading,
    isEnrollmentsCreating,
    isEnrollmentsUpdating,

    // Computed
    userEnrollments,
    currentEnrollment,

    // Methods
    fetchEnrollments,
    enrollInNewCourse,
    fetchEnrollment,
    cancelExistingEnrollment,
    processPaymentCallback,
  }
}