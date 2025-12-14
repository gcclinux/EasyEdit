import React, { useState, useEffect } from 'react';
import './gitCredentialsModal.css';

interface GitCredentialsModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (username: string, token: string, rememberMe: boolean) => void;
  isSetup?: boolean; // true if setting up for first time, false if just entering credentials
  initialUsername?: string;
  initialToken?: string;
}

const GitCredentialsModal: React.FC<GitCredentialsModalProps> = ({ 
  open, 
  onClose, 
  onSubmit, 
  isSetup = false,
  initialUsername = '',
  initialToken = ''
}) => {
  const [username, setUsername] = useState(initialUsername);
  const [token, setToken] = useState(initialToken);
  const [showToken, setShowToken] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  useEffect(() => {
    if (open) {
      setUsername(initialUsername);
      setToken(initialToken);
      setShowToken(false);
      setRememberMe(true);
    }
  }, [open, initialUsername, initialToken]);

  if (!open) {
    return null;
  }

  const handleSubmit = () => {
    if (!username.trim()) {
      // Basic validation, but leave messaging to parent via toast
      return;
    }
    if (!token.trim()) {
      // Basic validation, but leave messaging to parent via toast
      return;
    }
    onSubmit(username.trim(), token.trim(), rememberMe);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content git-credentials-modal">
        <h2>{isSetup ? 'Setup Git Credentials' : 'Git Credentials Required'}</h2>
        <p className="modal-description">
          {isSetup 
            ? 'Enter your GitHub credentials to authenticate with remote repositories.'
            : 'Please provide your credentials to continue with this Git operation.'}
        </p>

        <div className="credentials-input-group">
          <label htmlFor="git-username">GitHub Username (not email)</label>
          <input
            id="git-username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="your-github-username (e.g., gcclinux)"
            autoFocus
          />
          <small className="input-help" style={{ color: '#888', fontSize: '0.85em', marginTop: '4px' }}>
            ⚠️ Use your GitHub username (e.g., <strong>gcclinux</strong>), NOT your email address
          </small>
        </div>

        <div className="credentials-input-group">
          <label htmlFor="git-token">Personal Access Token (not password)</label>
          <div className="token-input-container">
            <input
              id="git-token"
              type={showToken ? 'text' : 'password'}
              value={token}
              onChange={(e) => setToken(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
            />
            <button 
              onClick={() => setShowToken(!showToken)} 
              className="token-toggle-btn"
              type="button"
              title={showToken ? 'Hide token' : 'Show token'}
            >
              <span role="img" aria-label="toggle token visibility">👁️</span>
            </button>
          </div>
          <small className="input-help">
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                const url = 'https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token';
                window.open(url, '_blank');
              }}
            >
              How to create a personal access token
            </a>
          </small>
        </div>

        <div className="remember-me-container">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <span>Remember my credentials (encrypted locally)</span>
          </label>
          <small className="security-note">
            ⚠️ Credentials are encrypted and stored locally on your device
          </small>
        </div>

        <div className="modal-actions">
          <button onClick={onClose} className="modal-button cancel-button">Cancel</button>
          <button onClick={handleSubmit} className="modal-button submit-button">
            {isSetup ? 'Save Credentials' : 'Authenticate'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GitCredentialsModal;
