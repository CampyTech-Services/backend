import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '@/prisma/prisma.service';
import { AdminAuthGuard } from './guards';
import { AdminModule } from '@/modules/admin/admin.module';
import { AuthController } from './presenters/controllers';

@Module({
  imports: [
    AdminModule,
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
  controllers: [AuthController],
  providers: [PrismaService, AdminAuthGuard],
  exports: [AdminAuthGuard, JwtModule],
})
export class AuthModule {}
