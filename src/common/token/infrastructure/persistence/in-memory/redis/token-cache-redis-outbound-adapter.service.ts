import { Injectable, Inject } from '@nestjs/common';
import { Redis } from 'ioredis';
import { TokenCacheOutboundPortService } from '@/common/token/application/ports/outbound/token-cache-outbound-port.service';
import { TOKEN_REDIS_CLIENT } from '@/common/token/token.constants';

@Injectable()
export class TokenCacheRedisOutboundAdapterService implements TokenCacheOutboundPortService {
  constructor(@Inject(TOKEN_REDIS_CLIENT) private readonly redis: Redis) {}

  async get(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  async set(key: string, value: string, ttlSeconds: number): Promise<void> {
    await this.redis.set(key, value, 'EX', ttlSeconds);
  }
}
