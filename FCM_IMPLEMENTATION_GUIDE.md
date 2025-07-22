# Firebase Cloud Messaging (FCM) Implementation Guide

This document outlines the implementation of Firebase Cloud Messaging for Android notifications in the Zehna application.

## Overview

The FCM implementation provides:
1. **Admin notification sending** - Admins can send push notifications to users
2. **Analysis page customized messages** - Automatic scheduling of 5 customized messages after each therapy session
3. **Background notification support** - Service worker handles notifications when app is closed
4. **Scheduled notifications** - Messages can be scheduled for future delivery

## Files Created/Modified

### Core FCM Files
- `.app/plugins/firebase.client.ts` - Firebase initialization plugin
- `.app/composables/useFirebaseMessaging.ts` - FCM composable for client-side
- `.app/public/firebase-messaging-sw.js` - Service worker for background notifications
- `.app/server/api/fcm/save-token.post.ts` - API to save FCM tokens
- `.app/server/api/fcm/send-notification.post.ts` - API to send individual notifications
- `.app/server/utils/pocketbase.ts` - PocketBase utility for server APIs

### Admin Interface
- `.app/pages/admin/notifications.vue` - Updated with FCM toggle option
- `.app/composables/useAdminNotifications.ts` - Updated with FCM support
- `.app/server/api/admin/notifications/send-fcm-bulk.post.ts` - Bulk FCM notifications API

### Session Analysis Integration
- `.app/server/api/openrouter/session-analysis.post.ts` - Analysis with automated message scheduling
- `.app/pages/mana/analysis.vue` - Updated to trigger analysis and register FCM

### Scheduled Notifications
- `.app/server/api/admin/process-scheduled-notifications.post.ts` - Processes pending scheduled notifications

### Configuration
- `.app/nuxt.config.ts` - Updated with Firebase configuration
- `fcm_pocketbase_collections.json` - Database schema for FCM collections

## Setup Instructions

### 1. Firebase Project Setup
1. Create a Firebase project at https://console.firebase.google.com
2. Enable Cloud Messaging
3. Generate a web app and obtain configuration keys
4. Generate a private key for server-side Firebase Admin SDK
5. Set up VAPID keys for web push

### 2. Environment Variables
Add these to your `.env` file:

```env
# Firebase Client Configuration
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=1:123456789:web:abcdef
FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
FIREBASE_VAPID_KEY=your_vapid_key

# Firebase Server Configuration
FIREBASE_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=123456789

# PocketBase Configuration
POCKETBASE_URL=http://127.0.0.1:8090
POCKETBASE_ADMIN_EMAIL=admin@example.com
POCKETBASE_ADMIN_PASSWORD=your_admin_password

# OpenRouter for Session Analysis
OPENROUTER_API_KEY=your_openrouter_api_key
```

### 3. Database Setup
Import the collections from `fcm_pocketbase_collections.json` into your PocketBase instance:

```bash
# Import collections
pb collections import fcm_pocketbase_collections.json
```

### 4. Update Service Worker Configuration
Edit `.app/public/firebase-messaging-sw.js` and replace the placeholder values with your actual Firebase configuration.

### 5. Install Dependencies
```bash
cd .app
npm install firebase firebase-admin
```

## Usage

### Admin Notifications

1. Navigate to `/admin/notifications`
2. Fill out the notification form
3. Select recipients (all users or specific users)
4. Check "ارسال اعلان push (FCM)" to send push notifications
5. Optionally schedule for later delivery
6. Click "ارسال اعلان"

### Session Analysis Messages

When a user completes a therapy session:

1. The analysis page (`/mana/analysis`) automatically triggers session analysis
2. OpenRouter AI analyzes the session and generates 5 customized follow-up messages
3. Messages are automatically scheduled over the next week
4. Users receive push notifications at scheduled times

### Scheduled Notification Processing

Set up a cron job to process scheduled notifications:

```bash
# Run every 5 minutes
*/5 * * * * curl -X POST https://your-domain.com/api/admin/process-scheduled-notifications
```

Or manually trigger:
```bash
curl -X POST https://your-domain.com/api/admin/process-scheduled-notifications
```

## API Endpoints

### Client-Side APIs
- `POST /api/fcm/save-token` - Save user's FCM token
- `POST /api/fcm/send-notification` - Send notification to specific user

### Admin APIs
- `POST /api/admin/notifications/send-fcm-bulk` - Send bulk FCM notifications
- `POST /api/admin/process-scheduled-notifications` - Process pending scheduled notifications

### Analysis APIs
- `POST /api/openrouter/session-analysis` - Analyze session and schedule follow-up messages

## Database Schema

### fcm_tokens
- `user_id` (text, required) - User identifier
- `token` (text, required) - FCM registration token
- `device_type` (select) - android, ios, web
- `is_active` (bool) - Token status

### scheduled_notifications
- `user_id` (text, required) - Recipient user ID
- `title` (text, required) - Notification title
- `body` (text, required) - Notification body
- `data` (text) - JSON data payload
- `schedule_time` (date, required) - When to send
- `status` (select) - pending, sent, failed, cancelled
- `source` (select) - admin, session_analysis, system
- `source_id` (text) - Source record ID

### notification_logs
- `user_id` (text, required) - Recipient user ID
- `title` (text, required) - Notification title
- `body` (text, required) - Notification body
- `fcm_response` (text) - FCM response
- `sent_at` (date, required) - Timestamp
- `status` (select) - sent, failed, pending
- `source` (select) - admin, scheduled, system

### session_analyses
- `session_id` (text, required) - Session identifier
- `user_id` (text, required) - User identifier
- `analysis_data` (text, required) - JSON analysis data

## Security Considerations

1. **Server Keys**: Never expose Firebase private keys on the client side
2. **Token Management**: FCM tokens should be refreshed and validated regularly
3. **User Permissions**: Only authorized admins can send bulk notifications
4. **Data Validation**: All notification data is validated before sending

## Troubleshooting

### Common Issues

1. **Notifications not received**
   - Check if FCM token is saved correctly
   - Verify Firebase configuration
   - Check browser notification permissions
   - Ensure service worker is registered

2. **Service Worker not loading**
   - Verify `firebase-messaging-sw.js` is in the public directory
   - Check Firebase configuration in service worker
   - Clear browser cache

3. **Scheduled notifications not sending**
   - Ensure cron job is running
   - Check scheduled_notifications collection
   - Verify Firebase Admin SDK credentials

4. **Analysis not triggering**
   - Check OpenRouter API key
   - Verify session data is being passed correctly
   - Check server logs for errors

### Testing

1. **Test FCM token registration**:
```javascript
// In browser console
const { requestPermission } = useFirebaseMessaging()
const token = await requestPermission()
console.log('FCM Token:', token)
```

2. **Test notification sending**:
```bash
curl -X POST https://your-domain.com/api/fcm/send-notification \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","body":"Test message","userId":"user_id"}'
```

3. **Test scheduled processing**:
```bash
curl -X POST https://your-domain.com/api/admin/process-scheduled-notifications
```

## Performance Considerations

1. **Batch Processing**: Scheduled notifications are processed in batches
2. **Error Handling**: Failed notifications are logged and can be retried
3. **Token Management**: Inactive tokens are marked and cleaned up
4. **Rate Limiting**: Firebase has rate limits for API calls

## Future Enhancements

1. **Rich Notifications**: Add images and action buttons
2. **Notification Categories**: Group notifications by type
3. **User Preferences**: Allow users to customize notification settings
4. **Analytics**: Track notification delivery and engagement
5. **A/B Testing**: Test different notification strategies