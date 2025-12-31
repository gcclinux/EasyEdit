# Google Drive Configuration

This directory contains the configuration management system for Google Drive integration in EasyEditor.

## Files

- **`google-credentials.ts`** - Main configuration file with environment-aware credential management
- **`config-validator.ts`** - Validation utilities and setup guidance
- **`index.ts`** - Centralized exports and initialization functions

## Quick Setup

### For Development

1. Copy your Google Cloud Console credentials
2. Edit `.env.local` in the project root:

```bash
VITE_GOOGLE_CLIENT_ID=your-actual-client-id.apps.googleusercontent.com
VITE_GOOGLE_API_KEY=your-actual-api-key
```

3. Restart the development server

### For Production

Set environment variables in your deployment platform:

```bash
VITE_GOOGLE_CLIENT_ID_PROD=your-production-client-id.apps.googleusercontent.com
VITE_GOOGLE_API_KEY_PROD=your-production-api-key
```

## Configuration Validation

The system includes built-in validation that will:

- Check if credentials are properly configured
- Validate credential formats
- Verify authorized domains
- Provide helpful error messages and setup guidance

## Environment Support

The configuration system supports multiple environments:

- **Development** - Uses `VITE_GOOGLE_CLIENT_ID` and `VITE_GOOGLE_API_KEY`
- **Production** - Uses `VITE_GOOGLE_CLIENT_ID_PROD` and `VITE_GOOGLE_API_KEY_PROD`
- **Staging** - Uses `VITE_GOOGLE_CLIENT_ID_STAGING` and `VITE_GOOGLE_API_KEY_STAGING`

Environment is auto-detected based on `import.meta.env.PROD` and hostname, or can be explicitly set with `VITE_ENVIRONMENT`.

## Usage in Code

```typescript
import { 
  isGoogleDriveConfigured, 
  getConfigurationStatus,
  validateGoogleDriveConfiguration 
} from './config';

// Check if configured
if (isGoogleDriveConfigured()) {
  // Initialize Google Drive integration
}

// Get detailed status
const status = getConfigurationStatus();
console.log('Environment:', status.environment);
console.log('Configured:', status.configured);

// Validate configuration
const validation = validateGoogleDriveConfiguration();
if (!validation.isValid) {
  console.error('Configuration issues:', validation.errors);
}
```

## Security Notes

- OAuth Client IDs are safe to be public (they're in client-side code)
- API Keys should be restricted to specific APIs and domains in Google Cloud Console
- The `drive.file` scope ensures EasyEditor only accesses files it creates
- Users can revoke access anytime from their Google Account settings

## Troubleshooting

If you see configuration errors:

1. Check the browser console for detailed validation messages
2. Verify your Google Cloud Console setup matches the requirements
3. Ensure your domain is added to authorized JavaScript origins
4. Confirm your API key is restricted to Google Drive API

For detailed setup instructions, see `GOOGLE_DRIVE_SETUP.md` in the project root.