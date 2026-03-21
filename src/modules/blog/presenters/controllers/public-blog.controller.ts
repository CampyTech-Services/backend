import { Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { Blog } from '@mod/blog/domain';
import { BlogInboundPortService } from '@mod/blog/application/ports/inbound/blog-inbound-port.service';
import { PaginationResult } from '@/common/types';

@Controller('api/blog')
export class PublicBlogController {
  constructor(private readonly blogService: BlogInboundPortService) {}

  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<PaginationResult<Blog>> {
    return this.blogService.findPublished(page, limit);
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string): Promise<Blog | null> {
    return this.blogService.findPublishedBySlug(slug);
  }

  @Get('category/:categoryId')
  findByCategoryId(@Param('categoryId') categoryId: string): Promise<Blog[]> {
    return this.blogService.findPublishedByCategoryId(categoryId);
  }
}
