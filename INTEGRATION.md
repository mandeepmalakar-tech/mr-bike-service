# Mr. Bike - Serilog Integration & Profile Feature

## Overview
This document describes the integration of Serilog (Winston) logging with the backend and the creation of a user profile feature.

## Backend Changes

### 1. Serilog Integration (Winston)
- **Package**: `winston` and `winston-daily-rotate-file`
- **Location**: `backend/src/config/logger.js`
- **Features**:
  - Console logging for development
  - File logging with daily rotation
  - Separate error logs
  - Request/response logging middleware
  - Global error handling with logging

### 2. Logging Configuration
- **Log Levels**: info, warn, error
- **Log Files**: 
  - `logs/application-YYYY-MM-DD.log` - All logs
  - `logs/error-YYYY-MM-DD.log` - Error logs only
  - `logs/exceptions.log` - Unhandled exceptions
  - `logs/rejections.log` - Unhandled promise rejections

### 3. User Controller Logging
Added comprehensive logging to:
- User registration attempts and results
- Login attempts and authentication
- Profile access and updates
- Logout operations
- Error scenarios

## Frontend Changes

### 1. Profile Component
- **Location**: `frontend/src/components/Profile.jsx`
- **Features**:
  - View user profile data
  - Edit profile information
  - Update user details (name, email, phone, driving license)
  - Logout functionality
  - Error handling and loading states

### 2. Routing Integration
- **Lazy Loading**: Profile component is lazy-loaded for better performance
- **Route**: `/profile`
- **Suspense**: Loading fallback while component loads

### 3. API Configuration
- **Updated**: `frontend/src/api/axios.js`
- **Changes**: 
  - Enabled `withCredentials: true` for cookie-based authentication
  - Removed localStorage token handling (using cookies instead)

## API Endpoints

### User Profile Endpoints
- `GET /api/v1/users/profile` - Get user profile
- `PATCH /api/v1/users/update-profile` - Update user profile
- `POST /api/v1/users/logout` - Logout user

### Authentication
- Uses cookie-based authentication
- JWT tokens stored in httpOnly cookies
- Automatic token refresh handling

## Usage

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Accessing Profile
1. Register a new user at `/register`
2. Login at `/login`
3. Navigate to `/profile` to view and edit profile

## Logging Features

### Request Logging
- Logs all HTTP requests with method, URL, status, duration
- Includes user agent and IP address
- Separate error logging for failed requests

### User Activity Logging
- Registration attempts and results
- Login attempts (successful and failed)
- Profile access and updates
- Logout operations

### Error Logging
- Comprehensive error logging with stack traces
- Request context for debugging
- Separate error log files for easy monitoring

## Security Features

### Authentication
- Cookie-based authentication
- HttpOnly cookies for security
- Automatic token refresh
- Secure cookie options

### Input Validation
- Email format validation
- Phone number validation
- Required field validation
- XSS protection through proper input handling

## Development Notes

### Log Files Location
- Backend logs are stored in `backend/logs/`
- Logs are rotated daily
- Old logs are compressed and archived
- Logs are kept for 14 days by default

### Error Handling
- Global error handler with logging
- Request/response logging middleware
- Comprehensive error context logging

### Performance
- Lazy loading of Profile component
- Efficient API calls with proper error handling
- Optimized re-renders with proper state management
