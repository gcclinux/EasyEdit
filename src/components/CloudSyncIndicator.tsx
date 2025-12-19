/**
 * CloudSyncIndicator - Shows background sync status and progress
 * Provides visual feedback for ongoing cloud operations
 */

import React, { useState, useEffect } from 'react';
import { FaSync, FaCloud, FaWifi, FaExclamationTriangle } from 'react-icons/fa';
import { offlineManager } from '../cloud/utils/OfflineManager';

interface SyncStatus {
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncTime?: Date;
  syncProgress?: number;
  activeOperations: number;
  hasErrors: boolean;
}

interface CloudSyncIndicatorProps {
  className?: string;
  style?: React.CSSProperties;
  showDetails?: boolean;
}

const CloudSyncIndicator: React.FC<CloudSyncIndicatorProps> = ({
  className = '',
  style = {},
  showDetails = false
}) => {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isOnline: true,
    isSyncing: false,
    activeOperations: 0,
    hasErrors: false
  });

  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Listen for offline state changes
    const handleOfflineStateChange = (state: any) => {
      setSyncStatus(prev => ({
        ...prev,
        isOnline: state.isOnline
      }));
    };

    offlineManager.addListener(handleOfflineStateChange);

    // Initialize with current state
    setSyncStatus(prev => ({
      ...prev,
      isOnline: offlineManager.isCurrentlyOnline()
    }));

    return () => {
      offlineManager.removeListener(handleOfflineStateChange);
    };
  }, []);

  // Simulate sync status updates (in a real implementation, this would come from CloudManager)
  useEffect(() => {
    const interval = setInterval(() => {
      // This is a placeholder - in real implementation, sync status would come from CloudManager
      setSyncStatus(prev => {
        if (prev.isSyncing && prev.syncProgress !== undefined) {
          const newProgress = Math.min(prev.syncProgress + 10, 100);
          return {
            ...prev,
            syncProgress: newProgress,
            isSyncing: newProgress < 100,
            lastSyncTime: newProgress >= 100 ? new Date() : prev.lastSyncTime
          };
        }
        return prev;
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = () => {
    if (!syncStatus.isOnline) {
      return <FaWifi style={{ color: 'var(--color-error)', opacity: 0.5 }} />;
    }
    
    if (syncStatus.hasErrors) {
      return <FaExclamationTriangle style={{ color: 'var(--color-warning)' }} />;
    }
    
    if (syncStatus.isSyncing) {
      return <FaSync className="fa-spin" style={{ color: 'var(--color-primary)' }} />;
    }
    
    return <FaCloud style={{ color: 'var(--color-success)' }} />;
  };

  const getStatusText = () => {
    if (!syncStatus.isOnline) {
      return 'Offline';
    }
    
    if (syncStatus.hasErrors) {
      return 'Sync errors';
    }
    
    if (syncStatus.isSyncing) {
      const progress = syncStatus.syncProgress || 0;
      return `Syncing... ${progress}%`;
    }
    
    if (syncStatus.lastSyncTime) {
      const timeDiff = Date.now() - syncStatus.lastSyncTime.getTime();
      const minutes = Math.floor(timeDiff / 60000);
      
      if (minutes < 1) {
        return 'Just synced';
      } else if (minutes < 60) {
        return `Synced ${minutes}m ago`;
      } else {
        const hours = Math.floor(minutes / 60);
        return `Synced ${hours}h ago`;
      }
    }
    
    return 'Ready to sync';
  };

  const getStatusColor = () => {
    if (!syncStatus.isOnline) return 'var(--color-error)';
    if (syncStatus.hasErrors) return 'var(--color-warning)';
    if (syncStatus.isSyncing) return 'var(--color-primary)';
    return 'var(--color-success)';
  };

  const tooltipContent = (
    <div style={{
      position: 'absolute',
      bottom: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: 'var(--bg-tooltip)',
      color: 'var(--color-text-tooltip)',
      padding: '8px 12px',
      borderRadius: '6px',
      fontSize: '12px',
      whiteSpace: 'nowrap',
      zIndex: 1000,
      marginBottom: '5px',
      border: '1px solid var(--border-secondary)',
      boxShadow: '0 2px 8px var(--shadow-md)'
    }}>
      {getStatusText()}
      {syncStatus.activeOperations > 0 && (
        <div style={{ marginTop: '4px', fontSize: '11px', opacity: 0.8 }}>
          {syncStatus.activeOperations} operation{syncStatus.activeOperations !== 1 ? 's' : ''} active
        </div>
      )}
      {/* Tooltip arrow */}
      <div style={{
        position: 'absolute',
        top: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 0,
        height: 0,
        borderLeft: '5px solid transparent',
        borderRight: '5px solid transparent',
        borderTop: '5px solid var(--bg-tooltip)'
      }} />
    </div>
  );

  return (
    <div
      className={`cloud-sync-indicator ${className}`}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 8px',
        borderRadius: '4px',
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-secondary)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        ...style
      }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      title={showDetails ? undefined : getStatusText()}
    >
      {/* Status Icon */}
      <div style={{ fontSize: '14px', display: 'flex', alignItems: 'center' }}>
        {getStatusIcon()}
      </div>

      {/* Progress Bar (when syncing) */}
      {syncStatus.isSyncing && syncStatus.syncProgress !== undefined && (
        <div style={{
          width: '60px',
          height: '3px',
          backgroundColor: 'var(--bg-input)',
          borderRadius: '2px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${syncStatus.syncProgress}%`,
            height: '100%',
            backgroundColor: 'var(--color-primary)',
            transition: 'width 0.3s ease'
          }} />
        </div>
      )}

      {/* Status Text (if showDetails is true) */}
      {showDetails && (
        <span style={{
          fontSize: '12px',
          color: getStatusColor(),
          fontWeight: '500'
        }}>
          {getStatusText()}
        </span>
      )}

      {/* Active Operations Count */}
      {syncStatus.activeOperations > 0 && (
        <span style={{
          fontSize: '10px',
          backgroundColor: 'var(--color-primary)',
          color: 'white',
          borderRadius: '8px',
          padding: '1px 4px',
          minWidth: '16px',
          textAlign: 'center'
        }}>
          {syncStatus.activeOperations}
        </span>
      )}

      {/* Tooltip */}
      {showTooltip && !showDetails && tooltipContent}
    </div>
  );
};

export default CloudSyncIndicator;