import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Comment } from '@mod/comment/domain/entities';
import { CommentRepositoryOutputPortService } from '@mod/comment/application/ports/outbound/comment-repository-outbound-port.service';
import { PaginationResult } from '@/common/types';

/**
 * Adapter repository for comment outbound port using Prisma.
 */
@Injectable()
export class CommentOutboundAdapterRepository implements CommentRepositoryOutputPortService {
  constructor(private readonly prisma: PrismaService) {}

  async create(comment: Comment): Promise<Comment> {
    return (await this.prisma.comment.create({
      data: {
        id: comment.id,
        content: comment.content,
        email: comment.email,
        name: comment.name,
        blogId: comment.blogId,
      },
    })) as Comment;
  }

  async findById(id: string): Promise<Comment | null> {
    return (await this.prisma.comment.findUnique({ where: { id } })) as Comment | null;
  }

  async findAll(page = 1, limit = 10): Promise<PaginationResult<Comment>> {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([this.prisma.comment.findMany({ skip, take: limit }), this.prisma.comment.count()]);
    return {
      items: items as Comment[],
      total,
      page,
      limit,
    };
  }

  async findByBlogId(blogId: string): Promise<Comment[]> {
    return (await this.prisma.comment.findMany({ where: { blogId } })) as Comment[];
  }

  async update(id: string, comment: Partial<Comment>): Promise<Comment> {
    return (await this.prisma.comment.update({ where: { id }, data: comment })) as Comment;
  }

  async delete(id: string): Promise<boolean> {
    await this.prisma.comment.delete({ where: { id } });
    return true;
  }
}
