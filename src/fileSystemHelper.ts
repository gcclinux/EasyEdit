/**
 * File System Helper
 * Provides unified file system operations for both Electron and Web environments
 */

// Always web environment now
const isElectron = () => false;

/**
 * Read a file from the file system
 */
export const readFile = async (filePath: string, dirHandle?: any): Promise<string> => {
  // Web: use File System Access API
  if (!dirHandle) {
    throw new Error('Directory handle not available for web environment');
  }
  
  // Navigate to the file using the path
  const pathParts = filePath.split(/[/\\]/);
  let currentHandle = dirHandle;
  
  for (let i = 0; i < pathParts.length - 1; i++) {
    if (pathParts[i]) {
      currentHandle = await currentHandle.getDirectoryHandle(pathParts[i]);
    }
  }
  
  const fileName = pathParts[pathParts.length - 1];
  const fileHandle = await currentHandle.getFileHandle(fileName);
  const file = await fileHandle.getFile();
  return await file.text();
};

/**
 * Write a file to the file system
 */
export const writeFile = async (filePath: string, content: string, dirHandle?: any): Promise<void> => {
  // Web: use File System Access API
  if (!dirHandle) {
    throw new Error('Directory handle not available for web environment');
  }
  
  // Navigate to the file using the path
  const pathParts = filePath.split(/[/\\]/);
  let currentHandle = dirHandle;
  
  for (let i = 0; i < pathParts.length - 1; i++) {
    if (pathParts[i]) {
      try {
        currentHandle = await currentHandle.getDirectoryHandle(pathParts[i]);
      } catch {
        currentHandle = await currentHandle.getDirectoryHandle(pathParts[i], { create: true });
      }
    }
  }
  
  const fileName = pathParts[pathParts.length - 1];
  const fileHandle = await currentHandle.getFileHandle(fileName, { create: true });
  const writable = await fileHandle.createWritable();
  await writable.write(content);
  await writable.close();
};

/**
 * Get directory path - returns full path in Electron, directory name in Web
 */
export const getDirectoryPath = (path: string, dirHandle?: any): string => {
  // In web mode, we store the directory handle and use the directory name
  return dirHandle?.name || path;
};

/**
 * Check if File System Access API is supported
 */
export const isFileSystemAccessSupported = (): boolean => {
  return 'showDirectoryPicker' in window;
};
