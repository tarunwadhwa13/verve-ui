/**
 * Application constants for Verve
 * Centralized constants with type safety and environment awareness
 */

import { APP_CONFIG } from '../config/config';

const isDevelopment = () => APP_CONFIG.APP_ENV === 'development';
const isProduction = () => APP_CONFIG.APP_ENV === 'production';

// Brand constants
export const BRAND = {
  NAME: 'Verve',
  TAGLINE: 'Recognition Reimagined',
  VERSION: '1.0.0',
  COPYRIGHT: `© ${new Date().getFullYear()} Verve. All rights reserved.`,
} as const;

// Transaction types with type safety
export const TRANSACTION_TYPES = {
  SENT: 'sent',
  RECEIVED: 'received',
  ALL: 'all',
  PENDING: 'pending',
  CANCELLED: 'cancelled',
  FAILED: 'failed'
} as const;

export type TransactionType = typeof TRANSACTION_TYPES[keyof typeof TRANSACTION_TYPES];

// User roles with extended permissions
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  SUPER_ADMIN: 'super_admin'
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// User status types
export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  PENDING: 'pending'
} as const;

export type UserStatus = typeof USER_STATUS[keyof typeof USER_STATUS];

// Badge categories with descriptions
export const BADGE_CATEGORIES = {
  ACHIEVEMENT: {
    key: 'achievement',
    name: 'Achievement',
    description: 'Earned through specific accomplishments',
    icon: '🏆'
  },
  RECOGNITION: {
    key: 'recognition',
    name: 'Recognition',
    description: 'Given by peers for outstanding work',
    icon: '🌟'
  },
  MILESTONE: {
    key: 'milestone',
    name: 'Milestone',
    description: 'Awarded for reaching important milestones',
    icon: '🎯'
  },
  SPECIAL: {
    key: 'special',
    name: 'Special',
    description: 'Unique badges for special occasions',
    icon: '💎'
  },
  SEASONAL: {
    key: 'seasonal',
    name: 'Seasonal',
    description: 'Limited-time seasonal badges',
    icon: '🎃'
  }
} as const;

export type BadgeCategory = keyof typeof BADGE_CATEGORIES;

// Badge rarities with point values
export const BADGE_RARITIES = {
  COMMON: {
    key: 'common',
    name: 'Common',
    points: 10,
    color: '#9CA3AF',
    probability: 0.6
  },
  RARE: {
    key: 'rare',
    name: 'Rare',
    points: 25,
    color: '#3B82F6',
    probability: 0.25
  },
  EPIC: {
    key: 'epic',
    name: 'Epic',
    points: 50,
    color: '#8B5CF6',
    probability: 0.1
  },
  LEGENDARY: {
    key: 'legendary',
    name: 'Legendary',
    points: 100,
    color: '#F59E0B',
    probability: 0.04
  },
  MYTHIC: {
    key: 'mythic',
    name: 'Mythic',
    points: 200,
    color: '#EF4444',
    probability: 0.01
  }
} as const;

export type BadgeRarity = keyof typeof BADGE_RARITIES;

// Animation durations with easing
export const ANIMATIONS = {
  DURATION: {
    INSTANT: 0,
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
    EXTRA_SLOW: 800,
    ENVELOPE: 2000,
    LOADING: 1000
  },
  EASING: {
    EASE_IN: 'ease-in',
    EASE_OUT: 'ease-out',
    EASE_IN_OUT: 'ease-in-out',
    BOUNCE: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    SMOOTH: 'cubic-bezier(0.4, 0, 0.2, 1)'
  }
} as const;

// Pagination configuration
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  MIN_PAGE_SIZE: 5,
  ITEMS_PER_PAGE_OPTIONS: [10, 20, 50, 100] as const
} as const;

// File upload configuration
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_SIZE_DISPLAY: '5MB',
  ALLOWED_TYPES: [
    'image/jpeg',
    'image/jpg', 
    'image/png', 
    'image/gif', 
    'image/webp',
    'image/svg+xml'
  ] as const,
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'] as const,
  CHUNK_SIZE: 1024 * 1024 // 1MB chunks for large file uploads
} as const;

// Coin amounts for quick actions
export const COIN_AMOUNTS = {
  QUICK_SEND: [25, 50, 75, 100, 150, 200] as const,
  MINIMUM: 1,
  MAXIMUM: 1000,
  DEFAULT_STARTING_BALANCE: 500,
  DAILY_ALLOWANCE: 100
} as const;

// Time constants
export const TIME = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
  MONTH: 30 * 24 * 60 * 60 * 1000
} as const;

// Session management
export const SESSION = {
  TIMEOUT_WARNING: 5 * TIME.MINUTE, // Warn 5 minutes before expiry
  AUTO_LOGOUT: 30 * TIME.MINUTE,    // Auto logout after 30 minutes
  ACTIVITY_CHECK_INTERVAL: TIME.MINUTE, // Check activity every minute
  HEARTBEAT_INTERVAL: 5 * TIME.MINUTE   // Send heartbeat every 5 minutes
} as const;

// API rate limiting
export const RATE_LIMITS = {
  GLOBAL: {
    REQUESTS_PER_MINUTE: 60,
    BURST_LIMIT: 10
  },
  AUTH: {
    LOGIN_ATTEMPTS: 5,
    LOGIN_WINDOW: 15 * TIME.MINUTE,
    PASSWORD_RESET_REQUESTS: 3,
    PASSWORD_RESET_WINDOW: TIME.HOUR
  },
  TRANSACTIONS: {
    SENDS_PER_HOUR: 20,
    SENDS_PER_DAY: 100
  },
  UPLOADS: {
    FILES_PER_HOUR: 10,
    TOTAL_SIZE_PER_HOUR: 50 * 1024 * 1024 // 50MB
  }
} as const;

// Validation patterns
export const VALIDATION = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    DESCRIPTION: 'Password must contain at least 8 characters with uppercase, lowercase, number, and special character'
  },
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 30,
    PATTERN: /^[a-zA-Z0-9_-]+$/,
    DESCRIPTION: 'Username must be 3-30 characters and contain only letters, numbers, hyphens, and underscores'
  },
  COIN_AMOUNT: {
    MIN: 1,
    MAX: 1000,
    PATTERN: /^\d+$/
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
  },
  MESSAGE: {
    MAX_LENGTH: 500,
  }
} as const;

// Error codes and messages
export const ERRORS = {
  NETWORK: {
    CONNECTION_FAILED: 'Failed to connect to server',
    TIMEOUT: 'Request timed out',
    OFFLINE: 'You appear to be offline'
  },
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid email or password',
    SESSION_EXPIRED: 'Your session has expired',
    UNAUTHORIZED: 'You are not authorized to perform this action',
    TOKEN_EXPIRED: 'Authentication token has expired'
  },
  VALIDATION: {
    REQUIRED_FIELD: 'This field is required',
    INVALID_EMAIL: 'Please enter a valid email address',
    INVALID_PASSWORD: VALIDATION.PASSWORD.DESCRIPTION,
    INVALID_AMOUNT: 'Please enter a valid amount'
  },
  TRANSACTION: {
    INSUFFICIENT_BALANCE: 'Insufficient balance for this transaction',
    SELF_TRANSFER: 'You cannot send coins to yourself',
    USER_NOT_FOUND: 'Recipient not found',
    TRANSACTION_FAILED: 'Transaction failed to process'
  },
  UPLOAD: {
    FILE_TOO_LARGE: `File size must be less than ${FILE_UPLOAD.MAX_SIZE_DISPLAY}`,
    INVALID_TYPE: 'File type not supported',
    UPLOAD_FAILED: 'File upload failed'
  },
  GENERAL: {
    SOMETHING_WRONG: 'Something went wrong. Please try again.',
    SERVER_ERROR: 'Server error. Please try again later.',
    NOT_FOUND: 'The requested resource was not found',
    RATE_LIMITED: 'Too many requests. Please slow down.'
  }
} as const;

// Success messages
export const SUCCESS = {
  AUTH: {
    LOGIN: 'Welcome back!',
    LOGOUT: 'You have been logged out successfully',
    PASSWORD_RESET: 'Password reset email sent',
    REGISTRATION: 'Account created successfully'
  },
  TRANSACTION: {
    SENT: 'Coins sent successfully!',
    RECEIVED: 'Coins received!'
  },
  PROFILE: {
    UPDATED: 'Profile updated successfully',
    AVATAR_UPLOADED: 'Avatar updated successfully'
  },
  GENERAL: {
    SAVED: 'Changes saved successfully',
    DELETED: 'Deleted successfully',
    COPIED: 'Copied to clipboard'
  }
} as const;

// Notification types
export const NOTIFICATION_TYPES = {
  TRANSACTION: 'transaction',
  BADGE: 'badge',
  SYSTEM: 'system',
  CHAT: 'chat',
  ACHIEVEMENT: 'achievement',
  ANNOUNCEMENT: 'announcement'
} as const;

export type NotificationType = typeof NOTIFICATION_TYPES[keyof typeof NOTIFICATION_TYPES];

// Chat message types
export const CHAT_MESSAGE_TYPES = {
  TEXT: 'text',
  TRANSACTION: 'transaction',
  SYSTEM: 'system',
  IMAGE: 'image',
  FILE: 'file'
} as const;

export type ChatMessageType = typeof CHAT_MESSAGE_TYPES[keyof typeof CHAT_MESSAGE_TYPES];

// Default values
export const DEFAULTS = {
  AVATAR: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=faces',
  USER_NAME: 'Unknown User',
  DEPARTMENT: 'General',
  TIMEZONE: 'UTC',
  LANGUAGE: 'en',
  CURRENCY: 'COINS',
  THEME: 'system' as 'light' | 'dark' | 'system'
} as const;

// Storage keys (legacy compatibility)
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'verve_user',
  THEME: 'verve_theme',
  LANGUAGE: 'verve_language',
  NOTIFICATIONS_ENABLED: 'verve_notifications_enabled',
} as const;

// Date formats
export const DATE_FORMATS = {
  SHORT: 'MMM d, yyyy',
  LONG: 'MMMM d, yyyy',
  WITH_TIME: 'MMM d, yyyy h:mm a',
  TIME_ONLY: 'h:mm a',
  ISO: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
  RELATIVE: 'relative' // For "2 hours ago" etc.
} as const;

// Feature flags for development/production
export const FEATURES = {
  ENABLE_BETA_FEATURES: isDevelopment(),
  ENABLE_DEBUG_PANEL: isDevelopment(),
  ENABLE_PERFORMANCE_MONITORING: isProduction(),
  ENABLE_ERROR_BOUNDARY: true,
  ENABLE_SERVICE_WORKER: isProduction(),
  ENABLE_WEBSOCKETS: true,
  ENABLE_PUSH_NOTIFICATIONS: isProduction(),
  ENABLE_OFFLINE_MODE: false
} as const;

// URL patterns
export const URLS = {
  PRIVACY_POLICY: '/privacy',
  TERMS_OF_SERVICE: '/terms',
  SUPPORT: '/support',
  HELP: '/help',
  STATUS: '/status',
  API_DOCS: '/api-docs'
} as const;

// Social links (if needed)
export const SOCIAL = {
  TWITTER: 'https://twitter.com/verve',
  LINKEDIN: 'https://linkedin.com/company/verve',
  GITHUB: 'https://github.com/verve',
  SUPPORT_EMAIL: 'support@verve.company.com'
} as const;

// Legacy constants for backward compatibility
export const APP_CONFIG = {
  NAME: BRAND.NAME,
  TAGLINE: BRAND.TAGLINE,
  VERSION: BRAND.VERSION,
  MAX_COINS_PER_TRANSACTION: COIN_AMOUNTS.MAXIMUM,
  MIN_COINS_PER_TRANSACTION: COIN_AMOUNTS.MINIMUM,
  INITIAL_USER_BALANCE: COIN_AMOUNTS.DEFAULT_STARTING_BALANCE,
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: ERRORS.NETWORK.CONNECTION_FAILED,
  UNAUTHORIZED: ERRORS.AUTH.UNAUTHORIZED,
  FORBIDDEN: 'Access denied.',
  NOT_FOUND: ERRORS.GENERAL.NOT_FOUND,
  SERVER_ERROR: ERRORS.GENERAL.SERVER_ERROR,
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNKNOWN_ERROR: ERRORS.GENERAL.SOMETHING_WRONG,
};

export const SUCCESS_MESSAGES = {
  LOGIN: SUCCESS.AUTH.LOGIN,
  LOGOUT: SUCCESS.AUTH.LOGOUT,
  REGISTER: SUCCESS.AUTH.REGISTRATION,
  PASSWORD_RESET: SUCCESS.AUTH.PASSWORD_RESET,
  PROFILE_UPDATED: SUCCESS.PROFILE.UPDATED,
  COINS_SENT: SUCCESS.TRANSACTION.SENT,
  NOTIFICATION_MARKED_READ: 'Notification marked as read!',
  MESSAGE_SENT: 'Message sent successfully!',
};

export const VALIDATION_RULES = {
  EMAIL: VALIDATION.EMAIL,
  PASSWORD: {
    MIN_LENGTH: VALIDATION.PASSWORD.MIN_LENGTH,
    MAX_LENGTH: VALIDATION.PASSWORD.MAX_LENGTH,
  },
  NAME: {
    MIN_LENGTH: VALIDATION.NAME.MIN_LENGTH,
    MAX_LENGTH: VALIDATION.NAME.MAX_LENGTH,
  },
  MESSAGE: {
    MAX_LENGTH: VALIDATION.MESSAGE.MAX_LENGTH,
  },
};

// Export all as a single object for easy access
export const CONSTANTS = {
  BRAND,
  TRANSACTION_TYPES,
  USER_ROLES,
  USER_STATUS,
  BADGE_CATEGORIES,
  BADGE_RARITIES,
  ANIMATIONS,
  PAGINATION,
  FILE_UPLOAD,
  COIN_AMOUNTS,
  TIME,
  SESSION,
  RATE_LIMITS,
  VALIDATION,
  ERRORS,
  SUCCESS,
  NOTIFICATION_TYPES,
  CHAT_MESSAGE_TYPES,
  DEFAULTS,
  STORAGE_KEYS,
  DATE_FORMATS,
  FEATURES,
  URLS,
  SOCIAL
} as const;

export default CONSTANTS;