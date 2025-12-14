// Web-only git manager
import { gitManager } from './gitManager';

// Export the web git manager directly
export const gitManagerPromise = Promise.resolve(gitManager);

// Export a getter for convenience
export async function getGitManager() {
  return gitManager;
}
