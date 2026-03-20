import { Injectable } from '@nestjs/common';
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
    this.logger.log('Creating category...' + createCategoryDto.slug);
    try {
      if (await this.categoryRepository.findBySlug(createCategoryDto.slug)) {
        throw new Error('Category with this slug already exists');
      }
      const category = new Category({
        name: createCategoryDto.name,
        slug: createCategoryDto.slug,
        // description: createCategoryDto.description,
      });
      return this.categoryRepository.create(category);
    } catch (error) {
      this.logger.error('Failed creating category ', JSON.stringify(error));
      throw new Error(`Failed to create category: ${error}`);
    }
  }

  async findById(id: string): Promise<Category | null> {
    return this.categoryRepository.findById(id);
  }

  async findAll(page = 1, limit = 10): Promise<PaginationResult<Category>> {
    return this.categoryRepository.findAll(page, limit);
  }

  async findBySlug(slug: string): Promise<Category | null> {
    return this.categoryRepository.findBySlug(slug);
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    return this.categoryRepository.update(id, updateCategoryDto);
  }

  async delete(id: string, slug?: string): Promise<boolean> {
    if (await this.categoryRepository.findBySlug(slug)) {
      return this.categoryRepository.delete(id);
    }
    throw new Error('Category data not found');
  }
}
