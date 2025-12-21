import { Command } from '@tauri-apps/plugin-shell';

export class TauriGitManager {
  private repoDir: string | null = null;

  constructor() {
    // Try to restore repo directory from sessionStorage
    const savedRepoDir = sessionStorage.getItem('git_repo_dir');
    if (savedRepoDir) {
      this.repoDir = savedRepoDir;
      console.log('[TauriGitManager] Restored repo dir from session:', savedRepoDir);
    }
  }

  setRepoDir(dir: string): void {
    this.repoDir = dir;
    sessionStorage.setItem('git_repo_dir', dir);
    console.log('[TauriGitManager] Saved repo dir to session:', dir);
  }

  getRepoDir(): string | null {
    return this.repoDir;
  }

  // Clone a repository using git command
  async clone(url: string, targetDir: string, options?: { ref?: string; depth?: number }): Promise<void> {
    console.log('=== Tauri Git Clone Started ===');
    console.log('URL:', url);
    console.log('Target Dir:', targetDir);
    console.log('Options:', options);

    try {
      // Extract repo name from URL and append to target directory
      const repoName = url.split('/').pop()?.replace('.git', '') || 'repo';
      const fullTargetPath = `${targetDir}/${repoName}`;

      // Build git clone command
      const args = ['clone'];

      if (options?.depth) {
        args.push('--depth', options.depth.toString());
      }

      if (options?.ref) {
        args.push('--branch', options.ref);
      }

      args.push(url, fullTargetPath);

      console.log('Executing git command:', 'git', args.join(' '));

      // Execute git clone command
      const command = Command.create('git', args);
      const output = await command.execute();

      if (output.code !== 0) {
        throw new Error(`Git clone failed: ${output.stderr}`);
      }

      console.log('Git clone output:', output.stdout);
      this.setRepoDir(fullTargetPath);

      console.log('=== Tauri Git Clone Completed Successfully ===');
    } catch (error: any) {
      console.error('=== Tauri Git Clone Failed ===');
      console.error('Error:', error);

      let errorMessage = error.message || 'Unknown error';

      if (errorMessage.includes('Authentication failed') || errorMessage.includes('401')) {
        errorMessage = 'Authentication failed: This repository requires credentials. Please set up Git credentials first.';
      } else if (errorMessage.includes('Repository not found') || errorMessage.includes('404')) {
        errorMessage = 'Repository not found: Check that the URL is correct and the repository exists.';
      } else if (errorMessage.includes('Permission denied')) {
        errorMessage = 'Permission denied: You may not have access to this repository.';
      }

      throw new Error(`Failed to clone repository: ${errorMessage}`);
    }
  }

  // Get repository files (markdown files)
  async getRepoFiles(extensions: string[] = ['.md', '.markdown', '.txt']): Promise<string[]> {
    if (!this.repoDir) {
      throw new Error('No repository directory set');
    }

    try {
      const { readDirectory } = await import('./tauriFileHandler');
      const files = await readDirectory(this.repoDir);
      return files.filter(file => {
        const ext = file.toLowerCase();
        return extensions.some(extension => ext.endsWith(extension));
      });
    } catch (error) {
      throw new Error(`Failed to get repository files: ${(error as Error).message}`);
    }
  }

  // Read a file from the repository
  async readFile(filePath: string): Promise<string> {
    if (!this.repoDir) {
      throw new Error('No repository directory set');
    }

    try {
      const { readFileContent } = await import('./tauriFileHandler');
      // Use path as-is if it's already absolute, otherwise prepend repoDir
      const fullPath = filePath.startsWith('/') ? filePath : `${this.repoDir}/${filePath}`.replace(/\/+/g, '/');
      const content = await readFileContent(fullPath);

      if (content === null) {
        throw new Error('File not found or could not be read');
      }

      return content;
    } catch (error) {
      throw new Error(`Failed to read file: ${(error as Error).message}`);
    }
  }

  // Write a file to the repository
  async writeFile(filePath: string, content: string): Promise<void> {
    if (!this.repoDir) {
      throw new Error('No repository directory set');
    }

    try {
      const { writeFileContent } = await import('./tauriFileHandler');
      // Use path as-is if it's already absolute, otherwise prepend repoDir
      const fullPath = filePath.startsWith('/') ? filePath : `${this.repoDir}/${filePath}`.replace(/\/+/g, '/');
      const success = await writeFileContent(fullPath, content);

      if (!success) {
        throw new Error('Failed to write file');
      }
    } catch (error) {
      throw new Error(`Failed to write file: ${(error as Error).message}`);
    }
  }

  // Add file to staging area
  async add(filepath: string): Promise<void> {
    if (!this.repoDir) {
      throw new Error('No repository directory set');
    }

    try {
      const command = Command.create('git', ['add', filepath], {
        cwd: this.repoDir
      });
      const output = await command.execute();

      if (output.code !== 0) {
        throw new Error(`Git add failed: ${output.stderr}`);
      }

      console.log('[TauriGitManager] File staged successfully:', filepath);
    } catch (error) {
      throw new Error(`Failed to add file: ${(error as Error).message}`);
    }
  }

  // Commit changes
  async commit(message: string, author?: { name: string; email: string }): Promise<string> {
    if (!this.repoDir) {
      throw new Error('No repository directory set');
    }

    try {
      const args = ['commit', '-m', message];

      if (author) {
        args.push('--author', `${author.name} <${author.email}>`);
      }

      const command = Command.create('git', args, {
        cwd: this.repoDir
      });
      const output = await command.execute();

      if (output.code !== 0) {
        throw new Error(`Git commit failed: ${output.stderr}`);
      }

      console.log('[TauriGitManager] Commit successful');
      return output.stdout.trim();
    } catch (error) {
      throw new Error(`Failed to commit changes: ${(error as Error).message}`);
    }
  }

  // Push changes to remote
  async push(): Promise<void> {
    if (!this.repoDir) {
      throw new Error('No repository directory set');
    }

    try {
      const remotes = await this.getRemotes();
      const hasOrigin = remotes.includes('origin');
      const branch = await this.getCurrentBranch();

      const args = ['push'];
      if (hasOrigin) {
        console.log(`[TauriGitManager] Pushing to origin ${branch}...`);
        args.push('origin', branch);
      } else {
        console.log('[TauriGitManager] Pushing (no origin remote found)...');
      }

      const command = Command.create('git', args, {
        cwd: this.repoDir
      });
      const output = await command.execute();

      if (output.code !== 0) {
        throw new Error(`Git push failed: ${output.stderr}`);
      }

      console.log('[TauriGitManager] Push successful');
    } catch (error) {
      throw new Error(`Failed to push changes: ${(error as Error).message}`);
    }
  }

  // Pull changes from remote
  async pull(): Promise<void> {
    if (!this.repoDir) {
      throw new Error('No repository directory set');
    }

    try {
      const remotes = await this.getRemotes();
      const hasOrigin = remotes.includes('origin');
      const branch = await this.getCurrentBranch();

      const args = ['pull'];
      if (hasOrigin) {
        console.log(`[TauriGitManager] Pulling from origin ${branch}...`);
        args.push('origin', branch);
      } else {
        console.log('[TauriGitManager] Pulling (no origin remote found)...');
      }

      const command = Command.create('git', args, {
        cwd: this.repoDir
      });
      const output = await command.execute();

      if (output.code !== 0) {
        throw new Error(`Git pull failed: ${output.stderr}`);
      }

      console.log('[TauriGitManager] Pull successful');
    } catch (error) {
      throw new Error(`Failed to pull changes: ${(error as Error).message}`);
    }
  }

  // Fetch changes from remote
  async fetch(): Promise<void> {
    if (!this.repoDir) {
      throw new Error('No repository directory set');
    }

    try {
      const remotes = await this.getRemotes();
      const hasOrigin = remotes.includes('origin');

      const args = ['fetch'];
      if (hasOrigin) {
        console.log('[TauriGitManager] Fetching from origin...');
        args.push('origin');
      } else {
        console.log('[TauriGitManager] Fetching (no origin remote found)...');
      }

      const command = Command.create('git', args, {
        cwd: this.repoDir
      });
      const output = await command.execute();

      if (output.code !== 0) {
        throw new Error(`Git fetch failed: ${output.stderr}`);
      }

      console.log('[TauriGitManager] Fetch successful');
    } catch (error) {
      throw new Error(`Failed to fetch updates: ${(error as Error).message}`);
    }
  }

  // Get list of remotes
  async getRemotes(): Promise<string[]> {
    if (!this.repoDir) return [];
    try {
      const command = Command.create('git', ['remote'], {
        cwd: this.repoDir
      });
      const output = await command.execute();
      if (output.code !== 0) return [];
      return output.stdout.trim().split('\n').map(r => r.trim()).filter(Boolean);
    } catch (error) {
      console.error('[TauriGitManager] Failed to get remotes:', error);
      return [];
    }
  }

  // Check if current directory is a Git repo
  async isGitRepo(): Promise<boolean> {
    if (!this.repoDir) return false;
    try {
      const command = Command.create('git', ['rev-parse', '--is-inside-work-tree'], {
        cwd: this.repoDir
      });
      const output = await command.execute();
      const isRepo = output.code === 0 && output.stdout.trim() === 'true';
      console.log(`[TauriGitManager] Repo verification for ${this.repoDir}: ${isRepo}`);
      return isRepo;
    } catch (error) {
      console.error('[TauriGitManager] Repo verification failed:', error);
      return false;
    }
  }

  // Get current branch
  async getCurrentBranch(): Promise<string> {
    if (!this.repoDir) {
      throw new Error('No repository directory set');
    }

    try {
      const command = Command.create('git', ['branch', '--show-current'], {
        cwd: this.repoDir
      });
      const output = await command.execute();

      if (output.code !== 0) {
        throw new Error(`Git branch failed: ${output.stderr}`);
      }

      const branch = output.stdout.trim();
      if (branch) return branch;

      // Fallback: Try rev-parse for older Git versions or detached HEAD
      const fallbackCommand = Command.create('git', ['rev-parse', '--abbrev-ref', 'HEAD'], {
        cwd: this.repoDir
      });
      const fallbackOutput = await fallbackCommand.execute();
      if (fallbackOutput.code === 0) {
        const fallbackBranch = fallbackOutput.stdout.trim();
        if (fallbackBranch !== 'HEAD') return fallbackBranch;
      }

      return 'main';
    } catch (error) {
      console.warn('[TauriGitManager] Failed to get current branch, defaulting to main:', error);
      return 'main';
    }
  }

  // Get repository status
  async status(): Promise<{ modified: string[]; staged: string[]; untracked: string[] }> {
    if (!this.repoDir) {
      throw new Error('No repository directory set');
    }

    try {
      const command = Command.create('git', ['status', '--porcelain'], {
        cwd: this.repoDir
      });
      const output = await command.execute();

      if (output.code !== 0) {
        throw new Error(`Git status failed: ${output.stderr}`);
      }

      const result = {
        modified: [] as string[],
        staged: [] as string[],
        untracked: [] as string[]
      };

      const lines = output.stdout.trim().split('\n').filter(line => line.trim());

      for (const line of lines) {
        if (line.length < 4) continue;

        const x = line[0];
        const y = line[1];
        const file = line.substring(3);

        // ?? - Untracked
        if (x === '?' && y === '?') {
          result.untracked.push(file);
          continue;
        }

        // X column (Index/Staged)
        if (x === 'M' || x === 'A' || x === 'D' || x === 'R' || x === 'C') {
          result.staged.push(file);
        }

        // Y column (Worktree/Modified)
        if (y === 'M' || y === 'D') {
          result.modified.push(file);
        }
      }

      return result;
    } catch (error) {
      throw new Error(`Failed to get status: ${(error as Error).message}`);
    }
  }

  // Get commit log
  async log(count: number = 10): Promise<any[]> {
    if (!this.repoDir) {
      throw new Error('No repository directory set');
    }

    try {
      const command = Command.create('git', [
        'log',
        `--max-count=${count}`,
        '--pretty=format:%H|%s|%an|%ae|%at'
      ], {
        cwd: this.repoDir
      });
      const output = await command.execute();

      if (output.code !== 0) {
        throw new Error(`Git log failed: ${output.stderr}`);
      }

      const lines = output.stdout.trim().split('\n').filter(line => line.trim());

      return lines.map(line => {
        const [oid, message, authorName, authorEmail, timestamp] = line.split('|');
        return {
          oid,
          message,
          author: {
            name: authorName,
            email: authorEmail,
            timestamp: parseInt(timestamp) * 1000 // Convert to milliseconds
          }
        };
      });
    } catch (error) {
      throw new Error(`Failed to get commit log: ${(error as Error).message}`);
    }
  }

  // List all branches
  async listBranches(): Promise<string[]> {
    if (!this.repoDir) {
      throw new Error('No repository directory set');
    }

    try {
      const command = Command.create('git', ['branch', '--format=%(refname:short)'], {
        cwd: this.repoDir
      });
      const output = await command.execute();

      if (output.code !== 0) {
        throw new Error(`Git branch list failed: ${output.stderr}`);
      }

      return output.stdout.trim().split('\n').map(b => b.trim()).filter(Boolean);
    } catch (error) {
      throw new Error(`Failed to list branches: ${(error as Error).message}`);
    }
  }

  // Checkout a branch
  async checkout(ref: string): Promise<void> {
    if (!this.repoDir) {
      throw new Error('No repository directory set');
    }

    try {
      const command = Command.create('git', ['checkout', ref], {
        cwd: this.repoDir
      });
      const output = await command.execute();

      if (output.code !== 0) {
        throw new Error(`Git checkout failed: ${output.stderr}`);
      }

      console.log(`[TauriGitManager] Checked out branch: ${ref}`);
    } catch (error) {
      throw new Error(`Failed to checkout branch: ${(error as Error).message}`);
    }
  }

  // Placeholder methods for compatibility
  setCredentials(_credentials: any): void {
    // In Tauri, credentials are handled by the system Git
    console.log('[TauriGitManager] Credentials set (handled by system Git)');
  }

  clearCredentials(): void {
    console.log('[TauriGitManager] Credentials cleared (handled by system Git)');
  }

  async loadStoredCredentials(): Promise<boolean> {
    // In Tauri, credentials are handled by the system Git
    return true;
  }
}