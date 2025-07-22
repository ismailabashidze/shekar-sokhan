import admin from 'firebase-admin'

export default defineEventHandler(async (event) => {
  const { title, body, userId, data, scheduleTime } = await readBody(event)
  
  if (!title || !body || !userId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Title, body, and userId are required'
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

    // Get user's FCM token from PocketBase
    const pb = usePocketBase()
    const tokenRecord = await pb.collection('fcm_tokens').getFirstListItem(`user_id="${userId}"`)
    
    if (!tokenRecord) {
      throw createError({
        statusCode: 404,
        statusMessage: 'FCM token not found for user'
      })
    }

    const message = {
      notification: {
        title: title,
        body: body
      },
      data: data || {},
      token: tokenRecord.token
    }

    if (scheduleTime) {
      // Schedule notification for later
      await pb.collection('scheduled_notifications').create({
        user_id: userId,
        title: title,
        body: body,
        data: JSON.stringify(data || {}),
        schedule_time: scheduleTime,
        status: 'pending',
        created: new Date().toISOString()
      })
      
      return { success: true, scheduled: true }
    } else {
      // Send notification immediately
      const response = await admin.messaging().send(message)
      
      // Log notification to database
      await pb.collection('notification_logs').create({
        user_id: userId,
        title: title,
        body: body,
        fcm_response: response,
        sent_at: new Date().toISOString(),
        status: 'sent'
      })
      
      return { success: true, messageId: response }
    }
  } catch (error) {
    console.error('Error sending notification:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to send notification'
    })
  }
})