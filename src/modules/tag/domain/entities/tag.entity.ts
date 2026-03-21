export class Tag {
  id!: string;
  name!: string;
  slug!: string;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(data: { id?: string; name: string; slug: string; createdAt?: Date; updatedAt?: Date }) {
    Object.assign(this, data);
    this.name = Tag.requireText(data.name, 'name');
    this.slug = Tag.normalizeSlug(data.slug);
  }

  static normalizeSlug(slug: string): string {
    return Tag.requireText(slug, 'slug').toLowerCase().replace(/\s+/g, '-');
  }

  update(data: Partial<Pick<Tag, 'name' | 'slug'>>): void {
    if (data.name !== undefined) this.name = Tag.requireText(data.name, 'name');
    if (data.slug !== undefined) this.slug = Tag.normalizeSlug(data.slug);
  }

  private static requireText(value: string, field: string): string {
    const normalized = value?.trim();
    if (!normalized) {
      throw new Error(`Tag ${field} cannot be empty`);
    }
    return normalized;
  }
}
