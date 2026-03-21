import { Module } from '@nestjs/common';
import { AuthModule } from '@/modules/auth/auth.module';
import { AdminTagController, PublicTagController } from './presenters/controllers';
import { TagInboundPortService } from './application/ports/inbound';
import { TagService } from './application/services';
import { TagInfrastructureModule } from './infrastructure/tag-infrastructure.module';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
  imports: [AuthModule, TagInfrastructureModule],
  controllers: [AdminTagController, PublicTagController],
  providers: [{ provide: TagInboundPortService, useClass: TagService }, PrismaService],
  exports: [{ provide: TagInboundPortService, useClass: TagService }],
})
export class TagModule {}
