/**
 * Secure token storage with platform-specific implementations
 * Provides encrypted storage of OAuth tokens using platform-specific secure storage mechanisms
 */

import { encryptAES256GCM, decryptAES256GCM, deriveKey } from '../utils/crypto-browser';
import type { OAuthTokens } from '../interfaces';

/**
 * Stored token data structure with metadata
 */
interface StoredTokenData {
  provider: string;
  tokens: {
    accessToken: string;
    refreshToken?: string;
    expiresAt: string; // ISO date string
    scope: string;
    tokenType: string;
  };
  metadata: {
    createdAt: string;
    lastRefreshed?: string;
    userId?: string;
  };
}

/**
 * Platform types for secure storage
 */
type Platform = 'windows' | 'macos' | 'linux' | 'unknown';

export class TokenStorage {
  private readonly keyPrefix = 'easyeditor-oauth';
  private readonly encryptionKey: Uint8Array;
  private readonly platform: Platform;

  constructor() {
    this.platform = this.detectPlatform();
    this.encryptionKey = this.deriveEncryptionKey();
  }

  /**
   * Store OAuth tokens securely using platform-specific mechanisms
   */
  async storeTokens(provider: string, tokens: OAuthTokens): Promise<void> {
    // Validate the expiration date
    if (!tokens.expiresAt || isNaN(tokens.expiresAt.getTime())) {
      throw new Error('Invalid expiration date provided');
    }

    const tokenData: StoredTokenData = {
      provider,
      tokens: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresAt: tokens.expiresAt.toISOString(),
        scope: tokens.scope,
        tokenType: tokens.tokenType,
      },
      metadata: {
        createdAt: new Date().toISOString(),
        userId: this.getUserId(),
      },
    };

    const encrypted = this.encryptTokens(tokenData);
    const key = `${this.keyPrefix}-${provider}`;
    
    await this.storeSecurely(key, encrypted);
  }
  
  /**
   * Retrieve OAuth tokens from secure storage
   */
  async getTokens(provider: string): Promise<OAuthTokens | null> {
    const key = `${this.keyPrefix}-${provider}`;
    
    try {
      const encrypted = await this.retrieveSecurely(key);
      if (!encrypted) {
        return null;
      }

      const tokenData = this.decryptTokens(encrypted);
      
      return {
        accessToken: tokenData.tokens.accessToken,
        refreshToken: tokenData.tokens.refreshToken,
        expiresAt: new Date(tokenData.tokens.expiresAt),
        scope: tokenData.tokens.scope,
        tokenType: tokenData.tokens.tokenType,
      };
    } catch (error) {
      // Only log errors for debugging, not for expected cases like missing tokens
      if (error instanceof Error && 
          !error.message.includes('Invalid authentication tag') && 
          !error.message.includes('Invalid encrypted data') &&
          !error.message.includes('Decryption failed')) {
        console.error(`Failed to retrieve tokens for provider ${provider}:`, error);
      }
      return null;
    }
  }
  
  /**
   * Remove OAuth tokens from secure storage
   */
  async removeTokens(provider: string): Promise<void> {
    const key = `${this.keyPrefix}-${provider}`;
    await this.deleteSecurely(key);
  }
  
  /**
   * List all providers with stored tokens
   */
  async listProviders(): Promise<string[]> {
    const providers: string[] = [];
    
    // In browser environment, use localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (key && key.startsWith(this.keyPrefix)) {
          try {
            const encrypted = window.localStorage.getItem(key);
            if (encrypted) {
              const tokenData = this.decryptTokens(encrypted);
              if (tokenData.provider) {
                providers.push(tokenData.provider);
              }
            }
          } catch (error) {
            // Skip items that can't be decrypted
          }
        }
      }
      return providers;
    }
    
    // In Node.js environment, use file storage (simplified)
    try {
      // For now, return empty array in Node.js environment
      // Full file system implementation would require additional setup
      return [];
    } catch (error) {
      return [];
    }
  }
  
  /**
   * Store data securely using platform-specific mechanisms
   */
  private async storeSecurely(key: string, data: string): Promise<void> {
    // In browser environment, use localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, data);
      return;
    }
    
    // In Node.js environment, use platform-specific storage
    switch (this.platform) {
      case 'windows':
        await this.storeFile(key, data); // Simplified for now
        break;
      case 'macos':
        await this.storeFile(key, data); // Simplified for now
        break;
      case 'linux':
        await this.storeFile(key, data); // Simplified for now
        break;
      default:
        await this.storeFile(key, data);
        break;
    }
  }
  
  /**
   * Retrieve data securely from platform-specific storage
   */
  private async retrieveSecurely(key: string): Promise<string | null> {
    // In browser environment, use localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
    
    // In Node.js environment, use platform-specific storage
    switch (this.platform) {
      case 'windows':
        return await this.retrieveFile(key); // Simplified for now
      case 'macos':
        return await this.retrieveFile(key); // Simplified for now
      case 'linux':
        return await this.retrieveFile(key); // Simplified for now
      default:
        return await this.retrieveFile(key);
    }
  }
  
  /**
   * Delete data securely from platform-specific storage
   */
  private async deleteSecurely(key: string): Promise<void> {
    // In browser environment, use localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key);
      return;
    }
    
    // In Node.js environment, use platform-specific storage
    switch (this.platform) {
      case 'windows':
        await this.deleteFile(key); // Simplified for now
        break;
      case 'macos':
        await this.deleteFile(key); // Simplified for now
        break;
      case 'linux':
        await this.deleteFile(key); // Simplified for now
        break;
      default:
        await this.deleteFile(key);
        break;
    }
  }

  /**
   * Encrypt tokens for secure storage
   */
  private encryptTokens(tokenData: StoredTokenData): string {
    const plaintext = JSON.stringify(tokenData);
    const { encrypted, iv, authTag } = encryptAES256GCM(plaintext, this.encryptionKey);
    
    // Combine IV, auth tag, and encrypted data in a single string
    return JSON.stringify({ encrypted, iv, authTag });
  }
  
  /**
   * Decrypt tokens from secure storage
   */
  private decryptTokens(encrypted: string): StoredTokenData {
    try {
      const { encrypted: encryptedData, iv, authTag } = JSON.parse(encrypted);
      
      const decrypted = decryptAES256GCM(encryptedData, this.encryptionKey, iv, authTag);
      const parsed = JSON.parse(decrypted);
      
      // Validate the structure
      if (!parsed.provider || !parsed.tokens || !parsed.metadata) {
        throw new Error('Invalid token data structure');
      }
      
      return parsed;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Decryption failed: ${error.message}`);
      }
      throw new Error('Decryption failed: unknown error');
    }
  }

  /**
   * Detect the current platform
   */
  private detectPlatform(): Platform {
    // In browser environment
    if (typeof window !== 'undefined') {
      return 'unknown'; // Browser doesn't have platform-specific secure storage
    }
    
    // In Node.js environment
    if (typeof process !== 'undefined' && process.platform) {
      switch (process.platform) {
        case 'win32':
          return 'windows';
        case 'darwin':
          return 'macos';
        case 'linux':
          return 'linux';
        default:
          return 'unknown';
      }
    }
    
    return 'unknown';
  }

  /**
   * Get user ID for metadata
   */
  private getUserId(): string {
    // In browser environment, use a generated ID stored in localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      let userId = window.localStorage.getItem('easyeditor-user-id');
      if (!userId) {
        userId = `user-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
        window.localStorage.setItem('easyeditor-user-id', userId);
      }
      return userId;
    }
    
    // In Node.js environment, use system username
    if (typeof process !== 'undefined') {
      try {
        const os = require('os');
        return os.userInfo().username;
      } catch (error) {
        return 'unknown-user';
      }
    }
    
    return 'unknown-user';
  }

  /**
   * Derive encryption key from system information
   */
  private deriveEncryptionKey(): Uint8Array {
    // In browser environment, use a key derived from browser fingerprint
    if (typeof window !== 'undefined') {
      const browserInfo = `${window.navigator.userAgent}-${window.location.hostname}-easyeditor-oauth`;
      return deriveKey(browserInfo, 'easyeditor-salt');
    }
    
    // In Node.js environment, use system information
    if (typeof process !== 'undefined') {
      try {
        const os = require('os');
        const systemInfo = `${os.hostname()}-${os.userInfo().username}-easyeditor-oauth`;
        return deriveKey(systemInfo, 'easyeditor-salt');
      } catch (error) {
        // Fallback to a default key
        return deriveKey('easyeditor-oauth-fallback', 'easyeditor-salt');
      }
    }
    
    // Fallback
    return deriveKey('easyeditor-oauth-fallback', 'easyeditor-salt');
  }

  /**
   * Simple file storage implementation (fallback for Node.js)
   */
  private async storeFile(key: string, data: string): Promise<void> {
    // In browser environment, this should not be called
    if (typeof window !== 'undefined') {
      throw new Error('File storage not available in browser environment');
    }
    
    // Simple in-memory storage for Node.js testing
    // In a real implementation, this would use proper file system storage
    if (!global.easyEditOAuthStorage) {
      global.easyEditOAuthStorage = new Map();
    }
    global.easyEditOAuthStorage.set(key, data);
  }

  private async retrieveFile(key: string): Promise<string | null> {
    // In browser environment, this should not be called
    if (typeof window !== 'undefined') {
      return null;
    }
    
    // Simple in-memory storage for Node.js testing
    if (!global.easyEditOAuthStorage) {
      return null;
    }
    return global.easyEditOAuthStorage.get(key) || null;
  }

  private async deleteFile(key: string): Promise<void> {
    // In browser environment, this should not be called
    if (typeof window !== 'undefined') {
      return;
    }
    
    // Simple in-memory storage for Node.js testing
    if (global.easyEditOAuthStorage) {
      global.easyEditOAuthStorage.delete(key);
    }
  }
}

// Extend global for Node.js in-memory storage
declare global {
  var easyEditOAuthStorage: Map<string, string> | undefined;
}