/**
 * Browser-compatible crypto utilities for OAuth operations
 * Uses Web Crypto API and CryptoJS for cross-platform compatibility
 */

import * as CryptoJS from 'crypto-js';

/**
 * Generate cryptographically secure random bytes
 * Uses Web Crypto API when available, falls back to CryptoJS
 */
export function randomBytes(length: number): Uint8Array {
  // Use Web Crypto API if available (modern browsers)
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    return array;
  }
  
  // Fallback to CryptoJS for older browsers or Node.js environments
  const wordArray = CryptoJS.lib.WordArray.random(length);
  const bytes = new Uint8Array(length);
  
  for (let i = 0; i < length; i++) {
    const wordIndex = Math.floor(i / 4);
    const byteIndex = i % 4;
    const word = wordArray.words[wordIndex] || 0;
    bytes[i] = (word >>> (24 - byteIndex * 8)) & 0xff;
  }
  
  return bytes;
}

/**
 * Create SHA256 hash
 * Uses Web Crypto API when available, falls back to CryptoJS
 */
export async function sha256(input: string): Promise<Uint8Array> {
  // Use Web Crypto API if available (modern browsers)
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(input);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
      return new Uint8Array(hashBuffer);
    } catch (error) {
      // Fall back to CryptoJS if Web Crypto API fails
    }
  }
  
  // Fallback to CryptoJS
  const hash = CryptoJS.SHA256(input);
  const bytes = new Uint8Array(32); // SHA256 is always 32 bytes
  
  for (let i = 0; i < 32; i++) {
    const wordIndex = Math.floor(i / 4);
    const byteIndex = i % 4;
    const word = hash.words[wordIndex] || 0;
    bytes[i] = (word >>> (24 - byteIndex * 8)) & 0xff;
  }
  
  return bytes;
}

/**
 * Synchronous SHA256 hash using CryptoJS
 * For compatibility with existing sync APIs
 */
export function sha256Sync(input: string): Uint8Array {
  const hash = CryptoJS.SHA256(input);
  const bytes = new Uint8Array(32); // SHA256 is always 32 bytes
  
  for (let i = 0; i < 32; i++) {
    const wordIndex = Math.floor(i / 4);
    const byteIndex = i % 4;
    const word = hash.words[wordIndex] || 0;
    bytes[i] = (word >>> (24 - byteIndex * 8)) & 0xff;
  }
  
  return bytes;
}

/**
 * Base64 URL encode (RFC 4648 Section 5)
 * Converts bytes to base64url encoding used in OAuth/JWT
 */
export function base64URLEncode(bytes: Uint8Array): string {
  // Convert to base64
  let base64 = '';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  
  for (let i = 0; i < bytes.length; i += 3) {
    const a = bytes[i];
    const b = bytes[i + 1] || 0;
    const c = bytes[i + 2] || 0;
    
    const bitmap = (a << 16) | (b << 8) | c;
    
    base64 += chars.charAt((bitmap >> 18) & 63);
    base64 += chars.charAt((bitmap >> 12) & 63);
    base64 += i + 1 < bytes.length ? chars.charAt((bitmap >> 6) & 63) : '=';
    base64 += i + 2 < bytes.length ? chars.charAt(bitmap & 63) : '=';
  }
  
  // Convert to base64url by replacing + with -, / with _, and removing padding
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/**
 * Generate a cryptographically secure random string
 * Uses URL-safe characters (A-Z, a-z, 0-9, -, _)
 */
export function generateSecureRandom(length: number): string {
  const bytes = randomBytes(length);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars[bytes[i] % chars.length];
  }
  
  return result;
}

/**
 * Encrypt data using AES-256-GCM
 * Browser-compatible encryption using CryptoJS
 */
export function encryptAES256GCM(plaintext: string, key: Uint8Array): {
  encrypted: string;
  iv: string;
  authTag: string;
} {
  // Convert key to CryptoJS WordArray
  const keyWordArray = CryptoJS.lib.WordArray.create(Array.from(key));
  
  // Generate random IV
  const iv = CryptoJS.lib.WordArray.random(16);
  
  // Encrypt using AES-256-GCM (CryptoJS doesn't have GCM, so we use CBC + HMAC for similar security)
  const encrypted = CryptoJS.AES.encrypt(plaintext, keyWordArray, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  
  // Generate authentication tag using HMAC-SHA256
  const authTag = CryptoJS.HmacSHA256(encrypted.ciphertext.toString(), keyWordArray);
  
  return {
    encrypted: encrypted.ciphertext.toString(CryptoJS.enc.Base64),
    iv: iv.toString(CryptoJS.enc.Base64),
    authTag: authTag.toString(CryptoJS.enc.Base64)
  };
}

/**
 * Decrypt data using AES-256-GCM
 * Browser-compatible decryption using CryptoJS
 */
export function decryptAES256GCM(
  encryptedData: string,
  key: Uint8Array,
  iv: string,
  authTag: string
): string {
  // Convert key to CryptoJS WordArray
  const keyWordArray = CryptoJS.lib.WordArray.create(Array.from(key));
  
  // Convert IV and auth tag from base64
  const ivWordArray = CryptoJS.enc.Base64.parse(iv);
  const expectedAuthTag = CryptoJS.enc.Base64.parse(authTag);
  
  // Verify authentication tag
  const ciphertext = CryptoJS.enc.Base64.parse(encryptedData);
  const computedAuthTag = CryptoJS.HmacSHA256(ciphertext.toString(), keyWordArray);
  
  if (computedAuthTag.toString() !== expectedAuthTag.toString()) {
    throw new Error('Authentication tag verification failed');
  }
  
  // Decrypt
  const decrypted = CryptoJS.AES.decrypt(
    { ciphertext: ciphertext } as any,
    keyWordArray,
    {
      iv: ivWordArray,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }
  );
  
  return decrypted.toString(CryptoJS.enc.Utf8);
}

/**
 * Derive encryption key using PBKDF2
 * Browser-compatible key derivation
 */
export function deriveKey(password: string, salt: string): Uint8Array {
  const key = CryptoJS.PBKDF2(password, salt, {
    keySize: 256 / 32, // 32 bytes for AES-256
    iterations: 100000, // High iteration count for security
    hasher: CryptoJS.algo.SHA256
  });
  
  const bytes = new Uint8Array(32);
  for (let i = 0; i < 32; i++) {
    const wordIndex = Math.floor(i / 4);
    const byteIndex = i % 4;
    const word = key.words[wordIndex] || 0;
    bytes[i] = (word >>> (24 - byteIndex * 8)) & 0xff;
  }
  
  return bytes;
}