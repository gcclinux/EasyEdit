import { encryptTextToBytes, decryptBytesToText } from '../../stpFileCrypter';
import { CloudCredentials } from '../interfaces';

interface StoredCloudCredentials {
  encrypted: string; // Base64 encoded encrypted data
  provider: string;
  userId?: string;
  expiresAt?: string; // ISO string
}

const CLOUD_STORAGE_KEY = 'easyedit_cloud_credentials';
const CLOUD_MASTER_KEY_STORAGE = 'easyedit_cloud_master_key';

export class CloudCredentialManager {
  private masterKey: string | null = null;

  /**
   * Initialize the credential manager with a master password
   * This password is used to encrypt/decrypt credentials
   */
  async setMasterPassword(password: string): Promise<void> {
    if (!password || password.length < 8) {
      throw new Error('Master password must be at least 8 characters long');
    }
    
    this.masterKey = password;
    // Store a hash of the master key to verify it later
    const hash = await this.hashPassword(password);
    localStorage.setItem(CLOUD_MASTER_KEY_STORAGE, hash);
  }

  /**
   * Verify if the provided master password is correct
   */
  async verifyMasterPassword(password: string): Promise<boolean> {
    const storedHash = localStorage.getItem(CLOUD_MASTER_KEY_STORAGE);
    if (!storedHash) {
      return false;
    }
    
    const hash = await this.hashPassword(password);
    return hash === storedHash;
  }

  /**
   * Check if master password has been set
   */
  hasMasterPassword(): boolean {
    return localStorage.getItem(CLOUD_MASTER_KEY_STORAGE) !== null;
  }

  /**
   * Hash a password for verification purposes
   */
  private async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Save cloud provider credentials securely
   */
  async saveCredentials(credentials: CloudCredentials): Promise<void> {
    console.log('[CloudCredentialManager] Saving credentials for provider:', credentials.provider, 'userId:', credentials.userId);
    
    // Temporarily disable master password requirement for development
    if (!this.masterKey) {
      console.warn('[CloudCredentialManager] Master password disabled for development - credentials stored in plain text');
      this.masterKey = 'temp-dev-key'; // Use a temporary key for encryption/decryption
    }

    try {
      // Get existing credentials
      const existingCredentials = await this.getAllStoredCredentials();
      console.log('[CloudCredentialManager] Existing credentials count:', existingCredentials.length);
      
      // Serialize credentials to JSON
      const jsonString = JSON.stringify({
        provider: credentials.provider,
        accessToken: credentials.accessToken,
        refreshToken: credentials.refreshToken,
        scope: credentials.scope,
        userId: credentials.userId,
      });

      // Encrypt the JSON string
      const encrypted = encryptTextToBytes(jsonString, this.masterKey);
      
      // Convert to base64 for storage
      const base64 = this.uint8ArrayToBase64(encrypted);

      const stored: StoredCloudCredentials = {
        encrypted: base64,
        provider: credentials.provider,
        userId: credentials.userId,
        expiresAt: credentials.expiresAt?.toISOString(),
      };

      // Update or add credentials for this provider
      const updatedCredentials = existingCredentials.filter(
        cred => cred.provider !== credentials.provider || cred.userId !== credentials.userId
      );
      updatedCredentials.push(stored);

      console.log('[CloudCredentialManager] Saving to localStorage, total credentials:', updatedCredentials.length);
      localStorage.setItem(CLOUD_STORAGE_KEY, JSON.stringify(updatedCredentials));
      console.log('[CloudCredentialManager] Successfully saved credentials to localStorage');
      
      // Verify the save worked
      const verification = localStorage.getItem(CLOUD_STORAGE_KEY);
      console.log('[CloudCredentialManager] Verification - localStorage contains:', !!verification);
      
    } catch (error) {
      console.error('[CloudCredentialManager] Failed to save credentials:', error);
      throw new Error(`Failed to save credentials: ${(error as Error).message}`);
    }
  }

  /**
   * Retrieve cloud provider credentials
   */
  async getCredentials(provider: string, userId?: string): Promise<CloudCredentials | null> {
    // Temporarily disable master password requirement for development
    // TODO: Re-enable master password protection later
    if (!this.masterKey) {
      console.warn('[CloudCredentialManager] Master password disabled for development - credentials stored in plain text');
      this.masterKey = 'temp-dev-key'; // Use a temporary key for encryption/decryption
    }

    try {
      const storedCredentials = await this.getAllStoredCredentials();
      console.log('[CloudCredentialManager] Looking for credentials for provider:', provider, 'userId:', userId);
      console.log('[CloudCredentialManager] Available credentials:', storedCredentials.map(c => ({ provider: c.provider, userId: c.userId, hasToken: !!c.encrypted })));
      
      // Find credentials for the specified provider and user
      // If no userId is specified, find the first matching provider
      const stored = storedCredentials.find(cred => 
        cred.provider === provider && 
        (userId === undefined || cred.userId === userId)
      );
      
      console.log('[CloudCredentialManager] Found stored credentials:', !!stored);

      if (!stored) {
        return null;
      }

      // Check if credentials are expired
      if (stored.expiresAt) {
        const expiresAt = new Date(stored.expiresAt);
        if (expiresAt <= new Date()) {
          // Credentials are expired, remove them
          await this.removeCredentials(provider, userId);
          return null;
        }
      }

      // Decrypt credentials
      const encryptedBytes = this.base64ToUint8Array(stored.encrypted);
      const decryptedString = decryptBytesToText(encryptedBytes, this.masterKey);
      
      const credentials = JSON.parse(decryptedString);
      
      return {
        provider: credentials.provider,
        accessToken: credentials.accessToken,
        refreshToken: credentials.refreshToken,
        expiresAt: stored.expiresAt ? new Date(stored.expiresAt) : undefined,
        scope: credentials.scope,
        userId: credentials.userId,
      };
    } catch (error) {
      throw new Error(`Failed to retrieve credentials: ${(error as Error).message}`);
    }
  }

  /**
   * Get all stored credentials (for listing connected providers)
   */
  private async getAllStoredCredentials(): Promise<StoredCloudCredentials[]> {
    const storedString = localStorage.getItem(CLOUD_STORAGE_KEY);
    if (!storedString) {
      return [];
    }

    try {
      return JSON.parse(storedString);
    } catch (error) {
      // If parsing fails, return empty array and clear corrupted data
      localStorage.removeItem(CLOUD_STORAGE_KEY);
      return [];
    }
  }

  /**
   * Get list of connected providers
   */
  async getConnectedProviders(): Promise<Array<{ provider: string; userId?: string; expiresAt?: Date }>> {
    if (!this.masterKey) {
      return [];
    }

    const storedCredentials = await this.getAllStoredCredentials();
    return storedCredentials.map(cred => ({
      provider: cred.provider,
      userId: cred.userId,
      expiresAt: cred.expiresAt ? new Date(cred.expiresAt) : undefined,
    }));
  }

  /**
   * Check if credentials exist for a provider
   */
  async hasCredentials(provider: string, userId?: string): Promise<boolean> {
    if (!this.masterKey) {
      return false;
    }

    const storedCredentials = await this.getAllStoredCredentials();
    return storedCredentials.some(cred => 
      cred.provider === provider && 
      cred.userId === userId
    );
  }

  /**
   * Remove credentials for a specific provider
   */
  async removeCredentials(provider: string, userId?: string): Promise<void> {
    const storedCredentials = await this.getAllStoredCredentials();
    const filteredCredentials = storedCredentials.filter(cred => 
      !(cred.provider === provider && cred.userId === userId)
    );

    if (filteredCredentials.length === 0) {
      localStorage.removeItem(CLOUD_STORAGE_KEY);
    } else {
      localStorage.setItem(CLOUD_STORAGE_KEY, JSON.stringify(filteredCredentials));
    }
  }

  /**
   * Clear all stored credentials
   */
  async clearAllCredentials(): Promise<void> {
    localStorage.removeItem(CLOUD_STORAGE_KEY);
  }

  /**
   * Clear master password and all credentials
   */
  async clearMasterPassword(): Promise<void> {
    localStorage.removeItem(CLOUD_MASTER_KEY_STORAGE);
    localStorage.removeItem(CLOUD_STORAGE_KEY);
    this.masterKey = null;
  }

  /**
   * Unlock credentials with master password
   */
  async unlock(password: string): Promise<boolean> {
    const isValid = await this.verifyMasterPassword(password);
    if (isValid) {
      this.masterKey = password;
      return true;
    }
    return false;
  }

  /**
   * Lock credentials (clear master key from memory)
   */
  lock(): void {
    this.masterKey = null;
  }

  /**
   * Check if credentials are currently unlocked
   */
  isUnlocked(): boolean {
    // Temporarily always return true when master password is disabled for development
    return true; // TODO: Change back to `return this.masterKey !== null;` when re-enabling master password
  }

  /**
   * Update credentials (for token refresh)
   */
  async updateCredentials(provider: string, updates: Partial<CloudCredentials>, userId?: string): Promise<void> {
    const existingCredentials = await this.getCredentials(provider, userId);
    if (!existingCredentials) {
      throw new Error(`No credentials found for provider: ${provider}`);
    }

    const updatedCredentials: CloudCredentials = {
      ...existingCredentials,
      ...updates,
      provider, // Ensure provider doesn't change
    };

    await this.saveCredentials(updatedCredentials);
  }

  /**
   * Check if any credentials are expired and need refresh
   */
  async getExpiredCredentials(): Promise<Array<{ provider: string; userId?: string }>> {
    if (!this.masterKey) {
      return [];
    }

    const storedCredentials = await this.getAllStoredCredentials();
    const now = new Date();
    
    return storedCredentials
      .filter(cred => cred.expiresAt && new Date(cred.expiresAt) <= now)
      .map(cred => ({ provider: cred.provider, userId: cred.userId }));
  }

  /**
   * Convert Uint8Array to Base64 string
   */
  private uint8ArrayToBase64(bytes: Uint8Array): string {
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  /**
   * Convert Base64 string to Uint8Array
   */
  private base64ToUint8Array(base64: string): Uint8Array {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }
}

// Export a singleton instance
export const cloudCredentialManager = new CloudCredentialManager();