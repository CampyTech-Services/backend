import { BlogContent } from '@mod/blog/domain';

export class UpdateBlogDto {
  title?: string;
  slug?: string;
  featuredImage?: string;
  content?: BlogContent;
  excerpt?: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  categoryId?: string;
  authorId?: string;
  tagIds?: string[];
}
