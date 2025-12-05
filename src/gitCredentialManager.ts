import { encryptTextToBytes, decryptBytesToText } from './stpFileCrypter';

export interface GitCredentials {
  username: string;
  token: string;
  remoteUrl?: string;
}

interface StoredCredentials {
  encrypted: string; // Base64 encoded encrypted data
  remoteUrl?: string;
}

const STORAGE_KEY = 'easyedit_git_credentials';
const MASTER_KEY_STORAGE = 'easyedit_git_master_key';

export class GitCredentialManager {
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
    localStorage.setItem(MASTER_KEY_STORAGE, hash);
  }

  /**
   * Verify if the provided master password is correct
   */
  async verifyMasterPassword(password: string): Promise<boolean> {
    const storedHash = localStorage.getItem(MASTER_KEY_STORAGE);
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
    return localStorage.getItem(MASTER_KEY_STORAGE) !== null;
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
   * Save Git credentials securely
   */
  async saveCredentials(credentials: GitCredentials, rememberMe: boolean = true): Promise<void> {
    if (!this.masterKey) {
      throw new Error('Master password not set. Please set a master password first.');
    }

    if (!rememberMe) {
      // If not remembering, just store in memory for this session
      return;
    }

    try {
      // Serialize credentials to JSON
      const jsonString = JSON.stringify({
        username: credentials.username,
        token: credentials.token,
      });

      // Encrypt the JSON string
      const encrypted = encryptTextToBytes(jsonString, this.masterKey);
      
      // Convert to base64 for storage
      const base64 = this.uint8ArrayToBase64(encrypted);

      const stored: StoredCredentials = {
        encrypted: base64,
        remoteUrl: credentials.remoteUrl,
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    } catch (error) {
      throw new Error(`Failed to save credentials: ${(error as Error).message}`);
    }
  }

  /**
   * Retrieve Git credentials
   */
  async getCredentials(remoteUrl?: string): Promise<GitCredentials | null> {
    if (!this.masterKey) {
      throw new Error('Master password not set. Please unlock credentials first.');
    }

    try {
      const storedString = localStorage.getItem(STORAGE_KEY);
      if (!storedString) {
        return null;
      }

      const stored: StoredCredentials = JSON.parse(storedString);

      // If remoteUrl is provided, check if it matches
      if (remoteUrl && stored.remoteUrl && stored.remoteUrl !== remoteUrl) {
        return null;
      }

      // Decrypt credentials
      const encryptedBytes = this.base64ToUint8Array(stored.encrypted);
      const decryptedString = decryptBytesToText(encryptedBytes, this.masterKey);
      
      const credentials = JSON.parse(decryptedString);
      
      return {
        username: credentials.username,
        token: credentials.token,
        remoteUrl: stored.remoteUrl,
      };
    } catch (error) {
      throw new Error(`Failed to retrieve credentials: ${(error as Error).message}`);
    }
  }

  /**
   * Check if credentials are stored
   */
  hasCredentials(): boolean {
    return localStorage.getItem(STORAGE_KEY) !== null;
  }

  /**
   * Clear stored credentials
   */
  async clearCredentials(): Promise<void> {
    localStorage.removeItem(STORAGE_KEY);
    this.masterKey = null;
  }

  /**
   * Clear master password (requires re-setup)
   */
  async clearMasterPassword(): Promise<void> {
    localStorage.removeItem(MASTER_KEY_STORAGE);
    localStorage.removeItem(STORAGE_KEY);
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
    return this.masterKey !== null;
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
export const gitCredentialManager = new GitCredentialManager();
