# EasyEdit - Technology Stack

## Core Technologies

### Frontend Framework
- **React 19.1.1** - Main UI framework with latest features
- **TypeScript 5.9.3** - Type-safe JavaScript development
- **Vite 7.1.7** - Fast build tool and development server
- **CSS3** - Custom styling with CSS variables for theming

### Desktop Application
- **Tauri 2.9.6** - Rust-based desktop application framework
- **Rust** - Backend language for native desktop functionality
- **WebKit** - Web engine for desktop app rendering

### Build & Development Tools
- **Node.js** - JavaScript runtime (version specified in package.json)
- **npm** - Package manager and script runner
- **ESLint 9.36.0** - Code linting and style enforcement
- **Jest 30.2.0** - Testing framework with coverage support
- **Playwright 1.55.1** - End-to-end testing

## Key Dependencies

### Markdown & Diagram Processing
- **react-markdown 10.1.0** - Markdown rendering component
- **mermaid 11.12.0** - Diagram generation library
- **nomnoml 1.7.0** - ASCII diagram creation
- **plantuml-encoder 1.4.0** - UML diagram encoding
- **remark-gfm 4.0.1** - GitHub Flavored Markdown support
- **remark-emoji 5.0.2** - Emoji support in markdown
- **rehype-raw 7.0.0** - Raw HTML support in markdown

### File & System Operations
- **@tauri-apps/api 2.9.1** - Tauri frontend API bindings
- **@tauri-apps/plugin-fs 2.4.4** - File system operations
- **@tauri-apps/plugin-dialog 2.4.2** - Native dialog support
- **@tauri-apps/plugin-shell 2.3.3** - Shell command execution
- **file-saver 2.0.5** - Client-side file saving
- **path-browserify 1.0.1** - Path utilities for browser

### Git Integration
- **isomorphic-git 1.35.1** - Pure JavaScript Git implementation
- **@isomorphic-git/lightning-fs 4.6.2** - In-memory file system for Git

### Cloud & Authentication
- **gapi-script 1.2.0** - Google API client library
- **@types/gapi 0.0.47** - Google API TypeScript definitions
- **@types/gapi.auth2 0.0.61** - Google OAuth2 type definitions

### Security & Encryption
- **crypto-js 4.2.0** - Cryptographic functions
- **buffer 6.0.3** - Node.js Buffer API for browsers

### Export & Generation
- **jspdf 3.0.3** - PDF generation library
- **html2canvas 1.4.1** - HTML to canvas conversion
- **twemoji 14.0.2** - Twitter emoji rendering
- **@twemoji/api 16.0.1** - Twemoji API integration

### UI & Interaction
- **react-icons 5.5.0** - Icon library for React
- **lodash.debounce 4.0.8** - Input debouncing utility
- **detect-port 2.1.0** - Port detection for development

### Server & Deployment
- **express 5.1.0** - Web server for Docker deployment
- **Docker** - Containerization platform
- **GitHub Actions** - CI/CD pipeline automation

## Development Commands

### Core Development
```bash
npm run dev          # Start development server
npm run server       # Start server on port 3024
npm run build        # Build for production
npm run build:web    # Build web-only version
npm run preview      # Preview production build
```

### Testing
```bash
npm run test         # Run test suite
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

### Tauri Desktop
```bash
npm run tauri:dev    # Start Tauri development mode
npm run tauri:build  # Build Tauri desktop application
```

### HTTPS Setup
```bash
npm run setup-https          # Setup HTTPS (Unix/Linux/macOS)
npm run setup-https-windows  # Setup HTTPS (Windows)
```

## Build Configurations

### TypeScript Configuration
- **tsconfig.json** - Root TypeScript configuration with project references
- **tsconfig.app.json** - Application-specific TypeScript settings
- **tsconfig.node.json** - Node.js environment TypeScript settings

### Vite Configuration
- **vite.config.ts** - Main Vite configuration for desktop/server builds
- **vite.config.web.ts** - Web-specific Vite configuration

### Testing Configuration
- **jest.config.js** - Jest testing framework configuration
- **setupTests.ts** - Test environment setup

### Linting Configuration
- **eslint.config.js** - ESLint rules and configuration

## Platform-Specific Requirements

### Linux Dependencies
```bash
# Ubuntu/Debian
sudo apt install libwebkit2gtk-4.1-dev build-essential curl wget file libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev

# Fedora
sudo dnf install webkit2gtk4.1-devel openssl-devel curl wget file libappindicator-gtk3-devel librsvg2-devel
```

### macOS Requirements
```bash
xcode-select --install  # Xcode Command Line Tools
```

### Windows Requirements
- Visual Studio Build Tools with C++ workload
- Rust toolchain via rustup

### Rust Installation
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env
```

## Deployment Targets

### Web Deployment
- Static site hosting (GitHub Pages, Netlify, Vercel)
- Docker container deployment
- Express server with port 3024

### Desktop Distribution
- **Windows**: .exe installer and portable executable
- **macOS**: .dmg disk image and .app bundle
- **Linux**: AppImage, Flatpak, Snap packages

### Container Deployment
```bash
docker pull ghcr.io/gcclinux/easyedit:latest
docker run -d --name EASYEDIT -p 3024:3024 ghcr.io/gcclinux/easyedit:main
```

## Environment Configuration
- **`.env.example`** - Template for environment variables
- **`.env.local`** - Local development environment settings
- **Environment detection** - Automatic platform and runtime detection