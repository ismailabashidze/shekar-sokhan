// Example usage of useAdmin composable
import { useAdmin } from './useAdmin'

// In a Vue component or composable
export function useAdminExample() {
  const {
    // State
    adminState,
    adminError,
    isAdminLoading,

    // Methods
    getAllCounselorsAdmin,
    getCounselorByIdAdmin,
    getSystemNotificationsAdmin,
    sendSystemNotificationAdmin,
    getAllVerificationRequestsAdmin,
    updateVerificationStatusAdmin,
    getAllModulesAdmin,
    updateModuleStatusAdmin,
    getAllFilesAdmin,
  } = useAdmin()

  // Example: Fetch all counselors
  const fetchCounselors = async () => {
    const result = await getAllCounselorsAdmin(1, 10, 'APPROVED', 'psychology')
    if (result) {
      console.log('Fetched counselors:', result.counselors)
    }
  }

  // Example: Get a specific counselor
  const fetchCounselor = async (counselorId: string) => {
    const counselor = await getCounselorByIdAdmin(counselorId)
    if (counselor) {
      console.log('Fetched counselor:', counselor)
    }
  }

  // Example: Get system notifications
  const fetchNotifications = async () => {
    const result = await getSystemNotificationsAdmin(1, 20, 'info')
    if (result) {
      console.log('Fetched notifications:', result.notifications)
    }
  }

  // Example: Send a system notification
  const sendNotification = async () => {
    const notificationData = {
      title: 'اطلاعیه سیستمی',
      message: 'این یک اعلان سیستمی تستی است',
      type: 'info',
      recipients: ['user1', 'user2'],
    }

    const result = await sendSystemNotificationAdmin(notificationData)
    if (result) {
      console.log('Notification sent:', result)
    }
  }

  // Example: Get verification requests
  const fetchVerificationRequests = async () => {
    const requests = await getAllVerificationRequestsAdmin('PENDING')
    if (requests) {
      console.log('Fetched verification requests:', requests)
    }
  }

  // Example: Update verification status
  const updateVerification = async (verificationId: string) => {
    const updatedRequest = await updateVerificationStatusAdmin(verificationId, 'APPROVED')
    if (updatedRequest) {
      console.log('Updated verification request:', updatedRequest)
    }
  }

  // Example: Get modules
  const fetchModules = async () => {
    const result = await getAllModulesAdmin(1, 10, 'ACTIVE')
    if (result) {
      console.log('Fetched modules:', result.modules)
    }
  }

  // Example: Update module status
  const updateModule = async (userId: string) => {
    const updatedModule = await updateModuleStatusAdmin(userId, {
      status: 'DISABLED',
      reason: 'User requested deactivation',
    })

    if (updatedModule) {
      console.log('Updated module:', updatedModule)
    }
  }

  // Example: Get files
  const fetchFiles = async () => {
    const files = await getAllFilesAdmin('user1', 'DOCUMENT', 'UPLOADED')
    if (files) {
      console.log('Fetched files:', files)
    }
  }

  return {
    // State
    adminState,
    adminError,
    isAdminLoading,

    // Methods
    fetchCounselors,
    fetchCounselor,
    fetchNotifications,
    sendNotification,
    fetchVerificationRequests,
    updateVerification,
    fetchModules,
    updateModule,
    fetchFiles,
  }
}