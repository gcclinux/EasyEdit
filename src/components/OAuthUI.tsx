/**
 * OAuthUI - Main OAuth authentication UI component
 * Orchestrates OAuth buttons, status indicators, loading states, and error handling
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5
 */

import React, { useState, useEffect } from 'react';
import { OAuthManager } from '../services/oauth/core/OAuthManager';
import { GoogleOAuthProvider } from '../services/oauth/providers/GoogleOAuthProvider';
import OAuthButton from './OAuthButton';
import OAuthStatusIndicator, { type OAuthProvider } from './OAuthStatusIndicator';
import OAuthLoadingModal, { type OAuthLoadingState } from './OAuthLoadingModal';
import OAuthErrorModal, { type OAuthErrorType } from './OAuthErrorModal';
import './oauthButton.css';
import './oauthStatusIndicator.css';
import './oauthLoadingModal.css';
import './oauthErrorModal.css';

export interface OAuthUIProps {
  onAuthenticationSuccess?: (provider: string, tokens: any) => void;
  onAuthenticationError?: (provider: string, error: string) => void;
  onProviderDisconnect?: (provider: string) => void;
  showStatusIndicator?: boolean;
  compact?: boolean;
  className?: string;
}

const OAuthUI: React.FC<OAuthUIProps> = ({
  onAuthenticationSuccess,
  onAuthenticationError,
  onProviderDisconnect,
  showStatusIndicator = true,
  compact = false,
  className = ''
}) => {
  // OAuth Manager instance
  const [oauthManager] = useState(() => new OAuthManager());
  
  // Provider states
  const [providers, setProviders] = useState<OAuthProvider[]>([]);
  
  // Loading modal state
  const [loadingModal, setLoadingModal] = useState({
    isOpen: false,
    state: 'initiating' as OAuthLoadingState,
    providerName: '',
    message: '',
    progress: undefined as number | undefined,
    authUrl: undefined as string | undefined
  });
  
  // Error modal state
  const [errorModal, setErrorModal] = useState({
    isOpen: false,
    errorType: 'unknown_error' as OAuthErrorType,
    errorMessage: '',
    providerName: '',
    authUrl: undefined as string | undefined
  });

  // Initialize OAuth providers
  useEffect(() => {
    const initializeProviders = async () => {
      try {
        // Register Google OAuth provider
        const googleProvider = new GoogleOAuthProvider();
        oauthManager.registerProvider(googleProvider);
        
        // Initialize provider states
        const initialProviders: OAuthProvider[] = [
          {
            name: 'google',
            displayName: 'Google Drive',
            isConnected: false,
            isAuthenticating: false,
            hasError: false
          }
        ];
        
        setProviders(initialProviders);
        
        // Check existing authentication status
        await updateAuthenticationStatus();
        
      } catch (error) {
        console.error('Failed to initialize OAuth providers:', error);
      }
    };
    
    initializeProviders();
  }, [oauthManager]);

  // Update authentication status for all providers
  const updateAuthenticationStatus = async () => {
    try {
      const status = await oauthManager.getAuthenticationStatus();
      
      setProviders(prevProviders => 
        prevProviders.map(provider => ({
          ...provider,
          isConnected: status[provider.name] || false,
          isAuthenticating: false,
          hasError: false
        }))
      );
    } catch (error) {
      console.error('Failed to update authentication status:', error);
    }
  };

  // Handle OAuth authentication
  const handleAuthenticate = async (providerName: string) => {
    const provider = providers.find(p => p.name === providerName);
    if (!provider) return;

    try {
      // Update provider state to authenticating
      setProviders(prev => 
        prev.map(p => 
          p.name === providerName 
            ? { ...p, isAuthenticating: true, hasError: false, errorMessage: undefined }
            : p
        )
      );

      // Show loading modal - initiating
      setLoadingModal({
        isOpen: true,
        state: 'initiating',
        providerName: provider.displayName,
        message: `Setting up secure connection to ${provider.displayName}...`,
        progress: undefined,
        authUrl: undefined
      });

      // Small delay to show initiating state
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update to waiting for browser
      setLoadingModal(prev => ({
        ...prev,
        state: 'waiting_for_browser',
        message: `Please complete the authentication in your browser.`
      }));

      // Start OAuth flow
      const result = await oauthManager.authenticate(providerName);

      if (result.success && result.tokens) {
        // Update to token exchange
        setLoadingModal(prev => ({
          ...prev,
          state: 'exchanging_tokens',
          progress: 75
        }));

        // Small delay to show token exchange
        await new Promise(resolve => setTimeout(resolve, 500));

        // Update to storing tokens
        setLoadingModal(prev => ({
          ...prev,
          state: 'storing_tokens',
          progress: 90
        }));

        // Small delay to show storing
        await new Promise(resolve => setTimeout(resolve, 500));

        // Show success
        setLoadingModal(prev => ({
          ...prev,
          state: 'success',
          progress: 100,
          message: `Successfully connected to ${provider.displayName}!`
        }));

        // Update provider state
        setProviders(prev => 
          prev.map(p => 
            p.name === providerName 
              ? { ...p, isConnected: true, isAuthenticating: false, hasError: false }
              : p
          )
        );

        // Notify parent component
        if (onAuthenticationSuccess) {
          onAuthenticationSuccess(providerName, result.tokens);
        }

        // Auto-close success modal after 2 seconds
        setTimeout(() => {
          setLoadingModal(prev => ({ ...prev, isOpen: false }));
        }, 2000);

      } else {
        // Authentication failed
        const errorType = mapErrorToType(result.error || 'unknown_error');
        const errorMessage = result.errorDescription || 'Authentication failed';

        // Update provider state
        setProviders(prev => 
          prev.map(p => 
            p.name === providerName 
              ? { 
                  ...p, 
                  isConnected: false, 
                  isAuthenticating: false, 
                  hasError: true,
                  errorMessage: errorMessage
                }
              : p
          )
        );

        // Close loading modal and show error modal
        setLoadingModal(prev => ({ ...prev, isOpen: false }));
        setErrorModal({
          isOpen: true,
          errorType,
          errorMessage,
          providerName: provider.displayName,
          authUrl: undefined
        });

        // Notify parent component
        if (onAuthenticationError) {
          onAuthenticationError(providerName, errorMessage);
        }
      }

    } catch (error) {
      console.error(`OAuth authentication failed for ${providerName}:`, error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      // Update provider state
      setProviders(prev => 
        prev.map(p => 
          p.name === providerName 
            ? { 
                ...p, 
                isConnected: false, 
                isAuthenticating: false, 
                hasError: true,
                errorMessage: errorMessage
              }
            : p
        )
      );

      // Close loading modal and show error modal
      setLoadingModal(prev => ({ ...prev, isOpen: false }));
      setErrorModal({
        isOpen: true,
        errorType: 'unknown_error',
        errorMessage,
        providerName: provider.displayName,
        authUrl: undefined
      });

      // Notify parent component
      if (onAuthenticationError) {
        onAuthenticationError(providerName, errorMessage);
      }
    }
  };

  // Handle provider disconnect
  const handleDisconnect = async (providerName: string) => {
    try {
      await oauthManager.logout(providerName);
      
      // Update provider state
      setProviders(prev => 
        prev.map(p => 
          p.name === providerName 
            ? { ...p, isConnected: false, isAuthenticating: false, hasError: false }
            : p
        )
      );

      // Notify parent component
      if (onProviderDisconnect) {
        onProviderDisconnect(providerName);
      }
      
    } catch (error) {
      console.error(`Failed to disconnect from ${providerName}:`, error);
    }
  };

  // Handle retry authentication
  const handleRetry = (providerName: string) => {
    setErrorModal(prev => ({ ...prev, isOpen: false }));
    handleAuthenticate(providerName);
  };

  // Handle cancel authentication
  const handleCancel = () => {
    setLoadingModal(prev => ({ ...prev, isOpen: false }));
    
    // Reset any authenticating providers
    setProviders(prev => 
      prev.map(p => ({ ...p, isAuthenticating: false }))
    );
  };

  // Map error strings to error types
  const mapErrorToType = (error: string): OAuthErrorType => {
    if (error.includes('browser_launch_failed')) return 'browser_launch_failed';
    if (error.includes('user_cancelled')) return 'user_cancelled';
    if (error.includes('network_error')) return 'network_error';
    if (error.includes('server_error')) return 'server_error';
    if (error.includes('invalid_grant')) return 'invalid_grant';
    if (error.includes('access_denied')) return 'access_denied';
    if (error.includes('timeout')) return 'timeout';
    if (error.includes('csrf_attack')) return 'csrf_attack';
    if (error.includes('token_storage_error')) return 'token_storage_error';
    if (error.includes('provider_not_found')) return 'provider_not_found';
    return 'unknown_error';
  };

  return (
    <div className={`oauth-ui ${className}`}>
      {/* OAuth Provider Buttons */}
      <div className="oauth-ui-buttons">
        {providers.map((provider) => (
          <OAuthButton
            key={provider.name}
            provider={provider.name}
            displayName={provider.displayName}
            isConnected={provider.isConnected}
            isAuthenticating={provider.isAuthenticating}
            hasError={provider.hasError}
            errorMessage={provider.errorMessage}
            onClick={() => handleAuthenticate(provider.name)}
            onRetry={() => handleRetry(provider.name)}
          />
        ))}
      </div>

      {/* OAuth Status Indicator */}
      {showStatusIndicator && (
        <OAuthStatusIndicator
          providers={providers}
          onDisconnect={handleDisconnect}
          compact={compact}
        />
      )}

      {/* Loading Modal */}
      <OAuthLoadingModal
        isOpen={loadingModal.isOpen}
        state={loadingModal.state}
        providerName={loadingModal.providerName}
        message={loadingModal.message}
        progress={loadingModal.progress}
        authUrl={loadingModal.authUrl}
        onCancel={handleCancel}
        onRetry={() => handleRetry(loadingModal.providerName)}
        onClose={() => setLoadingModal(prev => ({ ...prev, isOpen: false }))}
      />

      {/* Error Modal */}
      <OAuthErrorModal
        isOpen={errorModal.isOpen}
        errorType={errorModal.errorType}
        errorMessage={errorModal.errorMessage}
        providerName={errorModal.providerName}
        authUrl={errorModal.authUrl}
        onRetry={() => handleRetry(errorModal.providerName)}
        onClose={() => setErrorModal(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};

export default OAuthUI;