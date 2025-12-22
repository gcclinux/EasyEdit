# EasyEdit - Technology Stack

## Core Technologies

### Frontend Framework
- **React 19.1.1** - Main UI framework
- **TypeScript 5.9.3** - Type-safe JavaScript
- **Vite 7.1.7** - Build tool and dev server
- **React DOM 19.1.1** - DOM rendering

### Desktop Application
- **Tauri 2.9.6** - Cross-platform desktop framework
- **Rust** - Backend language for Tauri
- **Cargo** - Rust package manager

### Markdown & Content Processing
- **react-markdown 10.1.0** - Markdown rendering
- **remark-gfm 4.0.1** - GitHub Flavored Markdown
- **remark-emoji 5.0.2** - Emoji support
- **rehype-raw 7.0.0** - Raw HTML in markdown

### Diagram Generation
- **mermaid 11.12.0** - Flowcharts, sequence diagrams, Gantt charts
- **nomnoml 1.7.0** - UML diagrams
- **plantuml-encoder 1.4.0** - PlantUML diagram encoding

### Git Integration
- **isomorphic-git 1.35.1** - Pure JavaScript Git implementation
- **@isomorphic-git/lightning-fs 4.6.2** - File system for isomorphic-git

### File & Export Operations
- **file-saver 2.0.5** - File download functionality
- **jspdf 3.0.3** - PDF generation
- **html2canvas 1.4.1** - HTML to canvas conversion

### Authentication & Cloud
- **gapi-script 1.2.0** - Google API integration
- **@types/gapi** - Google API TypeScript definitions
- **@types/gapi.auth2** - Google OAuth2 TypeScript definitions

### Encryption & Security
- **crypto-js 4.2.0** - Cryptographic functions
- **buffer 6.0.3** - Node.js Buffer polyfill

### UI & Styling
- **react-icons 5.5.0** - Icon library
- **@twemoji/api 16.0.1** - Twitter emoji rendering
- **twemoji 14.0.2** - Emoji graphics

### Development Tools
- **ESLint 9.36.0** - Code linting
- **Jest 30.2.0** - Testing framework
- **Playwright 1.55.1** - End-to-end testing
- **TypeScript** - Static type checking

## Build System & Configuration

### Package Management
- **npm** - Primary package manager
- **package.json** - Dependency management
- **package-lock.json** - Dependency locking

### Build Scripts
```json
{
  "dev": "vite",
  "server": "vite --host --port 3024",
  "build": "tsc && vite build && node scripts/copy-metadata.js",
  "build:web": "tsc && vite build --outDir dist-web",
  "preview": "vite preview --port 3024",
  "tauri:dev": "WEBKIT_DISABLE_DMABUF_RENDERER=1 WEBKIT_DISABLE_COMPOSITING_MODE=1 tauri dev",
  "tauri:build": "WEBKIT_DISABLE_DMABUF_RENDERER=1 WEBKIT_DISABLE_COMPOSITING_MODE=1 tauri build"
}
```

### TypeScript Configuration
- **tsconfig.json** - Root TypeScript config with project references
- **tsconfig.app.json** - Application-specific TypeScript settings
- **tsconfig.node.json** - Node.js environment TypeScript settings

### Vite Configuration
- **vite.config.ts** - Main Vite configuration for desktop/development
- **vite.config.web.ts** - Web-specific Vite configuration

## Platform-Specific Technologies

### Web Platform
- **File System Access API** - Modern browser file operations
- **Service Workers** - Offline functionality
- **Web APIs** - Browser-native features

### Desktop Platform (Tauri)
- **@tauri-apps/api 2.9.1** - Tauri JavaScript API
- **@tauri-apps/plugin-dialog 2.4.2** - Native file dialogs
- **@tauri-apps/plugin-fs 2.4.4** - File system operations
- **@tauri-apps/plugin-shell 2.3.3** - Shell command execution

### Container Platform
- **Docker** - Containerization
- **Express 5.1.0** - Node.js web server
- **detect-port 2.1.0** - Port detection utility

### Linux Distribution
- **Snap** - Ubuntu package format
- **Flatpak** - Universal Linux package format
- **AppImage** - Portable Linux application format

## Development Environment

### Prerequisites
```bash
# Node.js and npm
node --version  # Required
npm --version   # Required

# Git
git --version   # Required

# Rust (for Tauri)
rustc --version
cargo --version
```

### System Dependencies

#### Linux (Ubuntu/Debian)
```bash
sudo apt install libwebkit2gtk-4.1-dev \
  build-essential \
  curl \
  wget \
  file \
  libxdo-dev \
  libssl-dev \
  libayatana-appindicator3-dev \
  librsvg2-dev
```

#### Linux (Fedora)
```bash
sudo dnf install webkit2gtk4.1-devel \
  openssl-devel \
  curl \
  wget \
  file \
  libappindicator-gtk3-devel \
  librsvg2-devel
```

#### macOS
```bash
xcode-select --install
```

#### Windows
- Visual Studio Build Tools with C++ workload

### Development Commands
```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Tauri development
npm run tauri:dev

# Tauri production build
npm run tauri:build

# Run tests
npm test

# Run with coverage
npm run test:coverage
```

## Architecture Decisions

### Multi-Platform Strategy
- **Web-first approach** with progressive enhancement
- **Tauri for desktop** - lighter than Electron
- **Docker for server deployment** - containerized web version
- **Linux packages** - native distribution formats

### State Management
- **React hooks** - Built-in state management
- **Local storage** - Browser persistence
- **File system** - Document storage

### Build System
- **Vite** - Fast development and optimized builds
- **TypeScript** - Type safety and better DX
- **ESLint** - Code quality and consistency

### Testing Strategy
- **Jest** - Unit and integration testing
- **Playwright** - End-to-end testing
- **TypeScript** - Compile-time error detection