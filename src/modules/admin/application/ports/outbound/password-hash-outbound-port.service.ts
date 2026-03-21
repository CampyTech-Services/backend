/**
 * Outbound port for password hashing operations.
 *
 * Security adapters implement this contract so the application layer can hash
 * and verify passwords without depending on a specific hashing library.
 */
export abstract class PasswordHashOutboundPortService {
  /**
   * Hash a plain-text password.
   * @param value Plain-text password
   * @returns hashed password value
   */
  abstract hash(value: string): Promise<string>;

  /**
   * Compare a plain-text password against a stored hash.
   * @param value Plain-text password
   * @param hash Stored password hash
   * @returns true when both values match
   */
  abstract compare(value: string, hash: string): Promise<boolean>;
}
