/**
 * Tests for OAuth interfaces
 * Verifies that interfaces are properly defined and can be used
 */

import type { 
  OAuthProvider, 
  OAuthTokens, 
  TokenResponse,
  AuthenticationState,
  CallbackResult,
  OAuthResult,
  CallbackServerConfig
} from '../interfaces';

describe('OAuth Interfaces', () => {
  test('OAuthTokens interface should have required properties', () => {
    const tokens: OAuthTokens = {
      accessToken: 'test-access-token',
      refreshToken: 'test-refresh-token',
      expiresAt: new Date(),
      scope: 'test-scope',
      tokenType: 'Bearer'
    };
    
    expect(tokens.accessToken).toBe('test-access-token');
    expect(tokens.refreshToken).toBe('test-refresh-token');
    expect(tokens.expiresAt).toBeInstanceOf(Date);
    expect(tokens.scope).toBe('test-scope');
    expect(tokens.tokenType).toBe('Bearer');
  });
  
  test('TokenResponse interface should handle OAuth responses', () => {
    const response: TokenResponse = {
      access_token: 'test-access',
      refresh_token: 'test-refresh',
      expires_in: 3600,
      token_type: 'Bearer',
      scope: 'test-scope'
    };
    
    expect(response.access_token).toBe('test-access');
    expect(response.expires_in).toBe(3600);
    expect(response.token_type).toBe('Bearer');
  });
  
  test('AuthenticationState interface should track OAuth flow', () => {
    const authState: AuthenticationState = {
      provider: 'google',
      state: 'test-state',
      codeVerifier: 'test-verifier',
      codeChallenge: 'test-challenge',
      redirectUri: 'http://localhost:8080/callback',
      startTime: new Date(),
      isActive: true
    };
    
    expect(authState.provider).toBe('google');
    expect(authState.isActive).toBe(true);
    expect(authState.startTime).toBeInstanceOf(Date);
  });
  
  test('CallbackResult interface should handle callback responses', () => {
    const successResult: CallbackResult = {
      success: true,
      code: 'auth-code',
      state: 'test-state'
    };
    
    const errorResult: CallbackResult = {
      success: false,
      error: 'access_denied',
      errorDescription: 'User denied access'
    };
    
    expect(successResult.success).toBe(true);
    expect(successResult.code).toBe('auth-code');
    expect(errorResult.success).toBe(false);
    expect(errorResult.error).toBe('access_denied');
  });
  
  test('CallbackServerConfig interface should have default values', () => {
    const config: CallbackServerConfig = {
      host: '127.0.0.1',
      portRange: [8080, 8090],
      timeout: 300000,
      maxRetries: 3
    };
    
    expect(config.host).toBe('127.0.0.1');
    expect(config.timeout).toBe(300000);
    expect(config.maxRetries).toBe(3);
  });
  
  test('OAuthResult interface should handle authentication results', () => {
    const successResult: OAuthResult = {
      success: true,
      provider: 'google',
      tokens: {
        accessToken: 'test-token',
        expiresAt: new Date(),
        scope: 'test-scope',
        tokenType: 'Bearer'
      }
    };
    
    const errorResult: OAuthResult = {
      success: false,
      provider: 'google',
      error: 'network_error',
      errorDescription: 'Failed to connect to OAuth server'
    };
    
    expect(successResult.success).toBe(true);
    expect(successResult.provider).toBe('google');
    expect(successResult.tokens).toBeDefined();
    expect(errorResult.success).toBe(false);
    expect(errorResult.error).toBe('network_error');
  });
});