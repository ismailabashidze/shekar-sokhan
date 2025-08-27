// Example usage of useAdminNotifications composable
import { useAdminNotifications } from './useAdminNotifications'

// In a Vue component or composable
export function useAdminNotificationExample() {
  const {
    // State
    adminNotificationsState,
    adminNotificationsError,
    isAdminNotificationsLoading,
    isAdminNotificationsSending,

    // Computed
    adminSystemNotifications,

    // Methods
    getSystemNotificationsAdmin,
    sendSystemNotificationAdmin,
    deleteSystemNotificationAdmin,
  } = useAdminNotifications()

  // Example: Fetch system notifications
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

  // Example: Delete a notification
  const deleteNotification = async (notificationId: string) => {
    const success = await deleteSystemNotificationAdmin(notificationId)
    if (success) {
      console.log('Notification deleted successfully')
    }
  }

  return {
    // State
    adminNotificationsState,
    adminNotificationsError,
    isAdminNotificationsLoading,
    isAdminNotificationsSending,

    // Computed
    adminSystemNotifications,

    // Methods
    fetchNotifications,
    sendNotification,
    deleteNotification,
  }
}
