/**
 * Tests for OAuth Configuration Manager
 * Tests configuration management, validation, and environment variable handling
 */

import { describe, test, expect, beforeEach } from '@jest/globals';
import { OAuthConfigManager } from '../core/OAuthConfigManager';
import type { OAuthConfig, OAuthProviderConfig } from '../interfaces';

describe('OAuthConfigManager', () => {
  let configManager: OAuthConfigManager;

  beforeEach(() => {
    configManager = new OAuthConfigManager();
  });

  test('should create with default configuration', () => {
    const config = configManager.getConfig();
    
    expect(config).toBeDefined();
    expect(config.providers).toBeDefined();
    expect(config.callbackServer).toBeDefined();
    expect(config.security).toBeDefined();
    
    // Check default callback server config
    expect(config.callbackServer.host).toBe('127.0.0.1');
    expect(config.callbackServer.portRange).toEqual([8080, 8090]);
    expect(config.callbackServer.timeout).toBe(300000);
    expect(config.callbackServer.maxRetries).toBe(3);
    
    // Check default security config
    expect(config.security.stateExpiration).toBe(600000);
    expect(config.security.pkceMethod).toBe('S256');
    expect(config.security.tokenEncryption).toBe(true);
  });

  test('should accept custom configuration', () => {
    const customConfig: Partial<OAuthConfig> = {
      providers: {
        google: {
          clientId: 'test-client-id',
          scope: ['test-scope'],
          enabled: true
        }
      },
      callbackServer: {
        host: '127.0.0.1',
        portRange: [9000, 9010],
        timeout: 120000,
        maxRetries: 5
      }
    };

    const customConfigManager = new OAuthConfigManager(customConfig);
    const config = customConfigManager.getConfig();
    
    expect(config.providers.google).toBeDefined();
    expect(config.providers.google.clientId).toBe('test-client-id');
    expect(config.callbackServer.portRange).toEqual([9000, 9010]);
    expect(config.callbackServer.timeout).toBe(120000);
    expect(config.callbackServer.maxRetries).toBe(5);
  });

  test('should get provider configuration', () => {
    const providerConfig: OAuthProviderConfig = {
      clientId: 'test-client-id',
      scope: ['test-scope'],
      enabled: true
    };

    configManager.addProviderConfig('test-provider', providerConfig);
    
    const retrievedConfig = configManager.getProviderConfig('test-provider');
    expect(retrievedConfig).toBeDefined();
    expect(retrievedConfig?.clientId).toBe('test-client-id');
    expect(retrievedConfig?.scope).toEqual(['test-scope']);
    expect(retrievedConfig?.enabled).toBe(true);
  });

  test('should return null for non-existent provider', () => {
    const config = configManager.getProviderConfig('non-existent');
    expect(config).toBeNull();
  });

  test('should update provider configuration', () => {
    const initialConfig: OAuthProviderConfig = {
      clientId: 'initial-client-id',
      scope: ['initial-scope'],
      enabled: true
    };

    configManager.addProviderConfig('test-provider', initialConfig);
    
    configManager.updateProviderConfig('test-provider', {
      scope: ['updated-scope'],
      enabled: false
    });
    
    const updatedConfig = configManager.getProviderConfig('test-provider');
    expect(updatedConfig?.clientId).toBe('initial-client-id'); // Should remain unchanged
    expect(updatedConfig?.scope).toEqual(['updated-scope']); // Should be updated
    expect(updatedConfig?.enabled).toBe(false); // Should be updated
  });

  test('should validate configuration', () => {
    // Test valid configuration
    configManager.addProviderConfig('google', {
      clientId: 'valid-client-id',
      scope: ['valid-scope'],
      enabled: true
    });

    const validationResult = configManager.validateConfig();
    expect(validationResult.isValid).toBe(true);
    expect(validationResult.errors).toHaveLength(0);
  });

  test('should detect configuration errors', () => {
    // Add invalid provider configuration
    configManager.addProviderConfig('invalid-provider', {
      clientId: '', // Invalid: empty client ID
      scope: [], // Invalid: empty scope
      enabled: true
    });

    const validationResult = configManager.validateConfig();
    expect(validationResult.isValid).toBe(false);
    expect(validationResult.errors.length).toBeGreaterThan(0);
    expect(validationResult.errors.some(error => error.includes('missing required clientId'))).toBe(true);
    expect(validationResult.errors.some(error => error.includes('missing required scope'))).toBe(true);
  });

  test('should get enabled providers', () => {
    configManager.addProviderConfig('enabled-provider', {
      clientId: 'client-id-1',
      scope: ['scope1'],
      enabled: true
    });

    configManager.addProviderConfig('disabled-provider', {
      clientId: 'client-id-2',
      scope: ['scope2'],
      enabled: false
    });

    const enabledProviders = configManager.getEnabledProviders();
    expect(enabledProviders).toContain('enabled-provider');
    expect(enabledProviders).not.toContain('disabled-provider');
  });

  test('should check if provider is enabled', () => {
    configManager.addProviderConfig('enabled-provider', {
      clientId: 'client-id',
      scope: ['scope'],
      enabled: true
    });

    configManager.addProviderConfig('disabled-provider', {
      clientId: 'client-id',
      scope: ['scope'],
      enabled: false
    });

    expect(configManager.isProviderEnabled('enabled-provider')).toBe(true);
    expect(configManager.isProviderEnabled('disabled-provider')).toBe(false);
    expect(configManager.isProviderEnabled('non-existent')).toBe(false);
  });

  test('should update callback server configuration', () => {
    configManager.updateCallbackServerConfig({
      timeout: 180000,
      maxRetries: 10
    });

    const config = configManager.getCallbackServerConfig();
    expect(config.timeout).toBe(180000);
    expect(config.maxRetries).toBe(10);
    expect(config.host).toBe('127.0.0.1'); // Should remain unchanged
  });

  test('should update security configuration', () => {
    configManager.updateSecurityConfig({
      stateExpiration: 300000,
      pkceMethod: 'plain'
    });

    const config = configManager.getSecurityConfig();
    expect(config.stateExpiration).toBe(300000);
    expect(config.pkceMethod).toBe('plain');
    expect(config.tokenEncryption).toBe(true); // Should remain unchanged
  });

  test('should handle provider removal', () => {
    configManager.addProviderConfig('test-provider', {
      clientId: 'client-id',
      scope: ['scope'],
      enabled: true
    });

    expect(configManager.getProviderConfig('test-provider')).toBeDefined();
    
    configManager.removeProviderConfig('test-provider');
    
    expect(configManager.getProviderConfig('test-provider')).toBeNull();
  });

  test('should throw error when updating non-existent provider', () => {
    expect(() => {
      configManager.updateProviderConfig('non-existent', { enabled: false });
    }).toThrow("Provider 'non-existent' not found in configuration");
  });

  test('should throw error when removing non-existent provider', () => {
    expect(() => {
      configManager.removeProviderConfig('non-existent');
    }).toThrow("Provider 'non-existent' not found in configuration");
  });

  test('should throw error when adding duplicate provider', () => {
    const providerConfig: OAuthProviderConfig = {
      clientId: 'client-id',
      scope: ['scope'],
      enabled: true
    };

    configManager.addProviderConfig('test-provider', providerConfig);
    
    expect(() => {
      configManager.addProviderConfig('test-provider', providerConfig);
    }).toThrow("Provider 'test-provider' already exists in configuration");
  });
});