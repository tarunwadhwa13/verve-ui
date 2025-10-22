/**
 * Simplified, robust configuration for Verve application
 * Designed to avoid circular dependencies and webpack runtime errors
 */

// Simple environment detection
const getEnvironment = (): 'development' | 'staging' | 'production' => {
  if (typeof window !== 'undefined') {
    // Browser environment
    return 'development';
  }
  
  try {
    return (process?.env?.NODE_ENV as any) || 'development';
  } catch {
    return 'development';
  }
};

// Application configuration
export const APP_CONFIG = {
  // Environment
  APP_ENV: getEnvironment(),
  
  // Feature Flags
  ENABLE_MOCK_DATA: getEnvironment() === 'development',
  ENABLE_ANALYTICS: false,
  ENABLE_ERROR_REPORTING: false,
  ENABLE_DEBUG_LOGS: true,
  ENABLE_WEBSOCKETS: false,
  
  // Chat Configuration
  CHAT_ENABLED: true,
  CHAT_CONFIG: {
    MAX_MESSAGE_LENGTH: 1000,
    MESSAGE_BATCH_SIZE: 50,
    ENABLE_TYPING_INDICATOR: true,
    ENABLE_READ_RECEIPTS: true,
    ENABLE_FILE_SHARING: false,
    POLL_INTERVAL: 5000, // Poll for new messages every 5 seconds when WebSocket is disabled
  },
  
  // API Configuration
  API_BASE_URL: getEnvironment() === 'production' 
    ? 'https://api.verve.company.com/v1'
    : 'http://localhost:8080/api',
  API_TIMEOUT: 15000,
  RETRY_ATTEMPTS: 3,
  
  // Authentication
  AUTH_TOKEN_KEY: 'verve_auth_token',
  REFRESH_TOKEN_KEY: 'verve_refresh_token',
  USER_DATA_KEY: 'verve_user_data',
  
  // Storage
  STORAGE_PREFIX: 'verve_',
  SESSION_TIMEOUT: 7200000, // 2 hours
  
  // UI
  DEFAULT_PAGE_SIZE: 20,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  
  // Rate Limiting
  API_RATE_LIMIT: 100,
  RATE_LIMIT_WINDOW: 60000
};

// Simple helper functions
export const isDevelopment = () => APP_CONFIG.APP_ENV === 'development';
export const isStaging = () => APP_CONFIG.APP_ENV === 'staging';
export const isProduction = () => APP_CONFIG.APP_ENV === 'production';

// Simple API endpoints
export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    resetPassword: '/auth/reset-password',
    confirmResetPassword: '/auth/reset-password/confirm',
    refresh: '/auth/refresh',
    me: '/auth/me',
    verifyPin: '/auth/verify-pin',
  },
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
  transactions: {
    list: '/transactions',
    byId: (id: string) => `/transactions/${id}`,
    create: '/transactions',
    update: (id: string) => `/transactions/${id}`,
    delete: (id: string) => `/transactions/${id}`,
    stats: '/transactions/stats',
    export: '/transactions/export',
  },
  notifications: {
    list: '/notifications',
    byId: (id: string) => `/notifications/${id}`,
    markAsRead: (id: string) => `/notifications/${id}/read`,
    markAllAsRead: '/notifications/read-all',
    delete: (id: string) => `/notifications/${id}`,
    settings: '/notifications/settings',
    unreadCount: '/notifications/unread-count',
  },
  chat: {
    conversations: '/chat/conversations',
    conversation: (id: string) => `/chat/conversations/${id}`,
    messages: (conversationId: string) => `/chat/conversations/${conversationId}/messages`,
    sendMessage: (conversationId: string) => `/chat/conversations/${conversationId}/messages`,
    markAsRead: (conversationId: string) => `/chat/conversations/${conversationId}/read`,
    createConversation: '/chat/conversations',
    deleteConversation: (id: string) => `/chat/conversations/${id}`,
  },
  badges: {
    list: '/badges',
    byId: (id: string) => `/badges/${id}`,
    categories: '/badges/categories',
    award: '/badges/award',
    userBadges: (userId: string) => `/badges/users/${userId}`,
    leaderboard: '/badges/leaderboard',
  },
  admin: {
    dashboard: '/admin/dashboard',
    users: '/admin/users',
    transactions: '/admin/transactions',
    systemSettings: '/admin/settings',
    analytics: '/admin/analytics',
    auditLog: '/admin/audit-log',
    bulkActions: '/admin/bulk-actions',
  },
  system: {
    health: '/health',
    version: '/version',
    status: '/status',
  },
  wallets: {
    get: '/wallets',
    update: (id: string) => `/wallets/${id}`,
  },
};

// Safe runtime check
export const checkRuntimeConfig = (): boolean => {
  if (typeof window === 'undefined') {
    return false; // Server-side
  }
  
  try {
    return !!(
      typeof localStorage !== 'undefined' &&
      typeof fetch !== 'undefined' &&
      window.location
    );
  } catch {
    return false;
  }
};

export default APP_CONFIG;