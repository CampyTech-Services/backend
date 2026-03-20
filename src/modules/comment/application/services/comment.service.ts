import { Injectable } from '@nestjs/common';
import { Comment } from '../../domain/entities';
import { CreateCommentDto, UpdateCommentDto } from '../dto';
import { CommentRepositoryOutputPortService } from '../ports/outbound';
import { CommentInboundPortService } from '../ports/inbound/comment-inbound-port.service';
import { LoggerService } from '@/common/logger';
import { PaginationResult } from '@/common/types';

@Injectable()
export class CommentService implements CommentInboundPortService {
  constructor(
    private readonly commentRepository: CommentRepositoryOutputPortService,
    private readonly logger: LoggerService,
  ) {}

  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    this.logger.log(`Creating comment for blog: ${createCommentDto.blogId}`);
    const comment = new Comment({
      content: createCommentDto.content,
      email: createCommentDto.email,
      name: createCommentDto.name,
      blogId: createCommentDto.blogId,
    });

    return this.commentRepository.create(comment);
  }

  async findById(id: string): Promise<Comment | null> {
    return this.commentRepository.findById(id);
  }

  async findAll(page = 1, limit = 10): Promise<PaginationResult<Comment>> {
    return this.commentRepository.findAll(page, limit);
  }

  async findByBlogId(blogId: string): Promise<Comment[]> {
    return this.commentRepository.findByBlogId(blogId);
  }

  async update(id: string, updateCommentDto: UpdateCommentDto): Promise<Comment> {
    return this.commentRepository.update(id, updateCommentDto);
  }

  async delete(id: string): Promise<boolean> {
    return this.commentRepository.delete(id);
  }
}
