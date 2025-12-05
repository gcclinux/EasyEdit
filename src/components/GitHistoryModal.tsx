import React, { useState } from 'react';
import './gitHistoryModal.css';
import { FaCodeBranch, FaUser, FaClock } from 'react-icons/fa';

interface Commit {
  oid: string;
  message: string;
  author: {
    name: string;
    email: string;
    timestamp: number;
  };
}

interface GitHistoryModalProps {
  open: boolean;
  onClose: () => void;
  commits: Commit[];
  repoPath?: string;
}

const GitHistoryModal: React.FC<GitHistoryModalProps> = ({ 
  open, 
  onClose, 
  commits,
  repoPath = ''
}) => {
  const [selectedCommit, setSelectedCommit] = useState<Commit | null>(null);

  if (!open) {
    return null;
  }

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  const formatRelativeTime = (timestamp: number): string => {
    const now = Date.now();
    const commitTime = timestamp * 1000;
    const diff = now - commitTime;
    
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  const getShortHash = (oid: string): string => {
    return oid.substring(0, 7);
  };

  const handleCommitClick = (commit: Commit) => {
    setSelectedCommit(selectedCommit?.oid === commit.oid ? null : commit);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content git-history-modal">
        <h2>Commit History</h2>
        {repoPath && <p className="repo-path">Repository: {repoPath}</p>}

        <div className="history-container">
          {commits.length === 0 ? (
            <div className="no-commits">
              <p>No commits found in this repository</p>
            </div>
          ) : (
            <ul className="commits-list">
              {commits.map((commit) => (
                <li 
                  key={commit.oid}
                  className={`commit-item ${selectedCommit?.oid === commit.oid ? 'selected' : ''}`}
                  onClick={() => handleCommitClick(commit)}
                >
                  <div className="commit-header">
                    <div className="commit-hash">
                      <FaCodeBranch className="commit-icon" />
                      <code>{getShortHash(commit.oid)}</code>
                    </div>
                    <div className="commit-time">
                      <FaClock className="time-icon" />
                      <span>{formatRelativeTime(commit.author.timestamp)}</span>
                    </div>
                  </div>
                  
                  <div className="commit-message">
                    {commit.message.split('\n')[0]}
                  </div>
                  
                  <div className="commit-author">
                    <FaUser className="author-icon" />
                    <span>{commit.author.name}</span>
                    <span className="author-email">({commit.author.email})</span>
                  </div>

                  {selectedCommit?.oid === commit.oid && (
                    <div className="commit-details">
                      <div className="detail-row">
                        <strong>Full Hash:</strong>
                        <code className="full-hash">{commit.oid}</code>
                      </div>
                      <div className="detail-row">
                        <strong>Date:</strong>
                        <span>{formatDate(commit.author.timestamp)}</span>
                      </div>
                      {commit.message.includes('\n') && (
                        <div className="detail-row">
                          <strong>Full Message:</strong>
                          <pre className="full-message">{commit.message}</pre>
                        </div>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="history-footer">
          <span className="commit-count">
            {commits.length} commit{commits.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="modal-actions">
          <button onClick={onClose} className="modal-button close-button">Close</button>
        </div>
      </div>
    </div>
  );
};

export default GitHistoryModal;
