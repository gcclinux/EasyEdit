/**
 * Tauri OAuth Notifications
 * Handles OAuth-related notifications and user feedback in Tauri environment
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5
 */

import type { OAuthResult } from '../interfaces';

// Static Tauri API imports
import { sendNotification, isPermissionGranted, requestPermission } from '@tauri-apps/api/notification';
import { isTauriEnvironment } from '../../../utils/environment';

/**
 * OAuth notification types
 */
export enum OAuthNotificationType {
  AUTH_STARTED = 'auth_started',
  AUTH_SUCCESS = 'auth_success',
  AUTH_FAILED = 'auth_failed',
  TOKEN_REFRESHED = 'token_refreshed',
  TOKEN_EXPIRED = 'token_expired',
  LOGOUT_SUCCESS = 'logout_success',
  CONFIG_ERROR = 'config_error'
}

/**
 * OAuth notification data
 */
export interface OAuthNotificationData {
  type: OAuthNotificationType;
  provider: string;
  title: string;
  message: string;
  isError?: boolean;
  requiresAction?: boolean;
  actionText?: string;
  actionCallback?: () => void;
}

/**
 * Tauri OAuth Notification Manager
 */
export class TauriOAuthNotifications {
  private static instance: TauriOAuthNotifications;
  private permissionGranted: boolean = false;
  private notificationQueue: OAuthNotificationData[] = [];

  private constructor() {
    this.initializeNotifications();
  }

  /**
   * Get singleton instance
   */
  static getInstance(): TauriOAuthNotifications {
    if (!TauriOAuthNotifications.instance) {
      TauriOAuthNotifications.instance = new TauriOAuthNotifications();
    }
    return TauriOAuthNotifications.instance;
  }

  /**
   * Initialize notification system
   */
  private async initializeNotifications(): Promise<void> {
    if (!isTauriEnvironment()) {
      console.warn('Tauri notification notifications disabled (not in Tauri environment)');
      return;
    }

    try {
      // Check if notification permission is already granted
      this.permissionGranted = await isPermissionGranted();

      if (!this.permissionGranted) {
        // Request notification permission
        const permission = await requestPermission();
        this.permissionGranted = permission === 'granted';
      }

      // Process queued notifications if permission is granted
      if (this.permissionGranted && this.notificationQueue.length > 0) {
        for (const notification of this.notificationQueue) {
          await this.sendSystemNotification(notification);
        }
        this.notificationQueue = [];
      }

    } catch (error) {
      console.error('Failed to initialize OAuth notifications:', error);
    }
  }

  /**
   * Send system notification
   */
  private async sendSystemNotification(data: OAuthNotificationData): Promise<void> {
    if (!isTauriEnvironment()) {
      console.log(`OAuth Notification: ${data.title} - ${data.message}`);
      return;
    }

    if (!this.permissionGranted) {
      // Queue notification for later if permission not granted
      this.notificationQueue.push(data);
      return;
    }

    try {
      await sendNotification({
        title: data.title,
        body: data.message,
        icon: data.isError ? 'error' : 'info'
      });
    } catch (error) {
      console.error('Failed to send system notification:', error);
    }
  }

  /**
   * Show OAuth authentication started notification
   * Requirements: 6.1, 6.2
   */
  async notifyAuthStarted(provider: string): Promise<void> {
    const providerName = this.getProviderDisplayName(provider);

    const notification: OAuthNotificationData = {
      type: OAuthNotificationType.AUTH_STARTED,
      provider,
      title: 'Authentication Started',
      message: `Connecting to ${providerName}. Please complete authentication in your browser.`,
      isError: false,
      requiresAction: false
    };

    await this.sendSystemNotification(notification);
  }

  /**
   * Show OAuth authentication success notification
   * Requirements: 6.4
   */
  async notifyAuthSuccess(provider: string, result: OAuthResult): Promise<void> {
    const providerName = this.getProviderDisplayName(provider);

    const notification: OAuthNotificationData = {
      type: OAuthNotificationType.AUTH_SUCCESS,
      provider,
      title: 'Authentication Successful',
      message: `Successfully connected to ${providerName}. Cloud features are now available.`,
      isError: false,
      requiresAction: false
    };

    await this.sendSystemNotification(notification);
  }

  /**
   * Show OAuth authentication failure notification
   * Requirements: 6.5
   */
  async notifyAuthFailed(provider: string, error: string, errorDescription?: string): Promise<void> {
    const providerName = this.getProviderDisplayName(provider);
    const message = errorDescription || error || 'Authentication failed';

    const notification: OAuthNotificationData = {
      type: OAuthNotificationType.AUTH_FAILED,
      provider,
      title: 'Authentication Failed',
      message: `Failed to connect to ${providerName}: ${message}`,
      isError: true,
      requiresAction: true,
      actionText: 'Retry',
      actionCallback: () => {
        // Emit event for retry
        window.dispatchEvent(new CustomEvent('oauth-retry-requested', {
          detail: { provider }
        }));
      }
    };

    await this.sendSystemNotification(notification);
  }

  /**
   * Show token refresh success notification
   * Requirements: 4.2
   */
  async notifyTokenRefreshed(provider: string): Promise<void> {
    const providerName = this.getProviderDisplayName(provider);

    const notification: OAuthNotificationData = {
      type: OAuthNotificationType.TOKEN_REFRESHED,
      provider,
      title: 'Authentication Refreshed',
      message: `${providerName} authentication has been refreshed automatically.`,
      isError: false,
      requiresAction: false
    };

    await this.sendSystemNotification(notification);
  }

  /**
   * Show token expiration notification
   * Requirements: 4.3, 4.5
   */
  async notifyTokenExpired(provider: string, requiresReauth: boolean = true): Promise<void> {
    const providerName = this.getProviderDisplayName(provider);

    const notification: OAuthNotificationData = {
      type: OAuthNotificationType.TOKEN_EXPIRED,
      provider,
      title: 'Authentication Expired',
      message: requiresReauth
        ? `${providerName} authentication has expired. Please sign in again to continue using cloud features.`
        : `${providerName} authentication has expired but will be refreshed automatically.`,
      isError: true,
      requiresAction: requiresReauth,
      actionText: requiresReauth ? 'Sign In Again' : undefined,
      actionCallback: requiresReauth ? () => {
        window.dispatchEvent(new CustomEvent('oauth-reauth-requested', {
          detail: { provider }
        }));
      } : undefined
    };

    await this.sendSystemNotification(notification);
  }

  /**
   * Show logout success notification
   * Requirements: 4.4, 7.5
   */
  async notifyLogoutSuccess(provider: string): Promise<void> {
    const providerName = this.getProviderDisplayName(provider);

    const notification: OAuthNotificationData = {
      type: OAuthNotificationType.LOGOUT_SUCCESS,
      provider,
      title: 'Disconnected Successfully',
      message: `Successfully disconnected from ${providerName}.`,
      isError: false,
      requiresAction: false
    };

    await this.sendSystemNotification(notification);
  }

  /**
   * Show configuration error notification
   * Requirements: 5.3
   */
  async notifyConfigError(provider: string, error: string): Promise<void> {
    const providerName = this.getProviderDisplayName(provider);

    const notification: OAuthNotificationData = {
      type: OAuthNotificationType.CONFIG_ERROR,
      provider,
      title: 'Configuration Error',
      message: `${providerName} configuration error: ${error}`,
      isError: true,
      requiresAction: true,
      actionText: 'Check Settings',
      actionCallback: () => {
        window.dispatchEvent(new CustomEvent('oauth-config-requested', {
          detail: { provider }
        }));
      }
    };

    await this.sendSystemNotification(notification);
  }

  /**
   * Show custom OAuth notification
   */
  async notifyCustom(
    provider: string,
    title: string,
    message: string,
    isError: boolean = false,
    actionText?: string,
    actionCallback?: () => void
  ): Promise<void> {
    const notification: OAuthNotificationData = {
      type: OAuthNotificationType.AUTH_STARTED, // Generic type
      provider,
      title,
      message,
      isError,
      requiresAction: !!actionText,
      actionText,
      actionCallback
    };

    await this.sendSystemNotification(notification);
  }

  /**
   * Get provider display name
   */
  private getProviderDisplayName(provider: string): string {
    const displayNames: Record<string, string> = {
      'google': 'Google Drive',
      'dropbox': 'Dropbox',
      'onedrive': 'OneDrive',
      'github': 'GitHub'
    };

    return displayNames[provider.toLowerCase()] ||
      provider.charAt(0).toUpperCase() + provider.slice(1);
  }

  /**
   * Check if notifications are supported and enabled
   */
  isNotificationSupported(): boolean {
    return this.permissionGranted;
  }

  /**
   * Request notification permission
   */
  async requestNotificationPermission(): Promise<boolean> {
    if (!isTauriEnvironment()) {
      return false;
    }

    try {
      const permission = await requestPermission();
      this.permissionGranted = permission === 'granted';

      // Process queued notifications if permission granted
      if (this.permissionGranted && this.notificationQueue.length > 0) {
        for (const notification of this.notificationQueue) {
          await this.sendSystemNotification(notification);
        }
        this.notificationQueue = [];
      }

      return this.permissionGranted;
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      return false;
    }
  }

  /**
   * Clear notification queue
   */
  clearNotificationQueue(): void {
    this.notificationQueue = [];
  }
}

/**
 * Global Tauri OAuth Notifications instance
 */
export const tauriOAuthNotifications = TauriOAuthNotifications.getInstance();