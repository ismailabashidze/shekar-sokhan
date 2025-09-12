# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [3.1.0] - 2025-09-12
### Fixed
- Version bump to 3.1.0
- Enhanced version management system across the platform

## [2.10.2] - 2025-07-24
### Fixed
- Minor bug fixes and improvements

## [2.10.1] - 2025-07-24
### Fixed
- Minor bug fixes and improvements

## [2.10.0] - 2024-07-13
### Added
- بهبود کامل سیستم PWA notifications برای نمایش native در اندروید و ویندوز حتی در حالت بسته بودن اپ
- تست و راهنمای کامل برای نوتیفیکیشن‌ها در صفحه /test-notifications

### Fixed
- رفع مشکل auto-cancellation در تست‌های PocketBase
- بهبود واکنش‌پذیری permission و subscription

## [2.9.2] (2025-01-30)

### 🐞 Bug Fixes
- Fixed PWA installation detection logic to prevent false positive detection
- Improved PWA install prompt visibility when app is not actually installed
- Removed unreliable window dimension checks for PWA installation status
- Enhanced PWA detection with manual flag support for better accuracy

### 🧰 Technical Improvements
- Added global PWA install prompt management to prevent event timing issues
- Improved error handling in PWA installation flow with fallback guidance
- Enhanced console logging for PWA installation debugging
- Fixed TypeScript definitions for global PWA prompt state
- Optimized PWA detection polling interval for faster response

### 🎨 UI Improvements
- Better manual installation guidance based on browser type
- Improved user experience when PWA install prompt is not available

---

## [2.9.1] (2025-01-30)

### �� Features
- Version bump to 2.8.0 with updated PWA cache management
- Enhanced version display and changelog management
- Improved deployment pipeline and build process

### 🧰 Technical Improvements
- Updated all package.json files to version 2.8.0
- Synchronized version display component with new version
- Updated PWA service worker cache version to v2.8.0
- Enhanced changelog management with bilingual support

### 🐞 Bug Fixes
- Fixed version synchronization across all components
- Resolved deployment script compatibility issues

---

## [2.7.0] (2025-01-30)

### 🚀 Features
- Implemented comprehensive PWA push notifications system with complete integration
- Added PWA notification settings component with status management and controls
- Created advanced PWA notification composable with push subscription management
- Enhanced service worker with push notification handling and offline sync
- Added notification permission request UI with visual status indicators

### 🎨 UI Improvements
- Enhanced notification icon with dynamic wiggle animation for unread notifications
- Added visual unread count badge with smooth transitions and ping animations
- Improved notification sidebar with proper initialization and filtering
- Enhanced notification management page with PWA settings integration
- Added color-coded status indicators and smooth loading animations

### 🧰 Technical Improvements
- Created `usePwaNotifications` composable for centralized PWA notification management
- Enhanced service worker with comprehensive push notification event handling
- Added VAPID key management and push subscription lifecycle handling
- Implemented automatic PWA notification triggering for new notifications
- Added proper RTL and Persian language support throughout PWA system
- Enhanced notification initialization system with computed properties
- Fixed notification badge and bell animation display issues

### 🔔 Notification System Enhancements
- Fixed empty notification sidebar by proper filtering initialization
- Enhanced unread notification count calculation and display
- Added automatic notification badge updates with real-time synchronization
- Implemented notification click handling with smart navigation
- Added priority-based notification behavior with visual indicators

### 🐞 Bug Fixes
- Fixed notification icon badge not displaying correctly
- Resolved notification bell animation issues
- Fixed computed properties duplication causing Vite errors
- Corrected notification sidebar initialization and filtering
- Fixed notification count synchronization across components

### 🌐 Localization
- Enhanced Persian language support for PWA notification interface
- Added RTL-optimized PWA notification layouts and animations
- Improved Persian error messages and status text throughout notification system

---

## [2.6.0] (2025-01-30)

### 🚀 Features
- Implemented advanced admin notification management system with complete CRUD operations
- Added server-side pagination and infinite scroll for user lists in notification panel
- Integrated real-time search with debounce functionality for user lookup
- Created comprehensive notification dashboard with statistics and analytics
- Added bulk notification sending capabilities with role-based filtering
- Implemented system notification templates (welcome, reminder, warning, maintenance)

### 🎨 UI Improvements
- Enhanced notification cards with visual status indicators and modern card design
- Added user avatars and comprehensive sender/recipient information display
- Implemented responsive design with mobile-optimized layouts
- Enhanced visual hierarchy with badges, icons, and color-coded status indicators
- Added priority levels and read/unread status visualization
- Improved notification preview functionality with real-time form validation

### 🧰 Technical Improvements
- Created `useAdminNotifications` composable for centralized notification management
- Added PocketBase integration with proper relation expansion for user data
- Implemented efficient pagination system with 20 items per page loading
- Added proper error handling and loading states throughout the system
- Created admin middleware for role-based access control
- Enhanced data transformation utilities for consistent UI data format

### 🐞 Bug Fixes
- Fixed template syntax errors in Vue components
- Corrected user count display in dashboard statistics
- Resolved infinite scroll triggering and load more functionality
- Fixed responsive layout issues on mobile devices

### 🌐 Localization
- Full Persian language support for admin notification interface
- RTL-optimized layout with proper text direction for all components
- Persian date/time formatting and user-friendly status messages

---

## [2.5.1] (2025-01-30)

### 🐞 Bug Fixes
- Minor bug fixes and performance improvements
- Enhanced stability and user experience
- Updated dependencies and security patches

### 🧰 Technical Improvements
- Code optimization and cleanup
- Improved error handling
- Enhanced development experience

---

## [2.5.0] (2025-07-02)

### 🚀 Features
- Implemented Progressive Web App (PWA) functionality for offline support and app installation
- Added PWA install prompt with native-like installation experience
- Created manual PWA manifest and service worker for reliable functionality
- Added install button component positioned next to tour button

### 🎨 UI Improvements
- Enhanced PWA install popup with improved spacing, larger icons, and better typography
- Added download icon to install button for better user recognition
- Improved RTL layout support for install prompt with proper Persian text alignment
- Enhanced dark mode compatibility for PWA components

### 🧰 Technical Improvements
- Created custom service worker for caching strategies and offline functionality
- Implemented PWA manifest with proper Persian metadata and RTL direction
- Added Nuxt plugin for service worker registration and management
- Removed automatic tour start functionality to prevent interference with modals
- Added meta tags for mobile web app capabilities and theme colors

### 🐞 Bug Fixes
- Fixed tour auto-start conflicts with experimental version modal
- Removed debug logs from PWA components for cleaner console output
- Disabled automatic tour initialization on page load

### 🌐 Localization
- Full Persian language support for PWA installation interface
- Added Persian app name and description in PWA manifest
- RTL-optimized PWA install prompt with proper text direction

---

## [2.4.0] (2025-01-27)

### 🚀 Features
- Implemented comprehensive product tour system using Driver.js
- Added interactive guided tours for user onboarding and feature discovery
- Created tour button component with Persian localization
- Integrated tour functionality across the application with proper RTL support

### 🎨 UI Improvements
- Added beautiful tour popover styling with glassmorphism effects
- Implemented RTL-optimized tour interface with Persian fonts
- Added animated gradient effects and smooth transitions for tour elements
- Created responsive tour design that works on mobile and desktop
- Enhanced user experience with progress indicators and navigation controls

### 🧰 Technical Improvements
- Added Driver.js library for tour functionality
- Created `useTour` composable for tour state management
- Implemented tour client plugin for proper initialization
- Added comprehensive CSS styling for tour components with dark/light theme support
- Created tour demo page for testing and development

### 🐞 Bug Fixes
- Fixed payment system integration and callback handling
- Improved session management and dashboard functionality
- Enhanced onboarding flow with better error handling

### 🌐 Localization
- Full Persian language support for tour interface
- RTL layout optimization for tour elements
- Proper Persian typography and font rendering in tours

---

## [2.3.0] (2025-01-26)

### 🚀 Features
- Implemented comprehensive emotion analysis system for therapy sessions
- Added real-time emotion analysis for user messages during therapy sessions
- Created detailed message analysis modal with emotion wheel visualization
- Integrated database storage for message analysis data
- Extended history page with emotion analysis viewing capabilities

### 🎨 UI Improvements
- Added magnifying glass buttons for viewing detailed message analysis
- Implemented interactive emotion wheel component for visual emotion representation
- Added color-coded emotion badges with severity indicators (red=زیاد, orange=متوسط, blue=کم)
- Enhanced user experience by showing messages immediately before analysis completes
- Created comprehensive modal for viewing message metadata and emotion analysis

### 🧰 Technical Improvements
- Redesigned OpenRouter emotion analysis JSON schema for better data structure
- Created emotion mapping utilities to convert Persian analysis to wheel format
- Added new composable `useMessageAnalysis` for database operations
- Implemented proper emotion data flow from API to UI components
- Added support for 9 core emotions with Persian names and severity levels

### 🐞 Bug Fixes
- Fixed login page validation messages to show proper Persian error text instead of "Required"
- Corrected Zod schema validation for email and password fields
- Fixed linter errors in login page HTML structure

### 🌐 Localization
- Improved Persian language support in emotion analysis interface
- Added Persian emotion names mapping (شادی، اعتماد، ترس، تعجب، غم، انزجار، خشم، انتظار، نامشخص)
- Enhanced validation messages with proper Persian translations

---

## [2.2.0] (2025-01-26)

### 🗑️ Breaking Changes
- Removed `userRecord` from localStorage completely
- Removed sync system between localStorage and database

### ⚡ Performance Improvements
- Simplified data flow by using direct API calls instead of localStorage sync
- Removed unnecessary sync operations that could cause performance issues
- Eliminated potential data inconsistency between localStorage and database

### 🧹 Code Cleanup
- Removed `syncUserRecord`, `loadUserRecord`, `updateUserRecord` functions
- Deleted `composables/sync.ts` file
- Simplified user record management in messaging component
- Reduced code complexity and improved maintainability

---

## [2.1.0] (2025-06-13)

### 🚀 Features
- Minor version bump to 2.1.0
- Updates on deeds and restriction on Deeds.

## [2.0.0] (2025-05-21)

### 🚀 Features
- Major version bump to 2.0.0
- Added comprehensive payments functionality with admin controls
- Implemented user-specific payment views with filtering and pagination
- Added action buttons for payment management

### 🎨 UI Improvements
- Enhanced payments table with status indicators and action buttons
- Improved admin interface for managing user payments

---

## [1.9.0] (2025-05-17)

### 🚀 Features
- Added AI conversation summary feature that checks for previous sessions
- Improved typing indicator for showing AI message generation progress
- Disabled input field when AI is responding to messages

### 🎨 UI Improvements
- Enhanced user experience with clear processing state indicators
- Optimized report page performance with loading and empty states

---

## [1.8.0] (2025-05-14)

### 🚀 Features
- Improved users table UX: Farsi localization, Jalali-style dates, and relative time columns
- Added skeleton loading state for users table
- Added dropdown actions with icons, fully localized
- Added golden dot indicator for new users
- Enhanced pagination (reactive, updates on page change)

### 🐞 Bug Fixes
- Fixed avatar badge logic for new users
- Fixed dropdown icon rendering (now uses #start slot)
- Corrected email source and null handling

---

## [1.7.0] (2025-05-02)

### 🚀 Features

- Bumped version to 1.7.0 (package.json & .app/components/common/VersionDisplay.vue)

### 🩹 Bug Fixes

- Refactored user object reference pattern from `user.value.record.id` to `user.value.id` across multiple components
- Added null check for user role in DemoAccountMenu component
- Fixed user reference in discountCoupon composable
- Improved code formatting and removed unnecessary empty lines
- Updated changelog entries in CHANGELOG.md & pages/changelog.vue

## [1.6.0] (2025-04-23)

### 🚀 Features
* Organized emoji picker into emotion-based categories with tabs and horizontal scroll controls.
* Added new categories (`ترس`, `حیوانات`, `غذا`, `ورزش`) and expanded emoji sets.

### 🎨 UI Improvements
* Improved dark mode contrast for category tabs.
* Hidden scrollbar and smooth scrolling animations for tab navigation.

## [1.5.0] (2025-04-09)

### 🛠️ Bug Fixes

* **Session Management:** Fixed session status tracking
  * Corrected originalData access in PocketBase hooks
  * Added status change logging for better debugging
  * Improved session state transition handling

## [1.4.0] (2025-04-09)

### 🔧 Improvements

* **Deployment:** Enhanced deployment process
  * Added PM2 process management improvements
  * Implemented clean deployment with `.output` directory removal
  * Added safeguards for process stopping and restarting
  * Improved error handling in deployment script

## [1.3.0] (2025-04-05)

### 🔄 System Updates

* **Session Analysis:** Enhanced therapist evaluation system
  * Removed psychotherapistEvaluationScore in favor of calculated scoring
  * Updated negativeScoresList with points and cause tracking
  * Added structured positive behaviors and improvement suggestions
  * Implemented automatic final score calculation
  * Enhanced UI with color-coded feedback sections

* **Risk Assessment:** Improved risk factors analysis
  * Updated schema to emphasize severity and immediate concerns
  * Enhanced risk factor descriptions for better clarity
  * Adjusted minimum requirements for risk factor reporting
  * Improved professional intervention indicators

### 🐛 Bug Fixes

* **Session Management:** Fixed critical session handling issues
  * Resolved 400 Bad Request errors during session closure
  * Enhanced automatic session closure handling
  * Improved navigation to analysis page after session end

## [1.2.0] (2025-04-03)

### 🚀 Features

* **User Deeds:** Enhanced deeds tracking and display
  * Added personal completion tracking for each deed
  * Created "My Deeds" page showing user's completed deeds
  * Added stats display showing views, total completions, and personal completions
  * Integrated with discount codes system for deed completion tracking

* **Discount Codes:** Improved discount code management
  * Added user-specific discount code tracking
  * Created "My Codes" page for viewing personal discount codes
  * Enhanced code generation with deed completion tracking
  * Added type support for different code sources (deed, admin)

### 🎨 UI Improvements

* **Stats Display:** Enhanced statistics visualization
  * Added distinct icons for different types of stats
  * Improved layout with centered alignment and proper spacing
  * Color-coded icons for better visual distinction

## [1.1.0] (2025-04-01)

### 🚀 Features

* **Bug Reporting System:** Added comprehensive bug reporting functionality
  * Created bug report form with validation for submitting issues
  * Implemented bug reports list view with filtering and status management
  * Added detailed bug report view for individual issues
  * Integrated with PocketBase for data storage and retrieval
  * Added alpha state notification modal for first-time users

### 🎨 UI Improvements

* **Navigation:** Added yellow bug report icon to sidebar for quick access
  * Custom icon component with distinctive styling
  * Improved visibility for encouraging user feedback
* **User Experience:** Added empathetic alpha state modal
  * First-time notification about platform status
  * Clear instructions for reporting issues
  * Uses localStorage to show only once per user

### 🧰 Technical Improvements

* **API Integration:** Created new bug report API service
  * Functions for creating, listing, and updating bug reports
  * Status management (seen/resolved) functionality
* **Middleware:** Updated global middleware to allow unauthenticated access to bug reporting pages

## [1.0.0] (2025-03-28)

### 🚀 Features

* **Session Analysis:** Enhanced session analysis workflow with improved user experience
  * Added automatic redirection to waiting page after session ends
  * Implemented background processing for session analysis generation
  * Created new waiting page with real-time status checking
  * Added notification modal when analysis is ready

### 🔄 Changed

* **Messaging Flow:** Modified session end workflow to immediately redirect users
  * Session analysis now generates in the background without blocking user interaction
  * Added localStorage integration to track pending analysis sessions

### 🧰 Technical Improvements

* **API Integration:** Added new `getAnalysisForSession` function to check analysis status
* **UI Components:** Enhanced waitForReport page with loading indicator and success modal
* **Performance:** Improved user experience by eliminating waiting time after session end
