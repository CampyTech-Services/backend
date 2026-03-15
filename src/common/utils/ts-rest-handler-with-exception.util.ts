import { HttpException, HttpStatus } from '@nestjs/common';
import {
  AppRoute,
  ServerInferRequest,
  ServerInferResponses,
} from '@ts-rest/core';
import { TsRestException } from '@ts-rest/nest';
import type { Request } from 'express-serve-static-core';

type TsRestRequestShape<TRoute extends AppRoute> = ServerInferRequest<
  TRoute,
  Request['headers']
>;

/**
 * Wraps a ts-rest handler with automatic exception handling.
 *
 * This utility eliminates the need for repetitive try-catch blocks in controllers
 * by automatically catching exceptions and converting them to TsRestException.
 *
 * @example
 * ```typescript
 * @TsRestHandler(c.initiateCharge)
 * async initiateCharge() {
 *   return tsRestHandler(
 *     c.initiateCharge,
 *     tsRestHandlerWithException(c.initiateCharge, async ({ body }) => {
 *       const result = await this.service.initiateCharge(body);
 *       return { status: HttpStatus.CREATED as 201, body: result };
 *     }),
 *   );
 * }
 * ```
 */
export function tsRestHandlerWithException<T extends AppRoute>(
  route: T,
  handler: (args: TsRestRequestShape<T>) => Promise<ServerInferResponses<T>>,
): (args: TsRestRequestShape<T>) => Promise<ServerInferResponses<T>> {
  return async (
    args: TsRestRequestShape<T>,
  ): Promise<ServerInferResponses<T>> => {
    try {
      return await handler(args);
    } catch (e) {
      if (e instanceof TsRestException) {
        throw e;
      }

      const status =
        e instanceof HttpException
          ? e.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;
      const message =
        e instanceof HttpException ? e.message : (e as Error).toString();

      throw new TsRestException(route, {
        status,
        body: { message },
      } as ServerInferResponses<T>);
    }
  };
}
