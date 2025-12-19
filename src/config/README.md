# Feature Flags Configuration

This directory contains configuration files for managing feature flags in the application.

## Features Configuration (`features.ts`)

The `features.ts` file controls which features are enabled or disabled in the application.

### Current Features

- **EASY_NOTES**: Cloud-based note management system with Google Drive integration
  - Currently set to `false` (disabled)
  - Set to `true` when ready to release to users

### Usage

To enable a feature:
```typescript
export const FEATURES = {
  EASY_NOTES: true, // Enable EasyNotes feature
} as const;
```

To disable a feature:
```typescript
export const FEATURES = {
  EASY_NOTES: false, // Disable EasyNotes feature
} as const;
```

### Adding New Features

1. Add the feature flag to the `FEATURES` object
2. Use `isFeatureEnabled('FEATURE_NAME')` in your components
3. Wrap the feature UI in a conditional block

Example:
```typescript
// In features.ts
export const FEATURES = {
  NEW_FEATURE: false,
} as const;

// In your component
import { isFeatureEnabled } from './config/features';

// In JSX
{isFeatureEnabled('NEW_FEATURE') && (
  <YourNewFeatureComponent />
)}
```

### Benefits

- **Safe Deployment**: Deploy code without exposing unfinished features
- **Easy Rollback**: Quickly disable features if issues arise
- **Gradual Rollout**: Enable features for testing before full release
- **Clean Code**: No need to comment out or delete code during development