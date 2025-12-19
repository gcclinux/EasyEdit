/**
 * Property-based tests for OAuthManager Token Lifecycle Management
 * Tests token validation, refresh, and lifecycle operations
 */

import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import * as fc from 'fast-check';
import { OAuthManager } from '../core/OAuthManager';
import type { OAuthProvider, OAuthTokens, TokenResponse } from '../interfaces';

describe('OAuthManager Token Lifecycle', () => {
  let oauthManager: OAuthManager;

  beforeEach(() => {
    oauthManager = new OAuthManager({
      callbackServer: {
        host: '127.0.0.1',
        portRange: [8080, 8090],
        timeout: 5000,
        maxRetries: 2
      }
    });
  });

  afterEach(async () => {
    // Clean up any stored tokens after each test
    const providers = oauthManager.getRegisteredProviders();
    for (const providerName of providers) {
      try {
        await oauthManager.logout(providerName);
      } catch (error) {
        // Ignore cleanup errors
      }
    }
  });

  /**
   * Feature: tauri-oauth-implementation, Property 7: Token Lifecycle Management
   * Validates: Requirements 4.1, 4.2, 4.3, 4.5
   * 
   * For any stored tokens, the system should validate expiration, automatically refresh 
   * when possible, and handle refresh failures appropriately
   */
  test('Property 7: Token Lifecycle Management - startup validation and refresh', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          providerName: fc.string({ minLength: 1, maxLength: 20 }).filter(s => /^[a-zA-Z0-9-_]+$/.test(s)),
          clientId: fc.string({ minLength: 10, maxLength: 50 }).filter(s => s.trim().length >= 10 && /^[a-zA-Z0-9._-]+$/.test(s)),
          tokenScenario: fc.constantFrom('valid', 'expired_with_refresh', 'expired_no_refresh', 'invalid'),
          expiresInMinutes: fc.integer({ min: -60, max: 60 }), // Can be negative for expired tokens
          hasRefreshToken: fc.boolean(),
          refreshWillSucceed: fc.boolean()
        }),
        async ({ providerName, clientId, tokenScenario, expiresInMinutes, hasRefreshToken, refreshWillSucceed }) => {
          // Create a mock provider with controlled behavior
          const mockProvider: OAuthProvider = {
            name: providerName,
            displayName: `Test Provider ${providerName}`,
            authorizationUrl: 'https://auth.example.com/oauth/authorize',
            tokenUrl: 'https://auth.example.com/oauth/token',
            scope: ['read', 'write'],
            clientId: clientId,
            buildAuthUrl: () => 'https://auth.example.com/oauth/authorize',
            exchangeCodeForTokens: async () => ({
              access_token: 'new-token',
              expires_in: 3600,
              token_type: 'Bearer'
            }),
            refreshTokens: async (refreshToken: string) => {
              if (!refreshWillSucceed) {
                return {
                  access_token: '',
                  expires_in: 0,
                  token_type: 'Bearer',
                  error: 'invalid_grant',
                  error_description: 'Refresh token expired'
                };
              }
              return {
                access_token: 'refreshed-token',
                refresh_token: refreshToken, // Keep the same refresh token
                expires_in: 3600,
                token_type: 'Bearer'
              };
            },
            validateTokens: async (tokens: OAuthTokens) => {
              // Simulate validation based on expiration and scenario
              const now = new Date();
              const isNotExpired = tokens.expiresAt > now;
              return tokenScenario === 'valid' && isNotExpired;
            }
          };

          oauthManager.registerProvider(mockProvider);

          // Create test tokens based on scenario
          const expirationDate = new Date(Date.now() + (expiresInMinutes * 60 * 1000));
          const testTokens: OAuthTokens = {
            accessToken: 'test-access-token',
            refreshToken: hasRefreshToken ? 'test-refresh-token' : undefined,
            expiresAt: expirationDate,
            scope: 'read write',
            tokenType: 'Bearer'
          };

          // Store the test tokens
          await oauthManager['tokenStorage'].storeTokens(providerName, testTokens);

          // Test startup validation
          const validationResults = await oauthManager.validateStoredTokensOnStartup();
          
          // Verify the validation result matches expected behavior
          expect(validationResults).toHaveProperty(providerName);
          const result = validationResults[providerName];
          
          if (tokenScenario === 'valid' && expiresInMinutes > 0) {
            // Valid tokens should remain valid
            expect(result).toBe('valid');
          } else if (hasRefreshToken && refreshWillSucceed) {
            // Expired/invalid tokens with working refresh should be refreshed
            expect(result).toBe('refreshed');
            
            // Verify tokens were actually updated
            const updatedTokens = await oauthManager['tokenStorage'].getTokens(providerName);
            expect(updatedTokens).toBeTruthy();
            if (updatedTokens) {
              expect(updatedTokens.accessToken).toBe('refreshed-token');
              expect(updatedTokens.expiresAt.getTime()).toBeGreaterThan(Date.now());
            }
          } else {
            // Tokens that can't be refreshed should be marked as expired and cleaned up
            expect(result).toBe('expired');
            
            // Verify tokens were cleaned up
            const cleanedTokens = await oauthManager['tokenStorage'].getTokens(providerName);
            expect(cleanedTokens).toBeNull();
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  }, 60000); // 60 second timeout

  test('Property 7: Token Lifecycle Management - refresh failure handling', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          providerName: fc.string({ minLength: 1, maxLength: 20 }).filter(s => /^[a-zA-Z0-9-_]+$/.test(s)),
          clientId: fc.string({ minLength: 10, maxLength: 50 }).filter(s => s.trim().length >= 10 && /^[a-zA-Z0-9._-]+$/.test(s)),
          displayName: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length >= 1),
          errorType: fc.constantFrom('invalid_grant', 'network_error', 'server_error', 'timeout')
        }),
        async ({ providerName, clientId, displayName, errorType }) => {
          // Create a mock provider that simulates different failure types
          const mockProvider: OAuthProvider = {
            name: providerName,
            displayName: displayName,
            authorizationUrl: 'https://auth.example.com/oauth/authorize',
            tokenUrl: 'https://auth.example.com/oauth/token',
            scope: ['read'],
            clientId: clientId,
            buildAuthUrl: () => 'https://auth.example.com/oauth/authorize',
            exchangeCodeForTokens: async () => ({
              access_token: 'token',
              expires_in: 3600,
              token_type: 'Bearer'
            }),
            refreshTokens: async () => {
              if (errorType === 'invalid_grant') {
                return {
                  access_token: '',
                  expires_in: 0,
                  token_type: 'Bearer',
                  error: 'invalid_grant',
                  error_description: 'The provided authorization grant is invalid'
                };
              } else if (errorType === 'network_error') {
                throw new Error('network timeout');
              } else if (errorType === 'server_error') {
                return {
                  access_token: '',
                  expires_in: 0,
                  token_type: 'Bearer',
                  error: 'server_error',
                  error_description: 'Internal server error'
                };
              } else {
                throw new Error('ECONNREFUSED');
              }
            },
            validateTokens: async () => false // Always invalid to trigger refresh
          };

          oauthManager.registerProvider(mockProvider);

          // Create expired tokens with refresh token
          const expiredTokens: OAuthTokens = {
            accessToken: 'expired-token',
            refreshToken: 'test-refresh-token',
            expiresAt: new Date(Date.now() - 3600000), // Expired 1 hour ago
            scope: 'read',
            tokenType: 'Bearer'
          };

          await oauthManager['tokenStorage'].storeTokens(providerName, expiredTokens);

          // Test refresh failure handling
          const refreshResult = await oauthManager.refreshTokensWithErrorHandling(providerName);
          
          expect(refreshResult.success).toBe(false);
          expect(refreshResult.error).toBeTruthy();
          
          if (errorType === 'invalid_grant') {
            // Auth errors should require re-authentication
            expect(refreshResult.requiresReauth).toBe(true);
            
            // Tokens should be cleaned up
            const cleanedTokens = await oauthManager['tokenStorage'].getTokens(providerName);
            expect(cleanedTokens).toBeNull();
          } else if (errorType === 'network_error' || errorType === 'timeout') {
            // Network errors should not immediately require re-auth
            expect(refreshResult.requiresReauth).toBe(false);
          }

          // Test the failure handling helper
          const failureResult = await oauthManager.handleTokenRefreshFailure(providerName);
          expect(failureResult.requiresReauth).toBe(true);
          expect(failureResult.message).toContain(displayName);
          expect(failureResult.canRetry).toBe(true);

          return true;
        }
      ),
      { numRuns: 3 }
    );
  }, 60000); // 60 second timeout to account for retry delays

  test('Property 7: Token Lifecycle Management - getValidTokens behavior', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          providerName: fc.string({ minLength: 1, maxLength: 20 }).filter(s => /^[a-zA-Z0-9-_]+$/.test(s)),
          clientId: fc.string({ minLength: 10, maxLength: 50 }).filter(s => s.trim().length >= 10 && /^[a-zA-Z0-9._-]+$/.test(s)),
          isExpired: fc.boolean(),
          hasRefreshToken: fc.boolean(),
          refreshSucceeds: fc.boolean(),
          providerValidation: fc.boolean()
        }),
        async ({ providerName, clientId, isExpired, hasRefreshToken, refreshSucceeds, providerValidation }) => {
          // Create mock provider
          const mockProvider: OAuthProvider = {
            name: providerName,
            displayName: `Provider ${providerName}`,
            authorizationUrl: 'https://auth.example.com/oauth/authorize',
            tokenUrl: 'https://auth.example.com/oauth/token',
            scope: ['read'],
            clientId: clientId,
            buildAuthUrl: () => 'https://auth.example.com/oauth/authorize',
            exchangeCodeForTokens: async () => ({
              access_token: 'token',
              expires_in: 3600,
              token_type: 'Bearer'
            }),
            refreshTokens: async () => {
              if (!refreshSucceeds) {
                return {
                  access_token: '',
                  expires_in: 0,
                  token_type: 'Bearer',
                  error: 'invalid_grant'
                };
              }
              return {
                access_token: 'new-refreshed-token',
                expires_in: 3600,
                token_type: 'Bearer'
              };
            },
            validateTokens: async () => providerValidation
          };

          oauthManager.registerProvider(mockProvider);

          // Create tokens based on test parameters
          const expirationTime = isExpired ? 
            Date.now() - 3600000 : // 1 hour ago
            Date.now() + 3600000;  // 1 hour from now

          const testTokens: OAuthTokens = {
            accessToken: 'test-token',
            refreshToken: hasRefreshToken ? 'refresh-token' : undefined,
            expiresAt: new Date(expirationTime),
            scope: 'read',
            tokenType: 'Bearer'
          };

          await oauthManager['tokenStorage'].storeTokens(providerName, testTokens);

          // Test getValidTokens behavior
          const validTokens = await oauthManager.getValidTokens(providerName);

          if (!isExpired && providerValidation) {
            // Valid tokens should be returned as-is
            expect(validTokens).toBeTruthy();
            expect(validTokens?.accessToken).toBe('test-token');
          } else if (hasRefreshToken && refreshSucceeds) {
            // Expired/invalid tokens should be refreshed if possible
            expect(validTokens).toBeTruthy();
            expect(validTokens?.accessToken).toBe('new-refreshed-token');
          } else {
            // Tokens that can't be refreshed should return null
            expect(validTokens).toBeNull();
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  }, 60000); // 60 second timeout
});