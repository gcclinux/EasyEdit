/**
 * ErrorHandler tests - Basic functionality tests for error handling utilities
 */

import { ErrorHandler, CloudError } from '../utils/ErrorHandler';

describe('ErrorHandler', () => {
  describe('enhanceError', () => {
    it('should enhance a basic error with context', () => {
      const originalError = new Error('Test error');
      const context = { operation: 'test', provider: 'mock' };
      
      const enhanced = ErrorHandler.enhanceError(originalError, context);
      
      expect(enhanced).toBeInstanceOf(CloudError);
      expect(enhanced.message).toBe('Test error');
      expect(enhanced.context).toEqual(context);
      expect(enhanced.code).toBeDefined();
      expect(typeof enhanced.isRetryable).toBe('boolean');
    });

    it('should classify mock errors as retryable', () => {
      const mockError = new Error('Mock upload failure 1');
      const context = { operation: 'upload', provider: 'mock' };
      
      const enhanced = ErrorHandler.enhanceError(mockError, context);
      
      expect(enhanced.isRetryable).toBe(true);
    });

    it('should classify network errors as retryable', () => {
      const networkError = new Error('Network connection failed');
      const context = { operation: 'download', provider: 'googledrive' };
      
      const enhanced = ErrorHandler.enhanceError(networkError, context);
      
      expect(enhanced.isRetryable).toBe(true);
    });

    it('should classify authentication errors as not retryable', () => {
      const authError = new Error('API call failed: 401 Unauthorized') as any;
      authError.statusCode = 401;
      const context = { operation: 'authenticate', provider: 'googledrive' };
      
      const enhanced = ErrorHandler.enhanceError(authError, context);
      
      expect(enhanced.isRetryable).toBe(false);
      expect(enhanced.code).toBe('AUTHENTICATION_ERROR');
    });
  });

  describe('getUserFriendlyMessage', () => {
    it('should generate user-friendly messages for different error types', () => {
      const authError = new CloudError('Auth failed');
      authError.code = 'AUTHENTICATION_ERROR';
      authError.context = { operation: 'authenticate', provider: 'Google Drive' };
      
      const message = ErrorHandler.getUserFriendlyMessage(authError);
      
      expect(message).toContain('Authentication failed');
      expect(message).toContain('Google Drive');
    });

    it('should handle errors without context gracefully', () => {
      const genericError = new CloudError('Generic error');
      genericError.code = 'UNKNOWN_ERROR';
      
      const message = ErrorHandler.getUserFriendlyMessage(genericError);
      
      expect(message).toBeDefined();
      expect(typeof message).toBe('string');
    });
  });

  describe('isOnline', () => {
    it('should return a boolean value', () => {
      const isOnline = ErrorHandler.isOnline();
      expect(typeof isOnline).toBe('boolean');
    });
  });
});