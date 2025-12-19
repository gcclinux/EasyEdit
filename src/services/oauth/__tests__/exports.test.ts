/**
 * Tests for OAuth module exports
 * Verifies that all exports are available and properly structured
 */

describe('OAuth Module Exports', () => {
  test('should export all interfaces from main module', async () => {
    const oauthModule = await import('../index');
    
    // Verify that the module exports exist (types are not runtime values)
    expect(typeof oauthModule).toBe('object');
  });
  
  test('should export core components', async () => {
    const coreModule = await import('../core');
    
    expect(coreModule.OAuthManager).toBeDefined();
    expect(coreModule.CallbackServer).toBeDefined();
    expect(coreModule.BrowserLauncher).toBeDefined();
    expect(coreModule.TokenStorage).toBeDefined();
    expect(coreModule.StateManager).toBeDefined();
  });
  
  test('should export providers', async () => {
    const providersModule = await import('../providers');
    
    expect(providersModule.GoogleOAuthProvider).toBeDefined();
  });
  
  test('should export utilities', async () => {
    const utilsModule = await import('../utils');
    
    expect(utilsModule.dependenciesAvailable).toBeDefined();
    expect(typeof utilsModule.dependenciesAvailable).toBe('object');
  });
  
  test('core classes should be instantiable (even if not implemented)', () => {
    const { OAuthManager, CallbackServer, BrowserLauncher, TokenStorage, StateManager } = require('../core');
    const { GoogleOAuthProvider } = require('../providers');
    
    expect(() => new OAuthManager()).not.toThrow();
    expect(() => new CallbackServer()).not.toThrow();
    expect(() => new BrowserLauncher()).not.toThrow();
    expect(() => new TokenStorage()).not.toThrow();
    expect(() => new StateManager()).not.toThrow();
    expect(() => new GoogleOAuthProvider('test-client-id')).not.toThrow();
  });
});