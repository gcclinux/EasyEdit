/**
 * Configuration Validator for Google Drive Integration
 * 
 * Provides comprehensive validation and setup guidance for Google Drive API configuration
 */

import { GOOGLE_DRIVE_CONFIG, getConfigurationStatus, getDebugConfiguration } from './google-credentials';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
  debugInfo?: Record<string, any>;
}

export interface SetupInstructions {
  title: string;
  steps: string[];
  links: { text: string; url: string }[];
}

/**
 * Comprehensive configuration validation
 */
export function validateGoogleDriveConfiguration(includeDebugInfo = false): ValidationResult {
  const status = getConfigurationStatus();
  const errors: string[] = [];
  const warnings: string[] = [];
  const suggestions: string[] = [];

  // Check basic configuration
  if (!status.clientIdConfigured) {
    errors.push('Google OAuth Client ID is not configured');
    suggestions.push('Set VITE_GOOGLE_CLIENT_ID in your .env.local file');
  }

  if (!status.apiKeyConfigured) {
    errors.push('Google API Key is not configured');
    suggestions.push('Set VITE_GOOGLE_API_KEY in your .env.local file');
  }

  // Validate Client ID format
  if (status.clientIdConfigured) {
    if (!GOOGLE_DRIVE_CONFIG.CLIENT_ID.endsWith('.apps.googleusercontent.com')) {
      errors.push('Client ID format appears invalid (should end with .apps.googleusercontent.com)');
    }
  }

  // Check environment-specific issues
  if (status.environment === 'development') {
    if (typeof window !== 'undefined') {
      const currentOrigin = window.location.origin;
      const isLocalhost = currentOrigin.includes('localhost') || currentOrigin.includes('127.0.0.1');
      
      if (!isLocalhost) {
        warnings.push(`Development environment detected but not running on localhost: ${currentOrigin}`);
      }
    }
  }

  // Check authorized domains
  if (typeof window !== 'undefined') {
    const currentOrigin = window.location.origin;
    const isAuthorized = GOOGLE_DRIVE_CONFIG.AUTHORIZED_DOMAINS.some(domain => 
      currentOrigin === domain || currentOrigin.startsWith(domain)
    );
    
    if (!isAuthorized) {
      errors.push(`Current domain ${currentOrigin} not in authorized domains`);
      suggestions.push('Add current domain to Google Cloud Console OAuth settings');
    }
  }

  // Check for common configuration mistakes
  if (GOOGLE_DRIVE_CONFIG.CLIENT_ID.includes('your-')) {
    suggestions.push('Replace placeholder values in configuration with actual Google Cloud Console credentials');
  }

  if (GOOGLE_DRIVE_CONFIG.API_KEY.includes('your-')) {
    suggestions.push('Replace placeholder API key with actual Google Cloud Console API key');
  }

  // Environment-specific suggestions
  if (status.environment === 'development' && !status.configured) {
    suggestions.push('Follow the setup guide in GOOGLE_DRIVE_SETUP.md for development configuration');
  }

  return {
    isValid: status.configured && errors.length === 0,
    errors,
    warnings,
    suggestions,
    debugInfo: includeDebugInfo ? getDebugConfiguration() : undefined
  };
}

/**
 * Get setup instructions based on current environment and issues
 */
export function getSetupInstructions(): SetupInstructions {
  const status = getConfigurationStatus();

  if (status.environment === 'development') {
    return {
      title: 'Google Drive Development Setup',
      steps: [
        'Open Google Cloud Console (https://console.cloud.google.com/)',
        'Create a new project or select existing project',
        'Enable Google Drive API in APIs & Services > Library',
        'Configure OAuth consent screen with your app details',
        'Create OAuth 2.0 Client ID credentials for web application',
        'Add http://localhost:3024 to authorized JavaScript origins',
        'Create an API Key and restrict it to Google Drive API',
        'Copy credentials to .env.local file',
        'Restart the development server'
      ],
      links: [
        { text: 'Google Cloud Console', url: 'https://console.cloud.google.com/' },
        { text: 'Setup Guide', url: './GOOGLE_DRIVE_SETUP.md' },
        { text: 'Google Drive API Documentation', url: 'https://developers.google.com/drive/api/guides/about-sdk' }
      ]
    };
  }

  return {
    title: 'Google Drive Production Setup',
    steps: [
      'Configure production OAuth 2.0 credentials in Google Cloud Console',
      'Add production domain to authorized JavaScript origins',
      'Set production environment variables in deployment configuration',
      'Test OAuth flow in production environment',
      'Monitor API usage and quotas'
    ],
    links: [
      { text: 'Google Cloud Console', url: 'https://console.cloud.google.com/' },
      { text: 'Production Deployment Guide', url: './GOOGLE_DRIVE_SETUP.md#production-deployment' }
    ]
  };
}

/**
 * Generate configuration report for debugging
 */
export function generateConfigurationReport(): string {
  const validation = validateGoogleDriveConfiguration(true);
  const instructions = getSetupInstructions();
  
  let report = '# Google Drive Configuration Report\n\n';
  
  report += `**Status:** ${validation.isValid ? '✅ Valid' : '❌ Invalid'}\n\n`;
  
  if (validation.debugInfo) {
    report += '## Configuration Details\n';
    report += `- Environment: ${validation.debugInfo.environment}\n`;
    report += `- Client ID Configured: ${validation.debugInfo.clientIdConfigured ? '✅' : '❌'}\n`;
    report += `- API Key Configured: ${validation.debugInfo.apiKeyConfigured ? '✅' : '❌'}\n`;
    report += `- Authorized Domains: ${validation.debugInfo.authorizedDomains.join(', ')}\n\n`;
  }
  
  if (validation.errors.length > 0) {
    report += '## Errors\n';
    validation.errors.forEach(error => {
      report += `- ❌ ${error}\n`;
    });
    report += '\n';
  }
  
  if (validation.warnings.length > 0) {
    report += '## Warnings\n';
    validation.warnings.forEach(warning => {
      report += `- ⚠️ ${warning}\n`;
    });
    report += '\n';
  }
  
  if (validation.suggestions.length > 0) {
    report += '## Suggestions\n';
    validation.suggestions.forEach(suggestion => {
      report += `- 💡 ${suggestion}\n`;
    });
    report += '\n';
  }
  
  report += `## ${instructions.title}\n`;
  instructions.steps.forEach((step, index) => {
    report += `${index + 1}. ${step}\n`;
  });
  
  if (instructions.links.length > 0) {
    report += '\n## Helpful Links\n';
    instructions.links.forEach(link => {
      report += `- [${link.text}](${link.url})\n`;
    });
  }
  
  return report;
}

/**
 * Check if configuration is ready for production use
 */
export function isProductionReady(): boolean {
  const validation = validateGoogleDriveConfiguration();
  const status = getConfigurationStatus();
  
  return validation.isValid && 
         status.environment === 'production' &&
         validation.errors.length === 0;
}

/**
 * Get quick configuration status for UI display
 */
export function getQuickStatus(): {
  status: 'ready' | 'needs-setup' | 'error';
  message: string;
  actionRequired: boolean;
} {
  const validation = validateGoogleDriveConfiguration();
  
  if (validation.isValid) {
    return {
      status: 'ready',
      message: 'Google Drive integration is configured and ready to use',
      actionRequired: false
    };
  }
  
  if (validation.errors.length > 0) {
    return {
      status: 'error',
      message: `Configuration errors: ${validation.errors[0]}`,
      actionRequired: true
    };
  }
  
  return {
    status: 'needs-setup',
    message: 'Google Drive integration needs to be configured',
    actionRequired: true
  };
}