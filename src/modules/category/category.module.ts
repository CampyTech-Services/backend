import { Module } from '@nestjs/common';
import { CategoryService } from './application/services';
import { CategoryInfrasturctureModule } from './infrastructure/catgegory-infrastructure.module';
import { CategoryController } from './presenters/controller/category.controller';
import { CategoryInboundPortService } from './application/ports/inbound/category-inbound-port.service';

@Module({
  controllers: [CategoryController],
  imports: [CategoryInfrasturctureModule],
  providers: [{ provide: CategoryInboundPortService, useClass: CategoryService }],
  exports: [{ provide: CategoryInboundPortService, useClass: CategoryService }],
})
export class CategoryModule {
  register() {
    return {
      module: CategoryModule,
      imports: [CategoryInfrasturctureModule],
      exports: [CategoryInfrasturctureModule],
    };
  }
}
