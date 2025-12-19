/**
 * Property-based test for multi-provider independence
 * Tests that multiple OAuth providers can be managed independently
 */

import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import * as fc from 'fast-check';
import { OAuthManager } from '../../services/oauth/core/OAuthManager';
import { GoogleOAuthProvider } from '../../services/oauth/providers/GoogleOAuthProvider';
import type { OAuthProvider, OAuthTokens } from '../../services/oauth/interfaces';

// Mock provider for testing
class MockOAuthProvider implements OAuthProvider {
  readonly name: string;
  readonly displayName: string;
  readonly authorizationUrl = 'https://example.com/oauth/authorize';
  readonly tokenUrl = 'https://example.com/oauth/token';
  readonly scope = ['read', 'write'];
  readonly clientId: string;

  constructor(name: string, displayName: string, clientId: string) {
    this.name = name;
    this.displayName = displayName;
    this.clientId = clientId;
  }

  buildAuthUrl(redirectUri: string, state: string, codeChallenge: string): string {
    return `${this.authorizationUrl}?client_id=${this.clientId}&redirect_uri=${redirectUri}&state=${state}&code_challenge=${codeChallenge}`;
  }

  async exchangeCodeForTokens(code: string, redirectUri: string, codeVerifier: string): Promise<any> {
    return {
      access_token: `mock_access_token_${this.name}_${code}`,
      refresh_token: `mock_refresh_token_${this.name}_${code}`,
      expires_in: 3600,
      token_type: 'Bearer',
      scope: this.scope.join(' ')
    };
  }

  async refreshTokens(refreshToken: string): Promise<any> {
    return {
      access_token: `refreshed_access_token_${this.name}_${refreshToken}`,
      refresh_token: refreshToken,
      expires_in: 3600,
      token_type: 'Bearer',
      scope: this.scope.join(' ')
    };
  }

  async validateTokens(tokens: OAuthTokens): Promise<boolean> {
    // Mock validation - tokens are valid if they contain the provider name
    return tokens.accessToken.includes(this.name);
  }
}

describe('Multi-Provider Independence', () => {
  let oauthManager: OAuthManager;

  beforeEach(() => {
    // Create a fresh instance for each test
    oauthManager = new OAuthManager();
  });

  afterEach(async () => {
    // Clean up any stored tokens
    const providers = oauthManager.getRegisteredProviders();
    for (const provider of providers) {
      try {
        await oauthManager.logout(provider);
      } catch (error) {
        // Ignore cleanup errors
      }
    }
  });

  /**
   * Feature: tauri-oauth-implementation, Property 10: Multi-Provider Independence
   * Validates: Requirements 5.4
   * 
   * For any multiple configured providers, their authentication states and credentials 
   * should be managed independently without interference
   */
  test('Property 10: Multi-Provider Independence - providers operate independently', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(
          fc.record({
            name: fc.string({ minLength: 1, maxLength: 20 }).filter(s => /^[a-zA-Z0-9-_]+$/.test(s)),
            displayName: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length >= 1),
            clientId: fc.string({ minLength: 10, maxLength: 50 }).filter(s => s.trim().length >= 10 && /^[a-zA-Z0-9._-]+$/.test(s))
          }),
          { minLength: 2, maxLength: 5 }
        ).filter(providers => {
          // Ensure all provider names are unique
          const names = providers.map(p => p.name);
          return new Set(names).size === names.length;
        }),
        async (providerConfigs) => {
          // Create a fresh OAuth manager for this property test run
          const testOAuthManager = new OAuthManager();
          
          // Register multiple providers
          const providers: MockOAuthProvider[] = [];
          for (const config of providerConfigs) {
            const provider = new MockOAuthProvider(config.name, config.displayName, config.clientId);
            providers.push(provider);
            testOAuthManager.registerProvider(provider);
          }

          // Verify all providers are registered independently
          const registeredProviders = testOAuthManager.getRegisteredProviders();
          expect(registeredProviders).toHaveLength(providerConfigs.length);
          
          for (const config of providerConfigs) {
            expect(registeredProviders).toContain(config.name);
            
            // Verify each provider can be retrieved independently
            const retrievedProvider = testOAuthManager.getProvider(config.name);
            expect(retrievedProvider).toBeDefined();
            expect(retrievedProvider?.name).toBe(config.name);
            expect(retrievedProvider?.displayName).toBe(config.displayName);
            expect(retrievedProvider?.clientId).toBe(config.clientId);
          }

          // Verify authentication status is independent for each provider
          const authStatuses = await testOAuthManager.getAuthenticationStatus();
          expect(Object.keys(authStatuses)).toHaveLength(providerConfigs.length);
          
          for (const config of providerConfigs) {
            expect(authStatuses).toHaveProperty(config.name);
            expect(authStatuses[config.name]).toBe(false); // Initially not authenticated
          }

          // Test that operations on one provider don't affect others
          if (providers.length >= 2) {
            const firstProvider = providers[0];
            const secondProvider = providers[1];

            // Mock storing tokens for first provider only
            const mockTokens: OAuthTokens = {
              accessToken: `test_token_${firstProvider.name}`,
              refreshToken: `test_refresh_${firstProvider.name}`,
              expiresAt: new Date(Date.now() + 3600000),
              scope: firstProvider.scope.join(' '),
              tokenType: 'Bearer'
            };

            // Store tokens for first provider
            const tokenStorage = (testOAuthManager as any).tokenStorage;
            if (tokenStorage) {
              await tokenStorage.storeTokens(firstProvider.name, mockTokens);
            }

            // Verify first provider shows as authenticated
            const isFirstAuth = await testOAuthManager.isAuthenticated(firstProvider.name);
            expect(isFirstAuth).toBe(true);

            // Verify second provider is still not authenticated
            const isSecondAuth = await testOAuthManager.isAuthenticated(secondProvider.name);
            expect(isSecondAuth).toBe(false);

            // Verify tokens can be retrieved independently
            const firstTokens = await testOAuthManager.getValidTokens(firstProvider.name);
            const secondTokens = await testOAuthManager.getValidTokens(secondProvider.name);

            expect(firstTokens).toBeTruthy();
            expect(firstTokens?.accessToken).toContain(firstProvider.name);
            expect(secondTokens).toBeNull();

            // Logout from first provider shouldn't affect second
            await testOAuthManager.logout(firstProvider.name);
            
            const isFirstAuthAfterLogout = await testOAuthManager.isAuthenticated(firstProvider.name);
            const isSecondAuthAfterLogout = await testOAuthManager.isAuthenticated(secondProvider.name);
            
            expect(isFirstAuthAfterLogout).toBe(false);
            expect(isSecondAuthAfterLogout).toBe(false); // Should remain unchanged
          }

          return true;
        }
      ),
      { numRuns: 50 } // Reduced runs due to async operations
    );
  });

  test('Property 10: Multi-Provider Independence - provider configurations are isolated', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            name: fc.string({ minLength: 1, maxLength: 20 }).filter(s => /^[a-zA-Z0-9-_]+$/.test(s)),
            displayName: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length >= 1),
            clientId: fc.string({ minLength: 10, maxLength: 50 }).filter(s => s.trim().length >= 10 && /^[a-zA-Z0-9._-]+$/.test(s)),
            scope: fc.array(fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length >= 1 && /^[a-zA-Z0-9._-]+$/.test(s)), { minLength: 1, maxLength: 5 })
          }),
          { minLength: 2, maxLength: 4 }
        ).filter(providers => {
          // Ensure all provider names are unique
          const names = providers.map(p => p.name);
          return new Set(names).size === names.length;
        }),
        (providerConfigs) => {
          // Create a fresh OAuth manager for this property test run
          const testOAuthManager = new OAuthManager();
          
          // Register providers with different configurations
          for (const config of providerConfigs) {
            const provider = new MockOAuthProvider(config.name, config.displayName, config.clientId);
            provider.scope.length = 0;
            provider.scope.push(...config.scope);
            testOAuthManager.registerProvider(provider);
          }

          // Verify each provider maintains its own configuration
          for (const config of providerConfigs) {
            const retrievedProvider = testOAuthManager.getProvider(config.name);
            expect(retrievedProvider).toBeDefined();
            
            // Verify configuration isolation
            expect(retrievedProvider?.name).toBe(config.name);
            expect(retrievedProvider?.displayName).toBe(config.displayName);
            expect(retrievedProvider?.clientId).toBe(config.clientId);
            expect(retrievedProvider?.scope).toEqual(config.scope);
            
            // Verify auth URL generation is provider-specific
            const authUrl = retrievedProvider?.buildAuthUrl(
              'http://localhost:8080/callback',
              'test-state',
              'test-challenge'
            );
            expect(authUrl).toContain(config.clientId);
            expect(authUrl).toContain('test-state');
            expect(authUrl).toContain('test-challenge');
          }

          // Verify providers don't interfere with each other's configurations
          const allProviders = providerConfigs.map(config => testOAuthManager.getProvider(config.name));
          for (let i = 0; i < allProviders.length; i++) {
            for (let j = i + 1; j < allProviders.length; j++) {
              const providerA = allProviders[i];
              const providerB = allProviders[j];
              
              // Ensure providers have different configurations
              expect(providerA?.name).not.toBe(providerB?.name);
              expect(providerA?.clientId).not.toBe(providerB?.clientId);
              
              // Ensure auth URLs are different
              const authUrlA = providerA?.buildAuthUrl('http://test', 'state', 'challenge');
              const authUrlB = providerB?.buildAuthUrl('http://test', 'state', 'challenge');
              expect(authUrlA).not.toBe(authUrlB);
            }
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});