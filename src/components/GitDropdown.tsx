import { FaCodeBranch, FaClone, FaDownload, FaUpload, FaSync, FaSave, FaKey, FaLock, FaHistory, FaPlus, FaFileAlt } from 'react-icons/fa';

type Props = {
  onClone: () => void;
  onPull: () => void;
  onPush: () => void;
  onFetch: () => void;
  onCommit: () => void;
  onSave: () => void;
  onSetupCredentials: () => void;
  onClearCredentials: () => void;
  onViewHistory: () => void;
  onInitRepo: () => void;
  onCreateGitignore: () => void;
  onClose: () => void;
  hasCredentials: boolean;
  onSaveCommitPush: () => void;
};

export default function GitDropdown({ 
  onClone, 
  onPull, 
  onPush, 
  onFetch, 
  onCommit, 
  onSave, 
  onSetupCredentials, 
  onClearCredentials,
  onViewHistory,
  onInitRepo,
  onCreateGitignore,
  onClose, 
  hasCredentials,
  onSaveCommitPush
}: Props) {
  return (
    <div className="header-dropdown format-dropdown">
      <button className="dropdown-item" onClick={() => { onClone(); onClose(); }}>
        <div className="hdr-title"><FaClone /> Clone Repository</div>
        <div className="hdr-desc"><em>Clone a Git repository from URL</em></div>
        <div className="hdr-sep" />
      </button>
      <button className="dropdown-item" onClick={() => { onInitRepo(); onClose(); }}>
        <div className="hdr-title"><FaPlus /> Init New Repo</div>
        <div className="hdr-desc"><em>Initialize a new Git repository</em></div>
        <div className="hdr-sep" />
      </button>
      <div className="hdr-sep" style={{ margin: '10px 0', borderTop: '2px solid var(--border-secondary)' }} />
      <button className="dropdown-item" onClick={() => { onPull(); onClose(); }}>
        <div className="hdr-title"><FaDownload /> Pull</div>
        <div className="hdr-desc"><em>Pull latest changes from remote</em></div>
        <div className="hdr-sep" />
      </button>
      <button className="dropdown-item" onClick={() => { onPush(); onClose(); }}>
        <div className="hdr-title"><FaUpload /> Push</div>
        <div className="hdr-desc"><em>Push commits to remote repository</em></div>
        <div className="hdr-sep" />
      </button>
      <button className="dropdown-item" onClick={() => { onFetch(); onClose(); }}>
        <div className="hdr-title"><FaSync /> Fetch</div>
        <div className="hdr-desc"><em>Fetch updates from remote</em></div>
        <div className="hdr-sep" />
      </button>
      <button className="dropdown-item" onClick={() => { onCommit(); onClose(); }}>
        <div className="hdr-title"><FaCodeBranch /> Commit</div>
        <div className="hdr-desc"><em>Commit staged changes</em></div>
        <div className="hdr-sep" />
      </button>
      <button className="dropdown-item" onClick={() => { onSave(); onClose(); }}>
        <div className="hdr-title"><FaSave /> Save & Stage</div>
        <div className="hdr-desc"><em>Save file and stage for commit</em></div>
        <div className="hdr-sep" />
      </button>
      <button className="dropdown-item" onClick={() => { onSaveCommitPush(); onClose(); }}>
        <div className="hdr-title"><FaSave /> Stage, Commit &amp; Push</div>
        <div className="hdr-desc"><em>One-click save, commit and push</em></div>
        <div className="hdr-sep" />
      </button>
      <button className="dropdown-item" onClick={() => { onViewHistory(); onClose(); }}>
        <div className="hdr-title"><FaHistory /> View History</div>
        <div className="hdr-desc"><em>View commit history</em></div>
        <div className="hdr-sep" />
      </button>
      <div className="hdr-sep" style={{ margin: '10px 0', borderTop: '2px solid var(--border-secondary)' }} />
      <button className="dropdown-item" onClick={() => { onCreateGitignore(); onClose(); }}>
        <div className="hdr-title"><FaFileAlt /> Create .gitignore</div>
        <div className="hdr-desc"><em>Add .gitignore template</em></div>
        <div className="hdr-sep" />
      </button>
      <div className="hdr-sep" style={{ margin: '10px 0', borderTop: '2px solid var(--border-secondary)' }} />
      <button className="dropdown-item" onClick={() => { onSetupCredentials(); onClose(); }}>
        <div className="hdr-title"><FaKey /> {hasCredentials ? 'Update & View' : 'Setup'}</div>
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
