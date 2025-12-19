/**
 * OAuthButton - OAuth provider connection button component
 * Provides visual feedback during authentication process
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5
 */

import React from 'react';
import { FaGoogle, FaSpinner, FaCheck, FaExclamationTriangle } from 'react-icons/fa';

export interface OAuthButtonProps {
  provider: string;
  displayName: string;
  isConnected: boolean;
  isAuthenticating: boolean;
  hasError: boolean;
  errorMessage?: string;
  disabled?: boolean;
  onClick: () => void;
  onRetry?: () => void;
  className?: string;
}

const OAuthButton: React.FC<OAuthButtonProps> = ({
  provider,
  displayName,
  isConnected,
  isAuthenticating,
  hasError,
  errorMessage,
  disabled = false,
  onClick,
  onRetry,
  className = ''
}) => {
  const getProviderIcon = () => {
    switch (provider.toLowerCase()) {
      case 'google':
        return <FaGoogle />;
      default:
        return <FaGoogle />; // Default to Google icon for now
    }
  };

  const getButtonState = () => {
    if (isAuthenticating) {
      return {
        icon: <FaSpinner className="fa-spin" />,
        text: `Connecting to ${displayName}...`,
        className: 'oauth-button-authenticating',
        disabled: true
      };
    }
    
    if (hasError) {
      return {
        icon: <FaExclamationTriangle />,
        text: `Retry ${displayName}`,
        className: 'oauth-button-error',
        disabled: false
      };
    }
    
    if (isConnected) {
      return {
        icon: <FaCheck />,
        text: `Connected to ${displayName}`,
        className: 'oauth-button-connected',
        disabled: false
      };
    }
    
    return {
      icon: getProviderIcon(),
      text: `Connect to ${displayName}`,
      className: 'oauth-button-default',
      disabled: disabled
    };
  };

  const buttonState = getButtonState();
  
  const handleClick = () => {
    if (buttonState.disabled || disabled) return;
    
    if (hasError && onRetry) {
      onRetry();
    } else if (!isConnected) {
      onClick();
    }
  };

  return (
    <div className={`oauth-button-container ${className}`}>
      <button
        className={`oauth-button ${buttonState.className}`}
        onClick={handleClick}
        disabled={buttonState.disabled || disabled}
        title={hasError ? errorMessage : undefined}
      >
        <span className="oauth-button-icon">
          {buttonState.icon}
        </span>
        <span className="oauth-button-text">
          {buttonState.text}
        </span>
      </button>
      
      {hasError && errorMessage && (
        <div className="oauth-button-error-message">
          <FaExclamationTriangle />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};

export default OAuthButton;