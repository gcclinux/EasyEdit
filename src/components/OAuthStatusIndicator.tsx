/**
 * OAuthStatusIndicator - Displays current OAuth authentication status
 * Shows connected providers and authentication state
 * Requirements: 6.4, 6.5
 */

import React from 'react';
import { FaCheck, FaExclamationTriangle, FaSpinner, FaUser, FaSignOutAlt } from 'react-icons/fa';

export interface OAuthProvider {
  name: string;
  displayName: string;
  isConnected: boolean;
  isAuthenticating: boolean;
  hasError: boolean;
  errorMessage?: string;
  userInfo?: {
    name?: string;
    email?: string;
    avatar?: string;
  };
}

export interface OAuthStatusIndicatorProps {
  providers: OAuthProvider[];
  onDisconnect?: (providerName: string) => void;
  className?: string;
  compact?: boolean;
}

const OAuthStatusIndicator: React.FC<OAuthStatusIndicatorProps> = ({
  providers,
  onDisconnect,
  className = '',
  compact = false
}) => {
  const connectedProviders = providers.filter(p => p.isConnected);
  const authenticatingProviders = providers.filter(p => p.isAuthenticating);
  const errorProviders = providers.filter(p => p.hasError);

  if (providers.length === 0) {
    return null;
  }

  const getStatusIcon = (provider: OAuthProvider) => {
    if (provider.isAuthenticating) {
      return <FaSpinner className="fa-spin oauth-status-icon-authenticating" />;
    }
    if (provider.hasError) {
      return <FaExclamationTriangle className="oauth-status-icon-error" />;
    }
    if (provider.isConnected) {
      return <FaCheck className="oauth-status-icon-connected" />;
    }
    return null;
  };

  const getStatusText = () => {
    if (authenticatingProviders.length > 0) {
      return `Connecting to ${authenticatingProviders[0].displayName}...`;
    }
    if (errorProviders.length > 0) {
      return `Authentication failed for ${errorProviders[0].displayName}`;
    }
    if (connectedProviders.length > 0) {
      return `Connected to ${connectedProviders.map(p => p.displayName).join(', ')}`;
    }
    return 'No cloud services connected';
  };

  const getStatusClass = () => {
    if (authenticatingProviders.length > 0) return 'oauth-status-authenticating';
    if (errorProviders.length > 0) return 'oauth-status-error';
    if (connectedProviders.length > 0) return 'oauth-status-connected';
    return 'oauth-status-disconnected';
  };

  if (compact) {
    return (
      <div className={`oauth-status-indicator oauth-status-compact ${getStatusClass()} ${className}`}>
        <div className="oauth-status-summary">
          {connectedProviders.length > 0 && (
            <span className="oauth-status-count">
              <FaCheck className="oauth-status-icon-connected" />
              {connectedProviders.length}
            </span>
          )}
          {authenticatingProviders.length > 0 && (
            <span className="oauth-status-count">
              <FaSpinner className="fa-spin oauth-status-icon-authenticating" />
              {authenticatingProviders.length}
            </span>
          )}
          {errorProviders.length > 0 && (
            <span className="oauth-status-count">
              <FaExclamationTriangle className="oauth-status-icon-error" />
              {errorProviders.length}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`oauth-status-indicator ${getStatusClass()} ${className}`}>
      <div className="oauth-status-header">
        <h3>Cloud Services</h3>
        <span className="oauth-status-summary-text">{getStatusText()}</span>
      </div>
      
      <div className="oauth-status-providers">
        {providers.map((provider) => (
          <div key={provider.name} className="oauth-status-provider">
            <div className="oauth-status-provider-info">
              <div className="oauth-status-provider-header">
                <span className="oauth-status-provider-icon">
                  {getStatusIcon(provider)}
                </span>
                <span className="oauth-status-provider-name">
                  {provider.displayName}
                </span>
              </div>
              
              {provider.userInfo && provider.isConnected && (
                <div className="oauth-status-user-info">
                  <FaUser className="oauth-status-user-icon" />
                  <span className="oauth-status-user-name">
                    {provider.userInfo.name || provider.userInfo.email}
                  </span>
                </div>
              )}
              
              {provider.hasError && provider.errorMessage && (
                <div className="oauth-status-error-message">
                  {provider.errorMessage}
                </div>
              )}
            </div>
            
            {provider.isConnected && onDisconnect && (
              <button
                className="oauth-status-disconnect-btn"
                onClick={() => onDisconnect(provider.name)}
                title={`Disconnect from ${provider.displayName}`}
              >
                <FaSignOutAlt />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OAuthStatusIndicator;