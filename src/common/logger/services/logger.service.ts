import {
  Injectable,
  Inject,
  Optional,
  LoggerService as NestLoggerService,
} from '@nestjs/common';
import {
  LogLevel,
  LOG_LEVEL_PRIORITY,
  LoggerConfig,
  LogEntry,
} from '@/common/logger/types';

/**
 * Injection token for logger configuration
 */
export const LOGGER_CONFIG = 'LOGGER_CONFIG';

/**
 * ANSI color codes for console output
 */
const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
  white: '\x1b[37m',
  bold: '\x1b[1m',
};

/**
 * Color mapping for log levels
 */
const LEVEL_COLORS: Record<LogLevel, string> = {
  [LogLevel.ERROR]: COLORS.red,
  [LogLevel.WARN]: COLORS.yellow,
  [LogLevel.INFO]: COLORS.blue,
  [LogLevel.DEBUG]: COLORS.cyan,
  [LogLevel.VERBOSE]: COLORS.gray,
};

/**
 * Default logger configuration
 */
const DEFAULT_CONFIG: LoggerConfig = {
  level: LogLevel.INFO,
  json: process.env.NODE_ENV === 'production',
  timestamp: true,
  appName: 'payment-service',
  environment: process.env.NODE_ENV || 'development',
  includeStackTrace: true,
  colorize: process.env.NODE_ENV !== 'production',
};

/**
 * Logger Service
 *
 * A centralized logging service that provides consistent logging across all modules.
 * Supports both pretty-printed and JSON-formatted output for different environments.
 *
 * ## Features
 *
 * - Multiple log levels (error, warn, info, debug, verbose)
 * - Structured logging with JSON output
 * - Pretty-printed output with colors for development
 * - Context-aware logging
 * - Correlation ID support for request tracing
 * - Error stack trace handling
 *
 * ## Usage
 *
 * ```typescript
 * @Injectable()
 * export class MyService {
 *   constructor(private readonly logger: LoggerService) {}
 *
 *   async doSomething() {
 *     this.logger.info('Starting operation', 'MyService', { userId: '123' });
 *
 *     try {
 *       // ... operation
 *       this.logger.debug('Operation completed', 'MyService');
 *     } catch (error) {
 *       this.logger.error('Operation failed', error, 'MyService');
 *     }
 *   }
 * }
 * ```
 */
@Injectable()
export class LoggerService implements NestLoggerService {
  private readonly config: LoggerConfig;
  private context?: string;

  constructor(
    @Optional() @Inject(LOGGER_CONFIG) config?: Partial<LoggerConfig>,
  ) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Set the default context for this logger instance
   */
  setContext(context: string): void {
    this.context = context;
  }

  /**
   * Create a child logger with a specific context
   */
  createChildLogger(context: string): LoggerService {
    const child = new LoggerService(this.config);
    child.setContext(context);
    return child;
  }

  /**
   * Log an error message
   */
  error(message: string, trace?: string | Error, context?: string): void {
    if (!this.shouldLog(LogLevel.ERROR)) return;

    const error = trace instanceof Error ? trace : undefined;
    const errorStack = trace instanceof Error ? trace.stack : trace;

    this.writeLog(
      LogLevel.ERROR,
      message,
      context || this.context || 'Application',
      {
        error: error
          ? {
              name: error.name,
              message: error.message,
              stack: this.config.includeStackTrace ? errorStack : undefined,
            }
          : errorStack
            ? { stack: errorStack }
            : undefined,
      },
    );
  }

  /**
   * Log a warning message
   */
  warn(
    message: string,
    context?: string,
    data?: Record<string, unknown>,
  ): void {
    if (!this.shouldLog(LogLevel.WARN)) return;
    this.writeLog(
      LogLevel.WARN,
      message,
      context || this.context || 'Application',
      { data },
    );
  }

  /**
   * Log an info message (alias for log)
   */
  log(message: string, context?: string, data?: Record<string, unknown>): void {
    this.info(message, context, data);
  }

  /**
   * Log an info message
   */
  info(
    message: string,
    context?: string,
    data?: Record<string, unknown>,
  ): void {
    if (!this.shouldLog(LogLevel.INFO)) return;
    this.writeLog(
      LogLevel.INFO,
      message,
      context || this.context || 'Application',
      { data },
    );
  }

  /**
   * Log a debug message
   */
  debug(
    message: string,
    context?: string,
    data?: Record<string, unknown>,
  ): void {
    if (!this.shouldLog(LogLevel.DEBUG)) return;
    this.writeLog(
      LogLevel.DEBUG,
      message,
      context || this.context || 'Application',
      { data },
    );
  }

  /**
   * Log a verbose message
   */
  verbose(
    message: string,
    context?: string,
    data?: Record<string, unknown>,
  ): void {
    if (!this.shouldLog(LogLevel.VERBOSE)) return;
    this.writeLog(
      LogLevel.VERBOSE,
      message,
      context || this.context || 'Application',
      { data },
    );
  }

  /**
   * Log with correlation ID for request tracing
   */
  logWithCorrelation(
    level: LogLevel,
    message: string,
    correlationId: string,
    context?: string,
    data?: Record<string, unknown>,
  ): void {
    if (!this.shouldLog(level)) return;
    this.writeLog(level, message, context || this.context || 'Application', {
      correlationId,
      data,
    });
  }

  /**
   * Check if a log level should be output based on configuration
   */
  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVEL_PRIORITY[level] <= LOG_LEVEL_PRIORITY[this.config.level];
  }

  /**
   * Write the log entry to output
   */
  private writeLog(
    level: LogLevel,
    message: string,
    context: string,
    options: {
      correlationId?: string;
      data?: Record<string, unknown>;
      error?: {
        name?: string;
        message?: string;
        stack?: string;
      };
    } = {},
  ): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      context,
      message,
      appName: this.config.appName,
      environment: this.config.environment,
      correlationId: options.correlationId,
      data: options.data,
      error: options.error,
    };

    if (this.config.json) {
      this.writeJson(entry);
    } else {
      this.writePretty(entry);
    }
  }

  /**
   * Write log entry as JSON
   */
  private writeJson(entry: LogEntry): void {
    // Remove undefined values for cleaner JSON output
    const cleanEntry = JSON.parse(JSON.stringify(entry));
    const output = JSON.stringify(cleanEntry);

    if (entry.level === LogLevel.ERROR) {
      console.error(output);
    } else if (entry.level === LogLevel.WARN) {
      console.warn(output);
    } else {
      console.log(output);
    }
  }

  /**
   * Write log entry with pretty formatting
   */
  private writePretty(entry: LogEntry): void {
    const { colorize } = this.config;
    const levelColor = colorize ? LEVEL_COLORS[entry.level] : '';
    const reset = colorize ? COLORS.reset : '';
    const gray = colorize ? COLORS.gray : '';
    const bold = colorize ? COLORS.bold : '';

    const levelStr = entry.level.toUpperCase().padEnd(7);
    const timestamp = entry.timestamp;
    const context = entry.context;

    let output = '';

    if (this.config.timestamp) {
      output += `${gray}${timestamp}${reset} `;
    }

    output += `${levelColor}${bold}[${levelStr}]${reset} `;
    output += `${gray}[${context}]${reset} `;
    output += entry.message;

    if (entry.correlationId) {
      output += ` ${gray}(correlationId: ${entry.correlationId})${reset}`;
    }

    // Determine output method based on level
    const logFn =
      entry.level === LogLevel.ERROR
        ? console.error
        : entry.level === LogLevel.WARN
          ? console.warn
          : console.log;

    logFn(output);

    // Log data if present
    if (entry.data && Object.keys(entry.data).length > 0) {
      logFn(`${gray}  Data:${reset}`, entry.data);
    }

    // Log error details if present
    if (entry.error) {
      if (entry.error.name && entry.error.message) {
        logFn(
          `${levelColor}  Error: ${entry.error.name}: ${entry.error.message}${reset}`,
        );
      }
      if (entry.error.stack && this.config.includeStackTrace) {
        logFn(`${gray}${entry.error.stack}${reset}`);
      }
    }
  }
}
