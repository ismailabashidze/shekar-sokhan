import admin from 'firebase-admin'

export default defineEventHandler(async (event) => {
  try {
    // Initialize Firebase Admin if not already initialized
    if (!admin.apps.length) {
      const serviceAccount = {
        type: 'service_account',
        project_id: useRuntimeConfig().firebaseProjectId,
        private_key_id: useRuntimeConfig().firebasePrivateKeyId,
        private_key: useRuntimeConfig().firebasePrivateKey.replace(/\\n/g, '\n'),
        client_email: useRuntimeConfig().firebaseClientEmail,
        client_id: useRuntimeConfig().firebaseClientId,
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://oauth2.googleapis.com/token'
      }

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
      })
    }

    const pb = usePocketBase()
    const currentTime = new Date()

    // Get all pending scheduled notifications that are due
    const dueNotifications = await pb.collection('scheduled_notifications').getFullList({
      filter: `status="pending" && schedule_time<="${currentTime.toISOString()}"`,
      sort: 'schedule_time'
    })

    if (dueNotifications.length === 0) {
      return { success: true, processed: 0, message: 'No due notifications' }
    }

    let processedCount = 0
    let failedCount = 0

    for (const notification of dueNotifications) {
      try {
        // Get user's FCM token
        const tokenRecord = await pb.collection('fcm_tokens').getFirstListItem(`user_id="${notification.user_id}"`)
        
        if (!tokenRecord) {
          // Mark as failed - no FCM token
          await pb.collection('scheduled_notifications').update(notification.id, {
            status: 'failed',
            error_message: 'No FCM token found',
            processed_at: new Date().toISOString()
          })
          failedCount++
          continue
        }

        // Parse data if it exists
        let data = {}
        if (notification.data) {
          try {
            data = JSON.parse(notification.data)
          } catch (parseError) {
            console.warn('Failed to parse notification data:', parseError)
          }
        }

        // Send FCM notification
        const message = {
          notification: {
            title: notification.title,
            body: notification.body
          },
          data: {
            ...data,
            notification_id: notification.id
          },
          token: tokenRecord.token,
          android: {
            priority: 'high' as const,
            notification: {
              priority: 'high' as const,
              defaultSound: true,
              defaultVibrateTimings: true
            }
          },
          apns: {
            payload: {
              aps: {
                sound: 'default',
                badge: 1
              }
            }
          }
        }

        const response = await admin.messaging().send(message)

        // Update notification status
        await pb.collection('scheduled_notifications').update(notification.id, {
          status: 'sent',
          fcm_response: response,
          processed_at: new Date().toISOString()
        })

        // Log to notification_logs
        await pb.collection('notification_logs').create({
          user_id: notification.user_id,
          title: notification.title,
          body: notification.body,
          fcm_response: response,
          sent_at: new Date().toISOString(),
          status: 'sent',
          source: 'scheduled'
        })

        // Create in-app notification as well
        await pb.collection('notifications').create({
          title: notification.title,
          message: notification.body,
          type: data.type || 'info',
          priority: data.priority || 'medium',
          recipient_user_id: notification.user_id,
          user_id: notification.user_id,
          action_url: data.action_url || '',
          action_text: data.action_text || '',
          complete_message: data.complete_message || '',
          is_read: false
        })

        processedCount++
        
      } catch (error) {
        console.error(`Failed to process notification ${notification.id}:`, error)
        
        // Mark as failed
        await pb.collection('scheduled_notifications').update(notification.id, {
          status: 'failed',
          error_message: error.message,
          processed_at: new Date().toISOString()
        })
        
        failedCount++
      }
    }

    return {
      success: true,
      total: dueNotifications.length,
      processed: processedCount,
      failed: failedCount,
      message: `Processed ${processedCount} notifications, ${failedCount} failed`
    }

  } catch (error) {
    console.error('Error processing scheduled notifications:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to process scheduled notifications'
    })
  }
})