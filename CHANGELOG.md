# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
