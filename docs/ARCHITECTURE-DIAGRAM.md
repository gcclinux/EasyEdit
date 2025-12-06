# Architecture Diagram: File System Access API

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         EasyEdit Application                     │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                      User Interface                         │ │
│  │  • Menu Bar (File → Open/Save)                             │ │
│  │  • Editor Panel                                            │ │
│  │  • Preview Panel                                           │ │
│  │  • Toast Notifications                                     │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              │                                   │
│                              ▼                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              File Handling Logic (insertSave.ts)           │ │
│  │                                                            │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │ │
│  │  │  Electron    │  │  Modern Web  │  │  Legacy Web  │   │ │
│  │  │   Handler    │  │   Handler    │  │   Handler    │   │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘   │ │
│  │         │                  │                  │           │ │
│  └─────────┼──────────────────┼──────────────────┼───────────┘ │
│            │                  │                  │              │
└────────────┼──────────────────┼──────────────────┼──────────────┘
             │                  │                  │
             ▼                  ▼                  ▼
    ┌────────────────┐  ┌────────────────┐  ┌────────────────┐
    │  Electron IPC  │  │ File System    │  │  HTML File     │
    │  + Node.js FS  │  │ Access API     │  │  Input         │
    └────────────────┘  └────────────────┘  └────────────────┘
             │                  │                  │
             ▼                  ▼                  ▼
    ┌────────────────┐  ┌────────────────┐  ┌────────────────┐
    │  Native File   │  │  Browser File  │  │  Temporary     │
    │  System        │  │  Handle        │  │  File Object   │
    │  • Full Access │  │  • Persistent  │  │  • Read Only   │
    │  • Git Support │  │  • Writable    │  │  • One-time    │
    └────────────────┘  └────────────────┘  └────────────────┘
```

## Decision Flow

```
                    User Action: Open File
                            │
                            ▼
                    ┌───────────────┐
                    │ Is Electron?  │
                    └───────┬───────┘
                            │
                ┌───────────┴───────────┐
                │                       │
               Yes                     No
                │                       │
                ▼                       ▼
    ┌─────────────────────┐   ┌──────────────────┐
    │  Use Electron IPC   │   │ Check Browser    │
    │  • Native Dialog    │   │ Capabilities     │
    │  • Full FS Access   │   └────────┬─────────┘
    │  • Git Integration  │            │
    └─────────┬───────────┘            │
              │              ┌─────────┴──────────┐
              │              │                    │
              │         Has FS API?          No FS API
              │              │                    │
              │             Yes                   │
              │              │                    ▼
              │              ▼          ┌──────────────────┐
              │    ┌──────────────────┐ │ Use File Input   │
              │    │ showOpenFile     │ │ • Browser Dialog │
              │    │ Picker()         │ │ • Limited Access │
              │    │ • Native Dialog  │ │ • Download Only  │
              │    │ • File Handle    │ └──────────────────┘
              │    │ • Persistent     │
              │    └────────┬─────────┘
              │             │
              │             ▼
              │    ┌──────────────────┐
              │    │ Detect Git Repo  │
              │    │ • Walk Up Tree   │
              │    │ • Find .git      │
              │    │ • Show Toast     │
              │    └────────┬─────────┘
              │             │
              └─────────────┴─────────────┐
                                          │
                                          ▼
                              ┌────────────────────┐
                              │ Load File Content  │
                              │ • Read File        │
                              │ • Set Editor       │
                              │ • Store Handle     │
                              └────────┬───────────┘
                                       │
                                       ▼
                              ┌────────────────────┐
                              │ User Edits Content │
                              └────────┬───────────┘
                                       │
                                       ▼
                              ┌────────────────────┐
                              │ User Presses Ctrl+S│
                              └────────┬───────────┘
                                       │
                    ┌──────────────────┴──────────────────┐
                    │                                     │
              Is Git Repo?                         Has File Handle?
                    │                                     │
                   Yes                                   Yes
                    │                                     │
                    ▼                                     ▼
        ┌────────────────────┐              ┌────────────────────┐
        │ Save via Git       │              │ Save via FS API    │
        │ • Stage Changes    │              │ • createWritable() │
        │ • Commit           │              │ • write()          │
        │ • Push (optional)  │              │ • close()          │
        └────────────────────┘              └────────────────────┘
                    │                                     │
                    └──────────────────┬──────────────────┘
                                       │
                                       ▼
                              ┌────────────────────┐
                              │ Show Success Toast │
                              │ "File saved!"      │
                              └────────────────────┘
```

## Component Interaction

```
┌─────────────────────────────────────────────────────────────────┐
│                           App.tsx                                │
│                                                                  │
│  • State Management (currentFilePath, isGitRepo, etc.)          │
│  • Event Handlers (handleOpenClick, Ctrl+S)                     │
│  • UI Components (Menu, Editor, Preview)                        │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    Event: File → Open                       │ │
│  └──────────────────────────┬─────────────────────────────────┘ │
│                             │                                    │
│                             ▼                                    │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              Call: handleOpenClick()                        │ │
│  │              • Pass setEditorContent callback               │ │
│  │              • Pass onGitRepoDetected callback              │ │
│  └──────────────────────────┬─────────────────────────────────┘ │
└────────────────────────────┼──────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                       insertSave.ts                              │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              handleOpenClick(callbacks)                     │ │
│  │                                                             │ │
│  │  1. Check environment (Electron/Web)                       │ │
│  │  2. Choose appropriate method                              │ │
│  │  3. Open file picker                                       │ │
│  │  4. Read file content                                      │ │
│  │  5. Store file handle (if FS API)                          │ │
│  │  6. Detect Git repo (if FS API)                            │ │
│  │  7. Call callbacks with data                               │ │
│  └──────────────────────────┬─────────────────────────────────┘ │
│                             │                                    │
│                             ▼                                    │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              Return: File Content + Metadata                │ │
│  │              • content: string                              │ │
│  │              • filePath: string                             │ │
│  │              • fileHandle: FileSystemFileHandle (if FS API) │ │
│  └──────────────────────────┬─────────────────────────────────┘ │
└────────────────────────────┼──────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                           App.tsx                                │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              Callback: setEditorContent()                   │ │
│  │              • Update editor state                          │ │
│  │              • Set currentFilePath                          │ │
│  │              • Update UI                                    │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              Callback: onGitRepoDetected()                  │ │
│  │              • Set isGitRepo = true                         │ │
│  │              • Show toast notification                      │ │
│  │              • Enable Git features (future)                 │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Save Flow

```
                    User Presses Ctrl+S
                            │
                            ▼
                    ┌───────────────┐
                    │  App.tsx      │
                    │  Keyboard     │
                    │  Handler      │
                    └───────┬───────┘
                            │
                ┌───────────┴───────────┐
                │                       │
          Is Git Repo?            Has File Handle?
                │                       │
               Yes                     Yes
                │                       │
                ▼                       ▼
    ┌─────────────────────┐   ┌──────────────────┐
    │  handleGitSave()    │   │ saveToCurrentFile│
    │  • Stage file       │   │ • Get handle     │
    │  • Commit changes   │   │ • Create writable│
    │  • Push (optional)  │   │ • Write content  │
    │  • Update status    │   │ • Close stream   │
    └─────────┬───────────┘   └────────┬─────────┘
              │                        │
              └────────────┬───────────┘
                           │
                           ▼
                  ┌────────────────┐
                  │ Show Toast     │
                  │ "File saved!"  │
                  └────────────────┘
```

## Data Flow

```
┌──────────────┐
│  User Action │
└──────┬───────┘
       │
       ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  UI Layer    │────▶│ Logic Layer  │────▶│  API Layer   │
│  (App.tsx)   │     │(insertSave.ts)│     │ (Browser/OS) │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       │                    │                    │
       │                    │                    │
       ▼                    ▼                    ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  State       │     │  File Handle │     │  File System │
│  Updates     │     │  Storage     │     │  Operations  │
└──────────────┘     └──────────────┘     └──────────────┘
```

## Browser Compatibility Matrix

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser Support                          │
├─────────────┬──────────┬──────────┬──────────┬─────────────┤
│   Feature   │ Electron │  Chrome  │ Firefox  │   Safari    │
├─────────────┼──────────┼──────────┼──────────┼─────────────┤
│ Open File   │    ✅    │    ✅    │    ⚠️    │     ⚠️      │
│ Native      │    ✅    │    ✅    │    ❌    │     ❌      │
│ Picker      │          │          │          │             │
├─────────────┼──────────┼──────────┼──────────┼─────────────┤
│ Save File   │    ✅    │    ✅    │    ❌    │     ❌      │
│ In Place    │          │          │          │             │
├─────────────┼──────────┼──────────┼──────────┼─────────────┤
│ Ctrl+S      │    ✅    │    ✅    │    ❌    │     ❌      │
│ Support     │          │          │          │             │
├─────────────┼──────────┼──────────┼──────────┼─────────────┤
│ Git         │    ✅    │    ⚠️    │    ❌    │     ❌      │
│ Detection   │  (Full)  │ (Basic)  │          │             │
├─────────────┼──────────┼──────────┼──────────┼─────────────┤
│ Git         │    ✅    │    ❌    │    ❌    │     ❌      │
│ Operations  │          │ (Future) │          │             │
└─────────────┴──────────┴──────────┴──────────┴─────────────┘

Legend:
  ✅ Full Support
  ⚠️ Partial Support / Fallback
  ❌ Not Supported
```

## Security Model

```
┌─────────────────────────────────────────────────────────────┐
│                    Security Layers                          │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  Layer 1: Browser Sandbox                             │ │
│  │  • Isolates web content from OS                       │ │
│  │  • Prevents unauthorized file access                  │ │
│  └───────────────────────────────────────────────────────┘ │
│                           │                                 │
│                           ▼                                 │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  Layer 2: File System Access API Permissions          │ │
│  │  • User must explicitly grant access                  │ │
│  │  • Per-file permissions                               │ │
│  │  • Can be revoked anytime                             │ │
│  └───────────────────────────────────────────────────────┘ │
│                           │                                 │
│                           ▼                                 │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  Layer 3: Application Logic                           │ │
│  │  • Validates file types                               │ │
│  │  • Handles errors gracefully                          │ │
│  │  • Provides user feedback                             │ │
│  └───────────────────────────────────────────────────────┘ │
│                           │                                 │
│                           ▼                                 │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  Layer 4: OS File System Permissions                  │ │
│  │  • Standard OS-level permissions                      │ │
│  │  • Read/write access control                          │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

**Note**: These diagrams provide a visual overview of the File System Access API implementation. For detailed code-level documentation, see the source files and other documentation.
