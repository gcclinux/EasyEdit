/**
 * OAuth Monitor - Real-time monitoring and alerting for OAuth operations
 * Provides health checks, performance monitoring, and anomaly detection
 * Requirements: 7.3, 7.5
 */

import { OAuthLogger, LogLevel, OAuthOperation, type OAuthMetrics, type LogEntry } from './OAuthLogger';

export interface MonitoringAlert {
  id: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: AlertType;
  message: string;
  provider?: string;
  metadata?: Record<string, any>;
  resolved: boolean;
  resolvedAt?: Date;
}

export enum AlertType {
  // Performance alerts
  HIGH_LATENCY = 'high_latency',
  TIMEOUT_THRESHOLD = 'timeout_threshold',
  SLOW_TOKEN_REFRESH = 'slow_token_refresh',
  
  // Error rate alerts
  HIGH_ERROR_RATE = 'high_error_rate',
  AUTHENTICATION_FAILURES = 'authentication_failures',
  TOKEN_REFRESH_FAILURES = 'token_refresh_failures',
  
  // Security alerts
  SECURITY_INCIDENT = 'security_incident',
  MULTIPLE_CSRF_ATTEMPTS = 'multiple_csrf_attempts',
  SUSPICIOUS_CALLBACK_PATTERN = 'suspicious_callback_pattern',
  
  // Resource alerts
  RESOURCE_LEAK = 'resource_leak',
  CALLBACK_SERVER_ISSUES = 'callback_server_issues',
  STORAGE_ERRORS = 'storage_errors',
  
  // Configuration alerts
  PROVIDER_MISCONFIGURATION = 'provider_misconfiguration',
  MISSING_CREDENTIALS = 'missing_credentials',
  
  // Health alerts
  SERVICE_DEGRADATION = 'service_degradation',
  PROVIDER_UNAVAILABLE = 'provider_unavailable'
}

export interface MonitoringConfig {
  enabled: boolean;
  alertThresholds: {
    errorRate: number; // percentage (0-100)
    latencyMs: number;
    securityEventsPerHour: number;
    failedAuthsPerHour: number;
  };
  healthCheckInterval: number; // milliseconds
  alertRetentionDays: number;
  enableRealTimeAlerts: boolean;
  enablePerformanceTracking: boolean;
  enableSecurityMonitoring: boolean;
}

export interface HealthStatus {
  overall: 'healthy' | 'degraded' | 'unhealthy';
  providers: Record<string, {
    status: 'healthy' | 'degraded' | 'unhealthy';
    lastSuccess: Date | null;
    lastFailure: Date | null;
    errorRate: number;
    averageLatency: number;
  }>;
  services: {
    authentication: 'healthy' | 'degraded' | 'unhealthy';
    tokenRefresh: 'healthy' | 'degraded' | 'unhealthy';
    callbackServer: 'healthy' | 'degraded' | 'unhealthy';
    tokenStorage: 'healthy' | 'degraded' | 'unhealthy';
  };
  alerts: {
    active: number;
    critical: number;
    lastAlert: Date | null;
  };
  performance: {
    averageAuthTime: number;
    averageRefreshTime: number;
    successRate: number;
  };
}

export interface PerformanceMetrics {
  timestamp: Date;
  authFlowLatency: number[];
  tokenRefreshLatency: number[];
  callbackLatency: number[];
  errorRates: Record<string, number>;
  throughput: {
    authenticationsPerHour: number;
    refreshesPerHour: number;
  };
}

/**
 * OAuth monitoring service for real-time health and performance tracking
 */
export class OAuthMonitor {
  private static instance: OAuthMonitor | null = null;
  private config: MonitoringConfig;
  private logger: OAuthLogger;
  private alerts: MonitoringAlert[] = [];
  private performanceHistory: PerformanceMetrics[] = [];
  private healthCheckTimer: NodeJS.Timeout | null = null;
  private lastHealthCheck: Date | null = null;
  private alertListeners: ((alert: MonitoringAlert) => void)[] = [];

  private constructor(config?: Partial<MonitoringConfig>) {
    this.config = {
      enabled: true,
      alertThresholds: {
        errorRate: 10, // 10% error rate
        latencyMs: 30000, // 30 seconds
        securityEventsPerHour: 5,
        failedAuthsPerHour: 10
      },
      healthCheckInterval: 60000, // 1 minute
      alertRetentionDays: 7,
      enableRealTimeAlerts: true,
      enablePerformanceTracking: true,
      enableSecurityMonitoring: true,
      ...config
    };

    this.logger = OAuthLogger.getInstance();
    
    if (this.config.enabled) {
      this.startHealthChecks();
    }
  }

  /**
   * Get singleton instance of OAuth monitor
   */
  static getInstance(config?: Partial<MonitoringConfig>): OAuthMonitor {
    if (!OAuthMonitor.instance) {
      OAuthMonitor.instance = new OAuthMonitor(config);
    }
    return OAuthMonitor.instance;
  }

  /**
   * Update monitoring configuration
   */
  updateConfig(config: Partial<MonitoringConfig>): void {
    this.config = { ...this.config, ...config };
    
    if (this.config.enabled && !this.healthCheckTimer) {
      this.startHealthChecks();
    } else if (!this.config.enabled && this.healthCheckTimer) {
      this.stopHealthChecks();
    }
  }

  /**
   * Add alert listener for real-time notifications
   */
  addAlertListener(listener: (alert: MonitoringAlert) => void): void {
    this.alertListeners.push(listener);
  }

  /**
   * Remove alert listener
   */
  removeAlertListener(listener: (alert: MonitoringAlert) => void): void {
    const index = this.alertListeners.indexOf(listener);
    if (index > -1) {
      this.alertListeners.splice(index, 1);
    }
  }

  /**
   * Get current health status
   */
  getHealthStatus(): HealthStatus {
    const metrics = this.logger.getMetrics();
    const recentLogs = this.logger.getRecentLogs(100);
    const activeAlerts = this.getActiveAlerts();
    
    return {
      overall: this.calculateOverallHealth(metrics, activeAlerts),
      providers: this.calculateProviderHealth(recentLogs),
      services: this.calculateServiceHealth(recentLogs),
      alerts: {
        active: activeAlerts.length,
        critical: activeAlerts.filter(a => a.severity === 'critical').length,
        lastAlert: activeAlerts.length > 0 ? activeAlerts[0].timestamp : null
      },
      performance: {
        averageAuthTime: metrics.averageAuthTime,
        averageRefreshTime: this.calculateAverageRefreshTime(recentLogs),
        successRate: this.calculateSuccessRate(metrics)
      }
    };
  }

  /**
   * Get active alerts
   */
  getActiveAlerts(): MonitoringAlert[] {
    return this.alerts.filter(alert => !alert.resolved);
  }

  /**
   * Get all alerts (including resolved)
   */
  getAllAlerts(limit: number = 100): MonitoringAlert[] {
    return this.alerts.slice(-limit);
  }

  /**
   * Get alerts by severity
   */
  getAlertsBySeverity(severity: MonitoringAlert['severity']): MonitoringAlert[] {
    return this.alerts.filter(alert => alert.severity === severity && !alert.resolved);
  }

  /**
   * Resolve an alert
   */
  resolveAlert(alertId: string): boolean {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert && !alert.resolved) {
      alert.resolved = true;
      alert.resolvedAt = new Date();
      
      this.logger.info(
        OAuthOperation.CLEANUP_COMPLETED,
        `Alert resolved: ${alert.message}`,
        { alertId, alertType: alert.type },
        alert.provider
      );
      
      return true;
    }
    return false;
  }

  /**
   * Get performance metrics history
   */
  getPerformanceHistory(hours: number = 24): PerformanceMetrics[] {
    const cutoff = new Date(Date.now() - (hours * 60 * 60 * 1000));
    return this.performanceHistory.filter(metric => metric.timestamp >= cutoff);
  }

  /**
   * Record authentication attempt
   */
  recordAuthAttempt(provider: string, success: boolean, duration: number, error?: Error): void {
    if (!this.config.enabled) return;

    // Check for performance issues
    if (duration > this.config.alertThresholds.latencyMs) {
      this.createAlert(
        AlertType.HIGH_LATENCY,
        'high',
        `Authentication took ${duration}ms (threshold: ${this.config.alertThresholds.latencyMs}ms)`,
        provider,
        { duration, threshold: this.config.alertThresholds.latencyMs }
      );
    }

    // Check error rates
    if (!success) {
      this.checkErrorRateThreshold(provider);
    }

    // Update performance tracking
    if (this.config.enablePerformanceTracking) {
      this.updatePerformanceMetrics('auth', duration, success);
    }
  }

  /**
   * Record token refresh attempt
   */
  recordTokenRefresh(provider: string, success: boolean, duration: number, error?: Error): void {
    if (!this.config.enabled) return;

    // Check for slow token refresh
    const refreshThreshold = this.config.alertThresholds.latencyMs / 3; // More strict for refresh
    if (duration > refreshThreshold) {
      this.createAlert(
        AlertType.SLOW_TOKEN_REFRESH,
        'medium',
        `Token refresh took ${duration}ms (threshold: ${refreshThreshold}ms)`,
        provider,
        { duration, threshold: refreshThreshold }
      );
    }

    // Check refresh failure rate
    if (!success) {
      this.checkTokenRefreshFailures(provider);
    }

    // Update performance tracking
    if (this.config.enablePerformanceTracking) {
      this.updatePerformanceMetrics('refresh', duration, success);
    }
  }

  /**
   * Record security event
   */
  recordSecurityEvent(type: 'csrf' | 'invalid_callback' | 'suspicious_pattern', provider?: string, metadata?: Record<string, any>): void {
    if (!this.config.enabled || !this.config.enableSecurityMonitoring) return;

    const severity: MonitoringAlert['severity'] = type === 'csrf' ? 'critical' : 'high';
    
    this.createAlert(
      AlertType.SECURITY_INCIDENT,
      severity,
      `Security event detected: ${type}`,
      provider,
      { securityEventType: type, ...metadata }
    );

    // Check for multiple security events
    this.checkSecurityEventThreshold();
  }

  /**
   * Record resource leak
   */
  recordResourceLeak(resource: string, details: string, metadata?: Record<string, any>): void {
    if (!this.config.enabled) return;

    this.createAlert(
      AlertType.RESOURCE_LEAK,
      'high',
      `Resource leak detected: ${resource} - ${details}`,
      undefined,
      { resource, details, ...metadata }
    );
  }

  /**
   * Record callback server issue
   */
  recordCallbackServerIssue(issue: string, metadata?: Record<string, any>): void {
    if (!this.config.enabled) return;

    this.createAlert(
      AlertType.CALLBACK_SERVER_ISSUES,
      'medium',
      `Callback server issue: ${issue}`,
      undefined,
      metadata
    );
  }

  /**
   * Start health checks
   */
  private startHealthChecks(): void {
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer);
    }

    this.healthCheckTimer = setInterval(() => {
      this.performHealthCheck();
    }, this.config.healthCheckInterval);

    // Perform initial health check
    this.performHealthCheck();
  }

  /**
   * Stop health checks
   */
  private stopHealthChecks(): void {
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer);
      this.healthCheckTimer = null;
    }
  }

  /**
   * Perform comprehensive health check
   */
  private performHealthCheck(): void {
    this.lastHealthCheck = new Date();
    
    const metrics = this.logger.getMetrics();
    const recentLogs = this.logger.getRecentLogs(50);
    
    // Check overall error rate
    this.checkOverallErrorRate(metrics);
    
    // Check for service degradation
    this.checkServiceDegradation(recentLogs);
    
    // Clean up old alerts
    this.cleanupOldAlerts();
    
    // Update performance history
    if (this.config.enablePerformanceTracking) {
      this.updatePerformanceHistory(metrics, recentLogs);
    }

    this.logger.debug(
      OAuthOperation.OPERATION_TIMED,
      'Health check completed',
      {
        activeAlerts: this.getActiveAlerts().length,
        totalOperations: metrics.totalOperations,
        successRate: this.calculateSuccessRate(metrics)
      }
    );
  }

  /**
   * Create and emit alert
   */
  private createAlert(
    type: AlertType,
    severity: MonitoringAlert['severity'],
    message: string,
    provider?: string,
    metadata?: Record<string, any>
  ): void {
    const alert: MonitoringAlert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      timestamp: new Date(),
      severity,
      type,
      message,
      provider,
      metadata,
      resolved: false
    };

    this.alerts.push(alert);

    // Log the alert
    this.logger.warn(
      OAuthOperation.RESOURCE_LEAK_DETECTED,
      `Alert created: ${message}`,
      { alertId: alert.id, alertType: type, severity, ...metadata },
      provider
    );

    // Notify listeners
    if (this.config.enableRealTimeAlerts) {
      this.alertListeners.forEach(listener => {
        try {
          listener(alert);
        } catch (error) {
          this.logger.error(
            OAuthOperation.CLEANUP_COMPLETED,
            'Error notifying alert listener',
            error instanceof Error ? error : new Error('Unknown error'),
            { alertId: alert.id }
          );
        }
      });
    }
  }

  /**
   * Check error rate threshold for provider
   */
  private checkErrorRateThreshold(provider: string): void {
    const recentLogs = this.logger.getProviderLogs(provider, 20);
    const recentFailures = recentLogs.filter(log => 
      log.operation === OAuthOperation.AUTHENTICATION_FAILED &&
      log.timestamp > new Date(Date.now() - 60 * 60 * 1000) // Last hour
    );

    if (recentFailures.length >= this.config.alertThresholds.failedAuthsPerHour) {
      this.createAlert(
        AlertType.AUTHENTICATION_FAILURES,
        'high',
        `High authentication failure rate: ${recentFailures.length} failures in the last hour`,
        provider,
        { failureCount: recentFailures.length, threshold: this.config.alertThresholds.failedAuthsPerHour }
      );
    }
  }

  /**
   * Check token refresh failure rate
   */
  private checkTokenRefreshFailures(provider: string): void {
    const recentLogs = this.logger.getProviderLogs(provider, 10);
    const recentRefreshFailures = recentLogs.filter(log => 
      log.operation === OAuthOperation.TOKEN_REFRESH_FAILED &&
      log.timestamp > new Date(Date.now() - 60 * 60 * 1000) // Last hour
    );

    if (recentRefreshFailures.length >= 3) { // More strict threshold for refresh failures
      this.createAlert(
        AlertType.TOKEN_REFRESH_FAILURES,
        'medium',
        `Multiple token refresh failures: ${recentRefreshFailures.length} failures in the last hour`,
        provider,
        { failureCount: recentRefreshFailures.length }
      );
    }
  }

  /**
   * Check security event threshold
   */
  private checkSecurityEventThreshold(): void {
    const recentSecurityEvents = this.logger.getSecurityEvents(20);
    const lastHourEvents = recentSecurityEvents.filter(event =>
      event.timestamp > new Date(Date.now() - 60 * 60 * 1000)
    );

    if (lastHourEvents.length >= this.config.alertThresholds.securityEventsPerHour) {
      this.createAlert(
        AlertType.MULTIPLE_CSRF_ATTEMPTS,
        'critical',
        `High security event rate: ${lastHourEvents.length} events in the last hour`,
        undefined,
        { eventCount: lastHourEvents.length, threshold: this.config.alertThresholds.securityEventsPerHour }
      );
    }
  }

  /**
   * Check overall error rate
   */
  private checkOverallErrorRate(metrics: OAuthMetrics): void {
    const totalAttempts = metrics.successfulAuthentications + metrics.failedAuthentications;
    if (totalAttempts > 0) {
      const errorRate = (metrics.failedAuthentications / totalAttempts) * 100;
      
      if (errorRate > this.config.alertThresholds.errorRate) {
        this.createAlert(
          AlertType.HIGH_ERROR_RATE,
          'high',
          `High overall error rate: ${errorRate.toFixed(1)}% (threshold: ${this.config.alertThresholds.errorRate}%)`,
          undefined,
          { errorRate, threshold: this.config.alertThresholds.errorRate, totalAttempts }
        );
      }
    }
  }

  /**
   * Check for service degradation
   */
  private checkServiceDegradation(recentLogs: LogEntry[]): void {
    const errorLogs = recentLogs.filter(log => log.level === LogLevel.ERROR);
    const recentErrors = errorLogs.filter(log =>
      log.timestamp > new Date(Date.now() - 10 * 60 * 1000) // Last 10 minutes
    );

    if (recentErrors.length >= 5) { // 5 errors in 10 minutes indicates degradation
      this.createAlert(
        AlertType.SERVICE_DEGRADATION,
        'medium',
        `Service degradation detected: ${recentErrors.length} errors in the last 10 minutes`,
        undefined,
        { errorCount: recentErrors.length }
      );
    }
  }

  /**
   * Update performance metrics
   */
  private updatePerformanceMetrics(operation: 'auth' | 'refresh' | 'callback', duration: number, success: boolean): void {
    // This would be implemented with more sophisticated performance tracking
    // For now, we'll just log the performance data
    this.logger.debug(
      OAuthOperation.OPERATION_TIMED,
      `Performance metric recorded: ${operation}`,
      { operation, duration, success }
    );
  }

  /**
   * Update performance history
   */
  private updatePerformanceHistory(metrics: OAuthMetrics, recentLogs: LogEntry[]): void {
    const now = new Date();
    const lastHour = new Date(now.getTime() - 60 * 60 * 1000);
    
    const hourlyLogs = recentLogs.filter(log => log.timestamp >= lastHour);
    
    const performanceMetric: PerformanceMetrics = {
      timestamp: now,
      authFlowLatency: this.extractLatencies(hourlyLogs, OAuthOperation.AUTHENTICATION_SUCCESS),
      tokenRefreshLatency: this.extractLatencies(hourlyLogs, OAuthOperation.TOKEN_REFRESHED),
      callbackLatency: this.extractLatencies(hourlyLogs, OAuthOperation.CALLBACK_RECEIVED),
      errorRates: this.calculateHourlyErrorRates(hourlyLogs),
      throughput: {
        authenticationsPerHour: hourlyLogs.filter(log => 
          log.operation === OAuthOperation.AUTHENTICATION_SUCCESS
        ).length,
        refreshesPerHour: hourlyLogs.filter(log => 
          log.operation === OAuthOperation.TOKEN_REFRESHED
        ).length
      }
    };

    this.performanceHistory.push(performanceMetric);

    // Keep only last 24 hours of performance data
    const cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    this.performanceHistory = this.performanceHistory.filter(metric => metric.timestamp >= cutoff);
  }

  /**
   * Extract latencies from logs
   */
  private extractLatencies(logs: LogEntry[], operation: OAuthOperation): number[] {
    return logs
      .filter(log => log.operation === operation && log.performance)
      .map(log => log.performance!.duration);
  }

  /**
   * Calculate hourly error rates
   */
  private calculateHourlyErrorRates(logs: LogEntry[]): Record<string, number> {
    const errorCounts: Record<string, number> = {};
    const totalCounts: Record<string, number> = {};

    logs.forEach(log => {
      if (log.provider) {
        totalCounts[log.provider] = (totalCounts[log.provider] || 0) + 1;
        
        if (log.level === LogLevel.ERROR) {
          errorCounts[log.provider] = (errorCounts[log.provider] || 0) + 1;
        }
      }
    });

    const errorRates: Record<string, number> = {};
    Object.keys(totalCounts).forEach(provider => {
      const errors = errorCounts[provider] || 0;
      const total = totalCounts[provider];
      errorRates[provider] = total > 0 ? (errors / total) * 100 : 0;
    });

    return errorRates;
  }

  /**
   * Clean up old alerts
   */
  private cleanupOldAlerts(): void {
    const cutoff = new Date(Date.now() - (this.config.alertRetentionDays * 24 * 60 * 60 * 1000));
    this.alerts = this.alerts.filter(alert => alert.timestamp >= cutoff);
  }

  /**
   * Calculate overall health
   */
  private calculateOverallHealth(metrics: OAuthMetrics, activeAlerts: MonitoringAlert[]): HealthStatus['overall'] {
    const criticalAlerts = activeAlerts.filter(a => a.severity === 'critical').length;
    const highAlerts = activeAlerts.filter(a => a.severity === 'high').length;
    
    if (criticalAlerts > 0) return 'unhealthy';
    if (highAlerts > 2) return 'degraded';
    
    const successRate = this.calculateSuccessRate(metrics);
    if (successRate < 90) return 'degraded';
    if (successRate < 50) return 'unhealthy';
    
    return 'healthy';
  }

  /**
   * Calculate provider health
   */
  private calculateProviderHealth(logs: LogEntry[]): HealthStatus['providers'] {
    const providers: HealthStatus['providers'] = {};
    const providerLogs: Record<string, LogEntry[]> = {};

    // Group logs by provider
    logs.forEach(log => {
      if (log.provider) {
        if (!providerLogs[log.provider]) {
          providerLogs[log.provider] = [];
        }
        providerLogs[log.provider].push(log);
      }
    });

    // Calculate health for each provider
    Object.keys(providerLogs).forEach(provider => {
      const providerLogEntries = providerLogs[provider];
      const successes = providerLogEntries.filter(log => 
        log.operation === OAuthOperation.AUTHENTICATION_SUCCESS
      );
      const failures = providerLogEntries.filter(log => 
        log.operation === OAuthOperation.AUTHENTICATION_FAILED
      );
      
      const total = successes.length + failures.length;
      const errorRate = total > 0 ? (failures.length / total) * 100 : 0;
      
      const latencies = this.extractLatencies(providerLogEntries, OAuthOperation.AUTHENTICATION_SUCCESS);
      const averageLatency = latencies.length > 0 
        ? latencies.reduce((sum, lat) => sum + lat, 0) / latencies.length 
        : 0;

      let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
      if (errorRate > 20) status = 'unhealthy';
      else if (errorRate > 10 || averageLatency > 30000) status = 'degraded';

      providers[provider] = {
        status,
        lastSuccess: successes.length > 0 ? successes[successes.length - 1].timestamp : null,
        lastFailure: failures.length > 0 ? failures[failures.length - 1].timestamp : null,
        errorRate,
        averageLatency
      };
    });

    return providers;
  }

  /**
   * Calculate service health
   */
  private calculateServiceHealth(logs: LogEntry[]): HealthStatus['services'] {
    const authErrors = logs.filter(log => 
      log.operation === OAuthOperation.AUTHENTICATION_FAILED
    ).length;
    
    const refreshErrors = logs.filter(log => 
      log.operation === OAuthOperation.TOKEN_REFRESH_FAILED
    ).length;
    
    const callbackErrors = logs.filter(log => 
      log.operation === OAuthOperation.CALLBACK_SERVER_ERROR
    ).length;
    
    const storageErrors = logs.filter(log => 
      log.operation === OAuthOperation.TOKEN_STORED && log.level === LogLevel.ERROR
    ).length;

    return {
      authentication: authErrors > 5 ? 'unhealthy' : authErrors > 2 ? 'degraded' : 'healthy',
      tokenRefresh: refreshErrors > 3 ? 'unhealthy' : refreshErrors > 1 ? 'degraded' : 'healthy',
      callbackServer: callbackErrors > 2 ? 'unhealthy' : callbackErrors > 0 ? 'degraded' : 'healthy',
      tokenStorage: storageErrors > 2 ? 'unhealthy' : storageErrors > 0 ? 'degraded' : 'healthy'
    };
  }

  /**
   * Calculate success rate
   */
  private calculateSuccessRate(metrics: OAuthMetrics): number {
    const total = metrics.successfulAuthentications + metrics.failedAuthentications;
    return total > 0 ? (metrics.successfulAuthentications / total) * 100 : 100;
  }

  /**
   * Calculate average refresh time
   */
  private calculateAverageRefreshTime(logs: LogEntry[]): number {
    const refreshLogs = logs.filter(log => 
      log.operation === OAuthOperation.TOKEN_REFRESHED && log.performance
    );
    
    if (refreshLogs.length === 0) return 0;
    
    const totalTime = refreshLogs.reduce((sum, log) => sum + log.performance!.duration, 0);
    return totalTime / refreshLogs.length;
  }
}

/**
 * Convenience function to get the OAuth monitor instance
 */
export function getOAuthMonitor(config?: Partial<MonitoringConfig>): OAuthMonitor {
  return OAuthMonitor.getInstance(config);
}