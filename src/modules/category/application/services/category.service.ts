import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Category } from '../../domain/entities';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto';
import { CategoryRepositoryOutputPortService } from '@mod/category/application/ports/outbound';
import { PaginationResult } from '@/common/types';
import { CategoryInboundPortService } from '../ports/inbound/category-inbound-port.service';
import { LoggerService } from '@/common/logger';

@Injectable()
export class CategoryService implements CategoryInboundPortService {
  constructor(
    private readonly categoryRepository: CategoryRepositoryOutputPortService,
    private readonly logger: LoggerService,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const normalizedSlug = Category.normalizeSlug(createCategoryDto.slug);
    this.logger.log(`Creating category: ${normalizedSlug}`);

    if (await this.categoryRepository.findBySlug(normalizedSlug)) {
      throw new ConflictException(`Category with slug "${normalizedSlug}" already exists`);
    }

    const category = new Category({
      ...createCategoryDto,
      slug: normalizedSlug,
    });

    return this.categoryRepository.create(category);
  }

  async findById(id: string): Promise<Category | null> {
    return this.categoryRepository.findById(id);
  }

  async findAll(page = 1, limit = 10): Promise<PaginationResult<Category>> {
    if (!Number.isInteger(page) || !Number.isInteger(limit) || page < 1 || limit < 1) {
      throw new BadRequestException('Page and limit must be positive integers');
    }

    return this.categoryRepository.findAll(page, limit);
  }

  async findBySlug(slug: string): Promise<Category | null> {
    return this.categoryRepository.findBySlug(slug);
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const existingCategory = await this.categoryRepository.findById(id);
    if (!existingCategory) {
      throw new NotFoundException(`Category with id "${id}" not found`);
    }

    const nextSlug = updateCategoryDto.slug ? Category.normalizeSlug(updateCategoryDto.slug) : undefined;
    if (nextSlug && nextSlug !== existingCategory.slug) {
      const categoryWithSlug = await this.categoryRepository.findBySlug(nextSlug);
      if (categoryWithSlug && categoryWithSlug.id !== id) {
        throw new ConflictException(`Category with slug "${nextSlug}" already exists`);
      }
    }

    const category = new Category(existingCategory);
    category.update({ ...updateCategoryDto, slug: nextSlug });
    return this.categoryRepository.update(id, category);
  }

  async delete(id: string): Promise<boolean> {
    const existingCategory = await this.categoryRepository.findById(id);
    if (!existingCategory) {
      throw new NotFoundException(`Category with id "${id}" not found`);
    }

    return this.categoryRepository.delete(id);
  }
}
