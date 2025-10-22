/**
 * Centralized API Endpoints Configuration
 * All API endpoints for the Verve application are defined here
 * This ensures consistency and makes it easy to update endpoints
 */

export interface ApiEndpoints {
  // Authentication endpoints
  auth: {
    login: string;
    register: string;
    logout: string;
    resetPassword: string;
    confirmResetPassword: string;
    refresh: string;
    me: string;
    verifyPin: string;
    sso: string;
    ssoCallback: string;
  };
  
  // User management endpoints
  users: {
    list: string;
    byId: (id: string) => string;
    create: string;
    update: (id: string) => string;
    delete: (id: string) => string;
    search: string;
    updateProfile: (id: string) => string;
    uploadAvatar: (id: string) => string;
    transactions: (id: string) => string;
    transactionStats: (id: string) => string;
    badges: (id: string) => string;
    awardBadge: (id: string) => string;
    settings: (id: string) => string;
  };
  
  // Transaction endpoints
  transactions: {
    list: string;
    byId: (id: string) => string;
    create: string;
    update: (id: string) => string;
    delete: (id: string) => string;
    stats: string;
    export: string;
  };
  
  // Notification endpoints
  notifications: {
    list: string;
    byId: (id: string) => string;
    markAsRead: (id: string) => string;
    markAllAsRead: string;
    delete: (id: string) => string;
    settings: string;
    unreadCount: string;
  };
  
  // Chat endpoints
  chat: {
    conversations: string;
    conversation: (id: string) => string;
    messages: (conversationId: string) => string;
    sendMessage: (conversationId: string) => string;
    markAsRead: (conversationId: string) => string;
    createConversation: string;
    deleteConversation: (id: string) => string;
  };
  
  // Badge system endpoints
  badges: {
    list: string;
    byId: (id: string) => string;
    categories: string;
    award: string;
    userBadges: (userId: string) => string;
    leaderboard: string;
  };
  
  // Admin endpoints
  admin: {
    dashboard: string;
    users: string;
    transactions: string;
    systemSettings: string;
    analytics: string;
    auditLog: string;
    bulkActions: string;
  };
  
  // Health and system endpoints
  system: {
    health: string;
    version: string;
    status: string;
  };
  
  // Wallet endpoints
  wallets: {
    get: string;
    update: (id: string) => string;
  };
}

/**
 * API endpoints configuration
 * This object contains all the API endpoints used throughout the application
 */
export const API_ENDPOINTS: ApiEndpoints = {
  // Authentication
  auth: {
    login: '/auth/login',
    register: '/user/register',
    logout: '/user/logout',
    resetPassword: '/user/reset-password',
    confirmResetPassword: '/user/reset-password/confirm',
    refresh: '/auth/refresh',
    me: '/auth/me',
    verifyPin: '/auth/verify-pin',
    sso: '/auth/sso',
    ssoCallback: '/auth/sso/callback',
  },
  
  // Users
  users: {
    list: '/users',
    byId: (id: string) => `/users/${id}`,
    create: '/users',
    update: (id: string) => `/users/${id}`,
    delete: (id: string) => `/users/${id}`,
    search: '/users/search',
    updateProfile: (id: string) => `/users/${id}/profile`,
    uploadAvatar: (id: string) => `/users/${id}/avatar`,
    transactions: (id: string) => `/users/${id}/transactions`,
    transactionStats: (id: string) => `/users/${id}/transaction-stats`,
    badges: (id: string) => `/users/${id}/badges`,
    awardBadge: (id: string) => `/users/${id}/badges`,
    settings: (id: string) => `/users/${id}/settings`,
  },
  
  // Transactions
  transactions: {
    list: '/transactions',
    byId: (id: string) => `/transactions/${id}`,
    create: '/transfers',
    update: (id: string) => `/transactions/${id}`,
    delete: (id: string) => `/transactions/${id}`,
    stats: '/transactions/stats',
    export: '/transactions/export',
  },
  
  // Notifications
  notifications: {
    list: '/notifications',
    byId: (id: string) => `/notifications/${id}`,
    markAsRead: (id: string) => `/notifications/${id}/read`,
    markAllAsRead: '/notifications/read-all',
    delete: (id: string) => `/notifications/${id}`,
    settings: '/notifications/settings',
    unreadCount: '/notifications/unread-count',
  },
  
  // Chat
  chat: {
    conversations: '/chat/conversations',
    conversation: (id: string) => `/chat/conversations/${id}`,
    messages: (conversationId: string) => `/chat/conversations/${conversationId}/messages`,
    sendMessage: (conversationId: string) => `/chat/conversations/${conversationId}/messages`,
    markAsRead: (conversationId: string) => `/chat/conversations/${conversationId}/read`,
    createConversation: '/chat/conversations',
    deleteConversation: (id: string) => `/chat/conversations/${id}`,
  },
  
  // Badges
  badges: {
    list: '/badges',
    byId: (id: string) => `/badges/${id}`,
    categories: '/badges/categories',
    award: '/badges/award',
    userBadges: (userId: string) => `/badges/users/${userId}`,
    leaderboard: '/badges/leaderboard',
  },
  
  // Admin
  admin: {
    dashboard: '/admin/dashboard',
    users: '/admin/users',
    transactions: '/admin/transactions',
    systemSettings: '/admin/settings',
    analytics: '/admin/analytics',
    auditLog: '/admin/audit-log',
    bulkActions: '/admin/bulk-actions',
  },
  
  // System
  system: {
    health: '/health',
    version: '/version',
    status: '/status',
  },
  
  // Wallet endpoints
  wallets: {
    get: '/wallets',
    update: (id: string) => `/wallets/${id}`,
  },
};

/**
 * Helper function to build URLs with query parameters
 */
export function buildUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined>): string {
  if (!params) return endpoint;
  
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `${endpoint}?${queryString}` : endpoint;
}

/**
 * Type-safe endpoint builder with parameter validation
 */
export class EndpointBuilder {
  private baseEndpoint: string;
  
  constructor(endpoint: string) {
    this.baseEndpoint = endpoint;
  }
  
  withId(id: string): string {
    if (!id || typeof id !== 'string') {
      throw new Error('Valid ID is required');
    }
    return `${this.baseEndpoint}/${id}`;
  }
  
  withParams(params: Record<string, any>): string {
    return buildUrl(this.baseEndpoint, params);
  }
  
  build(): string {
    return this.baseEndpoint;
  }
}

/**
 * Create a type-safe endpoint builder
 */
export function createEndpoint(endpoint: string): EndpointBuilder {
  return new EndpointBuilder(endpoint);
}

export default API_ENDPOINTS;