// Wrapper that selects the correct git manager based on environment
import { gitManager } from './gitManager';

const isElectron = () => {
  if (typeof window === 'undefined') return false;
  return !!(window as any).electronAPI;
};

let gitManagerInstance: any = null;

async function getGitManager() {
  if (gitManagerInstance) return gitManagerInstance;

  if (isElectron()) {
    // For Electron, use the web version (isomorphic-git) for now
    // The Electron-specific version would require different bundling
    gitManagerInstance = gitManager;
  } else {
    gitManagerInstance = gitManager;
  }

  return gitManagerInstance;
}

export { getGitManager };
