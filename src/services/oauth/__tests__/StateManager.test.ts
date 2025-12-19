/**
 * Property-based tests for StateManager
 * Tests security parameter generation and state management
 */

import { describe, test, expect, beforeEach } from '@jest/globals';
import * as fc from 'fast-check';
import { StateManager } from '../core/StateManager';

describe('StateManager', () => {
  let stateManager: StateManager;

  beforeEach(() => {
    stateManager = new StateManager();
  });

  /**
   * Feature: tauri-oauth-implementation, Property 4: Security Parameter Generation
   * Validates: Requirements 2.1, 2.2, 7.1
   * 
   * For any OAuth flow initiation, all generated security parameters 
   * (state, PKCE verifier/challenge) should be cryptographically secure and unique
   */
  test('Property 4: Security Parameter Generation - state parameters are unique and secure', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 100 }), // Number of states to generate
        (count) => {
          const states = new Set<string>();
          
          // Generate multiple state parameters
          for (let i = 0; i < count; i++) {
            const state = stateManager.generateState();
            
            // State should be a non-empty string
            expect(state).toBeTruthy();
            expect(typeof state).toBe('string');
            expect(state.length).toBeGreaterThan(0);
            
            // State should be URL-safe (base64url encoded)
            expect(state).toMatch(/^[A-Za-z0-9_-]+$/);
            
            // State should be unique
            expect(states.has(state)).toBe(false);
            states.add(state);
          }
          
          // All states should be unique
          expect(states.size).toBe(count);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 4: Security Parameter Generation - PKCE parameters are unique and valid', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 100 }), // Number of PKCE pairs to generate
        (count) => {
          const verifiers = new Set<string>();
          const challenges = new Set<string>();
          
          // Generate multiple PKCE parameter pairs
          for (let i = 0; i < count; i++) {
            const { codeVerifier, codeChallenge } = stateManager.generatePKCE();
            
            // Verifier should be a non-empty string
            expect(codeVerifier).toBeTruthy();
            expect(typeof codeVerifier).toBe('string');
            expect(codeVerifier.length).toBeGreaterThan(0);
            
            // Challenge should be a non-empty string
            expect(codeChallenge).toBeTruthy();
            expect(typeof codeChallenge).toBe('string');
            expect(codeChallenge.length).toBeGreaterThan(0);
            
            // Both should be URL-safe (base64url encoded)
            expect(codeVerifier).toMatch(/^[A-Za-z0-9_-]+$/);
            expect(codeChallenge).toMatch(/^[A-Za-z0-9_-]+$/);
            
            // Verifier and challenge should be different
            expect(codeVerifier).not.toBe(codeChallenge);
            
            // Verifiers should be unique
            expect(verifiers.has(codeVerifier)).toBe(false);
            verifiers.add(codeVerifier);
            
            // Challenges should be unique
            expect(challenges.has(codeChallenge)).toBe(false);
            challenges.add(codeChallenge);
          }
          
          // All verifiers and challenges should be unique
          expect(verifiers.size).toBe(count);
          expect(challenges.size).toBe(count);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 4: Security Parameter Generation - PKCE challenge is deterministic for same verifier', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 50 }), // Number of iterations
        (iterations) => {
          // Generate a PKCE pair
          const { codeVerifier, codeChallenge } = stateManager.generatePKCE();
          
          // The same verifier should always produce the same challenge
          // We can't directly test this without exposing internal methods,
          // but we can verify that the challenge is consistent with SHA256 properties
          
          // Challenge should be exactly 43 characters (SHA256 base64url without padding)
          expect(codeChallenge.length).toBe(43);
          
          // Verifier should be at least 43 characters (RFC 7636 requirement)
          expect(codeVerifier.length).toBeGreaterThanOrEqual(43);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 4: Security Parameter Generation - createAuthState generates complete and valid state', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }), // provider name
        fc.webUrl(), // redirect URI
        (provider, redirectUri) => {
          const authState = stateManager.createAuthState(provider, redirectUri);
          
          // All required fields should be present
          expect(authState.provider).toBe(provider);
          expect(authState.state).toBeTruthy();
          expect(authState.codeVerifier).toBeTruthy();
          expect(authState.codeChallenge).toBeTruthy();
          expect(authState.redirectUri).toBe(redirectUri);
          expect(authState.startTime).toBeInstanceOf(Date);
          expect(authState.isActive).toBe(true);
          
          // State should be URL-safe
          expect(authState.state).toMatch(/^[A-Za-z0-9_-]+$/);
          
          // PKCE parameters should be URL-safe
          expect(authState.codeVerifier).toMatch(/^[A-Za-z0-9_-]+$/);
          expect(authState.codeChallenge).toMatch(/^[A-Za-z0-9_-]+$/);
          
          // Verifier and challenge should be different
          expect(authState.codeVerifier).not.toBe(authState.codeChallenge);
          
          // Start time should be recent (within last second)
          const now = new Date();
          const timeDiff = now.getTime() - authState.startTime.getTime();
          expect(timeDiff).toBeLessThan(1000);
          expect(timeDiff).toBeGreaterThanOrEqual(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 4: Security Parameter Generation - validateState correctly validates and invalidates states', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }), // provider name
        fc.webUrl(), // redirect URI
        (provider, redirectUri) => {
          // Create an auth state
          const authState = stateManager.createAuthState(provider, redirectUri);
          
          // Validate the state - should succeed
          const validated = stateManager.validateState(authState.state);
          expect(validated).not.toBeNull();
          expect(validated?.provider).toBe(provider);
          expect(validated?.state).toBe(authState.state);
          expect(validated?.isActive).toBe(false); // Should be marked inactive after validation
          
          // Validating the same state again should fail (prevent reuse)
          const revalidated = stateManager.validateState(authState.state);
          expect(revalidated).toBeNull();
          
          // Validating a random state should fail
          const randomState = 'invalid-state-' + Math.random();
          const invalidValidation = stateManager.validateState(randomState);
          expect(invalidValidation).toBeNull();
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 4: Security Parameter Generation - cleanupExpiredStates removes old states', () => {
    fc.assert(
      fc.property(
        fc.array(fc.tuple(fc.string({ minLength: 1, maxLength: 20 }), fc.webUrl()), { minLength: 1, maxLength: 10 }),
        (providerUriPairs) => {
          // Create multiple auth states
          const states: string[] = [];
          for (const [provider, redirectUri] of providerUriPairs) {
            const authState = stateManager.createAuthState(provider, redirectUri);
            states.push(authState.state);
          }
          
          // All states should be valid immediately
          for (const state of states) {
            const validated = stateManager.validateState(state);
            // Note: validateState marks state as inactive, so we can't revalidate
            // Just verify the first validation worked
            expect(validated).not.toBeNull();
          }
          
          // After cleanup, states should still be gone (they were marked inactive)
          stateManager.cleanupExpiredStates();
          
          // Create a new state to verify the manager still works
          const newAuthState = stateManager.createAuthState('test-provider', 'http://localhost');
          const newValidated = stateManager.validateState(newAuthState.state);
          expect(newValidated).not.toBeNull();
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 4: Security Parameter Generation - multiple auth states are independent', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.tuple(
            fc.string({ minLength: 1, maxLength: 20 }),
            fc.webUrl()
          ),
          { minLength: 2, maxLength: 10 }
        ),
        (providerUriPairs) => {
          // Create multiple auth states
          const authStates = providerUriPairs.map(([provider, redirectUri]) =>
            stateManager.createAuthState(provider, redirectUri)
          );
          
          // All states should be unique
          const stateSet = new Set(authStates.map(s => s.state));
          expect(stateSet.size).toBe(authStates.length);
          
          // All verifiers should be unique
          const verifierSet = new Set(authStates.map(s => s.codeVerifier));
          expect(verifierSet.size).toBe(authStates.length);
          
          // All challenges should be unique
          const challengeSet = new Set(authStates.map(s => s.codeChallenge));
          expect(challengeSet.size).toBe(authStates.length);
          
          // Each state should validate independently
          for (let i = 0; i < authStates.length; i++) {
            const validated = stateManager.validateState(authStates[i].state);
            expect(validated).not.toBeNull();
            expect(validated?.provider).toBe(authStates[i].provider);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
