/**
 * Cloud Configuration Management
 * 
 * Centralized exports for all cloud configuration functionality
 */

// Core configuration
export {
  GOOGLE_DRIVE_CONFIG,
  isGoogleDriveConfigured,
  getConfigurationStatus,
  getConfigurationErrorMessage,
  validateConfiguration,
  getDebugConfiguration
} from './google-credentials';

// Configuration validation
export {
  validateGoogleDriveConfiguration,
  getSetupInstructions,
  generateConfigurationReport,
  isProductionReady,
  getQuickStatus
} from './config-validator';

// Types
export type { ValidationResult, SetupInstructions } from './config-validator';

/**
 * Initialize cloud configuration system
 * Call this early in the application lifecycle
 */
export function initializeCloudConfiguration(): void {
  validateConfiguration();
  
  // Log configuration status in development
  if (!import.meta.env.PROD) {
    const validation = validateGoogleDriveConfiguration(true);
    if (!validation.isValid) {
      console.group('🔧 Google Drive Configuration');
      console.warn('Configuration issues detected:', validation.errors);
      if (validation.suggestions.length > 0) {
        console.info('Suggestions:', validation.suggestions);
      }
      console.groupEnd();
    } else {
      console.info('✅ Google Drive configuration is valid');
    }
  }
}

/**
 * Check if any cloud provider is configured and ready
 */
export function isAnyCloudProviderReady(): boolean {
  return isGoogleDriveConfigured();
}

/**
 * Get list of available cloud providers with their status
 */
export function getAvailableProviders(): Array<{
  name: string;
  displayName: string;
  configured: boolean;
  status: 'ready' | 'needs-setup' | 'error';
  message: string;
}> {
  const googleStatus = getQuickStatus();
  
  return [
    {
      name: 'googledrive',
      displayName: 'Google Drive',
      configured: isGoogleDriveConfigured(),
      status: googleStatus.status,
      message: googleStatus.message
    }
    // Future providers can be added here
  ];
}