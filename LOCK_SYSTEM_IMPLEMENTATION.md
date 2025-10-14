# Permanent Lock System Implementation

## Overview
Implemented a permanent, server-backed lock system that persists across user sessions. When a user sets a 4-digit PIN, the app will be locked upon every login until the correct PIN is entered or the lock is removed.

## Key Features
- ✅ **Permanent Lock**: PIN stored in PocketBase database, survives logouts
- ✅ **4-Digit PIN**: Simple numeric PIN for app security
- ✅ **Lock on Login**: Automatically locks app after successful login if PIN exists
- ✅ **Two Unlock Options**: Enter correct PIN or logout (which doesn't remove the lock)
- ✅ **Client + Server Storage**: localStorage for fast access, PocketBase for persistence

## Implementation Changes

### 1. Updated `composables/useLockSystem.ts`
- Added PocketBase integration functions:
  - `syncPinFromServer()` - Load PIN from PocketBase on app start
  - `setPinToServer()` - Save PIN to PocketBase
  - `removePinFromServer()` - Delete PIN from PocketBase
- Made `setPin()` and `removePin()` async to handle server operations
- Lock state now syncs with server on user authentication

### 2. Updated `plugins/lock-system.client.ts`
- Made plugin async to sync PIN from server on app start
- Syncs PIN when user is authenticated and PocketBase auth is valid
- Added exclusion for settings pages to prevent redirect loops
- Watches for lock state changes and redirects to `/lock` when needed

### 3. Updated `pages/auth/login.vue`
- After successful Google login, checks if user has `lockPin` in PocketBase
- Redirects to `/lock` instead of `/dashboard` if PIN exists
- User must enter PIN to proceed to dashboard

### 4. Updated `pages/settings/lock-setup.vue`
- Now saves PIN to both PocketBase and localStorage
- Handles async `setPin()` operation with proper error handling

### 5. Updated `pages/settings/remove-lock.vue`
- Removes PIN from both PocketBase and localStorage
- Handles async `removePin()` operation with user ID parameter

### 6. Updated `composables/user.ts`
- Added explicit comment in `logout()` function
- **Lock state is NOT cleared on logout** (intentional behavior)
- PIN persists in PocketBase, so user sees lock screen on next login

### 7. Updated `pages/settings/security.vue`
- Added lock system management UI
- Shows lock status (active/inactive)
- Buttons to set up or remove PIN
- Info box with important notes about the lock system

## PocketBase Schema Update Required

**IMPORTANT**: You must manually add the `lockPin` field to your PocketBase `users` collection:

1. Go to PocketBase Admin Panel
2. Navigate to Collections → `users`
3. Add a new field:
   - **Field name**: `lockPin`
   - **Field type**: Text
   - **Optional**: Yes (checked)
   - **Max length**: 4 (optional but recommended)
4. Save the collection

## User Flow

### Setting Up Lock
1. User navigates to Settings → Security
2. Clicks "تنظیم پین" (Set PIN)
3. Enters and confirms 4-digit PIN
4. PIN is saved to PocketBase and localStorage
5. Returns to dashboard

### Using Lock
1. User clicks lock button in dashboard
2. App locks and shows lock screen
3. User must enter PIN to unlock

### Login with Lock Active
1. User logs in with Google/email
2. System checks PocketBase for `lockPin`
3. If PIN exists, user is redirected to `/lock` screen
4. User must enter PIN to access dashboard
5. Logout doesn't clear the lock

### Removing Lock
1. User navigates to Settings → Security
2. Clicks "حذف پین" (Remove PIN)
3. Confirms removal in modal
4. PIN is deleted from PocketBase and localStorage
5. Lock is permanently disabled until user sets new PIN

## Testing Checklist
- [ ] Set up PIN through security settings
- [ ] Lock app manually using lock button
- [ ] Unlock app with correct PIN
- [ ] Try wrong PIN (should show error)
- [ ] Logout while lock is active
- [ ] Login again (should show lock screen)
- [ ] Remove PIN through security settings
- [ ] Verify app doesn't lock after PIN removal
- [ ] Test with different users (PIN should be user-specific)

## Security Layers (Multiple Defense Lines)

The lock system now uses **5 layers of defense** to ensure maximum security:

### Layer 1: Global Middleware (`middleware.global.ts`)
- **Runs on every route navigation**
- Checks lock state from localStorage before allowing any navigation
- Blocks all navigation attempts when locked (except /lock and /auth pages)
- Uses `navigateTo(..., { replace: true })` to prevent back button bypass
- **Strongest enforcement point** - runs before page loads

### Layer 2: App-Level Watcher (`app.vue`)
- Continuously watches lock state, user, and route path
- Automatically redirects to /lock if lock state changes
- Uses `router.replace()` to prevent history manipulation
- Runs throughout app lifecycle

### Layer 3: Router Guard (`app.vue`)
- Additional `router.beforeEach()` guard
- Catches any navigation attempts missed by other layers
- Returns `/lock` to block navigation
- Synchronized with reactive lock state

### Layer 4: Lock Page Route Guard (`pages/lock.vue`)
- `onBeforeRouteLeave()` prevents leaving the lock page
- Blocks browser back button, direct URL changes
- Only allows navigation to auth pages (for logout)
- Shows warning toast when navigation is blocked

### Layer 5: Client Plugin (`plugins/lock-system.client.ts`)
- Syncs PIN from PocketBase on app mount
- Watches for page navigation and enforces lock
- Backup enforcement in case other layers fail

## How It Works - Navigation Scenarios

### Scenario 1: User tries to navigate to /dashboard while locked
```
1. User enters URL: /dashboard
2. Middleware intercepts → Blocks → Redirects to /lock
3. Dashboard page never loads
```

### Scenario 2: User clicks back button while locked
```
1. User clicks back button on lock page
2. onBeforeRouteLeave() intercepts
3. Checks isAppLocked → Still locked
4. Returns false → Navigation blocked
5. Toast notification shown
```

### Scenario 3: User tries window.history manipulation
```
1. User tries: window.history.back()
2. Router guard intercepts
3. Checks lock state → Locked
4. Returns '/lock' → Navigation blocked
5. Stays on lock page
```

### Scenario 4: Direct URL manipulation in browser
```
1. User types /settings in address bar
2. Middleware runs first
3. Checks lock state from localStorage
4. Locked → Blocks → Redirects to /lock
5. Settings page never renders
```

## Security Notes
- PINs are stored as plain text (consider adding hashing in production)
- Lock is client-side enforced (not suitable for highly sensitive data)
- **5 layers of defense make bypass extremely difficult**
- User can clear browser data to bypass lock (acceptable for this use case)
- PIN attempts limited to 3 with 30s cooldown
- All navigation uses `replace()` to prevent history manipulation

## Testing the Lock System

### Test 1: Basic Lock
1. Set PIN in settings
2. Lock the app
3. Try to navigate to any page → Should redirect to /lock

### Test 2: Back Button
1. While on lock page, click browser back button
2. Should show warning toast and stay on lock page

### Test 3: Direct URL
1. While locked, type `/dashboard` in URL bar
2. Should immediately redirect to /lock

### Test 4: History Manipulation
1. Open console while locked
2. Try: `window.history.back()` or `window.history.go(-1)`
3. Should be blocked and redirected to /lock

### Test 5: After Logout
1. Lock the app
2. Logout
3. Login again
4. Should immediately show lock page

### Test 6: Multiple Tabs
1. Lock app in one tab
2. Open new tab with same domain
3. Try to access any page
4. Should redirect to /lock (lock state shared via localStorage)

## Future Enhancements
- PIN hashing/encryption before storage
- Biometric unlock option
- Auto-lock timer (lock after X minutes of inactivity)
- Change PIN feature (without having to remove and re-add)
- Admin override for forgotten PINs
- Server-side lock enforcement (current implementation is client-side only)
