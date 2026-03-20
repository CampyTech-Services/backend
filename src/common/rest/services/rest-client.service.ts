import { Injectable, Inject, Optional } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosError, AxiosRequestConfig } from 'axios';
import { LoggerService } from '@/common/logger';
import { RestClientPortService } from '@/common/rest/ports';
import { RestTimeoutException } from '@/common/rest/exceptions';
import type { RestClientConfig, RestRequestOptions, RestResponse } from '@/common/rest/types';
import { COMMON_LOG_MESSAGES } from '@/common/constants';

const { REST_CLIENT: REST_LOG } = COMMON_LOG_MESSAGES;

/**
 * Injection token for REST client configuration
 */
export const REST_CLIENT_CONFIG = 'REST_CLIENT_CONFIG';

/**
 * Default configuration values
 */
const DEFAULT_CONFIG: RestClientConfig = {
  timeout: 30000,
};

/**
 * REST Client Service
 *
 * Concrete adapter implementing the REST client port using Axios via @nestjs/axios.
 * Provides logging of outbound requests/responses and standardised error handling.
 */
@Injectable()
export class RestClientService implements RestClientPortService {
  private readonly config: RestClientConfig;
  private readonly logger: LoggerService;

  constructor(
    private readonly httpService: HttpService,
    loggerService: LoggerService,
    @Optional() @Inject(REST_CLIENT_CONFIG) config?: RestClientConfig,
  ) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.logger = loggerService.createChildLogger('RestClientService');
  }

  async get<T = unknown>(url: string, options?: RestRequestOptions): Promise<RestResponse<T>> {
    return this.request<T>('GET', url, undefined, options);
  }

  async post<T = unknown>(url: string, body?: unknown, options?: RestRequestOptions): Promise<RestResponse<T>> {
    return this.request<T>('POST', url, body, options);
  }

  async put<T = unknown>(url: string, body?: unknown, options?: RestRequestOptions): Promise<RestResponse<T>> {
    return this.request<T>('PUT', url, body, options);
  }

  async patch<T = unknown>(url: string, body?: unknown, options?: RestRequestOptions): Promise<RestResponse<T>> {
    return this.request<T>('PATCH', url, body, options);
  }

  async delete<T = unknown>(url: string, options?: RestRequestOptions): Promise<RestResponse<T>> {
    return this.request<T>('DELETE', url, undefined, options);
  }

  /**
   * Execute an HTTP request with logging and error handling
   */
  private async request<T>(method: string, url: string, body?: unknown, options?: RestRequestOptions): Promise<RestResponse<T>> {
    const axiosConfig: AxiosRequestConfig = {
      method,
      url,
      data: body,
      baseURL: options?.baseURL ?? this.config.baseURL,
      timeout: options?.timeout ?? this.config.timeout,
      headers: {
        ...this.config.headers,
        ...options?.headers,
      },
      params: options?.params,
    };

    const start = Date.now();

    this.logger.debug(REST_LOG.REQUEST_OUTBOUND(method, url), undefined, {
      baseURL: axiosConfig.baseURL,
      timeout: axiosConfig.timeout,
    });

    try {
      const response = await this.httpService.axiosRef.request<T>(axiosConfig);
      const duration = Date.now() - start;
      this.logger.debug(REST_LOG.RESPONSE_SUCCESS(method, url, response.status, duration), undefined, {
        statusCode: response.status,
        duration,
      });

      return {
        statusCode: response.status,
        data: response.data,
        headers: response.headers as Record<string, string>,
      };
    } catch (error) {
      const duration = Date.now() - start;

      if (error instanceof AxiosError) {
        const status = error.response?.status;
        this.logger.error(REST_LOG.RESPONSE_ERROR(method, url, status ?? 'NETWORK_ERROR', duration, error.message), error);

        if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT' || error.code === 'ERR_CANCELED') {
          throw new RestTimeoutException(method, url, axiosConfig.timeout ?? this.config.timeout ?? 0);
        }

        if (error.response) {
          return {
            statusCode: error.response.status,
            data: error.response.data as T,
            headers: error.response.headers as Record<string, string>,
          };
        }
      } else {
        this.logger.error(REST_LOG.RESPONSE_UNKNOWN_ERROR(method, url, duration), error as Error);
      }
      throw error;
    }
  }
}
