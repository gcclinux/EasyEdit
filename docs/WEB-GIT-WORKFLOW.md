# Web Git Workflow Guide

## Important: How to Use Git Features in the Browser

### ⚠️ Current Limitation

When you open a **single file** in the browser using "File → Open MarkDown", the browser **cannot** automatically detect if it's in a Git repository. This is a browser security limitation - the File System Access API doesn't provide access to parent directories.

### ✅ Solution: Use "Open Repository"

To use Git features in the browser, you need to:

1. **Open the entire repository folder** instead of a single file
2. This gives the app permission to access the `.git` folder
3. Then you can use all Git features (save, stage, commit, push)

---

## Step-by-Step: Correct Workflow

### Option 1: Open Repository (Recommended for Git)

**When to use:** You want to work with Git features (commit, push, etc.)

1. Open EasyEditor in Chrome/Edge: `http://localhost:3024`
2. Click **File → Open Repository** (only visible in Chrome/Edge)
3. Select your Git repository folder (the one containing `.git`)
4. Browser asks for permission - click **"View files"** or **"Allow"**
5. App detects Git repository ✅
6. File browser shows all markdown files
7. Select a file to edit
8. Edit and press **Ctrl+S** to save
9. Use **Git → Save & Stage** to stage changes
10. Use **Git → Commit** to commit
11. Use **Git → Push** to push to remote

**Result:** Full Git integration works! 🎉

---

### Option 2: Open Single File (Quick Edit)

**When to use:** You just want to quickly edit a file without Git features

1. Open EasyEditor in Chrome/Edge: `http://localhost:3024`
2. Click **File → Open MarkDown**
3. Select any markdown file
4. Edit the content
5. Press **Ctrl+S** to save
6. File saves to its original location ✅

**Result:** File editing works, but no Git features

**Note:** You'll see a message: "File opened! For Git features, use File → Open Repository"

---

## Comparison

| Feature | Open Repository | Open Single File |
|---------|----------------|------------------|
| **File Editing** | ✅ Yes | ✅ Yes |
| **Save with Ctrl+S** | ✅ Yes | ✅ Yes |
| **Git Detection** | ✅ Yes | ❌ No |
| **Save & Stage** | ✅ Yes | ❌ No |
| **Commit** | ✅ Yes | ❌ No |
| **Push/Pull** | ✅ Yes | ❌ No |
| **File Browser** | ✅ Yes | ❌ No |
| **Multiple Files** | ✅ Yes | ❌ No |

---

## Why This Limitation Exists

### Browser Security

The File System Access API is designed with security in mind:

1. **Single File Access**: When you pick a file, you only get access to that file
2. **No Parent Access**: Browser doesn't allow accessing parent directories
3. **Explicit Permission**: You must explicitly grant access to folders

This prevents malicious websites from:
- Scanning your entire filesystem
- Accessing files you didn't explicitly select
- Reading sensitive data from parent directories

### The `getParent()` Problem

The File System Access API has a proposed `getParent()` method that would allow walking up the directory tree, but:

- ❌ Not yet implemented in any browser
- ❌ Still in proposal stage
- ❌ May never be implemented due to security concerns

**Current Status:**
```javascript
// This doesn't work yet:
const parent = await fileHandle.getParent(); // undefined
```

---

## Electron App vs Web App

### Electron App (Desktop)

**Advantages:**
- ✅ Full filesystem access
- ✅ Can detect Git repo from any file
- ✅ No permission prompts
- ✅ All features work seamlessly

**How it works:**
- Uses Node.js filesystem APIs
- Can walk up directory tree freely
- Finds `.git` folder automatically

### Web App (Browser)

**Advantages:**
- ✅ No installation needed
- ✅ Works anywhere
- ✅ Always up-to-date

**Limitations:**
- ⚠️ Must open repository folder for Git features
- ⚠️ Permission prompts required
- ⚠️ Single file = no Git detection

---

## Recommended Workflows

### For Git-Heavy Work
**Use:** Electron Desktop App
- Full Git integration
- No permission prompts
- Seamless experience

### For Quick Edits (No Git)
**Use:** Web App + "Open MarkDown"
- Fast and convenient
- No installation
- Ctrl+S works

### For Web Git Work
**Use:** Web App + "Open Repository"
- Full Git features in browser
- No installation needed
- One-time permission per session

---

## Troubleshooting

### "No file selected" when clicking Save & Stage

**Problem:** You opened a single file, not a repository

**Solution:**
1. Close the file
2. Use **File → Open Repository**
3. Select the repository folder
4. Select the file from the file browser
5. Now Git features will work

### "Git repository detected" but Git features don't work

**Problem:** Detection worked but repository wasn't properly initialized

**Solution:**
1. Use **File → Open Repository** instead
2. This ensures proper repository access

### Permission denied errors

**Problem:** Browser blocked access

**Solution:**
1. Click "Allow" or "View files" when prompted
2. Check browser permissions in settings
3. Try opening the repository again

---

## Future Improvements

### Planned Enhancements

1. **Better Detection**: Improve Git detection when possible
2. **Clearer Messaging**: Better guidance for users
3. **Automatic Prompts**: Suggest "Open Repository" when Git features needed
4. **Browser Support**: Monitor `getParent()` API progress

### Browser API Progress

We're monitoring these proposals:
- File System Access API `getParent()` method
- Enhanced directory access permissions
- Improved file system integration

---

## Quick Reference

### I want to...

**Edit a file quickly (no Git):**
→ File → Open MarkDown → Select file → Edit → Ctrl+S

**Work with Git in browser:**
→ File → Open Repository → Select repo folder → Select file → Edit → Git features

**Use full Git features:**
→ Use Electron Desktop App

**Save my work:**
→ Ctrl+S (works in all modes)

**Commit changes:**
→ Must use "Open Repository" first, then Git → Commit

**Push to remote:**
→ Must use "Open Repository" first, then Git → Push

---

## Summary

✅ **Single File Opening**: Works great for quick edits, Ctrl+S saves  
⚠️ **Git Features**: Require opening the repository folder  
✅ **Electron App**: Full features, no limitations  
✅ **Web App**: Great for quick work, use "Open Repository" for Git  

**Remember:** For Git features in the browser, always use **"File → Open Repository"** instead of opening individual files!

---

**Last Updated:** December 6, 2024  
**Applies to:** EasyEditor v1.4.6+  
**Browser:** Chrome 86+, Edge 86+, Opera 72+
