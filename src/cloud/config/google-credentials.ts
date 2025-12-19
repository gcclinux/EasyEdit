/**
 * Google Drive API Configuration for EasyEdit
 * 
 * This configuration supports multiple deployment environments and provides
 * comprehensive credential management for Google Drive integration.
 */

/**
 * Safe environment variable access that works in both Vite and Jest environments
 */
function getEnvVar(key: string): string | undefined {
  // In Node.js/Jest environment (check first as it's more reliable)
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key];
  }
  
  // In Vite environment (only when import.meta is available)
  try {
    if (typeof window !== 'undefined' && 'import' in window && (window as any).import?.meta?.env) {
      return (window as any).import.meta.env[key];
    }
  } catch (e) {
    // Ignore import.meta access errors in test environments
  }
  
  return undefined;
}

/**
 * Get current build mode safely
 */
function getBuildMode(): string {
  // In Node.js/Jest environment (check first)
  if (typeof process !== 'undefined' && process.env) {
    return process.env.NODE_ENV || 'development';
  }
  
  // In Vite environment (only when import.meta is available)
  try {
    if (typeof window !== 'undefined' && 'import' in window && (window as any).import?.meta?.env) {
      return (window as any).import.meta.env.MODE || 'development';
    }
  } catch (e) {
    // Ignore import.meta access errors in test environments
  }
  
  return 'development';
}

interface GoogleDriveEnvironmentConfig {
  CLIENT_ID: string;
  API_KEY: string;
  AUTHORIZED_DOMAINS: string[];
  REDIRECT_URI?: string;
}

interface GoogleDriveConfig {
  CLIENT_ID: string;
  API_KEY: string;
  SCOPES: string[];
  DISCOVERY_DOC: string;
  AUTHORIZED_DOMAINS: string[];
  REDIRECT_URI?: string;
}

/**
 * Environment-specific configurations
 */
const ENVIRONMENT_CONFIGS: Record<string, GoogleDriveEnvironmentConfig> = {
  development: {
    CLIENT_ID: getEnvVar('VITE_GOOGLE_CLIENT_ID') || 
               'your-development-client-id.apps.googleusercontent.com',
    API_KEY: getEnvVar('VITE_GOOGLE_API_KEY') || 
             'your-development-api-key',
    AUTHORIZED_DOMAINS: [
      'http://localhost:3024',
      'https://localhost:3024',
      'http://127.0.0.1:3024',
      'https://127.0.0.1:3024',
      'http://tauri.localhost',
      'https://tauri.localhost'
    ],
    REDIRECT_URI: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3024'
  },
  
  production: {
    CLIENT_ID: getEnvVar('VITE_GOOGLE_CLIENT_ID_PROD') || 
               'your-production-client-id.apps.googleusercontent.com',
    API_KEY: getEnvVar('VITE_GOOGLE_API_KEY_PROD') || 
             'your-production-api-key',
    AUTHORIZED_DOMAINS: [
      'https://easyeditor.co.uk',
      'https://www.easyeditor.co.uk'
    ],
    REDIRECT_URI: 'https://easyeditor.co.uk'
  }
};

/**
 * Detect current environment
 */
function getCurrentEnvironment(): string {
  // Check explicit environment variable first
  const explicitEnv = getEnvVar('VITE_ENVIRONMENT');
  if (explicitEnv && ENVIRONMENT_CONFIGS[explicitEnv]) {
    return explicitEnv;
  }
  
  // Check if running in Tauri (always use development config for Tauri)
  if (typeof window !== 'undefined' && window.location.origin.includes('tauri.localhost')) {
    return 'development';
  }
  
  // Auto-detect based on build mode
  if (getBuildMode() === 'production') {
    return 'production';
  }
  
  return 'development';
}

/**
 * Get configuration for current environment
 */
function getEnvironmentConfig(): GoogleDriveEnvironmentConfig {
  const environment = getCurrentEnvironment();
  const config = ENVIRONMENT_CONFIGS[environment];
  
  if (!config) {
    console.warn(`Unknown environment: ${environment}, falling back to development`);
    return ENVIRONMENT_CONFIGS.development;
  }
  
  return config;
}

/**
 * Main Google Drive configuration object
 */
export const GOOGLE_DRIVE_CONFIG: GoogleDriveConfig = (() => {
  const envConfig = getEnvironmentConfig();
  
  return {
    CLIENT_ID: envConfig.CLIENT_ID,
    API_KEY: envConfig.API_KEY,
    AUTHORIZED_DOMAINS: envConfig.AUTHORIZED_DOMAINS,
    REDIRECT_URI: envConfig.REDIRECT_URI,
    
    // OAuth scopes required by EasyEdit
    SCOPES: [
      'https://www.googleapis.com/auth/drive.file' // Only access files created by EasyEdit
    ],
    
    // Discovery document for Google Drive API v3
    DISCOVERY_DOC: 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'
  };
})();

/**
 * Check if Google Drive credentials are properly configured
 */
export function isGoogleDriveConfigured(): boolean {
  const hasValidClientId = Boolean(GOOGLE_DRIVE_CONFIG.CLIENT_ID && 
                          !GOOGLE_DRIVE_CONFIG.CLIENT_ID.includes('your-') &&
                          GOOGLE_DRIVE_CONFIG.CLIENT_ID.length > 10);
                          
  const hasValidApiKey = Boolean(GOOGLE_DRIVE_CONFIG.API_KEY && 
                        !GOOGLE_DRIVE_CONFIG.API_KEY.includes('your-') &&
                        GOOGLE_DRIVE_CONFIG.API_KEY.length > 10);
                        
  return hasValidClientId && hasValidApiKey;
}

/**
 * Get detailed configuration status
 */
export function getConfigurationStatus(): {
  configured: boolean;
  environment: string;
  clientIdConfigured: boolean;
  apiKeyConfigured: boolean;
  issues: string[];
} {
  const environment = getCurrentEnvironment();
  const clientIdConfigured = Boolean(GOOGLE_DRIVE_CONFIG.CLIENT_ID && 
                            !GOOGLE_DRIVE_CONFIG.CLIENT_ID.includes('your-') &&
                            GOOGLE_DRIVE_CONFIG.CLIENT_ID.length > 10);
  const apiKeyConfigured = Boolean(GOOGLE_DRIVE_CONFIG.API_KEY && 
                          !GOOGLE_DRIVE_CONFIG.API_KEY.includes('your-') &&
                          GOOGLE_DRIVE_CONFIG.API_KEY.length > 10);
  
  const issues: string[] = [];
  
  if (!clientIdConfigured) {
    issues.push('OAuth Client ID not configured');
  }
  
  if (!apiKeyConfigured) {
    issues.push('API Key not configured');
  }
  
  // Check if current domain is authorized (in browser environment)
  if (typeof window !== 'undefined') {
    const currentOrigin = window.location.origin;
    const isAuthorized = GOOGLE_DRIVE_CONFIG.AUTHORIZED_DOMAINS.some(domain => 
      currentOrigin === domain || currentOrigin.startsWith(domain)
    );
    
    if (!isAuthorized) {
      issues.push(`Current domain ${currentOrigin} not in authorized domains`);
    }
  }
  
  return {
    configured: clientIdConfigured && apiKeyConfigured,
    environment,
    clientIdConfigured,
    apiKeyConfigured,
    issues
  };
}

/**
 * Get user-friendly error message for unconfigured credentials
 */
export function getConfigurationErrorMessage(): string {
  const status = getConfigurationStatus();
  
  if (status.configured) {
    return '';
  }
  
  const baseMessage = 'Google Drive integration requires configuration to function.';
  
  if (status.environment === 'development') {
    return `${baseMessage} Please follow the setup instructions in GOOGLE_DRIVE_SETUP.md to configure your development environment. Issues: ${status.issues.join(', ')}`;
  }
  
  return `${baseMessage} This feature will be available once the application is properly configured by the maintainers.`;
}

/**
 * Validate current configuration and log warnings
 */
export function validateConfiguration(): void {
  const status = getConfigurationStatus();
  
  if (!status.configured) {
    console.warn('Google Drive integration not configured:', status.issues);
  } else {
    console.info(`Google Drive integration configured for ${status.environment} environment`);
  }
  
  // Additional runtime validations
  if (typeof window !== 'undefined') {
    const currentOrigin = window.location.origin;
    const isAuthorized = GOOGLE_DRIVE_CONFIG.AUTHORIZED_DOMAINS.some(domain => 
      currentOrigin === domain || currentOrigin.startsWith(domain)
    );
    
    if (!isAuthorized) {
      console.warn(`Current domain ${currentOrigin} not in authorized domains. OAuth may fail.`);
    }
  }
}

/**
 * Get configuration for debugging (safe for logging)
 */
export function getDebugConfiguration(): Record<string, any> {
  const status = getConfigurationStatus();
  
  return {
    environment: status.environment,
    configured: status.configured,
    clientIdConfigured: status.clientIdConfigured,
    apiKeyConfigured: status.apiKeyConfigured,
    authorizedDomains: GOOGLE_DRIVE_CONFIG.AUTHORIZED_DOMAINS,
    scopes: GOOGLE_DRIVE_CONFIG.SCOPES,
    issues: status.issues,
    // Never log actual credentials
    clientIdPrefix: GOOGLE_DRIVE_CONFIG.CLIENT_ID.substring(0, 10) + '...',
    apiKeyPrefix: GOOGLE_DRIVE_CONFIG.API_KEY.substring(0, 10) + '...'
  };
}
