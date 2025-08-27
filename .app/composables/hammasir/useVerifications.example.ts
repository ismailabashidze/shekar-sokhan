// Example usage of useVerifications composable
import { useVerifications } from './useVerifications'

// In a Vue component or composable
export function useVerificationsExample() {
  const {
    // State
    verificationState,
    verificationError,
    isVerificationLoading,
    isVerificationSubmitting,
    isVerificationSyncing,

    // Computed
    userVerificationDocuments,
    userVerificationStatus,
    verificationRequests,
    currentSyncStatus,
    keycloakValidation,

    // Methods
    getMyVerificationDocuments,
    registerVerificationDocument,
    submitVerificationRequest,
    getMyVerificationStatus,
    getAllVerificationRequests,
    updateVerificationStatus,
    validateKeycloakConsistency,
    getSyncStatus,
    syncWithKeycloak,
  } = useVerifications()

  // Example: Fetch my verification documents
  const fetchVerificationDocuments = async () => {
    const documents = await getMyVerificationDocuments()
    if (documents) {
      console.log('Fetched verification documents:', documents)
    }
  }

  // Example: Register a new verification document
  const addVerificationDocument = async () => {
    const newDocument = await registerVerificationDocument({
      title: 'مدرک تحصیلی',
      description: 'مدرک کارشناسی ارشد روانشناسی',
      documentType: 'EDUCATION_CERTIFICATE',
      fileUrl: 'https://example.com/certificate.pdf',
      status: 'PENDING_REVIEW',
    })

    if (newDocument) {
      console.log('Added verification document:', newDocument)
    }
  }

  // Example: Submit verification request
  const requestVerification = async () => {
    const success = await submitVerificationRequest()
    if (success) {
      console.log('Verification request submitted successfully')
    }
  }

  // Example: Get my verification status
  const checkVerificationStatus = async () => {
    const status = await getMyVerificationStatus()
    if (status) {
      console.log('Current verification status:', status)
    }
  }

  // Example: Get all verification requests (admin)
  const fetchAllVerificationRequests = async () => {
    const requests = await getAllVerificationRequests('PENDING_REVIEW')
    if (requests) {
      console.log('Pending verification requests:', requests)
    }
  }

  // Example: Update verification status (admin)
  const approveVerification = async (verificationId: string) => {
    const updatedRequest = await updateVerificationStatus(verificationId, 'APPROVED', 'مدارک تأیید شد')
    if (updatedRequest) {
      console.log('Verification approved:', updatedRequest)
    }
  }

  // Example: Validate Keycloak consistency (admin)
  const validateConsistency = async (counselorId: string) => {
    const validation = await validateKeycloakConsistency(counselorId)
    if (validation) {
      console.log('Keycloak validation result:', validation)
    }
  }

  // Example: Get sync status (admin)
  const checkSyncStatus = async (counselorId: string) => {
    const syncStatus = await getSyncStatus(counselorId)
    if (syncStatus) {
      console.log('Sync status:', syncStatus)
    }
  }

  // Example: Sync with Keycloak (admin)
  const performSync = async (counselorId: string) => {
    const success = await syncWithKeycloak(counselorId)
    if (success) {
      console.log('Sync with Keycloak completed successfully')
    }
  }

  return {
    // State
    verificationState,
    verificationError,
    isVerificationLoading,
    isVerificationSubmitting,
    isVerificationSyncing,

    // Computed
    userVerificationDocuments,
    userVerificationStatus,
    verificationRequests,
    currentSyncStatus,
    keycloakValidation,

    // Methods
    fetchVerificationDocuments,
    addVerificationDocument,
    requestVerification,
    checkVerificationStatus,
    fetchAllVerificationRequests,
    approveVerification,
    validateConsistency,
    checkSyncStatus,
    performSync,
  }
}