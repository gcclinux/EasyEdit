# Secure Context Issue - File System Access API

## Problem

The "Open Repository" option doesn't appear when accessing via IP address (http://192.168.0.96:3024) but works on localhost (http://localhost:3024).

## Root Cause

The **File System Access API** requires a **Secure Context**:

### What is a Secure Context?

A secure context is a `Window` or `Worker` where certain security requirements are met:

✅ **Secure Contexts:**
- `https://` - Any HTTPS URL
- `http://localhost` - Localhost (any port)
- `http://127.0.0.1` - Loopback IP
- `file://` - Local files

❌ **NOT Secure Contexts:**
- `http://192.168.x.x` - Local network IP over HTTP
- `http://10.x.x.x` - Private network IP over HTTP
- `http://example.com` - Any HTTP (non-localhost)

### Why This Matters

The File System Access API (`showDirectoryPicker`, `showOpenFilePicker`, etc.) is only available in secure contexts for security reasons. When you access via IP address over HTTP, the browser considers it insecure and disables these APIs.

## Current Behavior

```javascript
// This check in App.tsx:
{!(window as any).electronAPI && 'showDirectoryPicker' in window && (
  // Show "Open Repository" button
)}
```

**Result:**
- `http://localhost:3024` → `'showDirectoryPicker' in window` = `true` ✅
- `http://192.168.0.96:3024` → `'showDirectoryPicker' in window` = `false` ❌

## Solutions

### Option 1: Use HTTPS (Recommended for Production)

Set up HTTPS with a self-signed certificate for local development.

**Pros:**
- ✅ Works on all devices on network
- ✅ Secure
- ✅ All modern APIs available

**Cons:**
- ⚠️ Requires certificate setup
- ⚠️ Browser warnings for self-signed certs

**Implementation:**

1. Generate self-signed certificate:
```bash
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes
```

2. Update `vite.config.ts`:
```typescript
import fs from 'fs';

export default defineConfig({
  server: {
    https: {
      key: fs.readFileSync('key.pem'),
      cert: fs.readFileSync('cert.pem')
    },
    host: '0.0.0.0',
    port: 3024
  }
});
```

3. Access via: `https://192.168.0.96:3024`

---

### Option 2: Use localhost with Port Forwarding

Access the server via localhost on each device.

**Pros:**
- ✅ No certificate needed
- ✅ Secure context automatically

**Cons:**
- ⚠️ Only works on the host machine
- ⚠️ Other devices can't access

**Implementation:**
Just use `http://localhost:3024` on the machine running the server.

---

### Option 3: Chrome Flags (Development Only)

Enable insecure origins for testing.

**Pros:**
- ✅ Quick for testing
- ✅ No code changes

**Cons:**
- ⚠️ Development only
- ⚠️ Security risk
- ⚠️ Not for production

**Implementation:**

1. Open Chrome
2. Go to: `chrome://flags/#unsafely-treat-insecure-origin-as-secure`
3. Add: `http://192.168.0.96:3024`
4. Restart Chrome

---

### Option 4: Add Helpful Message (Quick Fix)

Show a message explaining why the feature isn't available.

**Pros:**
- ✅ Quick to implement
- ✅ Educates users
- ✅ No infrastructure changes

**Cons:**
- ⚠️ Doesn't solve the problem
- ⚠️ Feature still unavailable

**Implementation:**

Add a message when the feature is unavailable:

```typescript
{!(window as any).electronAPI && !('showDirectoryPicker' in window) && (
  <div className="dropdown-item disabled" style={{ opacity: 0.6, cursor: 'not-allowed' }}>
    <div className="hdr-title">
      <FaCodeBranch /> Open Repository
      <span style={{ fontSize: '0.8em', color: '#f57c00' }}> (HTTPS Required)</span>
    </div>
    <div className="hdr-desc">
      Use https:// or localhost for this feature
    </div>
  </div>
)}
```

---

## Recommended Solution

### For Development: Option 1 (HTTPS)

This is the best solution because:
1. Works on all devices on your network
2. Enables all modern browser APIs
3. Mirrors production environment
4. One-time setup

### For Production: Always Use HTTPS

Production should always use HTTPS anyway, so this problem won't exist in production.

---

## Implementation: Add HTTPS Support

Let me create the configuration for you:

### Step 1: Generate Certificate

```bash
# Run this in your project root
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes -subj "/CN=localhost"
```

### Step 2: Update vite.config.ts

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

const port = process.env.PORT ? parseInt(process.env.PORT) : 3024;

// Check if certificates exist
const keyPath = path.resolve(__dirname, 'key.pem');
const certPath = path.resolve(__dirname, 'cert.pem');
const hasHttps = fs.existsSync(keyPath) && fs.existsSync(certPath);

export default defineConfig({
  plugins: [react()],
  base: './',
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: {
      buffer: 'buffer',
      path: 'path-browserify',
    },
  },
  server: {
    port: port,
    strictPort: true,
    host: '0.0.0.0',
    // Enable HTTPS if certificates exist
    ...(hasHttps && {
      https: {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath)
      }
    }),
    watch: {
      ignored: [
        '**/build-prebuilt/**',
        '**/build-flathub/**',
        '**/build-*/**',
        '**/.flatpak-builder/**',
        '**/build/**'
      ]
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: '.',
    emptyOutDir: true,
    rollupOptions: {
      external: [],
    },
  }
});
```

### Step 3: Update package.json

```json
{
  "scripts": {
    "dev": "vite",
    "server": "vite --host --port 3024",
    "server:https": "vite --host --port 3024",
    "setup-https": "openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes -subj '/CN=localhost'"
  }
}
```

### Step 4: Setup and Run

```bash
# One-time setup
npm run setup-https

# Run server (will use HTTPS if certificates exist)
npm run server

# Access via:
# https://localhost:3024 (on host machine)
# https://192.168.0.96:3024 (from other devices)
```

### Step 5: Accept Certificate

When you first access via HTTPS:
1. Browser shows "Not Secure" warning
2. Click "Advanced"
3. Click "Proceed to localhost (unsafe)" or similar
4. This is safe for local development

---

## Quick Fix: Add Informative Message

If you don't want to set up HTTPS right now, let's add a helpful message:

```typescript
{/* Show message when Directory Picker not available */}
{!(window as any).electronAPI && !('showDirectoryPicker' in window) && (
  <div className="dropdown-item" style={{ 
    opacity: 0.6, 
    cursor: 'help',
    backgroundColor: '#fff3e0',
    borderLeft: '3px solid #f57c00'
  }}>
    <div className="hdr-title">
      <FaCodeBranch /> Open Repository
      <span style={{ fontSize: '0.7em', marginLeft: '8px', color: '#f57c00' }}>
        ⚠️ Requires HTTPS
      </span>
    </div>
    <div className="hdr-desc" style={{ fontSize: '0.85em' }}>
      Use https:// or http://localhost for this feature
    </div>
  </div>
)}
```

---

## Testing

### Test Secure Context

Open browser console and run:
```javascript
console.log('Is Secure Context:', window.isSecureContext);
console.log('Has Directory Picker:', 'showDirectoryPicker' in window);
console.log('Has File Picker:', 'showOpenFilePicker' in window);
```

**Expected Results:**

| URL | isSecureContext | showDirectoryPicker |
|-----|-----------------|---------------------|
| http://localhost:3024 | `true` | `true` |
| http://127.0.0.1:3024 | `true` | `true` |
| http://192.168.0.96:3024 | `false` | `false` |
| https://192.168.0.96:3024 | `true` | `true` |

---

## Summary

**Problem:** File System Access API requires secure context (HTTPS or localhost)

**Why:** Browser security - prevents malicious sites from accessing filesystem

**Solutions:**
1. ✅ **HTTPS** (Recommended) - Works everywhere
2. ⚠️ **localhost only** - Limited to host machine
3. ⚠️ **Chrome flags** - Development only
4. ℹ️ **Show message** - Inform users

**Recommendation:** Set up HTTPS with self-signed certificate for local development.

---

**Last Updated:** December 6, 2024  
**Affects:** File System Access API features  
**Browser:** All modern browsers (security requirement)
