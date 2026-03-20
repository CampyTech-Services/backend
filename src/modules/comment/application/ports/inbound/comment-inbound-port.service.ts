import { Comment } from '@mod/comment/domain/entities';
import { CreateCommentDto, UpdateCommentDto } from '../../dto';
import { PaginationResult } from '@/common/types';

/**
 * Inbound port for comment use cases.
 *
 * This abstract class defines the contract that controllers or other adapters
 * invoke to execute operations in the comment application layer.
 */
export abstract class CommentInboundPortService {
  /**
   * Create a comment record.
   * @param createCommentDto Payload for creating a comment
   * @returns created Comment entity
   */
  abstract create(createCommentDto: CreateCommentDto): Promise<Comment>;

  /**
   * Fetch comment by id.
   * @param id Comment identifier
   * @returns Comment or null when not found
   */
  abstract findById(id: string): Promise<Comment | null>;

  /**
   * List all comments with pagination.
   * @param page Page number starting from 1
   * @param limit Items per page
   * @returns Pagination result of Comment entities
   */
  abstract findAll(page?: number, limit?: number): Promise<PaginationResult<Comment>>;

  /**
   * List comments by blog id.
   * @param blogId Blog identifier
   * @returns Array of Comment entities
   */
  abstract findByBlogId(blogId: string): Promise<Comment[]>;

  /**
   * Update a comment record.
   * @param id Comment identifier
   * @param updateCommentDto Partial comment fields to update
   * @returns updated Comment entity
   */
  abstract update(id: string, updateCommentDto: UpdateCommentDto): Promise<Comment>;

  /**
   * Delete a comment.
   * @param id Comment identifier
   * @returns true if deletion succeeded
   */
  abstract delete(id: string): Promise<boolean>;
}
