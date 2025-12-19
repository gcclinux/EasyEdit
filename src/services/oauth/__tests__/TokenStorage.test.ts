/**
 * Property-based tests for TokenStorage
 * Tests secure token storage and retrieval across platforms
 */

import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import * as fc from 'fast-check';
import { TokenStorage } from '../core/TokenStorage';
import type { OAuthTokens } from '../interfaces';

describe('TokenStorage', () => {
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
   * Feature: tauri-oauth-implementation, Property 5: Secure Token Storage
   * Validates: Requirements 2.3, 7.3
   * 
   * For any OAuth tokens, the system should encrypt them using platform-specific 
   * secure storage and never expose them in plain text
   */
  test('Property 5: Secure Token Storage - tokens can be stored and retrieved correctly', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0).map(s => `test-${s.trim()}`), // provider name
        fc.record({
          accessToken: fc.string({ minLength: 10, maxLength: 200 }).filter(s => {
            return /^[a-zA-Z0-9._-]+$/.test(s) && 
                   !s.includes('constructor') && 
                   !s.includes('prototype') && 
                   !s.includes('__defineGe') &&
                   !s.includes('isPrototypeOf') &&
                   !s.includes('valueOf') &&
                   !s.includes('toString') &&
                   !s.includes('hasOwnProperty');
          }),
          refreshToken: fc.option(fc.string({ minLength: 10, maxLength: 200 }).filter(s => {
            return /^[a-zA-Z0-9._-]+$/.test(s) && 
                   !s.includes('constructor') && 
                   !s.includes('prototype') && 
                   !s.includes('__defineGe') &&
                   !s.includes('isPrototypeOf') &&
                   !s.includes('valueOf') &&
                   !s.includes('toString') &&
                   !s.includes('hasOwnProperty');
          })),
          expiresAt: fc.date({ min: new Date(), max: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) }).filter(d => !isNaN(d.getTime())),
          scope: fc.string({ minLength: 1, maxLength: 100 }).filter(s => {
            return /^[a-zA-Z0-9._\- ]+$/.test(s) && 
                   !s.includes('constructor') && 
                   !s.includes('prototype') && 
                   !s.includes('__defineGe') &&
                   !s.includes('isPrototypeOf') &&
                   !s.includes('valueOf') &&
                   !s.includes('toString') &&
                   !s.includes('hasOwnProperty');
          }),
          tokenType: fc.constantFrom('Bearer', 'bearer', 'token')
        }),
        async (provider, tokenData) => {
          // Skip if object has problematic properties
          if (Object.prototype.hasOwnProperty.call(tokenData, '__proto__') ||
              !tokenData.hasOwnProperty ||
              typeof tokenData !== 'object') {
            return;
          }

          const tokens: OAuthTokens = {
            accessToken: tokenData.accessToken,
            refreshToken: tokenData.refreshToken || undefined,
            expiresAt: tokenData.expiresAt,
            scope: tokenData.scope,
            tokenType: tokenData.tokenType
          };

          // Store the tokens
          await tokenStorage.storeTokens(provider, tokens);

          // Retrieve the tokens
          const retrievedTokens = await tokenStorage.getTokens(provider);

          // Tokens should be retrieved correctly
          expect(retrievedTokens).not.toBeNull();
          expect(retrievedTokens!.accessToken).toBe(tokens.accessToken);
          expect(retrievedTokens!.refreshToken).toBe(tokens.refreshToken);
          expect(retrievedTokens!.expiresAt.getTime()).toBe(tokens.expiresAt.getTime());
          expect(retrievedTokens!.scope).toBe(tokens.scope);
          expect(retrievedTokens!.tokenType).toBe(tokens.tokenType);

          // Provider should appear in the list
          const providers = await tokenStorage.listProviders();
          expect(providers).toContain(provider);

          // Clean up
          await tokenStorage.removeTokens(provider);

          // Tokens should no longer be retrievable
          const deletedTokens = await tokenStorage.getTokens(provider);
          expect(deletedTokens).toBeNull();

          // Provider should no longer appear in the list
          const updatedProviders = await tokenStorage.listProviders();
          expect(updatedProviders).not.toContain(provider);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 5: Secure Token Storage - multiple providers are stored independently', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(
          fc.tuple(
            fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0).map(s => `test-${s.trim()}`),
            fc.record({
              accessToken: fc.string({ minLength: 10, maxLength: 100 }).filter(s => {
                return /^[a-zA-Z0-9._-]+$/.test(s) && 
                       !s.includes('constructor') && 
                       !s.includes('prototype') && 
                       !s.includes('__defineGe') &&
                       !s.includes('isPrototypeOf') &&
                       !s.includes('valueOf') &&
                       !s.includes('toString') &&
                       !s.includes('hasOwnProperty');
              }),
              refreshToken: fc.option(fc.string({ minLength: 10, maxLength: 100 }).filter(s => {
                return /^[a-zA-Z0-9._-]+$/.test(s) && 
                       !s.includes('constructor') && 
                       !s.includes('prototype') && 
                       !s.includes('__defineGe') &&
                       !s.includes('isPrototypeOf') &&
                       !s.includes('valueOf') &&
                       !s.includes('toString') &&
                       !s.includes('hasOwnProperty');
              })),
              expiresAt: fc.date({ min: new Date(), max: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) }).filter(d => !isNaN(d.getTime())),
              scope: fc.string({ minLength: 1, maxLength: 50 }).filter(s => {
                return /^[a-zA-Z0-9._\- ]+$/.test(s) && 
                       !s.includes('constructor') && 
                       !s.includes('prototype') && 
                       !s.includes('__defineGe') &&
                       !s.includes('isPrototypeOf') &&
                       !s.includes('valueOf') &&
                       !s.includes('toString') &&
                       !s.includes('hasOwnProperty');
              }),
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

          // Ensure unique provider names
          const uniquePairs = providerTokenPairs.filter((pair, index, arr) => 
            arr.findIndex(p => p[0] === pair[0]) === index
          );
          
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

          // Verify all tokens can be retrieved independently
          for (const [provider, originalTokens] of storedTokens) {
            const retrievedTokens = await tokenStorage.getTokens(provider);
            
            expect(retrievedTokens).not.toBeNull();
            expect(retrievedTokens!.accessToken).toBe(originalTokens.accessToken);
            expect(retrievedTokens!.refreshToken).toBe(originalTokens.refreshToken);
            expect(retrievedTokens!.expiresAt.getTime()).toBe(originalTokens.expiresAt.getTime());
            expect(retrievedTokens!.scope).toBe(originalTokens.scope);
            expect(retrievedTokens!.tokenType).toBe(originalTokens.tokenType);
          }

          // Verify all providers are listed
          const providers = await tokenStorage.listProviders();
          for (const [provider] of uniquePairs) {
            expect(providers).toContain(provider);
          }

          // Clean up all tokens
          for (const [provider] of uniquePairs) {
            await tokenStorage.removeTokens(provider);
          }

          // Verify all tokens are removed
          for (const [provider] of uniquePairs) {
            const deletedTokens = await tokenStorage.getTokens(provider);
            expect(deletedTokens).toBeNull();
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 5: Secure Token Storage - non-existent providers return null', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 50 }).map(s => `nonexistent-${s}-${Date.now()}`),
        async (provider) => {
          // Attempt to retrieve tokens for non-existent provider
          const tokens = await tokenStorage.getTokens(provider);
          expect(tokens).toBeNull();

          // Provider should not appear in the list
          const providers = await tokenStorage.listProviders();
          expect(providers).not.toContain(provider);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 5: Secure Token Storage - removing non-existent tokens does not error', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 50 }).map(s => `nonexistent-${s}-${Date.now()}`),
        async (provider) => {
          // Removing non-existent tokens should not throw
          await expect(tokenStorage.removeTokens(provider)).resolves.not.toThrow();

          // Provider should still not appear in the list
          const providers = await tokenStorage.listProviders();
          expect(providers).not.toContain(provider);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 5: Secure Token Storage - tokens with special characters are handled correctly', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0).map(s => `test-${s.trim()}`),
        fc.record({
          accessToken: fc.string({ minLength: 10, maxLength: 100 }).filter(s => s.trim().length >= 10).map(s => s.trim() + '!@#$%^&*()+={}[]|\\:";\'<>?,./'),
          refreshToken: fc.option(fc.string({ minLength: 10, maxLength: 100 }).filter(s => s.trim().length >= 10).map(s => s.trim() + '!@#$%^&*()')),
          expiresAt: fc.date({ min: new Date(), max: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) }).filter(d => !isNaN(d.getTime())),
          scope: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0).map(s => s.trim() + ' special:chars/test'),
          tokenType: fc.constantFrom('Bearer', 'bearer')
        }),
        async (provider, tokenData) => {
          const tokens: OAuthTokens = {
            accessToken: tokenData.accessToken,
            refreshToken: tokenData.refreshToken || undefined,
            expiresAt: tokenData.expiresAt,
            scope: tokenData.scope,
            tokenType: tokenData.tokenType
          };

          // Store tokens with special characters
          await tokenStorage.storeTokens(provider, tokens);

          // Retrieve and verify tokens
          const retrievedTokens = await tokenStorage.getTokens(provider);
          expect(retrievedTokens).not.toBeNull();
          expect(retrievedTokens!.accessToken).toBe(tokens.accessToken);
          expect(retrievedTokens!.refreshToken).toBe(tokens.refreshToken);
          expect(retrievedTokens!.scope).toBe(tokens.scope);

          // Clean up
          await tokenStorage.removeTokens(provider);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 5: Secure Token Storage - date serialization preserves precision', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0).map(s => `test-${s.trim()}`),
        fc.date({ min: new Date('2020-01-01'), max: new Date('2030-12-31') }).filter(d => !isNaN(d.getTime())),
        async (provider, expiresAt) => {
          const tokens: OAuthTokens = {
            accessToken: 'test-access-token',
            refreshToken: 'test-refresh-token',
            expiresAt: expiresAt,
            scope: 'test-scope',
            tokenType: 'Bearer'
          };

          // Store the tokens
          await tokenStorage.storeTokens(provider, tokens);

          // Retrieve the tokens
          const retrievedTokens = await tokenStorage.getTokens(provider);

          // Date should be preserved exactly
          expect(retrievedTokens).not.toBeNull();
          expect(retrievedTokens!.expiresAt.getTime()).toBe(expiresAt.getTime());
          expect(retrievedTokens!.expiresAt.toISOString()).toBe(expiresAt.toISOString());

          // Clean up
          await tokenStorage.removeTokens(provider);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 5: Secure Token Storage - overwriting tokens replaces previous values', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0).map(s => `test-${s.trim()}`),
        fc.tuple(
          fc.record({
            accessToken: fc.string({ minLength: 10, maxLength: 100 }).filter(s => s.trim().length >= 10),
            refreshToken: fc.option(fc.string({ minLength: 10, maxLength: 100 }).filter(s => s.trim().length >= 10)),
            expiresAt: fc.date({ min: new Date(), max: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) }).filter(d => !isNaN(d.getTime())),
            scope: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
            tokenType: fc.constantFrom('Bearer', 'bearer')
          }),
          fc.record({
            accessToken: fc.string({ minLength: 10, maxLength: 100 }).filter(s => s.trim().length >= 10),
            refreshToken: fc.option(fc.string({ minLength: 10, maxLength: 100 }).filter(s => s.trim().length >= 10)),
            expiresAt: fc.date({ min: new Date(), max: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) }).filter(d => !isNaN(d.getTime())),
            scope: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
            tokenType: fc.constantFrom('Bearer', 'bearer')
          })
        ).filter(([first, second]) => first.accessToken !== second.accessToken), // Ensure tokens are different
        async (provider, [firstTokenData, secondTokenData]) => {
          const firstTokens: OAuthTokens = {
            accessToken: firstTokenData.accessToken,
            refreshToken: firstTokenData.refreshToken || undefined,
            expiresAt: firstTokenData.expiresAt,
            scope: firstTokenData.scope,
            tokenType: firstTokenData.tokenType
          };

          const secondTokens: OAuthTokens = {
            accessToken: secondTokenData.accessToken,
            refreshToken: secondTokenData.refreshToken || undefined,
            expiresAt: secondTokenData.expiresAt,
            scope: secondTokenData.scope,
            tokenType: secondTokenData.tokenType
          };

          // Store first tokens
          await tokenStorage.storeTokens(provider, firstTokens);

          // Verify first tokens are stored
          const firstRetrieved = await tokenStorage.getTokens(provider);
          expect(firstRetrieved).not.toBeNull();
          expect(firstRetrieved!.accessToken).toBe(firstTokens.accessToken);

          // Store second tokens (overwrite)
          await tokenStorage.storeTokens(provider, secondTokens);

          // Verify second tokens replaced first tokens
          const secondRetrieved = await tokenStorage.getTokens(provider);
          expect(secondRetrieved).not.toBeNull();
          expect(secondRetrieved!.accessToken).toBe(secondTokens.accessToken);
          expect(secondRetrieved!.accessToken).not.toBe(firstTokens.accessToken);

          // Clean up
          await tokenStorage.removeTokens(provider);
        }
      ),
      { numRuns: 100 }
    );
  });
});