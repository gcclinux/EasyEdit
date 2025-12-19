# OAuth Service Module

This module provides OAuth 2.0 authentication capabilities for the EasyEdit desktop application built with Tauri.

## Structure

```
src/services/oauth/
├── interfaces/           # TypeScript interfaces and types
│   ├── OAuthProvider.ts     # Core OAuth provider interface
│   ├── AuthenticationState.ts # Authentication state and callback types
│   └── index.ts             # Interface exports
├── core/                # Core OAuth components
│   ├── OAuthManager.ts      # Central OAuth orchestrator
│   ├── CallbackServer.ts    # Local HTTP callback server
│   ├── BrowserLauncher.ts   # Cross-platform browser launcher
│   ├── TokenStorage.ts      # Secure token storage
│   ├── StateManager.ts      # OAuth state and PKCE management
│   └── index.ts             # Core component exports
├── providers/           # OAuth provider implementations
│   ├── GoogleOAuthProvider.ts # Google OAuth implementation
│   └── index.ts             # Provider exports
├── utils/               # Utility functions
│   ├── dependencies-check.ts # Dependency verification
│   └── index.ts             # Utility exports
├── __tests__/           # Test files
│   ├── interfaces.test.ts   # Interface tests
│   └── exports.test.ts      # Export verification tests
├── index.ts             # Main module export
└── README.md            # This file
```

## Interfaces

### Core Types

- **OAuthProvider**: Interface for OAuth provider implementations
- **OAuthTokens**: Structure for OAuth access and refresh tokens
- **TokenResponse**: OAuth token endpoint response format
- **AuthenticationState**: OAuth flow state tracking
- **CallbackResult**: OAuth callback server response
- **OAuthResult**: Complete OAuth authentication result
- **CallbackServerConfig**: Callback server configuration

## Components

### Core Components (Placeholders)

All core components are currently placeholder implementations that will be developed in subsequent tasks:

- **OAuthManager**: Central orchestrator for OAuth flows (Task 7)
- **CallbackServer**: Local HTTP server for OAuth callbacks (Task 3)
- **BrowserLauncher**: Cross-platform browser launching (Task 4)
- **TokenStorage**: Secure token storage with platform-specific encryption (Task 5)
- **StateManager**: OAuth state and PKCE parameter management (Task 2)

### Providers

- **GoogleOAuthProvider**: Google OAuth 2.0 implementation (Task 6)

## Dependencies

All required dependencies are available:

- ✅ **HTTP Server**: Node.js `http` module and Express.js
- ✅ **Crypto Operations**: `crypto-js` and Node.js `crypto` module
- ✅ **Port Detection**: `detect-port` for finding available ports
- ✅ **Platform Detection**: Node.js built-in capabilities

## Usage

```typescript
import { 
  OAuthManager, 
  GoogleOAuthProvider,
  type OAuthTokens 
} from '@/services/oauth';

// Example usage (will be implemented in future tasks)
const oauthManager = new OAuthManager();
const googleProvider = new GoogleOAuthProvider('your-client-id');
```

## Testing

Run OAuth-specific tests:

```bash
npm test -- --testPathPatterns="src/services/oauth"
```

## Implementation Status

- ✅ **Task 1**: Core interfaces and project structure (COMPLETED)
- ⏳ **Task 2**: State Manager implementation
- ⏳ **Task 3**: Callback Server implementation
- ⏳ **Task 4**: Browser Launcher implementation
- ⏳ **Task 5**: Token Storage implementation
- ⏳ **Task 6**: Google OAuth Provider implementation
- ⏳ **Task 7**: OAuth Manager implementation
- ⏳ **Task 8+**: Additional features and integration

## Security Considerations

The OAuth implementation follows security best practices:

- PKCE (Proof Key for Code Exchange) flow
- Cryptographically secure state parameters
- Platform-specific secure token storage
- Localhost-only callback server binding
- Proper resource cleanup and token protection