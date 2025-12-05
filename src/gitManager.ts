import git from 'isomorphic-git';
import { gitCredentialManager, GitCredentials } from './gitCredentialManager';

// Browser-compatible file system using LightningFS
let fs: any = null;
let http: any = null;
let path: any = null;
let initialized = false;

// Detect environment
const isBrowser = () => typeof window !== 'undefined' && !(window as any).electronAPI;

// Initialize modules based on environment
async function initializeModules() {
  if (initialized) return;
  
  if (isBrowser()) {
    // Browser environment - use LightningFS
    const LightningFS = (await import('@isomorphic-git/lightning-fs')).default;
    fs = new LightningFS('fs');
    http = (await import('isomorphic-git/http/web')).default;
    
    // Simple path implementation for browser
    path = {
      join: (...args: string[]) => args.filter(Boolean).join('/').replace(/\/+/g, '/'),
      relative: (from: string, to: string) => {
        const fromParts = from.split('/').filter(Boolean);
        const toParts = to.split('/').filter(Boolean);
        let i = 0;
        while (i < fromParts.length && i < toParts.length && fromParts[i] === toParts[i]) {
          i++;
        }
        return toParts.slice(i).join('/');
      },
      dirname: (p: string) => {
        const parts = p.split('/').filter(Boolean);
        parts.pop();
        return parts.join('/') || '/';
      },
      basename: (p: string) => {
        const parts = p.split('/').filter(Boolean);
        return parts[parts.length - 1] || '';
      },
      extname: (p: string) => {
        const base = p.split('/').pop() || '';
        const dotIndex = base.lastIndexOf('.');
        return dotIndex > 0 ? base.substring(dotIndex) : '';
      }
    };
  } else {
    // Node.js/Electron environment
    fs = await import('fs');
    http = (await import('isomorphic-git/http/node')).default;
    path = await import('path');
  }
  
  initialized = true;
}

export interface CloneOptions {
  depth?: number;
  singleBranch?: boolean;
  ref?: string;
}

export interface GitStatus {
  modified: string[];
  staged: string[];
  untracked: string[];
}

export interface Commit {
  oid: string;
  message: string;
  author: {
    name: string;
    email: string;
    timestamp: number;
  };
}

export class GitManager {
  private repoDir: string | null = null;
  private credentials: GitCredentials | null = null;
  private dirHandle: any = null; // For web File System Access API

  constructor() {
    // Try to restore repo directory from sessionStorage
    if (isBrowser()) {
      const savedRepoDir = sessionStorage.getItem('git_repo_dir');
      if (savedRepoDir) {
        this.repoDir = savedRepoDir;
        console.log('[gitManager] Restored repo dir from session:', savedRepoDir);
      }
    }
  }

  /**
   * Set the directory handle for web File System Access API
   */
  setDirHandle(handle: any) {
    this.dirHandle = handle;
  }

  /**
   * Load credentials from credential manager
   */
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

  /**
   * Set the current repository directory
   */
  setRepoDir(dir: string): void {
    this.repoDir = dir;
    // Persist to sessionStorage in browser
    if (isBrowser()) {
      sessionStorage.setItem('git_repo_dir', dir);
      console.log('[gitManager] Saved repo dir to session:', dir);
    }
  }

  /**
   * Get the current repository directory
   */
  getRepoDir(): string | null {
    return this.repoDir;
  }

  /**
   * Set credentials for authentication
   */
  setCredentials(creds: GitCredentials): void {
    this.credentials = creds;
  }

  /**
   * Clear stored credentials
   */
  clearCredentials(): void {
    this.credentials = null;
  }

  /**
   * Clone a repository
   */
  async clone(url: string, dir: string, options?: CloneOptions): Promise<void> {
    await initializeModules();
    
    console.log('=== Git Clone Started ===');
    console.log('URL:', url);
    console.log('Target Dir:', dir);
    console.log('Is Browser:', isBrowser());
    console.log('Has dirHandle:', !!this.dirHandle);
    console.log('Options:', options);
    
    try {
      // Extract repo name from URL for subdirectory
      const repoName = url.split('/').pop()?.replace('.git', '') || 'repo';
      console.log('Repo name extracted:', repoName);
      
      // Create subdirectory with repo name
      const cloneDir = isBrowser() ? `/${repoName}` : path.join(dir, repoName);
      console.log('Clone Dir (with repo subdirectory):', cloneDir);
      
      // In browser, clean up any existing repo data in LightningFS
      if (isBrowser()) {
        console.log('Cleaning up existing LightningFS data for:', cloneDir);
        try {
          await this.recursiveDelete(cloneDir);
          console.log('Cleanup completed');
        } catch (e) {
          console.log('No existing data to clean up');
        }
      }
      
      const cloneOptions: any = {
        fs,
        http,
        dir: cloneDir,
        url,
        singleBranch: options?.singleBranch ?? true,
        depth: options?.depth ?? 1,
      };
      
      // In browser, add CORS mode
      if (isBrowser()) {
        cloneOptions.corsProxy = 'https://cors.isomorphic-git.org';
        console.log('Using CORS proxy:', cloneOptions.corsProxy);
      }

      // Add ref if specified
      if (options?.ref) {
        cloneOptions.ref = options.ref;
        console.log('Using ref:', options.ref);
      }

      // Add credentials if available
      if (this.credentials) {
        console.log('Using stored credentials for:', this.credentials.username);
        cloneOptions.onAuth = () => ({
          username: this.credentials!.username,
          password: this.credentials!.token,
        });
      } else {
        console.log('No credentials available - attempting anonymous clone');
      }

      console.log('Starting git.clone()...');
      await git.clone(cloneOptions);
      console.log('git.clone() completed successfully');
      
      this.setRepoDir(cloneDir);
      
      // In browser, sync files to File System Access API directory
      if (isBrowser() && this.dirHandle) {
        console.log('Starting file sync to File System Access API...');
        await this.syncToFileSystem(cloneDir, this.dirHandle, repoName);
        console.log('File sync completed');
      }
      
      console.log('=== Git Clone Completed Successfully ===');
    } catch (error: any) {
      console.error('=== Git Clone Failed ===');
      console.error('Error details:', error);
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      // Provide more helpful error messages
      let errorMessage = error.message || 'Unknown error';
      
      if (errorMessage.includes('401') || errorMessage.includes('authentication')) {
        errorMessage = 'Authentication failed (HTTP 401): This is a private repository. Please set up Git credentials first (Git menu → Setup Credentials) or use a public repository.';
      } else if (errorMessage.includes('404')) {
        errorMessage = 'Repository not found (HTTP 404): Check that the URL is correct and the repository exists.';
      } else if (errorMessage.includes('CORS')) {
        errorMessage = 'CORS error: The Git server needs to allow cross-origin requests. Try using GitHub, GitLab, or Bitbucket which support CORS.';
      } else if (errorMessage.includes('fetch')) {
        errorMessage = 'Network error: Unable to connect to the repository. Check the URL and your internet connection.';
      }
      
      throw new Error(`Failed to clone repository: ${errorMessage}`);
    }
  }

  /**
   * Sync LightningFS files to actual File System (browser only)
   */
  private async syncToFileSystem(lightningPath: string, dirHandle: any, repoName: string): Promise<void> {
    if (!isBrowser()) return;
    
    console.log('=== Starting File System Sync ===');
    console.log('Lightning path:', lightningPath);
    console.log('Repo name:', repoName);
    console.log('Dir handle:', dirHandle);
    
    try {
      // Create repo subdirectory in the selected folder
      const repoHandle = await dirHandle.getDirectoryHandle(repoName, { create: true });
      console.log('Created repo subdirectory:', repoName);
      
      // Get all files from LightningFS (including hidden files)
      console.log('Listing all files in LightningFS...');
      const files = await this.listAllFiles(lightningPath);
      console.log('Found', files.length, 'files to sync');
      
      // Write each file to the actual file system
      for (const filePath of files) {
        const relativePath = filePath.replace(lightningPath, '').replace(/^\//, '');
        if (!relativePath) {
          console.log('Skipping empty path');
          continue;
        }
        
        console.log('Syncing file:', relativePath);
        
        try {
          const content = await fs.promises.readFile(filePath);
          
          // Navigate to create subdirectories if needed
          const pathParts = relativePath.split('/');
          let currentHandle = repoHandle;
          
          for (let i = 0; i < pathParts.length - 1; i++) {
            if (pathParts[i]) {
              try {
                currentHandle = await currentHandle.getDirectoryHandle(pathParts[i], { create: true });
                console.log('  Created/accessed directory:', pathParts[i]);
              } catch (e) {
                console.error('  Error creating directory:', pathParts[i], e);
              }
            }
          }
          
          // Write the file
          const fileName = pathParts[pathParts.length - 1];
          if (fileName) {
            const fileHandle = await currentHandle.getFileHandle(fileName, { create: true });
            const writable = await fileHandle.createWritable();
            await writable.write(content);
            await writable.close();
            console.log('  ✓ Synced:', fileName);
          }
        } catch (e) {
          console.error('  Error syncing file:', relativePath, e);
        }
      }
      
      console.log('=== File System Sync Completed ===');
    } catch (error) {
      console.error('=== File System Sync Failed ===');
      console.error('Error syncing to file system:', error);
      throw new Error(`Failed to sync files to directory: ${error}`);
    }
  }

  /**
   * List all files in LightningFS directory recursively
   */
  private async listAllFiles(dir: string): Promise<string[]> {
    const files: string[] = [];
    
    try {
      const entries = await fs.promises.readdir(dir);
      
      for (const entry of entries) {
        const fullPath = `${dir}/${entry}`;
        try {
          const stat = await fs.promises.stat(fullPath);
          if (stat.isDirectory()) {
            const subFiles = await this.listAllFiles(fullPath);
            files.push(...subFiles);
          } else {
            files.push(fullPath);
          }
        } catch (e) {
          // Skip errors for individual files
        }
      }
    } catch (error) {
      // Directory doesn't exist or can't be read
    }
    
    return files;
  }

  /**
   * Recursively delete a directory (browser only)
   */
  private async recursiveDelete(dir: string): Promise<void> {
    if (!isBrowser()) return;
    
    try {
      const entries = await fs.promises.readdir(dir);
      
      for (const entry of entries) {
        const fullPath = `${dir}/${entry}`;
        try {
          const stat = await fs.promises.stat(fullPath);
          if (stat.isDirectory()) {
            await this.recursiveDelete(fullPath);
            await fs.promises.rmdir(fullPath);
          } else {
            await fs.promises.unlink(fullPath);
          }
        } catch (e) {
          console.warn('Error deleting:', fullPath, e);
        }
      }
      
      // Delete the directory itself
      await fs.promises.rmdir(dir);
    } catch (error) {
      // Directory might not exist
      console.warn('Could not delete directory:', dir, error);
    }
  }

  /**
   * Pull latest changes from remote
   */
  async pull(): Promise<void> {
    await initializeModules();
    
    if (!this.repoDir) {
      throw new Error('No repository directory set');
    }

    try {
      const pullOptions: any = {
        fs,
        http,
        dir: this.repoDir,
        ref: await this.getCurrentBranch(),
        singleBranch: true,
        author: {
          name: 'EasyEdit User',
          email: 'user@easyedit.app',
        },
      };

      if (this.credentials) {
        pullOptions.onAuth = () => ({
          username: this.credentials!.username,
          password: this.credentials!.token,
        });
      }

      await git.pull(pullOptions);
    } catch (error) {
      throw new Error(`Failed to pull changes: ${(error as Error).message}`);
    }
  }

  /**
   * Push changes to remote
   */
  async push(): Promise<void> {
    await initializeModules();
    
    if (!this.repoDir) {
      throw new Error('No repository directory set');
    }

    console.log('=== Git Push Started ===');
    console.log('Repo dir:', this.repoDir);
    console.log('Is Browser:', isBrowser());
    console.log('Has credentials:', !!this.credentials);

    try {
      const currentBranch = await this.getCurrentBranch();
      console.log('Current branch:', currentBranch);
      
      const pushOptions: any = {
        fs,
        http,
        dir: this.repoDir,
        remote: 'origin',
        ref: currentBranch,
      };

      // In browser, add CORS mode
      if (isBrowser()) {
        pushOptions.corsProxy = 'https://cors.isomorphic-git.org';
        console.log('Using CORS proxy:', pushOptions.corsProxy);
      }

      if (this.credentials) {
        console.log('Using credentials for push:', this.credentials.username);
        pushOptions.onAuth = () => ({
          username: this.credentials!.username,
          password: this.credentials!.token,
        });
      } else {
        console.warn('No credentials available for push');
      }

      console.log('Calling git.push()...');
      await git.push(pushOptions);
      console.log('=== Git Push Completed Successfully ===');
    } catch (error: any) {
      console.error('=== Git Push Failed ===');
      console.error('Error:', error);
      console.error('Error message:', error.message);
      
      let errorMessage = error.message || 'Unknown error';
      
      if (errorMessage.includes('401') || errorMessage.includes('authentication')) {
        errorMessage = 'Authentication failed: Please check your Git credentials.';
      } else if (errorMessage.includes('403')) {
        errorMessage = 'Permission denied: You may not have write access to this repository.';
      } else if (errorMessage.includes('CORS')) {
        errorMessage = 'CORS error: Unable to push to repository. Try using GitHub, GitLab, or Bitbucket.';
      }
      
      throw new Error(`Failed to push changes: ${errorMessage}`);
    }
  }

  /**
   * Fetch from remote
   */
  async fetch(): Promise<void> {
    await initializeModules();
    
    if (!this.repoDir) {
      throw new Error('No repository directory set');
    }

    try {
      const fetchOptions: any = {
        fs,
        http,
        dir: this.repoDir,
        remote: 'origin',
      };

      if (this.credentials) {
        fetchOptions.onAuth = () => ({
          username: this.credentials!.username,
          password: this.credentials!.token,
        });
      }

      await git.fetch(fetchOptions);
    } catch (error) {
      throw new Error(`Failed to fetch from remote: ${(error as Error).message}`);
    }
  }

  /**
   * Add file to staging area
   */
  /**
   * Add/stage a file
   */
  async add(filepath: string): Promise<void> {
    await initializeModules();
    
    if (!this.repoDir) {
      throw new Error('No repository directory set');
    }

    console.log('[gitManager] Staging file:', filepath);
    console.log('[gitManager] Repo dir:', this.repoDir);

    try {
      await git.add({
        fs,
        dir: this.repoDir,
        filepath,
      });
      console.log('[gitManager] File staged successfully:', filepath);
    } catch (error) {
      console.error('[gitManager] Failed to stage file:', error);
      throw new Error(`Failed to add file: ${(error as Error).message}`);
    }
  }

  /**
   * Commit changes
   */
  async commit(message: string, author?: { name: string; email: string }): Promise<string> {
    await initializeModules();
    
    if (!this.repoDir) {
      throw new Error('No repository directory set');
    }

    console.log('[gitManager] Committing changes...');
    console.log('[gitManager] Message:', message);
    console.log('[gitManager] Repo dir:', this.repoDir);

    try {
      const commitAuthor = author || {
        name: 'EasyEdit User',
        email: 'user@easyedit.app',
      };

      console.log('[gitManager] Author:', commitAuthor);

      const sha = await git.commit({
        fs,
        dir: this.repoDir,
        message,
        author: commitAuthor,
      });

      console.log('[gitManager] Commit successful, SHA:', sha);
      return sha;
    } catch (error) {
      console.error('[gitManager] Commit failed:', error);
      throw new Error(`Failed to commit changes: ${(error as Error).message}`);
    }
  }

  /**
   * Get repository status
   */
  async status(): Promise<GitStatus> {
    await initializeModules();
    
    if (!this.repoDir) {
      throw new Error('No repository directory set');
    }

    try {
      const result: GitStatus = {
        modified: [],
        staged: [],
        untracked: [],
      };

      // Get all files in the repository
      const files = await this.getAllFiles(this.repoDir);

      for (const file of files) {
        const filepath = path.relative(this.repoDir, file);
        const status = await git.status({
          fs,
          dir: this.repoDir,
          filepath,
        });

        if (status === 'modified') {
          result.modified.push(filepath);
        } else if (status === 'added') {
          result.staged.push(filepath);
        } else if (status === '*added') {
          result.untracked.push(filepath);
        }
      }

      return result;
    } catch (error) {
      throw new Error(`Failed to get status: ${(error as Error).message}`);
    }
  }

  /**
   * Get current branch name
   */
  async getCurrentBranch(): Promise<string> {
    await initializeModules();
    
    if (!this.repoDir) {
      throw new Error('No repository directory set');
    }

    try {
      const branch = await git.currentBranch({
        fs,
        dir: this.repoDir,
        fullname: false,
      });

      return branch || 'main';
    } catch (error) {
      throw new Error(`Failed to get current branch: ${(error as Error).message}`);
    }
  }

  /**
   * List all branches
   */
  async listBranches(): Promise<string[]> {
    if (!this.repoDir) {
      throw new Error('No repository directory set');
    }

    try {
      const branches = await git.listBranches({
        fs,
        dir: this.repoDir,
      });

      return branches;
    } catch (error) {
      throw new Error(`Failed to list branches: ${(error as Error).message}`);
    }
  }

  /**
   * Checkout a branch
   */
  async checkout(ref: string): Promise<void> {
    if (!this.repoDir) {
      throw new Error('No repository directory set');
    }

    try {
      await git.checkout({
        fs,
        dir: this.repoDir,
        ref,
      });
    } catch (error) {
      throw new Error(`Failed to checkout branch: ${(error as Error).message}`);
    }
  }

  /**
   * Get commit log
   */
  async log(count: number = 10): Promise<Commit[]> {
    await initializeModules();
    
    if (!this.repoDir) {
      throw new Error('No repository directory set');
    }

    try {
      const commits = await git.log({
        fs,
        dir: this.repoDir,
        depth: count,
      });

      return commits.map((commit) => ({
        oid: commit.oid,
        message: commit.commit.message,
        author: {
          name: commit.commit.author.name,
          email: commit.commit.author.email,
          timestamp: commit.commit.author.timestamp,
        },
      }));
    } catch (error) {
      throw new Error(`Failed to get commit log: ${(error as Error).message}`);
    }
  }

  /**
   * Get all markdown files in the repository
   */
  async getRepoFiles(extensions: string[] = ['.md', '.markdown']): Promise<string[]> {
    await initializeModules();
    
    if (!this.repoDir) {
      throw new Error('No repository directory set');
    }

    try {
      const allFiles = await this.getAllFiles(this.repoDir);
      const markdownFiles = allFiles.filter((file) => {
        const ext = path.extname(file).toLowerCase();
        return extensions.includes(ext);
      });

      // Return relative paths
      return markdownFiles.map((file) => path.relative(this.repoDir!, file));
    } catch (error) {
      throw new Error(`Failed to get repository files: ${(error as Error).message}`);
    }
  }

  /**
   * Helper function to recursively get all files in a directory
   */
  private async getAllFiles(dir: string): Promise<string[]> {
    await initializeModules();
    
    const files: string[] = [];

    async function traverse(currentDir: string) {
      try {
        const entries = await fs.promises.readdir(currentDir);

        for (const entry of entries) {
          // Skip .git directory
          if (entry === '.git') continue;

          const fullPath = path.join(currentDir, entry);

          try {
            const stats = await fs.promises.stat(fullPath);
            if (stats.isDirectory()) {
              await traverse(fullPath);
            } else if (stats.isFile()) {
              files.push(fullPath);
            }
          } catch (e) {
            // Skip entries that can't be accessed
            console.warn('Could not access:', fullPath, e);
          }
        }
      } catch (e) {
        console.warn('Could not read directory:', currentDir, e);
      }
    }

    await traverse(dir);
    return files;
  }

  /**
   * Read a file from the repository
   */
  async readFile(filePath: string): Promise<string> {
    await initializeModules();
    
    if (!this.repoDir) {
      throw new Error('No repository directory set');
    }

    try {
      const fullPath = path.join(this.repoDir, filePath);
      console.log('[gitManager] Reading file:', fullPath);
      const content = await fs.promises.readFile(fullPath, 'utf8');
      console.log('[gitManager] File read successfully, length:', content.length);
      return content;
    } catch (error) {
      console.error('[gitManager] Failed to read file:', error);
      throw new Error(`Failed to read file: ${(error as Error).message}`);
    }
  }

  /**
   * Write a file to the repository
   */
  async writeFile(filePath: string, content: string): Promise<void> {
    await initializeModules();
    
    if (!this.repoDir) {
      throw new Error('No repository directory set');
    }

    try {
      const fullPath = path.join(this.repoDir, filePath);
      console.log('[gitManager] Writing file:', fullPath);
      
      // Ensure directory exists
      const dir = path.dirname(fullPath);
      try {
        await fs.promises.mkdir(dir, { recursive: true });
      } catch (e) {
        // Directory might already exist
      }
      
      // Write to LightningFS (or disk in Electron)
      await fs.promises.writeFile(fullPath, content, 'utf8');
      console.log('[gitManager] File written successfully to LightningFS/disk');
      
      // In browser, also sync to File System Access API
      if (isBrowser() && this.dirHandle) {
        console.log('[gitManager] Syncing file to File System Access API...');
        await this.syncSingleFileToFileSystem(filePath, content);
        console.log('[gitManager] File synced to actual file system');
      }
    } catch (error) {
      console.error('[gitManager] Failed to write file:', error);
      throw new Error(`Failed to write file: ${(error as Error).message}`);
    }
  }

  /**
   * Sync a single file to File System Access API (browser only)
   */
  private async syncSingleFileToFileSystem(filePath: string, content: string): Promise<void> {
    if (!isBrowser() || !this.dirHandle) return;
    
    try {
      // Extract repo name from repoDir (e.g., /repoName -> repoName)
      const repoName = this.repoDir?.split('/').filter(Boolean)[0] || '';
      
      // Get repo subdirectory handle
      const repoHandle = await this.dirHandle.getDirectoryHandle(repoName, { create: true });
      
      // Navigate to file location
      const pathParts = filePath.split('/').filter(Boolean);
      let currentHandle = repoHandle;
      
      for (let i = 0; i < pathParts.length - 1; i++) {
        if (pathParts[i]) {
          currentHandle = await currentHandle.getDirectoryHandle(pathParts[i], { create: true });
        }
      }
      
      // Write the file
      const fileName = pathParts[pathParts.length - 1];
      if (fileName) {
        const fileHandle = await currentHandle.getFileHandle(fileName, { create: true });
        const writable = await fileHandle.createWritable();
        await writable.write(content);
        await writable.close();
        console.log('[gitManager] Synced file to File System:', filePath);
      }
    } catch (error) {
      console.error('[gitManager] Failed to sync file to File System:', error);
      // Don't throw - file is already saved to LightningFS which is what matters for git
    }
  }

  /**
   * Check if a directory is a git repository
   */
  async isGitRepo(dir: string): Promise<boolean> {
    await initializeModules();
    
    try {
      const gitDir = path.join(dir, '.git');
      const stats = await fs.promises.stat(gitDir);
      return stats.isDirectory();
    } catch {
      return false;
    }
  }

  /**
   * Initialize a new git repository
   */
  async init(dir: string, initialCommit: boolean = true): Promise<void> {
    await initializeModules();
    
    try {
      // Initialize the repository
      await git.init({
        fs,
        dir,
        defaultBranch: 'main'
      });

      this.repoDir = dir;

      // Create initial commit if requested
      if (initialCommit) {
        // Create a README.md file
        const readmePath = path.join(dir, 'README.md');
        const readmeContent = `# New Repository\n\nInitialized with EasyEdit\n`;
        await fs.promises.writeFile(readmePath, readmeContent, 'utf-8');

        // Stage the README
        await this.add('README.md');

        // Commit
        await this.commit('Initial commit', {
          name: 'EasyEdit User',
          email: 'user@easyedit.app'
        });
      }
    } catch (error) {
      throw new Error(`Failed to initialize repository: ${(error as Error).message}`);
    }
  }

  /**
   * Create a .gitignore file with common patterns
   */
  async createGitignore(dir: string, template: 'node' | 'python' | 'general' = 'general'): Promise<void> {
    await initializeModules();
    
    const templates = {
      node: `# Node.js
node_modules/
npm-debug.log
yarn-error.log
.pnpm-debug.log
package-lock.json
yarn.lock
pnpm-lock.yaml

# Environment
.env
.env.local
.env.*.local

# Build output
dist/
build/
*.log

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db
`,
      python: `# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
env/
venv/
ENV/
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
*.egg-info/
.installed.cfg
*.egg

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db
`,
      general: `# Dependencies
node_modules/
vendor/

# Build output
dist/
build/
*.log

# Environment
.env
.env.local

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db
*.bak
`,
    };

    const gitignorePath = path.join(dir, '.gitignore');
    const content = templates[template];
    
    try {
      await fs.promises.writeFile(gitignorePath, content, 'utf-8');
    } catch (error) {
      throw new Error(`Failed to create .gitignore: ${(error as Error).message}`);
    }
  }
}

// Export a singleton instance
export const gitManager = new GitManager();
