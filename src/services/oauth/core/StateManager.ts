/**
 * OAuth state and PKCE parameter management
 * Provides cryptographically secure parameter generation and state tracking
 */

import { randomBytes, sha256Sync, base64URLEncode, generateSecureRandom } from '../utils/crypto-browser';
import type { AuthenticationState, SecurityConfig } from '../interfaces';

export class StateManager {
  private activeStates: Map<string, AuthenticationState> = new Map();
  private securityConfig: SecurityConfig;

  constructor(securityConfig?: SecurityConfig) {
    this.securityConfig = securityConfig || {
      stateExpiration: 10 * 60 * 1000, // 10 minutes
      pkceMethod: 'S256',
      tokenEncryption: true,
      tokenRefreshBuffer: 5 * 60 * 1000, // 5 minutes
      maxAuthAttempts: 3,
      lockoutDuration: 15 * 60 * 1000 // 15 minutes
    };
  }
  
  /**
   * Generate secure OAuth state parameter
   * Uses cryptographically secure random bytes for CSRF protection
   */
  generateState(): string {
    return generateSecureRandom(32);
  }
  
  /**
   * Generate PKCE code verifier and challenge
   * Implements RFC 7636 PKCE specification with configurable method
   */
  generatePKCE(): { codeVerifier: string; codeChallenge: string } {
    // Generate code verifier: 43-128 characters, URL-safe
    const codeVerifier = generateSecureRandom(64);
    
    // Generate code challenge based on configured method
    let codeChallenge: string;
    if (this.securityConfig.pkceMethod === 'S256') {
      codeChallenge = base64URLEncode(sha256Sync(codeVerifier));
    } else {
      // Plain method (not recommended for production)
      codeChallenge = codeVerifier;
    }
    
    return { codeVerifier, codeChallenge };
  }
  
  /**
   * Create authentication state for OAuth flow
   * Combines state parameter, PKCE parameters, and metadata
   */
  createAuthState(provider: string, redirectUri: string): AuthenticationState {
    const state = this.generateState();
    const { codeVerifier, codeChallenge } = this.generatePKCE();
    
    const authState: AuthenticationState = {
      provider,
      state,
      codeVerifier,
      codeChallenge,
      redirectUri,
      startTime: new Date(),
      isActive: true
    };
    
    // Store the state for later validation
    this.activeStates.set(state, authState);
    
    // Clean up expired states periodically
    this.cleanupExpiredStates();
    
    return authState;
  }
  
  /**
   * Validate OAuth state parameter
   * Prevents CSRF attacks by verifying state matches stored value
   */
  validateState(state: string): AuthenticationState | null {
    const authState = this.activeStates.get(state);
    
    if (!authState) {
      return null;
    }
    
    // Check if state has expired
    const now = new Date();
    const elapsed = now.getTime() - authState.startTime.getTime();
    
    if (elapsed > this.securityConfig.stateExpiration) {
      this.activeStates.delete(state);
      return null;
    }
    
    // Remove state after validation to prevent reuse (one-time use)
    this.activeStates.delete(state);
    
    // Mark as inactive after validation
    authState.isActive = false;
    
    return authState;
  }
  
  /**
   * Clean up expired authentication states
   * Removes states older than expiration time to prevent memory leaks
   */
  cleanupExpiredStates(): void {
    const now = new Date();
    const expiredStates: string[] = [];
    
    for (const [state, authState] of this.activeStates.entries()) {
      const elapsed = now.getTime() - authState.startTime.getTime();
      
      if (elapsed > this.securityConfig.stateExpiration) {
        expiredStates.push(state);
      }
    }
    
    // Remove expired states
    expiredStates.forEach(state => {
      this.activeStates.delete(state);
    });
  }
  
}