# Backend Integration Guide

This document provides a comprehensive guide for integrating the Verve frontend with a backend API.

## Current State

The application is currently configured to use **mock data** for development and testing purposes. All API calls have been prepared with commented-out backend integration code that can be easily enabled when the backend is ready.

## Configuration

### Mock Data Mode

The application is currently running in mock data mode. To control this:

```typescript
// /config/simple-config.ts
export const APP_CONFIG = {
  ENABLE_MOCK_DATA: true, // Set to false when backend is ready
  // ... other config
};
```

### Backend Configuration

Backend settings are centralized in `/config/backend-config.ts`:

```typescript
export const BACKEND_CONFIG = {
  API_URLS: {
    development: 'http://localhost:8080/api',
    staging: 'https://api-staging.verve.company.com/v1',
    production: 'https://api.verve.company.com/v1'
  },
  // ... other config
};
```

## API Endpoints

All API endpoints are defined in `/config/simple-config.ts`:

```typescript
export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    // ... other auth endpoints
  },
  users: {
    list: '/users',
    byId: (id: string) => `/users/${id}`,
    // ... other user endpoints
  },
  // ... other endpoint categories
};
```

## Backend Integration Steps

### 1. Update Configuration

1. Set `ENABLE_MOCK_DATA: false` in `/config/simple-config.ts`
2. Update the API base URL in the same file:
   ```typescript
   API_BASE_URL: 'https://your-backend-api.com/v1',
   ```

### 2. Enable Backend Code

Throughout the codebase, you'll find commented backend integration code. For example, in `/services/AuthService.ts`:

```typescript
// TODO: Remove mock authentication when backend is ready
if (APP_CONFIG.ENABLE_MOCK_DATA) {
  return this.mockLogin(credentials);
}

// Backend integration code (uncomment when backend is ready):
/*
const response = await apiService.post<AuthResponse>(API_ENDPOINTS.auth.login, credentials);
this.storeAuth(response.user, response.token, response.refreshToken);
return { success: true, user: response.user };
*/
```

To enable backend integration:
1. Remove or comment out the mock data conditionals
2. Uncomment the backend API calls
3. Test the integration

### 3. Data Transformation

If your backend uses different field names or data structures, update the transformation functions in `/utils/backend-integration.ts`:

```typescript
transformUserData(backendUser: any): any {
  return {
    id: backendUser.user_id,           // Map backend field to frontend field
    name: backendUser.full_name,       // Transform field names as needed
    email: backendUser.email_address,
    // ... other transformations
  };
}
```

## Authentication Flow

The authentication system is ready for backend integration:

### Login
- Frontend sends credentials to `/auth/login`
- Backend returns user object, access token, and refresh token
- Frontend stores tokens and user data locally

### Token Management
- Access tokens are automatically included in API requests
- Refresh tokens are used to obtain new access tokens
- Failed token refresh triggers automatic logout

### Session Management
- Sessions automatically expire after configured timeout
- User activity resets session timer
- Inactive users are automatically logged out

## Real-time Features

WebSocket integration is prepared in `/utils/backend-integration.ts`:

```typescript
// Enable WebSocket when backend supports it
connectWebSocket(): void {
  const wsUrl = getWebSocketUrl(APP_CONFIG.APP_ENV);
  this.wsConnection = new WebSocket(wsUrl);
  // ... connection handling
}
```

Real-time events supported:
- `realtime:transaction` - New transactions
- `realtime:notification` - New notifications  
- `realtime:user_online` - User came online
- `realtime:user_offline` - User went offline

## API Service Features

The `ApiService` class provides:

- **Automatic retry** with exponential backoff
- **Rate limiting** protection
- **Request/response interceptors**
- **File upload** with progress tracking
- **Batch requests** for multiple operations
- **Caching** with TTL support
- **Error handling** with detailed logging

## Mock Data Service

During development, the `MockDataService` provides:

- Realistic user data with avatars and departments
- Sample transactions with proper relationships
- Badge system with different rarities
- Notification examples
- Chat message samples

## Backend API Requirements

Your backend should implement the following endpoints:

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/logout` - User logout
- `POST /auth/refresh` - Token refresh
- `GET /auth/me` - Get current user
- `POST /auth/verify-pin` - PIN verification

### Users
- `GET /users` - List all users
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user
- `GET /users/search` - Search users
- `POST /users/:id/avatar` - Upload avatar

### Transactions
- `GET /transactions` - List transactions
- `POST /transactions` - Create transaction
- `GET /transactions/:id` - Get transaction
- `GET /users/:id/transactions` - User transactions
- `GET /users/:id/transaction-stats` - Transaction statistics

### Notifications
- `GET /notifications` - List notifications
- `POST /notifications/:id/read` - Mark as read
- `POST /notifications/read-all` - Mark all as read

### System
- `GET /health` - Health check
- `GET /status` - System status

## Data Models

Expected JSON structures for API responses:

### User
```typescript
{
  id: string;
  name: string;
  email: string;
  avatar?: string;
  balance: number;
  role: 'user' | 'admin';
  online: boolean;
  department?: string;
  joinDate: string;
  badges: Badge[];
}
```

### Transaction
```typescript
{
  id: string;
  fromUserId: string;
  toUserId: string;
  amount: number;
  message: string;
  timestamp: string;
  type: 'sent' | 'received';
}
```

### Badge
```typescript
{
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'achievement' | 'recognition' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earnedAt?: string;
}
```

## Testing Backend Integration

1. **Health Check**: Use `/health` endpoint to verify connectivity
2. **Authentication**: Test login/logout flow
3. **CRUD Operations**: Test create, read, update, delete for each entity
4. **Error Handling**: Verify proper error responses
5. **Rate Limiting**: Test API rate limits
6. **WebSocket**: Test real-time message delivery

## Migration Checklist

- [ ] Backend API is deployed and accessible
- [ ] All required endpoints are implemented
- [ ] Authentication system is working
- [ ] Database is set up with proper schema
- [ ] CORS is configured for frontend domain
- [ ] Rate limiting is implemented
- [ ] Error handling returns proper status codes
- [ ] WebSocket server is running (optional)
- [ ] Update `ENABLE_MOCK_DATA` to `false`
- [ ] Update `API_BASE_URL` in config
- [ ] Uncomment backend integration code
- [ ] Test all major user flows
- [ ] Verify real-time features work (if enabled)

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend allows frontend domain
2. **Authentication Failures**: Check token format and expiration
3. **Network Timeouts**: Adjust `API_TIMEOUT` in config
4. **Rate Limiting**: Check `API_RATE_LIMIT` settings
5. **WebSocket Issues**: Verify WebSocket URL and authentication

### Debug Mode

Enable detailed logging:
```typescript
ENABLE_DEBUG_LOGS: true // in APP_CONFIG
```

This will log all API requests, responses, and errors to the browser console.

## Support

For questions about backend integration:
1. Check the console for detailed error messages
2. Verify API endpoints match the expected format
3. Test endpoints directly with tools like Postman
4. Ensure proper authentication headers are sent
5. Check network connectivity and CORS settings