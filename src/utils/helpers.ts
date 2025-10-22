import { VALIDATION_RULES } from './constants';

// Simple date formatting utilities (without external dependencies)
export function formatDate(date: string | Date, formatType: 'SHORT' | 'LONG' | 'WITH_TIME' | 'TIME_ONLY' | 'ISO' = 'SHORT'): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    switch (formatType) {
      case 'SHORT':
        return dateObj.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        });
      case 'LONG':
        return dateObj.toLocaleDateString('en-US', { 
          month: 'long', 
          day: 'numeric', 
          year: 'numeric' 
        });
      case 'WITH_TIME':
        return dateObj.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit'
        });
      case 'TIME_ONLY':
        return dateObj.toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit' 
        });
      case 'ISO':
        return dateObj.toISOString();
      default:
        return dateObj.toLocaleDateString();
    }
  } catch (error) {
    console.error('Invalid date format:', error);
    return 'Invalid date';
  }
}

export function formatRelativeTime(date: string | Date): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInMs = now.getTime() - dateObj.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      return diffInMinutes < 1 ? 'Just now' : `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    } else {
      return formatDate(dateObj, 'SHORT');
    }
  } catch (error) {
    console.error('Invalid date format:', error);
    return 'Unknown time';
  }
}

// Number formatting utilities
export function formatCurrency(amount: number, currency: string = 'coins'): string {
  const formatter = new Intl.NumberFormat('en-US');
  return `${formatter.format(amount)} ${currency}`;
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

export function formatPercentage(value: number, total: number): string {
  const percentage = (value / total) * 100;
  return `${Math.round(percentage)}%`;
}

// String utilities
export function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength - 3) + '...';
}

export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Validation utilities
export function isValidEmail(email: string): boolean {
  return VALIDATION_RULES.EMAIL.test(email);
}

export function isValidPassword(password: string): boolean {
  return password.length >= VALIDATION_RULES.PASSWORD.MIN_LENGTH &&
         password.length <= VALIDATION_RULES.PASSWORD.MAX_LENGTH;
}

export function isValidName(name: string): boolean {
  return name.trim().length >= VALIDATION_RULES.NAME.MIN_LENGTH &&
         name.trim().length <= VALIDATION_RULES.NAME.MAX_LENGTH;
}

export function isValidMessage(message: string): boolean {
  return message.trim().length > 0 &&
         message.length <= VALIDATION_RULES.MESSAGE.MAX_LENGTH;
}

// Array utilities
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const group = String(item[key]);
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

export function sortBy<T>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
}

export function uniqueBy<T>(array: T[], key: keyof T): T[] {
  const seen = new Set();
  return array.filter(item => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
}

// Object utilities
export function omit<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj };
  keys.forEach(key => delete result[key]);
  return result;
}

export function pick<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
}

// Local storage utilities
export function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error);
    return defaultValue;
  }
}

export function setToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage key "${key}":`, error);
  }
}

export function removeFromStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage key "${key}":`, error);
  }
}

// URL utilities
export function buildUrl(base: string, params: Record<string, string | number | boolean>): string {
  const url = new URL(base);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, String(value));
    }
  });
  return url.toString();
}

export function getUrlParam(param: string): string | null {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Color utilities
export function getRarityColor(rarity: string): string {
  const colors: Record<string, string> = {
    common: 'text-gray-600',
    rare: 'text-blue-600',
    epic: 'text-purple-600',
    legendary: 'text-orange-600',
  };
  return colors[rarity] || colors.common;
}

export function getRarityBgColor(rarity: string): string {
  const colors: Record<string, string> = {
    common: 'bg-gray-100',
    rare: 'bg-blue-100',
    epic: 'bg-purple-100',
    legendary: 'bg-orange-100',
  };
  return colors[rarity] || colors.common;
}

// Debounce utility
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle utility
export function throttle<T extends (...args: any[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Error handling utilities
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred';
}

export function isNetworkError(error: unknown): boolean {
  return error instanceof Error && 
    (error.message.includes('fetch') || 
     error.message.includes('network') ||
     error.name === 'TypeError');
}