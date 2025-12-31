// Tauri-specific file operations
import { open } from '@tauri-apps/plugin-dialog';
import { readTextFile, writeTextFile, readDir, exists } from '@tauri-apps/plugin-fs';

// Ensure Tauri is initialized
const ensureTauriReady = async () => {
  // Wait for Tauri to be ready
  if (typeof window !== 'undefined' && !(window as any).__TAURI__) {
    // Try to wait a bit for Tauri to initialize
    await new Promise(resolve => setTimeout(resolve, 100));
  }
};

export interface TauriFileResult {
  content: string;
  path: string;
}

// Open directory dialog and return path
export const openDirectoryDialog = async (): Promise<string | null> => {
  try {
    await ensureTauriReady();
    console.log('[TauriFileHandler] Opening directory dialog...');
    const result = await open({
      directory: true,
      multiple: false
    });
    console.log('[TauriFileHandler] Dialog result:', result);

    if (typeof result === 'string') {
      return result;
    }

    return null;
  } catch (error) {
    console.error('Failed to open directory dialog:', error);
    return null;
  }
};

// Read directory contents (markdown files)
export const readDirectory = async (path: string): Promise<string[]> => {
  try {
    const files: string[] = [];

    const scanDir = async (dirPath: string, basePath: string): Promise<void> => {
      const entries = await readDir(dirPath);

      for (const entry of entries) {
        if (entry.isFile) {
          const fileName = entry.name;
          if (fileName.endsWith('.md') || fileName.endsWith('.markdown') || fileName.endsWith('.txt')) {
            const relativePath = dirPath === basePath ? fileName :
              `${dirPath.replace(basePath, '').replace(/^\//, '')}/${fileName}`;
            files.push(relativePath);
          }
        } else if (entry.isDirectory) {
          const dirName = entry.name;
          if (!dirName.startsWith('.') && dirName !== 'node_modules' && dirName !== 'dist' && dirName !== 'build') {
            await scanDir(`${dirPath}/${dirName}`, basePath);
          }
        }
      }
    };

    await scanDir(path, path);
    return files;
  } catch (error) {
    console.error('Failed to read directory:', error);
    return [];
  }
};

// Check if directory is a Git repository
export const checkGitRepo = async (path: string): Promise<boolean> => {
  try {
    // First try to check if .git directory exists
    const gitPath = `${path}/.git`;
    const gitExists = await exists(gitPath);
    if (gitExists) {
      return true;
    }
  } catch (error) {
    console.warn('Cannot access .git directory directly:', error);
  }

  try {
    // Fallback: try to use git command to check if it's a repo
    const { Command } = await import('@tauri-apps/plugin-shell');
    const command = Command.create('git', ['rev-parse', '--git-dir'], {
      cwd: path
    });
    const output = await command.execute();
    return output.code === 0;
  } catch (error) {
    console.warn('Cannot check Git repo using git command:', error);
    return false;
  }
};

// Read file content
export const readFileContent = async (path: string): Promise<string | null> => {
  try {
    const content = await readTextFile(path);
    return content;
  } catch (error) {
    console.error('Failed to read file:', error);
    return null;
  }
};

// Resolve a potentially relative path to absolute
export const resolvePath = async (path: string, baseDir?: string): Promise<string> => {
  if (path.startsWith('/') || path.includes(':')) {
    return path;
  }

  if (baseDir) {
    return `${baseDir}/${path}`.replace(/\/+/g, '/');
  }

  // If no baseDir, try to get current working directory or just return as is
  return path;
};

// Write file content
export const writeFileContent = async (path: string, content: string): Promise<boolean> => {
  try {
    await writeTextFile(path, content);
    return true;
  } catch (error) {
    console.error('Failed to write file:', error);
    return false;
  }
};

// Tauri-specific repository opener
export const handleTauriOpenRepository = async (
  onGitRepoDetected?: (repoPath: string, dirPath: string) => void,
  onFileListReady?: (files: string[], dirPath: string) => void
): Promise<void> => {
  try {
    console.log('[TauriFileHandler] Starting repository open process...');

    // Open directory dialog
    const dirPath = await openDirectoryDialog();
    console.log('[TauriFileHandler] Directory dialog result:', dirPath);

    if (!dirPath) {
      console.log('[TauriFileHandler] No directory selected, user cancelled');
      return; // User cancelled
    }

    console.log('[TauriFileHandler] Selected directory:', dirPath);

    // Check if it's a Git repository
    console.log('[TauriFileHandler] Checking if directory is a Git repo...');
    const isGitRepo = await checkGitRepo(dirPath);
    console.log('[TauriFileHandler] Is Git repo:', isGitRepo);

    if (isGitRepo && onGitRepoDetected) {
      console.log('[TauriFileHandler] Git repository detected, calling callback');
      await onGitRepoDetected(dirPath, dirPath);
    }

    // Get list of markdown files
    console.log('[TauriFileHandler] Scanning for markdown files...');
    const files = await readDirectory(dirPath);
    console.log('[TauriFileHandler] Found', files.length, 'markdown files:', files);

    if (onFileListReady) {
      console.log('[TauriFileHandler] Calling file list ready callback');
      onFileListReady(files, dirPath);
    }

  } catch (error) {
    console.error('[TauriFileHandler] Error:', error);
    throw error;
  }
};

// Read file from Tauri filesystem
export const readTauriFile = async (
  dirPath: string,
  filePath: string
): Promise<TauriFileResult | null> => {
  try {
    // Construct full path
    const fullPath = `${dirPath}/${filePath}`.replace(/\/+/g, '/');
    console.log('[TauriFileHandler] Reading file:', fullPath);

    const content = await readFileContent(fullPath);
    if (content === null) {
      return null;
    }

    return {
      content,
      path: fullPath
    };
  } catch (error) {
    console.error('[TauriFileHandler] Error reading file:', error);
    return null;
  }
};

// Open file dialog and read content
export const handleTauriOpenFile = async (
  setEditorContent: (content: string, filePath?: string | null) => void
): Promise<void> => {
  try {
    await ensureTauriReady();
    const result = await open({
      multiple: false,
      filters: [{
        name: 'Markdown',
        extensions: ['md', 'markdown', 'txt']
      }]
    });

    if (typeof result === 'string') {
      const content = await readFileContent(result);
      if (content !== null) {
        setEditorContent(content, result);
      }
    }
  } catch (error) {
    console.error('Failed to open file in Tauri:', error);
  }
};

// Save As dialog and write content
export const handleTauriSaveAs = async (
  content: string,
  defaultPath?: string
): Promise<string | null> => {
  try {
    await ensureTauriReady();
    const { save } = await import('@tauri-apps/plugin-dialog');
    const result = await save({
      defaultPath: defaultPath || 'easyeditor.md',
      filters: [{
        name: 'Markdown',
        extensions: ['md', 'markdown', 'txt']
      }]
    });

    if (typeof result === 'string') {
      const success = await writeFileContent(result, content);
      return success ? result : null;
    }
    return null;
  } catch (error) {
    console.error('Failed to save file in Tauri:', error);
    return null;
  }
};

// Write file to Tauri filesystem
export const writeTauriFile = async (
  filePath: string,
  content: string
): Promise<boolean> => {
  try {
    console.log('[TauriFileHandler] Writing file:', filePath);
    return await writeFileContent(filePath, content);
  } catch (error) {
    console.error('[TauriFileHandler] Error writing file:', error);
    return false;
  }
};