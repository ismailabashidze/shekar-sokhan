import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getMessaging } from 'firebase-admin/messaging'

// Check if Firebase configuration is available
const isFirebaseConfigured = () => {
  return !!(
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_PRIVATE_KEY &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY_ID &&
    process.env.FIREBASE_CLIENT_ID
  )
}

// Initialize Firebase Admin SDK only if properly configured
let firebaseInitialized = false
if (getApps().length === 0 && isFirebaseConfigured()) {
  try {
    const serviceAccount = {
      type: 'service_account',
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.FIREBASE_CLIENT_EMAIL}`
    }

    initializeApp({
      credential: cert(serviceAccount as any),
      projectId: process.env.FIREBASE_PROJECT_ID
    })
    
    firebaseInitialized = true
    console.log('✅ Firebase Admin SDK initialized successfully')
  } catch (error) {
    console.error('❌ Failed to initialize Firebase Admin SDK:', error)
    firebaseInitialized = false
  }
} else if (!isFirebaseConfigured()) {
  console.warn('⚠️ Firebase configuration missing - notification API will run in mock mode')
}

export interface NotificationPayload {
  token: string
  title: string
  body: string
  data?: Record<string, string>
  imageUrl?: string
  actionUrl?: string
}

export interface BatchNotificationPayload {
  tokens: string[]
  title: string
  body: string
  data?: Record<string, string>
  imageUrl?: string
  actionUrl?: string
}

/**
 * Send single FCM notification
 */
export const sendNotification = async (payload: NotificationPayload): Promise<{
  success: boolean
  messageId?: string
  error?: string
}> => {
  try {
    // Check if Firebase is properly initialized
    if (!firebaseInitialized) {
      console.log('🔧 Firebase not configured - simulating notification send')
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 100))
      
      // Simulate success/failure based on token validity
      const isValidToken = payload.token && payload.token.length > 10 && !payload.token.includes('invalid')
      
      if (isValidToken) {
        const mockMessageId = `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        console.log(`✅ Mock notification sent successfully: ${mockMessageId}`)
        return {
          success: true,
          messageId: mockMessageId
        }
      } else {
        console.log('❌ Mock notification failed: Invalid token')
        return {
          success: false,
          error: 'Invalid registration token'
        }
      }
    }

    const messaging = getMessaging()

    const message = {
      token: payload.token,
      notification: {
        title: payload.title,
        body: payload.body,
        imageUrl: payload.imageUrl
      },
      data: {
        ...payload.data,
        action_url: payload.actionUrl || '',
        click_action: payload.actionUrl || ''
      },
      webpush: {
        fcmOptions: {
          link: payload.actionUrl
        },
        notification: {
          title: payload.title,
          body: payload.body,
          icon: '/icon-192x192.png',
          badge: '/icon-192x192.png',
          image: payload.imageUrl,
          requireInteraction: true,
          actions: payload.actionUrl ? [
            {
              action: 'open',
              title: 'Open',
              icon: '/icon-192x192.png'
            }
          ] : undefined
        }
      }
    }

    const messageId = await messaging.send(message)

    return {
      success: true,
      messageId
    }

  } catch (error) {
    console.error('FCM send error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }
  }
}

/**
 * Send batch FCM notifications
 */
export const sendBatchNotifications = async (payload: BatchNotificationPayload): Promise<{
  success: boolean
  successCount: number
  failureCount: number
  responses: any[]
  error?: string
}> => {
  try {
    // Check if Firebase is properly initialized
    if (!firebaseInitialized) {
      console.log('🔧 Firebase not configured - simulating batch notification send')
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 200))
      
      // Simulate success/failure for each token
      let successCount = 0
      let failureCount = 0
      const responses = payload.tokens.map(token => {
        const isValidToken = token && token.length > 10 && !token.includes('invalid')
        if (isValidToken) {
          successCount++
          return {
            success: true,
            messageId: `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          }
        } else {
          failureCount++
          return {
            success: false,
            error: 'Invalid registration token'
          }
        }
      })
      
      console.log(`✅ Mock batch notification: ${successCount} success, ${failureCount} failures`)
      
      return {
        success: failureCount === 0,
        successCount,
        failureCount,
        responses
      }
    }

    const messaging = getMessaging()

    const message = {
      notification: {
        title: payload.title,
        body: payload.body,
        imageUrl: payload.imageUrl
      },
      data: {
        ...payload.data,
        action_url: payload.actionUrl || '',
        click_action: payload.actionUrl || ''
      },
      webpush: {
        fcmOptions: {
          link: payload.actionUrl
        },
        notification: {
          title: payload.title,
          body: payload.body,
          icon: '/icon-192x192.png',
          badge: '/icon-192x192.png',
          image: payload.imageUrl,
          requireInteraction: true,
          actions: payload.actionUrl ? [
            {
              action: 'open',
              title: 'Open',
              icon: '/icon-192x192.png'
            }
          ] : undefined
        }
      },
      tokens: payload.tokens
    }

    const response = await messaging.sendEachForMulticast(message)

    return {
      success: response.failureCount === 0,
      successCount: response.successCount,
      failureCount: response.failureCount,
      responses: response.responses
    }

  } catch (error) {
    console.error('FCM batch send error:', error)
    return {
      success: false,
      successCount: 0,
      failureCount: payload.tokens.length,
      responses: [],
      error: error instanceof Error ? error.message : String(error)
    }
  }
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    // Validate request
    if (!body.token && !body.tokens) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Token or tokens array is required'
      })
    }

    if (!body.title || !body.body) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Title and body are required'
      })
    }

    // Handle batch notifications
    if (body.tokens && Array.isArray(body.tokens)) {
      const result = await sendBatchNotifications({
        tokens: body.tokens,
        title: body.title,
        body: body.body,
        data: body.data,
        imageUrl: body.imageUrl,
        actionUrl: body.actionUrl
      })

      return {
        success: result.success,
        successCount: result.successCount,
        failureCount: result.failureCount,
        error: result.error
      }
    }

    // Handle single notification
    const result = await sendNotification({
      token: body.token,
      title: body.title,
      body: body.body,
      data: body.data,
      imageUrl: body.imageUrl,
      actionUrl: body.actionUrl
    })

    return {
      success: result.success,
      messageId: result.messageId,
      error: result.error
    }

  } catch (error) {
    console.error('Notification API error:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: error instanceof Error ? error.message : 'Internal server error'
    })
  }
})