import { getMessaging, getToken, onMessage } from 'firebase/messaging'

export const useFirebaseMessaging = () => {
  const { $messaging } = useNuxtApp()
  
  const requestPermission = async () => {
    try {
      const permission = await Notification.requestPermission()
      if (permission === 'granted') {
        console.log('Notification permission granted.')
        return await getToken($messaging as any, {
          vapidKey: useRuntimeConfig().public.firebaseVapidKey
        })
      } else {
        console.log('Unable to get permission to notify.')
        return null
      }
    } catch (error) {
      console.error('An error occurred while retrieving token. ', error)
      return null
    }
  }

  const onMessageListener = () => {
    return new Promise((resolve) => {
      onMessage($messaging as any, (payload) => {
        resolve(payload)
      })
    })
  }

  const saveFCMToken = async (token: string, userId: string) => {
    try {
      await $fetch('/api/fcm/save-token', {
        method: 'POST',
        body: {
          token,
          userId
        }
      })
    } catch (error) {
      console.error('Error saving FCM token:', error)
    }
  }

  return {
    requestPermission,
    onMessageListener,
    saveFCMToken
  }
}