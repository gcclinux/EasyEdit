/**
 * OAuth configuration interfaces
 * Defines configuration structures for OAuth providers and system settings
 */

/**
 * Provider-specific OAuth configuration
 */
export interface OAuthProviderConfig {
  /** OAuth client ID for the provider */
  clientId: string;
  /** OAuth client secret (optional for PKCE flows) */
  clientSecret?: string;
  /** OAuth scopes to request */
  scope: string[];
  /** Custom authorization URL (optional override) */
  authorizationUrl?: string;
  /** Custom token URL (optional override) */
  tokenUrl?: string;
  /** Provider-specific additional parameters */
  additionalParams?: Record<string, string>;
  /** Whether this provider is enabled */
  enabled: boolean;
}

/**
 * Callback server configuration options
 */
export interface CallbackServerConfig {
  /** Preferred port (will try alternatives if unavailable) */
  port?: number;
  /** Host to bind to (default: 127.0.0.1) */
  host: string;
  /** Port range to try if preferred port is unavailable */
  portRange: [number, number];
  /** Timeout for waiting for OAuth callback */
  timeout: number;
  /** Maximum retries for port binding */
  maxRetries: number;
  /** Whether to use HTTPS for callback server */
  useHttps?: boolean;
}

/**
 * Security parameter configuration
 */
export interface SecurityConfig {
  /** State parameter expiration time in milliseconds */
  stateExpiration: number;
  /** PKCE code challenge method */
  pkceMethod: 'S256' | 'plain';
  /** Whether to encrypt stored tokens */
  tokenEncryption: boolean;
  /** Token refresh buffer time in milliseconds */
  tokenRefreshBuffer: number;
  /** Maximum authentication attempts before lockout */
  maxAuthAttempts: number;
  /** Lockout duration in milliseconds */
  lockoutDuration: number;
}

/**
 * Complete OAuth system configuration
 */
export interface OAuthConfig {
  /** Provider-specific configurations */
  providers: Record<string, OAuthProviderConfig>;
  /** Callback server configuration */
  callbackServer: CallbackServerConfig;
  /** Security parameters */
  security: SecurityConfig;
  /** Environment-specific overrides */
  environment?: {
    /** Development mode settings */
    development?: Partial<OAuthConfig>;
    /** Production mode settings */
    production?: Partial<OAuthConfig>;
    /** Test mode settings */
    test?: Partial<OAuthConfig>;
  };
}

/**
 * Environment variables for OAuth configuration
 */
export interface OAuthEnvironmentVars {
  /** Google OAuth client ID */
  GOOGLE_OAUTH_CLIENT_ID?: string;
  /** Google OAuth client secret */
  GOOGLE_OAUTH_CLIENT_SECRET?: string;
  /** Dropbox OAuth client ID */
  DROPBOX_OAUTH_CLIENT_ID?: string;
  /** OneDrive OAuth client ID */
  ONEDRIVE_OAUTH_CLIENT_ID?: string;
  /** OAuth callback server port */
  OAUTH_CALLBACK_PORT?: string;
  /** OAuth callback server host */
  OAUTH_CALLBACK_HOST?: string;
  /** OAuth timeout in seconds */
  OAUTH_TIMEOUT?: string;
  /** Environment mode */
  NODE_ENV?: 'development' | 'production' | 'test';
}

/**
 * Configuration validation result
 */
export interface ConfigValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}