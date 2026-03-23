import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Category } from '@mod/category/domain/entities';
import { CategoryRepositoryOutputPortService } from '@mod/category/application/ports/outbound/category-repository-outbound-port.service';
import { PaginationResult } from '@/common/types';

@Injectable()
export class CategoryOutboundAdapterRepository implements CategoryRepositoryOutputPortService {
  constructor(private readonly categoryRepository: PrismaService) {}

  async create(category: Category): Promise<Category> {
    const createdCategory = await this.categoryRepository.category.create({
      data: {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
      },
    });

    return this.toDomain(createdCategory);
  }

  async findById(id: string): Promise<Category | null> {
    const category = await this.categoryRepository.category.findUnique({
      where: { id },
    });

    return category ? this.toDomain(category) : null;
  }

  async findAll(page = 1, limit = 10): Promise<PaginationResult<Category>> {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([this.categoryRepository.category.findMany({ skip, take: limit }), this.categoryRepository.category.count()]);

    return {
      items: items.map((item) => this.toDomain(item)),
      total,
      page,
      limit,
    };
  }

  async findBySlug(slug: string): Promise<Category | null> {
    const category = await this.categoryRepository.category.findFirst({
      where: { slug },
    });

    return category ? this.toDomain(category) : null;
  }

  async update(id: string, category: Partial<Category>): Promise<Category> {
    const updatedCategory = await this.categoryRepository.category.update({
      where: { id },
      data: {
        name: category.name,
        slug: category.slug,
        description: category.description,
      },
    });

    return this.toDomain(updatedCategory);
  }

  async delete(id: string): Promise<boolean> {
    await this.categoryRepository.category.delete({
      where: { id },
    });
    return true;
  }

  private toDomain(category: { id: string; name: string; slug: string; description: string | null; createdAt: Date; updatedAt: Date }): Category {
    return new Category({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description ?? undefined,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    });
  }
}
