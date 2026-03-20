import { PrismaService } from '@/prisma/prisma.service';
import { Module } from '@nestjs/common';
import { CategoryOutboundAdapterRepository } from './persistence/orm/repositories/category-outbound-adapter.repository';
import { CategoryRepositoryOutputPortService } from '../application/ports/outbound';

@Module({
  providers: [
    PrismaService,
    {
      provide: CategoryRepositoryOutputPortService,
      useClass: CategoryOutboundAdapterRepository,
    },
  ],
  exports: [
    {
      provide: CategoryRepositoryOutputPortService,
      useClass: CategoryOutboundAdapterRepository,
    },
  ],
})
export class CategoryInfrasturctureModule {}
