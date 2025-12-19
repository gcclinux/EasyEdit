# OAuth Configuration System

The OAuth configuration system provides a flexible way to configure OAuth providers, security settings, and callback server options for the Tauri OAuth implementation.

## Quick Start

### Basic Configuration

```typescript
import { OAuthManager } from '../core';
import type { OAuthConfig } from '../interfaces';

// Minimal configuration using environment variables
const config: Partial<OAuthConfig> = {
  providers: {
    google: {
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID || '',
      scope: ['https://www.googleapis.com/auth/drive.file'],
      enabled: true
    }
  }
};

const oauthManager = new OAuthManager(config);
```

### Environment Variables

The system automatically reads these environment variables:

- `GOOGLE_OAUTH_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_OAUTH_CLIENT_SECRET` - Google OAuth client secret (optional)
- `OAUTH_CALLBACK_PORT` - Preferred callback server port
- `OAUTH_CALLBACK_HOST` - Callback server host (default: 127.0.0.1)
- `OAUTH_TIMEOUT` - OAuth timeout in seconds
- `NODE_ENV` - Environment mode (development/production/test)

### Complete Configuration

```typescript
import { OAuthManager, OAuthConfigManager } from '../core';
import { createGoogleProviderConfig } from '../utils';

const config: OAuthConfig = {
  providers: {
    google: createGoogleProviderConfig('your-client-id.apps.googleusercontent.com')
  },
  callbackServer: {
    host: '127.0.0.1',
    port: 8080,
    portRange: [8080, 8090],
    timeout: 300000, // 5 minutes
    maxRetries: 3,
    useHttps: false
  },
  security: {
    stateExpiration: 600000, // 10 minutes
    pkceMethod: 'S256',
    tokenEncryption: true,
    tokenRefreshBuffer: 300000, // 5 minutes
    maxAuthAttempts: 3,
    lockoutDuration: 900000 // 15 minutes
  }
};

const oauthManager = new OAuthManager(config);
```

## Configuration Options

### Provider Configuration

Each OAuth provider can be configured with:

- `clientId` - OAuth client ID (required)
- `clientSecret` - OAuth client secret (optional for PKCE)
- `scope` - Array of OAuth scopes to request
- `authorizationUrl` - Custom authorization URL (optional)
- `tokenUrl` - Custom token URL (optional)
- `enabled` - Whether the provider is enabled
- `additionalParams` - Provider-specific parameters

### Callback Server Configuration

- `host` - Host to bind to (default: 127.0.0.1)
- `port` - Preferred port (will try alternatives if unavailable)
- `portRange` - Range of ports to try [start, end]
- `timeout` - Timeout for OAuth callback in milliseconds
- `maxRetries` - Maximum port binding retries
- `useHttps` - Whether to use HTTPS (future feature)

### Security Configuration

- `stateExpiration` - State parameter expiration time (ms)
- `pkceMethod` - PKCE method ('S256' or 'plain')
- `tokenEncryption` - Whether to encrypt stored tokens
- `tokenRefreshBuffer` - Buffer time before token expiration (ms)
- `maxAuthAttempts` - Maximum authentication attempts
- `lockoutDuration` - Lockout duration after max attempts (ms)

## Environment-Specific Configuration

Configure different settings for different environments:

```typescript
const config: OAuthConfig = {
  // ... base configuration
  environment: {
    development: {
      callbackServer: {
        timeout: 180000 // 3 minutes for development
      }
    },
    production: {
      security: {
        maxAuthAttempts: 2,
        lockoutDuration: 1800000 // 30 minutes
      }
    },
    test: {
      callbackServer: {
        timeout: 30000 // 30 seconds for tests
      }
    }
  }
};
```

## Configuration Management

### Using OAuthConfigManager

```typescript
import { OAuthConfigManager } from '../core';

const configManager = new OAuthConfigManager(baseConfig);

// Get provider configuration
const googleConfig = configManager.getProviderConfig('google');

// Update provider configuration
configManager.updateProviderConfig('google', {
  scope: ['https://www.googleapis.com/auth/drive.file', 'profile']
});

// Validate configuration
const validation = configManager.validateConfig();
if (!validation.isValid) {
  console.error('Configuration errors:', validation.errors);
}

// Get enabled providers
const enabledProviders = configManager.getEnabledProviders();
```

### Dynamic Configuration Updates

```typescript
const oauthManager = new OAuthManager(initialConfig);

// Update configuration at runtime
oauthManager.updateConfig({
  providers: {
    google: {
      ...existingGoogleConfig,
      scope: ['https://www.googleapis.com/auth/drive.file', 'profile']
    }
  }
});
```

## Helper Functions

The system provides helper functions for common configurations:

```typescript
import { 
  createDefaultOAuthConfig,
  createGoogleProviderConfig,
  validateOAuthConfig,
  mergeOAuthConfigs
} from '../utils';

// Create default configuration
const defaultConfig = createDefaultOAuthConfig();

// Create Google provider configuration
const googleConfig = createGoogleProviderConfig('client-id');

// Validate configuration
const validation = validateOAuthConfig(config);

// Merge configurations
const mergedConfig = mergeOAuthConfigs(baseConfig, overrideConfig);
```

## Best Practices

1. **Use Environment Variables**: Store sensitive information like client IDs in environment variables
2. **Validate Configuration**: Always validate configuration before using it
3. **Environment-Specific Settings**: Use different settings for development, testing, and production
4. **Security First**: Use S256 PKCE method and enable token encryption
5. **Reasonable Timeouts**: Set appropriate timeouts for your use case
6. **Error Handling**: Handle configuration errors gracefully

## Examples

See `oauth-config.example.ts` for complete configuration examples.