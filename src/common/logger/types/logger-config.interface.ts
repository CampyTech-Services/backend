import { LogLevel } from '@/common/logger/types/log-level.enum';

/**
 * Logger Configuration Interface
 *
 * Defines the configuration options for the logger service.
 */
export interface LoggerConfig {
  /**
   * Minimum log level to output
   * Messages below this level will be filtered out
   * @default LogLevel.INFO
   */
  level: LogLevel;

  /**
   * Whether to output logs in JSON format
   * Useful for log aggregation tools (ELK, Datadog, etc.)
   * @default false (uses pretty print in development)
   */
  json: boolean;

  /**
   * Whether to include timestamps in log output
   * @default true
   */
  timestamp: boolean;

  /**
   * Application name to include in log metadata
   * @default 'payment-service'
   */
  appName: string;

  /**
   * Environment name (development, staging, production)
   * @default process.env.NODE_ENV
   */
  environment: string;

  /**
   * Whether to include stack traces for errors
   * @default true
   */
  includeStackTrace: boolean;

  /**
   * Whether to colorize console output (only applies when json is false)
   * @default true in development, false in production
   */
  colorize: boolean;
}

/**
 * Log Entry Interface
 *
 * Represents a structured log entry
 */
export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  context: string;
  message: string;
  appName: string;
  environment: string;
  correlationId?: string;
  data?: Record<string, unknown>;
  error?: {
    name?: string;
    message?: string;
    stack?: string;
  };
}

/**
 * Logger Module Options
 *
 * Options for registering the logger module
 */
export interface LoggerModuleOptions {
  /**
   * Partial configuration options
   * Will be merged with defaults
   */
  config?: Partial<LoggerConfig>;

  /**
   * Whether to make the module global
   * @default true
   */
  isGlobal?: boolean;
}

/**
 * Logger Module Async Options
 *
 * Options for async registration of the logger module
 */
export interface LoggerModuleAsyncOptions {
  /**
   * Whether to make the module global
   * @default true
   */
  isGlobal?: boolean;

  /**
   * Dependencies to inject
   */
  inject?: any[];

  /**
   * Factory function to create config
   */
  useFactory: (
    ...args: any[]
  ) => Promise<Partial<LoggerConfig>> | Partial<LoggerConfig>;
}
