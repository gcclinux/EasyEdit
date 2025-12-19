/**
 * OAuth Error Handler
 * Provides comprehensive error handling, retry logic, and user-friendly messaging
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5
 */

export enum OAuthErrorType {
  // Network errors
  NETWORK_ERROR = 'network_error',
  TIMEOUT = 'timeout',
  CONNECTION_REFUSED = 'connection_refused',
  DNS_ERROR = 'dns_error',
  
  // OAuth protocol errors
  INVALID_REQUEST = 'invalid_request',
  INVALID_CLIENT = 'invalid_client',
  INVALID_GRANT = 'invalid_grant',
  UNAUTHORIZED_CLIENT = 'unauthorized_client',
  UNSUPPORTED_GRANT_TYPE = 'unsupported_grant_type',
  INVALID_SCOPE = 'invalid_scope',
  ACCESS_DENIED = 'access_denied',
  
  // User interaction errors
  USER_CANCELLED = 'user_cancelled',
  USER_DENIED = 'user_denied',
  
  // Server errors
  SERVER_ERROR = 'server_error',
  TEMPORARILY_UNAVAILABLE = 'temporarily_unavailable',
  
  // Application errors
  PROVIDER_NOT_FOUND = 'provider_not_found',
  CALLBACK_FAILED = 'callback_failed',
  TOKEN_STORAGE_ERROR = 'token_storage_error',
  BROWSER_LAUNCH_FAILED = 'browser_launch_failed',
  
  // Security errors
  CSRF_ATTACK = 'csrf_attack',
  STATE_MISMATCH = 'state_mismatch',
  INVALID_CALLBACK = 'invalid_callback'
}

export interface OAuthError {
  type: OAuthErrorType;
  message: string;
  userMessage: string;
  canRetry: boolean;
  requiresReauth: boolean;
  originalError?: Error;
  retryAfter?: number; // seconds
}

export interface RetryConfig {
  maxRetries: number;
  baseDelay: number; // milliseconds
  maxDelay: number; // milliseconds
  backoffMultiplier: number;
  retryableErrors: OAuthErrorType[];
}

export class OAuthErrorHandler {
  private static readonly DEFAULT_RETRY_CONFIG: RetryConfig = {
    maxRetries: 3,
    baseDelay: 1000, // 1 second
    maxDelay: 30000, // 30 seconds
    backoffMultiplier: 2,
    retryableErrors: [
      OAuthErrorType.NETWORK_ERROR,
      OAuthErrorType.TIMEOUT,
      OAuthErrorType.CONNECTION_REFUSED,
      OAuthErrorType.DNS_ERROR,
      OAuthErrorType.SERVER_ERROR,
      OAuthErrorType.TEMPORARILY_UNAVAILABLE,
      OAuthErrorType.USER_CANCELLED // User can retry after cancellation
    ]
  };

  /**
   * Create an OAuth error from various error sources
   */
  static createError(
    type: OAuthErrorType,
    message: string,
    originalError?: Error,
    customUserMessage?: string
  ): OAuthError {
    const userMessage = customUserMessage || this.getUserFriendlyMessage(type, message);
    const canRetry = this.isRetryableError(type);
    const requiresReauth = this.requiresReauthentication(type);
    const retryAfter = this.getRetryDelay(type);

    return {
      type,
      message,
      userMessage,
      canRetry,
      requiresReauth,
      originalError,
      retryAfter
    };
  }

  /**
   * Parse network errors and classify them appropriately
   */
  static parseNetworkError(error: Error): OAuthError {
    const message = error.message.toLowerCase();
    
    if (message.includes('timeout') || message.includes('etimedout')) {
      return this.createError(
        OAuthErrorType.TIMEOUT,
        'Request timed out',
        error,
        'The request took too long to complete. Please check your internet connection and try again.'
      );
    }
    
    if (message.includes('enotfound') || message.includes('dns')) {
      return this.createError(
        OAuthErrorType.DNS_ERROR,
        'DNS resolution failed',
        error,
        'Unable to connect to the authentication server. Please check your internet connection.'
      );
    }
    
    if (message.includes('econnrefused') || message.includes('connection refused')) {
      return this.createError(
        OAuthErrorType.CONNECTION_REFUSED,
        'Connection refused',
        error,
        'The authentication server is currently unavailable. Please try again later.'
      );
    }
    
    return this.createError(
      OAuthErrorType.NETWORK_ERROR,
      error.message,
      error,
      'A network error occurred. Please check your internet connection and try again.'
    );
  }

  /**
   * Parse OAuth protocol errors from token responses
   */
  static parseOAuthError(error: string, errorDescription?: string): OAuthError {
    const type = this.mapOAuthErrorType(error);
    const message = errorDescription || error;
    
    return this.createError(type, message);
  }

  /**
   * Detect user cancellation from various sources
   */
  static detectUserCancellation(error: Error | string): OAuthError | null {
    const message = typeof error === 'string' ? error : error.message;
    const lowerMessage = message.toLowerCase();
    
    // Common user cancellation patterns
    const cancellationPatterns = [
      'user cancelled',
      'user canceled',
      'access_denied',
      'user denied',
      'authorization_declined',
      'user_cancelled_login',
      'popup_closed_by_user',
      'window closed'
    ];
    
    const isCancellation = cancellationPatterns.some(pattern => 
      lowerMessage.includes(pattern)
    );
    
    if (isCancellation) {
      return this.createError(
        OAuthErrorType.USER_CANCELLED,
        'User cancelled authentication',
        typeof error === 'object' ? error : undefined,
        'Authentication was cancelled. You can try again when ready.'
      );
    }
    
    return null;
  }

  /**
   * Execute operation with exponential backoff retry logic
   */
  static async withRetry<T>(
    operation: () => Promise<T>,
    config: Partial<RetryConfig> = {},
    onRetry?: (attempt: number, error: OAuthError) => void
  ): Promise<T> {
    const retryConfig = { ...this.DEFAULT_RETRY_CONFIG, ...config };
    let lastError: OAuthError;
    
    for (let attempt = 0; attempt <= retryConfig.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        // Convert error to OAuthError if needed
        const oauthError = error instanceof Error 
          ? this.parseNetworkError(error)
          : error as OAuthError;
        
        lastError = oauthError;
        
        // Don't retry on last attempt or non-retryable errors
        if (attempt === retryConfig.maxRetries || !oauthError.canRetry) {
          throw oauthError;
        }
        
        // Check if error type is retryable
        if (!retryConfig.retryableErrors.includes(oauthError.type)) {
          throw oauthError;
        }
        
        // Calculate delay with exponential backoff
        const delay = Math.min(
          retryConfig.baseDelay * Math.pow(retryConfig.backoffMultiplier, attempt),
          retryConfig.maxDelay
        );
        
        // Notify about retry
        if (onRetry) {
          onRetry(attempt + 1, oauthError);
        }
        
        // Wait before retry
        await this.delay(delay);
      }
    }
    
    throw lastError!;
  }

  /**
   * Handle timeout with proper resource cleanup
   */
  static async withTimeout<T>(
    operation: () => Promise<T>,
    timeoutMs: number,
    cleanup?: () => Promise<void>
  ): Promise<T> {
    let timeoutId: NodeJS.Timeout;
    
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => {
        const error = this.createError(
          OAuthErrorType.TIMEOUT,
          `Operation timed out after ${timeoutMs}ms`,
          undefined,
          'The operation took too long to complete. Please try again.'
        );
        reject(error);
      }, timeoutMs);
    });
    
    try {
      const result = await Promise.race([operation(), timeoutPromise]);
      clearTimeout(timeoutId);
      return result;
    } catch (error) {
      clearTimeout(timeoutId);
      
      // Perform cleanup if provided
      if (cleanup) {
        try {
          await cleanup();
        } catch (cleanupError) {
          console.error('Error during timeout cleanup:', cleanupError);
        }
      }
      
      throw error;
    }
  }

  /**
   * Get user-friendly error message
   */
  private static getUserFriendlyMessage(type: OAuthErrorType, originalMessage: string): string {
    const messages: Record<OAuthErrorType, string> = {
      [OAuthErrorType.NETWORK_ERROR]: 'A network error occurred. Please check your internet connection and try again.',
      [OAuthErrorType.TIMEOUT]: 'The request took too long to complete. Please try again.',
      [OAuthErrorType.CONNECTION_REFUSED]: 'Unable to connect to the authentication server. Please try again later.',
      [OAuthErrorType.DNS_ERROR]: 'Unable to connect to the authentication server. Please check your internet connection.',
      
      [OAuthErrorType.INVALID_REQUEST]: 'The authentication request was invalid. Please try again.',
      [OAuthErrorType.INVALID_CLIENT]: 'The application is not properly configured for authentication.',
      [OAuthErrorType.INVALID_GRANT]: 'The authentication code is invalid or expired. Please try again.',
      [OAuthErrorType.UNAUTHORIZED_CLIENT]: 'This application is not authorized to perform authentication.',
      [OAuthErrorType.UNSUPPORTED_GRANT_TYPE]: 'The authentication method is not supported.',
      [OAuthErrorType.INVALID_SCOPE]: 'The requested permissions are invalid.',
      [OAuthErrorType.ACCESS_DENIED]: 'Access was denied. Please grant the necessary permissions and try again.',
      
      [OAuthErrorType.USER_CANCELLED]: 'Authentication was cancelled. You can try again when ready.',
      [OAuthErrorType.USER_DENIED]: 'Authentication was denied. Please grant the necessary permissions to continue.',
      
      [OAuthErrorType.SERVER_ERROR]: 'The authentication server encountered an error. Please try again later.',
      [OAuthErrorType.TEMPORARILY_UNAVAILABLE]: 'The authentication service is temporarily unavailable. Please try again later.',
      
      [OAuthErrorType.PROVIDER_NOT_FOUND]: 'The authentication provider is not available.',
      [OAuthErrorType.CALLBACK_FAILED]: 'Authentication callback failed. Please try again.',
      [OAuthErrorType.TOKEN_STORAGE_ERROR]: 'Unable to save authentication information. Please try again.',
      [OAuthErrorType.BROWSER_LAUNCH_FAILED]: 'Unable to open your web browser. Please try again or copy the authentication URL manually.',
      
      [OAuthErrorType.CSRF_ATTACK]: 'A security error occurred. Please try again.',
      [OAuthErrorType.STATE_MISMATCH]: 'A security error occurred. Please try again.',
      [OAuthErrorType.INVALID_CALLBACK]: 'Invalid authentication response received. Please try again.'
    };
    
    return messages[type] || `An error occurred: ${originalMessage}`;
  }

  /**
   * Check if error type is retryable
   */
  private static isRetryableError(type: OAuthErrorType): boolean {
    return this.DEFAULT_RETRY_CONFIG.retryableErrors.includes(type);
  }

  /**
   * Check if error requires re-authentication
   */
  private static requiresReauthentication(type: OAuthErrorType): boolean {
    const reauthErrors = [
      OAuthErrorType.INVALID_GRANT,
      OAuthErrorType.UNAUTHORIZED_CLIENT,
      OAuthErrorType.ACCESS_DENIED,
      OAuthErrorType.USER_DENIED,
      OAuthErrorType.CSRF_ATTACK,
      OAuthErrorType.STATE_MISMATCH
    ];
    
    return reauthErrors.includes(type);
  }

  /**
   * Get retry delay for specific error types
   */
  private static getRetryDelay(type: OAuthErrorType): number | undefined {
    const delays: Partial<Record<OAuthErrorType, number>> = {
      [OAuthErrorType.SERVER_ERROR]: 30, // 30 seconds
      [OAuthErrorType.TEMPORARILY_UNAVAILABLE]: 60, // 1 minute
      [OAuthErrorType.TIMEOUT]: 10 // 10 seconds
    };
    
    return delays[type];
  }

  /**
   * Map OAuth error strings to error types
   */
  private static mapOAuthErrorType(error: string): OAuthErrorType {
    const mapping: Record<string, OAuthErrorType> = {
      'invalid_request': OAuthErrorType.INVALID_REQUEST,
      'invalid_client': OAuthErrorType.INVALID_CLIENT,
      'invalid_grant': OAuthErrorType.INVALID_GRANT,
      'unauthorized_client': OAuthErrorType.UNAUTHORIZED_CLIENT,
      'unsupported_grant_type': OAuthErrorType.UNSUPPORTED_GRANT_TYPE,
      'invalid_scope': OAuthErrorType.INVALID_SCOPE,
      'access_denied': OAuthErrorType.ACCESS_DENIED,
      'server_error': OAuthErrorType.SERVER_ERROR,
      'temporarily_unavailable': OAuthErrorType.TEMPORARILY_UNAVAILABLE,
      'user_cancelled': OAuthErrorType.USER_CANCELLED,
      'user_denied': OAuthErrorType.USER_DENIED
    };
    
    return mapping[error] || OAuthErrorType.SERVER_ERROR;
  }

  /**
   * Delay utility for retry logic
   */
  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}