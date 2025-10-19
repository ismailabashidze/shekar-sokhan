# 🚀 Firebase FCM - Quick Start Guide

## ⚡ 5-Minute Setup

### Step 1: Get Your Firebase Server Key (2 min)

1. Go to: https://console.firebase.google.com/
2. Select: **zehna-notifications**
3. Click: ⚙️ **Project Settings** → **Cloud Messaging** tab
4. Find: **"Server key"** under "Cloud Messaging API (Legacy)"
5. Click: 📋 Copy button
6. Keep it safe!

**Example:** `AAAAxxxxxxx:APA91bHxxxxxxxxxxxxxxxxxxxxxxxxx`

---

### Step 2: Update Server File (1 min)

1. Open: `POCKETBASE_SERVER_READY.js`
2. Find line 23: `const FIREBASE_LEGACY_SERVER_KEY = 'YOUR_LEGACY_SERVER_KEY_HERE'`
3. Replace with your actual key: `const FIREBASE_LEGACY_SERVER_KEY = 'AAAAxxxxxxx...'`
4. Copy **entire file** content
5. Paste into your PocketBase server: `pb_hooks/main.pb.js`
6. Restart PocketBase

---

### Step 3: Update Database Schema (2 min)

#### A) Add to `users` collection:
```
fcm_token       (text, optional)
last_active_at  (date, optional)
```

#### B) Add to `notifications` collection:
```
fcm_sent        (bool, default: false)
fcm_sent_at     (date, optional)
rule_id         (text, optional)
announce_time   (date, optional)
```

#### C) Create `notification_rules` collection:
```
name            (text, required)
description     (text, optional)
trigger         (select: analysis_ready, session_complete, user_inactive)
delay_minutes   (number, required)
enabled         (bool, default: true)
priority        (select: low, medium, high, urgent)
template        (json, required)
```

---

### Step 4: Initialize Rules (30 sec)

Make a POST request:
```bash
curl -X POST https://your-pocketbase-url.com/api/init-notification-rules
```

Expected response:
```json
{
  "success": true,
  "message": "Initialized 5 notification rules",
  "count": 5
}
```

---

### Step 5: Test! (30 sec)

1. Create a test notification in PocketBase Admin
2. Set `announce_time` to current time
3. Set `recipient_user_id` to your user
4. Wait 1 minute
5. 🎉 Check your device!

---

## 📱 Frontend Integration

### Install Firebase:
```bash
npm install firebase
```

### Create plugin (`plugins/firebase.client.ts`):
```typescript
import { initializeApp } from 'firebase/app'
import { getMessaging } from 'firebase/messaging'

export default defineNuxtPlugin(() => {
  const app = initializeApp({
    apiKey: "AIzaSyBixyIOgzx6awRFV2hnE0-EptBgbb1bz4Q",
    authDomain: "zehna-notifications.firebaseapp.com",
    projectId: "zehna-notifications",
    storageBucket: "zehna-notifications.firebasestorage.app",
    messagingSenderId: "838017469547",
    appId: "1:838017469547:web:b4eefcc72df3405cbfb52e"
  })

  return {
    provide: {
      firebase: app,
      messaging: getMessaging(app)
    }
  }
})
```

### Request permission & save token:
```typescript
import { getToken } from 'firebase/messaging'

const { $messaging } = useNuxtApp()
const pb = usePocketBase()

// Request permission
const permission = await Notification.requestPermission()

if (permission === 'granted') {
  // Get token
  const token = await getToken($messaging, {
    vapidKey: 'BNAoJ2HinfmirzJvdj5nKlX4k5mY_RO0Wz0CbFtfck6hApgo9rYxwhy6n0G8UW5n5c5nt-gsHRdsIx7LY80fmJ0'
  })
  
  // Save to PocketBase
  await pb.collection('users').update(userId, {
    fcm_token: token
  })
}
```

---

## 🎯 Common Use Cases

### Schedule notifications after analysis:
```javascript
await fetch('/api/schedule-analysis-notifications', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 'user_id',
    analysisId: 'analysis_id',
    notificationCount: 2
  })
})
```

### Schedule notifications after session:
```javascript
await fetch('/api/schedule-session-notifications', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 'user_id',
    sessionId: 'session_id'
  })
})
```

---

## 🔍 Troubleshooting

| Problem | Solution |
|---------|----------|
| No notifications | Check server key is correct |
| Invalid key error | Get fresh key from Firebase Console |
| Token not saved | User must grant notification permission |
| Works on web, not mobile | Check platform-specific setup (APNs/Android) |

---

## 📚 Full Documentation

- **Complete Guide:** `guides/FIREBASE_FCM_SETUP.md`
- **Server File:** `POCKETBASE_SERVER_READY.js`
- **Original Hooks:** `POCKETBASE_NOTIFICATION_HOOKS.js`

---

## ✅ Success Checklist

- [ ] Firebase server key added to line 23
- [ ] File copied to `pb_hooks/main.pb.js`
- [ ] PocketBase restarted
- [ ] Database schema updated
- [ ] Rules initialized via API
- [ ] Test notification received on device
- [ ] Frontend plugin created
- [ ] User token saved to database

---

## 🎊 You're Done!

Your app now supports:
- ✅ Push notifications when app is closed
- ✅ Scheduled notifications
- ✅ Analysis completion alerts
- ✅ Session completion alerts
- ✅ Inactive user reminders
- ✅ Android, iOS, and Web support

---

**Need help?** Check `guides/FIREBASE_FCM_SETUP.md` for detailed explanations.