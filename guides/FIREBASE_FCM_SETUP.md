# 🔥 Firebase Cloud Messaging (FCM) Setup Guide

Complete guide to set up push notifications for Android, iOS, and Web using Firebase Cloud Messaging.

## 📋 Prerequisites

- Firebase project created: `zehna-notifications`
- Service account credentials (already obtained ✅)
- PocketBase server running
- Frontend app (web/mobile)

---

## 🎯 Step 1: Get Firebase Legacy Server Key

### Why Legacy API?
PocketBase's JavaScript environment has limited crypto support for proper OAuth2/JWT signing. The Legacy API is simpler and works perfectly for our needs.

### How to Get the Key:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **zehna-notifications**
3. Click ⚙️ **Project Settings** (top left)
4. Go to **Cloud Messaging** tab
5. Scroll down to **Cloud Messaging API (Legacy)**
6. Find **Server key** field
7. Click the copy icon 📋
8. **Important**: Keep this key secure!

### Enable Legacy API (if disabled):
If you see a message that the Legacy API is disabled:
1. Click the **"..."** menu next to Cloud Messaging API (Legacy)
2. Click **Enable**
3. Confirm the action

---

## 🔧 Step 2: Update PocketBase Hooks

### 2.1 Copy the Hook File

The file `POCKETBASE_NOTIFICATION_HOOKS.js` contains all the server-side logic.

1. Open `POCKETBASE_NOTIFICATION_HOOKS.js`
2. Find line 149: `const legacyServerKey = 'YOUR_LEGACY_SERVER_KEY_HERE'`
3. Replace `YOUR_LEGACY_SERVER_KEY_HERE` with your actual server key from Step 1
4. Copy the **entire file content**
5. Paste it into your PocketBase server's `pb_hooks/main.pb.js` file

### 2.2 Restart PocketBase

```bash
# Stop PocketBase (Ctrl+C if running)
# Then start it again
./pocketbase serve
```

You should see log messages indicating the cron jobs are initialized:
```
🔄 Processing scheduled notifications...
🔄 Checking inactive users...
```

---

## 🗄️ Step 3: Update PocketBase Schema

### 3.1 Update `users` Collection

Add these fields:

| Field Name | Type | Required | Default | Notes |
|------------|------|----------|---------|-------|
| `fcm_token` | Text | No | - | Stores device FCM token |
| `last_active_at` | Date | No | - | Tracks user activity |

**How to add:**
1. Go to PocketBase Admin Panel
2. Collections → `users`
3. Click "Fields" tab
4. Add each field with the settings above

### 3.2 Update `notifications` Collection

Add these fields:

| Field Name | Type | Required | Default | Notes |
|------------|------|----------|---------|-------|
| `fcm_sent` | Bool | No | false | Has notification been sent via FCM? |
| `fcm_sent_at` | Date | No | - | When was it sent? |
| `rule_id` | Text | No | - | Reference to notification rule |
| `announce_time` | Date | No | - | When to send the notification |

**If `notifications` collection doesn't exist**, import it from `notifications_pocketbase.json` first (see POCKETBASE_SETUP.md).

### 3.3 Create `notification_rules` Collection

Create a new collection named `notification_rules` with these fields:

| Field Name | Type | Required | Options | Notes |
|------------|------|----------|---------|-------|
| `name` | Text | Yes | - | Rule name (e.g., "6 hours inactive") |
| `description` | Text | No | - | Human-readable description |
| `trigger` | Select | Yes | `analysis_ready`, `session_complete`, `user_inactive` | What triggers this rule |
| `delay_minutes` | Number | Yes | - | Delay before sending (in minutes) |
| `enabled` | Bool | Yes | true | Is this rule active? |
| `priority` | Select | Yes | `low`, `medium`, `high`, `urgent` | Notification priority |
| `template` | JSON | Yes | - | Notification template with title, message, etc. |

**Template JSON structure:**
```json
{
  "title": "Notification Title",
  "message": "Notification body message",
  "action_url": "/path/to/action",
  "action_text": "Button Text"
}
```

---

## 🚀 Step 4: Initialize Default Rules

Make a POST request to initialize default notification rules:

### Using cURL:
```bash
curl -X POST https://your-pocketbase-url.com/api/init-notification-rules
```

### Using JavaScript (fetch):
```javascript
const response = await fetch('https://your-pocketbase-url.com/api/init-notification-rules', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
});

const result = await response.json();
console.log(result); // Should show: "Initialized X notification rules"
```

### Expected Response:
```json
{
  "success": true,
  "message": "Initialized 5 notification rules",
  "count": 5
}
```

This creates:
- **Analysis Ready** notifications (immediate + 30 min later)
- **User Inactive** notifications (6 hours, 24 hours)
- **Session Complete** notification

---

## 📱 Step 5: Frontend Integration

### 5.1 Install Firebase SDK

#### For Web (Nuxt 3):
```bash
npm install firebase
```

#### For Mobile (Capacitor):
```bash
npm install @capacitor/push-notifications
npm install firebase
```

### 5.2 Initialize Firebase (Web)

Create `plugins/firebase.client.ts`:

```typescript
import { initializeApp } from 'firebase/app'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'

export default defineNuxtPlugin(() => {
  const firebaseConfig = {
    apiKey: "AIzaSyBixyIOgzx6awRFV2hnE0-EptBgbb1bz4Q",
    authDomain: "zehna-notifications.firebaseapp.com",
    projectId: "zehna-notifications",
    storageBucket: "zehna-notifications.firebasestorage.app",
    messagingSenderId: "838017469547",
    appId: "1:838017469547:web:b4eefcc72df3405cbfb52e"
  }

  const app = initializeApp(firebaseConfig)
  const messaging = getMessaging(app)

  return {
    provide: {
      firebase: app,
      messaging
    }
  }
})
```

### 5.3 Create Firebase Service Worker

Create `public/firebase-messaging-sw.js`:

```javascript
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js')

firebase.initializeApp({
  apiKey: "AIzaSyBixyIOgzx6awRFV2hnE0-EptBgbb1bz4Q",
  authDomain: "zehna-notifications.firebaseapp.com",
  projectId: "zehna-notifications",
  storageBucket: "zehna-notifications.firebasestorage.app",
  messagingSenderId: "838017469547",
  appId: "1:838017469547:web:b4eefcc72df3405cbfb52e"
})

const messaging = firebase.messaging()

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Background message received:', payload)
  
  const notificationTitle = payload.notification.title
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon.png',
    badge: '/badge.png',
    data: payload.data
  }

  return self.registration.showNotification(notificationTitle, notificationOptions)
})

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  
  const actionUrl = event.notification.data?.actionUrl || '/'
  
  event.waitUntil(
    clients.openWindow(actionUrl)
  )
})
```

### 5.4 Request Permission & Save Token

Create a composable `composables/useNotifications.ts`:

```typescript
import { getToken, onMessage } from 'firebase/messaging'
import type { Messaging } from 'firebase/messaging'

export const useNotifications = () => {
  const { $messaging } = useNuxtApp()
  const pb = usePocketBase() // Your PocketBase client

  const requestPermission = async () => {
    try {
      const permission = await Notification.requestPermission()
      
      if (permission === 'granted') {
        console.log('✅ Notification permission granted')
        await saveFCMToken()
      } else {
        console.log('❌ Notification permission denied')
      }
    } catch (error) {
      console.error('Error requesting permission:', error)
    }
  }

  const saveFCMToken = async () => {
    try {
      const messaging = $messaging as Messaging
      
      const token = await getToken(messaging, {
        vapidKey: 'BNAoJ2HinfmirzJvdj5nKlX4k5mY_RO0Wz0CbFtfck6hApgo9rYxwhy6n0G8UW5n5c5nt-gsHRdsIx7LY80fmJ0'
      })

      console.log('📱 FCM Token:', token)

      // Save to PocketBase
      if (pb.authStore.model?.id) {
        await pb.collection('users').update(pb.authStore.model.id, {
          fcm_token: token,
          last_active_at: new Date().toISOString()
        })
        
        console.log('✅ FCM token saved to PocketBase')
      }

      return token
    } catch (error) {
      console.error('❌ Error getting FCM token:', error)
      throw error
    }
  }

  const listenToMessages = () => {
    const messaging = $messaging as Messaging
    
    onMessage(messaging, (payload) => {
      console.log('📬 Foreground message received:', payload)
      
      // Show notification in foreground
      if (payload.notification) {
        new Notification(payload.notification.title || 'New notification', {
          body: payload.notification.body,
          icon: '/icon.png',
          data: payload.data
        })
      }
    })
  }

  return {
    requestPermission,
    saveFCMToken,
    listenToMessages
  }
}
```

### 5.5 Use in Your App

In your login page or app layout:

```vue
<script setup lang="ts">
const { requestPermission, listenToMessages } = useNotifications()

onMounted(async () => {
  // Request permission on mount
  await requestPermission()
  
  // Listen for foreground messages
  listenToMessages()
})
</script>
```

---

## 🧪 Step 6: Testing

### Test 1: Manual Notification

Create a test notification in PocketBase Admin:

1. Go to `notifications` collection
2. Create new record:
   - `title`: "Test Notification"
   - `message`: "This is a test"
   - `recipient_user_id`: (select your user)
   - `announce_time`: (set to current time)
   - `type`: "info"
   - `priority`: "high"
3. Wait up to 1 minute
4. Check your device for the notification!

### Test 2: Schedule Analysis Notifications

Call the API after an analysis completes:

```javascript
const response = await fetch('https://your-pocketbase-url.com/api/schedule-analysis-notifications', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    userId: 'user_id_here',
    analysisId: 'analysis_id_here',
    notificationCount: 2 // Schedule 2 notifications
  })
});
```

### Test 3: Check Logs

In PocketBase console, you should see:

```
🔄 Processing scheduled notifications...
📬 Found 1 notifications to process
✅ Notification abc123 sent successfully to user xyz789
✅ Processed 1 notifications
```

---

## 🔍 Troubleshooting

### Issue: "No FCM token"
**Solution**: Make sure user has granted notification permission and token is saved to PocketBase.

### Issue: Notifications not sending
**Checklist**:
- [ ] Legacy Server Key is correct (line 149 in hooks file)
- [ ] Cloud Messaging API (Legacy) is enabled in Firebase
- [ ] PocketBase hooks file is properly saved and server restarted
- [ ] User has `fcm_token` in database
- [ ] `announce_time` is in the past

### Issue: "Invalid server key"
**Solution**: 
1. Go back to Firebase Console
2. Get a fresh server key
3. Make sure you copied the entire key (starts with `AAAA...`)
4. Update line 149 in `pb_hooks/main.pb.js`
5. Restart PocketBase

### Issue: Notifications work on web but not mobile
**Solution**: 
- For iOS: Follow Apple's APNs setup in Firebase
- For Android: Add `google-services.json` to your app
- Check Capacitor push notification setup

---

## 📊 Monitoring

### Check Notification Status

Query notifications that were sent:

```javascript
const sentNotifications = await pb.collection('notifications').getList(1, 50, {
  filter: 'fcm_sent = true',
  sort: '-fcm_sent_at'
})
```

### Check Pending Notifications

```javascript
const pending = await pb.collection('notifications').getList(1, 50, {
  filter: 'fcm_sent = false && announce_time <= @now',
  sort: '+announce_time'
})
```

---

## 🎉 Success Criteria

You've successfully set up Firebase notifications when:

- ✅ User receives test notification on their device
- ✅ Notifications work when app is closed
- ✅ Scheduled notifications arrive at correct times
- ✅ Analysis and session notifications are triggered
- ✅ Inactive user reminders are sent

---

## 📚 Additional Resources

- [Firebase Cloud Messaging Documentation](https://firebase.google.com/docs/cloud-messaging)
- [PocketBase Hooks Documentation](https://pocketbase.io/docs/js-overview/)
- [Web Push Notifications Guide](https://web.dev/push-notifications-overview/)

---

## 🔐 Security Best Practices

1. **Never expose your server key** in client-side code
2. Keep the server key in `pb_hooks/main.pb.js` only
3. Validate user permissions before sending notifications
4. Rate-limit notification creation to prevent spam
5. Use HTTPS for all PocketBase connections

---

## 🚀 Next Steps

After successful setup:

1. Customize notification templates in `notification_rules`
2. Add more trigger types based on your app's needs
3. Implement notification preferences for users
4. Add analytics to track notification engagement
5. Set up A/B testing for notification content

---

Good luck! 🎊