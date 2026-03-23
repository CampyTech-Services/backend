import { BadRequestException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Comment } from '../../domain/entities';
import { CreateCommentDto, UpdateCommentDto } from '../dto';
import { CommentRepositoryOutputPortService } from '../ports/outbound';
import { CommentInboundPortService } from '../ports/inbound/comment-inbound-port.service';
import { LoggerService } from '@/common/logger';
import { PaginationResult } from '@/common/types';

@Injectable()
export class CommentService implements CommentInboundPortService {
  private static readonly CONTEXT = 'CommentService';

  constructor(
    private readonly commentRepository: CommentRepositoryOutputPortService,
    private readonly logger: LoggerService,
  ) {}

  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    return this.withFallback('create comment', async () => {
      this.logger.log(`Creating comment for blog: ${createCommentDto.blogId}`);
      const comment = new Comment({
        content: createCommentDto.content,
        email: createCommentDto.email,
        name: createCommentDto.name,
        blogId: createCommentDto.blogId,
      });

      return this.commentRepository.create(comment);
    });
  }

  async findById(id: string): Promise<Comment | null> {
    return this.withFallback('fetch comment by id', () => this.commentRepository.findById(id));
  }

  async findAll(page = 1, limit = 10): Promise<PaginationResult<Comment>> {
    return this.withFallback('list comments', async () => {
      this.assertPagination(page, limit);
      return this.commentRepository.findAll(page, limit);
    });
  }

  async findByBlogId(blogId: string): Promise<Comment[]> {
    return this.withFallback('fetch comments by blog id', () => this.commentRepository.findByBlogId(blogId));
  }

  async update(id: string, updateCommentDto: UpdateCommentDto): Promise<Comment> {
    return this.withFallback('update comment', () => this.commentRepository.update(id, updateCommentDto));
  }

  async delete(id: string): Promise<boolean> {
    return this.withFallback('delete comment', () => this.commentRepository.delete(id));
  }

  private assertPagination(page: number, limit: number): void {
    if (!Number.isInteger(page) || !Number.isInteger(limit) || page < 1 || limit < 1) {
      throw new BadRequestException('Page and limit must be positive integers');
    }
  }

  private async withFallback<T>(operation: string, action: () => Promise<T>): Promise<T> {
    try {
      return await action();
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(`Failed to ${operation}`, error instanceof Error ? error : String(error), CommentService.CONTEXT);
      throw this.mapUnexpectedError(error, operation);
    }
  }

  private mapUnexpectedError(error: unknown, operation: string): HttpException {
    if (this.hasPrismaErrorCode(error, 'P2025')) {
      return new NotFoundException('Comment not found');
    }

    if (this.hasPrismaErrorCode(error, 'P2003')) {
      return new BadRequestException('Comment references an invalid related resource');
    }

    return new InternalServerErrorException(`Unable to ${operation}. Please try again later.`);
  }

  private hasPrismaErrorCode(error: unknown, code: string): error is { code: string } {
    return typeof error === 'object' && error !== null && 'code' in error && (error as { code?: unknown }).code === code;
  }
}
