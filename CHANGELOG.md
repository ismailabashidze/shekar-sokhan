# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
