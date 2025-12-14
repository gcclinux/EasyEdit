// Git manager wrapper that chooses between web and Tauri implementations
import { gitManager } from './gitManager';

export async function getGitManager() {
  const isTauri = typeof window !== 'undefined' && (window as any).__TAURI_INTERNALS__;
  
  if (isTauri) {
    // Use Tauri Git manager
    const { TauriGitManager } = await import('./tauriGitManager');
    return new TauriGitManager();
  } else {
    // Use web Git manager
    return gitManager;
  }
}
