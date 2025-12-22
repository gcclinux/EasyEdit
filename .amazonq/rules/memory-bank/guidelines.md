# EasyEdit - Development Guidelines

## Code Quality Standards

### TypeScript Usage
- **Strict typing**: All files use TypeScript with explicit type definitions
- **Interface definitions**: Complex objects use interfaces (e.g., `TextAreaRef`, `CloneOptions`, `GitStatus`)
- **Generic types**: Proper use of generics for reusable components
- **Type assertions**: Minimal use of `any`, prefer specific types or unions
- **Optional properties**: Extensive use of optional properties with `?` operator

### Naming Conventions
- **Functions**: camelCase with descriptive names (`handleGitClone`, `insertBoldSyntax`)
- **Variables**: camelCase for local variables, descriptive names
- **Constants**: UPPER_SNAKE_CASE for enums and constants (`OAuthOperation`, `AlertType`)
- **Components**: PascalCase for React components (`GitStatusIndicator`, `OAuthManager`)
- **Files**: camelCase for utilities, PascalCase for components
- **Interfaces**: PascalCase with descriptive names (`MonitoringAlert`, `HealthStatus`)

### Documentation Standards
- **JSDoc comments**: Comprehensive documentation for public methods and classes
- **Inline comments**: Explain complex logic and business rules
- **TODO comments**: Mark areas for future improvement
- **Console logging**: Extensive use of console.log for debugging with structured messages
- **Error context**: Detailed error messages with context information

## Structural Conventions

### File Organization
- **Single responsibility**: Each file focuses on one main concern
- **Barrel exports**: Use index files to re-export related functionality
- **Separation of concerns**: Clear separation between UI, business logic, and utilities
- **Feature-based structure**: Group related files by feature (oauth/, components/, templates/)

### Import/Export Patterns
```typescript
// Named exports preferred over default exports
export const insertBoldSyntax = (...) => { ... };
export class GitManager { ... }

// Destructured imports for better tree-shaking
import { insertBoldSyntax, insertItalicSyntax } from './insertMarkdown';

// Dynamic imports for code splitting
const { handleTauriOpenFile } = await import('./tauriFileHandler');
```

### Error Handling Patterns
```typescript
// Comprehensive try-catch with specific error messages
try {
  await gitManager.clone(url, targetDir, options);
} catch (error: any) {
  console.error('=== Git Clone Failed ===');
  console.error('Error details:', error);
  
  let errorMessage = error.message || 'Unknown error';
  if (errorMessage.includes('401')) {
    errorMessage = 'Authentication failed: Please check credentials';
  }
  
  throw new Error(`Failed to clone repository: ${errorMessage}`);
}
```

## Semantic Patterns

### State Management
- **React hooks**: Extensive use of useState, useEffect, useRef, useCallback
- **State lifting**: Complex state managed at appropriate component levels
- **Ref usage**: useRef for DOM manipulation and persistent values
- **Effect dependencies**: Careful dependency arrays in useEffect

### Async/Await Patterns
```typescript
// Consistent async/await usage over Promises
const handleAsyncOperation = async () => {
  try {
    const result = await someAsyncFunction();
    return result;
  } catch (error) {
    console.error('Operation failed:', error);
    throw error;
  }
};
```

### Event Handling
```typescript
// Consistent event handler naming and structure
const handleButtonClick = async (event: React.MouseEvent) => {
  event.preventDefault();
  closeAllDropdowns();
  await performAction();
};
```

### Conditional Rendering
```typescript
// Clear conditional rendering patterns
{isFeatureEnabled('EASY_NOTES') && (
  <EasyNotesSidebar />
)}

{!isPreviewFull && (
  <TextareaComponent />
)}
```

## Internal API Usage Patterns

### Git Operations
```typescript
// Consistent Git operation patterns
const performGitOperation = async () => {
  if (!gitManager) {
    showToast('Git manager not initialized', 'error');
    return;
  }
  
  if (!isGitRepo) {
    showToast('No active Git repository', 'info');
    return;
  }
  
  try {
    await gitManager.someOperation();
    showToast('Operation successful', 'success');
  } catch (error) {
    showToast(`Operation failed: ${error.message}`, 'error');
  }
};
```

### Modal Management
```typescript
// Consistent modal state management
const [modalOpen, setModalOpen] = useState(false);
const [modalConfig, setModalConfig] = useState({
  open: false,
  title: '',
  onSubmit: () => {}
});

// Modal opening pattern
const openModal = () => {
  setModalConfig({
    open: true,
    title: 'Modal Title',
    onSubmit: handleSubmit
  });
};
```

### Toast Notifications
```typescript
// Standardized toast usage
showToast('Success message', 'success');
showToast('Error occurred', 'error');
showToast('Information', 'info');
showToast('Warning message', 'warning');
```

## Frequently Used Code Idioms

### Dropdown Management
```typescript
// Consistent dropdown state and positioning
const [showDropdown, setShowDropdown] = useState(false);
const [dropdownPos, setDropdownPos] = useState<{top: number; left: number; width: number} | null>(null);

const handleDropdownClick = (e: React.MouseEvent) => {
  e.preventDefault();
  closeAllDropdowns();
  setShowDropdown(true);
  
  if (buttonRef.current) {
    const rect = buttonRef.current.getBoundingClientRect();
    setDropdownPos({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
      width: rect.width
    });
  }
};
```

### File Operations
```typescript
// Platform detection and conditional execution
const isTauri = typeof window !== 'undefined' && (window as any).__TAURI_INTERNALS__;

if (isTauri) {
  // Tauri-specific implementation
  const { handleTauriOperation } = await import('./tauriFileHandler');
  await handleTauriOperation();
} else {
  // Web-specific implementation
  await webOperation();
}
```

### Credential Management
```typescript
// Consistent credential checking pattern
const ensureCredentials = async (action: () => Promise<void>) => {
  if (!gitCredentialManager.hasCredentials()) {
    setPendingCredentialAction(() => action);
    handleSetupCredentials();
    return false;
  }
  
  if (!gitCredentialManager.isUnlocked()) {
    setPendingCredentialAction(() => action);
    setMasterPasswordModalOpen(true);
    return false;
  }
  
  return true;
};
```

## Popular Annotations and Patterns

### React Component Patterns
```typescript
// Memoized components for performance
const TextareaComponent = React.memo(({ ... }) => {
  // Component implementation
});

// Custom hooks for reusable logic
const useGitStatus = () => {
  const [status, setStatus] = useState(initialStatus);
  // Hook logic
  return status;
};
```

### Logging Patterns
```typescript
// Structured logging with context
console.log('[Component] Operation started:', { param1, param2 });
console.log('=== Operation Phase ===');
console.error('[Component] Operation failed:', error);
```

### Configuration Patterns
```typescript
// Feature flags and configuration
const isFeatureEnabled = (feature: string) => {
  return config.features[feature] === true;
};

// Environment detection
const isBrowser = () => typeof window !== 'undefined';
const isTauri = () => typeof window !== 'undefined' && (window as any).__TAURI__;
```

### Cleanup Patterns
```typescript
// Comprehensive cleanup in useEffect
useEffect(() => {
  const handleEvent = () => { /* handler */ };
  
  document.addEventListener('event', handleEvent);
  
  return () => {
    document.removeEventListener('event', handleEvent);
  };
}, []);
```

## Performance Optimization Patterns

### Debouncing
```typescript
// Debounced operations for performance
const debouncedOperation = useCallback(
  debounce(() => {
    performExpensiveOperation();
  }, 300),
  []
);
```

### Lazy Loading
```typescript
// Dynamic imports for code splitting
const loadFeature = async () => {
  const { FeatureComponent } = await import('./FeatureComponent');
  return FeatureComponent;
};
```

### Memoization
```typescript
// Memoized calculations
const expensiveValue = useMemo(() => {
  return calculateExpensiveValue(dependencies);
}, [dependencies]);
```

## Security Patterns

### Input Validation
```typescript
// Consistent input validation
if (!provider.name || !provider.clientId) {
  throw new Error('Provider must have a name and clientId');
}
```

### CSRF Protection
```typescript
// State parameter validation for OAuth
const authState = this.stateManager.validateState(state);
if (!authState) {
  throw new Error('Invalid or expired state parameter - possible CSRF attack');
}
```

### Error Sanitization
```typescript
// Sanitized error messages for users
const sanitizeError = (error: Error) => {
  if (error.message.includes('401')) {
    return 'Authentication failed. Please check your credentials.';
  }
  return 'An error occurred. Please try again.';
};
```