# Git Integration Feature Plan

**EasyEdit Git Integration using isomorphic-git**

Date: December 5, 2025

## Overview

Add comprehensive Git functionality to EasyEdit using `isomorphic-git`, enabling users to clone, edit, commit, and push markdown repositories without external Git installation. This self-contained solution provides full version control capabilities directly within the application.

## Implementation Phases

### Phase 1: Basic Git Operations UI

**Objective:** Add Git dropdown menu with core operation buttons

**Tasks:**
1. Install dependencies: `npm install isomorphic-git`
2. Create Git infrastructure files:
   - `src/gitManager.ts` - Wrapper for Git operations
   - `src/components/GitDropdown.tsx` - Git menu UI component
3. Update `src/App.tsx`:
   - Add Git dropdown state management (following pattern of existing dropdowns)
   - Import Git icon from `react-icons/fa` (e.g., `FaGitAlt`, `FaCodeBranch`)
   - Add Git dropdown button in menubar between File and existing buttons
   - Add handlers for Git operations (clone, pull, push, fetch, commit)
4. Create `src/components/GitDropdown.tsx`:
   - Style consistently with existing dropdowns (e.g., `FormatDropdown.tsx`, `MermaidDropdown.tsx`)
   - Add buttons: Clone, Pull, Push, Fetch, Commit
   - Follow existing dropdown pattern with `hdr-title` and `hdr-desc` divs

**Files to Create:**
- `src/gitManager.ts`
- `src/components/GitDropdown.tsx`

**Files to Modify:**
- `src/App.tsx`
- `package.json` (dependencies)

---

### Phase 2: Clone and File Operations

**Objective:** Enable repository cloning and file management

**Tasks:**
1. Create clone modal component:
   - Follow pattern of `src/components/PasswordModal.tsx`
   - Add URL input field for repository URL
   - Add optional branch selection (default: main/master)
   - Add target directory selector
2. Implement `gitManager.ts` clone operation:
   - Use `isomorphic-git` clone function
   - Support HTTPS URLs (GitHub, GitLab, Bitbucket)
   - Add progress indicator for clone operation
3. Add file browser after clone:
   - Recursively scan cloned directory for markdown files
   - Display file tree or list with relative paths
   - Click to load file into editor
4. Implement Git-aware save operation:
   - Add "Save to Repo" option in Git dropdown
   - Implement Ctrl+S handler for Git-tracked files
   - Auto-detect if current file is in a Git repository
   - Write changes to file system
5. Update keyboard event handlers in `App.tsx`:
   - Add Ctrl+S detection
   - Call Git save when in repository context

**Files to Create:**
- `src/components/CloneModal.tsx`
- `src/components/cloneModal.css`
- `src/components/FileBrowserModal.tsx`

**Files to Modify:**
- `src/gitManager.ts` (add clone, getRepoFiles, saveFile methods)
- `src/App.tsx` (add modals, keyboard handlers)
- `src/components/GitDropdown.tsx` (add Clone and Save buttons)

---

### Phase 3: Credential Storage

**Objective:** Securely store Git credentials for seamless operations

**Tasks:**
1. Create credential manager:
   - Follow encryption pattern from `src/cryptoHandler.ts` and `src/stpFileCrypter.ts`
   - Store credentials in encrypted localStorage
   - Support username/token authentication (HTTPS)
2. Add credential input modal:
   - Username field
   - Personal Access Token field (password input)
   - "Remember credentials" checkbox
   - "Clear saved credentials" button in settings
3. Integrate credential retrieval:
   - Auto-populate credentials during push/pull/fetch operations
   - Prompt for credentials only if not saved or if authentication fails
   - Support re-authentication on token expiration
4. Add credential management UI:
   - Settings option in Git dropdown
   - View saved username (mask token)
   - Clear credentials button

**Files to Create:**
- `src/gitCredentialManager.ts`
- `src/components/GitCredentialsModal.tsx`
- `src/components/gitCredentialsModal.css`

**Files to Modify:**
- `src/gitManager.ts` (integrate credential manager)
- `src/components/GitDropdown.tsx` (add Settings button)

---

### Phase 4: Enhanced Git Features

**Objective:** Add advanced features for better Git workflow

**Tasks:**
1. **Git Status Indicator:**
   - Show current branch name in UI (top bar or Git button)
   - Display modified files count badge
   - Color-code status (green=clean, yellow=modified, red=conflict)
2. **Commit Message Modal:**
   - Multi-line text input for commit message
   - Validation (minimum length, non-empty)
   - Show list of modified files to be committed
   - Optional: Stage specific files (checkboxes)
3. **Conflict Detection:**
   - Detect merge conflicts during pull operations
   - Display clear error message
   - Block conflicting operations with guidance
   - Future enhancement: Add manual conflict resolution UI
4. **Repository Initialization:**
   - "Init New Repo" option in Git dropdown
   - Create `.git` directory in selected folder
   - Add initial commit option
5. **Commit History Viewer:**
   - Modal showing recent commits (last 10-20)
   - Display: commit hash (short), author, date, message
   - Click commit to view details
   - Optional: Diff viewer for file changes
6. **`.gitignore` Template:**
   - Add template insertion in Insert dropdown
   - Common patterns for markdown projects
   - Node.js, OS-specific files, IDE files

**Files to Create:**
- `src/components/CommitModal.tsx`
- `src/components/commitModal.css`
- `src/components/GitStatusIndicator.tsx`
- `src/components/GitHistoryModal.tsx`
- `src/components/gitHistoryModal.css`
- `src/templates/gitignore.ts`

**Files to Modify:**
- `src/gitManager.ts` (add status, init, log methods)
- `src/components/GitDropdown.tsx` (add Init, History, Status buttons)
- `src/App.tsx` (add status indicator component)
- `src/components/InsertDropdown.tsx` (add .gitignore template option)

---

## Technical Architecture

### Git Manager (`gitManager.ts`)

```typescript
class GitManager {
  private repoDir: string;
  private currentBranch: string;
  
  // Core operations
  async clone(url: string, dir: string, options?: CloneOptions): Promise<void>
  async pull(): Promise<void>
  async push(): Promise<void>
  async fetch(): Promise<void>
  async commit(message: string, files?: string[]): Promise<void>
  
  // File operations
  async add(filepath: string): Promise<void>
  async status(): Promise<GitStatus>
  async getRepoFiles(extensions?: string[]): Promise<string[]>
  
  // Repository management
  async init(dir: string): Promise<void>
  async getCurrentBranch(): Promise<string>
  async listBranches(): Promise<string[]>
  async checkout(branch: string): Promise<void>
  
  // History
  async log(count?: number): Promise<Commit[]>
}
```

### Credential Manager (`gitCredentialManager.ts`)

```typescript
interface GitCredentials {
  username: string;
  token: string;
  remoteUrl?: string;
}

class GitCredentialManager {
  // Encrypt and store credentials
  async saveCredentials(creds: GitCredentials): Promise<void>
  
  // Decrypt and retrieve credentials
  async getCredentials(remoteUrl?: string): Promise<GitCredentials | null>
  
  // Clear stored credentials
  async clearCredentials(): Promise<void>
  
  // Check if credentials exist
  hasCredentials(): boolean
}
```

---

## Further Considerations

### 1. Repository Context Tracking
**Question:** Should EasyEdit track single repository per session or support multiple repositories?

**Recommendation:** 
- Phase 1-3: Single active repository with clear indicator in UI
- Phase 4+: Support multiple repositories with dropdown selector
- Show current repository path in status bar

### 2. Conflict Resolution Strategy
**Question:** For merge conflicts during pull, how should the app handle them?

**Options:**
- A) Show diff view with manual resolution
- B) Auto-accept local/remote changes
- C) Block operation with error message

**Recommendation:**
- Phase 1-3: Block conflicts with clear error message and guidance (Option C)
- Phase 4+: Add manual diff viewer for conflict resolution (Option A)
- Provide "Force Push" option for advanced users (with warning)

### 3. Credential Security vs Convenience
**Question:** How should credentials be stored?

**Options:**
- A) Encrypted localStorage (convenient but less secure)
- B) Require entry each time (secure but tedious)
- C) OS keychain integration (most secure but platform-dependent)

**Recommendation:**
- Use encrypted localStorage with master password (Option A)
- Leverage existing encryption from `stpFileCrypter.ts`
- Add "Remember credentials" checkbox (opt-in)
- Provide clear security warning

### 4. File Browsing in Cloned Repos
**Question:** Should users browse folder structure or just markdown files?

**Recommendation:**
- Recursive markdown file finder (`.md`, `.markdown` extensions)
- Show relative paths in tree structure
- Filter option to show all files vs markdown only
- Recent files list for quick access

### 5. Branch Management Scope
**Question:** Full branch switching/creation or limit to main/master branch only?

**Recommendation:**
- Phase 1-2: Support single branch (main/master) operations
- Phase 3: Add branch dropdown showing current branch
- Phase 4: Add branch switching and creation
- Advanced features: Pull requests, branch comparison (future)

---

## Dependencies

### npm Packages Required

```json
{
  "isomorphic-git": "^1.25.0",
  "@isomorphic-git/lightning-fs": "^4.6.0"
}
```

### Browser/Node.js APIs Used
- File System API (via Electron)
- LocalStorage (credential storage)
- Crypto API (credential encryption - already in use)

---

## Testing Recommendations

### Unit Tests
1. Git operations (clone, commit, push, pull)
2. Credential encryption/decryption
3. File path parsing and filtering
4. Branch detection and switching

### Integration Tests
1. Clone public repository
2. Clone private repository with credentials
3. Edit file and commit changes
4. Push changes to remote
5. Pull updates from remote
6. Handle merge conflicts

### Manual Test Scenarios
1. Clone a GitHub markdown repository
2. Edit multiple files
3. Commit with message
4. Push to remote
5. Simulate conflict by editing same file remotely
6. Pull and handle conflict
7. Switch branches
8. Initialize new repository

---

## Security Considerations

1. **Credential Storage:**
   - Use AES-256 encryption (already implemented in `stpFileCrypter.ts`)
   - Never log credentials in console
   - Clear from memory after use

2. **Token Permissions:**
   - Recommend users create tokens with minimal scope (repo access only)
   - Document token creation process for GitHub/GitLab

3. **HTTPS Only:**
   - Support HTTPS for remote URLs
   - SSH support as future enhancement (requires SSH key management)

4. **Rate Limiting:**
   - Handle API rate limits gracefully
   - Show user-friendly error messages

---

## UI/UX Enhancements

### Visual Indicators
- Git icon in toolbar changes color based on repository status
- Branch name displayed next to Git button
- Modified files count badge
- Sync status indicator (synced, pending, syncing)

### User Feedback
- Progress bars for clone/push/pull operations
- Success/error notifications (toast messages)
- Clear error messages for common issues (auth failure, network error, conflicts)

### Keyboard Shortcuts
- `Ctrl+S` - Save file to repository
- `Ctrl+Shift+G` - Open Git dropdown
- `Ctrl+Shift+C` - Quick commit
- `Ctrl+Shift+P` - Push changes

---

## Migration Path from Existing Workflow

Users currently work with local markdown files. The Git integration should:

1. **Non-intrusive:** Works alongside existing file operations
2. **Optional:** Users can choose to use Git or continue with local files
3. **Discoverable:** Clear UI indicators when working with Git repositories
4. **Seamless:** Automatically detect Git repositories when opening files

---

## Future Enhancements (Beyond Phase 4)

1. **Pull Request Integration:**
   - Create PRs from within EasyEdit
   - View and merge PRs
   - Code review comments

2. **GitHub/GitLab API Integration:**
   - Browse repositories without cloning
   - Create issues and link to commits
   - View repository insights

3. **Collaborative Editing:**
   - Real-time collaboration on Git repositories
   - User presence indicators
   - Conflict prevention through locks

4. **Git LFS Support:**
   - Handle large files (images, videos)
   - Automatic LFS configuration

5. **Advanced Diff Viewer:**
   - Side-by-side comparison
   - Syntax highlighting for diffs
   - Interactive merge tool

---

## Success Metrics

1. Users can clone a repository in under 3 clicks
2. Commit and push workflow takes less than 5 seconds
3. Zero external Git installation required
4. 95%+ success rate for common Git operations
5. Clear error messages with actionable guidance

---

## Documentation Updates Required

1. **User Guide:**
   - How to connect to GitHub/GitLab
   - Creating personal access tokens
   - Basic Git workflow in EasyEdit

2. **FAQ:**
   - Troubleshooting authentication issues
   - Handling merge conflicts
   - Understanding Git status indicators

3. **Security Guide:**
   - How credentials are stored
   - Best practices for token management
   - Revoking access

---

## Timeline Estimate

- **Phase 1:** 2-3 days (basic UI and infrastructure)
- **Phase 2:** 3-4 days (clone and file operations)
- **Phase 3:** 2-3 days (credential management)
- **Phase 4:** 4-5 days (enhanced features)

**Total:** ~2-3 weeks for complete implementation

---

## References

- [isomorphic-git Documentation](https://isomorphic-git.org/)
- [GitHub Personal Access Tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- [Git Best Practices](https://git-scm.com/book/en/v2)

---

*This plan is subject to revision based on testing and user feedback.*
