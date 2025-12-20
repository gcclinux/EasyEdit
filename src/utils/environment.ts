/**
 * Environment detection utilities
 */

/**
 * Check if the app is running in Tauri
 */
export function isTauriEnvironment(): boolean {
  // Check for Tauri-specific globals and environment indicators
  // In Tauri v2, window.__TAURI_INTERNALS__ is the reliable global
  const hasTauriGlobals = typeof window !== 'undefined' &&
    ((window as any).__TAURI__ !== undefined ||
      (window as any).__TAURI_INTERNALS__ !== undefined ||
      (window as any).__TAURI_INVOKE__ !== undefined);

  // Check for Tauri protocols/origins
  const isTauriOrigin = typeof window !== 'undefined' && (
    window.location.protocol === 'tauri:' ||
    window.location.hostname === 'tauri' ||
    window.location.hostname === 'tauri.localhost' ||
    window.location.origin === 'tauri://localhost'
  );

  return hasTauriGlobals || isTauriOrigin;
}

/**
 * Check if the app is running in a web browser
 */
export function isWebEnvironment(): boolean {
  return typeof window !== 'undefined' &&
    (window as any).__TAURI__ === undefined &&
    (window as any).__TAURI_INTERNALS__ === undefined;
}

/**
 * Check if the app is running in development mode
 */
export function isDevelopmentMode(): boolean {
  // In Node.js/Jest environment
  if (typeof process !== 'undefined' && process.env) {
    return process.env.NODE_ENV === 'development';
  }

  // In Vite environment (only when import.meta is available)
  try {
    if (typeof window !== 'undefined' && (window as any).import?.meta?.env) {
      return (window as any).import.meta.env.MODE === 'development';
    }
  } catch (e) {
    // Ignore import.meta access errors in test environments
  }

  return false;
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