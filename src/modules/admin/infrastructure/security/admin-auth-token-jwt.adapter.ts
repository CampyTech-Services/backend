import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AdminAccessTokenResult, AdminAuthTokenOutboundPortService } from '@mod/admin/application/ports/outbound';

@Injectable()
export class AdminAuthTokenJwtAdapter implements AdminAuthTokenOutboundPortService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signAccessToken(payload: Record<string, unknown>): Promise<AdminAccessTokenResult> {
    const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN') || this.configService.get<string>('jwtExpiresIn') || '1h';
    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken, expiresIn };
  }
}
