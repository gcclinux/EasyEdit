import { execSync } from 'child_process';
import { gitCredentialManager, GitCredentials } from './gitCredentialManager';

export interface CloneOptions {
  depth?: number;
  singleBranch?: boolean;
  ref?: string;
}

export class GitManagerElectron {
  private repoDir: string | null = null;
  private credentials: GitCredentials | null = null;

  setRepoDir(dir: string): void {
    this.repoDir = dir;
  }

  getRepoDir(): string | null {
    return this.repoDir;
  }

  setCredentials(creds: GitCredentials): void {
    this.credentials = creds;
  }

  clearCredentials(): void {
    this.credentials = null;
  }

  async loadStoredCredentials(remoteUrl?: string): Promise<boolean> {
    try {
      if (!gitCredentialManager.isUnlocked()) {
        return false;
      }
      const creds = await gitCredentialManager.getCredentials(remoteUrl);
      if (creds) {
        this.credentials = creds;
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to load credentials:', error);
      return false;
    }
  }

  async clone(url: string, dir: string, options?: CloneOptions): Promise<void> {
    console.log('=== Git Clone Started (Electron) ===');
    console.log('URL:', url);
    console.log('Target Dir:', dir);

    try {
      let cmd = `git clone`;
      
      if (options?.singleBranch) {
        cmd += ` --single-branch`;
      }
      if (options?.depth) {
        cmd += ` --depth ${options.depth}`;
      }
      if (options?.ref) {
        cmd += ` --branch ${options.ref}`;
      }

      cmd += ` "${url}" "${dir}"`;

      console.log('Executing:', cmd);
      execSync(cmd, { stdio: 'inherit' });
      
      this.setRepoDir(dir);
      console.log('=== Git Clone Completed Successfully ===');
    } catch (error: any) {
      console.error('=== Git Clone Failed ===');
      console.error('Error:', error.message);
      throw new Error(`Failed to clone repository: ${error.message}`);
    }
  }

  async pull(): Promise<void> {
    if (!this.repoDir) throw new Error('No repository directory set');
    try {
      execSync('git pull', { cwd: this.repoDir, stdio: 'inherit' });
    } catch (error: any) {
      throw new Error(`Failed to pull: ${error.message}`);
    }
  }

  async push(): Promise<void> {
    if (!this.repoDir) throw new Error('No repository directory set');
    try {
      execSync('git push', { cwd: this.repoDir, stdio: 'inherit' });
    } catch (error: any) {
      throw new Error(`Failed to push: ${error.message}`);
    }
  }

  async fetch(): Promise<void> {
    if (!this.repoDir) throw new Error('No repository directory set');
    try {
      execSync('git fetch', { cwd: this.repoDir, stdio: 'inherit' });
    } catch (error: any) {
      throw new Error(`Failed to fetch: ${error.message}`);
    }
  }

  async add(filepath: string): Promise<void> {
    if (!this.repoDir) throw new Error('No repository directory set');
    try {
      execSync(`git add "${filepath}"`, { cwd: this.repoDir });
    } catch (error: any) {
      throw new Error(`Failed to add file: ${error.message}`);
    }
  }

  async commit(message: string, author?: { name: string; email: string }): Promise<string> {
    if (!this.repoDir) throw new Error('No repository directory set');
    try {
      const cmd = `git commit -m "${message}"`;
      execSync(cmd, { cwd: this.repoDir });
      return 'committed';
    } catch (error: any) {
      throw new Error(`Failed to commit: ${error.message}`);
    }
  }

  async getCurrentBranch(): Promise<string> {
    if (!this.repoDir) throw new Error('No repository directory set');
    try {
      const branch = execSync('git rev-parse --abbrev-ref HEAD', { cwd: this.repoDir }).toString().trim();
      return branch || 'main';
    } catch {
      return 'main';
    }
  }

  async listBranches(): Promise<string[]> {
    if (!this.repoDir) throw new Error('No repository directory set');
    try {
      const output = execSync('git branch -a', { cwd: this.repoDir }).toString();
      return output.split('\n').map(b => b.trim()).filter(Boolean);
    } catch {
      return [];
    }
  }

  async checkout(ref: string): Promise<void> {
    if (!this.repoDir) throw new Error('No repository directory set');
    try {
      execSync(`git checkout "${ref}"`, { cwd: this.repoDir });
    } catch (error: any) {
      throw new Error(`Failed to checkout: ${error.message}`);
    }
  }

  async log(count: number = 10): Promise<any[]> {
    if (!this.repoDir) throw new Error('No repository directory set');
    try {
      const output = execSync(`git log --oneline -n ${count}`, { cwd: this.repoDir }).toString();
      return output.split('\n').filter(Boolean).map(line => ({ message: line }));
    } catch {
      return [];
    }
  }

  async status(): Promise<any> {
    if (!this.repoDir) throw new Error('No repository directory set');
    return { modified: [], staged: [], untracked: [] };
  }

  async getRepoFiles(extensions?: string[]): Promise<string[]> {
    return [];
  }

  async readFile(filePath: string): Promise<string> {
    return '';
  }

  async writeFile(filePath: string, content: string): Promise<void> {
  }

  async isGitRepo(dir: string): Promise<boolean> {
    try {
      execSync('git rev-parse --git-dir', { cwd: dir });
      return true;
    } catch {
      return false;
    }
  }

  async init(dir: string, initialCommit?: boolean): Promise<void> {
    try {
      execSync('git init', { cwd: dir });
      this.repoDir = dir;
    } catch (error: any) {
      throw new Error(`Failed to init: ${error.message}`);
    }
  }

  async createGitignore(dir: string, template?: string): Promise<void> {
  }
}

export const gitManagerElectron = new GitManagerElectron();
