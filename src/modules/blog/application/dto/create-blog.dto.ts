export class CreateBlogDto {
  title!: string;
  slug!: string;
  featuredImage!: string;
  content!: string;
  excerpt?: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  categoryId!: string;
  authorId!: string;
}
