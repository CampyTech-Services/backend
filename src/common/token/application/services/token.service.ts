import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AbstractTokenService, TokenSignResult } from '@/common/token/application/core/abstract-token.service';
import { TokenCacheOutboundPortService } from '@/common/token/application/ports/outbound';
import { TOKEN_MODULE_CONFIG } from '@/common/token/application/config/config';
import { RestClientPortService } from '@/common/rest/ports';

interface OAuthTokenResponse {
  access_token: string;
  expires_in: number;
  token_type?: string;
  scope?: string;
}

@Injectable()
export class TokenService implements AbstractTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly tokenCache: TokenCacheOutboundPortService,
    private readonly restClient: RestClientPortService,
  ) {}

  async getAccessToken(instance?: string): Promise<string> {
    const appName = this.configService.get<string>('applicationName');
    const isKonga = instance === TOKEN_MODULE_CONFIG.INSTANCE.KONGA;
    const prefix = isKonga ? TOKEN_MODULE_CONFIG.CACHE_KEY_PREFIX.KONGA : TOKEN_MODULE_CONFIG.CACHE_KEY_PREFIX.KPAY;
    const cacheKey = `${prefix}-${appName}`;

    const cached = await this.tokenCache.get(cacheKey);
    if (cached) return cached;

    const oauthUrl = isKonga ? this.configService.get<string>('oauthKongaUrl') : this.configService.get<string>('oauthUrl');
    const clientId = isKonga ? this.configService.get<string>('oauthKongaClientId') : this.configService.get<string>('oauthClientId');
    const clientSecret = isKonga ? this.configService.get<string>('oauthKongaClientSecret') : this.configService.get<string>('oauthClientSecret');

    const response = await this.restClient.post<OAuthTokenResponse>(
      `${oauthUrl}${TOKEN_MODULE_CONFIG.TOKEN_PATH}`,
      // new URLSearchParams({
      //   grant_type: TOKEN_MODULE_CONFIG.GRANT_TYPE,
      //   client_id: clientId,
      //   client_secret: clientSecret,
      // }).toString(),
      { headers: { 'Content-Type': TOKEN_MODULE_CONFIG.CONTENT_TYPE } },
    );

    const { access_token, expires_in } = response.data;
    await this.tokenCache.set(cacheKey, access_token, expires_in);

    return access_token;
  }

  async signToken(payload: Record<string, unknown>): Promise<TokenSignResult> {
    const expiresIn = Number(this.configService.get<string>('tokenTTL')) || TOKEN_MODULE_CONFIG.DEFAULT_JWT_EXPIRY_SECONDS;
    const token = await this.jwtService.signAsync(payload, { expiresIn });
    return { token, expiresIn };
  }

  async verifyToken(token: string): Promise<boolean> {
    try {
      const result = await this.jwtService.verifyAsync(token);
      return !!result;
    } catch {
      return false;
    }
  }
}
