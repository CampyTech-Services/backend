import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { Blog } from '@mod/blog/domain';
import { CreateBlogDto, UpdateBlogDto } from '../../application/dto';
import { BlogInboundPortService } from '@mod/blog/application/ports/inbound/blog-inbound-port.service';
import { PaginationResult } from '@/common/types';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogInboundPortService) {}

  @Post()
  create(@Body() createBlogDto: CreateBlogDto): Promise<Blog> {
    return this.blogService.create(createBlogDto);
  }

  @Get()
  findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ): Promise<PaginationResult<Blog>> {
    return this.blogService.findAll(Number(page), Number(limit));
  }

  @Get(':id')
  findById(@Param('id') id: string): Promise<Blog | null> {
    return this.blogService.findById(id);
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string): Promise<Blog | null> {
    return this.blogService.findBySlug(slug);
  }

  @Get('category/:categoryId')
  findByCategoryId(@Param('categoryId') categoryId: string): Promise<Blog[]> {
    return this.blogService.findByCategoryId(categoryId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto): Promise<Blog> {
    return this.blogService.update(id, updateBlogDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<boolean> {
    return this.blogService.delete(id);
  }
}
