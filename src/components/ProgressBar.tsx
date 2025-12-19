/**
 * ProgressBar - Reusable progress indicator component
 * Used for showing upload/download progress and operation status
 */

import React from 'react';

interface ProgressBarProps {
  progress: number; // 0-100
  label?: string;
  showPercentage?: boolean;
  size?: 'small' | 'medium' | 'large';
  color?: string;
  backgroundColor?: string;
  animated?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  label,
  showPercentage = true,
  size = 'medium',
  color = 'var(--color-primary)',
  backgroundColor = 'var(--bg-input)',
  animated = false,
  className = '',
  style = {}
}) => {
  // Ensure progress is within bounds
  const normalizedProgress = Math.max(0, Math.min(100, progress));

  const sizeStyles = {
    small: { height: 4, fontSize: '10px' },
    medium: { height: 6, fontSize: '12px' },
    large: { height: 8, fontSize: '14px' }
  };

  const currentSize = sizeStyles[size];

  return (
    <div
      className={`progress-bar-container ${className}`}
      style={{
        width: '100%',
        ...style
      }}
    >
      {/* Label and Percentage */}
      {(label || showPercentage) && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '4px',
          fontSize: currentSize.fontSize,
          color: 'var(--color-text)'
        }}>
          {label && (
            <span style={{ fontWeight: '500' }}>{label}</span>
          )}
          {showPercentage && (
            <span style={{ 
              color: 'var(--color-text-light)',
              fontFamily: 'monospace'
            }}>
              {Math.round(normalizedProgress)}%
            </span>
          )}
        </div>
      )}

      {/* Progress Bar Track */}
      <div style={{
        width: '100%',
        height: `${currentSize.height}px`,
        backgroundColor,
        borderRadius: `${currentSize.height / 2}px`,
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Progress Bar Fill */}
        <div
          style={{
            width: `${normalizedProgress}%`,
            height: '100%',
            backgroundColor: color,
            borderRadius: `${currentSize.height / 2}px`,
            transition: animated ? 'width 0.3s ease' : 'none',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Animated stripe effect for active progress */}
          {animated && normalizedProgress > 0 && normalizedProgress < 100 && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `linear-gradient(
                  45deg,
                  rgba(255, 255, 255, 0.2) 25%,
                  transparent 25%,
                  transparent 50%,
                  rgba(255, 255, 255, 0.2) 50%,
                  rgba(255, 255, 255, 0.2) 75%,
                  transparent 75%,
                  transparent
                )`,
                backgroundSize: '20px 20px',
                animation: 'progress-stripes 1s linear infinite'
              }}
            />
          )}
        </div>

        {/* Indeterminate progress (when progress is 0 but operation is active) */}
        {normalizedProgress === 0 && animated && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
              animation: 'progress-indeterminate 2s ease-in-out infinite'
            }}
          />
        )}
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes progress-stripes {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 20px 0;
          }
        }

        @keyframes progress-indeterminate {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
};

export default ProgressBar;