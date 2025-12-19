/**
 * Cross-platform browser launcher for OAuth URLs
 * Handles opening URLs in the system default browser across Windows, macOS, and Linux
 */

import { Command } from '@tauri-apps/plugin-shell';

// Extend Window interface for Tauri
declare global {
  interface Window {
    __TAURI__?: any;
  }
}

export class BrowserLauncher {
  /**
   * Open URL in system default browser
   * @param url The URL to open
   * @throws Error if browser launch fails on all platforms
   */
  async openUrl(url: string): Promise<void> {
    if (!url || typeof url !== 'string') {
      throw new Error('Invalid URL provided');
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      throw new Error('Invalid URL format');
    }

    const platform = this.detectPlatform();
    
    try {
      switch (platform) {
        case 'windows':
          await this.openWindows(url);
          break;
        case 'macos':
          await this.openMacOS(url);
          break;
        case 'linux':
          await this.openLinux(url);
          break;
        default:
          throw new Error(`Unsupported platform: ${platform}`);
      }
    } catch (error) {
      // Fallback: try generic approaches
      await this.tryFallbackMethods(url, platform);
    }
  }
  
  /**
   * Detect current platform
   * @returns Platform identifier
   */
  private detectPlatform(): 'windows' | 'macos' | 'linux' {
    if (typeof window !== 'undefined' && window.__TAURI__) {
      // In Tauri environment, use navigator.platform or userAgent
      const platform = navigator.platform.toLowerCase();
      const userAgent = navigator.userAgent.toLowerCase();
      
      if (platform.includes('win') || userAgent.includes('windows')) {
        return 'windows';
      } else if (platform.includes('mac') || userAgent.includes('mac')) {
        return 'macos';
      } else {
        return 'linux';
      }
    }
    
    // Fallback for Node.js environment (testing)
    if (typeof process !== 'undefined') {
      const platform = process.platform;
      switch (platform) {
        case 'win32':
          return 'windows';
        case 'darwin':
          return 'macos';
        default:
          return 'linux';
      }
    }
    
    // Default fallback
    return 'linux';
  }
  
  /**
   * Open browser on Windows
   * @param url The URL to open
   */
  private async openWindows(url: string): Promise<void> {
    try {
      // Try using start command (most reliable on Windows)
      const command = Command.create('cmd', ['/c', 'start', '', url]);
      await command.execute();
    } catch (error) {
      // Fallback to explorer
      try {
        const command = Command.create('explorer', [url]);
        await command.execute();
      } catch (fallbackError) {
        throw new Error(`Failed to open browser on Windows: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  }
  
  /**
   * Open browser on macOS
   * @param url The URL to open
   */
  private async openMacOS(url: string): Promise<void> {
    try {
      // Use the 'open' command which is standard on macOS
      const command = Command.create('open', [url]);
      await command.execute();
    } catch (error) {
      throw new Error(`Failed to open browser on macOS: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  /**
   * Open browser on Linux
   * @param url The URL to open
   */
  private async openLinux(url: string): Promise<void> {
    // Try common Linux browser launchers in order of preference
    const launchers = ['xdg-open', 'gnome-open', 'kde-open', 'firefox', 'chromium', 'google-chrome'];
    
    for (const launcher of launchers) {
      try {
        const command = Command.create(launcher, [url]);
        await command.execute();
        return; // Success, exit early
      } catch {
        // Continue to next launcher
        continue;
      }
    }
    
    throw new Error('Failed to open browser on Linux: No suitable browser launcher found');
  }
  
  /**
   * Try fallback methods when primary platform-specific methods fail
   * @param url The URL to open
   * @param platform The detected platform
   */
  private async tryFallbackMethods(url: string, platform: string): Promise<void> {
    const fallbackCommands = [
      // Generic commands that might work across platforms
      ['xdg-open', [url]], // Linux standard
      ['open', [url]], // macOS standard
      ['start', [url]], // Windows (might work without cmd /c)
    ];
    
    for (const [cmd, args] of fallbackCommands) {
      try {
        const command = Command.create(cmd as string, args as string[]);
        await command.execute();
        return; // Success
      } catch {
        // Continue to next fallback
        continue;
      }
    }
    
    // If all fallbacks fail, throw a comprehensive error
    throw new Error(
      `Failed to open browser on ${platform}. ` +
      'Please manually copy and paste the URL into your browser: ' + url
    );
  }
}