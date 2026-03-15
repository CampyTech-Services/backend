import { Module, Global, DynamicModule } from '@nestjs/common';
import { LoggerService, LOGGER_CONFIG } from '@/common/logger/services';
import {
  LoggerModuleOptions,
  LoggerModuleAsyncOptions,
} from '@/common/logger/types';

/**
 * Logger Module
 *
 * Provides a centralized logging service across the application.
 * This module can be registered globally to make the LoggerService
 * available throughout the application without importing in each module.
 *
 * ## Usage
 *
 * ### Basic Registration (Global by default)
 *
 * ```typescript
 * // app.module.ts
 * import { LoggerModule } from '@/common/logger';
 *
 * @Module({
 *   imports: [
 *     LoggerModule.register(),
 *   ],
 * })
 * export class AppModule {}
 * ```
 *
 * ### With Custom Configuration
 *
 * ```typescript
 * import { LoggerModule, LogLevel } from '@/common/logger';
 *
 * @Module({
 *   imports: [
 *     LoggerModule.register({
 *       config: {
 *         level: LogLevel.DEBUG,
 *         json: false,
 *         appName: 'my-service',
 *       },
 *     }),
 *   ],
 * })
 * export class AppModule {}
 * ```
 *
 * ### Async Registration (with ConfigService)
 *
 * ```typescript
 * import { LoggerModule } from '@/common/logger';
 * import { ConfigService } from '@nestjs/config';
 *
 * @Module({
 *   imports: [
 *     LoggerModule.registerAsync({
 *       inject: [ConfigService],
 *       useFactory: (configService: ConfigService) => ({
 *         level: configService.get('LOG_LEVEL', 'info'),
 *         json: configService.get('LOG_JSON', false),
 *         appName: configService.get('APP_NAME', 'payment-service'),
 *       }),
 *     }),
 *   ],
 * })
 * export class AppModule {}
 * ```
 *
 * ### Using in Services
 *
 * ```typescript
 * import { Injectable } from '@nestjs/common';
 * import { LoggerService } from '@/common/logger';
 *
 * @Injectable()
 * export class PaymentService {
 *   constructor(private readonly logger: LoggerService) {
 *     this.logger.setContext('PaymentService');
 *   }
 *
 *   async processPayment(data: PaymentDto) {
 *     this.logger.info('Processing payment', undefined, { amount: data.amount });
 *
 *     try {
 *       // ... process payment
 *       this.logger.info('Payment processed successfully');
 *     } catch (error) {
 *       this.logger.error('Payment processing failed', error);
 *       throw error;
 *     }
 *   }
 * }
 * ```
 */
@Global()
@Module({})
export class LoggerModule {
  /**
   * Register the logger module with optional configuration
   */
  static register(options: LoggerModuleOptions = {}): DynamicModule {
    const { config, isGlobal = true } = options;

    return {
      module: LoggerModule,
      global: isGlobal,
      providers: [
        {
          provide: LOGGER_CONFIG,
          useValue: config || {},
        },
        LoggerService,
      ],
      exports: [LoggerService],
    };
  }

  /**
   * Register the logger module asynchronously
   */
  static registerAsync(options: LoggerModuleAsyncOptions): DynamicModule {
    const { isGlobal = true, inject = [], useFactory } = options;

    return {
      module: LoggerModule,
      global: isGlobal,
      providers: [
        {
          provide: LOGGER_CONFIG,
          inject,
          useFactory,
        },
        LoggerService,
      ],
      exports: [LoggerService],
    };
  }
}
