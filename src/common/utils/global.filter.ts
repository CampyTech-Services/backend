import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import * as Sentry from '@sentry/nestjs';
import { LoggerService } from '@/common/logger';

@Catch()
export class CatchAllExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    // Determine status code
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    // Prepare error response
    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: this.getErrorMessage(exception),
      ...(process.env.NODE_ENV !== 'production' && { error: exception }),
    };

    this.logger.error(`Exception caught: ${errorResponse.message}`, exception instanceof Error ? exception.stack : '');

    // Capture exception in Sentry with context
    Sentry.captureException(exception, (scope) => {
      // Add request context
      scope.setContext('http', {
        method: request.method,
        url: request.url,
        statusCode: status,
        userAgent: request.get('user-agent'),
        ip: request.ip || request.connection.remoteAddress,
      });

      // Add tags for filtering in Sentry
      scope.setTag('errorType', exception.constructor.name);
      scope.setTag('statusCode', status.toString());
      scope.setTag('path', request.url);

      // Set severity level
      if (status >= 500) {
        scope.setLevel('error');
      } else if (status >= 400) {
        scope.setLevel('warning');
      }

      // Add user context if available
      if (request.user?.id) {
        scope.setUser({
          id: request.user.id,
          email: request.user.email,
        });
      }

      // Add breadcrumb
      scope.addBreadcrumb({
        category: 'exception',
        message: `${request.method} ${request.url}`,
        level: 'error',
        data: {
          statusCode: status,
          errorMessage: this.getErrorMessage(exception),
        },
      });

      return scope;
    });

    response.status(status).json(errorResponse);
  }

  private getErrorMessage(exception: unknown): string {
    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      if (typeof exceptionResponse === 'object' && 'message' in exceptionResponse) {
        return (exceptionResponse as any).message;
      }
      return exception.message;
    }
    return exception instanceof Error ? exception.message : 'Internal Server Error';
  }
}
