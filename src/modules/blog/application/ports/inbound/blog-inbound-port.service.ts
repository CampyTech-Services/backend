import { Blog } from '@mod/blog/domain';
import { CreateBlogDto, UpdateBlogDto } from '../../dto';
import { PaginationResult } from '@/common/types/pagination.type';

/**
 * Inbound port for blog use cases.
 *
 * This abstract class defines the contract that controllers or other adapters
 * invoke to execute operations in the blog application layer.
 */
export abstract class BlogInboundPortService {
  /**
   * Create a blog record.
   * @param createBlogDto Payload for creating a blog
   * @returns created Blog entity
   */
  abstract create(createBlogDto: CreateBlogDto): Promise<Blog>;

  /**
   * Fetch blog by id.
   * @param id Blog identifier
   * @returns Blog or null when not found
   */
  abstract findById(id: string): Promise<Blog | null>;

  /**
   * List all blogs.
   * @returns Array of Blog entities
   */
  abstract findAll(page?: number, limit?: number): Promise<PaginationResult<Blog>>;

  /**
   * Fetch blog by slug.
   * @param slug Blog slug
   * @returns Blog or null when not found
   */
  abstract findBySlug(slug: string): Promise<Blog | null>;

  /**
   * List blogs in a category.
   * @param categoryId Category identifier
   * @returns Array of Blog entities
   */
  abstract findByCategoryId(categoryId: string): Promise<Blog[]>;

  /**
   * Update a blog record.
   * @param id Blog identifier
   * @param updateBlogDto Partial blog fields to update
   * @returns updated Blog entity
   */
  abstract update(id: string, updateBlogDto: UpdateBlogDto): Promise<Blog>;

  /**
   * Delete a blog.
   * @param id Blog identifier
   * @returns true if deletion succeeded
   */
  abstract delete(id: string): Promise<boolean>;
}
