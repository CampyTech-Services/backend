import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Exception thrown when an outbound HTTP request exceeds the configured timeout.
 *
 * Returns HTTP 504 (Gateway Timeout) to the client with details about the
 * failed upstream request.
 */
export class RestTimeoutException extends HttpException {
  constructor(method: string, url: string, timeoutMs: number) {
    super(
      {
        statusCode: HttpStatus.GATEWAY_TIMEOUT,
        message: `Upstream request timed out: ${method} ${url} (${timeoutMs}ms)`,
        error: 'Gateway Timeout',
      },
      HttpStatus.GATEWAY_TIMEOUT,
    );
  }
}
