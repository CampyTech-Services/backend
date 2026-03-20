import { Module } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CommentOutboundAdapterRepository } from './persistence/orm/repositories/comment-outbound-adapter.repository';
import { CommentRepositoryOutputPortService } from '@mod/comment/application/ports/outbound';

@Module({
  providers: [
    PrismaService,
    {
      provide: CommentRepositoryOutputPortService,
      useClass: CommentOutboundAdapterRepository,
    },
  ],
  exports: [
    {
      provide: CommentRepositoryOutputPortService,
      useClass: CommentOutboundAdapterRepository,
    },
  ],
})
export class CommentInfrastructureModule {}
