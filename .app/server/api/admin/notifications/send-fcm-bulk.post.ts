import admin from 'firebase-admin'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { 
    title, 
    message, 
    complete_message, 
    type, 
    priority, 
    action_url, 
    action_text, 
    recipients, 
    userRole, 
    sendToAll,
    announce_time 
  } = body

  if (!title || !message) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Title and message are required'
    })
  }

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

    // Get recipients
    const pb = usePocketBase()
    let targetRecipients: string[] = []

    if (sendToAll) {
      // Get all users or users with specific role
      const filter = userRole ? `role="${userRole}"` : ''
      const allUsers = await pb.collection('users').getFullList({
        filter: filter
      })
      targetRecipients = allUsers.map(user => user.id)
    } else {
      targetRecipients = recipients || []
    }

    if (targetRecipients.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No recipients specified'
      })
    }

    // Get FCM tokens for all recipients
    const tokenRecords = await pb.collection('fcm_tokens').getFullList({
      filter: targetRecipients.map(id => `user_id="${id}"`).join(' || ')
    })

    if (tokenRecords.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'No FCM tokens found for recipients'
      })
    }

    const notificationData = {
      type: type || 'info',
      priority: priority || 'medium',
      action_url: action_url || '',
      complete_message: complete_message || '',
      action_text: action_text || ''
    }

    if (announce_time) {
      // Schedule notifications for later
      const scheduledPromises = tokenRecords.map(tokenRecord =>
        pb.collection('scheduled_notifications').create({
          user_id: tokenRecord.user_id,
          title: title,
          body: message,
          data: JSON.stringify(notificationData),
          fcm_token: tokenRecord.token,
          schedule_time: announce_time,
          status: 'pending',
          created: new Date().toISOString()
        })
      )
      
      await Promise.all(scheduledPromises)
      
      return { 
        success: true, 
        scheduled: true, 
        sentCount: tokenRecords.length,
        scheduleTime: announce_time
      }
    } else {
      // Send notifications immediately
      const tokens = tokenRecords.map(record => record.token)
      
      const multicastMessage = {
        notification: {
          title: title,
          body: message
        },
        data: notificationData,
        tokens: tokens,
        android: {
          priority: 'high' as const,
          notification: {
            priority: priority === 'urgent' ? 'max' as const : 'high' as const,
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

      const response = await admin.messaging().sendEachForMulticast(multicastMessage)
      
      // Log notifications to database
      const logPromises = tokenRecords.map((tokenRecord, index) =>
        pb.collection('notification_logs').create({
          user_id: tokenRecord.user_id,
          title: title,
          body: message,
          fcm_response: response.responses[index].success ? 'success' : response.responses[index].error?.message,
          sent_at: new Date().toISOString(),
          status: response.responses[index].success ? 'sent' : 'failed'
        })
      )
      
      await Promise.all(logPromises)
      
      return { 
        success: true, 
        sentCount: response.successCount,
        failedCount: response.failureCount,
        responses: response.responses 
      }
    }
  } catch (error) {
    console.error('Error sending bulk FCM notification:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to send FCM notifications'
    })
  }
})