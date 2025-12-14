import React, { useState, useEffect } from 'react';
import './cloneModal.css';

interface CloneModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (url: string, targetDir: string, branch?: string) => void;
}

const CloneModal: React.FC<CloneModalProps> = ({ open, onClose, onSubmit }) => {
  const [url, setUrl] = useState('');
  const [targetDir, setTargetDir] = useState('');
  const [branch, setBranch] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    if (open) {
      setUrl('');
      setTargetDir('');
      setBranch('');
      setShowAdvanced(false);
    }
  }, [open]);

  if (!open) {
    return null;
  }

  const isValid = !!url.trim() && !!targetDir.trim();

  const handleSubmit = () => {
    if (!isValid) {
      return;
    }
    onSubmit(url.trim(), targetDir.trim(), branch.trim() || undefined);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit();
    }
  };

  const handleSelectDirectory = async () => {
    // Web version: Use File System Access API
    try {
      // Check if the API is supported
      if ('showDirectoryPicker' in window) {
        const dirHandle = await (window as any).showDirectoryPicker({
          mode: 'readwrite',
          startIn: 'downloads' // Start in downloads folder
        });
        
        // Verify we can write to the directory
        try {
          const testFileName = '.easyedit-test';
          const testFileHandle = await dirHandle.getFileHandle(testFileName, { create: true });
          await testFileHandle.remove();
        } catch (permError) {
          alert('Cannot write to this directory. Please choose a different folder or grant write permissions.');
          return;
        }
        
        // Get the directory name (browser security prevents getting full path)
        // Store both name and handle
        const dirName = dirHandle.name;
        
        // Try to build a more descriptive path
        // Note: Browser security limits what we can show
        let displayPath = dirName;
        
        // Check if we can resolve any parent info (usually we can't due to security)
        try {
          // Most browsers don't allow this, but we can try
          if ((dirHandle as any).resolve) {
            const resolved = await (dirHandle as any).resolve();
            console.log('Resolved path:', resolved);
            if (resolved && resolved.length > 0) {
              displayPath = resolved.join('/');
            }
          }
        } catch (e) {
          console.log('Cannot resolve full path (browser security):', e);
        }
        
        console.log('Selected directory handle:', dirHandle);
        console.log('Directory name:', dirName);
        console.log('Display path:', displayPath);
        
        setTargetDir(displayPath);
        
        // Store the handle and additional info for later use
        (window as any).selectedDirHandle = dirHandle;
        (window as any).selectedDirName = dirName;
      } else {
        // Fallback: show input field with helpful message
        alert('Your browser does not support directory selection.\n\nPlease type the full directory path in the input field.\n\nRecommended browsers: Chrome, Edge, or use the Electron app.');
      }
    } catch (error: any) {
      // User cancelled or error occurred
      if (error.name === 'AbortError') {
        // User cancelled - do nothing
        return;
      } else if (error.name === 'SecurityError') {
        alert('Cannot access this folder due to browser security restrictions.\n\nPlease choose a different folder (avoid system folders like Program Files, Windows, etc.).\n\nRecommended: Create a new folder in your Documents or a custom location.');
      } else {
        console.error('Directory selection error:', error);
        alert('Failed to select directory. Please try a different folder.');
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content clone-modal">
        <h2>Clone Git Repository</h2>
        <p>Clone from GitHub, GitLab, Bitbucket, or any public Git repository</p>
        
        <div className="clone-input-group">
          <label htmlFor="repo-url">Repository URL</label>
          <input
            id="repo-url"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="https://github.com/username/repository.git"
            autoFocus
          />
          <small style={{ color: 'var(--color-text-secondary)', fontSize: '0.85em', marginTop: '4px', display: 'block' }}>
            Note: Public repositories work best in web mode
          </small>
        </div>

        <div className="clone-input-group">
          <label htmlFor="target-dir">Target Directory</label>
          <div className="directory-input-container">
            <input
              id="target-dir"
              type="text"
              value={targetDir}
              onChange={(e) => setTargetDir(e.target.value)}
              placeholder="Select folder or enter directory name"
            />
            <button 
              onClick={handleSelectDirectory} 
              className="directory-select-btn"
              type="button"
            >
              Browse...
            </button>
          </div>
          <small style={{ color: 'var(--color-text-secondary)', fontSize: '0.85em', marginTop: '4px', display: 'block' }}>
            {targetDir ? `Selected: ${targetDir}` : 'Click Browse to select a folder'}
          </small>
        </div>

        <div className="advanced-toggle">
          <button 
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="toggle-button"
            type="button"
          >
            {showAdvanced ? '▼' : '▶'} Advanced Options
          </button>
        </div>

        {showAdvanced && (
          <div className="advanced-options">
            <div className="clone-input-group">
              <label htmlFor="branch">Branch (optional)</label>
              <input
                id="branch"
                type="text"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                placeholder="main (leave empty for default)"
              />
            </div>
          </div>
        )}

        <div className="modal-actions">
          <button onClick={onClose} className="modal-button cancel-button">Cancel</button>
          <button 
            onClick={handleSubmit} 
            className={`modal-button submit-button ${isValid ? 'submit-button-active' : 'submit-button-disabled'}`}
            disabled={!isValid}
          >
            Clone
          </button>
        </div>
      </div>
    </div>
  );
};

export default CloneModal;