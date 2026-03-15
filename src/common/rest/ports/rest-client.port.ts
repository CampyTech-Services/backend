import { RestRequestOptions, RestResponse } from '@/common/rest/types';

/**
 * REST Client Port
 *
 * Abstract outbound port defining the contract for making HTTP requests
 * to third-party services. Consumer modules inject this port and remain
 * decoupled from the underlying HTTP implementation.
 *
 * ## Usage
 *
 * ```typescript
 * @Injectable()
 * export class PaymentProviderService {
 *   constructor(private readonly restClient: RestClientPortService) {}
 *
 *   async initiateCharge(payload: ChargeDto) {
 *     const response = await this.restClient.post<ChargeResponse>(
 *       'https://api.provider.com/charges',
 *       payload,
 *       { headers: { Authorization: 'Bearer sk_xxx' }, timeout: 10000 },
 *     );
 *     return response.data;
 *   }
 * }
 * ```
 */
export abstract class RestClientPortService {
  /**
   * Send an HTTP GET request
   */
  abstract get<T = unknown>(
    url: string,
    options?: RestRequestOptions,
  ): Promise<RestResponse<T>>;

  /**
   * Send an HTTP POST request
   */
  abstract post<T = unknown>(
    url: string,
    body?: unknown,
    options?: RestRequestOptions,
  ): Promise<RestResponse<T>>;

  /**
   * Send an HTTP PUT request
   */
  abstract put<T = unknown>(
    url: string,
    body?: unknown,
    options?: RestRequestOptions,
  ): Promise<RestResponse<T>>;

  /**
   * Send an HTTP PATCH request
   */
  abstract patch<T = unknown>(
    url: string,
    body?: unknown,
    options?: RestRequestOptions,
  ): Promise<RestResponse<T>>;

  /**
   * Send an HTTP DELETE request
   */
  abstract delete<T = unknown>(
    url: string,
    options?: RestRequestOptions,
  ): Promise<RestResponse<T>>;
}
