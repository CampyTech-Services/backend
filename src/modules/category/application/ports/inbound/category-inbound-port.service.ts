import { Category } from '@mod/category/domain/entities';
import { CreateCategoryDto, UpdateCategoryDto } from '../../dto';
import { PaginationResult } from '@/common/types';

/**
 * Inbound port (application-level use case interface) for category operations.
 *
 * This contract is the API that controllers or other adapters call to perform
 * category use cases.
 */
export abstract class CategoryInboundPortService {
  /**
   * Create a new category entity.
   * @param createCategoryDto - DTO payload used for category creation
   * @returns Promise resolving to created Category
   */
  abstract create(createCategoryDto: CreateCategoryDto): Promise<Category>;

  /**
   * Get a category by its id.
   * @param id - category identifier
   * @returns Promise resolving to Category or null when not found
   */
  abstract findById(id: string): Promise<Category | null>;

  /**
   * Get all categories.
   * @returns Promise resolving to array of categories
   */
  abstract findAll(page?: number, limit?: number): Promise<PaginationResult<Category>>;

  /**
   * Get a category by its slug.
   * @param slug - category slug
   * @returns Promise resolving to Category or null when not found
   */
  abstract findBySlug(slug: string): Promise<Category | null>;

  /**
   * Update an existing category by id.
   * @param id - category identifier
   * @param updateCategoryDto - DTO payload for updates
   * @returns Promise resolving to updated Category
   */
  abstract update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category>;

  /**
   * Delete a category by id.
   * @param id - category identifier
   * @returns Promise resolving to true when deletion succeeds
   */
  abstract delete(id: string): Promise<boolean>;
}
