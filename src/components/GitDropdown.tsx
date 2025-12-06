import { FaCodeBranch, FaClone, FaDownload, FaUpload, FaSync, FaSave, FaKey, FaLock, FaHistory, FaPlus } from 'react-icons/fa';

type Props = {
  onClone: () => void;
  onOpenRepository: () => void;
  onPull: () => void;
  onPush: () => void;
  onFetch: () => void;
  onCommit: () => void;
  onSave: () => void;
  onSetupCredentials: () => void;
  onClearCredentials: () => void;
  onViewHistory: () => void;
  onInitRepo: () => void;
  onClose: () => void;
  hasCredentials: boolean;
  isAuthenticated: boolean;
  onSaveCommitPush: () => void;
};

export default function GitDropdown({ 
  onClone,
  onOpenRepository,
  onPull, 
  onPush, 
  onFetch, 
  onCommit, 
  onSave, 
  onSetupCredentials, 
  onClearCredentials,
  onViewHistory,
  onInitRepo,
  onClose, 
  hasCredentials,
  isAuthenticated,
  onSaveCommitPush
}: Props) {
  // Helper to render button with auth indicator
  const renderButton = (
    icon: React.ReactNode,
    title: string,
    desc: string,
    onClick: () => void,
    requiresAuth: boolean = false
  ) => {
    const needsAuth = requiresAuth && !isAuthenticated;
    
    return (
      <button 
        className="dropdown-item" 
        onClick={() => { 
          if (needsAuth) {
            onSetupCredentials();
          } else {
            onClick(); 
          }
          onClose(); 
        }}
        style={needsAuth ? { opacity: 0.6 } : {}}
        title={needsAuth ? 'Authentication required - click to setup credentials' : ''}
      >
        <div className="hdr-title">
          {icon} {title}
          {needsAuth && <span style={{ marginLeft: '8px', fontSize: '0.8em', color: '#f57c00' }}>🔒</span>}
        </div>
        <div className="hdr-desc">
          <em>{needsAuth ? 'Requires authentication - click to setup' : desc}</em>
        </div>
        <div className="hdr-sep" />
      </button>
    );
  };

  return (
    <div className="header-dropdown format-dropdown">
      {renderButton(<FaClone />, 'Clone Repository', 'Clone a Git repository from URL', onClone, false)}
      {renderButton(<FaCodeBranch />, 'Open Repository', 'Open folder with Git support', onOpenRepository, false)}
      {renderButton(<FaPlus />, 'Init New Repo', 'Initialize a new Git repository', onInitRepo, false)}
      
      <div className="hdr-sep" style={{ margin: '2px 0', borderTop: '2px solid var(--border-secondary)' }} />
      
      {renderButton(<FaDownload />, 'Pull', 'Pull latest changes from remote', onPull, true)}
      {renderButton(<FaUpload />, 'Push', 'Push commits to remote repository', onPush, true)}
      {renderButton(<FaSync />, 'Fetch', 'Fetch updates from remote', onFetch, true)}
      {renderButton(<FaCodeBranch />, 'Commit', 'Commit staged changes', onCommit, true)}
      {renderButton(<FaSave />, 'Save & Stage', 'Save file and stage for commit', onSave, true)}
      {renderButton(<FaSave />, 'One-Click Push', 'One-click save, commit and push', onSaveCommitPush, true)}
      {renderButton(<FaHistory />, 'View History', 'View commit history', onViewHistory, false)}
      
      <div className="hdr-sep" style={{ margin: '10px 0', borderTop: '2px solid var(--border-secondary)' }} />
      <button className="dropdown-item" onClick={() => { onSetupCredentials(); onClose(); }}>
        <div className="hdr-title"><FaKey /> {hasCredentials ? 'Authenticate' : 'Setup'}</div>
        <div className="hdr-desc"><em>{hasCredentials ? 'View or update saved credentials' : 'Save Git credentials securely'}</em></div>
        <div className="hdr-sep" />
      </button>
      {hasCredentials && (
        <button className="dropdown-item" onClick={() => { onClearCredentials(); onClose(); }}>
          <div className="hdr-title"><FaLock /> Clear Credentials</div>
          <div className="hdr-desc"><em>Remove saved credentials</em></div>
          <div className="hdr-sep" />
        </button>
      )}
    </div>
  );
}
