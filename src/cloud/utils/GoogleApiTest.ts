/**
 * Google API Test Utilities
 * 
 * Provides testing and validation functions for Google Drive API integration
 */

import { GOOGLE_DRIVE_CONFIG } from '../config/google-credentials';

/**
 * Test Google API Key validity
 */
export async function testGoogleApiKey(): Promise<{
  success: boolean;
  message: string;
  details?: any;
}> {
  try {
    // Test API key with a simple API call
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY || 'your-development-api-key';
    
    try {
      const response = await fetch(
        `https://www.googleapis.com/discovery/v1/apis/drive/v3/rest?key=${apiKey}`
      );
      
      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          message: 'API Key is valid and working',
          details: {
            apiName: data.name,
            version: data.version,
            title: data.title
          }
        };
      } else {
        return {
          success: false,
          message: `API Key test failed: ${response.status} ${response.statusText}`,
          details: { status: response.status, statusText: response.statusText }
        };
      }
    } catch (networkError) {
      return {
        success: false,
        message: 'Network error testing API Key',
        details: { error: networkError }
      };
    }
  } catch (error) {
    return {
      success: false,
      message: 'Error testing API Key',
      details: { error }
    };
  }
}

/**
 * Test OAuth Client ID configuration
 */
export async function testOAuthClientId(): Promise<{
  success: boolean;
  message: string;
  details?: any;
}> {
  try {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your-development-client-id.apps.googleusercontent.com';
    const currentOrigin = window.location.origin;
    
    // Basic format validation
    if (!clientId.endsWith('.apps.googleusercontent.com')) {
      return {
        success: false,
        message: 'Client ID format appears invalid',
        details: { 
          clientId: clientId.substring(0, 20) + '...', 
          expectedFormat: '*.apps.googleusercontent.com' 
        }
      };
    }
    
    // Check if current domain is in authorized domains
    const isAuthorized = GOOGLE_DRIVE_CONFIG.AUTHORIZED_DOMAINS.some(domain => 
      currentOrigin === domain || currentOrigin.startsWith(domain)
    );
    
    if (!isAuthorized) {
      return {
        success: false,
        message: 'Current domain not in authorized domains',
        details: {
          currentOrigin,
          authorizedDomains: GOOGLE_DRIVE_CONFIG.AUTHORIZED_DOMAINS
        }
      };
    }
    
    return {
      success: true,
      message: 'OAuth Client ID configuration looks valid',
      details: {
        clientIdPrefix: clientId.substring(0, 20) + '...',
        currentOrigin,
        authorizedDomains: GOOGLE_DRIVE_CONFIG.AUTHORIZED_DOMAINS
      }
    };
    
  } catch (error) {
    return {
      success: false,
      message: 'Error testing OAuth Client ID',
      details: { error }
    };
  }
}

/**
 * Run comprehensive Google API tests
 */
export async function runGoogleApiTests(): Promise<{
  overall: boolean;
  tests: {
    apiKey: Awaited<ReturnType<typeof testGoogleApiKey>>;
    clientId: Awaited<ReturnType<typeof testOAuthClientId>>;
  };
}> {
  const apiKeyTest = await testGoogleApiKey();
  const clientIdTest = await testOAuthClientId();
  
  return {
    overall: apiKeyTest.success && clientIdTest.success,
    tests: {
      apiKey: apiKeyTest,
      clientId: clientIdTest
    }
  };
}

/**
 * Get Google API configuration summary (safe for logging)
 */
export function getGoogleApiConfigSummary(): Record<string, any> {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'not-configured';
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY || 'not-configured';
  
  return {
    environment: import.meta.env.MODE,
    clientIdConfigured: clientId !== 'not-configured' && !clientId.includes('your-'),
    apiKeyConfigured: apiKey !== 'not-configured' && !apiKey.includes('your-'),
    authorizedDomains: GOOGLE_DRIVE_CONFIG.AUTHORIZED_DOMAINS,
    currentOrigin: typeof window !== 'undefined' ? window.location.origin : 'server-side',
    // Safe prefixes only
    clientIdPrefix: clientId.substring(0, 10) + '...',
    apiKeyPrefix: apiKey.substring(0, 10) + '...'
  };
}