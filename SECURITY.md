# Security Guidelines for EasyEdit

## Credential Management

### ⚠️ NEVER commit credentials to the repository

- **DO NOT** hardcode API keys, client IDs, or any sensitive credentials in source code
- **ALWAYS** use environment variables for sensitive configuration
- **USE** the `.env.local` file for local development (this file is gitignored)

### Google Drive API Configuration

1. Copy `.env.example` to `.env.local`
2. Fill in your actual credentials from Google Cloud Console
3. Never commit `.env.local` or any file containing real credentials

```bash
# ✅ CORRECT - Use environment variables
VITE_GOOGLE_CLIENT_ID=your-actual-client-id.apps.googleusercontent.com
VITE_GOOGLE_API_KEY=your-actual-api-key
```

```typescript
// ✅ CORRECT - Reference environment variables with safe fallbacks
CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'placeholder-client-id'

// ❌ WRONG - Never hardcode real credentials
CLIENT_ID: '346463672218-sk1anr62stfogir6dquuecii12549krp.apps.googleusercontent.com'
```

### If Credentials Are Exposed

If you accidentally commit credentials:

1. **Immediately revoke** the exposed credentials in Google Cloud Console
2. **Generate new credentials** 
3. **Remove the credentials** from source code and replace with placeholders
4. **Commit the fix** with a clear security message
5. **Update your local .env.local** with the new credentials

### Security Tools

- GitGuardian monitors this repository for exposed secrets
- Pre-commit hooks should be configured to scan for credentials
- Regular security audits of dependencies with `npm audit`

## Reporting Security Issues

If you discover a security vulnerability, please report it privately to:
- Email: [security contact]
- Create a private security advisory on GitHub

Do not create public issues for security vulnerabilities.