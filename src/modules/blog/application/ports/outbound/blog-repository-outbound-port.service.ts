import { Blog } from '@mod/blog/domain';
import { PaginationResult } from '@/common/types';

/**
 * Outbound port for blog persistence.
 *
 * Repository adapters implement this class to supply domain persistence operations.
 */
export abstract class BlogRepositoryOutputPortService {
  abstract create(blog: Blog): Promise<Blog>;
  abstract findById(id: string): Promise<Blog | null>;
  abstract findAll(page?: number, limit?: number): Promise<PaginationResult<Blog>>;
  abstract findBySlug(slug: string): Promise<Blog | null>;
  abstract findByCategoryId(categoryId: string): Promise<Blog[]>;
  abstract update(id: string, blog: Partial<Blog>): Promise<Blog>;
  abstract delete(id: string): Promise<boolean>;
}
