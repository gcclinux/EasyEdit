/**
 * Property-based tests for BrowserLauncher
 * Tests cross-platform browser launching functionality
 */

import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import * as fc from 'fast-check';
import { BrowserLauncher } from '../core/BrowserLauncher';
import { Command } from '@tauri-apps/plugin-shell';

// Mock the Tauri Command module
jest.mock('@tauri-apps/plugin-shell', () => ({
  Command: {
    create: jest.fn(),
  },
}));

const mockCommand = Command as jest.Mocked<typeof Command>;

describe('BrowserLauncher', () => {
  let browserLauncher: BrowserLauncher;
  let mockExecute: jest.Mock;

  beforeEach(() => {
    browserLauncher = new BrowserLauncher();
    mockExecute = jest.fn();
    const mockCommandInstance = {
      execute: mockExecute,
    };
    mockCommand.create.mockReturnValue(mockCommandInstance as any);
    
    // Reset mocks
    jest.clearAllMocks();
  });

  /**
   * Feature: tauri-oauth-implementation, Property 12: Cross-Platform Compatibility
   * Validates: Requirements 8.1, 8.2, 8.3, 8.4, 8.5
   * 
   * For any platform (Windows, macOS, Linux), the system should use appropriate 
   * platform-specific methods for browser launching, secure storage, and file handling
   */
  test('Property 12: Cross-Platform Compatibility - openUrl validates URL format before launching', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.oneof(
          fc.constant(''), // empty string
          fc.string({ minLength: 1, maxLength: 10 }).filter(s => !s.includes('://')), // invalid URL format
          fc.constant('not-a-url'),
          fc.webUrl() // valid URL
        ),
        async (url) => {
          // Reset mocks for each test
          jest.clearAllMocks();
          (mockExecute as any).mockResolvedValue(undefined);
          
          if (url === '') {
            // Should reject empty URLs
            await expect(browserLauncher.openUrl(url)).rejects.toThrow('Invalid URL provided');
            expect(mockCommand.create).not.toHaveBeenCalled();
          } else {
            try {
              new URL(url); // Test if URL is valid
              // Valid URL - should attempt to launch
              await browserLauncher.openUrl(url);
              expect(mockCommand.create).toHaveBeenCalled();
            } catch {
              // Invalid URL format - should reject
              await expect(browserLauncher.openUrl(url)).rejects.toThrow('Invalid URL format');
              expect(mockCommand.create).not.toHaveBeenCalled();
            }
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 12: Cross-Platform Compatibility - platform detection returns valid platform', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.oneof(
          fc.constant('win32'),
          fc.constant('darwin'), 
          fc.constant('linux')
        ),
        async (mockPlatform) => {
          // Mock process.platform
          const originalPlatform = process.platform;
          Object.defineProperty(process, 'platform', {
            value: mockPlatform,
            configurable: true
          });
          
          try {
            // Reset mocks for each test
            jest.clearAllMocks();
            (mockExecute as any).mockResolvedValue(undefined);
            
            // Create new instance to trigger platform detection
            const launcher = new BrowserLauncher();
            
            // Test platform detection through openUrl behavior
            const testUrl = 'https://example.com';
            
            await launcher.openUrl(testUrl);
            
            // Should have called Command.create with platform-appropriate command
            expect(mockCommand.create).toHaveBeenCalled();
            const calls = mockCommand.create.mock.calls;
            expect(calls.length).toBeGreaterThan(0);
            
            // Verify platform-specific commands were used (first attempt or fallback)
            const allCommands = calls.map(call => call[0] as string);
            
            if (mockPlatform === 'win32') {
              expect(allCommands.some(cmd => ['cmd', 'explorer'].includes(cmd) || cmd.includes('cmd'))).toBe(true);
            } else if (mockPlatform === 'darwin') {
              expect(allCommands.some(cmd => cmd === 'open')).toBe(true);
            } else {
              // Linux and other Unix-like systems
              const linuxCommands = ['xdg-open', 'gnome-open', 'kde-open', 'firefox', 'chromium', 'google-chrome'];
              expect(allCommands.some(cmd => linuxCommands.includes(cmd))).toBe(true);
            }
          } finally {
            // Restore original platform
            Object.defineProperty(process, 'platform', {
              value: originalPlatform,
              configurable: true
            });
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 12: Cross-Platform Compatibility - handles command execution failures gracefully', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.webUrl(),
        fc.boolean(), // whether first command succeeds
        fc.boolean(), // whether fallback succeeds
        async (url, firstSucceeds, fallbackSucceeds) => {
          // Configure mock behavior
          if (firstSucceeds) {
            (mockExecute as any).mockResolvedValueOnce(undefined);
          } else if (fallbackSucceeds) {
            (mockExecute as any)
              .mockRejectedValueOnce(new Error('First command failed'))
              .mockResolvedValueOnce(undefined);
          } else {
            (mockExecute as any).mockRejectedValue(new Error('All commands failed'));
          }
          
          if (firstSucceeds || fallbackSucceeds) {
            // Should succeed without throwing
            await expect(browserLauncher.openUrl(url)).resolves.not.toThrow();
            expect(mockCommand.create).toHaveBeenCalled();
          } else {
            // Should fail gracefully with helpful error message
            await expect(browserLauncher.openUrl(url)).rejects.toThrow();
            const error = await browserLauncher.openUrl(url).catch(e => e);
            expect(error.message).toContain('Failed to open browser');
            expect(error.message).toContain(url); // Should include URL for manual copying
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 12: Cross-Platform Compatibility - uses correct command arguments for each platform', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.webUrl(),
        fc.oneof(
          fc.constant('win32'),
          fc.constant('darwin'),
          fc.constant('linux')
        ),
        async (url, mockPlatform) => {
          // Mock process.platform
          const originalPlatform = process.platform;
          Object.defineProperty(process, 'platform', {
            value: mockPlatform,
            configurable: true
          });
          
          try {
            // Reset mocks for each test
            jest.clearAllMocks();
            (mockExecute as any).mockResolvedValue(undefined);
            
            const launcher = new BrowserLauncher();
            await launcher.openUrl(url);
            
            expect(mockCommand.create).toHaveBeenCalled();
            const calls = mockCommand.create.mock.calls;
            
            // Find a call that contains our URL
            const relevantCall = calls.find(call => {
              const [, args] = call;
              return Array.isArray(args) && args.includes(url);
            });
            
            expect(relevantCall).toBeDefined();
            const [command, args] = relevantCall!;
            
            // Verify command and arguments are appropriate for platform
            expect(Array.isArray(args)).toBe(true);
            expect(args).toContain(url); // URL should be in arguments
            
            if (mockPlatform === 'win32') {
              if (command === 'cmd') {
                expect(args).toEqual(['/c', 'start', '', url]);
              } else if (command === 'explorer') {
                expect(args).toEqual([url]);
              } else {
                // Fallback commands should still contain the URL
                expect(args).toContain(url);
              }
            } else if (mockPlatform === 'darwin') {
              if (command === 'open') {
                expect(args).toEqual([url]);
              } else {
                // Fallback commands should still contain the URL
                expect(args).toContain(url);
              }
            } else {
              // Linux - should be one of the known launchers
              const validLinuxCommands = ['xdg-open', 'gnome-open', 'kde-open', 'firefox', 'chromium', 'google-chrome'];
              if (validLinuxCommands.includes(command as string)) {
                expect(args).toEqual([url]);
              } else {
                // Fallback commands should still contain the URL
                expect(args).toContain(url);
              }
            }
          } finally {
            // Restore original platform
            Object.defineProperty(process, 'platform', {
              value: originalPlatform,
              configurable: true
            });
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 12: Cross-Platform Compatibility - fallback mechanisms work across platforms', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.webUrl(),
        fc.integer({ min: 1, max: 3 }), // number of commands that fail before success
        async (url, failureCount) => {
          // Reset mocks for each test
          jest.clearAllMocks();
          
          // Configure mock to fail first N calls, then succeed
          for (let i = 0; i < failureCount; i++) {
            (mockExecute as any).mockRejectedValueOnce(new Error(`Command ${i} failed`));
          }
          (mockExecute as any).mockResolvedValue(undefined); // All subsequent calls succeed
          
          // Should eventually succeed through fallback mechanisms
          await expect(browserLauncher.openUrl(url)).resolves.not.toThrow();
          
          // Should have tried at least failureCount + 1 commands
          expect(mockCommand.create).toHaveBeenCalled();
          const callCount = mockCommand.create.mock.calls.length;
          expect(callCount).toBeGreaterThanOrEqual(failureCount + 1);
          
          // At least one call should include the URL
          const calls = mockCommand.create.mock.calls;
          const hasUrlInCalls = calls.some(([, args]) => Array.isArray(args) && args.includes(url));
          expect(hasUrlInCalls).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 12: Cross-Platform Compatibility - error messages are informative and include URL', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.webUrl(),
        async (url) => {
          // Configure all commands to fail
          (mockExecute as any).mockRejectedValue(new Error('All commands failed'));
          
          try {
            await browserLauncher.openUrl(url);
            // Should not reach here
            expect(true).toBe(false);
          } catch (error) {
            expect(error).toBeInstanceOf(Error);
            const errorMessage = (error as Error).message;
            
            // Error message should be informative
            expect(errorMessage).toContain('Failed to open browser');
            expect(errorMessage).toContain(url); // Should include URL for manual copying
            expect(errorMessage).toContain('manually copy and paste'); // Should provide fallback instructions
            
            // Should not expose internal implementation details
            expect(errorMessage).not.toContain('Command');
            expect(errorMessage).not.toContain('execute');
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 12: Cross-Platform Compatibility - handles special URL characters correctly', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.oneof(
          fc.webUrl(),
          fc.string({ minLength: 1, maxLength: 20 }).map(s => `https://example.com/?q=${encodeURIComponent(s)}`), // URLs with query params
          fc.string({ minLength: 1, maxLength: 20 }).map(s => `https://example.com/#${encodeURIComponent(s)}`), // URLs with fragments
        ),
        async (url) => {
          // Only test valid URLs
          try {
            new URL(url);
          } catch {
            return; // Skip invalid URLs
          }
          
          // Reset mocks for each test
          jest.clearAllMocks();
          (mockExecute as any).mockResolvedValue(undefined);
          
          await browserLauncher.openUrl(url);
          
          expect(mockCommand.create).toHaveBeenCalled();
          const calls = mockCommand.create.mock.calls;
          
          // Find a call that contains our URL (might be in any of the calls due to fallbacks)
          const hasUrlInCalls = calls.some(([, args]) => Array.isArray(args) && args.includes(url));
          expect(hasUrlInCalls).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });
});