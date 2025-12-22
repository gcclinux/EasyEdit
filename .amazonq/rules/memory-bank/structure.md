# EasyEdit - Project Structure

## Root Directory Organization

### Core Application
- **`src/`** - Main React/TypeScript application source code
- **`src-tauri/`** - Tauri desktop application backend (Rust)
- **`public/`** - Static assets (icons, themes, images)
- **`docs/`** - Comprehensive project documentation
- **`docs-site/`** - Separate Vite-based documentation website

### Build & Distribution
- **`linux/`** - Linux-specific build scripts and Flatpak configurations
- **`snap/`** - Ubuntu Snap package configuration
- **`scripts/`** - Build automation and utility scripts
- **`release/`** - Release management and distribution files

### Development & Testing
- **`screenshots/`** - Application screenshots and promotional images
- **`.github/`** - GitHub Actions workflows and issue templates
- **`about/`** - About page HTML/CSS/JS files

### Snap Build System
- **`parts/`** - Snap build parts (easyedit, launcher, web-assets, webkit-preload)
- **`prime/`** - Snap prime directory with built artifacts
- **`stage/`** - Snap staging directory
- **`overlay/`** - Snap overlay configurations

## Source Code Architecture (`src/`)

### Main Application Files
- **`App.tsx`** - Root React component and main application logic
- **`main.tsx`** - React application entry point
- **`index.html`** - HTML template
- **`App.css`** / **`index.css`** - Global styles

### Core Functionality Modules
- **`gitManager.ts`** - Git operations and repository management
- **`fileSystemHelper.ts`** - File system operations abstraction
- **`cryptoHandler.ts`** - Encryption/decryption utilities
- **`insertMarkdown.ts`** - Markdown insertion and formatting
- **`insertMermaid.ts`** - Mermaid diagram insertion
- **`insertUML.ts`** - UML diagram insertion
- **`saveAsPDF.tsx`** - PDF export functionality

### Platform-Specific Handlers
- **`tauriFileHandler.ts`** - Tauri desktop file operations
- **`tauriGitManager.ts`** - Tauri-specific Git operations
- **`mainHandler.ts`** - Main application event handling

### Component Architecture (`src/components/`)

#### Modal Components
- **`AboutModal.tsx`** - Application information
- **`CloneModal.tsx`** - Git repository cloning
- **`CommitModal.tsx`** - Git commit interface
- **`FileBrowserModal.tsx`** - File browser and management
- **`GitHistoryModal.tsx`** - Git commit history viewer
- **`ThemeModal.tsx`** - Theme selection and management
- **`CloudServicesModal.tsx`** - Cloud service configuration

#### UI Components
- **`PreviewComponent.tsx`** - Markdown preview renderer
- **`TextareaComponent.tsx`** - Main editor textarea
- **`GitStatusIndicator.tsx`** - Git status display
- **`CloudSyncIndicator.tsx`** - Cloud sync status
- **`LoadingOverlay.tsx`** - Loading state overlay
- **`Toast.tsx`** / **`ToastContainer.tsx`** - Notification system

#### Dropdown Menus
- **`FormatDropdown.tsx`** - Text formatting options
- **`InsertDropdown.tsx`** - Content insertion menu
- **`GitDropdown.tsx`** - Git operations menu
- **`MermaidDropdown.tsx`** - Mermaid diagram options
- **`UMLDropdown.tsx`** - UML diagram options
- **`TablesDropdown.tsx`** - Table generation
- **`HeaderDropdown.tsx`** - Header formatting
- **`FooterDropdown.tsx`** - Footer elements

### Service Layer (`src/services/`)
- **`oauth/`** - OAuth authentication services
  - Core OAuth management
  - Provider-specific implementations
  - Token handling and refresh

### Configuration & Data
- **`config/`** - Application configuration files
- **`templates/`** - Document templates (bug reports, journals, etc.)
- **`themes/`** - CSS theme files
- **`assets/`** - Images and icons

### Utilities
- **`utils/`** - Utility functions and helpers
- **`stubs/`** - Platform compatibility stubs

## Tauri Backend (`src-tauri/`)
- **`src/main.rs`** - Tauri application entry point
- **`src/oauth.rs`** - OAuth handling for desktop
- **`src/lib.rs`** - Shared library code
- **`tauri.conf.json`** - Tauri configuration
- **`Cargo.toml`** - Rust dependencies

## Build Configuration
- **`vite.config.ts`** - Main Vite configuration
- **`vite.config.web.ts`** - Web-specific Vite config
- **`tsconfig.*.json`** - TypeScript configurations
- **`package.json`** - Node.js dependencies and scripts

## Architectural Patterns

### Component Organization
- **Modal-based UI**: Heavy use of modal dialogs for feature access
- **Dropdown menus**: Hierarchical feature organization
- **Service layer**: Abstracted external service integrations
- **Platform abstraction**: Unified API across web/desktop platforms

### State Management
- React hooks and context for state management
- Local storage for persistence
- File system integration for document storage

### Multi-Platform Strategy
- **Web**: Vite + React with File System Access API
- **Desktop**: Tauri wrapper with Rust backend
- **Container**: Docker with Express server
- **Package**: Snap/Flatpak for Linux distribution

### Security Architecture
- SSTP encryption for sensitive files
- OAuth integration for cloud services
- Master password protection
- Secure credential storage