import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import fetch from 'node-fetch'

admin.initializeApp()

// PocketBase configuration
const POCKETBASE_URL = 'https://pocket.zehna.ir'
// Store credentials in Firebase config:
// firebase functions:config:set pocketbase.admin_email="admin@zehna.ir" pocketbase.admin_password="your-password"
// Use environment variables first, fallback to functions.config()
const POCKETBASE_ADMIN_EMAIL =
  process.env.POCKETBASE_ADMIN_EMAIL ||
  functions.config().pocketbase?.admin_email
const POCKETBASE_ADMIN_PASSWORD =
  process.env.POCKETBASE_ADMIN_PASSWORD ||
  functions.config().pocketbase?.admin_password

interface PocketBaseAuthResponse {
  token: string
  admin: any
}

interface NotificationRecord {
  id: string
  title: string
  message: string
  complete_message?: string
  type: 'info' | 'success' | 'warning' | 'error' | 'system'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  recipient_user_id: string
  action_url?: string
  action_text?: string
  announce_time?: string
  fcm_sent: boolean
  fcm_sent_at?: string
  rule_id?: string
}

interface UserRecord {
  id: string
  fcm_token?: string
  last_active_at?: string
  meta?: {
    name?: string
    email?: string
  }
}

// Authenticate with PocketBase admin
async function getPocketBaseAuth(): Promise<string> {
  if (!POCKETBASE_ADMIN_EMAIL || !POCKETBASE_ADMIN_PASSWORD) {
    throw new Error(
      'PocketBase credentials not configured. Set POCKETBASE_ADMIN_EMAIL and POCKETBASE_ADMIN_PASSWORD environment variables in Firebase Console.',
    )
  }

  const response = await fetch(
    `${POCKETBASE_URL}/api/admins/auth-with-password`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identity: POCKETBASE_ADMIN_EMAIL,
        password: POCKETBASE_ADMIN_PASSWORD,
      }),
    },
  )

  if (!response.ok) {
    throw new Error(`PocketBase auth failed: ${response.statusText}`)
  }

  const data = (await response.json()) as PocketBaseAuthResponse
  return data.token
}

// Send FCM notification to a user
async function sendFCMNotification(
  notification: NotificationRecord,
  pbToken: string,
): Promise<void> {
  try {
    // Get user's FCM token
    const userResponse = await fetch(
      `${POCKETBASE_URL}/api/collections/users/records/${notification.recipient_user_id}`,
      {
        headers: { Authorization: `Bearer ${pbToken}` },
      },
    )

    if (!userResponse.ok) {
      console.warn(
        `User ${notification.recipient_user_id} not found, skipping notification`,
      )
      return
    }

    const user = (await userResponse.json()) as UserRecord

    if (!user.fcm_token) {
      console.log(
        `User ${user.id} has no FCM token, skipping notification ${notification.id}`,
      )
      return
    }

    // Prepare FCM message
    const message = {
      token: user.fcm_token,
      notification: {
        title: notification.title,
        body: notification.message,
        icon: '/pwa-192x192.png',
      },
      data: {
        notificationId: notification.id,
        type: notification.type,
        priority: notification.priority,
        actionUrl: notification.action_url || '/notifications',
        actionText: notification.action_text || 'مشاهده',
      },
      webpush: {
        fcmOptions: {
          link: notification.action_url || '/notifications',
        },
        notification: {
          icon: '/pwa-192x192.png',
          badge: '/favicon.ico',
          requireInteraction:
            notification.priority === 'high' ||
            notification.priority === 'urgent',
        },
      },
    }

    // Send via Firebase Cloud Messaging
    await admin.messaging().send(message)

    // Mark as sent in PocketBase
    await fetch(
      `${POCKETBASE_URL}/api/collections/notifications/records/${notification.id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${pbToken}`,
        },
        body: JSON.stringify({
          fcm_sent: true,
          fcm_sent_at: new Date().toISOString(),
        }),
      },
    )

    console.log(
      `✅ Notification ${notification.id} sent successfully to user ${user.id}`,
    )
  } catch (error: any) {
    console.error(`❌ Error sending notification ${notification.id}:`, error)

    // If token is invalid, remove it from user
    if (
      error.code === 'messaging/invalid-registration-token' ||
      error.code === 'messaging/registration-token-not-registered'
    ) {
      console.log(
        `Removing invalid FCM token for user ${notification.recipient_user_id}`,
      )
      await fetch(
        `${POCKETBASE_URL}/api/collections/users/records/${notification.recipient_user_id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${pbToken}`,
          },
          body: JSON.stringify({ fcm_token: null }),
        },
      )
    }
  }
}

// Create notification in PocketBase
async function createNotification(
  data: Partial<NotificationRecord>,
  pbToken: string,
): Promise<void> {
  try {
    await fetch(`${POCKETBASE_URL}/api/collections/notifications/records`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${pbToken}`,
      },
      body: JSON.stringify({
        ...data,
        fcm_sent: false,
      }),
    })

    console.log(`✅ Notification created for user ${data.recipient_user_id}`)
  } catch (error) {
    console.error(`❌ Error creating notification:`, error)
  }
}

// ==============================================================================
// SCHEDULED FUNCTION 1: Process Scheduled Notifications
// Runs every minute to check for notifications that need to be sent
// ==============================================================================
export const processScheduledNotifications = functions.pubsub
  .schedule('every 1 minutes')
  .timeZone('Asia/Tehran')
  .onRun(async (context) => {
    console.log('🔄 Processing scheduled notifications...')

    try {
      const token = await getPocketBaseAuth()

      // Get notifications that are scheduled for now or earlier and haven't been sent
      const now = new Date().toISOString()
      const response = await fetch(
        `${POCKETBASE_URL}/api/collections/notifications/records?` +
          `filter=(announce_time<="${now}" && fcm_sent=false)&perPage=100`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      const data = await response.json()
      const notifications = (data.items || []) as NotificationRecord[]

      console.log(`📬 Found ${notifications.length} notifications to send`)

      if (notifications.length === 0) {
        return null
      }

      // Send each notification via FCM
      for (const notification of notifications) {
        await sendFCMNotification(notification, token)
      }

      console.log(`✅ Processed ${notifications.length} notifications`)
      return null
    } catch (error) {
      console.error('❌ Error processing scheduled notifications:', error)
      throw error
    }
  })

// ==============================================================================
// SCHEDULED FUNCTION 2: Check Inactive Users
// Runs every hour to check for inactive users and send reminders
// ==============================================================================
export const checkInactiveUsers = functions.pubsub
  .schedule('every 1 hours')
  .timeZone('Asia/Tehran')
  .onRun(async (context) => {
    console.log('🔄 Checking inactive users...')

    try {
      const token = await getPocketBaseAuth()

      // Get all active notification rules for user inactivity
      const rulesResponse = await fetch(
        `${POCKETBASE_URL}/api/collections/notification_rules/records?` +
          `filter=(trigger="user_inactive" && enabled=true)`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      const rulesData = await rulesResponse.json()
      const rules = rulesData.items || []

      console.log(`📋 Found ${rules.length} active inactivity rules`)

      let totalNotificationsCreated = 0

      // Check each rule separately
      for (const rule of rules) {
        const minutesAgo = rule.delay_minutes
        const checkTime = new Date(
          Date.now() - minutesAgo * 60 * 1000,
        ).toISOString()

        // Get users inactive for this specific duration
        const usersResponse = await fetch(
          `${POCKETBASE_URL}/api/collections/users/records?` +
            `filter=(last_active_at<="${checkTime}" && fcm_token!="" && fcm_token!=null)&perPage=500`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )

        const usersData = await usersResponse.json()
        const users = (usersData.items || []) as UserRecord[]

        console.log(
          `👥 Found ${users.length} users inactive for ${rule.name} (${minutesAgo} minutes)`,
        )

        // Create notification for each user based on this rule
        for (const user of users) {
          // Check if we already sent this specific rule to this user recently
          const existingNotifResponse = await fetch(
            `${POCKETBASE_URL}/api/collections/notifications/records?` +
              `filter=(recipient_user_id="${user.id}" && rule_id="${rule.id}" && created>="${checkTime}")`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          )

          const existingNotifData = await existingNotifResponse.json()

          // Only send if we haven't sent this rule notification already
          if (existingNotifData.items.length === 0) {
            await createNotification(
              {
                title: rule.template.title,
                message: rule.template.message,
                type: 'info',
                priority: rule.priority,
                recipient_user_id: user.id,
                action_url: rule.template.action_url || '/dashboard',
                action_text: rule.template.action_text || 'بازگشت',
                announce_time: new Date().toISOString(),
                rule_id: rule.id,
              },
              token,
            )
            totalNotificationsCreated++
          }
        }
      }

      console.log(
        `✅ Created ${totalNotificationsCreated} inactivity notifications`,
      )
      return null
    } catch (error) {
      console.error('❌ Error checking inactive users:', error)
      throw error
    }
  })

// ==============================================================================
// CALLABLE FUNCTION: Send Analysis Notifications
// Called from frontend when AI analysis is complete
// ==============================================================================
export const sendAnalysisNotifications = functions.https.onCall(
  async (data, context) => {
    const { userId, analysisId, notificationCount = 5 } = data

    console.log(
      `📊 Sending ${notificationCount} analysis notifications for ${analysisId}`,
    )

    // Verify authentication
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'User must be authenticated',
      )
    }

    try {
      const token = await getPocketBaseAuth()

      // Get enabled analysis notification rules
      const rulesResponse = await fetch(
        `${POCKETBASE_URL}/api/collections/notification_rules/records?` +
          `filter=(trigger="analysis_ready" && enabled=true)&sort=delay_minutes`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      const rulesData = await rulesResponse.json()
      const rules = rulesData.items || []

      // Limit to requested count
      const selectedRules = rules.slice(0, notificationCount)

      console.log(`📋 Creating ${selectedRules.length} analysis notifications`)

      // Create notifications for each rule
      for (const rule of selectedRules) {
        const scheduleTime = new Date(
          Date.now() + rule.delay_minutes * 60 * 1000,
        )

        // Replace template variables
        const title = rule.template.title.replace(
          /\{\{analysisId\}\}/g,
          analysisId,
        )
        const message = rule.template.message.replace(
          /\{\{analysisId\}\}/g,
          analysisId,
        )
        const actionUrl = rule.template.action_url?.replace(
          /\{\{analysisId\}\}/g,
          analysisId,
        )

        await createNotification(
          {
            title,
            message,
            type: 'info',
            priority: rule.priority,
            recipient_user_id: userId,
            action_url: actionUrl,
            action_text: rule.template.action_text,
            announce_time: scheduleTime.toISOString(),
            rule_id: rule.id,
          },
          token,
        )
      }

      return { success: true, count: selectedRules.length }
    } catch (error: any) {
      console.error('❌ Error sending analysis notifications:', error)
      throw new functions.https.HttpsError(
        'internal',
        'Failed to send notifications',
        error.message,
      )
    }
  },
)

// ==============================================================================
// CALLABLE FUNCTION: Send Session Complete Notifications
// Called from frontend when therapy session is completed
// ==============================================================================
export const sendSessionNotifications = functions.https.onCall(
  async (data, context) => {
    const { userId, sessionId } = data

    console.log(`🎭 Sending session completion notifications for ${sessionId}`)

    // Verify authentication
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'User must be authenticated',
      )
    }

    try {
      const token = await getPocketBaseAuth()

      // Get enabled session notification rules
      const rulesResponse = await fetch(
        `${POCKETBASE_URL}/api/collections/notification_rules/records?` +
          `filter=(trigger="session_complete" && enabled=true)&sort=delay_minutes`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      const rulesData = await rulesResponse.json()
      const rules = rulesData.items || []

      console.log(
        `📋 Creating ${rules.length} session completion notifications`,
      )

      // Create notifications for each rule
      for (const rule of rules) {
        const scheduleTime = new Date(
          Date.now() + rule.delay_minutes * 60 * 1000,
        )

        // Replace template variables
        const title = rule.template.title.replace(
          /\{\{sessionId\}\}/g,
          sessionId,
        )
        const message = rule.template.message.replace(
          /\{\{sessionId\}\}/g,
          sessionId,
        )
        const actionUrl = rule.template.action_url?.replace(
          /\{\{sessionId\}\}/g,
          sessionId,
        )

        await createNotification(
          {
            title,
            message,
            type: 'info',
            priority: rule.priority,
            recipient_user_id: userId,
            action_url: actionUrl,
            action_text: rule.template.action_text,
            announce_time: scheduleTime.toISOString(),
            rule_id: rule.id,
          },
          token,
        )
      }

      return { success: true, count: rules.length }
    } catch (error: any) {
      console.error('❌ Error sending session notifications:', error)
      throw new functions.https.HttpsError(
        'internal',
        'Failed to send notifications',
        error.message,
      )
    }
  },
)
