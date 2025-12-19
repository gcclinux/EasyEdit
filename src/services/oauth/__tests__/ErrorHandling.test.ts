/**
 * Property-based tests for OAuth error handling and recovery
 * **Feature: tauri-oauth-implementation, Property 6: Error Handling and Recovery**
 * **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 6.5**
 */

import fc from 'fast-check';
import { OAuthErrorHandler, OAuthErrorType } from '../utils/ErrorHandler';

// Mock fetch for network requests
global.fetch = jest.fn();

describe('OAuth Error Handling and Recovery Property Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Property 6: Error Handling and Recovery
   * For any authentication error (cancellation, network failure, timeout), 
   * the system should handle it gracefully, clean up resources, and provide appropriate user feedback
   */
  describe('Property 6: Error Handling and Recovery', () => {
    test('should handle network errors gracefully with retry logic', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.oneof(
            fc.constant('ENOTFOUND'),
            fc.constant('ECONNREFUSED'),
            fc.constant('ETIMEDOUT')
          ),
          fc.integer({ min: 1, max: 3 }), // retry attempts
          async (errorType, maxRetries) => {
            // Mock network error
            const networkError = new Error(errorType);

            // Test that network errors are properly classified and handled
            const parsedError = OAuthErrorHandler.parseNetworkError(networkError);
            
            // Verify error is properly classified
            expect(parsedError.type).toMatch(/network_error|timeout|dns_error|connection_refused/);
            expect(parsedError.canRetry).toBe(true);
            expect(parsedError.userMessage).toBeDefined();
            expect(parsedError.userMessage.length).toBeGreaterThan(0);
            
            // Test retry logic with fast delays
            let attemptCount = 0;
            const operation = async () => {
              attemptCount++;
              throw networkError;
            };

            try {
              await OAuthErrorHandler.withRetry(operation, { 
                maxRetries, 
                baseDelay: 10, // Very fast for testing
                maxDelay: 50
              });
            } catch (error) {
              // Should have attempted maxRetries + 1 times (initial + retries)
              expect(attemptCount).toBe(maxRetries + 1);
            }
          }
        ),
        { numRuns: 10 } // Reduced runs for faster testing
      );
    }, 15000);

    test('should detect and handle user cancellation appropriately', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.oneof(
            fc.constant('user cancelled'),
            fc.constant('access_denied'),
            fc.constant('user denied'),
            fc.constant('authorization_declined'),
            fc.constant('popup_closed_by_user'),
            fc.constant('window closed')
          ),
          async (cancellationMessage) => {
            // Test user cancellation detection
            const cancellationError = OAuthErrorHandler.detectUserCancellation(cancellationMessage);
            
            expect(cancellationError).not.toBeNull();
            expect(cancellationError!.type).toBe(OAuthErrorType.USER_CANCELLED);
            expect(cancellationError!.canRetry).toBe(true);
            expect(cancellationError!.requiresReauth).toBe(false);
            expect(cancellationError!.userMessage).toContain('cancelled');
          }
        ),
        { numRuns: 10 }
      );
    });

    test('should handle OAuth protocol errors with appropriate user messages', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.oneof(
            fc.constant('invalid_request'),
            fc.constant('invalid_client'),
            fc.constant('invalid_grant'),
            fc.constant('unauthorized_client'),
            fc.constant('unsupported_grant_type'),
            fc.constant('invalid_scope'),
            fc.constant('access_denied'),
            fc.constant('server_error'),
            fc.constant('temporarily_unavailable')
          ),
          fc.option(fc.string({ minLength: 10, maxLength: 100 })), // error description
          async (oauthError, errorDescription) => {
            // Test OAuth error parsing
            const parsedError = OAuthErrorHandler.parseOAuthError(oauthError, errorDescription || undefined);
            
            // Verify error properties
            expect(parsedError.type).toBeDefined();
            expect(parsedError.message).toBeDefined();
            expect(parsedError.userMessage).toBeDefined();
            expect(parsedError.userMessage.length).toBeGreaterThan(0);
            
            // Verify user message is user-friendly (not technical)
            expect(parsedError.userMessage).not.toContain('invalid_');
            expect(parsedError.userMessage).not.toContain('unauthorized_');
            
            // Verify retry logic for appropriate errors
            const retryableErrors = ['server_error', 'temporarily_unavailable'];
            if (retryableErrors.includes(oauthError)) {
              expect(parsedError.canRetry).toBe(true);
            }
            
            // Verify re-auth requirements for appropriate errors
            const reauthErrors = ['invalid_grant', 'unauthorized_client', 'access_denied'];
            if (reauthErrors.includes(oauthError)) {
              expect(parsedError.requiresReauth).toBe(true);
            }
          }
        ),
        { numRuns: 10 }
      );
    });

    test('should handle timeout scenarios with proper cleanup', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.integer({ min: 50, max: 200 }), // timeout in ms (faster)
          fc.integer({ min: 100, max: 300 }), // operation duration in ms (faster)
          async (timeoutMs, operationDuration) => {
            let cleanupCalled = false;
            const cleanup = async () => {
              cleanupCalled = true;
            };

            const slowOperation = async () => {
              await new Promise(resolve => setTimeout(resolve, operationDuration));
              return 'success';
            };

            try {
              const result = await OAuthErrorHandler.withTimeout(slowOperation, timeoutMs, cleanup);
              
              // If operation completed within timeout, should succeed
              if (operationDuration <= timeoutMs) {
                expect(result).toBe('success');
                expect(cleanupCalled).toBe(false);
              }
            } catch (error) {
              // If operation timed out, should have proper error and cleanup
              if (operationDuration > timeoutMs) {
                expect(error).toHaveProperty('type', OAuthErrorType.TIMEOUT);
                expect(error).toHaveProperty('userMessage');
                expect(cleanupCalled).toBe(true);
              }
            }
          }
        ),
        { numRuns: 10 }
      );
    }, 10000);

    test('should provide consistent error messages across different error types', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.oneof(
            fc.constant(OAuthErrorType.NETWORK_ERROR),
            fc.constant(OAuthErrorType.TIMEOUT),
            fc.constant(OAuthErrorType.USER_CANCELLED),
            fc.constant(OAuthErrorType.INVALID_GRANT),
            fc.constant(OAuthErrorType.SERVER_ERROR)
          ),
          fc.string({ minLength: 5, maxLength: 50 }), // original message
          async (errorType, originalMessage) => {
            const error = OAuthErrorHandler.createError(errorType, originalMessage);
            
            // Verify error structure
            expect(error.type).toBe(errorType);
            expect(error.message).toBe(originalMessage);
            expect(error.userMessage).toBeDefined();
            expect(error.userMessage.length).toBeGreaterThan(0);
            
            // Verify user message is appropriate for the error type
            switch (errorType) {
              case OAuthErrorType.NETWORK_ERROR:
                expect(error.userMessage.toLowerCase()).toMatch(/network|connection|internet/);
                break;
              case OAuthErrorType.TIMEOUT:
                expect(error.userMessage.toLowerCase()).toMatch(/timeout|took too long|try again/);
                break;
              case OAuthErrorType.USER_CANCELLED:
                expect(error.userMessage.toLowerCase()).toMatch(/cancel|when ready/);
                break;
              case OAuthErrorType.INVALID_GRANT:
                expect(error.userMessage.toLowerCase()).toMatch(/invalid|expired|try again/);
                break;
              case OAuthErrorType.SERVER_ERROR:
                expect(error.userMessage.toLowerCase()).toMatch(/server|error|try again/);
                break;
            }
            
            // Verify boolean flags are consistent
            expect(typeof error.canRetry).toBe('boolean');
            expect(typeof error.requiresReauth).toBe('boolean');
          }
        ),
        { numRuns: 10 }
      );
    });

    test('should handle exponential backoff retry logic correctly', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.integer({ min: 1, max: 3 }), // max retries (reduced)
          fc.integer({ min: 10, max: 50 }), // base delay (faster)
          async (maxRetries, baseDelay) => {
            let attemptCount = 0;
            const operation = async () => {
              attemptCount++;
              throw new Error('Test error');
            };

            const startTime = Date.now();
            
            try {
              await OAuthErrorHandler.withRetry(operation, { 
                maxRetries, 
                baseDelay,
                maxDelay: 200, // Much faster max delay
                backoffMultiplier: 2
              });
            } catch (error) {
              // Should have attempted maxRetries + 1 times
              expect(attemptCount).toBe(maxRetries + 1);
              
              // Should have taken at least some time (basic check)
              const elapsedTime = Date.now() - startTime;
              expect(elapsedTime).toBeGreaterThan(baseDelay * 0.5); // Allow some tolerance
            }
          }
        ),
        { numRuns: 10 }
      );
    });
  });
});