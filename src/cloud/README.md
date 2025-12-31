# Cloud Integration Module

This module provides cloud storage integration for EasyEditor notes, enabling users to store and synchronize markdown notes across multiple cloud providers.

## Directory Structure

```
src/cloud/
├── interfaces/          # TypeScript interfaces and types
│   ├── CloudProvider.ts # Core cloud provider interface
│   ├── NoteMetadata.ts  # Note metadata and credentials interfaces
│   └── index.ts         # Interface exports
├── managers/            # Core management classes
│   ├── CloudManager.ts           # Central orchestrator
│   ├── MetadataManager.ts        # Local metadata management
│   ├── CloudCredentialManager.ts # Credential storage
│   ├── FileSynchronizer.ts       # File sync operations
│   └── index.ts                  # Manager exports
├── providers/           # Cloud provider implementations
│   ├── GoogleDriveProvider.ts # Google Drive implementation
│   └── index.ts               # Provider exports
└── index.ts            # Main module export
```

## Core Interfaces

### CloudProvider
Defines the contract that all cloud storage providers must implement:
- Authentication (OAuth flows)
- File operations (CRUD)
- Application folder management

### NoteMetadata
Tracks cloud-stored notes locally for offline access and synchronization.

### CloudCredentials
Secure storage format for provider authentication tokens.

## Implementation Status

- ✅ Task 1: Core interfaces and project structure
- ⏳ Task 2: Cloud Credential Manager
- ⏳ Task 3: Metadata Manager
- ⏳ Task 4: Google Drive Provider
- ⏳ Task 5: File Synchronizer
- ⏳ Task 6: Cloud Manager orchestrator

## Testing

The module uses Jest with fast-check for property-based testing:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Dependencies

- `gapi-script`: Google API client library
- `jest`: Testing framework
- `fast-check`: Property-based testing library
- `ts-jest`: TypeScript support for Jest

## Usage

```typescript
import { CloudManager, GoogleDriveProvider } from './cloud';

// Initialize cloud manager
const cloudManager = new CloudManager();

// Connect to Google Drive
await cloudManager.connectProvider('googledrive');

// Create a new note
const note = await cloudManager.createNote('googledrive', 'My Note');

// List all notes
const notes = await cloudManager.listNotes();
```

## Requirements

See `.kiro/specs/cloud-notes-integration/requirements.md` for detailed requirements.

## Design

See `.kiro/specs/cloud-notes-integration/design.md` for architecture and design details.