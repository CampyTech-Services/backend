import { Comment } from '@mod/comment/domain/entities';
import { PaginationResult } from '@/common/types';

/**
 * Outbound port for comment persistence.
 *
 * Repository adapters implement this class to supply domain persistence operations.
 */
export abstract class CommentRepositoryOutputPortService {
  abstract create(comment: Comment): Promise<Comment>;
  abstract findById(id: string): Promise<Comment | null>;
  abstract findAll(page?: number, limit?: number): Promise<PaginationResult<Comment>>;
  abstract findByBlogId(blogId: string): Promise<Comment[]>;
  abstract update(id: string, comment: Partial<Comment>): Promise<Comment>;
  abstract delete(id: string): Promise<boolean>;
}
