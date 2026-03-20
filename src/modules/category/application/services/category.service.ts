import { Injectable } from '@nestjs/common';
import { Category } from '../../domain/entities';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto';
import { CategoryRepositoryOutputPortService } from '@mod/category/application/ports/outbound';
import { CategoryInboundPortService } from '../ports/inbound/category-inbound-port.service';

@Injectable()
export class CategoryService implements CategoryInboundPortService {
  constructor(private readonly categoryRepository: CategoryRepositoryOutputPortService) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
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
      throw new Error(`Failed to create category: ${error}`);
    }
  }

  async findById(id: string): Promise<Category | null> {
    return this.categoryRepository.findById(id);
  }

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.findAll();
  }

  async findBySlug(slug: string): Promise<Category | null> {
    return this.categoryRepository.findBySlug(slug);
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    return this.categoryRepository.update(id, updateCategoryDto);
  }

  async delete(id: string): Promise<boolean> {
    return this.categoryRepository.delete(id);
  }
}
