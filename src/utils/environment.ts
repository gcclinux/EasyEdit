/**
 * Environment detection utilities
 */

/**
 * Check if the app is running in Tauri
 */
export function isTauriEnvironment(): boolean {
  // Check for Tauri-specific globals
  return typeof window !== 'undefined' && 
         (window as any).__TAURI__ !== undefined;
}

/**
 * Check if the app is running in a web browser
 */
export function isWebEnvironment(): boolean {
  return typeof window !== 'undefined' && 
         (window as any).__TAURI__ === undefined;
}

/**
 * Check if the app is running in development mode
 */
export function isDevelopmentMode(): boolean {
  return import.meta.env.MODE === 'development';
}

/**
 * Get the current environment type
 */
export function getEnvironmentType(): 'tauri' | 'web' | 'unknown' {
  if (typeof window === 'undefined') {
    return 'unknown';
  }
  
  if (isTauriEnvironment()) {
    return 'tauri';
  }
  
  if (isWebEnvironment()) {
    return 'web';
  }
  
  return 'unknown';
}

/**
 * Get environment-specific configuration
 */
export function getEnvironmentConfig() {
  const envType = getEnvironmentType();
  const isDev = isDevelopmentMode();
  
  return {
    type: envType,
    isDevelopment: isDev,
    isProduction: !isDev,
    isTauri: envType === 'tauri',
    isWeb: envType === 'web',
    supportsPopups: envType === 'web', // Tauri doesn't support popups
    supportsSystemBrowser: envType === 'tauri', // Tauri can open system browser
  };
}