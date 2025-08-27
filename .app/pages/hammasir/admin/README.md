# Admin Panel Documentation

This document provides an overview of the admin panel functionality and the new pages that have been added.

## New Admin Pages

### 1. Counselors Management (`/hammasir/admin/counselors`)
- **Purpose**: Manage counselor profiles and their verification status
- **Features**:
  - List all counselors with filtering options
  - View detailed counselor profiles
  - Approve/reject counselor applications
  - Suspend/unsuspend counselors

### 2. Verification Requests (`/hammasir/admin/verification`)
- **Purpose**: Manage counselor verification requests
- **Features**:
  - View pending verification requests
  - Approve or reject verification requests
  - View uploaded documents for verification
  - Filter by request status

### 3. File Management (`/hammasir/admin/files`)
- **Purpose**: Manage system files
- **Features**:
  - List all files with filtering options
  - View file metadata (size, type, status, etc.)
  - Download files
  - Delete files

## New Composables

### `useAdmin`
A new composable has been created to handle all admin-related API calls:

- **State Management**: Manages state for counselors, verification requests, modules, and files
- **API Integration**: Provides methods for interacting with admin endpoints
- **Error Handling**: Comprehensive error handling with Persian translations
- **Loading States**: Tracks loading states for better UX

#### Key Methods:
- `getAllCounselorsAdmin()` - Get all counselors
- `getCounselorByIdAdmin()` - Get a specific counselor by ID
- `updateVerificationStatusAdmin()` - Update counselor verification status
- `getSystemNotificationsAdmin()` - Get system notifications
- `sendSystemNotificationAdmin()` - Send system notifications
- `getAllVerificationRequestsAdmin()` - Get all verification requests
- `getAllModulesAdmin()` - Get all matchmaking modules
- `updateModuleStatusAdmin()` - Update module status
- `getAllFilesAdmin()` - Get all files

## Updated Pages

### Existing Admin Pages Enhanced
The following existing admin pages have been enhanced to use the new `useAdmin` composable:

1. **Dashboard** (`/hammasir/admin`) - Enhanced with additional data loading
2. **Profiles** (`/hammasir/admin/profiles`) - Enhanced with loading states
3. **Profile Details** (`/hammasir/admin/profiles/[id]`) - Enhanced with loading states
4. **Notifications** (`/hammasir/admin/notifications`) - Enhanced with additional functionality

## Implementation Notes

- All new pages follow the same design patterns as existing admin pages
- Components are responsive and work on mobile devices
- Proper error handling and loading states are implemented
- Persian translations are used for all UI elements and error messages
- Vue 3 Composition API is used throughout
- TypeScript types are properly defined for all components

## Future Enhancements

Potential areas for future development:
- Add bulk actions for counselors and files
- Implement advanced filtering and sorting options
- Add export functionality for reports
- Implement real-time updates using WebSocket
- Add audit logging for admin actions

## Testing

All new components have been tested for:
- Proper rendering of UI elements
- Correct API integration
- Error handling
- Responsive design
- Accessibility

Unit tests should be added for composables to ensure proper functionality.