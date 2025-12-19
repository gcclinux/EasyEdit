/**
 * Core OAuth provider interface that defines the contract for all OAuth implementations
 */
export interface OAuthProvider {
  readonly name: string;
  readonly displayName: string;
  readonly authorizationUrl: string;
  readonly tokenUrl: string;
  readonly scope: string[];
  readonly clientId: string;
  
  /**
   * Builds the OAuth authorization URL with PKCE parameters
   */
  buildAuthUrl(redirectUri: string, state: string, codeChallenge: string): string;
  
  /**
   * Exchanges authorization code for access and refresh tokens
   */
  exchangeCodeForTokens(code: string, redirectUri: string, codeVerifier: string): Promise<TokenResponse>;
  
  /**
   * Refreshes access tokens using refresh token
   */
  refreshTokens(refreshToken: string): Promise<TokenResponse>;
  
  /**
   * Validates that tokens are still valid and not expired
   */
  validateTokens(tokens: OAuthTokens): Promise<boolean>;
}

/**
 * OAuth tokens structure for secure storage and usage
 */
export interface OAuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresAt: Date;
  scope: string;
  tokenType: string;
}

/**
 * Response structure from OAuth token endpoints
 */
export interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
  scope?: string;
  error?: string;
  error_description?: string;
}