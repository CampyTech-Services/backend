import { Module } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { TagRepositoryOutboundPortService } from '@mod/tag/application/ports/outbound';
import { TagRepositoryAdapter } from './persistence/orm/repositories/tag.repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: TagRepositoryOutboundPortService,
      useClass: TagRepositoryAdapter,
    },
  ],
  exports: [
    {
      provide: TagRepositoryOutboundPortService,
      useClass: TagRepositoryAdapter,
    },
  ],
})
export class TagInfrastructureModule {}
