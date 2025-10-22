/**
 * Comprehensive error handling utilities for Verve application
 * Provides standardized error handling, reporting, and user-friendly error messages
 */

import { logger } from './logger';

// Import isProduction safely to avoid circular dependency
let isProduction = () => false;
try {
  const envConfig = require('../config/environment');
  isProduction = envConfig.isProduction || (() => false);
} catch (error) {
  console.warn('Could not load isProduction from environment config');
}

export enum ErrorCode {
  // Network errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT',
  RATE_LIMITED = 'RATE_LIMITED',
  
  // Authentication errors
  UNAUTHORIZED = 'UNAUTHORIZED',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  
  // Validation errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  INVALID_FORMAT = 'INVALID_FORMAT',
  
  // Business logic errors
  INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  TRANSACTION_NOT_FOUND = 'TRANSACTION_NOT_FOUND',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  
  // System errors
  SERVER_ERROR = 'SERVER_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  
  // Client errors
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  CLIENT_ERROR = 'CLIENT_ERROR',
}

export interface AppError extends Error {
  code: ErrorCode;
  statusCode?: number;
  context?: string;
  metadata?: Record<string, any>;
  userMessage?: string;
  isRetryable?: boolean;
  timestamp: string;
  requestId?: string;
}

export interface ErrorDetails {
  title: string;
  message: string;
  suggestions?: string[];
  action?: {
    label: string;
    handler: () => void;
  };
}

class ErrorHandler {
  private errorMap: Map<ErrorCode, ErrorDetails> = new Map();

  constructor() {
    this.initializeErrorMap();
  }

  private initializeErrorMap(): void {
    // Network errors
    this.errorMap.set(ErrorCode.NETWORK_ERROR, {
      title: 'Connection Problem',
      message: 'Unable to connect to our servers. Please check your internet connection and try again.',
      suggestions: [
        'Check your internet connection',
        'Try refreshing the page',
        'Contact support if the problem persists'
      ]
    });

    this.errorMap.set(ErrorCode.TIMEOUT, {
      title: 'Request Timeout',
      message: 'The request took too long to complete. Please try again.',
      suggestions: [
        'Try again with a slower connection',
        'Check if the server is overloaded'
      ]
    });

    this.errorMap.set(ErrorCode.RATE_LIMITED, {
      title: 'Too Many Requests',
      message: 'You\'re making requests too quickly. Please wait a moment and try again.',
      suggestions: [
        'Wait a few seconds before trying again',
        'Reduce the frequency of your actions'
      ]
    });

    // Authentication errors
    this.errorMap.set(ErrorCode.UNAUTHORIZED, {
      title: 'Access Denied',
      message: 'You don\'t have permission to access this resource.',
      suggestions: [
        'Make sure you\'re logged in',
        'Contact your administrator for access'
      ]
    });

    this.errorMap.set(ErrorCode.TOKEN_EXPIRED, {
      title: 'Session Expired',
      message: 'Your session has expired. Please log in again.',
      suggestions: [
        'Log in again to continue',
        'Enable "Remember me" to stay logged in longer'
      ]
    });

    this.errorMap.set(ErrorCode.INVALID_CREDENTIALS, {
      title: 'Invalid Login',
      message: 'The email or password you entered is incorrect.',
      suggestions: [
        'Double-check your email and password',
        'Use the "Forgot Password" link if needed'
      ]
    });

    this.errorMap.set(ErrorCode.SESSION_EXPIRED, {
      title: 'Session Expired',
      message: 'Your session has expired due to inactivity. Please log in again.',
      suggestions: [
        'Log in again to continue',
        'Stay active to keep your session alive'
      ]
    });

    // Validation errors
    this.errorMap.set(ErrorCode.VALIDATION_ERROR, {
      title: 'Invalid Input',
      message: 'Please check your input and try again.',
      suggestions: [
        'Make sure all required fields are filled',
        'Check that your input meets the requirements'
      ]
    });

    this.errorMap.set(ErrorCode.MISSING_REQUIRED_FIELD, {
      title: 'Missing Information',
      message: 'Please fill in all required fields.',
      suggestions: [
        'Look for fields marked with an asterisk (*)',
        'Make sure all required information is provided'
      ]
    });

    this.errorMap.set(ErrorCode.INVALID_FORMAT, {
      title: 'Invalid Format',
      message: 'The information you entered is not in the correct format.',
      suggestions: [
        'Check the format requirements',
        'Use the examples provided as a guide'
      ]
    });

    // Business logic errors
    this.errorMap.set(ErrorCode.INSUFFICIENT_BALANCE, {
      title: 'Insufficient Balance',
      message: 'You don\'t have enough coins to complete this transaction.',
      suggestions: [
        'Check your current balance',
        'Request coins from colleagues',
        'Complete activities to earn more coins'
      ]
    });

    this.errorMap.set(ErrorCode.USER_NOT_FOUND, {
      title: 'User Not Found',
      message: 'The user you\'re looking for could not be found.',
      suggestions: [
        'Check the spelling of the username or email',
        'Make sure the user is still active',
        'Contact support if you believe this is an error'
      ]
    });

    this.errorMap.set(ErrorCode.TRANSACTION_NOT_FOUND, {
      title: 'Transaction Not Found',
      message: 'The transaction you\'re looking for could not be found.',
      suggestions: [
        'Check the transaction ID',
        'Make sure you have permission to view this transaction'
      ]
    });

    this.errorMap.set(ErrorCode.PERMISSION_DENIED, {
      title: 'Permission Denied',
      message: 'You don\'t have permission to perform this action.',
      suggestions: [
        'Contact your administrator for access',
        'Make sure you\'re logged in with the correct account'
      ]
    });

    // System errors
    this.errorMap.set(ErrorCode.SERVER_ERROR, {
      title: 'Server Error',
      message: 'Something went wrong on our end. We\'re working to fix it.',
      suggestions: [
        'Try again in a few minutes',
        'Contact support if the problem persists'
      ]
    });

    this.errorMap.set(ErrorCode.DATABASE_ERROR, {
      title: 'Data Error',
      message: 'We\'re having trouble accessing your data. Please try again.',
      suggestions: [
        'Try refreshing the page',
        'Contact support if the problem continues'
      ]
    });

    this.errorMap.set(ErrorCode.SERVICE_UNAVAILABLE, {
      title: 'Service Unavailable',
      message: 'The service is temporarily unavailable. Please try again later.',
      suggestions: [
        'Check our status page for updates',
        'Try again in a few minutes'
      ]
    });

    // Client errors
    this.errorMap.set(ErrorCode.UNKNOWN_ERROR, {
      title: 'Unexpected Error',
      message: 'Something unexpected happened. Please try again.',
      suggestions: [
        'Try refreshing the page',
        'Contact support with details about what you were doing'
      ]
    });

    this.errorMap.set(ErrorCode.CLIENT_ERROR, {
      title: 'Application Error',
      message: 'There was a problem with the application. Please try again.',
      suggestions: [
        'Try refreshing the page',
        'Clear your browser cache and cookies'
      ]
    });
  }

  /**
   * Create a standardized error object
   */
  createError(
    code: ErrorCode,
    message?: string,
    context?: string,
    metadata?: Record<string, any>,
    statusCode?: number
  ): AppError {
    const error = new Error(message || this.getErrorDetails(code).message) as AppError;
    error.code = code;
    error.context = context;
    error.metadata = metadata;
    error.statusCode = statusCode;
    error.timestamp = new Date().toISOString();
    error.isRetryable = this.isRetryableError(code);
    
    return error;
  }

  /**
   * Handle and log an error appropriately
   */
  handleError(error: Error | AppError, context?: string): AppError {
    let appError: AppError;

    if (this.isAppError(error)) {
      appError = error;
    } else {
      appError = this.convertToAppError(error, context);
    }

    // Log the error
    logger.error(
      `Error in ${appError.context || context || 'Unknown'}`,
      error,
      appError.context || context,
      appError.metadata
    );

    // Report to external service in production
    if (isProduction() && appError.code !== ErrorCode.VALIDATION_ERROR) {
      this.reportError(appError);
    }

    return appError;
  }

  /**
   * Get user-friendly error details
   */
  getErrorDetails(code: ErrorCode): ErrorDetails {
    return this.errorMap.get(code) || this.errorMap.get(ErrorCode.UNKNOWN_ERROR)!;
  }

  /**
   * Check if an error is retryable
   */
  isRetryableError(code: ErrorCode): boolean {
    const retryableCodes = [
      ErrorCode.NETWORK_ERROR,
      ErrorCode.TIMEOUT,
      ErrorCode.SERVER_ERROR,
      ErrorCode.DATABASE_ERROR,
      ErrorCode.SERVICE_UNAVAILABLE
    ];
    return retryableCodes.includes(code);
  }

  /**
   * Check if an error is an AppError
   */
  private isAppError(error: any): error is AppError {
    return error && typeof error.code === 'string' && Object.values(ErrorCode).includes(error.code);
  }

  /**
   * Convert a generic error to an AppError
   */
  private convertToAppError(error: Error, context?: string): AppError {
    let code = ErrorCode.UNKNOWN_ERROR;
    let statusCode: number | undefined;

    // Try to determine error code from error properties
    if ('status' in error) {
      statusCode = (error as any).status;
      code = this.statusCodeToErrorCode(statusCode);
    } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
      code = ErrorCode.NETWORK_ERROR;
    } else if (error.name === 'AbortError') {
      code = ErrorCode.TIMEOUT;
    } else if (error.message.includes('validation')) {
      code = ErrorCode.VALIDATION_ERROR;
    }

    const appError = this.createError(code, error.message, context, undefined, statusCode);
    appError.stack = error.stack;
    
    return appError;
  }

  /**
   * Convert HTTP status codes to error codes
   */
  private statusCodeToErrorCode(statusCode: number): ErrorCode {
    switch (statusCode) {
      case 400:
        return ErrorCode.VALIDATION_ERROR;
      case 401:
        return ErrorCode.UNAUTHORIZED;
      case 403:
        return ErrorCode.PERMISSION_DENIED;
      case 404:
        return ErrorCode.USER_NOT_FOUND;
      case 408:
        return ErrorCode.TIMEOUT;
      case 429:
        return ErrorCode.RATE_LIMITED;
      case 500:
        return ErrorCode.SERVER_ERROR;
      case 502:
      case 503:
        return ErrorCode.SERVICE_UNAVAILABLE;
      default:
        return ErrorCode.UNKNOWN_ERROR;
    }
  }

  /**
   * Report error to external service
   */
  private async reportError(error: AppError): Promise<void> {
    try {
      // This would typically send to an error reporting service like Sentry
      // For now, we'll just log it
      logger.error('Error reported to external service', error, 'ErrorReporting');
    } catch (reportingError) {
      logger.error('Failed to report error to external service', reportingError as Error, 'ErrorReporting');
    }
  }

  /**
   * Create a user-friendly error message with recovery suggestions
   */
  createUserMessage(error: AppError): {
    title: string;
    message: string;
    suggestions: string[];
    canRetry: boolean;
  } {
    const details = this.getErrorDetails(error.code);
    
    return {
      title: details.title,
      message: error.userMessage || details.message,
      suggestions: details.suggestions || [],
      canRetry: error.isRetryable || false
    };
  }

  /**
   * Retry an operation with exponential backoff
   */
  async withRetry<T>(
    operation: () => Promise<T>,
    maxAttempts: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    let lastError: AppError;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = this.handleError(error as Error, 'RetryOperation');
        
        if (!lastError.isRetryable || attempt === maxAttempts) {
          throw lastError;
        }

        // Exponential backoff with jitter
        const delay = baseDelay * Math.pow(2, attempt - 1) + Math.random() * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        
        logger.info(`Retrying operation, attempt ${attempt + 1}/${maxAttempts}`, 'RetryOperation');
      }
    }

    throw lastError!;
  }
}

// Create singleton error handler instance
export const errorHandler = new ErrorHandler();

// Convenience functions
export const createError = (
  code: ErrorCode,
  message?: string,
  context?: string,
  metadata?: Record<string, any>
) => errorHandler.createError(code, message, context, metadata);

export const handleError = (error: Error, context?: string) => 
  errorHandler.handleError(error, context);

export const getErrorDetails = (code: ErrorCode) => 
  errorHandler.getErrorDetails(code);

export const withRetry = <T>(
  operation: () => Promise<T>,
  maxAttempts?: number,
  baseDelay?: number
) => errorHandler.withRetry(operation, maxAttempts, baseDelay);

export default errorHandler;