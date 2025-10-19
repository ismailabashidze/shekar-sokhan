# 🚀 FCM v1 API - Quick Start (3 Steps)

**Your Firebase Legacy API is disabled. No problem! Here's the modern solution.**

---

## ⚡ What You Need

You already have:
- ✅ Firebase project: `zehna-notifications`
- ✅ Service account credentials (configured in the code)

---

## 📝 Step 1: Start the Token Server (1 minute)

The token server handles OAuth2 authentication for Firebase.

```bash
# Navigate to the token server directory
cd fcm-token-server

# Start the server (no installation needed!)
node server.js
```

You should see:
```
🚀 FCM Token Server running on http://localhost:3001

Available endpoints:
  GET  /token  - Get OAuth2 access token
  POST /send   - Send FCM notification
  GET  /health - Health check
```

**Keep this running!** Open a new terminal for the next steps.

---

## 📝 Step 2: Copy to PocketBase (1 minute)

1. Open file: `POCKETBASE_WITH_TOKEN_SERVER.js`
2. Copy **entire content**
3. Paste into your PocketBase server: `pb_hooks/main.pb.js`
4. Restart PocketBase

That's it! The hooks are configured and ready.

---

## 📝 Step 3: Update Database & Test (2 minutes)

### A) Update PocketBase Collections

**In `users` collection, add:**
- `fcm_token` (text, optional)
- `last_active_at` (date, optional)

**In `notifications` collection, add:**
- `fcm_sent` (bool, default: false)
- `fcm_sent_at` (date, optional)
- `rule_id` (text, optional)
- `announce_time` (date, optional)

**Create `notification_rules` collection with:**
- `name` (text, required)
- `description` (text, optional)
- `trigger` (select: analysis_ready, session_complete, user_inactive)
- `delay_minutes` (number, required)
- `enabled` (bool, default: true)
- `priority` (select: low, medium, high, urgent)
- `template` (json, required)

### B) Initialize Rules

```bash
curl -X POST http://your-pocketbase-url/api/init-notification-rules
```

Expected response:
```json
{
  "success": true,
  "message": "Initialized 5 notification rules",
  "count": 5
}
```

### C) Test!

1. Create a test notification in PocketBase Admin
2. Set `announce_time` to current time
3. Set `recipient_user_id` to your user
4. Wait 1 minute
5. 🎉 Check your device!

---

## 🎯 How It Works

```
┌─────────────────┐
│   PocketBase    │  ← Schedules notifications
│   (Port 8090)   │     Manages rules
└────────┬────────┘
         │
         │ HTTP call
         ▼
┌─────────────────┐
│  Token Server   │  ← Generates OAuth2 tokens
│  (Port 3001)    │     Signs JWT with RS256
└────────┬────────┘     Sends to FCM
         │
         │ HTTPS
         ▼
┌─────────────────┐
│  Firebase FCM   │  ← Google's service
│  (Google Cloud) │     Delivers to devices
└────────┬────────┘
         │
         ▼
    📱 Devices
```

---

## ✅ Success Checklist

- [ ] Token server running on port 3001
- [ ] PocketBase hooks file copied
- [ ] PocketBase restarted
- [ ] Database collections updated
- [ ] Notification rules initialized
- [ ] Test notification received

---

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| "Connection refused" | Make sure token server is running on port 3001 |
| "No FCM token" | User must grant notification permission in frontend |
| "Invalid token" | Token server will auto-refresh, wait 1 minute and try again |
| "Not found" | Make sure you called `/api/init-notification-rules` |

---

## 📱 Frontend Integration

### Install Firebase:
```bash
npm install firebase
```

### Request permission & save token:
```typescript
import { getToken } from 'firebase/messaging'

const token = await getToken(messaging, {
  vapidKey: 'BNAoJ2HinfmirzJvdj5nKlX4k5mY_RO0Wz0CbFtfck6hApgo9rYxwhy6n0G8UW5n5c5nt-gsHRdsIx7LY80fmJ0'
})

// Save to PocketBase
await pb.collection('users').update(userId, {
  fcm_token: token
})
```

See `guides/FIREBASE_FCM_SETUP.md` for complete frontend integration.

---

## 🚀 Production Deployment

### Run Token Server with PM2:
```bash
npm install -g pm2
pm2 start fcm-token-server/server.js --name fcm-token-server
pm2 startup
pm2 save
```

### Or deploy to cloud:
- Heroku
- Railway
- Google Cloud Run
- DigitalOcean

Update `TOKEN_SERVER_URL` in PocketBase hooks if deploying remotely.

---

## 🎊 Done!

Your notifications now work with:
- ✅ Modern FCM HTTP v1 API
- ✅ Proper OAuth2 authentication
- ✅ Android, iOS, and Web support
- ✅ Notifications when app is closed
- ✅ Scheduled notifications
- ✅ Automatic token refresh

---

**Questions?** Check `fcm-token-server/README.md` for detailed token server docs.