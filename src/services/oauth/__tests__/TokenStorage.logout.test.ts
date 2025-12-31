/**
 * Property-based tests for TokenStorage logout and cleanup functionality
 * Tests secure deletion of credentials and cleanup of authentication state
 */

import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import * as fc from 'fast-check';
import { TokenStorage } from '../core/TokenStorage';
import type { OAuthTokens } from '../interfaces';

describe('TokenStorage Logout and Cleanup', () => {
  let tokenStorage: TokenStorage;

  beforeEach(() => {
    tokenStorage = new TokenStorage();
  });

  afterEach(async () => {
    // Clean up any test tokens
    try {
      const providers = await tokenStorage.listProviders();
      for (const provider of providers) {
        if (provider.startsWith('test-')) {
          await tokenStorage.removeTokens(provider);
        }
      }
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  /**
   * Feature: tauri-oauth-implementation, Property 8: Logout and Cleanup
   * Validates: Requirements 4.4, 7.5
   * 
   * For any logout operation, the system should securely delete all credentials, 
   * clear authentication state, and ensure no sensitive data remains
   */
  test('Property 8: Logout and Cleanup - tokens are completely removed after logout', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0).map(s => `test-${s.trim()}`),
        fc.record({
          accessToken: fc.string({ minLength: 10, maxLength: 200 }).filter(s => /^[a-zA-Z0-9._-]+$/.test(s)),
          refreshToken: fc.option(fc.string({ minLength: 10, maxLength: 200 }).filter(s => /^[a-zA-Z0-9._-]+$/.test(s))),
          expiresAt: fc.date({ min: new Date(), max: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) }).filter(d => !isNaN(d.getTime())),
          scope: fc.string({ minLength: 1, maxLength: 100 }).filter(s => /^[a-zA-Z0-9._\- ]+$/.test(s)),
          tokenType: fc.constantFrom('Bearer', 'bearer', 'token')
        }),
        async (provider, tokenData) => {
          const tokens: OAuthTokens = {
            accessToken: tokenData.accessToken,
            refreshToken: tokenData.refreshToken || undefined,
            expiresAt: tokenData.expiresAt,
            scope: tokenData.scope,
            tokenType: tokenData.tokenType
          };

          // Store the tokens
          await tokenStorage.storeTokens(provider, tokens);

          // Verify tokens are stored
          const storedTokens = await tokenStorage.getTokens(provider);
          expect(storedTokens).not.toBeNull();
          expect(storedTokens!.accessToken).toBe(tokens.accessToken);

          // Verify provider appears in the list
          const providersBeforeLogout = await tokenStorage.listProviders();
          expect(providersBeforeLogout).toContain(provider);

          // Perform logout (remove tokens)
          await tokenStorage.removeTokens(provider);

          // Verify tokens are completely removed
          const tokensAfterLogout = await tokenStorage.getTokens(provider);
          expect(tokensAfterLogout).toBeNull();

          // Verify provider no longer appears in the list
          const providersAfterLogout = await tokenStorage.listProviders();
          expect(providersAfterLogout).not.toContain(provider);

          // Verify that attempting to retrieve again still returns null
          const tokensAfterSecondAttempt = await tokenStorage.getTokens(provider);
          expect(tokensAfterSecondAttempt).toBeNull();
        }
      ),
      { numRuns: 50 }
    );
  });

  test('Property 8: Logout and Cleanup - multiple provider cleanup is independent', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(
          fc.tuple(
            fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0 && !s.includes('constructor') && !s.includes('__proto__')).map(s => `test-${s.trim()}`),
            fc.record({
              accessToken: fc.string({ minLength: 10, maxLength: 100 }).filter(s => /^[a-zA-Z0-9._-]+$/.test(s)),
              refreshToken: fc.option(fc.string({ minLength: 10, maxLength: 100 }).filter(s => /^[a-zA-Z0-9._-]+$/.test(s))),
              expiresAt: fc.date({ min: new Date(), max: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) }).filter(d => !isNaN(d.getTime())),
              scope: fc.string({ minLength: 1, maxLength: 50 }).filter(s => /^[a-zA-Z0-9._\- ]+$/.test(s)),
              tokenType: fc.constantFrom('Bearer', 'bearer')
            })
          ),
          { minLength: 2, maxLength: 5 }
        ),
        async (providerTokenPairs) => {
          // Skip if any objects have problematic properties
          const hasProblematicObjects = providerTokenPairs.some(([_, tokenData]) => 
            Object.prototype.hasOwnProperty.call(tokenData, '__proto__') ||
            !tokenData.hasOwnProperty ||
            typeof tokenData !== 'object'
          );
          if (hasProblematicObjects) return;

          // Ensure unique provider names and that they don't collide when base64 encoded
          const uniquePairs = providerTokenPairs.filter((pair, index, arr) => {
            const currentProvider = pair[0];
            const currentEncoded = Buffer.from(`easyeditor-oauth-${currentProvider}`).toString('base64');
            
            return arr.findIndex(p => {
              const otherProvider = p[0];
              const otherEncoded = Buffer.from(`easyeditor-oauth-${otherProvider}`).toString('base64');
              return otherEncoded === currentEncoded;
            }) === index;
          });
          
          if (uniquePairs.length < 2) return; // Skip if not enough unique providers

          const storedTokens = new Map<string, OAuthTokens>();

          // Store all tokens
          for (const [provider, tokenData] of uniquePairs) {
            const tokens: OAuthTokens = {
              accessToken: tokenData.accessToken,
              refreshToken: tokenData.refreshToken || undefined,
              expiresAt: tokenData.expiresAt,
              scope: tokenData.scope,
              tokenType: tokenData.tokenType
            };

            await tokenStorage.storeTokens(provider, tokens);
            storedTokens.set(provider, tokens);
          }

          // Verify all tokens are stored
          for (const [provider, originalTokens] of storedTokens) {
            const retrievedTokens = await tokenStorage.getTokens(provider);
            expect(retrievedTokens).not.toBeNull();
            expect(retrievedTokens!.accessToken).toBe(originalTokens.accessToken);
          }

          // Remove tokens for the first provider only
          const firstProvider = uniquePairs[0][0];
          await tokenStorage.removeTokens(firstProvider);

          // Verify first provider's tokens are removed
          const firstProviderTokens = await tokenStorage.getTokens(firstProvider);
          expect(firstProviderTokens).toBeNull();

          // Verify other providers' tokens are still intact
          for (let i = 1; i < uniquePairs.length; i++) {
            const [provider] = uniquePairs[i];
            const originalTokens = storedTokens.get(provider)!;
            
            const retrievedTokens = await tokenStorage.getTokens(provider);
            expect(retrievedTokens).not.toBeNull();
            expect(retrievedTokens!.accessToken).toBe(originalTokens.accessToken);
          }

          // Verify provider list reflects the changes
          const providers = await tokenStorage.listProviders();
          expect(providers).not.toContain(firstProvider);
          
          for (let i = 1; i < uniquePairs.length; i++) {
            const [provider] = uniquePairs[i];
            expect(providers).toContain(provider);
          }

          // Clean up remaining tokens
          for (let i = 1; i < uniquePairs.length; i++) {
            const [provider] = uniquePairs[i];
            await tokenStorage.removeTokens(provider);
          }
        }
      ),
      { numRuns: 50 }
    );
  });

  test('Property 8: Logout and Cleanup - removing non-existent tokens is safe', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 50 }).map(s => `nonexistent-${s}-${Date.now()}`),
        async (provider) => {
          // Verify provider doesn't exist initially
          const initialTokens = await tokenStorage.getTokens(provider);
          expect(initialTokens).toBeNull();

          // Removing non-existent tokens should not throw
          await expect(tokenStorage.removeTokens(provider)).resolves.not.toThrow();

          // Provider should still not exist
          const tokensAfterRemoval = await tokenStorage.getTokens(provider);
          expect(tokensAfterRemoval).toBeNull();

          // Provider should not appear in the list
          const providers = await tokenStorage.listProviders();
          expect(providers).not.toContain(provider);
        }
      ),
      { numRuns: 50 }
    );
  });

  test('Property 8: Logout and Cleanup - repeated logout operations are safe', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0).map(s => `test-${s.trim()}`),
        fc.record({
          accessToken: fc.string({ minLength: 10, maxLength: 100 }).filter(s => /^[a-zA-Z0-9._-]+$/.test(s)),
          refreshToken: fc.option(fc.string({ minLength: 10, maxLength: 100 }).filter(s => /^[a-zA-Z0-9._-]+$/.test(s))),
          expiresAt: fc.date({ min: new Date(), max: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) }).filter(d => !isNaN(d.getTime())),
          scope: fc.string({ minLength: 1, maxLength: 50 }).filter(s => /^[a-zA-Z0-9._\- ]+$/.test(s)),
          tokenType: fc.constantFrom('Bearer', 'bearer')
        }),
        fc.integer({ min: 2, max: 5 }), // Number of repeated logout attempts
        async (provider, tokenData, logoutAttempts) => {
          const tokens: OAuthTokens = {
            accessToken: tokenData.accessToken,
            refreshToken: tokenData.refreshToken || undefined,
            expiresAt: tokenData.expiresAt,
            scope: tokenData.scope,
            tokenType: tokenData.tokenType
          };

          // Store the tokens
          await tokenStorage.storeTokens(provider, tokens);

          // Verify tokens are stored
          const storedTokens = await tokenStorage.getTokens(provider);
          expect(storedTokens).not.toBeNull();

          // Perform multiple logout operations
          for (let i = 0; i < logoutAttempts; i++) {
            await expect(tokenStorage.removeTokens(provider)).resolves.not.toThrow();
            
            // Verify tokens are still removed after each attempt
            const tokensAfterLogout = await tokenStorage.getTokens(provider);
            expect(tokensAfterLogout).toBeNull();
            
            // Verify provider is not in the list
            const providers = await tokenStorage.listProviders();
            expect(providers).not.toContain(provider);
          }
        }
      ),
      { numRuns: 50 }
    );
  });
});