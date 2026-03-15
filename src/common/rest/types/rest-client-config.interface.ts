/**
 * REST Client Configuration
 *
 * Default configuration applied to all outbound HTTP requests.
 */
export interface RestClientConfig {
  /**
   * Default base URL prepended to relative request paths
   */
  baseURL?: string;

  /**
   * Default request timeout in milliseconds
   * @default 30000
   */
  timeout?: number;

  /**
   * Default headers included in every request
   */
  headers?: Record<string, string>;
}

/**
 * Per-request options that override module-level defaults
 */
export interface RestRequestOptions {
  /**
   * Additional headers for this request (merged with defaults)
   */
  headers?: Record<string, string>;

  /**
   * Query parameters appended to the URL
   */
  params?: Record<string, string | number | boolean>;

  /**
   * Request timeout in milliseconds (overrides module default)
   */
  timeout?: number;

  /**
   * Base URL override for this request
   */
  baseURL?: string;
}

/**
 * Typed HTTP response wrapper
 */
export interface RestResponse<T = unknown> {
  /**
   * HTTP status code
   */
  statusCode: number;

  /**
   * Response body
   */
  data: T;

  /**
   * Response headers
   */
  headers: Record<string, string>;
}

/**
 * REST Module Options
 *
 * Options for synchronous registration of the REST module
 */
export interface RestModuleOptions {
  /**
   * REST client configuration
   */
  config?: RestClientConfig;

  /**
   * Whether to make the module global
   * @default true
   */
  isGlobal?: boolean;
}

/**
 * REST Module Async Options
 *
 * Options for asynchronous registration of the REST module
 */
export interface RestModuleAsyncOptions {
  /**
   * Whether to make the module global
   * @default true
   */
  isGlobal?: boolean;

  /**
   * Dependencies to inject into the factory
   */
  inject?: any[];

  /**
   * Factory function to create the config
   */
  useFactory: (...args: any[]) => Promise<RestClientConfig> | RestClientConfig;
}
