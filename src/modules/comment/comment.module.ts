import { Module } from '@nestjs/common';
import { CommentService } from './application/services/comment.service';
import { CommentInfrastructureModule } from './infrastructure/comment-infrastructure.module';
import { CommentController } from './presenters/controllers/comment.controller';
import { CommentInboundPortService } from './application/ports/inbound/comment-inbound-port.service';

@Module({
  controllers: [CommentController],
  imports: [CommentInfrastructureModule],
  providers: [{ provide: CommentInboundPortService, useClass: CommentService }],
  exports: [{ provide: CommentInboundPortService, useClass: CommentService }],
})
export class CommentModule {
  static register() {
    return {
      module: CommentModule,
      imports: [CommentInfrastructureModule],
      exports: [CommentInfrastructureModule],
    };
  }
}
