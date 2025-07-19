export interface NtfyNotification {
  title: string
  message: string
  tags?: string[]
  priority?: 1 | 2 | 3 | 4 | 5
  actions?: Array<{
    action: string
    label: string
    url?: string
  }>
  click?: string
  icon?: string
  filename?: string
  delay?: string
  email?: string
}

export interface NtfySubscription {
  userId: string
  topic: string
  endpoint: string
  active: boolean
}

export const useNtfy = () => {
  const { $pb } = useNuxtApp()
  const baseUrl = 'https://ntfy.sh'
  
  // Generate user-specific topic
  const getUserTopic = (userId: string): string => {
    return `zehna-user-${userId}`
  }

  // Subscribe user to their ntfy topic (client-side)
  const subscribeToUserNotifications = async (userId: string) => {
    if (!process.client) return

    const topic = getUserTopic(userId)
    const eventSource = new EventSource(`${baseUrl}/${topic}/sse`)

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        
        // Show browser notification if permission granted
        if ('Notification' in window && Notification.permission === 'granted') {
          const notification = new Notification(data.title || 'ذهنا', {
            body: data.message,
            icon: '/img/logo.png',
            badge: '/img/badge.png',
            tag: data.id || Date.now().toString(),
            requireInteraction: data.priority >= 4,
            data: data.click ? { url: data.click } : undefined
          })

          notification.onclick = () => {
            if (data.click) {
              window.open(data.click, '_blank')
            }
            notification.close()
          }
        }

        // You can also emit events for your app to handle
        if (process.client) {
          window.dispatchEvent(new CustomEvent('ntfy-notification', {
            detail: data
          }))
        }
      } catch (error) {
        console.error('Error parsing ntfy notification:', error)
      }
    }

    eventSource.onerror = (error) => {
      console.error('ntfy SSE error:', error)
    }

    return eventSource
  }

  // Send notification via PocketBase backend (which uses ntfy.sh)
  const sendNotification = async (
    recipientIds: string | string[],
    notification: NtfyNotification
  ) => {
    try {
      const recipients = Array.isArray(recipientIds) ? recipientIds : [recipientIds]
      
      const response = await $pb.send('/api/notifications/send', {
        method: 'POST',
        body: {
          recipientIds: recipients,
          title: notification.title,
          body: notification.message,
          data: {
            tags: notification.tags,
            priority: notification.priority,
            actions: notification.actions,
            url: notification.click,
            icon: notification.icon
          },
          type: notification.priority >= 4 ? 'crisis' : 'info'
        },
      })

      return response
    } catch (error) {
      console.error('Error sending ntfy notification:', error)
      throw error
    }
  }

  // Send crisis intervention notification
  const sendCrisisNotification = async (
    recipientIds: string | string[],
    message: string,
    sessionUrl?: string
  ) => {
    return sendNotification(recipientIds, {
      title: '🚨 درخواست مداخله بحران',
      message,
      tags: ['rotating_light', 'sos'],
      priority: 5,
      actions: sessionUrl ? [
        {
          action: 'view',
          label: 'پاسخ فوری',
          url: sessionUrl
        }
      ] : undefined,
      click: sessionUrl
    })
  }

  // Send therapy session notification
  const sendSessionNotification = async (
    recipientIds: string | string[],
    message: string,
    sessionUrl?: string
  ) => {
    return sendNotification(recipientIds, {
      title: '💬 پیام جدید در جلسه',
      message,
      tags: ['speech_balloon'],
      priority: 3,
      actions: sessionUrl ? [
        {
          action: 'view',
          label: 'مشاهده پیام',
          url: sessionUrl
        }
      ] : undefined,
      click: sessionUrl
    })
  }

  // Send appointment reminder
  const sendAppointmentReminder = async (
    recipientIds: string | string[],
    appointmentTime: string,
    therapistName: string
  ) => {
    return sendNotification(recipientIds, {
      title: '⏰ یادآوری جلسه',
      message: `جلسه شما با ${therapistName} در ${appointmentTime} برنامه‌ریزی شده است`,
      tags: ['calendar'],
      priority: 4,
      delay: '30m' // Send 30 minutes before
    })
  }

  // Send goal achievement notification
  const sendGoalAchievementNotification = async (
    recipientIds: string | string[],
    goalTitle: string
  ) => {
    return sendNotification(recipientIds, {
      title: '🎉 تبریک! هدف محقق شد',
      message: `شما هدف "${goalTitle}" را با موفقیت محقق کردید`,
      tags: ['tada', 'trophy'],
      priority: 3
    })
  }

  return {
    getUserTopic,
    subscribeToUserNotifications,
    sendNotification,
    sendCrisisNotification,
    sendSessionNotification,
    sendAppointmentReminder,
    sendGoalAchievementNotification
  }
}