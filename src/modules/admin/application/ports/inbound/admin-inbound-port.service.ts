import { PaginationResult } from '@/common/types';
import { Admin } from '@mod/admin/domain';
import { ChangePasswordDto, CreateAdminDto, LoginAdminDto, LoginAdminResponseDto, UpdateAdminDto, UpdateAdminStatusDto, UpdateAdminVerificationDto } from '../../dto';

/**
 * Inbound port for admin use cases.
 *
 * This contract is the application-facing API that controllers or other
 * adapters call to execute admin workflows.
 */
export abstract class AdminInboundPortService {
  /**
   * Create a new admin account.
   * @param createAdminDto Payload used to create an admin
   * @returns created Admin entity
   */
  abstract create(createAdminDto: CreateAdminDto): Promise<Admin>;

  /**
   * Authenticate an admin and issue an access token.
   * @param loginAdminDto Credentials for login
   * @returns signed token response with the authenticated admin payload
   */
  abstract login(loginAdminDto: LoginAdminDto): Promise<LoginAdminResponseDto>;

  /**
   * List admins with optional pagination.
   * @param page Page number starting from 1
   * @param limit Items per page
   * @returns paginated Admin result
   */
  abstract findAll(page?: number, limit?: number): Promise<PaginationResult<Admin>>;

  /**
   * Fetch an admin by its id.
   * @param id Admin identifier
   * @returns Admin entity or null when not found
   */
  abstract findById(id: string): Promise<Admin | null>;

  /**
   * Update mutable admin profile fields.
   * @param id Admin identifier
   * @param updateAdminDto Partial admin fields to update
   * @returns updated Admin entity
   */
  abstract update(id: string, updateAdminDto: UpdateAdminDto): Promise<Admin>;

  /**
   * Update the active status of an admin account.
   * @param id Admin identifier
   * @param updateAdminStatusDto Payload containing the new status
   * @returns updated Admin entity
   */
  abstract updateStatus(id: string, updateAdminStatusDto: UpdateAdminStatusDto): Promise<Admin>;

  /**
   * Update the verification status of an admin account.
   * @param id Admin identifier
   * @param updateAdminVerificationDto Payload containing the new verification state
   * @returns updated Admin entity
   */
  abstract updateVerification(id: string, updateAdminVerificationDto: UpdateAdminVerificationDto): Promise<Admin>;

  /**
   * Change the password of an existing admin account.
   * @param id Admin identifier
   * @param changePasswordDto Payload containing current and new passwords
   * @returns true when the password change succeeds
   */
  abstract changePassword(id: string, changePasswordDto: ChangePasswordDto): Promise<boolean>;
}
