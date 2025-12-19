/**
 * Authentication state tracking for OAuth flows
 * Maintains security parameters and flow status
 */
export interface AuthenticationState {
  provider: string;
  state: string;
  codeVerifier: string;
  codeChallenge: string;
  redirectUri: string;
  startTime: Date;
  isActive: boolean;
}



/**
 * Result from OAuth callback server operations
 */
export interface CallbackResult {
  success: boolean;
  code?: string;
  state?: string;
  error?: string;
  errorDescription?: string;
}

/**
 * Result of complete OAuth authentication flow
 */
export interface OAuthResult {
  success: boolean;
  provider: string;
  tokens?: import('./OAuthProvider').OAuthTokens;
  error?: string;
  errorDescription?: string;
}