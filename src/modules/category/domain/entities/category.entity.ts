export class Category {
  id!: string;
  name!: string;
  slug!: string;
  description?: string;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(data: { id?: string; name: string; slug: string; description?: string; createdAt?: Date; updatedAt?: Date }) {
    Object.assign(this, data);
    this.name = Category.requireText(data.name, 'name');
    this.slug = Category.normalizeSlug(data.slug);
    this.description = data.description?.trim() || undefined;
  }

  static normalizeSlug(slug: string): string {
    return Category.requireText(slug, 'slug').toLowerCase().replace(/\s+/g, '-');
  }

  update(data: Partial<Pick<Category, 'name' | 'slug' | 'description'>>): void {
    if (data.name !== undefined) this.name = Category.requireText(data.name, 'name');
    if (data.slug !== undefined) this.slug = Category.normalizeSlug(data.slug);
    if (data.description !== undefined) this.description = data.description?.trim() || undefined;
  }

  private static requireText(value: string, field: string): string {
    const normalized = value?.trim();
    if (!normalized) {
      throw new Error(`Category ${field} cannot be empty`);
    }
    return normalized;
  }
}
