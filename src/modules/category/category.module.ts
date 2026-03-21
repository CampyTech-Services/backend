import { Module } from '@nestjs/common';
import { AuthModule } from '@/modules/auth/auth.module';
import { CategoryService } from './application/services';
import { CategoryInfrasturctureModule } from './infrastructure/catgegory-infrastructure.module';
import { AdminCategoryController, PublicCategoryController } from './presenters/controller';
import { CategoryInboundPortService } from './application/ports/inbound/category-inbound-port.service';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
  controllers: [AdminCategoryController, PublicCategoryController],
  imports: [AuthModule, CategoryInfrasturctureModule],
  providers: [{ provide: CategoryInboundPortService, useClass: CategoryService }, PrismaService],
  exports: [{ provide: CategoryInboundPortService, useClass: CategoryService }],
})
export class CategoryModule {}
