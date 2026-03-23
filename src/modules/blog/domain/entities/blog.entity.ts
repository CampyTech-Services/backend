import { Prisma } from '@/prisma/generated/prisma/client.js';

export type BlogStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type BlogContent = Prisma.JsonValue;

export class Blog {
  id!: string;
  title!: string;
  slug!: string;
  featuredImage!: string;
  content?: BlogContent;
  excerpt?: string;
  status!: BlogStatus;
  categoryId!: string;
  authorId!: string;
  tagIds!: string[];
  createdAt!: Date;
  updatedAt!: Date;

  constructor(data: { id?: string; title: string; slug: string; featuredImage: string; content?: BlogContent; excerpt?: string; status?: BlogStatus; categoryId: string; authorId: string; tagIds?: string[]; createdAt?: Date; updatedAt?: Date }) {
    Object.assign(this, data);
    this.title = Blog.requireText(data.title, 'title');
    this.slug = Blog.normalizeSlug(data.slug);
    this.featuredImage = Blog.requireText(data.featuredImage, 'featuredImage');
    this.content = Blog.requireContent(data.content);
    this.categoryId = Blog.requireText(data.categoryId, 'categoryId');
    this.authorId = Blog.requireText(data.authorId, 'authorId');
    this.tagIds = Blog.normalizeTagIds(data.tagIds);
    this.excerpt = data.excerpt?.trim() || undefined;
    if (!this.status) this.status = 'DRAFT';
  }

  static normalizeSlug(slug: string): string {
    return Blog.requireText(slug, 'slug').toLowerCase().replace(/\s+/g, '-');
  }

  update(data: Partial<Pick<Blog, 'title' | 'slug' | 'featuredImage' | 'content' | 'excerpt' | 'status' | 'categoryId' | 'authorId' | 'tagIds'>>): void {
    if (data.title !== undefined) this.title = Blog.requireText(data.title, 'title');
    if (data.slug !== undefined) this.slug = Blog.normalizeSlug(data.slug);
    if (data.featuredImage !== undefined) this.featuredImage = Blog.requireText(data.featuredImage, 'featuredImage');
    if (data.content !== undefined) this.content = Blog.requireContent(data.content);
    if (data.excerpt !== undefined) this.excerpt = data.excerpt?.trim() || undefined;
    if (data.status !== undefined) this.status = data.status;
    if (data.categoryId !== undefined) this.categoryId = Blog.requireText(data.categoryId, 'categoryId');
    if (data.authorId !== undefined) this.authorId = Blog.requireText(data.authorId, 'authorId');
    if (data.tagIds !== undefined) this.tagIds = Blog.normalizeTagIds(data.tagIds);
  }

  private static normalizeTagIds(tagIds?: string[]): string[] {
    if (!tagIds?.length) return [];
    return [...new Set(tagIds.map((tagId) => Blog.requireText(tagId, 'tagId')))];
  }

  private static requireText(value: string, field: string): string {
    const normalized = value?.trim();
    if (!normalized) {
      throw new Error(`Blog ${field} cannot be empty`);
    }
    return normalized;
  }

  private static requireContent(content: BlogContent | undefined): BlogContent {
    if (content === null || content === undefined) {
      throw new Error('Blog content cannot be empty');
    }

    return content;
  }
}
