# HTTPS Setup Guide - Enable "Open Repository" on Network

## Problem Solved ✅

**Issue:** "Open Repository" option doesn't appear when accessing via IP address (http://192.168.0.96:3024)

**Cause:** File System Access API requires a **secure context** (HTTPS or localhost)

**Solution:** Set up HTTPS with a self-signed certificate

---

## Quick Setup (3 Steps)

### Step 1: Generate Certificate

```bash
npm run setup-https
```

Or manually:
```bash
./setup-https.sh
```

### Step 2: Restart Server

```bash
npm run server
```

The server will automatically detect the certificates and use HTTPS!

### Step 3: Access via HTTPS

**On host machine:**
```
https://localhost:3024
```

**From other devices on network:**
```
https://192.168.0.96:3024
(replace with your actual IP)
```

---

## What Changed

### 1. Added HTTPS Support to vite.config.ts

The server now automatically detects if `key.pem` and `cert.pem` exist:
- ✅ **Certificates found** → Uses HTTPS
- ℹ️ **No certificates** → Uses HTTP (localhost only)

### 2. Added Setup Script

`setup-https.sh` - Generates self-signed certificate with one command

### 3. Added Visual Feedback

When accessing via HTTP (non-localhost), you'll see:

```
┌─────────────────────────────────────┐
│ 🔀 Open Repository  ⚠️ HTTPS Required│
│ Use https:// or http://localhost    │
│ for this feature                    │
└─────────────────────────────────────┘
```

---

## How It Works

### Secure Context Requirements

| URL | Secure Context | Directory Picker Available |
|-----|----------------|----------------------------|
| `http://localhost:3024` | ✅ Yes | ✅ Yes |
| `http://127.0.0.1:3024` | ✅ Yes | ✅ Yes |
| `http://192.168.0.96:3024` | ❌ No | ❌ No |
| `https://192.168.0.96:3024` | ✅ Yes | ✅ Yes |

### Why This Matters

The File System Access API is a powerful feature that gives web apps access to your filesystem. For security, browsers only enable it in secure contexts:

- **HTTPS** - Encrypted connection, verified identity
- **localhost** - Local development, trusted environment

This prevents malicious websites from accessing your files.

---

## First-Time HTTPS Access

When you first access via HTTPS with a self-signed certificate:

### Chrome/Edge

1. You'll see: "Your connection is not private"
2. Click **"Advanced"**
3. Click **"Proceed to localhost (unsafe)"**
4. ✅ Done! Certificate is now trusted for this session

### Firefox

1. You'll see: "Warning: Potential Security Risk Ahead"
2. Click **"Advanced"**
3. Click **"Accept the Risk and Continue"**
4. ✅ Done!

### Why the Warning?

Self-signed certificates aren't verified by a Certificate Authority (CA). This is normal for local development and completely safe when you generated the certificate yourself.

---

## Testing

### Test 1: Check Secure Context

Open browser console (F12) and run:

```javascript
console.log('Secure Context:', window.isSecureContext);
console.log('Directory Picker:', 'showDirectoryPicker' in window);
```

**Expected Results:**

**HTTP (IP address):**
```
Secure Context: false
Directory Picker: false
```

**HTTPS (any address) or HTTP (localhost):**
```
Secure Context: true
Directory Picker: true
```

### Test 2: Access from Another Device

1. Find your IP address:
   ```bash
   # Linux/Mac
   ip addr show
   # or
   ifconfig
   
   # Windows
   ipconfig
   ```

2. On another device (phone, tablet, another computer):
   - Open browser
   - Go to `https://YOUR_IP:3024`
   - Accept certificate warning
   - ✅ "Open Repository" should now appear!

---

## Troubleshooting

### Certificate Generation Failed

**Problem:** `openssl: command not found`

**Solution:** Install OpenSSL:
```bash
# Ubuntu/Debian
sudo apt-get install openssl

# macOS
brew install openssl

# Windows
# Download from: https://slproweb.com/products/Win32OpenSSL.html
```

### Server Won't Start with HTTPS

**Problem:** Port 3024 already in use or permission denied

**Solution:**
```bash
# Check what's using the port
lsof -i :3024

# Kill the process
kill -9 <PID>

# Or use a different port
PORT=3025 npm run server
```

### Certificate Not Trusted

**Problem:** Browser keeps showing warning

**Solution:** This is normal for self-signed certificates. You need to accept it each time you:
- Use a new browser
- Clear browser data
- Use incognito/private mode

For production, use a real certificate from Let's Encrypt or a CA.

### "Open Repository" Still Not Showing

**Problem:** Feature still unavailable after HTTPS setup

**Solution:**
1. Verify you're accessing via `https://` (not `http://`)
2. Check browser console for errors
3. Verify certificates exist: `ls -la key.pem cert.pem`
4. Restart the server
5. Hard refresh browser (Ctrl+Shift+R)

---

## Production Deployment

For production, **never use self-signed certificates**. Instead:

### Option 1: Let's Encrypt (Free)

```bash
# Install certbot
sudo apt-get install certbot

# Get certificate
sudo certbot certonly --standalone -d yourdomain.com

# Certificates will be in:
# /etc/letsencrypt/live/yourdomain.com/
```

### Option 2: Cloud Provider

Most cloud providers (AWS, Azure, Google Cloud, Netlify, Vercel) handle HTTPS automatically.

### Option 3: Reverse Proxy

Use nginx or Apache as a reverse proxy with HTTPS:

```nginx
server {
    listen 443 ssl;
    server_name yourdomain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://localhost:3024;
    }
}
```

---

## Security Notes

### Self-Signed Certificates

✅ **Safe for:**
- Local development
- Internal networks
- Testing

❌ **NOT safe for:**
- Production websites
- Public access
- Sensitive data

### Certificate Files

**Important:** Add to `.gitignore`:
```
key.pem
cert.pem
```

Never commit private keys to version control!

---

## Alternative: Chrome Flags (Not Recommended)

If you really can't use HTTPS, you can enable insecure origins in Chrome:

1. Go to: `chrome://flags/#unsafely-treat-insecure-origin-as-secure`
2. Add: `http://192.168.0.96:3024`
3. Restart Chrome

⚠️ **Warning:** This is a security risk and only works in Chrome. Not recommended.

---

## Summary

### What You Get with HTTPS

✅ "Open Repository" works on all devices  
✅ All File System Access API features enabled  
✅ Secure connection  
✅ Modern browser APIs available  
✅ Better development experience  

### Setup Commands

```bash
# One-time setup
npm run setup-https

# Start server (auto-detects HTTPS)
npm run server

# Access
https://localhost:3024
https://YOUR_IP:3024
```

### Files Created

- `key.pem` - Private key (keep secret!)
- `cert.pem` - Certificate (public)
- `setup-https.sh` - Setup script

---

## Quick Reference

| Scenario | URL | Works? |
|----------|-----|--------|
| Local development | `http://localhost:3024` | ✅ Yes |
| Same machine | `http://127.0.0.1:3024` | ✅ Yes |
| Network (HTTP) | `http://192.168.x.x:3024` | ❌ No |
| Network (HTTPS) | `https://192.168.x.x:3024` | ✅ Yes |
| Production | `https://yourdomain.com` | ✅ Yes |

---

**Last Updated:** December 6, 2024  
**Status:** ✅ Implemented and Ready  
**Recommendation:** Run `npm run setup-https` for best experience
