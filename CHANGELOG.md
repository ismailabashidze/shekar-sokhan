# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
