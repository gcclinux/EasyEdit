/**
 * OAuth service module - Browser-compatible exports
 * Main entry point for OAuth functionality in browser/Tauri frontend
 */

// Export interfaces
export type * from './interfaces';

// Export browser-compatible core components
export * from './core/index.browser';

// Export providers (these should be browser-compatible)
export * from './providers';

// Export utils (these should be browser-compatible)
export * from './utils';

// Export Tauri integration
export * from './tauri';