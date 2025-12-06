// This file contains the two fixed functions to replace in App.tsx
// Copy these functions and paste them into App.tsx

// FUNCTION 1: Replace handleGitSave
const handleGitSave = async () => {
  if (!currentFilePath) {
    showToast('No file is currently open from a Git repository.', 'warning');
    return;
  }
  
  let repoPath = currentRepoPath || gitManager.getRepoDir();
  if (!repoPath) {
    showToast('No active Git repository. Please clone a repository first.', 'info');
    return;
  }
  
  try {
    let relativePath: string;
    
    console.log('[App] Saving file:', currentFilePath);
    console.log('[App] Current repo path:', repoPath);
    console.log('[App] Is Electron:', !!(window as any).electronAPI);
    
    // Check if running in Electron or web
    if ((window as any).electronAPI) {
      // Electron: use Node.js fs module
      const fs = await import('fs');
      const path = await import('path');
      
      // Write file to disk
      console.log('[App] Writing to disk:', currentFilePath);
      await fs.promises.writeFile(currentFilePath, editorContent, 'utf-8');
      
      // Get relative path for git add
      relativePath = path.relative(repoPath, currentFilePath);
    } else {
      // Web: use gitManager which writes to LightningFS and syncs to File System
      console.log('[App] Writing via gitManager');
      relativePath = currentFilePath;
      await gitManager.writeFile(relativePath, editorContent);
    }
    
    console.log('[App] File saved, staging:', relativePath);
    
    // Stage the file
    await gitManager.add(relativePath);
    
    console.log('[App] File staged successfully');
    showToast(`Saved and staged: ${relativePath}`,'success');
    await updateGitStatus(); // Refresh status after save
  } catch (error) {
    showToast(`Failed to save and stage file: ${(error as Error).message}`,'error');
    console.error('Save error:', error);
  }
};

// FUNCTION 2: Replace handleSaveStageCommitPush
const handleSaveStageCommitPush = async () => {
  const isRepo = isGitRepo || !!gitManager.getRepoDir();
  if (!isRepo) {
    showToast('No active Git repository. Please clone a repository first.', 'info');
    return;
  }

  if (!currentFilePath) {
    showToast('No file is currently open from a Git repository.', 'warning');
    return;
  }

  try {
    // First save and stage the current file
    await handleGitSave();

    // Open the commit modal so the user can enter a message
    await handleGitCommit();

    // Note: the actual push will be triggered from the commit handler
    // once a commit is successfully created.
  } catch (error) {
    console.error('Save/Commit/Push error:', error);
    showToast(`Failed to save and prepare commit: ${(error as Error).message}`,'error');
  }
};
