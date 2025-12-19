/**
 * OAuth Logger Tests
 * Tests for security-aware logging and monitoring functionality
 */

import { 
  OAuthLogger, 
  LogLevel, 
  OAuthOperation, 
  getOAuthLogger,
  generateFlowId,
  type LoggerConfig 
} from '../utils/OAuthLogger';

describe('OAuth Logger', () => {
  let logger: OAuthLogger;

  beforeEach(() => {
    // Create a fresh logger instance for each test
    logger = new (OAuthLogger as any)({
      level: LogLevel.DEBUG,
      enableConsoleOutput: false, // Disable console output for tests
      enableFileLogging: false,
      enableMetrics: true,
      maxLogEntries: 100
    });
  });

  afterEach(() => {
    logger.clear();
  });

  describe('Basic Logging', () => {
    it('should log messages at different levels', () => {
      logger.debug(OAuthOperation.FLOW_INITIATED, 'Debug message');
      logger.info(OAuthOperation.AUTHENTICATION_SUCCESS, 'Info message');
      logger.warn(OAuthOperation.TOKEN_EXPIRED, 'Warning message');
      logger.error(OAuthOperation.AUTHENTICATION_FAILED, 'Error message', new Error('Test error'));
      logger.security(OAuthOperation.CSRF_DETECTED, 'Security event');

      const logs = logger.getRecentLogs(10);
      expect(logs).toHaveLength(5);
      
      expect(logs[0].level).toBe(LogLevel.DEBUG);
      expect(logs[1].level).toBe(LogLevel.INFO);
      expect(logs[2].level).toBe(LogLevel.WARN);
      expect(logs[3].level).toBe(LogLevel.ERROR);
      expect(logs[4].level).toBe(LogLevel.SECURITY);
    });

    it('should respect log level filtering', () => {
      logger.updateConfig({ level: LogLevel.WARN });
      
      logger.debug(OAuthOperation.FLOW_INITIATED, 'Debug message');
      logger.info(OAuthOperation.AUTHENTICATION_SUCCESS, 'Info message');
      logger.warn(OAuthOperation.TOKEN_EXPIRED, 'Warning message');
      logger.error(OAuthOperation.AUTHENTICATION_FAILED, 'Error message');

      const logs = logger.getRecentLogs(10);
      expect(logs).toHaveLength(2); // Only warn and error should be logged
      expect(logs[0].level).toBe(LogLevel.WARN);
      expect(logs[1].level).toBe(LogLevel.ERROR);
    });

    it('should include provider and flow ID in logs', () => {
      const provider = 'google';
      const flowId = generateFlowId();

      logger.info(
        OAuthOperation.AUTHENTICATION_SUCCESS,
        'Test message',
        { testData: 'value' },
        provider,
        flowId
      );

      const logs = logger.getRecentLogs(1);
      expect(logs[0].provider).toBe(provider);
      expect(logs[0].flowId).toBe(flowId);
      expect(logs[0].metadata).toEqual({ testData: 'value' });
    });
  });

  describe('Security Features', () => {
    it('should sanitize sensitive data in metadata', () => {
      const sensitiveData = {
        access_token: 'secret-token-12345',
        refresh_token: 'refresh-secret-67890',
        authorization_code: 'auth-code-abcdef',
        normalData: 'this-is-fine',
        nested: {
          token: 'nested-secret',
          publicInfo: 'visible'
        }
      };

      logger.info(
        OAuthOperation.TOKEN_STORED,
        'Storing tokens',
        sensitiveData,
        'google'
      );

      const logs = logger.getRecentLogs(1);
      const metadata = logs[0].metadata!;

      // Sensitive fields should be redacted (first 4 and last 4 characters)
      expect(metadata.access_token).toMatch(/^secr\.\.\.2345$/);
      expect(metadata.refresh_token).toMatch(/^refr\.\.\.7890$/);
      expect(metadata.authorization_code).toMatch(/^auth\.\.\.cdef$/);
      
      // Normal data should be preserved
      expect(metadata.normalData).toBe('this-is-fine');
      
      // Nested sensitive data should be redacted (first/last 4 chars for strings > 8 chars)
      expect(metadata.nested.token).toMatch(/^nest\.\.\.cret$/);
      expect(metadata.nested.publicInfo).toBe('visible');
    });

    it('should log security events with high priority', () => {
      logger.security(
        OAuthOperation.CSRF_DETECTED,
        'CSRF attack detected',
        { suspiciousState: 'invalid-state-123' },
        'google'
      );

      const securityEvents = logger.getSecurityEvents(10);
      expect(securityEvents).toHaveLength(1);
      expect(securityEvents[0].level).toBe(LogLevel.SECURITY);
      expect(securityEvents[0].operation).toBe(OAuthOperation.CSRF_DETECTED);
    });

    it('should never log actual token values', () => {
      const tokenData = {
        access_token: 'ya29.a0ARrdaM-very-long-actual-token-value',
        refresh_token: '1//04-another-long-token-value',
        client_secret: 'GOCSPX-secret-client-value'
      };

      logger.info(OAuthOperation.TOKEN_STORED, 'Token stored', tokenData);

      const logs = logger.getRecentLogs(1);
      const logString = JSON.stringify(logs[0]);
      
      // Ensure no actual token values appear in the log
      expect(logString).not.toContain('ya29.a0ARrdaM-very-long-actual-token-value');
      expect(logString).not.toContain('1//04-another-long-token-value');
      expect(logString).not.toContain('GOCSPX-secret-client-value');
    });
  });

  describe('Performance Tracking', () => {
    it('should track operation timing', async () => {
      const operationId = 'test-operation';
      
      logger.startTiming(operationId, OAuthOperation.AUTHENTICATION_SUCCESS);
      
      // Simulate some work with a small delay
      await new Promise(resolve => setTimeout(resolve, 1));
      
      const duration = logger.endTiming(operationId, 'google', 'flow-123');
      
      expect(duration).toBeGreaterThan(0);
      
      const logs = logger.getRecentLogs(10);
      const timingLog = logs.find(log => log.operation === OAuthOperation.OPERATION_TIMED);
      expect(timingLog).toBeDefined();
      expect(timingLog!.metadata!.duration).toBe(duration);
    });

    it('should warn about slow operations', async () => {
      logger.updateConfig({
        performanceThresholds: {
          authFlow: 10, // Very low threshold for testing
          tokenRefresh: 5,
          callbackResponse: 2
        }
      });

      const operationId = 'slow-auth';
      logger.startTiming(operationId, OAuthOperation.AUTHENTICATION_SUCCESS);
      
      // Simulate slow operation
      await new Promise(resolve => setTimeout(resolve, 20));
      
      const duration = logger.endTiming(operationId, 'google');
      
      const logs = logger.getRecentLogs(10);
      const warningLog = logs.find(log => 
        log.level === LogLevel.WARN && 
        log.message.includes('exceeded threshold')
      );
      expect(warningLog).toBeDefined();
    });

    it('should log retry attempts', () => {
      const error = new Error('Network timeout');
      
      logger.logRetry(OAuthOperation.TOKEN_EXCHANGE, 2, 3, error, 'google', 'flow-123');
      
      const logs = logger.getRecentLogs(1);
      expect(logs[0].operation).toBe(OAuthOperation.RETRY_ATTEMPTED);
      expect(logs[0].message).toContain('Retry attempt 2/3');
      expect(logs[0].metadata!.attempt).toBe(2);
      expect(logs[0].metadata!.maxRetries).toBe(3);
      expect(logs[0].metadata!.errorType).toBe('Error');
    });
  });

  describe('Metrics Collection', () => {
    it('should collect basic metrics', () => {
      logger.info(OAuthOperation.AUTHENTICATION_SUCCESS, 'Auth success', undefined, 'google');
      logger.error(OAuthOperation.AUTHENTICATION_FAILED, 'Auth failed', new Error('Test'));
      logger.info(OAuthOperation.TOKEN_REFRESHED, 'Token refreshed', undefined, 'dropbox');
      logger.security(OAuthOperation.CSRF_DETECTED, 'CSRF detected');

      const metrics = logger.getMetrics();
      
      expect(metrics.totalOperations).toBe(4);
      expect(metrics.successfulAuthentications).toBe(1);
      expect(metrics.failedAuthentications).toBe(1);
      expect(metrics.tokenRefreshes).toBe(1);
      expect(metrics.securityEvents).toBe(1);
      expect(metrics.operationsByProvider.google).toBe(1);
      expect(metrics.operationsByProvider.dropbox).toBe(1);
      expect(metrics.errorsByType.Error).toBe(1);
    });

    it('should track provider-specific logs', () => {
      logger.info(OAuthOperation.AUTHENTICATION_SUCCESS, 'Google auth', undefined, 'google');
      logger.info(OAuthOperation.AUTHENTICATION_SUCCESS, 'Dropbox auth', undefined, 'dropbox');
      logger.info(OAuthOperation.TOKEN_REFRESHED, 'Google refresh', undefined, 'google');

      const googleLogs = logger.getProviderLogs('google', 10);
      const dropboxLogs = logger.getProviderLogs('dropbox', 10);

      expect(googleLogs).toHaveLength(2);
      expect(dropboxLogs).toHaveLength(1);
      expect(googleLogs.every(log => log.provider === 'google')).toBe(true);
      expect(dropboxLogs.every(log => log.provider === 'dropbox')).toBe(true);
    });
  });

  describe('Log Management', () => {
    it('should rotate logs when max entries exceeded', () => {
      logger.updateConfig({ maxLogEntries: 3 });

      // Add more logs than the limit
      for (let i = 0; i < 5; i++) {
        logger.info(OAuthOperation.FLOW_INITIATED, `Message ${i}`);
      }

      const logs = logger.getRecentLogs(10);
      expect(logs).toHaveLength(3); // Should only keep the last 3
      expect(logs[0].message).toBe('Message 2');
      expect(logs[2].message).toBe('Message 4');
    });

    it('should export logs for debugging', () => {
      logger.info(OAuthOperation.AUTHENTICATION_SUCCESS, 'Test message');
      
      const exportData = logger.exportLogs();
      const parsed = JSON.parse(exportData);
      
      expect(parsed.timestamp).toBeDefined();
      expect(parsed.config).toBeDefined();
      expect(parsed.metrics).toBeDefined();
      expect(parsed.logs).toHaveLength(1);
      expect(parsed.logs[0].message).toBe('Test message');
    });

    it('should clear all logs and metrics', () => {
      logger.info(OAuthOperation.AUTHENTICATION_SUCCESS, 'Test message');
      
      expect(logger.getRecentLogs(10)).toHaveLength(1);
      expect(logger.getMetrics().totalOperations).toBe(1);
      
      logger.clear();
      
      expect(logger.getRecentLogs(10)).toHaveLength(0);
      expect(logger.getMetrics().totalOperations).toBe(0);
    });
  });

  describe('Utility Functions', () => {
    it('should generate unique flow IDs', () => {
      const flowId1 = generateFlowId();
      const flowId2 = generateFlowId();
      
      expect(flowId1).toMatch(/^oauth_\d+_[a-z0-9]+$/);
      expect(flowId2).toMatch(/^oauth_\d+_[a-z0-9]+$/);
      expect(flowId1).not.toBe(flowId2);
    });

    it('should get singleton logger instance', () => {
      const logger1 = getOAuthLogger();
      const logger2 = getOAuthLogger();
      
      expect(logger1).toBe(logger2); // Should be the same instance
    });
  });
});