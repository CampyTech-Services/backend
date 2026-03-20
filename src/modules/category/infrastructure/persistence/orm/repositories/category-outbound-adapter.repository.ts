import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Category } from '@mod/category/domain/entities';
import { CategoryRepositoryOutputPortService } from '@mod/category/application/ports/outbound/category-repository-outbound-port.service';
import { PaginationResult } from '@/common/types';

@Injectable()
export class CategoryOutboundAdapterRepository implements CategoryRepositoryOutputPortService {
  constructor(private readonly categoryRepository: PrismaService) {}

  async create(category: Category): Promise<Category> {
    return this.categoryRepository.category.create({
      data: {
        id: category.id,
        name: category.name,
        slug: category.slug,
        // description: category.description,
      },
    }) as unknown as Promise<Category>;
  }

  async findById(id: string): Promise<Category | null> {
    return (await this.categoryRepository.category.findUnique({
      where: { id },
    })) as Category | null;
  }

  async findAll(page = 1, limit = 10): Promise<PaginationResult<Category>> {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([this.categoryRepository.category.findMany({ skip, take: limit }), this.categoryRepository.category.count()]);
    return {
      items: items as Category[],
      total,
      page,
      limit,
    };
  }

  async findBySlug(slug: string): Promise<Category | null> {
    return (await this.categoryRepository.category.findFirst({
      where: { slug },
    })) as Category | null;
  }

  async update(id: string, category: Partial<Category>): Promise<Category> {
    return (await this.categoryRepository.category.update({
      where: { id },
      data: category,
    })) as Category;
  }

  async delete(id: string): Promise<boolean> {
    await this.categoryRepository.category.delete({
      where: { id },
    });
    return true;
  }
}
