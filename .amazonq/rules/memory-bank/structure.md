# EasyEdit - Project Structure

## Root Directory Organization

### Core Application
- **`src/`** - Main React TypeScript application source code
- **`src-tauri/`** - Tauri desktop application backend (Rust)
- **`public/`** - Static assets and themes for web deployment
- **`dist-web/`** - Built web application output

### Documentation & Guides
- **`docs/`** - Comprehensive project documentation and guides
- **`docs-site/`** - Documentation website source (separate React app)
- **`.local/`** - Local development notes and setup guides
- **`.kiro/`** - Specification documents for features

### Deployment & Distribution
- **`linux/`** - Linux-specific build scripts and Flatpak configurations
- **`snap/`** - Snap package configuration
- **`release/`** - Release management and update mechanisms
- **`scripts/`** - Build and deployment automation scripts

### Development & CI/CD
- **`.github/`** - GitHub Actions workflows and issue templates
- **`screenshots/`** - Application screenshots for documentation

## Source Code Architecture (`src/`)

### Core Components
- **`App.tsx`** - Main application component and state management
- **`main.tsx`** - React application entry point
- **`index.css`** - Global styles and CSS variables

### Feature Modules
- **`components/`** - Reusable UI components and modals
- **`autoGenerator/`** - Table, Gantt, and timeline generators
- **`cloud/`** - Cloud service integrations (Google Drive, OAuth)
- **`services/`** - External service integrations and API clients
- **`templates/`** - Pre-built markdown templates
- **`themes/`** - Theme definitions and styling

### Utility Modules
- **`utils/`** - Environment detection and helper functions
- **`i18n/`** - Internationalization and language support
- **`config/`** - Feature flags and configuration
- **`stubs/`** - Platform-specific API stubs

### Core Functionality Files
- **`gitManager.ts`** - Git operations and repository management
- **`fileSystemHelper.ts`** - File system access and operations
- **`cryptoHandler.ts`** - Encryption and security functions
- **`stpFileCrypter.ts`** - SSTP file encryption implementation
- **`themeLoader.ts`** - Dynamic theme loading and management
- **`insertMarkdown.ts`** - Markdown insertion utilities
- **`insertMermaid.ts`** - Mermaid diagram insertion
- **`insertUML.ts`** - UML diagram integration
- **`saveAsPDF.tsx`** - PDF export functionality

## Component Architecture

### Modal System
Centralized modal management with specialized modals:
- File operations (FileBrowserModal, CloneModal)
- Authentication (OAuthLoadingModal, PasswordModal)
- Configuration (ThemeModal, GitCredentialsModal)
- Information display (AboutModal, FeaturesModal)

### Dropdown System
Hierarchical dropdown menus for feature access:
- Content insertion (InsertDropdown, TablesDropdown)
- Formatting (FormatDropdown, HeaderDropdown)
- Diagrams (MermaidDropdown, UMLDropdown)
- Media (ImagesDropdown, IconsDropdown)

### Service Layer
- **OAuth Services** - Google Drive integration with error handling
- **Git Services** - Repository operations with credential management
- **File Services** - Cross-platform file system access
- **Cloud Services** - Synchronization and backup operations

## Tauri Backend (`src-tauri/`)

### Rust Components
- **`main.rs`** - Tauri application entry point
- **`lib.rs`** - Core library functions and exports
- **`oauth.rs`** - OAuth flow implementation for desktop

### Configuration
- **`tauri.conf.json`** - Tauri application configuration
- **`Cargo.toml`** - Rust dependencies and metadata
- **`capabilities/`** - Security permissions and API access

## Build & Deployment Architecture

### Multi-Platform Support
- **Web Build** - Vite-based bundling for browser deployment
- **Desktop Build** - Tauri compilation for native applications
- **Docker Build** - Containerized deployment with Express server
- **Package Builds** - Flatpak, Snap, and installer generation

### Asset Management
- **Theme System** - CSS-based theming with runtime switching
- **Icon System** - Multi-resolution icon sets for different platforms
- **Static Assets** - Images, fonts, and media files

## Data Flow Architecture

### State Management
- React state for UI components
- Local storage for user preferences
- File system for document persistence
- Git for version control
- Cloud services for synchronization

### Event Flow
1. User interaction → Component state update
2. State change → File system operation
3. File change → Git tracking (if enabled)
4. Git operation → Cloud synchronization (if configured)
5. Cloud sync → UI status indicators

## Security Architecture
- Environment-based configuration separation
- Secure credential storage with encryption
- OAuth token management
- File encryption with master password protection
- Cross-platform security considerations