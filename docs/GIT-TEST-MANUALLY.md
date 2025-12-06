


## Test Results Summary

# EasyOffice
Simple and clean All in one lite weight office tools with many functions from Calculator to Notes, Spreadsheet and Markdown
#   
   
- - -
   
✅ ❌ 🚀 🎯 🎉 ⏰ ✨   
   
Test single click save, stage, commit, push, clone   
---

## Test Results Summary

| Test | Web Remote (Clone) | Web Remote (Open) | Electron (Clone) | Electron (Open) | Web localhost (Clone) | Web localhost (Open) |Status |
|------|-------------|------------|----------------|---------------|---------------|---------------|--------|
| 1. Clone Repository | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Pending |
| 2. Open Clone File | ✅  | ✅ | ✅ | ✅ | ✅ | ✅ |  Pending |
| 3. Open Repository | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Pending |
| 4. Sub-directory Files | ✅  | ✅ | ✅ | ✅ | ✅ | ✅ | Pending |
| 5. Git Status | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Pending |
| 6. Save & Stage | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Pending |
| 7. Commit | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Pending |
| 8. Push | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Pending |
| 9. Error Handling | ⬜ | ⬜ | ✅ | ✅ | ⬜ | ⬜ | Pending |

Legend:
- ⬜ Pending
- ✅ Pass
- ❌ Fail
- ⚠️ Warning

---
   
Fixed with [Google Antigravity](https://antigravity.google "Google Antigravity")


[^research2025]: Smith, J. (2025). *Academic Paper Title*. Journal Name, 17(2), 123-140.   
   
new test - Sat Dec  6 06:35:51 PM GMT 2025   
electron - Sat 06 December 2025 19:43:56





Legend:
- ⬜ Pending
- ✅ Pass
- ❌ Fail
- ⚠️ Warning

Notes:
- Even knowing that it requested Git credential to unlock the repository, it failed to push.
- I needed to unlock Menu --> Git --> Authenticate --> Authenticate before push worked
- Recommend Push, Fetch, Save & Stage, Stage, Commit & Push buttons disabled / grayed out until authenticated
---


Network: https://192.168.0.69:3024/ open repository
```
react-dom_client.js?v=85caefde:17995 Download the React DevTools for a better development experience: https://react.dev/link/react-devtools
App.tsx:487 Running in browser mode - some features disabled
App.tsx:487 Running in browser mode - some features disabled
insertSave.ts:256 [OpenRepository] Selected directory: EasyEdit
insertSave.ts:151 [GitDetection] Found .git directory in: EasyEdit
insertSave.ts:262 [OpenRepository] Git repository detected
App.tsx:1628 [App] Repository opened: EasyEdit
App.tsx:1361 Failed to update git status: Error: No repository directory set
    at GitManager.getCurrentBranch (gitManager.ts:790:13)
    at async updateGitStatus (App.tsx:1351:22)
updateGitStatus @ App.tsx:1361
await in updateGitStatus
(anonymous) @ App.tsx:1486
react_stack_bottom_frame @ react-dom_client.js?v=85caefde:17486
runWithFiberInDEV @ react-dom_client.js?v=85caefde:1485
commitHookEffectListMount @ react-dom_client.js?v=85caefde:8460
commitHookPassiveMountEffects @ react-dom_client.js?v=85caefde:8518
commitPassiveMountOnFiber @ react-dom_client.js?v=85caefde:9887
recursivelyTraversePassiveMountEffects @ react-dom_client.js?v=85caefde:9868
commitPassiveMountOnFiber @ react-dom_client.js?v=85caefde:9984
recursivelyTraversePassiveMountEffects @ react-dom_client.js?v=85caefde:9868
commitPassiveMountOnFiber @ react-dom_client.js?v=85caefde:9899
flushPassiveEffects @ react-dom_client.js?v=85caefde:11302
(anonymous) @ react-dom_client.js?v=85caefde:11060
performWorkUntilDeadline @ react-dom_client.js?v=85caefde:36
insertSave.ts:270 [OpenRepository] Found 35 markdown files
App.tsx:1636 [App] Files found: 35

```
Local:   https://localhost:3024/ save & stage file
AND
Network: https://192.168.0.69:3024/ save & stage file
```
App.tsx:1311 Save error: Error: No repository directory set
    at GitManager.writeFile (gitManager.ts:1036:13)
    at async handleGitSave (App.tsx:1300:7)
```

Network: https://192.168.0.69:3024/ clone repository
```
react-dom_client.js?v=85caefde:17995 Download the React DevTools for a better development experience: https://react.dev/link/react-devtools
App.tsx:487 Running in browser mode - some features disabled
App.tsx:487 Running in browser mode - some features disabled
CloneModal.tsx:95 Cannot resolve full path (browser security): TypeError: Failed to execute 'resolve' on 'FileSystemDirectoryHandle': 1 argument required, but only 0 present.
    at handleSelectDirectory (CloneModal.tsx:88:57)
CloneModal.tsx:98 Selected directory handle: FileSystemDirectoryHandle
CloneModal.tsx:99 Directory name: EasyEditGit
CloneModal.tsx:100 Display path: EasyEditGit
App.tsx:1020 === Clone Submit Handler ===
App.tsx:1021 URL: https://github.com/gcclinux/EasyOffice.git
App.tsx:1022 Target Dir: EasyEditGit
App.tsx:1023 Branch: undefined
App.tsx:1031 Dir handle available: true
App.tsx:1036 Dir handle set in gitManager
App.tsx:1040 Calling gitManager.clone()...
gitManager.ts:193 === Git Clone Started ===
gitManager.ts:194 URL: https://github.com/gcclinux/EasyOffice.git
gitManager.ts:195 Target Dir: EasyEditGit
gitManager.ts:196 Is Browser: true
gitManager.ts:197 Has dirHandle: true
gitManager.ts:198 Options: Object
gitManager.ts:199 Path module type: object has join: true
gitManager.ts:204 Repo name extracted: EasyOffice
gitManager.ts:211 Clone Dir (with repo subdirectory): /EasyOffice
gitManager.ts:215 Cleaning up existing LightningFS data for: /EasyOffice
gitManager.ts:423 Could not delete directory: /EasyOffice Error: ENOENT: /EasyOffice
    at CacheFS._lookup (@isomorphic-git_lightning-fs.js?v=85caefde:409:27)
    at CacheFS.readdir (@isomorphic-git_lightning-fs.js?v=85caefde:452:24)
    at DefaultBackend.readdir (@isomorphic-git_lightning-fs.js?v=85caefde:1017:28)
    at PromisifiedFS.readdir (@isomorphic-git_lightning-fs.js?v=85caefde:1230:30)
    at PromisifiedFS.readdir (@isomorphic-git_lightning-fs.js?v=85caefde:1184:29)
    at async GitManager.recursiveDelete (gitManager.ts:402:23)
    at async GitManager.clone (gitManager.ts:217:11)
    at async handleCloneSubmit (App.tsx:1041:7)
recursiveDelete @ gitManager.ts:423
gitManager.ts:218 Cleanup completed
gitManager.ts:236 Using CORS proxy: https://cors.isomorphic-git.org
gitManager.ts:253 No credentials available - attempting anonymous clone
gitManager.ts:256 Starting git.clone()...
cors.isomorphic-git.org/github.com/gcclinux/EasyOffice.git/info/refs?service=git-upload-pack:1  Failed to load resource: the server responded with a status of 401 ()
gitManager.ts:271 === Git Clone Failed ===
clone @ gitManager.ts:271
gitManager.ts:272 Error details: HttpError: HTTP Error: 401 
    at GitRemoteHTTP.discover (isomorphic-git.js?v=85caefde:12703:17)
    at async _fetch (isomorphic-git.js?v=85caefde:13243:26)
    at async _clone (isomorphic-git.js?v=85caefde:13536:46)
    at async Object.clone (isomorphic-git.js?v=85caefde:13613:16)
    at async GitManager.clone (gitManager.ts:257:7)
    at async handleCloneSubmit (App.tsx:1041:7)
clone @ gitManager.ts:272
gitManager.ts:273 Error name: HttpError
clone @ gitManager.ts:273
gitManager.ts:274 Error message: HTTP Error: 401 
clone @ gitManager.ts:274
gitManager.ts:275 Error stack: HttpError: HTTP Error: 401 
    at GitRemoteHTTP.discover (https://192.168.0.69:3024/node_modules/.vite/deps/isomorphic-git.js?v=85caefde:12703:17)
    at async _fetch (https://192.168.0.69:3024/node_modules/.vite/deps/isomorphic-git.js?v=85caefde:13243:26)
    at async _clone (https://192.168.0.69:3024/node_modules/.vite/deps/isomorphic-git.js?v=85caefde:13536:46)
    at async Object.clone (https://192.168.0.69:3024/node_modules/.vite/deps/isomorphic-git.js?v=85caefde:13613:16)
    at async GitManager.clone (https://192.168.0.69:3024/src/gitManager.ts:191:7)
    at async handleCloneSubmit (https://192.168.0.69:3024/src/App.tsx:805:7)
clone @ gitManager.ts:275
App.tsx:1063 === Clone Failed in Handler ===
handleCloneSubmit @ App.tsx:1063
App.tsx:1064 Error: Error: Failed to clone repository: Authentication failed (HTTP 401): This is a private repository. Please set up Git credentials first (Git menu → Setup Credentials) or use a public repository.
    at GitManager.clone (gitManager.ts:290:13)
    at async handleCloneSubmit (App.tsx:1041:7)
handleCloneSubmit @ App.tsx:1064

```