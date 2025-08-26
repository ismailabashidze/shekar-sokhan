# Authentication System Documentation

## Overview

This document provides an overview of the authentication system implemented for the Hammasir application. The authentication system includes user registration, login, logout, password reset, email verification, and Google OAuth integration.

## Technologies Used

- Nuxt 3 (Vue 3 with Composition API)
- TypeScript
- Tailwind CSS for styling
- Middleware for route protection

## Implemented Pages

### 1. Login Page
- Path: `/hammasir/auth/login`
- Allows users to log in with email and password
- Includes "Remember Me" functionality
- Provides link to password recovery page
- Supports Google OAuth login

### 2. Registration Page
- Path: `/hammasir/auth/register`
- Enables new users to create an account
- Requires email, password, and terms acceptance
- Implements password strength validation
- Password confirmation validation

### 3. Email Verification Page
- Path: `/hammasir/auth/verify-email`
- Handles email verification after registration
- Resends verification email if needed
- Redirects to dashboard after successful verification

### 4. Forgot Password Page
- Path: `/hammasir/auth/forgot-password`
- Allows users to request a password reset
- Sends reset link to user's email

### 5. Reset Password Page
- Path: `/hammasir/auth/reset-password`
- Enables users to set a new password
- Requires password confirmation
- Uses token from email link

### 6. Logout Page
- Path: `/hammasir/auth/logout`
- Handles user logout
- Clears authentication state
- Redirects to login page

### 7. Google OAuth Callback Page
- Path: `/hammasir/auth/google-callback`
- Handles Google OAuth authentication flow
- Processes authorization code and authenticates user

## Middleware

### Guest Middleware
- Protects routes that should only be accessible to non-authenticated users
- Redirects authenticated users to the dashboard

### Auth Middleware
- Protects routes that require authentication
- Redirects non-authenticated users to the login page

## Layouts

### Auth Layout
- Provides consistent styling for all authentication pages
- Includes navigation and footer
- Features animated background elements

## Composables

### useAuth
- Centralized authentication state management
- Provides reactive authentication state
- Implements all authentication methods
- Handles token storage and refresh

## Components

### Authentication Forms
- All forms include client-side validation
- Responsive design for all device sizes
- Dark mode support
- Accessible markup

## Security Features

1. Password strength requirements
2. CSRF protection
3. Secure token handling
4. Email verification for new accounts
5. Rate limiting for authentication attempts
6. Encrypted password storage (server-side)

## User Experience

1. Loading states for all asynchronous operations
2. Clear error messaging
3. Intuitive form validation
4. Responsive design
5. RTL (Right-to-Left) language support for Persian
6. Smooth transitions and animations

## Implementation Details

### State Management

Authentication state is managed through the `useAuth` composable which provides:

- `isAuthenticated`: Boolean indicating authentication status
- `currentUser`: Currently logged-in user information
- `isAuthLoading`: Loading state for authentication operations
- `authError`: Error message if authentication fails

### Route Protection

Routes are protected using Nuxt middleware:

- Public routes: Accessible to all users
- Guest routes: Only accessible to non-authenticated users
- Protected routes: Only accessible to authenticated users

### Token Handling

The system implements token-based authentication with:

- Short-lived access tokens
- Long-lived refresh tokens
- Automatic token refresh when needed
- Secure storage of tokens (in-memory with secure HTTP-only cookies for production)

## Future Enhancements

1. Two-factor authentication (2FA)
2. Biometric authentication
3. Social login providers (Facebook, Apple, etc.)
4. Account lockout after failed attempts
5. Passwordless authentication options
6. Session management dashboard

## Testing

All authentication flows should be tested for:

1. Valid credentials and inputs
2. Invalid credentials and inputs
3. Edge cases (empty fields, special characters, etc.)
4. Network failures
5. Token expiration scenarios
6. Concurrent session handling

## Deployment Considerations

1. HTTPS enforcement in production
2. Secure cookie settings
3. Proper CORS configuration
4. Rate limiting implementation
5. Security headers configuration
6. Environment-specific configurations

## Contributing

When contributing to the authentication system:

1. Follow established coding patterns and conventions
2. Maintain consistency with existing components
3. Ensure all new features are properly tested
4. Update documentation as needed
5. Consider accessibility and internationalization