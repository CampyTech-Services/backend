import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { AbstractTokenService } from '@/common/token/application/core/abstract-token.service';
import { TokenCacheOutboundPortService } from '@/common/token/application/ports/outbound/token-cache-outbound-port.service';
import { TokenService } from '@/common/token/application/services/token.service';
import { TokenCacheRedisOutboundAdapterService } from '@/common/token/infrastructure/persistence/in-memory/redis/token-cache-redis-outbound-adapter.service';
import { TOKEN_REDIS_CLIENT } from '@/common/token/token.constants';

@Global()
@Module({
  providers: [
    {
      provide: TOKEN_REDIS_CLIENT,
      inject: [ConfigService],
      useFactory: (configService: ConfigService): Redis => {
        return new Redis({
          host: configService.get<string>('redisHost'),
          port: configService.get<number>('redisPort'),
          password: configService.get<string>('redisPassword') || undefined,
          db: configService.get<number>('redisDb'),
          lazyConnect: true,
        });
      },
    },
    {
      provide: TokenCacheOutboundPortService,
      useClass: TokenCacheRedisOutboundAdapterService,
    },
    {
      provide: AbstractTokenService,
      useClass: TokenService,
    },
  ],
  exports: [AbstractTokenService],
})
export class TokenModule {}
