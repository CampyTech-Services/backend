import { Comment } from '@mod/comment/domain';
import { PaginationResult } from '@/common/types';

/**
 * Outbound port for comment persistence.
 *
 * Repository adapters implement this class to supply domain persistence operations.
 */
export abstract class CommentRepositoryOutputPortService {
  /**
   * Persist a new comment into the storage.
   * @param comment Comment domain entity to create
   * @returns Promise resolving with the created comment
   */
  abstract create(comment: Comment): Promise<Comment>;

  /**
   * Find a comment by its ID.
   * @param id Comment identifier
   * @returns Promise resolving with Comment or null if not found
   */
  abstract findById(id: string): Promise<Comment | null>;

  /**
   * List comments with optional pagination.
   * @param page Page number starting from 1
   * @param limit Items per page
   * @returns Promise resolving with pagination result
   */
  abstract findAll(page?: number, limit?: number): Promise<PaginationResult<Comment>>;

  /**
   * Find comments by blog ID.
   * @param blogId Blog identifier
   * @returns Promise resolving with an array of comments
   */
  abstract findByBlogId(blogId: string): Promise<Comment[]>;

  /**
   * Update an existing comment.
   * @param id Comment identifier
   * @param comment Partial fields to update
   * @returns Promise resolving with updated comment
   */
  abstract update(id: string, comment: Partial<Comment>): Promise<Comment>;

  /**
   * Delete a comment.
   * @param id Comment identifier
   * @returns Promise resolving with true when deletion succeeds
   */
  abstract delete(id: string): Promise<boolean>;
}
