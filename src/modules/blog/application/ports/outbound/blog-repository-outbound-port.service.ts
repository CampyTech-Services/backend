import { Blog } from '@mod/blog/domain';
import { PaginationResult } from '@/common/types';

/**
 * Outbound port for blog persistence.
 *
 * Repository adapters implement this class to supply domain persistence operations.
 */
export abstract class BlogRepositoryOutputPortService {
  /**
   * Persist a new blog into the storage.
   * @param blog Blog domain entity to create
   * @returns Promise resolving with the created blog
   */
  abstract create(blog: Blog): Promise<Blog>;

  /**
   * Find a blog by its ID.
   * @param id Blog identifier
   * @returns Promise resolving with Blog or null if not found
   */
  abstract findById(id: string): Promise<Blog | null>;

  /**
   * List blogs with optional pagination.
   * @param page Page number starting from 1
   * @param limit Items per page
   * @returns Promise resolving with pagination result
   */
  abstract findAll(page?: number, limit?: number): Promise<PaginationResult<Blog>>;

  /**
   * Find a blog by slug.
   * @param slug Blog slug
   * @returns Promise resolving with Blog or null if not found
   */
  abstract findBySlug(slug: string): Promise<Blog | null>;

  /**
   * Find blogs by category ID.
   * @param categoryId Category identifier
   * @returns Promise resolving with an array of blogs
   */
  abstract findByCategoryId(categoryId: string): Promise<Blog[]>;

  /**
   * Update an existing blog.
   * @param id Blog identifier
   * @param blog Partial fields to update
   * @returns Promise resolving with updated blog
   */
  abstract update(id: string, blog: Partial<Blog>): Promise<Blog>;

  /**
   * Delete a blog.
   * @param id Blog identifier
   * @returns Promise resolving with true when deletion succeeds
   */
  abstract delete(id: string): Promise<boolean>;
}
