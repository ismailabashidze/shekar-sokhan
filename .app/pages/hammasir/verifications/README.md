# Verifications Module

This module handles counselor verification processes within the Hammasir application.

## Pages

1. **Index (`/hammasir/verifications`)** - Main verification dashboard for counselors
2. **Detail (`/hammasir/verifications/[id]`)** - Detailed view of a specific verification document
3. **Requests (`/hammasir/verifications/requests`)** - Admin panel for managing verification requests
4. **Sync (`/hammasir/verifications/sync`)** - System synchronization tools for verification data

## Features

- Document upload and management
- Verification request submission
- Status tracking
- Admin review interface
- Data synchronization with external systems
- Validation tools

## Components

- Verification status tracking
- Document upload forms
- Request management tables
- Sync status monitoring
- Validation result displays

## Technical Details

This module uses the `useVerifications` composable to manage all verification-related data and operations.