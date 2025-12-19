/**
 * Core OAuth Integration Tests
 * Tests OAuth functionality without Tauri dependencies
 * Focuses on core OAuth workflows and cross-platform compatibility
 */

import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import * as fc from 'fast-check';
import { OAuthManager } from '../core/OAuthManager';
import { StateManager } from '../core/StateManager';
import { TokenStorage } from '../core/TokenStorage';
import type { 
  OAuthProvider, 
  OAuthTokens, 
  OAuthConfig 
} from '../interfaces';

describe('Core OAuth Integration Tests', () => {
  let oauthManager: OAuthManager;
  let mockProvider: OAuthProvider;
  
  beforeEach(() => {
    // Create OAuth manager with test configuration
    const testConfig: Partial<OAuthConfig> = {
      providers: {
        'test-provider': {
          clientId: 'test-client-id',
          enabled: true,
          scope: ['read', 'write']
        }
      },
      callbackServer: {
        host: '127.0.0.1',
        portRange: [8080, 8090],
        timeout: 5000,
        maxRetries: 2
      },
      security: {
        stateExpiration: 300000,
        pkceMethod: 'S256',
        tokenEncryption: true,
        tokenRefreshBuffer: 60000,
        maxAuthAttempts: 3,
        lockoutDuration: 300000
      }
    };
    
    oauthManager = new OAuthManager(testConfig);
    
    // Enable test provider
    oauthManager.updateConfig({
      providers: {
        'test-provider': {
          clientId: 'test-client-id',
          enabled: true,
          scope: ['read', 'write']
        }
      }
    });
    
    // Create mock provider for testing
    mockProvider = {
      name: 'test-provider',
      displayName: 'Test Provider',
      authorizationUrl: 'https://auth.test.com/oauth/authorize',
      tokenUrl: 'https://auth.test.com/oauth/token',
      scope: ['read', 'write'],
      clientId: 'test-client-id',
      buildAuthUrl: (redirectUri: string, state: string, codeChallenge: string) => 
        `https://auth.test.com/oauth/authorize?client_id=test-client-id&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&code_challenge=${codeChallenge}`,
      exchangeCodeForTokens: async (code: string, redirectUri: string, codeVerifier: string) => ({
        access_token: 'test-access-token',
        refresh_token: 'test-refresh-token',
        expires_in: 3600,
        token_type: 'Bearer',
        scope: 'read write'
      }),
      refreshTokens: async (refreshToken: string) => ({
        access_token: 'refreshed-access-token',
        refresh_token: 'new-refresh-token',
        expires_in: 3600,
        token_type: 'Bearer'
      }),
      validateTokens: async (tokens: OAuthTokens) => true
    };
  });

  /**
   * Test 1: Provider Registration and Management
   * Validates provider registration and retrieval functionality
   */
  test('Provider registration and management', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            name: fc.string({ minLength: 1, maxLength: 20 }).filter(s => /^[a-zA-Z0-9-_]+$/.test(s)),
            clientId: fc.string({ minLength: 10, maxLength: 50 }),
            displayName: fc.string({ minLength: 1, maxLength: 50 })
          }),
          { minLength: 1, maxLength: 5 }
        ),
        (providerConfigs) => {
          // Clear any existing providers from previous test runs
          oauthManager['providers'].clear();
          
          // Ensure unique provider names
          const uniqueConfigs = providerConfigs.filter((config, index, array) => 
            array.findIndex(c => c.name === config.name) === index
          );
          
          if (uniqueConfigs.length === 0) return true;
          
          // Create and register providers directly (skip updateConfig to avoid ProviderFactory limitations)
          // But first, add them to the configuration so they're enabled
          for (const config of uniqueConfigs) {
            try {
              oauthManager['configManager'].addProviderConfig(config.name, {
                clientId: config.clientId,
                enabled: true,
                scope: ['read', 'write']
              });
            } catch (error) {
              // Provider might already exist from previous test runs, update it instead
              if (error.message.includes('already exists')) {
                oauthManager['configManager'].updateProviderConfig(config.name, {
                  clientId: config.clientId,
                  enabled: true,
                  scope: ['read', 'write']
                });
              } else {
                throw error;
              }
            }
          }
          
          for (const config of uniqueConfigs) {
            const provider: OAuthProvider = {
              name: config.name,
              displayName: config.displayName,
              authorizationUrl: 'https://auth.example.com/oauth/authorize',
              tokenUrl: 'https://auth.example.com/oauth/token',
              scope: ['read', 'write'],
              clientId: config.clientId,
              buildAuthUrl: (redirectUri, state, codeChallenge) => 
                `https://auth.example.com/oauth/authorize?client_id=${config.clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&code_challenge=${codeChallenge}`,
              exchangeCodeForTokens: async () => ({
                access_token: 'test-token',
                expires_in: 3600,
                token_type: 'Bearer'
              }),
              refreshTokens: async () => ({
                access_token: 'refreshed-token',
                expires_in: 3600,
                token_type: 'Bearer'
              }),
              validateTokens: async () => true
            };
            
            oauthManager.registerProvider(provider);
          }
          
          // Verify all providers are registered
          const registeredProviders = oauthManager.getRegisteredProviders();
          expect(registeredProviders).toHaveLength(uniqueConfigs.length);
          
          // Verify each provider can be retrieved
          for (const config of uniqueConfigs) {
            const retrievedProvider = oauthManager.getProvider(config.name);
            expect(retrievedProvider).toBeTruthy();
            expect(retrievedProvider?.name).toBe(config.name);
            expect(retrievedProvider?.clientId).toBe(config.clientId);
            expect(retrievedProvider?.displayName).toBe(config.displayName);
          }
          
          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Test 2: OAuth URL Building and Parameter Validation
   * Tests authorization URL construction with security parameters
   */
  test('OAuth URL building and parameter validation', () => {
    fc.assert(
      fc.property(
        fc.record({
          redirectUri: fc.string({ minLength: 10, maxLength: 100 }).map(s => `http://localhost:8080/${s}`),
          state: fc.string({ minLength: 32, maxLength: 64 }),
          codeChallenge: fc.string({ minLength: 43, maxLength: 128 })
        }),
        ({ redirectUri, state, codeChallenge }) => {
          // Register test provider
          oauthManager.registerProvider(mockProvider);
          
          // Build authorization URL
          const authUrl = mockProvider.buildAuthUrl(redirectUri, state, codeChallenge);
          
          // Verify URL structure
          expect(authUrl).toContain('https://auth.test.com/oauth/authorize');
          expect(authUrl).toContain(`client_id=${mockProvider.clientId}`);
          expect(authUrl).toContain(`redirect_uri=${encodeURIComponent(redirectUri)}`);
          expect(authUrl).toContain(`state=${state}`);
          expect(authUrl).toContain(`code_challenge=${codeChallenge}`);
          
          // Verify URL is valid
          expect(() => new URL(authUrl)).not.toThrow();
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Test 3: Token Exchange and Validation
   * Tests token exchange process and validation
   */
  test('Token exchange and validation', async () => {
    // Register provider
    oauthManager.registerProvider(mockProvider);
    
    // Test token exchange
    const tokenResponse = await mockProvider.exchangeCodeForTokens(
      'test-auth-code',
      'http://localhost:8080/callback',
      'test-code-verifier'
    );
    
    expect(tokenResponse.access_token).toBe('test-access-token');
    expect(tokenResponse.refresh_token).toBe('test-refresh-token');
    expect(tokenResponse.expires_in).toBe(3600);
    expect(tokenResponse.token_type).toBe('Bearer');
    
    // Test token validation
    const tokens: OAuthTokens = {
      accessToken: tokenResponse.access_token,
      refreshToken: tokenResponse.refresh_token || '',
      expiresAt: new Date(Date.now() + tokenResponse.expires_in * 1000),
      scope: tokenResponse.scope || 'read write',
      tokenType: tokenResponse.token_type
    };
    
    const isValid = await mockProvider.validateTokens(tokens);
    expect(isValid).toBe(true);
  });

  /**
   * Test 4: Token Refresh Functionality
   * Tests token refresh process
   */
  test('Token refresh functionality', async () => {
    // Register provider
    oauthManager.registerProvider(mockProvider);
    
    // Test token refresh
    const refreshResponse = await mockProvider.refreshTokens('test-refresh-token');
    
    expect(refreshResponse.access_token).toBe('refreshed-access-token');
    expect(refreshResponse.refresh_token).toBe('new-refresh-token');
    expect(refreshResponse.expires_in).toBe(3600);
    expect(refreshResponse.token_type).toBe('Bearer');
  });

  /**
   * Test 5: Security Parameter Generation
   * Tests state and PKCE parameter generation
   */
  test('Security parameter generation', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 10 }),
        (iterations) => {
          const stateManager = new StateManager({
            stateExpiration: 300000,
            pkceMethod: 'S256',
            tokenEncryption: true,
            tokenRefreshBuffer: 60000,
            maxAuthAttempts: 3,
            lockoutDuration: 300000
          });
          
          const generatedStates = new Set<string>();
          const generatedVerifiers = new Set<string>();
          const generatedChallenges = new Set<string>();
          
          for (let i = 0; i < iterations; i++) {
            // Generate state parameter
            const state = stateManager.generateState();
            expect(state.length).toBeGreaterThanOrEqual(32);
            expect(state).toMatch(/^[A-Za-z0-9_-]+$/);
            generatedStates.add(state);
            
            // Generate PKCE parameters
            const pkce = stateManager.generatePKCE();
            expect(pkce.codeVerifier.length).toBeGreaterThanOrEqual(43);
            expect(pkce.codeVerifier.length).toBeLessThanOrEqual(128);
            expect(pkce.codeVerifier).toMatch(/^[A-Za-z0-9_-]+$/);
            expect(pkce.codeChallenge.length).toBeGreaterThan(0);
            generatedVerifiers.add(pkce.codeVerifier);
            generatedChallenges.add(pkce.codeChallenge);
          }
          
          // Verify uniqueness (all generated values should be different)
          expect(generatedStates.size).toBe(iterations);
          expect(generatedVerifiers.size).toBe(iterations);
          expect(generatedChallenges.size).toBe(iterations);
          
          return true;
        }
      ),
      { numRuns: 20 }
    );
  });

  /**
   * Test 6: Multi-Provider Independence
   * Tests that multiple providers work independently
   */
  test('Multi-provider independence', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            name: fc.string({ minLength: 1, maxLength: 20 }).filter(s => /^[a-zA-Z0-9-_]+$/.test(s)),
            clientId: fc.string({ minLength: 10, maxLength: 50 }),
            scope: fc.array(fc.string({ minLength: 1, maxLength: 20 }), { minLength: 1, maxLength: 5 })
          }),
          { minLength: 2, maxLength: 5 }
        ),
        (providerConfigs) => {
          // Clear any existing providers from previous test runs
          oauthManager['providers'].clear();
          
          // Ensure unique provider names
          const uniqueConfigs = providerConfigs.filter((config, index, array) => 
            array.findIndex(c => c.name === config.name) === index
          );
          
          if (uniqueConfigs.length < 2) return true;
          
          // Register multiple providers directly (skip updateConfig to avoid ProviderFactory limitations)
          // But first, add them to the configuration so they're enabled
          for (const config of uniqueConfigs) {
            try {
              oauthManager['configManager'].addProviderConfig(config.name, {
                clientId: config.clientId,
                enabled: true,
                scope: config.scope
              });
            } catch (error) {
              // Provider might already exist from previous test runs, update it instead
              if (error.message.includes('already exists')) {
                oauthManager['configManager'].updateProviderConfig(config.name, {
                  clientId: config.clientId,
                  enabled: true,
                  scope: config.scope
                });
              } else {
                throw error;
              }
            }
          }
          
          for (const config of uniqueConfigs) {
            const provider: OAuthProvider = {
              name: config.name,
              displayName: `Provider ${config.name}`,
              authorizationUrl: `https://${config.name}.auth.com/oauth/authorize`,
              tokenUrl: `https://${config.name}.auth.com/oauth/token`,
              scope: config.scope,
              clientId: config.clientId,
              buildAuthUrl: (redirectUri, state, codeChallenge) => 
                `https://${config.name}.auth.com/oauth/authorize?client_id=${config.clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&code_challenge=${codeChallenge}`,
              exchangeCodeForTokens: async () => ({
                access_token: `${config.name}-access-token`,
                refresh_token: `${config.name}-refresh-token`,
                expires_in: 3600,
                token_type: 'Bearer',
                scope: config.scope.join(' ')
              }),
              refreshTokens: async () => ({
                access_token: `${config.name}-refreshed-token`,
                expires_in: 3600,
                token_type: 'Bearer'
              }),
              validateTokens: async (tokens) => tokens.accessToken.includes(config.name)
            };
            
            oauthManager.registerProvider(provider);
          }
          
          // Verify all providers are registered independently
          const registeredProviders = oauthManager.getRegisteredProviders();
          expect(registeredProviders).toHaveLength(uniqueConfigs.length);
          
          // Verify each provider maintains its own configuration
          for (const config of uniqueConfigs) {
            const provider = oauthManager.getProvider(config.name);
            expect(provider).toBeTruthy();
            expect(provider?.name).toBe(config.name);
            expect(provider?.clientId).toBe(config.clientId);
            expect(provider?.scope).toEqual(config.scope);
            
            // Verify provider-specific URLs
            const authUrl = provider?.buildAuthUrl('http://localhost:8080/callback', 'test-state', 'test-challenge');
            expect(authUrl).toContain(config.name);
            expect(authUrl).toContain(config.clientId);
          }
          
          return true;
        }
      ),
      { numRuns: 20 }
    );
  });

  /**
   * Test 7: Error Handling Scenarios
   * Tests various error conditions
   */
  test('Error handling scenarios', async () => {
    // Test 1: Provider not found
    const nonExistentProvider = oauthManager.getProvider('non-existent-provider');
    expect(nonExistentProvider).toBeUndefined();
    
    // Test 2: Invalid token response
    const invalidTokenProvider: OAuthProvider = {
      ...mockProvider,
      name: 'invalid-token-provider',
      exchangeCodeForTokens: async () => ({
        error: 'invalid_grant',
        error_description: 'The authorization code is invalid'
      } as any)
    };
    
    oauthManager.registerProvider(invalidTokenProvider);
    
    const invalidResponse = await invalidTokenProvider.exchangeCodeForTokens('invalid-code', 'http://localhost:8080/callback', 'test-verifier') as any;
    expect(invalidResponse.error).toBe('invalid_grant');
    expect(invalidResponse.error_description).toBe('The authorization code is invalid');
    
    // Test 3: Token validation failure
    const failingValidationProvider: OAuthProvider = {
      ...mockProvider,
      name: 'failing-validation-provider',
      validateTokens: async () => false
    };
    
    oauthManager.registerProvider(failingValidationProvider);
    
    const mockTokens: OAuthTokens = {
      accessToken: 'invalid-token',
      refreshToken: 'invalid-refresh',
      expiresAt: new Date(Date.now() + 3600000),
      scope: 'read',
      tokenType: 'Bearer'
    };
    
    const isValid = await failingValidationProvider.validateTokens(mockTokens);
    expect(isValid).toBe(false);
    
    // Test 4: Network error simulation
    const networkErrorProvider: OAuthProvider = {
      ...mockProvider,
      name: 'network-error-provider',
      exchangeCodeForTokens: async () => {
        throw new Error('Network timeout');
      }
    };
    
    oauthManager.registerProvider(networkErrorProvider);
    
    await expect(
      networkErrorProvider.exchangeCodeForTokens('test-code', 'http://localhost:8080/callback', 'test-verifier')
    ).rejects.toThrow('Network timeout');
  });

  /**
   * Test 8: Token Storage Integration
   * Tests token storage functionality
   */
  test('Token storage integration', async () => {
    const tokenStorage = new TokenStorage();
    
    // Test token storage and retrieval
    const testTokens: OAuthTokens = {
      accessToken: 'test-access-token-12345',
      refreshToken: 'test-refresh-token-67890',
      expiresAt: new Date(Date.now() + 3600000),
      scope: 'read write',
      tokenType: 'Bearer'
    };
    
    // Store tokens
    await tokenStorage.storeTokens('test-provider', testTokens);
    
    // Retrieve tokens
    const retrievedTokens = await tokenStorage.getTokens('test-provider');
    expect(retrievedTokens).toBeTruthy();
    expect(retrievedTokens?.accessToken).toBe(testTokens.accessToken);
    expect(retrievedTokens?.refreshToken).toBe(testTokens.refreshToken);
    expect(retrievedTokens?.tokenType).toBe(testTokens.tokenType);
    expect(retrievedTokens?.scope).toBe(testTokens.scope);
    
    // Test token removal
    await tokenStorage.removeTokens('test-provider');
    const removedTokens = await tokenStorage.getTokens('test-provider');
    expect(removedTokens).toBeNull();
  });
});