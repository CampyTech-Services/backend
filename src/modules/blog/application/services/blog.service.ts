import { Injectable } from '@nestjs/common';
import { Blog } from '../../domain';
import { CreateBlogDto, UpdateBlogDto } from '../dto';
import { BlogRepositoryOutputPortService } from '../ports/outbound';
import { BlogInboundPortService } from '../ports/inbound/blog-inbound-port.service';
import { LoggerService } from '@/common/logger';
import { PaginationResult } from '@/common/types';
@Injectable()
export class BlogService implements BlogInboundPortService {
  constructor(
    private readonly blogRepository: BlogRepositoryOutputPortService,
    private readonly logger: LoggerService,
  ) {}

  async create(createBlogDto: CreateBlogDto): Promise<Blog> {
    this.logger.log(`Creating blog: ${createBlogDto.slug}`);
    const blog = new Blog({
      title: createBlogDto.title,
      slug: createBlogDto.slug,
      featuredImage: createBlogDto.featuredImage,
      content: createBlogDto.content,
      excerpt: createBlogDto.excerpt,
      status: createBlogDto.status ?? 'DRAFT',
      categoryId: createBlogDto.categoryId,
      authorId: createBlogDto.authorId,
    });

    return this.blogRepository.create(blog);
  }

  async findById(id: string): Promise<Blog | null> {
    return this.blogRepository.findById(id);
  }

  async findAll(page = 1, limit = 10): Promise<PaginationResult<Blog>> {
    return this.blogRepository.findAll(page, limit);
  }

  async findBySlug(slug: string): Promise<Blog | null> {
    return this.blogRepository.findBySlug(slug);
  }

  async findByCategoryId(categoryId: string): Promise<Blog[]> {
    return this.blogRepository.findByCategoryId(categoryId);
  }

  async update(id: string, updateBlogDto: UpdateBlogDto): Promise<Blog> {
    return this.blogRepository.update(id, updateBlogDto);
  }

  async delete(id: string): Promise<boolean> {
    return this.blogRepository.delete(id);
  }
}
