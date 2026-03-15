import { Module, Global, DynamicModule } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RestClientPortService } from '@/common/rest/ports';
import { RestClientService, REST_CLIENT_CONFIG } from '@/common/rest/services';
import { RestModuleOptions, RestModuleAsyncOptions } from '@/common/rest/types';

/**
 * REST Module
 *
 * Provides a shared REST client for communicating with third-party services
 * over HTTP. Registers globally by default so any module can inject
 * `RestClientPortService` without importing this module.
 *
 * ## Usage
 *
 * ### Basic Registration
 *
 * ```typescript
 * // app.module.ts
 * import { RestModule } from '@/common/rest';
 *
 * @Module({
 *   imports: [RestModule.register()],
 * })
 * export class AppModule {}
 * ```
 *
 * ### With Custom Configuration
 *
 * ```typescript
 * @Module({
 *   imports: [
 *     RestModule.register({
 *       config: {
 *         timeout: 15000,
 *         headers: { 'X-Service': 'payment-service' },
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
 * @Module({
 *   imports: [
 *     RestModule.registerAsync({
 *       inject: [ConfigService],
 *       useFactory: (configService: ConfigService) => ({
 *         timeout: configService.get<number>('HTTP_TIMEOUT', 30000),
 *         headers: { 'X-Service': configService.get('APP_NAME') },
 *       }),
 *     }),
 *   ],
 * })
 * export class AppModule {}
 * ```
 *
 * ### Injecting in Services
 *
 * ```typescript
 * @Injectable()
 * export class PaymentProviderService {
 *   constructor(private readonly restClient: RestClientPortService) {}
 *
 *   async charge(amount: number) {
 *     const res = await this.restClient.post<ChargeResponse>(
 *       'https://api.provider.com/charges',
 *       { amount },
 *     );
 *     return res.data;
 *   }
 * }
 * ```
 */
@Global()
@Module({})
export class RestModule {
  /**
   * Register the REST module with optional configuration
   */
  static register(options: RestModuleOptions = {}): DynamicModule {
    const { config, isGlobal = true } = options;

    return {
      module: RestModule,
      global: isGlobal,
      imports: [
        HttpModule.register({
          timeout: config?.timeout,
          baseURL: config?.baseURL,
          headers: config?.headers,
        }),
      ],
      providers: [
        {
          provide: REST_CLIENT_CONFIG,
          useValue: config || {},
        },
        {
          provide: RestClientPortService,
          useClass: RestClientService,
        },
      ],
      exports: [RestClientPortService],
    };
  }

  /**
   * Register the REST module asynchronously
   */
  static registerAsync(options: RestModuleAsyncOptions): DynamicModule {
    const { isGlobal = true, inject = [], useFactory } = options;

    return {
      module: RestModule,
      global: isGlobal,
      imports: [
        HttpModule.registerAsync({
          inject,
          useFactory: async (...args: any[]) => {
            const config = await useFactory(...args);
            return {
              timeout: config.timeout,
              baseURL: config.baseURL,
              headers: config.headers,
            };
          },
        }),
      ],
      providers: [
        {
          provide: REST_CLIENT_CONFIG,
          inject,
          useFactory,
        },
        {
          provide: RestClientPortService,
          useClass: RestClientService,
        },
      ],
      exports: [RestClientPortService],
    };
  }
}
