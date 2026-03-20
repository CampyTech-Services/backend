import { Module } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { BlogOutboundAdapterRepository } from './persistence/orm/repositories/blog.respository';
import { BlogRepositoryOutputPortService } from '@mod/blog/application/ports/outbound';

@Module({
  providers: [
    PrismaService,
    {
      provide: BlogRepositoryOutputPortService,
      useClass: BlogOutboundAdapterRepository,
    },
  ],
  exports: [
    {
      provide: BlogRepositoryOutputPortService,
      useClass: BlogOutboundAdapterRepository,
    },
  ],
})
export class BlogInfrastructureModule {}
