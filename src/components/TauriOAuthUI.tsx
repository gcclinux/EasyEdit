/**
 * Tauri OAuth UI Component
 * Provides OAuth authentication interface for Tauri desktop environment
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5
 */

import React, { useState, useEffect, useCallback } from 'react';
import { TauriOAuthManager, createOAuthManager } from '../services/oauth/tauri';
import type { OAuthResult } from '../services/oauth/interfaces';
import './oauthUI.css';

interface TauriOAuthUIProps {
  onAuthSuccess?: (provider: string, result: OAuthResult) => void;
  onAuthError?: (provider: string, error: string) => void;
  onStatusChange?: (provider: string, isAuthenticated: boolean) => void;
  className?: string;
}

interface ProviderStatus {
  isAuthenticated: boolean;
  isLoading: boolean;
  error?: string;
  lastRefresh?: Date;
}

/**
 * Tauri OAuth UI Component for desktop authentication
 */
export const TauriOAuthUI: React.FC<TauriOAuthUIProps> = ({
  onAuthSuccess,
  onAuthError,
  onStatusChange,
  className = ''
}) => {
  const [oauthManager] = useState<TauriOAuthManager>(() => {
    const manager = createOAuthManager();
    return manager instanceof TauriOAuthManager ? manager : new TauriOAuthManager();
  });
  
  const [providers, setProviders] = useState<string[]>([]);
  const [providerStatus, setProviderStatus] = useState<Record<string, ProviderStatus>>({});
  const [isInitializing, setIsInitializing] = useState(true);
  const [globalError, setGlobalError] = useState<string | null>(null);

  /**
   * Initialize OAuth manager and load provider status
   */
  const initializeOAuth = useCallback(async () => {
    try {
      setIsInitializing(true);
      setGlobalError(null);

      // Get available providers
      const availableProviders = oauthManager.getRegisteredProviders();
      setProviders(availableProviders);

      // Get authentication status for all providers
      const statusMap = await oauthManager.getAuthenticationStatus();
      
      const newProviderStatus: Record<string, ProviderStatus> = {};
      for (const provider of availableProviders) {
        newProviderStatus[provider] = {
          isAuthenticated: statusMap[provider] || false,
          isLoading: false
        };
      }
      
      setProviderStatus(newProviderStatus);

      // Validate tokens on startup
      const validationResults = await oauthManager.validateStoredTokensOnStartup();
      
      // Update status based on validation results
      for (const [provider, result] of Object.entries(validationResults)) {
        if (newProviderStatus[provider]) {
          newProviderStatus[provider].isAuthenticated = result === 'valid' || result === 'refreshed';
          if (result === 'refreshed') {
            newProviderStatus[provider].lastRefresh = new Date();
          }
        }
      }
      
      setProviderStatus({ ...newProviderStatus });

    } catch (error) {
      console.error('Failed to initialize OAuth:', error);
      setGlobalError(error instanceof Error ? error.message : 'Failed to initialize OAuth');
    } finally {
      setIsInitializing(false);
    }
  }, [oauthManager]);

  /**
   * Handle OAuth authentication for a provider
   */
  const handleAuthenticate = useCallback(async (provider: string) => {
    try {
      setProviderStatus(prev => ({
        ...prev,
        [provider]: {
          ...prev[provider],
          isLoading: true,
          error: undefined
        }
      }));

      const result = await oauthManager.authenticate(provider);
      
      if (result.success) {
        setProviderStatus(prev => ({
          ...prev,
          [provider]: {
            ...prev[provider],
            isAuthenticated: true,
            isLoading: false,
            error: undefined,
            lastRefresh: new Date()
          }
        }));

        onAuthSuccess?.(provider, result);
        onStatusChange?.(provider, true);
        
      } else {
        const errorMessage = result.errorDescription || result.error || 'Authentication failed';
        
        setProviderStatus(prev => ({
          ...prev,
          [provider]: {
            ...prev[provider],
            isAuthenticated: false,
            isLoading: false,
            error: errorMessage
          }
        }));

        onAuthError?.(provider, errorMessage);
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
      
      setProviderStatus(prev => ({
        ...prev,
        [provider]: {
          ...prev[provider],
          isAuthenticated: false,
          isLoading: false,
          error: errorMessage
        }
      }));

      onAuthError?.(provider, errorMessage);
    }
  }, [oauthManager, onAuthSuccess, onAuthError, onStatusChange]);

  /**
   * Handle OAuth logout for a provider
   */
  const handleLogout = useCallback(async (provider: string) => {
    try {
      setProviderStatus(prev => ({
        ...prev,
        [provider]: {
          ...prev[provider],
          isLoading: true,
          error: undefined
        }
      }));

      await oauthManager.logout(provider);
      
      setProviderStatus(prev => ({
        ...prev,
        [provider]: {
          ...prev[provider],
          isAuthenticated: false,
          isLoading: false,
          error: undefined
        }
      }));

      onStatusChange?.(provider, false);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Logout failed';
      
      setProviderStatus(prev => ({
        ...prev,
        [provider]: {
          ...prev[provider],
          isLoading: false,
          error: errorMessage
        }
      }));
    }
  }, [oauthManager, onStatusChange]);

  /**
   * Handle token refresh for a provider
   */
  const handleRefreshTokens = useCallback(async (provider: string) => {
    try {
      setProviderStatus(prev => ({
        ...prev,
        [provider]: {
          ...prev[provider],
          isLoading: true,
          error: undefined
        }
      }));

      const success = await oauthManager.refreshTokens(provider);
      
      if (success) {
        setProviderStatus(prev => ({
          ...prev,
          [provider]: {
            ...prev[provider],
            isAuthenticated: true,
            isLoading: false,
            error: undefined,
            lastRefresh: new Date()
          }
        }));

        onStatusChange?.(provider, true);
        
      } else {
        // Refresh failed, might need re-authentication
        const refreshFailure = await oauthManager.handleTokenRefreshFailure(provider);
        
        setProviderStatus(prev => ({
          ...prev,
          [provider]: {
            ...prev[provider],
            isAuthenticated: false,
            isLoading: false,
            error: refreshFailure.message
          }
        }));

        onStatusChange?.(provider, false);
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Token refresh failed';
      
      setProviderStatus(prev => ({
        ...prev,
        [provider]: {
          ...prev[provider],
          isLoading: false,
          error: errorMessage
        }
      }));
    }
  }, [oauthManager, onStatusChange]);

  /**
   * Get display name for provider
   */
  const getProviderDisplayName = (provider: string): string => {
    const providerObj = oauthManager.getProvider(provider);
    return providerObj?.displayName || provider.charAt(0).toUpperCase() + provider.slice(1);
  };

  /**
   * Initialize on component mount
   */
  useEffect(() => {
    initializeOAuth();
    
    // Cleanup on unmount
    return () => {
      oauthManager.cleanup();
    };
  }, [initializeOAuth, oauthManager]);

  if (isInitializing) {
    return (
      <div className={`oauth-ui tauri-oauth-ui ${className}`}>
        <div className="oauth-loading">
          <div className="loading-spinner"></div>
          <p>Initializing OAuth...</p>
        </div>
      </div>
    );
  }

  if (globalError) {
    return (
      <div className={`oauth-ui tauri-oauth-ui ${className}`}>
        <div className="oauth-error">
          <h3>OAuth Initialization Error</h3>
          <p>{globalError}</p>
          <button onClick={initializeOAuth} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`oauth-ui tauri-oauth-ui ${className}`}>
      <div className="oauth-header">
        <h3>Cloud Service Authentication</h3>
        <p>Connect your cloud storage accounts to sync your notes</p>
      </div>

      <div className="oauth-providers">
        {providers.map(provider => {
          const status = providerStatus[provider];
          const displayName = getProviderDisplayName(provider);

          return (
            <div key={provider} className={`oauth-provider ${status?.isAuthenticated ? 'authenticated' : 'not-authenticated'}`}>
              <div className="provider-info">
                <div className="provider-name">
                  <h4>{displayName}</h4>
                  <div className={`status-indicator ${status?.isAuthenticated ? 'connected' : 'disconnected'}`}>
                    {status?.isAuthenticated ? 'Connected' : 'Not Connected'}
                  </div>
                </div>
                
                {status?.lastRefresh && (
                  <div className="last-refresh">
                    Last refreshed: {status.lastRefresh.toLocaleString()}
                  </div>
                )}
              </div>

              <div className="provider-actions">
                {status?.isAuthenticated ? (
                  <>
                    <button
                      onClick={() => handleRefreshTokens(provider)}
                      disabled={status.isLoading}
                      className="refresh-button"
                      title="Refresh authentication tokens"
                    >
                      {status.isLoading ? 'Refreshing...' : 'Refresh'}
                    </button>
                    <button
                      onClick={() => handleLogout(provider)}
                      disabled={status.isLoading}
                      className="logout-button"
                    >
                      {status.isLoading ? 'Disconnecting...' : 'Disconnect'}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleAuthenticate(provider)}
                    disabled={status?.isLoading}
                    className="connect-button"
                  >
                    {status?.isLoading ? 'Connecting...' : `Connect ${displayName}`}
                  </button>
                )}
              </div>

              {status?.error && (
                <div className="provider-error">
                  <p>{status.error}</p>
                  {!status.isAuthenticated && (
                    <button
                      onClick={() => handleAuthenticate(provider)}
                      className="retry-button"
                    >
                      Retry
                    </button>
                  )}
                </div>
              )}

              {status?.isLoading && (
                <div className="provider-loading">
                  <div className="loading-spinner small"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {providers.length === 0 && (
        <div className="no-providers">
          <p>No OAuth providers configured</p>
          <p>Please check your OAuth configuration</p>
        </div>
      )}
    </div>
  );
};

export default TauriOAuthUI;