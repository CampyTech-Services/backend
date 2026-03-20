import { Category } from '../../../domain/entities';
import { PaginationResult } from '@/common/types';

/**
 * Outbound port for category persistence operations.
 *
 * This abstract class defines the contract for repository implementations
 * (e.g. Prisma, TypeORM, in-memory) without committing to any particular driver.
 */
export abstract class CategoryRepositoryOutputPortService {
  /**
   * Persist a new category into the storage.
   * @param category - Category domain entity to create
   * @returns Promise resolving with the created category
   */
  abstract create(category: Category): Promise<Category>;

  /**
   * Find a category by its ID.
   * @param id - Category identifier
   * @returns Promise resolving with Category or null if not found
   */
  abstract findById(id: string): Promise<Category | null>;

  /**
   * List categories with optional pagination.
   * @param page - Page number starting from 1
   * @param limit - Items per page
   * @returns Promise resolving with pagination result
   */
  abstract findAll(page?: number, limit?: number): Promise<PaginationResult<Category>>;

  /**
   * Find a category by slug.
   * @param slug - Category slug
   * @returns Promise resolving with Category or null if not found
   */
  abstract findBySlug(slug: string): Promise<Category | null>;

  /**
   * Update an existing category.
   * @param id - Category identifier
   * @param category - Partial fields to update
   * @returns Promise resolving with updated category
   */
  abstract update(id: string, category: Partial<Category>): Promise<Category>;

  /**
   * Delete a category.
   * @param id - Category identifier
   * @returns Promise resolving with true when deletion succeeds
   */
  abstract delete(id: string): Promise<boolean>;
}
