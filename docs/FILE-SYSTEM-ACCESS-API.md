# File System Access API Integration

## Overview

EasyEditor now supports the **File System Access API** in modern browsers (Chrome, Edge, Opera), providing near-native file access capabilities in the web version. This brings the web experience much closer to the Electron desktop app.

## What's New?

### For Web Users (Chrome/Edge/Opera)

When you open a file using **File → Open MarkDown** in a modern browser:

1. **Native File Picker**: You'll see your operating system's native file picker dialog
2. **Real File Paths**: The app can access the actual file path (not just the filename)
3. **Save to Same File**: Press `Ctrl+S` (or `Cmd+S` on Mac) to save directly back to the opened file
4. **Git Repository Detection**: If the file is in a Git repository, the app will detect it (basic detection)
5. **No Downloads Folder**: Files save directly to their original location, not your Downloads folder

### Browser Compatibility

| Feature | Chrome/Edge/Opera | Firefox | Safari | Electron App |
|---------|-------------------|---------|--------|--------------|
| Open Files | ✅ Native Picker | ⚠️ Fallback | ⚠️ Fallback | ✅ Full Support |
| Save to Same File | ✅ Yes | ❌ No | ❌ No | ✅ Yes |
| Ctrl+S Support | ✅ Yes | ❌ No | ❌ No | ✅ Yes |
| Git Detection | ⚠️ Basic | ❌ No | ❌ No | ✅ Full Support |
| Real File Paths | ✅ Yes | ❌ No | ❌ No | ✅ Yes |

**Legend:**
- ✅ Full Support
- ⚠️ Partial Support / Fallback
- ❌ Not Available

## How It Works

### Opening Files

**Electron App:**
```
File → Open MarkDown → Native OS Dialog → Full filesystem access
```

**Modern Browsers (Chrome/Edge/Opera):**
```
File → Open MarkDown → File System Access API → Native OS Dialog → Persistent file handle
```

**Older Browsers (Firefox/Safari):**
```
File → Open MarkDown → HTML File Input → Limited access (filename only)
```

### Saving Files

**With File System Access API (Chrome/Edge/Opera):**
1. Open a file using File → Open MarkDown
2. Edit the content
3. Press `Ctrl+S` or `Cmd+S`
4. File saves directly to its original location
5. No "Save As" dialog needed!

**Without File System Access API (Firefox/Safari):**
1. Use File → Save options
2. File downloads to your Downloads folder
3. Manual file management required

## Git Integration Status

### Electron App
- ✅ Full Git support
- ✅ Clone repositories
- ✅ Commit, push, pull
- ✅ Status indicators
- ✅ File tracking

### Web App (Chrome/Edge/Opera)
- ⚠️ Basic Git detection (detects `.git` folder)
- ⚠️ Shows notification when Git repo detected
- ❌ Full Git operations not yet implemented
- 🚧 Coming in future updates

### Web App (Firefox/Safari)
- ❌ No Git detection
- ❌ Use Electron app for Git features

## Technical Details

### Implementation

The implementation uses a **progressive enhancement** approach:

```typescript
// Priority 1: Electron (full native access)
if (electronAPI) {
  // Use IPC to access Node.js filesystem
}

// Priority 2: File System Access API (modern browsers)
else if (window.showOpenFilePicker) {
  // Use File System Access API
  const [fileHandle] = await window.showOpenFilePicker();
  // Store handle for later saving
}

// Priority 3: Fallback (older browsers)
else {
  // Use traditional file input
  const input = document.createElement('input');
  input.type = 'file';
}
```

### Security & Permissions

The File System Access API requires user permission for each file access:

1. **First Open**: Browser shows permission prompt
2. **Subsequent Saves**: Permission persists for the session
3. **New Session**: Permission may need to be re-granted
4. **User Control**: Users can revoke permissions anytime

### File Handle Storage

```typescript
// File handle is stored in memory during the session
let currentFileHandle: FileSystemFileHandle | null = null;

// Used for saving back to the same file
const writable = await currentFileHandle.createWritable();
await writable.write(content);
await writable.close();
```

## Usage Examples

### Example 1: Basic Workflow (Chrome)

1. Open EasyEditor in Chrome: `http://localhost:3024`
2. Click **File → Open MarkDown**
3. Select a `.md` file from your filesystem
4. Browser shows: "EasyEditor wants to read this file"
5. Click **Allow**
6. Edit your content
7. Press `Ctrl+S` to save
8. File updates in place! ✨

### Example 2: Git Repository File (Chrome)

1. Open a markdown file from a Git repository
2. App detects `.git` folder in parent directories
3. Shows toast: "Git repository detected!"
4. Edit and save with `Ctrl+S`
5. (Full Git operations coming soon)

### Example 3: Fallback Mode (Firefox)

1. Open EasyEditor in Firefox
2. Click **File → Open MarkDown**
3. Select a file (traditional file picker)
4. Edit your content
5. Use **File → Save** to download
6. File goes to Downloads folder

## Keyboard Shortcuts

| Shortcut | Electron | Chrome/Edge | Firefox/Safari |
|----------|----------|-------------|----------------|
| `Ctrl+S` / `Cmd+S` | Save to file or Git | Save to file (if opened) | Shows info message |
| `Ctrl+O` | Open file dialog | N/A | N/A |

## Limitations

### Current Limitations

1. **Git Operations**: Web version can only detect Git repos, not perform operations
2. **Directory Access**: Cannot browse entire directories (security restriction)
3. **Browser Support**: Only Chromium-based browsers support File System Access API
4. **Permission Persistence**: May need to re-grant permissions in new sessions

### Workarounds

- **For Git**: Use the Electron desktop app for full Git integration
- **For Firefox/Safari**: Use traditional save/download workflow
- **For Directories**: Use Git clone feature to work with repositories

## Future Enhancements

### Planned Features

- 🚧 Full Git operations in web browsers (using isomorphic-git)
- 🚧 Directory picker for browsing project folders
- 🚧 Multiple file management
- 🚧 File watcher for external changes
- 🚧 Conflict resolution UI

### Under Consideration

- File system sync across devices
- Collaborative editing
- Cloud storage integration

## Testing the Feature

### Test in Chrome/Edge

1. Start the server: `npm run server`
2. Open `http://localhost:3024` in Chrome
3. Create a test markdown file on your desktop
4. Use File → Open MarkDown to open it
5. Edit and press `Ctrl+S`
6. Check the file on your desktop - it should be updated!

### Test Git Detection

1. Create a test Git repository:
   ```bash
   mkdir test-repo
   cd test-repo
   git init
   echo "# Test" > README.md
   ```
2. Open `README.md` in EasyEditor (Chrome)
3. Look for "Git repository detected!" toast
4. Edit and save with `Ctrl+S`

## Troubleshooting

### "Permission denied" error
- **Cause**: Browser blocked file access
- **Solution**: Click "Allow" when prompted, or check browser permissions

### Ctrl+S shows "Use File menu to save"
- **Cause**: No file is currently open, or using unsupported browser
- **Solution**: Open a file first, or use Chrome/Edge

### Git not detected
- **Cause**: File not in a Git repository, or `.git` folder not accessible
- **Solution**: Ensure file is in a Git repo, or use Electron app

### File doesn't save
- **Cause**: File handle lost, or permission revoked
- **Solution**: Re-open the file and try again

## Comparison: Electron vs Web

| Feature | Electron App | Web (Chrome) | Web (Firefox) |
|---------|--------------|--------------|---------------|
| File Access | Full native | File System Access API | Limited (file input) |
| Save in Place | ✅ Yes | ✅ Yes | ❌ No |
| Git Operations | ✅ Full | ⚠️ Detection only | ❌ No |
| Offline | ✅ Yes | ⚠️ Partial | ⚠️ Partial |
| Installation | Required | Not required | Not required |
| Updates | Manual | Automatic | Automatic |

## Conclusion

The File System Access API integration brings significant improvements to the web version of EasyEditor, making it much more capable for users of modern browsers. While it doesn't fully replace the Electron app (especially for Git operations), it provides a much better experience than traditional web file handling.

**Recommendation:**
- **For Git workflows**: Use the Electron desktop app
- **For quick editing**: Use the web version in Chrome/Edge
- **For maximum compatibility**: Use the Electron desktop app

---

**Last Updated**: December 2024  
**Status**: ✅ Implemented and tested  
**Browser Support**: Chrome 86+, Edge 86+, Opera 72+
