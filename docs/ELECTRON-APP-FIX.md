# Electron App HTTPS Compatibility Fix

## Problem
After implementing HTTPS support for the web version, running `npm run app` failed to launch the Electron app. The issue was:

```
npm run app
> concurrently "vite" "wait-on http://localhost:3024 && electron ."

🔐 HTTPS certificates found - server will use HTTPS
➜  Local:   https://localhost:3024/
➜  Network: https://192.168.0.96:3024/

wait-on http://localhost:3024 && electron .  # ❌ Waiting forever for HTTP
```

The Vite server was using HTTPS (because certificates exist), but `wait-on` was waiting for HTTP, causing a deadlock.

## Solution
Modified `vite.config.ts` to detect when running in Electron mode and force HTTP for compatibility:

```typescript
// Detect Electron app mode
const isElectronMode = process.env.npm_lifecycle_event === 'app';
const useHttps = hasHttps && !isElectronMode;

if (isElectronMode) {
  console.log('🖥️  Electron mode - using HTTP for compatibility');
} else if (useHttps) {
  console.log('🔐 HTTPS certificates found - server will use HTTPS');
}
```

## How It Works

### Environment Detection
When you run `npm run app`, Node.js sets `process.env.npm_lifecycle_event = 'app'`. The Vite config checks this and disables HTTPS for Electron compatibility.

### Server Behavior
| Command | Mode | Protocol | Use Case |
|---------|------|----------|----------|
| `npm run app` | Electron | HTTP | Desktop app development |
| `npm run dev` | Web | HTTP/HTTPS* | Web development |
| `npm run server` | Web | HTTP/HTTPS* | Network access |

*Uses HTTPS if certificates exist, HTTP otherwise

## Testing
```bash
# Should show "Electron mode - using HTTP" and launch app
npm run app

# Should show "HTTPS certificates found" (if certs exist)
npm run dev

# Should work on network with HTTPS
npm run server
```

## Key Points
- ✅ Electron app always uses HTTP (no changes needed to `package.json`)
- ✅ Web version uses HTTPS when certificates exist
- ✅ No breaking changes to existing functionality
- ✅ Automatic detection - no manual configuration needed

## Related Files
- `vite.config.ts` - Server configuration with mode detection
- `package.json` - Scripts remain unchanged
- `setup-https.sh` - HTTPS certificate generation

## Status
✅ **FIXED** - Electron app launches correctly with `npm run app`
