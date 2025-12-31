# EasyEditor - Development Guidelines

## Code Quality Standards

### TypeScript Configuration
- **Strict Type Checking**: All files use strict TypeScript with proper type annotations
- **Interface Definitions**: Complex data structures use well-defined interfaces (e.g., `OAuthError`, `GitStatus`, `Commit`)
- **Generic Types**: Utility functions leverage generics for type safety (`withRetry<T>`, `withTimeout<T>`)
- **Enum Usage**: String enums for constants and error types (`OAuthErrorType`, status values)

### Error Handling Patterns
- **Comprehensive Error Classification**: Errors are categorized by type with specific handling strategies
- **User-Friendly Messages**: All errors provide both technical and user-friendly messages
- **Retry Logic**: Network operations implement exponential backoff with configurable retry policies
- **Graceful Degradation**: Operations continue with fallback mechanisms when possible
- **Error Propagation**: Errors are properly caught, transformed, and re-thrown with context

### Async/Await Patterns
- **Consistent Async Usage**: All asynchronous operations use async/await syntax
- **Promise Handling**: Proper error handling in async functions with try/catch blocks
- **Timeout Management**: Long-running operations implement timeout mechanisms
- **Resource Cleanup**: Async operations include proper cleanup in finally blocks

## Architectural Patterns

### State Management
- **React Hooks**: Extensive use of useState, useEffect, useRef, and useCallback
- **State Isolation**: Related state variables grouped together logically
- **Ref Usage**: DOM references and mutable values properly managed with useRef
- **Effect Dependencies**: useEffect hooks have properly defined dependency arrays

### Component Architecture
- **Functional Components**: All components are functional with hooks
- **Props Interface**: Component props are well-defined with TypeScript interfaces
- **Event Handling**: Consistent event handler naming (handle*, on*)
- **Conditional Rendering**: Complex conditional logic extracted to helper functions

### Module Organization
- **Feature-Based Structure**: Code organized by feature domains (git, oauth, cloud, etc.)
- **Utility Separation**: Common utilities extracted to dedicated modules
- **Type Definitions**: Interfaces and types defined close to usage or in dedicated files
- **Export Patterns**: Clear distinction between default and named exports

## Naming Conventions

### Variables and Functions
- **camelCase**: All variables and functions use camelCase (`editorContent`, `handleGitSave`)
- **Descriptive Names**: Names clearly indicate purpose (`currentRepoPath`, `showPasswordPrompt`)
- **Boolean Prefixes**: Boolean variables use is/has/can prefixes (`isGitRepo`, `hasCredentials`)
- **Handler Naming**: Event handlers prefixed with 'handle' (`handleFileSelect`, `handleCommit`)

### Constants and Enums
- **UPPER_SNAKE_CASE**: Constants use uppercase with underscores (`DEFAULT_RETRY_CONFIG`)
- **PascalCase Enums**: Enum names use PascalCase (`OAuthErrorType`, `GitStatus`)
- **Descriptive Enum Values**: Enum values are self-documenting (`NETWORK_ERROR`, `USER_CANCELLED`)

### Files and Directories
- **camelCase Files**: TypeScript files use camelCase (`gitManager.ts`, `stpFileCrypter.ts`)
- **PascalCase Components**: React components use PascalCase (`App.tsx`, `GitDropdown.tsx`)
- **Kebab-case Directories**: Directory names use kebab-case when multi-word

## API Design Patterns

### Function Signatures
- **Optional Parameters**: Optional parameters use TypeScript optional syntax with defaults
- **Configuration Objects**: Complex functions accept configuration objects rather than many parameters
- **Return Types**: Functions have explicit return type annotations
- **Generic Constraints**: Generic functions include appropriate type constraints

### Error Handling API
- **Structured Errors**: Custom error types with consistent structure
- **Error Context**: Errors include original error context and user-friendly messages
- **Retry Configuration**: Retryable operations accept configuration objects
- **Timeout Support**: Long operations support timeout configuration

### Async API Patterns
- **Promise-Based**: All async operations return Promises
- **Cancellation Support**: Long operations support cancellation where appropriate
- **Progress Callbacks**: Operations that take time support progress callbacks
- **Resource Management**: Async operations properly manage resources (cleanup, timeouts)

## Security Patterns

### Credential Management
- **Secure Storage**: Credentials encrypted before storage
- **Memory Clearing**: Sensitive data cleared from memory when possible
- **Access Control**: Credential access requires proper authentication
- **Timeout Handling**: Credential sessions have appropriate timeouts

### Input Validation
- **Type Checking**: All inputs validated at runtime and compile time
- **Sanitization**: User inputs sanitized before processing
- **Length Limits**: String inputs have reasonable length limits
- **Format Validation**: Structured inputs (URLs, emails) validated for format

### Encryption Implementation
- **Standard Algorithms**: Uses well-established encryption libraries (CryptoJS)
- **Key Management**: Proper key derivation and management
- **Error Handling**: Encryption errors handled gracefully
- **Data Conversion**: Proper conversion between data formats (Uint8Array, WordArray)

## Performance Patterns

### Optimization Techniques
- **Debouncing**: User input operations debounced to prevent excessive calls
- **Memoization**: Expensive calculations memoized with useCallback/useMemo
- **Lazy Loading**: Components and modules loaded on demand
- **Resource Cleanup**: Event listeners and subscriptions properly cleaned up

### Memory Management
- **Effect Cleanup**: useEffect hooks include cleanup functions
- **Reference Management**: DOM references properly managed and cleared
- **State Updates**: State updates batched when possible
- **Large Data Handling**: Large datasets processed in chunks

## Testing Patterns

### Error Simulation
- **Network Errors**: Comprehensive network error simulation and handling
- **User Cancellation**: Proper handling of user-initiated cancellations
- **Timeout Scenarios**: Operations tested with various timeout conditions
- **Edge Cases**: Boundary conditions and edge cases properly tested

### Validation Patterns
- **Input Validation**: All user inputs validated before processing
- **State Validation**: Component state validated for consistency
- **Configuration Validation**: Configuration objects validated on startup
- **Runtime Checks**: Critical operations include runtime validation

## Documentation Standards

### Code Comments
- **Function Documentation**: Complex functions include JSDoc-style comments
- **Algorithm Explanation**: Non-obvious algorithms explained with comments
- **TODO Comments**: Technical debt marked with TODO comments
- **Requirement Tracing**: Code linked to requirements where applicable

### Type Documentation
- **Interface Documentation**: Complex interfaces include property descriptions
- **Enum Documentation**: Enum values documented with usage context
- **Generic Documentation**: Generic type parameters explained
- **Error Documentation**: Error types include handling guidance

## Cross-Platform Considerations

### Environment Detection
- **Runtime Detection**: Platform capabilities detected at runtime
- **Feature Flags**: Platform-specific features controlled by flags
- **Graceful Degradation**: Features degrade gracefully on unsupported platforms
- **API Abstraction**: Platform differences abstracted behind common APIs

### Resource Management
- **File System Access**: Different file system APIs handled transparently
- **Network Operations**: Network operations adapted to platform capabilities
- **Storage APIs**: Storage operations use appropriate platform APIs
- **UI Adaptation**: User interface adapts to platform conventions

## Integration Patterns

### External Services
- **OAuth Integration**: Standardized OAuth flow implementation
- **Git Operations**: Consistent Git operation patterns across platforms
- **Cloud Services**: Unified cloud service integration patterns
- **Error Handling**: Consistent error handling across all integrations

### Event-Driven Architecture
- **Event Emission**: Consistent event emission patterns (Tauri, DOM)
- **Event Handling**: Standardized event handler registration and cleanup
- **State Synchronization**: Events used for cross-component state sync
- **Error Propagation**: Errors propagated through event system when appropriate