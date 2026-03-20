import { Category } from '../domain/entities';

export class CategoryPresenter {
  id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(category: Category) {
    this.id = category.id;
    this.name = category.name;
    this.slug = category.slug;
    this.description = category.description;
    this.createdAt = category.createdAt;
    this.updatedAt = category.updatedAt;
  }

  static fromEntity(category: Category): CategoryPresenter {
    return new CategoryPresenter(category);
  }

  static fromEntities(categories: Category[]): CategoryPresenter[] {
    return categories.map((category) => CategoryPresenter.fromEntity(category));
  }
}
