/**
 * Stub for Tauri Notification API
 * Used when the actual plugin is not available
 */

export async function sendNotification(options: string | { title: string; body?: string; icon?: string }): Promise<void> {
    console.log('[Tauri Stub] Notification sent:', options);
}

export async function isPermissionGranted(): Promise<boolean> {
    console.log('[Tauri Stub] Checking notification permission');
    return true;
}

export async function requestPermission(): Promise<string> {
    console.log('[Tauri Stub] Requesting notification permission');
    return 'granted';
}
