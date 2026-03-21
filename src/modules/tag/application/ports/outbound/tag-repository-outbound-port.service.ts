import { PaginationResult } from '@/common/types';
import { Tag } from '@mod/tag/domain';

/**
 * Outbound port for tag persistence operations.
 *
 * Repository adapters implement this contract to store and retrieve tag data
 * without exposing persistence concerns to the application layer.
 */
export abstract class TagRepositoryOutboundPortService {
  /**
   * Persist a new tag record.
   * @param tag Tag domain entity to create
   * @returns created Tag entity
   */
  abstract create(tag: Tag): Promise<Tag>;

  /**
   * Find a tag by its unique identifier.
   * @param id Tag identifier
   * @returns Tag entity or null when not found
   */
  abstract findById(id: string): Promise<Tag | null>;

  /**
   * List tags with optional pagination.
   * @param page Page number starting from 1
   * @param limit Items per page
   * @returns paginated Tag result
   */
  abstract findAll(page?: number, limit?: number): Promise<PaginationResult<Tag>>;

  /**
   * Find a tag by slug.
   * @param slug Tag slug
   * @returns Tag entity or null when not found
   */
  abstract findBySlug(slug: string): Promise<Tag | null>;

  /**
   * Update an existing tag record.
   * @param id Tag identifier
   * @param tag Partial tag data to persist
   * @returns updated Tag entity
   */
  abstract update(id: string, tag: Partial<Tag>): Promise<Tag>;

  /**
   * Delete a tag by its id.
   * @param id Tag identifier
   * @returns true when deletion succeeds
   */
  abstract delete(id: string): Promise<boolean>;
}
