import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { CreateCategoryDto, UpdateCategoryDto } from '../../application/dto';
import { Category } from '../../domain/entities';
import { PaginationResult } from '@/common/types';
import { CategoryInboundPortService } from '@mod/category/application/ports/inbound/category-inbound-port.service';
import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe';
import { createCategorySchema, updateCategorySchema } from '../http/zod-schema/request';
import { AdminAuthGuard } from '@/modules/auth/guards';

@UseGuards(AdminAuthGuard)
@Controller('admin/category')
export class AdminCategoryController {
  constructor(private readonly categoryService: CategoryInboundPortService) {}

  @Post()
  create(@Body(new ZodValidationPipe(createCategorySchema)) createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoryService.create(createCategoryDto);
  }

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

  @Put(':id')
  update(@Param('id') id: string, @Body(new ZodValidationPipe(updateCategorySchema)) updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<boolean> {
    return this.categoryService.delete(id);
  }
}
