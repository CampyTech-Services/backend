import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AdminController } from './presenters/controllers/admin.controller';
import { AdminService } from './application/services/admin.service';
import { AdminInboundPortService } from './application/ports/inbound/admin-inbound-port.service';
import { AdminInfrastructureModule } from './infrastructure/admin-infrastructure.module';

@Module({
  imports: [ConfigModule, AdminInfrastructureModule],
  controllers: [AdminController],
  providers: [{ provide: AdminInboundPortService, useClass: AdminService }],
  exports: [{ provide: AdminInboundPortService, useClass: AdminService }],
})
export class AdminModule {}
