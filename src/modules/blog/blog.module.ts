import { Module } from '@nestjs/common';
import { AuthModule } from '@/modules/auth/auth.module';
import { BlogService } from './application/services/blog.service';
import { BlogInfrastructureModule } from './infrastructure/blog-infrastructure.module';
import { AdminBlogController, PublicBlogController } from './presenters/controllers';
import { BlogInboundPortService } from './application/ports/inbound/blog-inbound-port.service';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
  controllers: [AdminBlogController, PublicBlogController],
  imports: [AuthModule, BlogInfrastructureModule],
  providers: [{ provide: BlogInboundPortService, useClass: BlogService }, PrismaService],
  exports: [{ provide: BlogInboundPortService, useClass: BlogService }],
})
export class BlogModule {}
