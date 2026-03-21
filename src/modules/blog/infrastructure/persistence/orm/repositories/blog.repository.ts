import { Prisma } from '@/prisma/generated/prisma/client.js';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Blog, BlogContent } from '@mod/blog/domain';
import { BlogRepositoryOutputPortService } from '@mod/blog/application/ports/outbound/blog-repository-outbound-port.service';
import { PaginationResult } from '@/common/types';

/**
 * Adapter repository for blog outbound port using Prisma.
 */
@Injectable()
export class BlogOutboundAdapterRepository implements BlogRepositoryOutputPortService {
  constructor(private readonly prisma: PrismaService) {}

  async create(blog: Blog): Promise<Blog> {
    const createdBlog = await this.prisma.blog.create({
      data: {
        id: blog.id,
        title: blog.title,
        slug: blog.slug,
        featuredImage: blog.featuredImage,
        content: blog.content as Prisma.InputJsonValue,
        excerpt: blog.excerpt,
        status: blog.status,
        categoryId: blog.categoryId,
        authorId: blog.authorId,
        tags: blog.tagIds.length ? { connect: blog.tagIds.map((tagId) => ({ id: tagId })) } : undefined,
      },
      include: { tags: true },
    });

    return this.toDomain(createdBlog);
  }

  async findById(id: string): Promise<Blog | null> {
    const blog = await this.prisma.blog.findUnique({ where: { id }, include: { tags: true } });
    return blog ? this.toDomain(blog) : null;
  }

  async findAll(page = 1, limit = 10): Promise<PaginationResult<Blog>> {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([this.prisma.blog.findMany({ skip, take: limit, include: { tags: true } }), this.prisma.blog.count()]);
    return {
      items: items.map((item) => this.toDomain(item)),
      total,
      page,
      limit,
    };
  }

  async findPublished(page = 1, limit = 10): Promise<PaginationResult<Blog>> {
    const skip = (page - 1) * limit;
    const where = { status: 'PUBLISHED' as const };
    const [items, total] = await Promise.all([
      this.prisma.blog.findMany({ where, skip, take: limit, include: { tags: true } }),
      this.prisma.blog.count({ where }),
    ]);

    return {
      items: items.map((item) => this.toDomain(item)),
      total,
      page,
      limit,
    };
  }

  async findBySlug(slug: string): Promise<Blog | null> {
    const blog = await this.prisma.blog.findFirst({ where: { slug }, include: { tags: true } });
    return blog ? this.toDomain(blog) : null;
  }

  async findPublishedBySlug(slug: string): Promise<Blog | null> {
    const blog = await this.prisma.blog.findFirst({ where: { slug, status: 'PUBLISHED' }, include: { tags: true } });
    return blog ? this.toDomain(blog) : null;
  }

  async findByCategoryId(categoryId: string): Promise<Blog[]> {
    const blogs = await this.prisma.blog.findMany({ where: { categoryId }, include: { tags: true } });
    return blogs.map((blog) => this.toDomain(blog));
  }

  async findPublishedByCategoryId(categoryId: string): Promise<Blog[]> {
    const blogs = await this.prisma.blog.findMany({
      where: { categoryId, status: 'PUBLISHED' },
      include: { tags: true },
    });
    return blogs.map((blog) => this.toDomain(blog));
  }

  async update(id: string, blog: Partial<Blog>): Promise<Blog> {
    const updatedBlog = await this.prisma.blog.update({
      where: { id },
      data: {
        title: blog.title,
        slug: blog.slug,
        featuredImage: blog.featuredImage,
        content: blog.content as Prisma.InputJsonValue,
        excerpt: blog.excerpt,
        status: blog.status,
        categoryId: blog.categoryId,
        authorId: blog.authorId,
        tags: blog.tagIds ? { set: blog.tagIds.map((tagId) => ({ id: tagId })) } : undefined,
      },
      include: { tags: true },
    });

    return this.toDomain(updatedBlog);
  }

  async delete(id: string): Promise<boolean> {
    await this.prisma.blog.delete({ where: { id } });
    return true;
  }

  private toDomain(blog: {
    id: string;
    title: string;
    slug: string;
    featuredImage: string;
    content: BlogContent;
    excerpt: string | null;
    status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
    categoryId: string;
    authorId: string;
    tags?: Array<{ id: string }>;
    createdAt: Date;
    updatedAt: Date;
  }): Blog {
    return new Blog({
      id: blog.id,
      title: blog.title,
      slug: blog.slug,
      featuredImage: blog.featuredImage,
      content: blog.content,
      excerpt: blog.excerpt ?? undefined,
      status: blog.status,
      categoryId: blog.categoryId,
      authorId: blog.authorId,
      tagIds: blog.tags?.map((tag) => tag.id) ?? [],
      createdAt: blog.createdAt,
      updatedAt: blog.updatedAt,
    });
  }
}
