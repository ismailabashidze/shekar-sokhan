# 🔥 Complete Firebase Notifications Setup Guide

## Complete step-by-step guide to enable push notifications even when your PWA/web app is closed.

---

## 📋 Overview

This guide covers:
- ✅ Server setup (Token Server + PocketBase)
- ✅ Database schema configuration
- ✅ Frontend integration (PWA)
- ✅ Service worker setup
- ✅ Testing and verification

**Time Required:** ~30 minutes

---

## 🎯 PART 1: Server Setup (15 minutes)

### Step 1.1: Deploy FCM Token Server

**On your server (via SSH):**

```bash
# Navigate to your server directory
cd /path/to/your/server

# Create token server directory
mkdir fcm-token-server
cd fcm-token-server
```

**Create `server.js` file:**

Copy the entire content from `front/fcm-token-server/server.js` to this file.

**Start the server:**

```bash
# For testing
node server.js

# For production (keeps running)
npm install -g pm2
pm2 start server.js --name fcm-token-server
pm2 startup
pm2 save
```

**Verify it's running:**

```bash
curl http://localhost:3001/health
# Expected: {"status":"ok","service":"fcm-token-server"}
```

✅ **Checkpoint:** You should see: `🚀 FCM Token Server running on http://localhost:3001`

---

### Step 1.2: Update PocketBase Hooks

**On your server:**

```bash
cd /path/to/pocketbase
nano pb_hooks/main.pb.js
```

**Copy content from:** `front/POCKETBASE_WITH_TOKEN_SERVER.js`

**Paste into:** `pb_hooks/main.pb.js`

**Restart PocketBase:**

```bash
# If using PM2:
pm2 restart pocketbase

# If running directly:
# Stop with Ctrl+C, then:
./pocketbase serve
```

✅ **Checkpoint:** Check logs for: `🔄 Processing scheduled notifications...`

---

### Step 1.3: Verify Server Communication

```bash
# Test token server
curl http://localhost:3001/health

# Test token generation
curl http://localhost:3001/token

# Check PocketBase logs
pm2 logs pocketbase
# or
tail -f pocketbase.log
```

✅ **Checkpoint:** Token server returns access token, PocketBase shows cron jobs running.

---

## 🗄️ PART 2: Database Schema Setup (10 minutes)

### Step 2.1: Update `users` Collection

1. Go to PocketBase Admin: `https://your-domain.com/_/`
2. Login with admin credentials
3. Navigate to: **Collections** → **users**
4. Click: **Fields** tab
5. Add these fields:

| Field Name | Type | Required | Options |
|------------|------|----------|---------|
| `fcm_token` | Text | ❌ No | Max length: 500 |
| `last_active_at` | Date | ❌ No | - |

Click **Save changes**

---

### Step 2.2: Update `notifications` Collection

Navigate to: **Collections** → **notifications** → **Fields**

Add these fields:

| Field Name | Type | Required | Default |
|------------|------|----------|---------|
| `fcm_sent` | Bool | ❌ No | `false` |
| `fcm_sent_at` | Date | ❌ No | - |
| `rule_id` | Text | ❌ No | - |
| `announce_time` | Date | ❌ No | - |

Click **Save changes**

---

### Step 2.3: Create `notification_rules` Collection

1. Click: **New Collection**
2. Name: `notification_rules`
3. Type: **Base collection**
4. Add these fields:

| Field Name | Type | Required | Options/Notes |
|------------|------|----------|---------------|
| `name` | Text | ✅ Yes | Max: 100 |
| `description` | Text | ❌ No | Max: 500 |
| `trigger` | Select | ✅ Yes | Values: `analysis_ready`, `session_complete`, `user_inactive` |
| `delay_minutes` | Number | ✅ Yes | Min: 0, Max: 525600 (1 year) |
| `enabled` | Bool | ✅ Yes | Default: `true` |
| `priority` | Select | ✅ Yes | Values: `low`, `medium`, `high`, `urgent` |
| `template` | JSON | ✅ Yes | - |

**Template JSON Structure:**
```json
{
  "title": "Notification title",
  "message": "Notification message body",
  "action_url": "/path/to/action",
  "action_text": "Button text"
}
```

Click **Create**

---

### Step 2.4: Initialize Default Notification Rules

**Make API call to initialize 5 default rules:**

```bash
curl -X POST https://your-pocketbase-domain.com/api/init-notification-rules
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Initialized 5 notification rules",
  "count": 5
}
```

**Verify in Admin Panel:**
- Go to **Collections** → **notification_rules**
- You should see 5 records

✅ **Checkpoint:** 5 notification rules created successfully

---

## 📱 PART 3: Frontend Integration (10 minutes)

### Step 3.1: Verify Files Exist

Check these files are present in your frontend:

- ✅ `plugins/firebase.client.ts` 
- ✅ `composables/useNotifications.ts`
- ✅ `.app/public/firebase-messaging-sw.js`

If missing, they need to be created (see separate guide).

---

### Step 3.2: Install Dependencies

```bash
cd front
npm install firebase
```

---

### Step 3.3: Register Service Worker

**Update your `nuxt.config.ts`:**

```typescript
export default defineNuxtConfig({
  // ... other config
  
  app: {
    head: {
      script: [
        // Register service worker
        {
          innerHTML: `
            if ('serviceWorker' in navigator) {
              navigator.serviceWorker.register('/firebase-messaging-sw.js')
                .then(registration => {
                  console.log('✅ Service Worker registered:', registration);
                })
                .catch(err => {
                  console.error('❌ Service Worker registration failed:', err);
                });
            }
          `,
          type: 'text/javascript',
        },
      ],
    },
  },
})
```

---

### Step 3.4: Initialize Notifications on Login

**In your login component or layout:**

```vue
<script setup lang="ts">
const { initialize, requestPermission } = useNotifications()

// After user logs in
onMounted(async () => {
  // Check if already has permission
  const initialized = await initialize()
  
  if (!initialized) {
    // Ask user for permission
    setTimeout(() => {
      requestPermission()
    }, 2000) // Wait 2 seconds before asking
  }
})
</script>
```

---

### Step 3.5: Update Activity Tracking

**Track user activity to enable inactive user notifications:**

```vue
<script setup lang="ts">
const { updateLastActive } = useNotifications()

// Update activity on user interactions
onMounted(() => {
  // Track mouse movements
  window.addEventListener('mousemove', updateLastActive)
  
  // Track keyboard
  window.addEventListener('keypress', updateLastActive)
  
  // Track clicks
  window.addEventListener('click', updateLastActive)
  
  // Update every 5 minutes
  setInterval(updateLastActive, 5 * 60 * 1000)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', updateLastActive)
  window.removeEventListener('keypress', updateLastActive)
  window.removeEventListener('click', updateLastActive)
})
</script>
```

---

## 🧪 PART 4: Testing (5 minutes)

### Test 1: Permission Request

1. Open your app in browser
2. Login with a user account
3. You should see browser notification permission prompt
4. Click **Allow**

✅ **Checkpoint:** Permission granted, no errors in console

---

### Test 2: Token Saved to Database

1. Open PocketBase Admin
2. Go to **Collections** → **users**
3. Find your logged-in user
4. Check `fcm_token` field has a value
5. Check `last_active_at` is recent

✅ **Checkpoint:** Token exists and is a long string starting with letters

---

### Test 3: Manual Notification

**Create test notification in PocketBase:**

1. Go to **Collections** → **notifications**
2. Click **New record**
3. Fill in:
   - `title`: "Test Notification"
   - `message`: "This is a test from Firebase!"
   - `type`: "info"
   - `priority`: "high"
   - `recipient_user_id`: (select your user)
   - `announce_time`: (set to current time or 1 minute in future)
   - `is_read`: false
   - `fcm_sent`: false
4. Click **Create**

**Wait 1-2 minutes** (cron runs every minute)

✅ **Checkpoint:** 
- Notification appears on your device
- In PocketBase, `fcm_sent` changed to `true`
- `fcm_sent_at` has timestamp

---

### Test 4: Background Notifications

1. **Close your browser** completely
2. Create another test notification in PocketBase
3. Wait 1-2 minutes
4. Check your device

✅ **Checkpoint:** Notification appears even with app closed! 🎉

---

### Test 5: Schedule Notifications After Analysis

**Call the API after analysis completes:**

```typescript
// In your analysis completion handler
await $fetch('/api/schedule-analysis-notifications', {
  method: 'POST',
  body: {
    userId: 'user_id_here',
    analysisId: 'analysis_id_here',
    notificationCount: 2 // Schedule 2 notifications
  }
})
```

✅ **Checkpoint:** Multiple notifications scheduled with delays

---

## 📊 Monitoring & Debugging

### Check Logs

**Token Server:**
```bash
pm2 logs fcm-token-server
```

**PocketBase:**
```bash
pm2 logs pocketbase
```

**Frontend Console:**
Press F12 in browser, check Console tab

---

### Common Log Messages

**✅ Success Messages:**
```
🔄 Processing scheduled notifications...
📬 Found 1 notifications to process
✅ Notification abc123 sent successfully to user xyz789
✅ Processed 1 notifications
```

**❌ Error Messages:**
```
⚠️  User xyz has no FCM token
❌ Failed to send notification: 404
❌ Error getting access token
```

---

### Verify Notification Flow

**Check notification status:**

```sql
-- In PocketBase Collections > notifications
SELECT id, title, fcm_sent, fcm_sent_at, announce_time 
FROM notifications 
ORDER BY created DESC
```

**Check user tokens:**

```sql
-- In PocketBase Collections > users
SELECT id, email, fcm_token, last_active_at 
FROM users
```

---

## 🔍 Troubleshooting

### Issue: "Connection refused to localhost:3001"

**Solution:**
- Check token server is running: `pm2 status`
- Restart it: `pm2 restart fcm-token-server`
- Check firewall isn't blocking port 3001

---

### Issue: "No FCM token for user"

**Solution:**
- User must grant notification permission
- Check browser console for errors
- Verify service worker is registered
- Try requesting permission again

---

### Issue: "Service worker registration failed"

**Solution:**
- Check `firebase-messaging-sw.js` is in `public/` folder
- Verify Firebase config in service worker matches plugin
- Check browser supports service workers
- Try in HTTPS (required for production)

---

### Issue: "Notifications not appearing"

**Solution:**
1. Check browser notification settings
2. Verify `fcm_token` is saved in database
3. Check PocketBase logs for send attempts
4. Verify token server is generating access tokens
5. Check Firebase Console for delivery reports

---

### Issue: "Token expired or invalid"

**Solution:**
- Token server auto-refreshes tokens
- Wait 1 minute and try again
- Check Firebase service account is valid
- Verify project ID matches

---

## 🚀 Production Checklist

### Security

- [ ] Token server not exposed to public internet
- [ ] HTTPS enabled for frontend
- [ ] Service worker only on HTTPS
- [ ] Firebase credentials secure on server
- [ ] PocketBase authentication enabled

### Performance

- [ ] Token server using PM2 or similar
- [ ] Token caching enabled (auto in code)
- [ ] Notification rules optimized (not too many)
- [ ] User activity updates throttled

### Monitoring

- [ ] PM2 logs being collected
- [ ] Error tracking enabled
- [ ] FCM delivery reports monitored
- [ ] Database backups configured

---

## 📈 Usage Examples

### Schedule Analysis Notifications

```typescript
await pb.send('/api/schedule-analysis-notifications', {
  method: 'POST',
  body: JSON.stringify({
    userId: currentUser.id,
    analysisId: completedAnalysis.id,
    notificationCount: 3
  })
})
```

### Schedule Session Notifications

```typescript
await pb.send('/api/schedule-session-notifications', {
  method: 'POST',
  body: JSON.stringify({
    userId: currentUser.id,
    sessionId: completedSession.id
  })
})
```

### Get Unread Notifications

```typescript
const { getUnreadNotifications } = useNotifications()
const unread = await getUnreadNotifications()
console.log(`${unread.length} unread notifications`)
```

### Mark as Read

```typescript
const { markAsRead } = useNotifications()
await markAsRead(notificationId)
```

---

## 🎊 Success Criteria

You've successfully completed the setup when:

- ✅ Token server running without errors
- ✅ PocketBase cron jobs processing notifications
- ✅ User can grant notification permission
- ✅ FCM token saved to database
- ✅ Test notifications delivered
- ✅ **Notifications work with app closed** 🎉
- ✅ Scheduled notifications arrive on time
- ✅ Inactive user reminders working

---

## 📚 Additional Resources

- **Token Server Docs:** `fcm-token-server/README.md`
- **Quick Start:** `guides/FCM_V1_QUICK_START.md`
- **Full Guide:** `guides/FIREBASE_FCM_SETUP.md`
- **Firebase Console:** https://console.firebase.google.com/
- **PocketBase Docs:** https://pocketbase.io/docs/

---

## 🆘 Need Help?

1. Check troubleshooting section above
2. Review logs (token server + PocketBase)
3. Verify all checkpoints passed
4. Check Firebase Console for errors
5. Test with different users/devices

---

## 🎯 Next Steps

After successful setup:

1. **Customize notification templates** in `notification_rules`
2. **Add more trigger types** based on your app's needs
3. **Implement user preferences** for notification types
4. **Add analytics** to track notification engagement
5. **A/B test** different notification content

---

**Congratulations! Your PWA now has full push notification support!** 🎉

Even when users close the app, they'll stay connected with timely, relevant notifications powered by Firebase Cloud Messaging.