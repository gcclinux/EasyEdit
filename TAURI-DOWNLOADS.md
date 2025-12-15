# EasyEdit 1.5.1 - Tauri Downloads

## Windows

### MSI Installer (Recommended)
- **[easyedit_1.5.1_x64_en-US-tauri.msi](https://github.com/gcclinux/EasyEdit/releases/download/1.5.1/easyedit_1.5.1_x64_en-US-tauri.msi)**
  - Size: 7.7 MB

### NSIS Installer
- **[easyedit_1.5.1_x64-setup-tauri.exe](https://github.com/gcclinux/EasyEdit/releases/download/1.5.1/easyedit_1.5.1_x64-setup-tauri.exe)**
  - Size: 5.85 MB

### Portable
- **[easyedit_portable-1.5.1-tauri.exe](https://github.com/gcclinux/EasyEdit/releases/download/1.5.1/easyedit_portable-1.5.1-tauri.exe)**
  - Size: 16.6 MB

## Linux

### Debian/Ubuntu (.deb)
- **[easyedit_1.5.1_amd64-tauri.deb](https://github.com/gcclinux/EasyEdit/releases/download/1.5.1/easyedit_1.5.1_amd64-tauri.deb)**
  - Size: 7.85 MB

### AppImage (Universal Linux)
- **[easyedit_1.5.1_amd64-tauri.AppImage](https://github.com/gcclinux/EasyEdit/releases/download/1.5.1/easyedit_1.5.1_amd64-tauri.AppImage)**
  - Size: 78 MB

### RPM (Red Hat/Fedora/SUSE)
- **[easyedit-1.5.1-1.x86_64-tauri.rpm](https://github.com/gcclinux/EasyEdit/releases/download/1.5.1/easyedit-1.5.1-1.x86_64-tauri.rpm)**
  - Size: 7.85 MB
---

## Key Features in Tauri Version

✅ **File Association Support** - Right-click markdown files and "Open with EasyEdit"  
✅ **Command Line Support** - Open files via `easyedit file.md`  
✅ **Smaller File Size** - Significantly smaller than Electron version  
✅ **Better Performance** - Native Rust backend with web frontend  
✅ **Cross-Platform** - Windows, Linux, and macOS support  

## Installation Notes

- **Windows**: Use the MSI installer for best file association support
- **Linux**: AppImage requires no installation, just make executable and run
- **Portable**: No installation required, runs from any location

## File Association Fix

The Tauri version now properly supports file associations on Windows. After installing via MSI, you can:
1. Right-click any `.md` file in Windows Explorer
2. Select "Open with EasyEdit" from the context menu
3. The file will open directly in EasyEdit