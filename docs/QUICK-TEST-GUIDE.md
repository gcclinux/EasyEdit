# Quick Test Guide - Git Operations Fixes

## Quick Smoke Test (5 minutes)

### Test 1: Open Repository (Web)
```bash
# Start server
npm run server

# Browser: https://localhost:3024/
1. File → Open Repository
2. Select EasyEdit folder
3. ✅ Check: No "No repository directory set" error
4. ✅ Check: Git status shows in top right
5. Select README.md
6. Edit content
7. Ctrl+S
8. ✅ Check: Toast shows "Saved and staged"
```

### Test 2: Authentication Indicators
```bash
# Browser: https://localhost:3024/
1. Git menu → Check buttons
2. ✅ Check: Pull/Push/Fetch/Commit/Save & Stage show 🔒 icon (if not authenticated)
3. ✅ Check: Buttons have reduced opacity
4. Click Push (without auth)
5. ✅ Check: Redirects to credentials setup
```

### Test 3: Clone with Authentication
```bash
# Browser: https://localhost:3024/
1. Git → Clone Repository
2. URL: https://github.com/your-private-repo.git
3. ✅ Check: Dialog asks "Setup credentials first?"
4. Click "Setup Credentials"
5. ✅ Check: Credentials modal opens
6. Enter credentials
7. ✅ Check: Clone proceeds after setup
```

## Expected Results

### ✅ All Pass
- No "No repository directory set" errors
- Git status updates after opening repository
- Save & Stage works
- Auth indicators visible (🔒 icons)
- Clone prompts for credentials
- Operations redirect to setup when not authenticated

### ❌ If Any Fail
1. Check browser console for errors
2. Verify HTTPS is enabled (for network access)
3. Check `gitManager.getRepoDir()` is set
4. Verify credentials are unlocked

## Full Test Matrix

| Test | Localhost | Network | Electron |
|------|-----------|---------|----------|
| Open Repo | ✅ | ✅ | ✅ |
| Git Status | ✅ | ✅ | ✅ |
| Save & Stage | ✅ | ✅ | ✅ |
| Clone Private | ✅ | ✅ | ✅ |
| Auth Indicators | ✅ | ✅ | N/A |
| Push with Auth | ✅ | ✅ | ✅ |

## Common Issues

### "No repository directory set"
- **Cause**: gitManager.setRepoDir() not called
- **Fix**: Already fixed in this update
- **Verify**: Check console for "Set gitManager repo dir: /RepoName"

### 401 Authentication Error
- **Cause**: No credentials or not unlocked
- **Fix**: Already fixed - now prompts before operation
- **Verify**: Should see confirmation dialog or credentials modal

### No 🔒 Icons
- **Cause**: isAuthenticated prop not passed
- **Fix**: Already fixed in GitDropdown
- **Verify**: Check Git menu, should see locks on Pull/Push/Fetch/Commit/Save & Stage

## Debug Commands

```javascript
// In browser console:

// Check if repo dir is set
gitManager.getRepoDir()
// Should return: "/RepoName" or null

// Check if credentials exist
gitCredentialManager.hasCredentials()
// Should return: true or false

// Check if unlocked
gitCredentialManager.isUnlocked()
// Should return: true or false
```

## Quick Fix Verification

Run this in browser console after opening repository:
```javascript
// Should all return true
console.log('Repo dir set:', !!gitManager.getRepoDir());
console.log('Dir handle set:', !!gitManager.dirHandle);
console.log('Is Git repo:', isGitRepo);
console.log('Current repo path:', currentRepoPath);
```

## Performance Check

All operations should complete within:
- Open Repository: < 2 seconds
- Save & Stage: < 1 second
- Git Status Update: < 1 second
- Clone (small repo): < 10 seconds

## Browser Compatibility

Test in:
- ✅ Chrome 86+
- ✅ Edge 86+
- ✅ Opera 72+
- ⚠️ Firefox (limited - no File System Access API)
- ⚠️ Safari (limited - no File System Access API)

## Success Criteria

All tests pass when:
1. No console errors
2. Git status updates correctly
3. Save & Stage works
4. Auth indicators visible
5. Clone prompts for credentials
6. All operations complete successfully

## Report Issues

If any test fails:
1. Note which test failed
2. Copy console errors
3. Note browser and version
4. Note localhost vs network
5. Update `docs/GIT-TEST-MANUALLY.md`

---

**Quick Test Time**: ~5 minutes  
**Full Test Time**: ~15 minutes  
**Status**: All fixes implemented ✅
