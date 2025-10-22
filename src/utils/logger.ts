/**
 * Production-ready logging utility for Verve application
 * Provides structured logging with different levels and environment-aware behavior
 */

// Import config safely to avoid circular dependency issues
let ENABLE_DEBUG_LOGS = true;
let ENABLE_ERROR_REPORTING = false;
let APP_ENV: string = 'development';

try {
  const config = require('../config/environment');
  ENABLE_DEBUG_LOGS = config.ENABLE_DEBUG_LOGS ?? true;
  ENABLE_ERROR_REPORTING = config.ENABLE_ERROR_REPORTING ?? false;
  APP_ENV = config.APP_ENV ?? 'development';
} catch (error) {
  console.warn('Could not load environment config in logger, using defaults');
}

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4,
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: string;
  data?: any;
  error?: Error;
  userId?: string;
  sessionId?: string;
  requestId?: string;
}

export interface LoggerConfig {
  minLevel: LogLevel;
  enableConsoleOutput: boolean;
  enableRemoteLogging: boolean;
  remoteEndpoint?: string;
  maxLogEntries: number;
  enableStackTrace: boolean;
}

class Logger {
  private config: LoggerConfig;
  private logBuffer: LogEntry[] = [];
  private sessionId: string;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      minLevel: APP_ENV === 'production' ? LogLevel.WARN : LogLevel.DEBUG,
      enableConsoleOutput: ENABLE_DEBUG_LOGS,
      enableRemoteLogging: ENABLE_ERROR_REPORTING,
      maxLogEntries: 1000,
      enableStackTrace: APP_ENV !== 'production',
      ...config
    };

    this.sessionId = this.generateSessionId();
    
    // Setup error reporting for production
    if (this.config.enableRemoteLogging) {
      this.setupErrorReporting();
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.config.minLevel;
  }

  private formatMessage(level: LogLevel, message: string, context?: string): string {
    const levelName = LogLevel[level];
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` [${context}]` : '';
    return `${timestamp} ${levelName}${contextStr}: ${message}`;
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: string,
    data?: any,
    error?: Error
  ): LogEntry {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
    };

    if (context) entry.context = context;
    if (data !== undefined) entry.data = data;
    if (error) entry.error = error;

    // Add user context if available
    try {
      const userStr = localStorage.getItem('verve_user_data');
      if (userStr) {
        const user = JSON.parse(userStr);
        entry.userId = user.id;
      }
    } catch {
      // Ignore storage errors
    }

    return entry;
  }

  private outputToConsole(entry: LogEntry): void {
    if (!this.config.enableConsoleOutput) return;

    const formattedMessage = this.formatMessage(entry.level, entry.message, entry.context);
    
    const consoleData = [];
    if (entry.data !== undefined) consoleData.push(entry.data);
    if (entry.error) consoleData.push(entry.error);

    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(formattedMessage, ...consoleData);
        break;
      case LogLevel.INFO:
        console.info(formattedMessage, ...consoleData);
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage, ...consoleData);
        break;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        console.error(formattedMessage, ...consoleData);
        if (this.config.enableStackTrace && entry.error?.stack) {
          console.error('Stack trace:', entry.error.stack);
        }
        break;
    }
  }

  private addToBuffer(entry: LogEntry): void {
    this.logBuffer.push(entry);
    
    // Keep buffer size manageable
    if (this.logBuffer.length > this.config.maxLogEntries) {
      this.logBuffer = this.logBuffer.slice(-this.config.maxLogEntries);
    }
  }

  private async sendToRemote(entry: LogEntry): Promise<void> {
    if (!this.config.enableRemoteLogging || !this.config.remoteEndpoint) {
      return;
    }

    try {
      await fetch(this.config.remoteEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entry)
      });
    } catch (error) {
      // Fallback to console if remote logging fails
      console.error('Failed to send log to remote endpoint:', error);
    }
  }

  private log(
    level: LogLevel,
    message: string,
    context?: string,
    data?: any,
    error?: Error
  ): void {
    if (!this.shouldLog(level)) return;

    const entry = this.createLogEntry(level, message, context, data, error);
    
    this.outputToConsole(entry);
    this.addToBuffer(entry);
    
    // Send high priority logs to remote immediately
    if (level >= LogLevel.ERROR && this.config.enableRemoteLogging) {
      this.sendToRemote(entry).catch(() => {
        // Silent failure for remote logging
      });
    }
  }

  debug(message: string, context?: string, data?: any): void {
    this.log(LogLevel.DEBUG, message, context, data);
  }

  info(message: string, context?: string, data?: any): void {
    this.log(LogLevel.INFO, message, context, data);
  }

  warn(message: string, context?: string, data?: any): void {
    this.log(LogLevel.WARN, message, context, data);
  }

  error(message: string, error?: Error, context?: string, data?: any): void {
    this.log(LogLevel.ERROR, message, context, data, error);
  }

  fatal(message: string, error?: Error, context?: string, data?: any): void {
    this.log(LogLevel.FATAL, message, context, data, error);
  }

  // Performance logging
  time(label: string): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.time(label);
    }
  }

  timeEnd(label: string): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.timeEnd(label);
    }
  }

  // Get recent logs for debugging
  getRecentLogs(count: number = 50): LogEntry[] {
    return this.logBuffer.slice(-count);
  }

  // Get logs by level
  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logBuffer.filter(entry => entry.level === level);
  }

  // Clear log buffer
  clearLogs(): void {
    this.logBuffer = [];
  }

  // Setup global error handling
  private setupErrorReporting(): void {
    // Catch unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.error(
        'Unhandled promise rejection',
        event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
        'Global',
        { promise: event.promise }
      );
    });

    // Catch unhandled errors
    window.addEventListener('error', (event) => {
      this.error(
        'Unhandled error',
        event.error || new Error(event.message),
        'Global',
        {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        }
      );
    });

    // Catch React errors (if using React error boundaries)
    window.addEventListener('react-error', (event: any) => {
      this.error(
        'React error boundary caught error',
        event.detail.error,
        'React',
        event.detail.errorInfo
      );
    });
  }

  // Export logs for debugging
  exportLogs(): string {
    return JSON.stringify(this.logBuffer, null, 2);
  }

  // Set minimum log level dynamically
  setMinLevel(level: LogLevel): void {
    this.config.minLevel = level;
  }

  // Get current session ID
  getSessionId(): string {
    return this.sessionId;
  }
}

// Create singleton logger instance
export const logger = new Logger();

// Convenience functions for common logging patterns
export const logApiRequest = (method: string, endpoint: string, requestId?: string) => {
  logger.debug(`API ${method} ${endpoint}`, 'API', { requestId });
};

export const logApiResponse = (
  method: string, 
  endpoint: string, 
  status: number, 
  duration: number,
  requestId?: string
) => {
  const level = status >= 400 ? LogLevel.WARN : LogLevel.DEBUG;
  logger.log(
    level,
    `API ${method} ${endpoint} ${status} (${duration}ms)`,
    'API',
    { status, duration, requestId }
  );
};

export const logApiError = (
  method: string, 
  endpoint: string, 
  error: Error,
  requestId?: string
) => {
  logger.error(
    `API ${method} ${endpoint} failed`,
    error,
    'API',
    { requestId }
  );
};

export const logUserAction = (action: string, data?: any) => {
  logger.info(`User action: ${action}`, 'User', data);
};

export const logPerformance = (operation: string, duration: number, metadata?: any) => {
  logger.info(`Performance: ${operation} completed in ${duration}ms`, 'Performance', metadata);
};

export default logger;