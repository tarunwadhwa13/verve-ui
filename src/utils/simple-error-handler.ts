/**
 * Simplified error handler to avoid circular dependencies
 */

import { logger } from './simple-logger';

export enum ErrorCode {
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT',
  UNAUTHORIZED = 'UNAUTHORIZED',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export interface AppError extends Error {
  code: ErrorCode;
  statusCode?: number;
  context?: string;
  timestamp: string;
}

class SimpleErrorHandler {
  createError(
    code: ErrorCode,
    message?: string,
    context?: string,
    statusCode?: number
  ): AppError {
    const error = new Error(message || 'An error occurred') as AppError;
    error.code = code;
    error.context = context;
    error.statusCode = statusCode;
    error.timestamp = new Date().toISOString();
    return error;
  }

  handleError(error: Error | AppError, context?: string): AppError {
    let appError: AppError;

    if (this.isAppError(error)) {
      appError = error;
    } else {
      appError = this.convertToAppError(error, context);
    }

    // Log the error safely
    try {
      logger.error(
        `Error in ${appError.context || context || 'Unknown'}`,
        appError,
        appError.context || context
      );
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }

    return appError;
  }

  private isAppError(error: any): error is AppError {
    return error && typeof error.code === 'string' && Object.values(ErrorCode).includes(error.code);
  }

  private convertToAppError(error: Error, context?: string): AppError {
    let code = ErrorCode.UNKNOWN_ERROR;
    let statusCode: number | undefined;

    // Determine error code from error properties
    if ('status' in error) {
      statusCode = (error as any).status;
      code = this.statusCodeToErrorCode(statusCode);
    } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
      code = ErrorCode.NETWORK_ERROR;
    } else if (error.name === 'AbortError') {
      code = ErrorCode.TIMEOUT;
    }

    const appError = this.createError(code, error.message, context, statusCode);
    appError.stack = error.stack;
    
    return appError;
  }

  private statusCodeToErrorCode(statusCode: number): ErrorCode {
    switch (statusCode) {
      case 400:
        return ErrorCode.VALIDATION_ERROR;
      case 401:
      case 403:
        return ErrorCode.UNAUTHORIZED;
      case 408:
        return ErrorCode.TIMEOUT;
      case 500:
      case 502:
      case 503:
        return ErrorCode.SERVER_ERROR;
      default:
        return ErrorCode.UNKNOWN_ERROR;
    }
  }
}

// Export singleton instance
export const errorHandler = new SimpleErrorHandler();

// Convenience functions
export const createError = (
  code: ErrorCode,
  message?: string,
  context?: string
) => errorHandler.createError(code, message, context);

export const handleError = (error: Error, context?: string) => 
  errorHandler.handleError(error, context);

export default errorHandler;