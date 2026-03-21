import { PaginationResult } from '@/common/types';
import { Admin } from '@mod/admin/domain';

/**
 * Outbound port for admin persistence operations.
 *
 * Repository adapters implement this contract to store and retrieve admin data
 * without leaking persistence details into the application layer.
 */
export abstract class AdminRepositoryOutboundPortService {
  /**
   * Persist a new admin record.
   * @param admin Admin domain entity to create
   * @returns created Admin entity
   */
  abstract create(admin: Admin): Promise<Admin>;

  /**
   * Find an admin by its unique identifier.
   * @param id Admin identifier
   * @returns Admin entity or null when not found
   */
  abstract findById(id: string): Promise<Admin | null>;

  /**
   * Find an admin by email address.
   * @param email Admin email
   * @returns Admin entity or null when not found
   */
  abstract findByEmail(email: string): Promise<Admin | null>;

  /**
   * List admins with optional pagination.
   * @param page Page number starting from 1
   * @param limit Items per page
   * @returns paginated Admin result
   */
  abstract findAll(page?: number, limit?: number): Promise<PaginationResult<Admin>>;

  /**
   * Update an existing admin record.
   * @param id Admin identifier
   * @param admin Partial admin data to persist
   * @returns updated Admin entity
   */
  abstract update(id: string, admin: Partial<Admin>): Promise<Admin>;
}
