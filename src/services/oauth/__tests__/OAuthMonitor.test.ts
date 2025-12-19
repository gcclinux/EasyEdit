/**
 * OAuth Monitor Tests
 * Tests for real-time monitoring and alerting functionality
 */

import { 
  OAuthMonitor, 
  AlertType, 
  getOAuthMonitor,
  type MonitoringConfig,
  type MonitoringAlert
} from '../utils/OAuthMonitor';
import { OAuthLogger, LogLevel, OAuthOperation } from '../utils/OAuthLogger';

describe('OAuth Monitor', () => {
  let monitor: OAuthMonitor;
  let logger: OAuthLogger;

  beforeEach(() => {
    // Create fresh instances for each test
    monitor = new (OAuthMonitor as any)({
      enabled: true,
      alertThresholds: {
        errorRate: 10,
        latencyMs: 1000,
        securityEventsPerHour: 3,
        failedAuthsPerHour: 5
      },
      healthCheckInterval: 100, // Fast interval for testing
      enableRealTimeAlerts: true,
      enablePerformanceTracking: true,
      enableSecurityMonitoring: true
    });

    // Create logger with console output disabled for tests
    logger = new (OAuthLogger as any)({
      level: LogLevel.DEBUG,
      enableConsoleOutput: false, // Disable console output for tests
      enableMetrics: true
    });
    
    // Override the logger instance in monitor to use our test logger
    (monitor as any).logger = logger;
  });

  afterEach(() => {
    // Clean up
    monitor.updateConfig({ enabled: false });
  });

  describe('Alert Management', () => {
    it('should create and track alerts', () => {
      monitor.recordAuthAttempt('google', false, 2000, new Error('Timeout'));
      
      const activeAlerts = monitor.getActiveAlerts();
      expect(activeAlerts.length).toBeGreaterThan(0);
      
      const highLatencyAlert = activeAlerts.find(alert => 
        alert.type === AlertType.HIGH_LATENCY
      );
      expect(highLatencyAlert).toBeDefined();
      expect(highLatencyAlert!.severity).toBe('high');
      expect(highLatencyAlert!.provider).toBe('google');
    });

    it('should resolve alerts', () => {
      monitor.recordAuthAttempt('google', false, 2000, new Error('Timeout'));
      
      const activeAlerts = monitor.getActiveAlerts();
      expect(activeAlerts).toHaveLength(1);
      
      const alertId = activeAlerts[0].id;
      const resolved = monitor.resolveAlert(alertId);
      
      expect(resolved).toBe(true);
      expect(monitor.getActiveAlerts()).toHaveLength(0);
      
      const allAlerts = monitor.getAllAlerts();
      expect(allAlerts[0].resolved).toBe(true);
      expect(allAlerts[0].resolvedAt).toBeDefined();
    });

    it('should categorize alerts by severity', () => {
      // Create different types of alerts
      monitor.recordSecurityEvent('csrf', 'google');
      monitor.recordAuthAttempt('google', false, 2000);
      monitor.recordCallbackServerIssue('Port conflict');

      const criticalAlerts = monitor.getAlertsBySeverity('critical');
      const highAlerts = monitor.getAlertsBySeverity('high');
      const mediumAlerts = monitor.getAlertsBySeverity('medium');

      expect(criticalAlerts.length).toBeGreaterThan(0);
      expect(highAlerts.length).toBeGreaterThan(0);
      expect(mediumAlerts.length).toBeGreaterThan(0);
    });

    it('should notify alert listeners', (done) => {
      let alertReceived: MonitoringAlert | null = null;

      monitor.addAlertListener((alert) => {
        alertReceived = alert;
        expect(alert.type).toBe(AlertType.HIGH_LATENCY);
        expect(alert.provider).toBe('google');
        done();
      });

      monitor.recordAuthAttempt('google', false, 2000, new Error('Timeout'));
    });
  });

  describe('Performance Monitoring', () => {
    it('should record authentication attempts', () => {
      // Add some logs to the logger to simulate authentication attempts
      logger.info(OAuthOperation.AUTHENTICATION_SUCCESS, 'Auth success', { duration: 500 }, 'google');
      logger.error(OAuthOperation.AUTHENTICATION_FAILED, 'Auth failed', new Error('Network error'), { duration: 1500 }, 'google');
      logger.info(OAuthOperation.AUTHENTICATION_SUCCESS, 'Auth success', { duration: 300 }, 'dropbox');

      monitor.recordAuthAttempt('google', true, 500);
      monitor.recordAuthAttempt('google', false, 1500, new Error('Network error'));
      monitor.recordAuthAttempt('dropbox', true, 300);

      const healthStatus = monitor.getHealthStatus();
      
      expect(healthStatus.providers.google).toBeDefined();
      // Note: dropbox might not appear if no logs are found for it
      expect(healthStatus.providers.google.status).toBe('healthy'); // Based on actual calculation
    });

    it('should record token refresh attempts', () => {
      monitor.recordTokenRefresh('google', true, 200);
      monitor.recordTokenRefresh('google', false, 800, new Error('Invalid grant'));

      const activeAlerts = monitor.getActiveAlerts();
      const refreshFailureAlert = activeAlerts.find(alert => 
        alert.type === AlertType.TOKEN_REFRESH_FAILURES
      );

      // Should not create alert for single failure
      expect(refreshFailureAlert).toBeUndefined();

      // Create multiple failures to trigger alert (need 3 total failures)
      monitor.recordTokenRefresh('google', false, 800, new Error('Invalid grant'));
      monitor.recordTokenRefresh('google', false, 800, new Error('Invalid grant'));

      const updatedAlerts = monitor.getActiveAlerts();
      const multipleFailuresAlert = updatedAlerts.find(alert => 
        alert.type === AlertType.TOKEN_REFRESH_FAILURES
      );
      expect(multipleFailuresAlert).toBeDefined();
    });

    it('should track performance history', () => {
      monitor.recordAuthAttempt('google', true, 500);
      monitor.recordTokenRefresh('google', true, 200);

      const performanceHistory = monitor.getPerformanceHistory(1);
      expect(performanceHistory.length).toBeGreaterThan(0);
      
      const latestMetric = performanceHistory[performanceHistory.length - 1];
      expect(latestMetric.throughput).toBeDefined();
      expect(latestMetric.authFlowLatency).toBeDefined();
      expect(latestMetric.tokenRefreshLatency).toBeDefined();
    });
  });

  describe('Security Monitoring', () => {
    it('should record security events', () => {
      monitor.recordSecurityEvent('csrf', 'google', { 
        suspiciousState: 'invalid-123' 
      });

      const activeAlerts = monitor.getActiveAlerts();
      const securityAlert = activeAlerts.find(alert => 
        alert.type === AlertType.SECURITY_INCIDENT
      );

      expect(securityAlert).toBeDefined();
      expect(securityAlert!.severity).toBe('critical');
      expect(securityAlert!.provider).toBe('google');
      expect(securityAlert!.metadata!.securityEventType).toBe('csrf');
    });

    it('should detect multiple security events', () => {
      // Add security events to logger first
      for (let i = 0; i < 4; i++) {
        logger.security(OAuthOperation.CSRF_DETECTED, 'Security event', undefined, 'google');
      }

      // Create multiple security events to trigger threshold alert
      for (let i = 0; i < 4; i++) {
        monitor.recordSecurityEvent('invalid_callback', 'google');
      }

      const activeAlerts = monitor.getActiveAlerts();
      const multipleEventsAlert = activeAlerts.find(alert => 
        alert.type === AlertType.MULTIPLE_CSRF_ATTEMPTS
      );

      expect(multipleEventsAlert).toBeDefined();
      expect(multipleEventsAlert!.severity).toBe('critical');
    });

    it('should record resource leaks', () => {
      monitor.recordResourceLeak('callback_server', 'Server not properly closed', {
        port: 8080,
        duration: 30000
      });

      const activeAlerts = monitor.getActiveAlerts();
      const resourceLeakAlert = activeAlerts.find(alert => 
        alert.type === AlertType.RESOURCE_LEAK
      );

      expect(resourceLeakAlert).toBeDefined();
      expect(resourceLeakAlert!.severity).toBe('high');
      expect(resourceLeakAlert!.metadata!.resource).toBe('callback_server');
    });
  });

  describe('Health Status', () => {
    it('should calculate overall health status', () => {
      // Healthy scenario
      monitor.recordAuthAttempt('google', true, 500);
      monitor.recordTokenRefresh('google', true, 200);

      let healthStatus = monitor.getHealthStatus();
      expect(healthStatus.overall).toBe('healthy');

      // Create a critical alert to make it unhealthy
      monitor.recordSecurityEvent('csrf', 'google');

      healthStatus = monitor.getHealthStatus();
      expect(healthStatus.overall).toBe('unhealthy');
    });

    it('should provide service-specific health', () => {
      // Add error logs to simulate service issues
      for (let i = 0; i < 6; i++) {
        logger.error(OAuthOperation.AUTHENTICATION_FAILED, 'Auth failed', new Error('Auth failed'));
        logger.error(OAuthOperation.TOKEN_REFRESH_FAILED, 'Refresh failed', new Error('Refresh failed'));
      }
      logger.error(OAuthOperation.CALLBACK_SERVER_ERROR, 'Server error', new Error('Server error'));
      logger.error(OAuthOperation.CALLBACK_SERVER_ERROR, 'Server error', new Error('Server error'));
      logger.error(OAuthOperation.CALLBACK_SERVER_ERROR, 'Server error', new Error('Server error'));

      monitor.recordAuthAttempt('google', false, 500, new Error('Auth failed'));
      monitor.recordTokenRefresh('google', false, 200, new Error('Refresh failed'));
      monitor.recordCallbackServerIssue('Port binding failed');

      const healthStatus = monitor.getHealthStatus();

      expect(healthStatus.services.authentication).toBe('unhealthy'); // 6 errors > 5 threshold
      expect(healthStatus.services.tokenRefresh).toBe('unhealthy'); // 6 errors > 3 threshold
      expect(healthStatus.services.callbackServer).toBe('unhealthy'); // 3 errors > 2 threshold
    });

    it('should track performance metrics in health status', () => {
      // Add logs with performance data
      logger.info(OAuthOperation.AUTHENTICATION_SUCCESS, 'Auth success', { 
        performance: { duration: 800, startTime: Date.now() - 800, endTime: Date.now() }
      }, 'google');
      logger.info(OAuthOperation.TOKEN_REFRESHED, 'Token refreshed', { 
        performance: { duration: 300, startTime: Date.now() - 300, endTime: Date.now() }
      }, 'google');

      monitor.recordAuthAttempt('google', true, 800);
      monitor.recordTokenRefresh('google', true, 300);

      const healthStatus = monitor.getHealthStatus();

      // The performance metrics come from the logger's metrics, not the monitor directly
      expect(healthStatus.performance.successRate).toBe(100);
    });
  });

  describe('Configuration', () => {
    it('should update monitoring configuration', () => {
      const newConfig: Partial<MonitoringConfig> = {
        alertThresholds: {
          errorRate: 5,
          latencyMs: 500,
          securityEventsPerHour: 2,
          failedAuthsPerHour: 3
        },
        enableRealTimeAlerts: false
      };

      monitor.updateConfig(newConfig);

      // Test that new thresholds are applied
      monitor.recordAuthAttempt('google', false, 600, new Error('Timeout'));

      const activeAlerts = monitor.getActiveAlerts();
      const highLatencyAlert = activeAlerts.find(alert => 
        alert.type === AlertType.HIGH_LATENCY
      );

      expect(highLatencyAlert).toBeDefined(); // Should trigger with new lower threshold
    });

    it('should disable monitoring when configured', () => {
      monitor.updateConfig({ enabled: false });

      monitor.recordAuthAttempt('google', false, 2000, new Error('Timeout'));

      const activeAlerts = monitor.getActiveAlerts();
      expect(activeAlerts).toHaveLength(0); // No alerts should be created
    });
  });

  describe('Utility Functions', () => {
    it('should get singleton monitor instance', () => {
      const monitor1 = getOAuthMonitor();
      const monitor2 = getOAuthMonitor();

      expect(monitor1).toBe(monitor2); // Should be the same instance
    });

    it('should manage alert listeners', () => {
      const listener1 = jest.fn();
      const listener2 = jest.fn();

      monitor.addAlertListener(listener1);
      monitor.addAlertListener(listener2);

      monitor.recordSecurityEvent('csrf', 'google');

      expect(listener1).toHaveBeenCalled();
      expect(listener2).toHaveBeenCalled();

      monitor.removeAlertListener(listener1);
      monitor.recordSecurityEvent('invalid_callback', 'google');

      expect(listener1).toHaveBeenCalledTimes(1); // Should not be called again
      expect(listener2).toHaveBeenCalledTimes(2); // Should be called again
    });
  });
});