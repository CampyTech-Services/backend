export interface AdminAccessTokenResult {
  accessToken: string;
  expiresIn: string | number;
}

/**
 * Outbound port for admin token generation.
 *
 * Token adapters implement this contract so the application layer can issue
 * authentication tokens without depending on a specific token provider.
 */
export abstract class AdminAuthTokenOutboundPortService {
  /**
   * Sign an admin access token from a payload.
   * @param payload Claims to encode in the token
   * @returns signed access token and expiry metadata
   */
  abstract signAccessToken(payload: Record<string, unknown>): Promise<AdminAccessTokenResult>;
}
