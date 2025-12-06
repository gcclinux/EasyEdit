// Dynamic export that selects the correct git manager based on environment

const isElectron = () => {
  if (typeof window === 'undefined') return false;
  return !!(window as any).electronAPI;
};

let gitManagerInstance: any = null;

async function initGitManager() {
  if (gitManagerInstance) return gitManagerInstance;

  if (isElectron()) {
    // Electron: use native git commands
    const { gitManagerElectron } = await import('./gitManagerElectron');
    gitManagerInstance = gitManagerElectron;
  } else {
    // Browser: use isomorphic-git with LightningFS
    const { gitManager } = await import('./gitManager');
    gitManagerInstance = gitManager;
  }

  return gitManagerInstance;
}

// Export a promise that resolves to the correct manager
export const gitManagerPromise = initGitManager();

// Also export a getter for convenience
export async function getGitManager() {
  return gitManagerPromise;
}
