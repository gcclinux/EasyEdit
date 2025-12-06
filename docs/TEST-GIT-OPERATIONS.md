# Test Plan: Git Operations

## Test Environment Setup

### Prerequisites
- HTTPS certificates generated (`npm run setup-https`)
- Modern browser (Chrome 86+, Edge 86+, or Opera 72+)
- Electron app built (`npm run app`)

## Test Suite

### Test 1: Web Browser - Clone Repository ✅

**Steps**:
1. Start server: `npm run server`
2. Open: `https://localhost:3024/`
3. Accept self-signed certificate warning
4. Click: **Git → Clone Repository**
5. Enter URL: `https://github.com/torvalds/linux.git` (or any public repo)
6. Click "Select Directory" and choose a folder
7. Wait for clone to complete
8. File browser should appear with markdown files
9. Select a file (e.g., `README.md`)
10. Edit the content
11. Press `Ctrl+S` or click **Git → Save & Stage**
12. Click **Git → Commit**
13. Enter commit message: "Test commit from web"
14. Click Commit
15. Click **Git → Push**

**Expected Results**:
- ✅ Clone completes successfully
- ✅ Files appear in browser
- ✅ File opens and displays content
- ✅ Save & Stage succeeds (toast: "Saved and staged: README.md")
- ✅ Commit modal opens
- ✅ Commit succeeds (toast: "Successfully committed changes!")
- ✅ Push succeeds (toast: "Successfully pushed changes!")
- ✅ Git status indicator shows branch and clean status

**Actual Results**: _[To be filled during testing]_

---

### Test 2: Web Browser - Open Existing Repository ✅

**Steps**:
1. Ensure you have a local Git repository with markdown files
2. Start server: `npm run server`
3. Open: `https://localhost:3024/`
4. Click: **File → Open Repository**
5. Select your existing Git repository folder
6. File browser should appear
7. Select a markdown file
8. Edit the content
9. Press `Ctrl+S`
10. Click **Git → Commit**
11. Enter commit message: "Test from opened repo"
12. Click Commit
13. Click **Git → Push**

**Expected Results**:
- ✅ Repository opens successfully
- ✅ Files appear in browser
- ✅ File opens and displays content
- ✅ Save & Stage succeeds
- ✅ Commit succeeds
- ✅ Push succeeds
- ✅ Git status updates correctly

**Actual Results**: _[To be filled during testing]_

---

### Test 3: Web Browser - File Reading from Subdirectory ✅

**Steps**:
1. Open repository (clone or existing)
2. Select a file in a subdirectory (e.g., `docs/README.md`)
3. Verify file content loads correctly
4. Edit and save
5. Verify save succeeds

**Expected Results**:
- ✅ File in subdirectory opens correctly
- ✅ No "NotFoundError"
- ✅ Content displays properly
- ✅ Save succeeds

**Actual Results**: _[To be filled during testing]_

---

### Test 4: Web Browser - Git Status Indicator ✅

**Steps**:
1. Open repository
2. Check Git status indicator (top right)
3. Should show: branch name, file count
4. Edit a file and save
5. Status should update to show modified files
6. Commit changes
7. Status should return to clean

**Expected Results**:
- ✅ Status shows current branch
- ✅ Status shows modified count after edit
- ✅ Status updates after commit
- ✅ Status shows "clean" after commit

**Actual Results**: _[To be filled during testing]_

---

### Test 5: Electron App - Open Repository (Regression Test) ✅

**Steps**:
1. Start Electron: `npm run app`
2. Click: **File → Open Repository**
3. Select a Git repository
4. Select a file
5. Edit content
6. Press `Ctrl+S`
7. Click **Git → Commit**
8. Enter message and commit
9. Click **Git → Push**

**Expected Results**:
- ✅ All operations work as before (no regression)
- ✅ File opens correctly
- ✅ Save & Stage works
- ✅ Commit works
- ✅ Push works

**Actual Results**: _[To be filled during testing]_

---

### Test 6: Electron App - Clone Repository (Regression Test) ✅

**Steps**:
1. Start Electron: `npm run app`
2. Click: **Git → Clone Repository**
3. Enter URL and select directory
4. Wait for clone
5. Select file, edit, save, commit, push

**Expected Results**:
- ✅ All operations work as before (no regression)

**Actual Results**: _[To be filled during testing]_

---

### Test 7: Web Browser - Network Access (IP Address) ⚠️

**Steps**:
1. Start server: `npm run server`
2. Open: `https://192.168.0.96:3024/` (use your IP)
3. Try: **File → Open Repository**

**Expected Results**:
- ✅ Option is available (HTTPS enabled)
- ✅ All operations work

**Note**: If using HTTP (no certificates), "Open Repository" won't be available.

**Actual Results**: _[To be filled during testing]_

---

### Test 8: Error Handling ✅

**Steps**:
1. Open repository
2. Try to push without credentials (private repo)
3. Should show error toast
4. Set up credentials: **Git → Setup Credentials**
5. Try push again
6. Should succeed

**Expected Results**:
- ✅ Error toast shows helpful message
- ✅ Credentials modal works
- ✅ Push succeeds after credentials set

**Actual Results**: _[To be filled during testing]_

---

## Browser Compatibility Tests

### Chrome/Edge/Opera ✅
- All features should work

### Firefox/Safari ⚠️
- "Open Repository" not available (no File System Access API)
- Should show message: "This feature requires Chrome, Edge, or Opera"

---

## Performance Tests

### Large Repository
- Clone a large repo (e.g., Linux kernel)
- Should show progress
- Should complete without errors

### Many Files
- Open repository with 100+ markdown files
- File browser should load quickly
- Selecting files should be responsive

---

## Edge Cases

### Test 9: Empty Repository
**Steps**:
1. Clone an empty repository
2. Should show "No markdown files found"

**Expected**: ✅ Graceful handling

---

### Test 10: No Internet Connection
**Steps**:
1. Disconnect internet
2. Try to clone
3. Should show network error

**Expected**: ✅ Clear error message

---

### Test 11: Invalid Repository URL
**Steps**:
1. Try to clone: `https://github.com/invalid/repo.git`
2. Should show 404 error

**Expected**: ✅ Clear error message

---

## Test Results Summary

| Test | Web (Clone) | Web (Open) | Electron | Status |
|------|-------------|------------|----------|--------|
| 1. Clone Repository | ⬜ | N/A | ⬜ | Pending |
| 2. Open Repository | N/A | ⬜ | ⬜ | Pending |
| 3. Subdirectory Files | ⬜ | ⬜ | ⬜ | Pending |
| 4. Git Status | ⬜ | ⬜ | ⬜ | Pending |
| 5. Save & Stage | ⬜ | ⬜ | ⬜ | Pending |
| 6. Commit | ⬜ | ⬜ | ⬜ | Pending |
| 7. Push | ⬜ | ⬜ | ⬜ | Pending |
| 8. Error Handling | ⬜ | ⬜ | ⬜ | Pending |

Legend:
- ⬜ Pending
- ✅ Pass
- ❌ Fail
- ⚠️ Warning

---

## Quick Smoke Test

For a quick verification, run this minimal test:

```bash
# Terminal 1: Start server
npm run server

# Browser: Open https://localhost:3024/
# 1. File → Open Repository → Select this repo (EasyEdit)
# 2. Select README.md
# 3. Add a line: "Test edit"
# 4. Ctrl+S (should see "Saved and staged")
# 5. Git → Commit → "Test commit" → Commit
# 6. Check Git status indicator (should show clean)
# 7. Git → Push (should succeed)
```

**Expected**: All steps succeed ✅

---

## Debugging

If tests fail, check browser console for:
- `[ReadFile]` logs - File reading
- `[gitManager]` logs - Git operations
- `[App]` logs - Application flow

Common issues:
- **NotFoundError**: Check path normalization in `readFileFromDirectory`
- **No repository directory set**: Check `gitManager.setRepoDir()` was called
- **Authentication failed**: Check credentials are set up
- **CORS error**: Repository doesn't support CORS

---

## Automated Testing (Future)

Consider adding:
- Playwright tests for web mode
- Jest tests for gitManager
- Integration tests for full workflow

---

## Sign-off

**Tested by**: _________________  
**Date**: _________________  
**Browser**: _________________  
**Version**: _________________  
**Result**: ⬜ Pass / ⬜ Fail  
**Notes**: _________________
