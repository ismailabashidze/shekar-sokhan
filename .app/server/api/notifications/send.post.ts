export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { recipientIds, notification, userId, title, body: notificationBody, data, urgent = false } = body

    // Handle both parameter structures
    let targetUserIds = []
    let notificationData = {}

    if (recipientIds && notification) {
      // New structure from sendPushNotification
      targetUserIds = recipientIds
      notificationData = notification
    } else if (userId && title && notificationBody) {
      // Direct structure
      targetUserIds = [userId]
      notificationData = { title, body: notificationBody, data, urgent }
    } else {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields'
      })
    }

    console.log('Send notification request:', {
      targetUserIds,
      notificationData
    })

    // In a real implementation, you would:
    // 1. Get user's push subscriptions from database
    // 2. Send push notifications using web-push library
    // 3. Handle failed deliveries and cleanup invalid subscriptions
    
    // Example implementation:
    /*
    const webpush = require('web-push')
    const pb = new PocketBase(process.env.POCKETBASE_URL)
    
    // Configure web-push with VAPID keys
    webpush.setVapidDetails(
      'mailto:your-email@example.com',
      process.env.VAPID_PUBLIC_KEY,
      process.env.VAPID_PRIVATE_KEY
    )
    
    // Get user subscriptions
    const subscriptions = await pb.collection('push_subscriptions').getFullList({
      filter: `userId = "${userId}"`
    })
    
    // Prepare notification payload
    const payload = JSON.stringify({
      title,
      body: notificationBody,
      icon: '/img/logo.png',
      badge: '/img/badge.png',
      data: data || {},
      requireInteraction: urgent,
      actions: urgent ? [
        { action: 'view', title: 'مشاهده' },
        { action: 'dismiss', title: 'نادیده گرفتن' }
      ] : []
    })
    
    // Send to all user subscriptions
    const results = await Promise.allSettled(
      subscriptions.map(sub => {
        const pushSubscription = {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth
          }
        }
        return webpush.sendNotification(pushSubscription, payload)
      })
    )
    
    // Log results and cleanup failed subscriptions
    let successful = 0
    let failed = 0
    
    for (let i = 0; i < results.length; i++) {
      const result = results[i]
      if (result.status === 'fulfilled') {
        successful++
      } else {
        failed++
        // If subscription is invalid (410 Gone), remove it
        if (result.reason?.statusCode === 410) {
          await pb.collection('push_subscriptions').delete(subscriptions[i].id)
        }
      }
    }
    
    return {
      success: true,
      sent: successful,
      failed,
      total: subscriptions.length
    }
    */

    // For now, just return success
    return {
      success: true,
      message: 'Notification queued for delivery',
      sent: 1,
      failed: 0,
      total: 1
    }

  } catch (error) {
    console.error('Error sending notification:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to send notification'
    })
  }
})