import { Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { Category } from '../../domain/entities';
import { PaginationResult } from '@/common/types';
import { CategoryInboundPortService } from '@mod/category/application/ports/inbound/category-inbound-port.service';

@Controller('api/category')
export class PublicCategoryController {
  constructor(private readonly categoryService: CategoryInboundPortService) {}

  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<PaginationResult<Category>> {
    return this.categoryService.findAll(page, limit);
  }

  @Get(':id')
  findById(@Param('id') id: string): Promise<Category | null> {
    return this.categoryService.findById(id);
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string): Promise<Category | null> {
    return this.categoryService.findBySlug(slug);
  }
}
