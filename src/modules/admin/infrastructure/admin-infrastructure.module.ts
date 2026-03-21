import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '@/prisma/prisma.service';
import { AdminAuthTokenOutboundPortService, AdminRepositoryOutboundPortService, PasswordHashOutboundPortService } from '@mod/admin/application/ports/outbound';
import { AdminRepositoryAdapter } from './persistence/orm/repositories/admin.repository';
import { PasswordHashBcryptAdapter } from './security/password-hash-bcrypt.adapter';
import { AdminAuthTokenJwtAdapter } from './security/admin-auth-token-jwt.adapter';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || configService.get<string>('jwtSecret') || 'change-me',
        signOptions: {
          expiresIn: (configService.get<string>('JWT_EXPIRES_IN') || configService.get<string>('jwtExpiresIn') || '1h') as any,
        },
      }),
    }),
  ],
  providers: [
    PrismaService,
    {
      provide: AdminRepositoryOutboundPortService,
      useClass: AdminRepositoryAdapter,
    },
    {
      provide: PasswordHashOutboundPortService,
      useClass: PasswordHashBcryptAdapter,
    },
    {
      provide: AdminAuthTokenOutboundPortService,
      useClass: AdminAuthTokenJwtAdapter,
    },
  ],
  exports: [AdminRepositoryOutboundPortService, PasswordHashOutboundPortService, AdminAuthTokenOutboundPortService],
})
export class AdminInfrastructureModule {}
