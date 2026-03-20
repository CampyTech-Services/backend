import { Module } from '@nestjs/common';
import { BlogService } from './application/services/blog.service';
import { BlogInfrastructureModule } from './infrastructure/blog-infrastructure.module';
import { BlogController } from './presenters/controllers/blog.controller';
import { BlogInboundPortService } from './application/ports/inbound/blog-inbound-port.service';

@Module({
  controllers: [BlogController],
  imports: [BlogInfrastructureModule],
  providers: [{ provide: BlogInboundPortService, useClass: BlogService }],
  exports: [{ provide: BlogInboundPortService, useClass: BlogService }],
})
export class BlogModule {
  register() {
    return {
      module: BlogModule,
      imports: [BlogInfrastructureModule],
      exports: [BlogInfrastructureModule],
    };
  }
}
