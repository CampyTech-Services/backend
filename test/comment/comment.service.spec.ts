import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { LoggerService } from '@/common/logger';
import { PaginationResult } from '@/common/types';
import { CreateCommentDto, UpdateCommentDto } from '@mod/comment/application/dto';
import { CommentRepositoryOutputPortService } from '@mod/comment/application/ports/outbound/comment-repository-outbound-port.service';
import { CommentService } from '@mod/comment/application/services/comment.service';
import { Comment } from '@mod/comment/domain/entities';

describe('CommentService', () => {
  let service: CommentService;
  let mockRepository: jest.Mocked<CommentRepositoryOutputPortService>;
  let mockLogger: jest.Mocked<LoggerService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        {
          provide: CommentRepositoryOutputPortService,
          useValue: {
            create: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn(),
            findByBlogId: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: LoggerService,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CommentService>(CommentService);
    mockRepository = module.get(CommentRepositoryOutputPortService);
    mockLogger = module.get(LoggerService);
  });

  const prismaError = (code: string, message: string) => ({ code, message });

  describe('create', () => {
    it('creates a comment successfully', async () => {
      const createCommentDto: CreateCommentDto = {
        content: 'Nice post',
        email: 'reader@example.com',
        name: 'Reader',
        blogId: 'blog-1',
      };
      const comment = new Comment(createCommentDto);
      mockRepository.create.mockResolvedValue(comment);

      const result = await service.create(createCommentDto);

      expect(mockLogger.log).toHaveBeenCalledWith('Creating comment for blog: blog-1');
      expect(mockRepository.create).toHaveBeenCalledWith(expect.any(Comment));
      expect(result).toEqual(comment);
    });

    it('returns a bad request when the blog relation is invalid', async () => {
      const createCommentDto: CreateCommentDto = {
        content: 'Nice post',
        email: 'reader@example.com',
        name: 'Reader',
        blogId: 'missing-blog',
      };
      mockRepository.create.mockRejectedValue(prismaError('P2003', 'Foreign key constraint failed'));

      await expect(service.create(createCommentDto)).rejects.toBeInstanceOf(BadRequestException);
      expect(mockLogger.error).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('returns paginated comments', async () => {
      const comments = [new Comment({ content: 'Nice', name: 'Reader', blogId: 'blog-1' })];
      const paginationResult: PaginationResult<Comment> = { items: comments, total: 1, page: 1, limit: 10 };
      mockRepository.findAll.mockResolvedValue(paginationResult);

      const result = await service.findAll(1, 10);

      expect(mockRepository.findAll).toHaveBeenCalledWith(1, 10);
      expect(result).toEqual(paginationResult);
    });

    it('rejects invalid pagination values', async () => {
      await expect(service.findAll(0, 10)).rejects.toBeInstanceOf(BadRequestException);
      expect(mockRepository.findAll).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('updates a comment successfully', async () => {
      const updateCommentDto: UpdateCommentDto = { content: 'Updated content' };
      const comment = new Comment({ content: 'Updated content', name: 'Reader', blogId: 'blog-1' });
      mockRepository.update.mockResolvedValue(comment);

      const result = await service.update('comment-1', updateCommentDto);

      expect(mockRepository.update).toHaveBeenCalledWith('comment-1', updateCommentDto);
      expect(result).toEqual(comment);
    });

    it('returns not found when prisma reports a missing comment', async () => {
      mockRepository.update.mockRejectedValue(prismaError('P2025', 'Record to update not found'));

      await expect(service.update('missing-comment', { content: 'Updated' })).rejects.toBeInstanceOf(NotFoundException);
      expect(mockLogger.error).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('deletes a comment successfully', async () => {
      mockRepository.delete.mockResolvedValue(true);

      const result = await service.delete('comment-1');

      expect(mockRepository.delete).toHaveBeenCalledWith('comment-1');
      expect(result).toBe(true);
    });

    it('hides unexpected internal errors behind a generic response', async () => {
      mockRepository.delete.mockRejectedValue(new Error('database socket exploded'));

      const deletion = service.delete('comment-1');

      await expect(deletion).rejects.toThrow(InternalServerErrorException);
      await expect(deletion).rejects.toMatchObject({
        response: {
          message: 'Unable to delete comment. Please try again later.',
        },
      });
      expect(mockLogger.error).toHaveBeenCalled();
    });
  });
});
