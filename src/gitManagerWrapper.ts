// Web-only git manager wrapper
import { gitManager } from './gitManager';

export function getGitManager() {
  return Promise.resolve(gitManager);
}
