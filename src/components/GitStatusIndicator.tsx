import React from 'react';
import './gitStatusIndicator.css';
import { FaCodeBranch, FaCircle } from 'react-icons/fa';

interface GitStatusIndicatorProps {
  isActive: boolean;
  branchName?: string;
  modifiedCount?: number;
  status?: 'clean' | 'modified' | 'conflict';
}

const GitStatusIndicator: React.FC<GitStatusIndicatorProps> = ({
  isActive,
  branchName = 'main',
  modifiedCount = 0,
  status = 'clean'
}) => {
  if (!isActive) {
    return null;
  }

  const getStatusColor = () => {
    switch (status) {
      case 'clean':
        return '#28a745'; // green
      case 'modified':
        return '#ffc107'; // yellow
      case 'conflict':
        return '#dc3545'; // red
      default:
        return '#6c757d'; // gray
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'clean':
        return 'Up to date';
      case 'modified':
        return `${modifiedCount} file${modifiedCount !== 1 ? 's' : ''} modified`;
      case 'conflict':
        return 'Conflicts detected';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="git-status-indicator">
      <div className="git-branch-info">
        <FaCodeBranch className="branch-icon" />
        <span className="branch-name">{branchName}</span>
      </div>
      <div className="git-status-info">
        <FaCircle 
          className="status-dot" 
          style={{ color: getStatusColor() }}
        />
        <span className="status-text">{getStatusText()}</span>
      </div>
    </div>
  );
};

export default GitStatusIndicator;
