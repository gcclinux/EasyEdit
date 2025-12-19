/**
 * LoadingOverlay - Full-screen or container loading overlay
 * Provides comprehensive loading states with progress indicators
 */

import React from 'react';
import { FaSync, FaSpinner } from 'react-icons/fa';
import ProgressBar from './ProgressBar';

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  progress?: number; // 0-100, undefined for indeterminate
  subMessage?: string;
  type?: 'spinner' | 'sync' | 'progress';
  fullScreen?: boolean;
  backgroundColor?: string;
  className?: string;
  style?: React.CSSProperties;
  onCancel?: () => void;
  cancelLabel?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isVisible,
  message = 'Loading...',
  progress,
  subMessage,
  type = 'spinner',
  fullScreen = false,
  backgroundColor = 'rgba(0, 0, 0, 0.5)',
  className = '',
  style = {},
  onCancel,
  cancelLabel = 'Cancel'
}) => {
  if (!isVisible) return null;

  const getLoadingIcon = () => {
    switch (type) {
      case 'sync':
        return <FaSync className="fa-spin" style={{ fontSize: '24px', color: 'var(--color-primary)' }} />;
      case 'progress':
        return progress !== undefined ? null : <FaSpinner className="fa-spin" style={{ fontSize: '24px', color: 'var(--color-primary)' }} />;
      default:
        return <FaSpinner className="fa-spin" style={{ fontSize: '24px', color: 'var(--color-primary)' }} />;
    }
  };

  const overlayStyle: React.CSSProperties = {
    position: fullScreen ? 'fixed' : 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: fullScreen ? 9999 : 1000,
    backdropFilter: 'blur(2px)',
    ...style
  };

  return (
    <div className={`loading-overlay ${className}`} style={overlayStyle}>
      <div style={{
        backgroundColor: 'var(--bg-dropdown)',
        border: '1px solid var(--border-secondary)',
        borderRadius: '8px',
        padding: '24px',
        minWidth: '200px',
        maxWidth: '400px',
        textAlign: 'center',
        boxShadow: '0 4px 20px var(--shadow-lg)'
      }}>
        {/* Loading Icon */}
        <div style={{ marginBottom: '16px' }}>
          {getLoadingIcon()}
        </div>

        {/* Main Message */}
        <div style={{
          fontSize: '16px',
          fontWeight: '500',
          color: 'var(--color-text)',
          marginBottom: subMessage || progress !== undefined ? '8px' : '16px'
        }}>
          {message}
        </div>

        {/* Progress Bar */}
        {type === 'progress' && progress !== undefined && (
          <div style={{ marginBottom: '12px' }}>
            <ProgressBar
              progress={progress}
              showPercentage={true}
              animated={true}
              size="medium"
            />
          </div>
        )}

        {/* Sub Message */}
        {subMessage && (
          <div style={{
            fontSize: '14px',
            color: 'var(--color-text-light)',
            marginBottom: '16px'
          }}>
            {subMessage}
          </div>
        )}

        {/* Cancel Button */}
        {onCancel && (
          <button
            onClick={onCancel}
            style={{
              padding: '8px 16px',
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--color-text)',
              border: '1px solid var(--border-secondary)',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              marginTop: '8px'
            }}
          >
            {cancelLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default LoadingOverlay;