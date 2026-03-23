import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Req, Request, UseGuards } from '@nestjs/common';
import { Blog } from '@mod/blog/domain';
import { CreateBlogDto, UpdateBlogDto } from '../../application/dto';
import { BlogInboundPortService } from '@mod/blog/application/ports/inbound/blog-inbound-port.service';
import { PaginationResult } from '@/common/types';
import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe';
import { createBlogSchema, updateBlogSchema } from '../http/zod-schema/request';
import { AdminAuthGuard } from '@/modules/auth/guards';

@UseGuards(AdminAuthGuard)
@Controller('admin/blog')
export class AdminBlogController {
  constructor(private readonly blogService: BlogInboundPortService) {}

  @Post()
  create(@Body(new ZodValidationPipe(createBlogSchema)) createBlogDto: CreateBlogDto, @Req() req: any): Promise<Blog> {
    createBlogDto.authorId = req?.admin?.id;
    return this.blogService.create(createBlogDto);
  }

  @Get('all')
  findAll(@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number, @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number): Promise<PaginationResult<Blog>> {
    return this.blogService.findAll(page, limit);
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
  update(@Param('id') id: string, @Body(new ZodValidationPipe(updateBlogSchema)) updateBlogDto: UpdateBlogDto): Promise<Blog> {
    return this.blogService.update(id, updateBlogDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<boolean> {
    return this.blogService.delete(id);
  }
}
