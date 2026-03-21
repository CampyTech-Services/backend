import { Module } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { BlogOutboundAdapterRepository } from './persistence/orm/repositories/blog.repository';
import { BlogRelationsOutboundPortService, BlogRepositoryOutputPortService } from '@mod/blog/application/ports/outbound';
import { BlogRelationsPrismaAdapter } from './persistence/orm/repositories/blog-relations.repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: BlogRepositoryOutputPortService,
      useClass: BlogOutboundAdapterRepository,
    },
    {
      provide: BlogRelationsOutboundPortService,
      useClass: BlogRelationsPrismaAdapter,
    },
  ],
  exports: [
    {
      provide: BlogRepositoryOutputPortService,
      useClass: BlogOutboundAdapterRepository,
    },
    {
      provide: BlogRelationsOutboundPortService,
      useClass: BlogRelationsPrismaAdapter,
    },
  ],
})
export class BlogInfrastructureModule {}
