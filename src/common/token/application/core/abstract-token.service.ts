export interface TokenSignResult {
  token: string;
  expiresIn: number;
}

export abstract class AbstractTokenService {
  abstract getAccessToken(instance?: string): Promise<string>;
  abstract signToken(
    payload: Record<string, unknown>,
  ): Promise<TokenSignResult>;
  abstract verifyToken(token: string): Promise<boolean>;
}
