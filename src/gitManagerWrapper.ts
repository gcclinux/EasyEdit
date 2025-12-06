// Wrapper that selects the correct git manager based on environment

const isElectron = () => {
  if (typeof window === 'undefined') return false;
  return !!(window as any).electronAPI;
};

let gitManagerInstance: any = null;

async function getGitManager() {
  if (gitManagerInstance) return gitManagerInstance;

  if (isElectron()) {
    const { gitManagerElectron } = await import('./gitManagerElectron');
    gitManagerInstance = gitManagerElectron;
  } else {
    const { gitManager } = await import('./gitManager');
    gitManagerInstance = gitManager;
  }

  return gitManagerInstance;
}

export { getGitManager };
