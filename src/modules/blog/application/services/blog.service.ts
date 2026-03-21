import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Blog } from '../../domain';
import { CreateBlogDto, UpdateBlogDto } from '../dto';
import { BlogRepositoryOutputPortService } from '../ports/outbound';
import { BlogInboundPortService } from '../ports/inbound/blog-inbound-port.service';
import { LoggerService } from '@/common/logger';
import { PaginationResult } from '@/common/types';
import { BlogRelationsOutboundPortService } from '../ports/outbound/blog-relations-outbound-port.service';

@Injectable()
export class BlogService implements BlogInboundPortService {
  constructor(
    private readonly blogRepository: BlogRepositoryOutputPortService,
    private readonly blogRelations: BlogRelationsOutboundPortService,
    private readonly logger: LoggerService,
  ) {}

  async create(createBlogDto: CreateBlogDto): Promise<Blog> {
    const normalizedSlug = Blog.normalizeSlug(createBlogDto.slug);
    this.logger.log(`Creating blog: ${normalizedSlug}`);

    if (await this.blogRepository.findBySlug(normalizedSlug)) {
      throw new ConflictException(`Blog with slug "${normalizedSlug}" already exists`);
    }

    await this.assertRelations(createBlogDto.categoryId, createBlogDto.authorId, createBlogDto.tagIds);

    const blog = new Blog({ ...createBlogDto, slug: normalizedSlug, status: createBlogDto.status ?? 'DRAFT' });
    return this.blogRepository.create(blog);
  }

  async findById(id: string): Promise<Blog | null> {
    return this.blogRepository.findById(id);
  }

  async findAll(page = 1, limit = 10): Promise<PaginationResult<Blog>> {
    if (!Number.isInteger(page) || !Number.isInteger(limit) || page < 1 || limit < 1) {
      throw new BadRequestException('Page and limit must be positive integers');
    }

    return this.blogRepository.findAll(page, limit);
  }

  async findPublished(page = 1, limit = 10): Promise<PaginationResult<Blog>> {
    if (!Number.isInteger(page) || !Number.isInteger(limit) || page < 1 || limit < 1) {
      throw new BadRequestException('Page and limit must be positive integers');
    }

    return this.blogRepository.findPublished(page, limit);
  }

  async findBySlug(slug: string): Promise<Blog | null> {
    return this.blogRepository.findBySlug(slug);
  }

  async findPublishedBySlug(slug: string): Promise<Blog | null> {
    return this.blogRepository.findPublishedBySlug(Blog.normalizeSlug(slug));
  }

  async findByCategoryId(categoryId: string): Promise<Blog[]> {
    return this.blogRepository.findByCategoryId(categoryId);
  }

  async findPublishedByCategoryId(categoryId: string): Promise<Blog[]> {
    return this.blogRepository.findPublishedByCategoryId(categoryId);
  }

  async update(id: string, updateBlogDto: UpdateBlogDto): Promise<Blog> {
    const existingBlog = await this.blogRepository.findById(id);
    if (!existingBlog) {
      throw new NotFoundException(`Blog with id "${id}" not found`);
    }

    const nextSlug = updateBlogDto.slug ? Blog.normalizeSlug(updateBlogDto.slug) : undefined;
    if (nextSlug && nextSlug !== existingBlog.slug) {
      const blogWithSlug = await this.blogRepository.findBySlug(nextSlug);
      if (blogWithSlug && blogWithSlug.id !== id) {
        throw new ConflictException(`Blog with slug "${nextSlug}" already exists`);
      }
    }

    await this.assertRelations(updateBlogDto.categoryId ?? existingBlog.categoryId, updateBlogDto.authorId ?? existingBlog.authorId, updateBlogDto.tagIds ?? existingBlog.tagIds);

    const blog = new Blog(existingBlog);
    blog.update({ ...updateBlogDto, slug: nextSlug });
    return this.blogRepository.update(id, blog);
  }

  async delete(id: string): Promise<boolean> {
    const existingBlog = await this.blogRepository.findById(id);
    if (!existingBlog) {
      throw new NotFoundException(`Blog with id "${id}" not found`);
    }

    return this.blogRepository.delete(id);
  }

  private async assertRelations(categoryId: string, authorId: string, tagIds?: string[]): Promise<void> {
    const [categoryExists, authorExists] = await Promise.all([this.blogRelations.categoryExists(categoryId), this.blogRelations.authorExists(authorId)]);

    if (!categoryExists) {
      throw new BadRequestException(`Category with id "${categoryId}" does not exist`);
    }

    if (!authorExists) {
      throw new BadRequestException(`Author with id "${authorId}" does not exist`);
    }

    if (tagIds?.length) {
      const uniqueTagIds = [...new Set(tagIds)];
      const existingTags = await this.blogRelations.countExistingTags(uniqueTagIds);
      if (existingTags !== uniqueTagIds.length) {
        throw new BadRequestException('One or more tagIds do not exist');
      }
    }
  }
}
