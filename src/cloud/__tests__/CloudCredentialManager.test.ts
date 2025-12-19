/**
 * Property-based tests for CloudCredentialManager
 * **Feature: cloud-notes-integration, Property 10: Credential Security and Management**
 * **Validates: Requirements 6.1, 6.2, 6.3, 6.5**
 */

import * as fc from 'fast-check';
import { CloudCredentialManager } from '../managers/CloudCredentialManager';
import { CloudCredentials } from '../interfaces';

// Mock the encryption functions
jest.mock('../../stpFileCrypter', () => ({
  encryptTextToBytes: jest.fn((text: string, key: string) => {
    // Simple mock encryption - just encode the text
    const encoder = new TextEncoder();
    const textBytes = encoder.encode(text);
    return textBytes;
  }),
  decryptBytesToText: jest.fn((bytes: Uint8Array, key: string) => {
    // Simple mock decryption - just decode the text
    const decoder = new TextDecoder();
    return decoder.decode(bytes);
  })
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock TextEncoder/TextDecoder
Object.defineProperty(global, 'TextEncoder', {
  value: class TextEncoder {
    encode(input: string): Uint8Array {
      const bytes = new Uint8Array(input.length);
      for (let i = 0; i < input.length; i++) {
        bytes[i] = input.charCodeAt(i);
      }
      return bytes;
    }
  }
});

Object.defineProperty(global, 'TextDecoder', {
  value: class TextDecoder {
    decode(input: Uint8Array): string {
      return String.fromCharCode(...input);
    }
  }
});

// Mock crypto.subtle for password hashing
Object.defineProperty(global, 'crypto', {
  value: {
    subtle: {
      digest: jest.fn((algorithm: string, data: ArrayBuffer) => {
        // Simple mock hash
        const view = new Uint8Array(data);
        const hash = new Uint8Array(32);
        for (let i = 0; i < 32; i++) {
          hash[i] = view[i % view.length] ^ (i * 7);
        }
        return Promise.resolve(hash.buffer);
      })
    }
  }
});

describe('CloudCredentialManager Property Tests', () => {
  beforeEach(() => {
    localStorageMock.clear();
    // Reset all mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    localStorageMock.clear();
  });

  // Simple unit test to verify basic functionality
  it('should work with basic credentials', async () => {
    const testManager = new CloudCredentialManager();
    await testManager.setMasterPassword('testpassword123');
    
    const credentials = {
      provider: 'googledrive',
      accessToken: 'test-token-123',
      refreshToken: 'refresh-token-123',
      scope: 'drive.file',
      userId: 'user123'
    };
    
    await testManager.saveCredentials(credentials);
    const retrieved = await testManager.getCredentials('googledrive', 'user123');
    
    expect(retrieved).not.toBeNull();
    expect(retrieved!.accessToken).toBe('test-token-123');
  });

  // Test credential removal
  it('should remove credentials correctly', async () => {
    const testManager = new CloudCredentialManager();
    await testManager.setMasterPassword('testpassword123');
    
    const cred1 = {
      provider: 'googledrive',
      accessToken: 'token1',
      scope: 'drive.file',
      userId: undefined
    };
    
    const cred2 = {
      provider: 'googledrive',
      accessToken: 'token2',
      scope: 'drive.file',
      userId: 'user123'
    };
    
    await testManager.saveCredentials(cred1);
    await testManager.saveCredentials(cred2);
    
    // Verify both exist
    const providers = await testManager.getConnectedProviders();
    expect(providers).toHaveLength(2);
    
    // Remove first credential
    await testManager.removeCredentials('googledrive', undefined);
    
    // Verify only second remains
    const remaining = await testManager.getConnectedProviders();
    expect(remaining).toHaveLength(1);
    
    const retrieved1 = await testManager.getCredentials('googledrive', undefined);
    expect(retrieved1).toBeNull();
    
    const retrieved2 = await testManager.getCredentials('googledrive', 'user123');
    expect(retrieved2).not.toBeNull();
    expect(retrieved2!.accessToken).toBe('token2');
  });

  /**
   * **Feature: cloud-notes-integration, Property 10: Credential Security and Management**
   * **Validates: Requirements 6.1, 6.2, 6.3, 6.5**
   * 
   * Property: For any authentication token, the system should encrypt storage, 
   * validate token expiration, handle refresh operations, and manage multiple 
   * providers independently
   */
  describe('Property 10: Credential Security and Management', () => {
    const validPasswordArb = fc.string({ minLength: 8, maxLength: 50 }).filter(s => /^[a-zA-Z0-9]+$/.test(s));
    const providerArb = fc.constantFrom('googledrive', 'dropbox', 'onedrive', 'nextcloud');
    const tokenArb = fc.string({ minLength: 10, maxLength: 200 }).filter(s => /^[a-zA-Z0-9]+$/.test(s));
    const userIdArb = fc.option(fc.string({ minLength: 1, maxLength: 50 }).filter(s => /^[a-zA-Z0-9]+$/.test(s)));
    const scopeArb = fc.string({ minLength: 1, maxLength: 100 }).filter(s => /^[a-zA-Z0-9.]+$/.test(s));

    const credentialsArb = fc.record({
      provider: providerArb,
      accessToken: tokenArb,
      refreshToken: fc.option(tokenArb),
      expiresAt: fc.constantFrom(undefined, new Date(Date.now() + 3600000)), // Either undefined or 1 hour in future
      scope: scopeArb,
      userId: userIdArb
    });

    it('should encrypt and decrypt credentials correctly for any valid input', async () => {
      await fc.assert(fc.asyncProperty(
        validPasswordArb,
        credentialsArb,
        async (password, credentials) => {
          // Clear localStorage before each property test run
          localStorageMock.clear();
          
          // Create a fresh manager for each test
          const testManager = new CloudCredentialManager();
          
          // Set master password
          await testManager.setMasterPassword(password);
          
          // Save credentials
          await testManager.saveCredentials(credentials);
          
          // Retrieve credentials
          const retrieved = await testManager.getCredentials(credentials.provider, credentials.userId);
          
          // Verify all fields match
          expect(retrieved).not.toBeNull();
          expect(retrieved!.provider).toBe(credentials.provider);
          expect(retrieved!.accessToken).toBe(credentials.accessToken);
          expect(retrieved!.refreshToken).toBe(credentials.refreshToken);
          expect(retrieved!.scope).toBe(credentials.scope);
          expect(retrieved!.userId).toBe(credentials.userId);
          
          if (credentials.expiresAt) {
            expect(retrieved!.expiresAt?.getTime()).toBe(credentials.expiresAt.getTime());
          }
        }
      ), { numRuns: 10 });
    });

    it('should manage multiple providers independently', async () => {
      await fc.assert(fc.asyncProperty(
        validPasswordArb,
        fc.array(credentialsArb, { minLength: 2, maxLength: 3 }),
        async (password, credentialsArray) => {
          // Clear localStorage before each property test run
          localStorageMock.clear();
          
          // Create a fresh manager for each test
          const testManager = new CloudCredentialManager();
          
          // Ensure unique provider-user combinations
          const uniqueCredentials = credentialsArray.reduce((acc, cred) => {
            const key = `${cred.provider}-${cred.userId || 'default'}`;
            acc[key] = cred;
            return acc;
          }, {} as Record<string, CloudCredentials>);
          
          const credentials = Object.values(uniqueCredentials);
          if (credentials.length < 2) return; // Skip if not enough unique combinations
          
          await testManager.setMasterPassword(password);
          
          // Save all credentials
          for (const cred of credentials) {
            await testManager.saveCredentials(cred);
          }
          
          // Verify each can be retrieved independently
          for (const cred of credentials) {
            const retrieved = await testManager.getCredentials(cred.provider, cred.userId);
            expect(retrieved).not.toBeNull();
            expect(retrieved!.provider).toBe(cred.provider);
            expect(retrieved!.accessToken).toBe(cred.accessToken);
          }
          
          // Verify connected providers list
          const connectedProviders = await testManager.getConnectedProviders();
          expect(connectedProviders.length).toBeGreaterThanOrEqual(credentials.length);
        }
      ), { numRuns: 10 });
    });

    it('should validate token expiration correctly', async () => {
      await fc.assert(fc.asyncProperty(
        validPasswordArb,
        providerArb,
        tokenArb,
        scopeArb,
        userIdArb,
        async (password, provider, accessToken, scope, userId) => {
          // Create a fresh manager for each test
          const testManager = new CloudCredentialManager();
          
          await testManager.setMasterPassword(password);
          
          // Create expired credentials
          const expiredCredentials: CloudCredentials = {
            provider,
            accessToken,
            scope,
            userId: userId || undefined,
            expiresAt: new Date(Date.now() - 1000) // 1 second ago
          };
          
          await testManager.saveCredentials(expiredCredentials);
          
          // Should return null for expired credentials
          const retrieved = await testManager.getCredentials(provider, userId);
          expect(retrieved).toBeNull();
          
          // Should not appear in connected providers
          const connectedProviders = await testManager.getConnectedProviders();
          expect(connectedProviders.find(p => p.provider === provider && p.userId === userId)).toBeUndefined();
        }
      ), { numRuns: 50 });
    });

    it('should handle credential updates correctly', async () => {
      await fc.assert(fc.asyncProperty(
        validPasswordArb,
        credentialsArb,
        tokenArb,
        async (password, originalCredentials, newToken) => {
          // Clear localStorage before each property test run
          localStorageMock.clear();
          
          // Create a fresh manager for each test
          const testManager = new CloudCredentialManager();
          
          await testManager.setMasterPassword(password);
          
          // Save original credentials
          await testManager.saveCredentials(originalCredentials);
          
          // Update access token
          await testManager.updateCredentials(
            originalCredentials.provider, 
            { accessToken: newToken },
            originalCredentials.userId
          );
          
          // Verify update
          const retrieved = await testManager.getCredentials(
            originalCredentials.provider, 
            originalCredentials.userId
          );
          
          expect(retrieved).not.toBeNull();
          expect(retrieved!.accessToken).toBe(newToken);
          expect(retrieved!.provider).toBe(originalCredentials.provider);
          expect(retrieved!.scope).toBe(originalCredentials.scope);
        }
      ), { numRuns: 10 });
    });

    it('should require correct master password for access', async () => {
      await fc.assert(fc.asyncProperty(
        validPasswordArb,
        validPasswordArb,
        credentialsArb,
        async (correctPassword, wrongPassword, credentials) => {
          fc.pre(correctPassword !== wrongPassword); // Ensure passwords are different
          
          // Clear localStorage before each property test run
          localStorageMock.clear();
          
          // Create a fresh manager for each test
          const testManager = new CloudCredentialManager();
          
          await testManager.setMasterPassword(correctPassword);
          await testManager.saveCredentials(credentials);
          
          // Lock the manager
          testManager.lock();
          
          // Try with wrong password
          const unlockResult = await testManager.unlock(wrongPassword);
          expect(unlockResult).toBe(false);
          
          // Should throw error when trying to access
          await expect(testManager.getCredentials(credentials.provider, credentials.userId))
            .rejects.toThrow('Master password not set');
          
          // Unlock with correct password
          const correctUnlock = await testManager.unlock(correctPassword);
          expect(correctUnlock).toBe(true);
          
          // Should now be able to access
          const retrieved = await testManager.getCredentials(credentials.provider, credentials.userId);
          expect(retrieved).not.toBeNull();
        }
      ), { numRuns: 10 });
    });
  });

  /**
   * **Feature: cloud-notes-integration, Property 11: Credential Cleanup**
   * **Validates: Requirements 6.4**
   * 
   * Property: For any provider disconnection, the system should securely delete 
   * all associated credentials and clear cached data completely
   */
  describe('Property 11: Credential Cleanup', () => {
    const validPasswordArb = fc.string({ minLength: 8, maxLength: 50 }).filter(s => /^[a-zA-Z0-9]+$/.test(s));
    const providerArb = fc.constantFrom('googledrive', 'dropbox', 'onedrive', 'nextcloud');
    const tokenArb = fc.string({ minLength: 10, maxLength: 200 }).filter(s => /^[a-zA-Z0-9]+$/.test(s));
    const userIdArb = fc.option(fc.string({ minLength: 1, maxLength: 50 }).filter(s => /^[a-zA-Z0-9]+$/.test(s)));
    const scopeArb = fc.string({ minLength: 1, maxLength: 100 }).filter(s => /^[a-zA-Z0-9.]+$/.test(s));

    const credentialsArb = fc.record({
      provider: providerArb,
      accessToken: tokenArb,
      refreshToken: fc.option(tokenArb),
      expiresAt: fc.constantFrom(undefined, new Date(Date.now() + 3600000)), // Either undefined or 1 hour in future
      scope: scopeArb,
      userId: userIdArb
    });
    it('should completely remove credentials when disconnecting a provider', async () => {
      await fc.assert(fc.asyncProperty(
        validPasswordArb,
        fc.array(credentialsArb, { minLength: 2, maxLength: 4 }),
        async (password, credentialsArray) => {
          // Clear localStorage before each property test run
          localStorageMock.clear();
          
          // Create a fresh manager for each test
          const testManager = new CloudCredentialManager();
          
          // Ensure unique provider-user combinations
          const uniqueCredentials = credentialsArray.reduce((acc, cred) => {
            const key = `${cred.provider}-${cred.userId || 'default'}`;
            acc[key] = cred;
            return acc;
          }, {} as Record<string, CloudCredentials>);
          
          const credentials = Object.values(uniqueCredentials);
          if (credentials.length < 2) return; // Skip if not enough unique combinations
          
          await testManager.setMasterPassword(password);
          
          // Save all credentials
          for (const cred of credentials) {
            await testManager.saveCredentials(cred);
          }
          
          // Verify all credentials are stored
          const initialConnectedProviders = await testManager.getConnectedProviders();
          expect(initialConnectedProviders.length).toBe(credentials.length);
          
          // Pick the first credential to remove
          const credentialToRemove = credentials[0];
          
          // Remove credentials for this provider
          await testManager.removeCredentials(
            credentialToRemove.provider, 
            credentialToRemove.userId
          );
          
          // Verify the specific credential is removed
          const removedCredential = await testManager.getCredentials(
            credentialToRemove.provider, 
            credentialToRemove.userId
          );
          expect(removedCredential).toBeNull();
          
          // Verify other credentials still exist (only those with different provider-userId combinations)
          const remainingCredentials = credentials.filter(cred => 
            !(cred.provider === credentialToRemove.provider && 
              cred.userId === credentialToRemove.userId)
          );
          
          for (const cred of remainingCredentials) {
            const retrieved = await testManager.getCredentials(cred.provider, cred.userId);
            expect(retrieved).not.toBeNull();
            expect(retrieved!.accessToken).toBe(cred.accessToken);
          }
          
          // Verify connected providers list is updated
          const finalConnectedProviders = await testManager.getConnectedProviders();
          expect(finalConnectedProviders.length).toBe(remainingCredentials.length);
          
          // Verify the removed provider is not in the list
          const removedProviderExists = finalConnectedProviders.some(
            p => p.provider === credentialToRemove.provider && 
                 p.userId === credentialToRemove.userId
          );
          expect(removedProviderExists).toBe(false);
        }
      ), { numRuns: 10 });
    });

    it('should clear all credentials when clearing master password', async () => {
      await fc.assert(fc.asyncProperty(
        validPasswordArb,
        fc.array(credentialsArb, { minLength: 1, maxLength: 3 }),
        async (password, credentialsArray) => {
          // Clear localStorage before each property test run
          localStorageMock.clear();
          
          // Create a fresh manager for each test
          const testManager = new CloudCredentialManager();
          
          await testManager.setMasterPassword(password);
          
          // Save all credentials
          for (const cred of credentialsArray) {
            await testManager.saveCredentials(cred);
          }
          
          // Verify credentials are stored
          expect(testManager.hasMasterPassword()).toBe(true);
          const connectedProviders = await testManager.getConnectedProviders();
          expect(connectedProviders.length).toBeGreaterThan(0);
          
          // Clear master password (should clear all credentials)
          await testManager.clearMasterPassword();
          
          // Verify master password is cleared
          expect(testManager.hasMasterPassword()).toBe(false);
          expect(testManager.isUnlocked()).toBe(false);
          
          // Create a new manager to test if credentials are actually cleared from storage
          const newManager = new CloudCredentialManager();
          await newManager.setMasterPassword(password);
          
          // Verify all credentials are cleared from storage
          const emptyConnectedProviders = await newManager.getConnectedProviders();
          expect(emptyConnectedProviders).toHaveLength(0);
          
          // Verify individual credentials are not accessible
          for (const cred of credentialsArray) {
            const retrieved = await newManager.getCredentials(cred.provider, cred.userId || undefined);
            expect(retrieved).toBeNull();
          }
        }
      ), { numRuns: 10 });
    });

    it('should clear all credentials when clearing all credentials', async () => {
      await fc.assert(fc.asyncProperty(
        validPasswordArb,
        fc.array(credentialsArb, { minLength: 1, maxLength: 3 }),
        async (password, credentialsArray) => {
          // Clear localStorage before each property test run
          localStorageMock.clear();
          
          // Create a fresh manager for each test
          const testManager = new CloudCredentialManager();
          
          await testManager.setMasterPassword(password);
          
          // Save all credentials
          for (const cred of credentialsArray) {
            await testManager.saveCredentials(cred);
          }
          
          // Verify credentials are stored
          const connectedProviders = await testManager.getConnectedProviders();
          expect(connectedProviders.length).toBeGreaterThan(0);
          
          // Clear all credentials
          await testManager.clearAllCredentials();
          
          // Verify master password still exists but credentials are cleared
          expect(testManager.hasMasterPassword()).toBe(true);
          expect(testManager.isUnlocked()).toBe(true);
          
          // Verify all credentials are cleared
          const emptyConnectedProviders = await testManager.getConnectedProviders();
          expect(emptyConnectedProviders).toHaveLength(0);
          
          // Verify individual credentials are not accessible
          for (const cred of credentialsArray) {
            const retrieved = await testManager.getCredentials(cred.provider, cred.userId || undefined);
            expect(retrieved).toBeNull();
          }
        }
      ), { numRuns: 10 });
    });
  });
});