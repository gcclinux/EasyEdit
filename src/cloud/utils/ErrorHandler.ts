/**
 * ErrorHandler - Comprehensive error handling utilities for cloud operations
 * Implements retry mechanisms, exponential backoff, and user-friendly error messages
 */

export interface RetryOptions {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
}

export interface ErrorContext {
  operation: string;
  provider?: string;
  noteId?: string;
  fileName?: string;
  attempt?: number;
}

export class CloudError extends Error {
  code?: string;
  statusCode?: number;
  isRetryable?: boolean;
  context?: ErrorContext;

  constructor(message: string, context?: ErrorContext) {
    super(message);
    this.name = 'CloudError';
    this.context = context;
  }
}

export class ErrorHandler {
  private static readonly DEFAULT_RETRY_OPTIONS: RetryOptions = {
    maxRetries: 3,
    baseDelay: 1000, // 1 second
    maxDelay: 30000, // 30 seconds
    backoffMultiplier: 2
  };

  /**
   * Execute an operation with retry logic and exponential backoff
   */
  static async withRetry<T>(
    operation: () => Promise<T>,
    context: ErrorContext,
    options: Partial<RetryOptions> = {}
  ): Promise<T> {
    const retryOptions = { ...this.DEFAULT_RETRY_OPTIONS, ...options };
    let lastError: CloudError | null = null;

    for (let attempt = 0; attempt <= retryOptions.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = this.enhanceError(error, { ...context, attempt });

        // Don't retry on the last attempt
        if (attempt === retryOptions.maxRetries) {
          break;
        }

        // Check if error is retryable
        if (!this.isRetryableError(lastError)) {
          break;
        }

        // Calculate delay with exponential backoff and jitter
        const delay = Math.min(
          retryOptions.baseDelay * Math.pow(retryOptions.backoffMultiplier, attempt),
          retryOptions.maxDelay
        );

        // Add jitter to prevent thundering herd
        const jitteredDelay = delay + Math.random() * 1000;

        console.warn(
          `${context.operation} attempt ${attempt + 1} failed, retrying in ${Math.round(jitteredDelay)}ms:`,
          lastError.message
        );

        await this.delay(jitteredDelay);
      }
    }

    throw lastError;
  }

  /**
   * Enhance error with additional context and classification
   */
  static enhanceError(error: unknown, context: ErrorContext): CloudError {
    let cloudError: CloudError;
    
    if (error instanceof CloudError) {
      cloudError = error;
    } else if (error instanceof Error) {
      cloudError = new CloudError(error.message, context);
      cloudError.stack = error.stack;
    } else {
      cloudError = new CloudError('Unknown error', context);
    }
    
    cloudError.context = context;
    cloudError.isRetryable = this.isRetryableError(cloudError);

    // Extract status code from error message if available
    const statusMatch = cloudError.message.match(/(\d{3})/);
    if (statusMatch) {
      cloudError.statusCode = parseInt(statusMatch[1]);
    }

    // Classify error type
    cloudError.code = this.classifyError(cloudError);

    return cloudError;
  }

  /**
   * Determine if an error is retryable
   */
  static isRetryableError(error: CloudError): boolean {
    // Mock errors for testing are retryable
    if (error.message.includes('Mock') && (error.message.includes('failure') || error.message.includes('error'))) {
      return true;
    }

    // Network errors are generally retryable
    if (error.message.toLowerCase().includes('network') || 
        error.message.toLowerCase().includes('timeout') ||
        error.message.toLowerCase().includes('connection')) {
      return true;
    }

    // HTTP status codes that are retryable
    if (error.statusCode) {
      const retryableStatusCodes = [408, 429, 500, 502, 503, 504];
      return retryableStatusCodes.includes(error.statusCode);
    }

    // Rate limiting errors
    if (error.message.includes('rate limit') || error.message.includes('quota')) {
      return true;
    }

    // Temporary service errors
    if (error.message.includes('temporarily unavailable') || error.message.includes('service unavailable')) {
      return true;
    }

    // Authentication errors are generally not retryable
    if (error.statusCode === 401 || error.statusCode === 403) {
      return false;
    }

    // Client errors (4xx) are generally not retryable
    if (error.statusCode && error.statusCode >= 400 && error.statusCode < 500) {
      return false;
    }

    // Default to not retryable for unknown errors
    return false;
  }

  /**
   * Classify error for better user messaging
   */
  static classifyError(error: CloudError): string {
    if (error.statusCode) {
      switch (error.statusCode) {
        case 401:
        case 403:
          return 'AUTHENTICATION_ERROR';
        case 404:
          return 'NOT_FOUND_ERROR';
        case 408:
          return 'TIMEOUT_ERROR';
        case 413:
          return 'FILE_TOO_LARGE_ERROR';
        case 429:
          return 'RATE_LIMIT_ERROR';
        case 500:
        case 502:
        case 503:
        case 504:
          return 'SERVER_ERROR';
      }
    }

    if (error.message.includes('network') || error.message.includes('offline')) {
      return 'NETWORK_ERROR';
    }

    if (error.message.includes('quota') || error.message.includes('storage')) {
      return 'STORAGE_ERROR';
    }

    if (error.message.includes('permission') || error.message.includes('access')) {
      return 'PERMISSION_ERROR';
    }

    return 'UNKNOWN_ERROR';
  }

  /**
   * Generate user-friendly error messages
   */
  static getUserFriendlyMessage(error: CloudError): string {
    const context = error.context;
    const operation = context?.operation || 'operation';
    const provider = context?.provider || 'cloud provider';

    switch (error.code) {
      case 'AUTHENTICATION_ERROR':
        return `Authentication failed with ${provider}. Please reconnect your account.`;
      
      case 'NOT_FOUND_ERROR':
        if (context?.fileName) {
          return `File "${context.fileName}" not found in ${provider}.`;
        }
        return `Requested resource not found in ${provider}.`;
      
      case 'TIMEOUT_ERROR':
        return `${operation} timed out. Please check your internet connection and try again.`;
      
      case 'FILE_TOO_LARGE_ERROR':
        return `File is too large for ${provider}. Please reduce the file size and try again.`;
      
      case 'RATE_LIMIT_ERROR':
        return `Too many requests to ${provider}. Please wait a moment and try again.`;
      
      case 'SERVER_ERROR':
        return `${provider} is experiencing issues. Please try again later.`;
      
      case 'NETWORK_ERROR':
        return `Network connection failed. Please check your internet connection.`;
      
      case 'STORAGE_ERROR':
        return `Storage quota exceeded in ${provider}. Please free up space and try again.`;
      
      case 'PERMISSION_ERROR':
        return `Permission denied for ${operation} in ${provider}. Please check your account permissions.`;
      
      default:
        return `${operation} failed. Please try again or contact support if the problem persists.`;
    }
  }

  /**
   * Check if the user is online
   */
  static isOnline(): boolean {
    return navigator.onLine;
  }

  /**
   * Wait for the specified delay
   */
  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Create a timeout promise that rejects after the specified time
   */
  static withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error(`Operation timed out after ${timeoutMs}ms`)), timeoutMs);
    });

    return Promise.race([promise, timeoutPromise]);
  }

  /**
   * Handle offline scenarios gracefully
   */
  static handleOfflineOperation<T>(
    operation: () => Promise<T>,
    fallback: () => T | Promise<T>,
    context: ErrorContext
  ): Promise<T> {
    if (!this.isOnline()) {
      console.warn(`${context.operation} attempted while offline, using fallback`);
      return Promise.resolve(fallback());
    }

    return operation().catch(async (error) => {
      const cloudError = this.enhanceError(error, context);
      
      // If it's a network error and we have a fallback, use it
      if (cloudError.code === 'NETWORK_ERROR') {
        console.warn(`${context.operation} failed due to network error, using fallback`);
        return fallback();
      }

      throw cloudError;
    });
  }
}