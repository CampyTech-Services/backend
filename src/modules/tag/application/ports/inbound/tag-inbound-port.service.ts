import { PaginationResult } from '@/common/types';
import { Tag } from '@mod/tag/domain';
import { CreateTagDto, UpdateTagDto } from '../../dto';

/**
 * Inbound port for tag use cases.
 *
 * This contract is the application-facing API that controllers or other
 * adapters call to execute tag workflows.
 */
export abstract class TagInboundPortService {
  /**
   * Create a new tag.
   * @param createTagDto Payload used to create a tag
   * @returns created Tag entity
   */
  abstract create(createTagDto: CreateTagDto): Promise<Tag>;

  /**
   * Fetch a tag by its id.
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
   * Fetch a tag by slug.
   * @param slug Tag slug
   * @returns Tag entity or null when not found
   */
  abstract findBySlug(slug: string): Promise<Tag | null>;

  /**
   * Update a tag by its id.
   * @param id Tag identifier
   * @param updateTagDto Partial tag fields to update
   * @returns updated Tag entity
   */
  abstract update(id: string, updateTagDto: UpdateTagDto): Promise<Tag>;

  /**
   * Delete a tag by its id.
   * @param id Tag identifier
   * @returns true when deletion succeeds
   */
  abstract delete(id: string): Promise<boolean>;
}
