# Enhanced Service Worker for Background Notifications

## Overview

The enhanced service worker provides advanced background notification handling with rich formatting, priority-based processing, action buttons, deep linking, and intelligent grouping management.

## Key Features

### 1. Enhanced Background Message Processing

- **Priority-based handling**: Urgent, high, medium, and low priority notifications
- **Rich formatting**: Custom icons, vibration patterns, and visual indicators
- **Type-specific enhancements**: Different handling for session, admin, and system notifications
- **Persian/Farsi support**: RTL text direction and localized content

### 2. Advanced Click Handling

- **Multiple action buttons**: Context-aware actions based on notification type
- **Deep linking**: Direct navigation to specific app sections
- **Smart URL determination**: Automatic URL generation based on notification data
- **Client communication**: Seamless integration with the main app

### 3. Notification Grouping and Management

- **Automatic grouping**: Similar notifications are grouped together
- **Group summaries**: Consolidated view of multiple notifications
- **Smart cleanup**: Automatic removal of old notifications
- **Interaction tracking**: Comprehensive analytics for all notification events

## Notification Types

### Session Notifications
- **Icon**: `/icons/session-notification.png`
- **Actions**: "مشاهده جلسه" (View Session), "رد کردن" (Dismiss)
- **Deep Link**: `/sessions/{sessionId}`
- **Priority**: Usually medium or low

### Admin Notifications
- **Icon**: `/icons/admin-notification.png`
- **Actions**: "مشاهده" (View), "رد کردن" (Dismiss)
- **Deep Link**: `/admin/campaigns/{campaignId}` or custom URL
- **Priority**: Medium to high
- **RTL Support**: Automatic Persian text direction

### System Notifications
- **Icon**: `/icons/system-notification.png`
- **Actions**: "بررسی" (Check), "رد کردن" (Dismiss)
- **Deep Link**: `/settings/notifications`
- **Priority**: High (requires interaction)

## Priority Levels

### Urgent
- **Vibration**: [300, 100, 300, 100, 300]
- **Behavior**: Requires interaction, renotify enabled
- **Snooze**: 5 minutes
- **Actions**: No dismiss option

### High
- **Vibration**: [200, 100, 200]
- **Behavior**: Requires interaction
- **Snooze**: 15 minutes
- **Actions**: View and dismiss

### Medium
- **Vibration**: [200, 100, 200]
- **Behavior**: Standard notification
- **Snooze**: 30 minutes
- **Actions**: View, dismiss, snooze

### Low
- **Vibration**: [100]
- **Behavior**: Silent notification
- **Snooze**: 60 minutes
- **Actions**: View, dismiss, snooze

## Action Buttons

### Primary Actions
- **view_session**: Navigate to session details
- **open**: Open specified URL or default location
- **view_all**: Open grouped notifications view

### Secondary Actions
- **dismiss**: Close notification without action
- **snooze**: Postpone notification (priority-based delay)
- **dismiss_all**: Close all notifications in group

## Notification Grouping

### Group Keys
- **Campaign**: `campaign-{campaignId}`
- **Session**: `session-{sessionId}`
- **Type**: `type-{notificationType}`

### Group Management
- Automatic grouping of similar notifications
- Group summary creation when count > 1
- Individual notification closure in groups
- Group-wide actions (view all, dismiss all)

## Data Storage

### IndexedDB Schema
```javascript
// Database: ZehnaNotificationEvents
// Store: events
{
  id: number (auto-increment),
  type: string, // 'received', 'clicked', 'dismissed', 'snoozed'
  notificationId: string,
  campaignId?: string,
  sessionId?: string,
  timestamp: number,
  data: object
}
```

### Event Types
- **received**: Notification received in background
- **clicked**: User clicked notification or action
- **dismissed**: Notification closed or dismissed
- **snoozed**: Notification postponed
- **group_clicked**: Group summary clicked
- **group_dismissed**: Group summary dismissed

## Client Integration

### Service Worker Composable
```typescript
const {
  isSupported,
  isRegistered,
  getCurrentNotifications,
  clearAllNotifications,
  syncNotificationEvents,
  getNotificationStats
} = useServiceWorkerNotifications()
```

### Message Handling
The service worker communicates with the client app through:
- **Navigation requests**: For deep linking
- **Event synchronization**: For analytics tracking
- **Status updates**: For real-time notification management

## Testing

### Test Page
Visit `/admin/notifications/test` to:
- Test different notification types and priorities
- View current notifications
- Check notification statistics
- Sync events with server
- Clear notifications

### Test Notifications
- **Session (Low)**: Basic session reminder
- **Admin (Medium)**: Administrative message
- **System (High)**: System alert requiring attention
- **Urgent**: Critical notification requiring interaction
- **Grouped**: Multiple notifications for grouping test

## Configuration

### Icon Files
Ensure these icon files exist in `/public/icons/`:
- `session-notification.png`
- `admin-notification.png`
- `system-notification.png`
- `session-action.png`
- `admin-action.png`
- `system-action.png`

### Firebase Configuration
The service worker uses Firebase configuration from the main app. Ensure proper Firebase setup for FCM.

## Performance Considerations

### Cleanup Strategy
- Maximum 10 notifications displayed
- Notifications older than 24 hours auto-removed
- Group summaries preserved longer
- IndexedDB events synced and cleared regularly

### Memory Management
- Efficient notification grouping algorithms
- Minimal data storage in notification objects
- Automatic cleanup of expired events
- Optimized IndexedDB operations

## Browser Compatibility

### Supported Features
- Service Workers (all modern browsers)
- Notification API (all modern browsers)
- IndexedDB (all modern browsers)
- Push API (Chrome, Firefox, Safari 16+)

### Fallback Behavior
- Graceful degradation for unsupported features
- Error handling for permission issues
- Alternative storage for offline scenarios

## Security Considerations

### Data Protection
- No sensitive data in notification payloads
- Secure URL validation for deep links
- Safe handling of user interactions
- Proper error logging without exposing internals

### Permission Management
- Respectful permission requests
- Clear permission status indication
- Fallback for denied permissions
- User control over notification preferences