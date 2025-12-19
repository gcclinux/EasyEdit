/**
 * OAuth interfaces and types
 * Exports all core OAuth interfaces for use throughout the application
 */

export type {
  OAuthProvider,
  OAuthTokens,
  TokenResponse
} from './OAuthProvider';

export type {
  AuthenticationState,
  CallbackResult,
  OAuthResult
} from './AuthenticationState';

export type {
  OAuthConfig,
  OAuthProviderConfig,
  CallbackServerConfig,
  SecurityConfig,
  OAuthEnvironmentVars,
  ConfigValidationResult
} from './OAuthConfig';