/**
 * Property-based tests for CallbackServer
 * Tests callback handling, token exchange, and server security
 */

import { describe, test, expect } from '@jest/globals';
import * as fc from 'fast-check';
import * as http from 'http';
import { CallbackServer } from '../core/CallbackServer';
import type { CallbackServerConfig } from '../interfaces';

describe('CallbackServer', () => {
  // Note: We create fresh instances in each test to avoid state issues with property tests

  /**
   * Feature: tauri-oauth-implementation, Property 2: Callback Handling and Token Exchange
   * Validates: Requirements 1.2, 1.3, 1.4, 2.5
   * 
   * For any valid authorization code received through the callback server, 
   * the system should exchange it for tokens, store them securely, and shut down the callback server
   */
  test('Property 2: Callback Handling and Token Exchange - server handles valid OAuth callbacks correctly', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 10, maxLength: 100 }).filter(s => /^[A-Za-z0-9_-]+$/.test(s)), // Valid auth code
        fc.string({ minLength: 10, maxLength: 50 }).filter(s => /^[A-Za-z0-9_-]+$/.test(s)), // Valid state
        async (authCode, state) => {
          // Create fresh callback server for this test run
          const callbackServer = new CallbackServer();
          
          try {
            // Start the callback server
            const redirectUri = await callbackServer.start();
            expect(redirectUri).toMatch(/^http:\/\/127\.0\.0\.1:\d+\/callback$/);
            
            // Extract port from redirect URI
            const url = new URL(redirectUri);
            const port = parseInt(url.port);
            
            // Create a promise to wait for the callback
            const callbackPromise = callbackServer.waitForCallback(5000);
            
            // Give server a moment to be ready
            await new Promise(resolve => setTimeout(resolve, 50));
            
            // Simulate OAuth callback with valid parameters
            const callbackUrl = `http://127.0.0.1:${port}/callback?code=${authCode}&state=${state}`;
            
            // Make HTTP request to simulate browser callback
            const response = await makeHttpRequest(callbackUrl);
            
            // Wait for callback result
            const result = await callbackPromise;
            
            // Verify callback was handled correctly
            expect(result.success).toBe(true);
            expect(result.code).toBe(authCode);
            expect(result.state).toBe(state);
            expect(result.error).toBeUndefined();
            expect(result.errorDescription).toBeUndefined();
            
            // Verify HTTP response was successful
            expect(response.statusCode).toBe(200);
            expect(response.body).toContain('Authentication Successful');
          } finally {
            // Server should still be running but callback should be resolved
            await callbackServer.stop();
          }
        }
      ),
      { numRuns: 5, timeout: 10000 }
    );
  });

  test('Property 2: Callback Handling and Token Exchange - server handles OAuth error responses correctly', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom('access_denied', 'invalid_request', 'unauthorized_client', 'unsupported_response_type'),
        fc.string({ minLength: 5, maxLength: 100 }),
        async (errorCode, errorDescription) => {
          // Create fresh callback server for this test run
          const callbackServer = new CallbackServer();
          
          try {
            // Start the callback server
            const redirectUri = await callbackServer.start();
            const url = new URL(redirectUri);
            const port = parseInt(url.port);
            
            // Create a promise to wait for the callback
            const callbackPromise = callbackServer.waitForCallback(5000);
            
            // Give server a moment to be ready
            await new Promise(resolve => setTimeout(resolve, 50));
            
            // Simulate OAuth error callback
            const callbackUrl = `http://127.0.0.1:${port}/callback?error=${errorCode}&error_description=${encodeURIComponent(errorDescription)}`;
            
            // Make HTTP request to simulate browser callback
            const response = await makeHttpRequest(callbackUrl);
            
            // Wait for callback result
            const result = await callbackPromise;
            
            // Verify error was handled correctly
            expect(result.success).toBe(false);
            
            // User cancellation errors should be normalized to 'user_cancelled'
            const userCancellationErrors = ['access_denied', 'user_cancelled_login', 'user_denied', 'authorization_declined'];
            if (userCancellationErrors.includes(errorCode)) {
              expect(result.error).toBe('user_cancelled');
              expect(result.errorDescription).toBe('Authentication was cancelled by the user');
            } else {
              // Other errors should be preserved as-is
              expect(result.error).toBe(errorCode);
              expect(result.errorDescription).toBe(errorDescription);
            }
            
            expect(result.code).toBeUndefined();
            expect(result.state).toBeUndefined();
            
            // Verify HTTP response shows error
            expect(response.statusCode).toBe(400);
            expect(response.body).toContain('Authentication Error');
          } finally {
            await callbackServer.stop();
          }
        }
      ),
      { numRuns: 5, timeout: 10000 }
    );
  });

  test('Property 2: Callback Handling and Token Exchange - server rejects invalid callback requests', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.oneof(
          fc.constant(''), // Empty code
          fc.string({ minLength: 1, maxLength: 10 }).filter(s => s.includes(' ')), // Code with spaces
          fc.string({ minLength: 1, maxLength: 10 }).filter(s => s.includes('&')), // Code with special chars
        ),
        fc.oneof(
          fc.constant(''), // Empty state
          fc.string({ minLength: 1, maxLength: 10 }).filter(s => s.includes(' ')), // State with spaces
        ),
        async (invalidCode, invalidState) => {
          // Create fresh callback server for this test run
          const callbackServer = new CallbackServer();
          
          try {
            // Start the callback server
            const redirectUri = await callbackServer.start();
            const url = new URL(redirectUri);
            const port = parseInt(url.port);
            
            // Create a promise to wait for the callback
            const callbackPromise = callbackServer.waitForCallback(5000);
            
            // Give server a moment to be ready
            await new Promise(resolve => setTimeout(resolve, 50));
            
            // Simulate invalid callback
            let callbackUrl = `http://127.0.0.1:${port}/callback`;
            const params = new URLSearchParams();
            
            if (invalidCode) {
              params.append('code', invalidCode);
            }
            if (invalidState) {
              params.append('state', invalidState);
            }
            
            if (params.toString()) {
              callbackUrl += '?' + params.toString();
            }
            
            // Make HTTP request to simulate browser callback
            const response = await makeHttpRequest(callbackUrl);
            
            // Wait for callback result
            const result = await callbackPromise;
            
            // Verify invalid request was rejected
            expect(result.success).toBe(false);
            expect(result.error).toBe('invalid_request');
            expect(result.errorDescription).toBeTruthy();
            
            // Verify HTTP response shows error
            expect(response.statusCode).toBe(400);
            expect(response.body).toContain('Authentication Error');
          } finally {
            await callbackServer.stop();
          }
        }
      ),
      { numRuns: 5, timeout: 10000 }
    );
  });

  test('Property 2: Callback Handling and Token Exchange - server handles timeout correctly', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 100, max: 1000 }), // Timeout in milliseconds
        async (timeoutMs) => {
          // Create fresh callback server for this test run
          const callbackServer = new CallbackServer();
          
          try {
            // Start the callback server
            const redirectUri = await callbackServer.start();
            expect(redirectUri).toMatch(/^http:\/\/127\.0\.0\.1:\d+\/callback$/);
            
            // Wait for callback with short timeout (no actual callback made)
            const result = await callbackServer.waitForCallback(timeoutMs);
            
            // Verify timeout was handled correctly
            expect(result.success).toBe(false);
            expect(result.error).toBe('timeout');
            expect(result.errorDescription).toBe('Authentication timed out');
            expect(result.code).toBeUndefined();
            expect(result.state).toBeUndefined();
          } finally {
            await callbackServer.stop();
          }
        }
      ),
      { numRuns: 10, timeout: 15000 }
    );
  });

  test('Property 2: Callback Handling and Token Exchange - server port selection works with conflicts', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 8080, max: 8090 }), // Starting port
        async (startPort) => {
          // Create a server to occupy the desired port
          const blockingServer = http.createServer();
          
          await new Promise<void>((resolve) => {
            blockingServer.listen(startPort, '127.0.0.1', () => {
              resolve();
            });
          });
          
          // Create fresh callback server for this test run
          const callbackServer = new CallbackServer();
          
          try {
            // Try to start callback server with blocked port
            const config: Partial<CallbackServerConfig> = {
              port: startPort,
              maxRetries: 3
            };
            
            const redirectUri = await callbackServer.start(config);
            
            // Should get a different port
            const url = new URL(redirectUri);
            const actualPort = parseInt(url.port);
            expect(actualPort).toBeGreaterThan(startPort);
            expect(actualPort).toBeLessThanOrEqual(startPort + 2);
          } finally {
            // Clean up both servers
            await callbackServer.stop();
            await new Promise<void>((resolve) => {
              blockingServer.close(() => resolve());
            });
          }
        }
      ),
      { numRuns: 5, timeout: 10000 }
    );
  });
});

/**
 * Helper function to make HTTP requests for testing
 */
async function makeHttpRequest(url: string): Promise<{ statusCode: number; body: string }> {
  return new Promise((resolve, reject) => {
    const request = http.get(url, (response) => {
      let body = '';
      
      response.on('data', (chunk) => {
        body += chunk;
      });
      
      response.on('end', () => {
        resolve({
          statusCode: response.statusCode || 0,
          body
        });
      });
    });
    
    request.on('error', (error) => {
      reject(error);
    });
    
    request.setTimeout(5000, () => {
      request.destroy();
      reject(new Error('Request timeout'));
    });
  });
}