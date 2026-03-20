import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Blog } from '@mod/blog/domain';
import { BlogRepositoryOutputPortService } from '@mod/blog/application/ports/outbound/blog-repository-outbound-port.service';
import { PaginationResult } from '@/common/types';
/**
 * Adapter repository for blog outbound port using Prisma.
 */
@Injectable()
export class BlogOutboundAdapterRepository implements BlogRepositoryOutputPortService {
  constructor(private readonly prisma: PrismaService) {}

  async create(blog: Blog): Promise<Blog> {
    return (await this.prisma.blog.create({
      data: {
        id: blog.id,
        title: blog.title,
        slug: blog.slug,
        featuredImage: blog.featuredImage,
        content: blog.content,
        excerpt: blog.excerpt,
        status: blog.status,
        categoryId: blog.categoryId,
        authorId: blog.authorId,
      },
    })) as Blog;
  }

  async findById(id: string): Promise<Blog | null> {
    return (await this.prisma.blog.findUnique({ where: { id } })) as Blog | null;
  }

  async findAll(page = 1, limit = 10): Promise<PaginationResult<Blog>> {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([this.prisma.blog.findMany({ skip, take: limit }), this.prisma.blog.count()]);
    return {
      items: items as Blog[],
      total,
      page,
      limit,
    };
  }

  async findBySlug(slug: string): Promise<Blog | null> {
    return (await this.prisma.blog.findFirst({ where: { slug } })) as Blog | null;
  }

  async findByCategoryId(categoryId: string): Promise<Blog[]> {
    return (await this.prisma.blog.findMany({ where: { categoryId } })) as Blog[];
  }

  async update(id: string, blog: Partial<Blog>): Promise<Blog> {
    return (await this.prisma.blog.update({ where: { id }, data: blog })) as Blog;
  }

  async delete(id: string): Promise<boolean> {
    await this.prisma.blog.delete({ where: { id } });
    return true;
  }
}
