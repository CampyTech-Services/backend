import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { CreateCategoryDto, UpdateCategoryDto } from '../../application/dto';
import { Category } from '../../domain/entities';
import { CategoryInboundPortService } from '@mod/category/application/ports/inbound/category-inbound-port.service';
import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe';
import { createCategorySchema } from '../http/zod-schema/request';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryInboundPortService) {}

  @Post()
  create(
    @Body(new ZodValidationPipe(createCategorySchema))
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    console.log(createCategoryDto);
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  findAll(): Promise<Category[]> {
    return this.categoryService.findAll();
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
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<boolean> {
    return this.categoryService.delete(id);
  }
}
