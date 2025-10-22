/**
 * Simplified logging utility to avoid circular dependencies
 */

// Simple log level enum
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4,
}

// Simple logger class
class SimpleLogger {
  private minLevel: LogLevel = LogLevel.DEBUG;
  private enableConsole: boolean = true;

  constructor() {
    // Set production log level
    if (typeof window !== 'undefined' && window.location?.hostname !== 'localhost') {
      this.minLevel = LogLevel.WARN;
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.minLevel;
  }

  private log(level: LogLevel, message: string, context?: string, data?: any, error?: Error): void {
    if (!this.shouldLog(level) || !this.enableConsole) return;

    const timestamp = new Date().toISOString();
    const levelName = LogLevel[level];
    const contextStr = context ? ` [${context}]` : '';
    const formattedMessage = `${timestamp} ${levelName}${contextStr}: ${message}`;

    const logData = [];
    if (data !== undefined) logData.push(data);
    if (error) logData.push(error);

    try {
      switch (level) {
        case LogLevel.DEBUG:
          console.debug(formattedMessage, ...logData);
          break;
        case LogLevel.INFO:
          console.info(formattedMessage, ...logData);
          break;
        case LogLevel.WARN:
          console.warn(formattedMessage, ...logData);
          break;
        case LogLevel.ERROR:
        case LogLevel.FATAL:
          console.error(formattedMessage, ...logData);
          break;
      }
    } catch (consoleError) {
      // Fallback if console methods fail
      console.log(`${levelName}: ${message}`, ...logData);
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

  setMinLevel(level: LogLevel): void {
    this.minLevel = level;
  }
}

// Export singleton instance
export const logger = new SimpleLogger();
export default logger;