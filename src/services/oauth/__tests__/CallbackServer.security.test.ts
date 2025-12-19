/**
 * Property-based tests for CallbackServer Security
 * Tests server security and validation requirements
 */

import { describe, test, expect } from '@jest/globals';
import * as fc from 'fast-check';
import * as http from 'http';
import { CallbackServer } from '../core/CallbackServer';

describe('CallbackServer Security', () => {
  /**
   * Feature: tauri-oauth-implementation, Property 11: Server Security and Validation
   * Validates: Requirements 2.4, 7.2, 7.4
   * 
   * For any callback server operation, it should bind only to localhost, 
   * validate requests, and reject malformed inputs
   */
  test('Property 11: Server Security and Validation - server only binds to localhost', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 8080, max: 8090 }), // Port range
        async (startPort) => {
          const callbackServer = new CallbackServer();
          
          try {
            // Start server with specific port
            const redirectUri = await callbackServer.start({ port: startPort });
            
            // Verify redirect URI uses localhost/127.0.0.1
            expect(redirectUri).toMatch(/^http:\/\/127\.0\.0\.1:\d+\/callback$/);
            
            const url = new URL(redirectUri);
            expect(url.hostname).toBe('127.0.0.1');
            expect(url.protocol).toBe('http:');
            expect(url.pathname).toBe('/callback');
            
            // Verify port is within expected range
            const port = parseInt(url.port);
            expect(port).toBeGreaterThanOrEqual(startPort);
            expect(port).toBeLessThanOrEqual(startPort + 2); // Within retry range
          } finally {
            await callbackServer.stop();
          }
        }
      ),
      { numRuns: 5, timeout: 5000 }
    );
  });

  test('Property 11: Server Security and Validation - server rejects non-GET requests', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom('POST', 'PUT', 'DELETE'),
        async (method) => {
          const callbackServer = new CallbackServer();
          
          try {
            const redirectUri = await callbackServer.start();
            const url = new URL(redirectUri);
            const port = parseInt(url.port);
            
            // Give server a moment to be ready
            await new Promise(resolve => setTimeout(resolve, 50));
            
            // Make non-GET request
            const response = await makeHttpRequest(`http://127.0.0.1:${port}/callback`, method);
            
            // Verify non-GET request was rejected
            expect(response.statusCode).toBe(405); // Method Not Allowed
            expect(response.body).toContain('Method Not Allowed');
          } finally {
            await callbackServer.stop();
          }
        }
      ),
      { numRuns: 3, timeout: 8000 }
    );
  }, 10000);

  test('Property 11: Server Security and Validation - server rejects requests to wrong paths', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom('/', '/oauth', '/auth', '/wrong'),
        async (wrongPath) => {
          const callbackServer = new CallbackServer();
          
          try {
            const redirectUri = await callbackServer.start();
            const url = new URL(redirectUri);
            const port = parseInt(url.port);
            
            // Give server a moment to be ready
            await new Promise(resolve => setTimeout(resolve, 50));
            
            // Make request to wrong path
            const response = await makeHttpRequest(`http://127.0.0.1:${port}${wrongPath}`);
            
            // Verify wrong path was rejected
            expect(response.statusCode).toBe(404); // Not Found
            expect(response.body).toContain('Not Found');
          } finally {
            await callbackServer.stop();
          }
        }
      ),
      { numRuns: 3, timeout: 8000 }
    );
  }, 10000);

  test('Property 11: Server Security and Validation - server validates callback parameters', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.oneof(
          // Missing both code and error (should be rejected)
          fc.constant(''),
          // Missing code parameter (should be rejected)
          fc.constant('state=test_state'),
          // Missing state parameter (should be rejected)  
          fc.constant('code=test_code')
        ),
        async (queryString) => {
          const callbackServer = new CallbackServer();
          
          try {
            const redirectUri = await callbackServer.start();
            const url = new URL(redirectUri);
            const port = parseInt(url.port);
            
            // Start waiting for callback
            const callbackPromise = callbackServer.waitForCallback(2000);
            
            // Give server a moment to be ready
            await new Promise(resolve => setTimeout(resolve, 50));
            
            // Make request with malformed parameters
            const callbackUrl = `http://127.0.0.1:${port}/callback?${queryString}`;
            const response = await makeHttpRequest(callbackUrl);
            
            // Wait for callback result
            const result = await callbackPromise;
            
            // Server should reject requests missing required parameters
            expect(result.success).toBe(false);
            expect(result.error).toBe('invalid_request');
            
            // Response should be an error page
            expect(response.statusCode).toBe(400);
            expect(response.body).toContain('Authentication Error');
          } finally {
            await callbackServer.stop();
          }
        }
      ),
      { numRuns: 3, timeout: 8000 }
    );
  }, 10000);

  test('Property 11: Server Security and Validation - server properly cleans up resources', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1, max: 2 }), // Number of start/stop cycles
        async (cycles) => {
          const callbackServer = new CallbackServer();
          
          for (let i = 0; i < cycles; i++) {
            // Start server
            const redirectUri = await callbackServer.start();
            expect(redirectUri).toMatch(/^http:\/\/127\.0\.0\.1:\d+\/callback$/);
            
            // Stop server
            await callbackServer.stop();
            
            // Small delay to ensure cleanup
            await new Promise(resolve => setTimeout(resolve, 100));
          }
          
          return true;
        }
      ),
      { numRuns: 3, timeout: 5000 }
    );
  });
});

/**
 * Helper function to make HTTP requests for testing
 */
async function makeHttpRequest(
  url: string, 
  method: string = 'GET', 
  timeoutMs: number = 3000
): Promise<{ statusCode: number; body: string }> {
  return new Promise((resolve, reject) => {
    const options = {
      method,
      timeout: timeoutMs
    };
    
    const request = http.request(url, options, (response) => {
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
    
    request.setTimeout(timeoutMs, () => {
      request.destroy();
      reject(new Error('Request timeout'));
    });
    
    request.end();
  });
}