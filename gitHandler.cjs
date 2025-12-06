const git = require('isomorphic-git');
const http = require('isomorphic-git/http/node');
const fs = require('fs');
const path = require('path');
const { ipcMain } = require('electron');

function setupGitHandlers() {
    // Helper to create onAuth callback
    const createOnAuth = (credentials) => {
        if (!credentials) return undefined;
        return () => ({
            username: credentials.username,
            password: credentials.token || credentials.password,
        });
    };

    ipcMain.handle('git:clone', async (event, { url, dir, options, credentials }) => {
        try {
            console.log('[Main] git:clone', { url, dir, options });

            // Extract repo name and create target directory
            const repoName = url.split('/').pop().replace('.git', '') || 'repo';
            const cloneDir = path.join(dir, repoName);

            await git.clone({
                fs,
                http,
                dir: cloneDir,
                url,
                depth: options?.depth || 1,
                singleBranch: options?.singleBranch !== false, // default true
                ref: options?.ref,
                onAuth: createOnAuth(credentials),
            });

            return { success: true, repoDir: cloneDir };
        } catch (error) {
            console.error('[Main] git:clone error:', error);
            throw new Error(error.message);
        }
    });

    ipcMain.handle('git:pull', async (event, { dir, options, credentials }) => {
        try {
            await git.pull({
                fs,
                http,
                dir,
                ...options,
                onAuth: createOnAuth(credentials),
                author: options?.author || { name: 'EasyEdit User', email: 'user@easyedit.app' }
            });
            return { success: true };
        } catch (error) {
            throw new Error(error.message);
        }
    });

    ipcMain.handle('git:push', async (event, { dir, options, credentials }) => {
        try {
            await git.push({
                fs,
                http,
                dir,
                ...options,
                onAuth: createOnAuth(credentials),
            });
            return { success: true };
        } catch (error) {
            throw new Error(error.message);
        }
    });

    ipcMain.handle('git:fetch', async (event, { dir, options, credentials }) => {
        try {
            await git.fetch({
                fs,
                http,
                dir,
                ...options,
                onAuth: createOnAuth(credentials),
            });
            return { success: true };
        } catch (error) {
            throw new Error(error.message);
        }
    });

    ipcMain.handle('git:status', async (event, { dir, filepath }) => {
        try {
            const status = await git.status({
                fs,
                dir,
                filepath,
            });
            return status;
        } catch (error) {
            throw new Error(error.message);
        }
    });

    ipcMain.handle('git:add', async (event, { dir, filepath }) => {
        try {
            await git.add({
                fs,
                dir,
                filepath,
            });
            return { success: true };
        } catch (error) {
            throw new Error(error.message);
        }
    });

    ipcMain.handle('git:commit', async (event, { dir, message, author }) => {
        try {
            const sha = await git.commit({
                fs,
                dir,
                message,
                author: author || { name: 'EasyEdit User', email: 'user@easyedit.app' },
            });
            return sha;
        } catch (error) {
            throw new Error(error.message);
        }
    });

    ipcMain.handle('git:log', async (event, { dir, depth }) => {
        try {
            const commits = await git.log({
                fs,
                dir,
                depth: depth || 10,
            });
            return commits;
        } catch (error) {
            throw new Error(error.message);
        }
    });

    ipcMain.handle('git:currentBranch', async (event, { dir }) => {
        try {
            const branch = await git.currentBranch({
                fs,
                dir,
                fullname: false,
            });
            return branch;
        } catch (error) {
            throw new Error(error.message);
        }
    });

    ipcMain.handle('git:listBranches', async (event, { dir }) => {
        try {
            const branches = await git.listBranches({
                fs,
                dir,
            });
            return branches;
        } catch (error) {
            throw new Error(error.message);
        }
    });

    ipcMain.handle('git:checkout', async (event, { dir, ref }) => {
        try {
            await git.checkout({
                fs,
                dir,
                ref,
            });
            return { success: true };
        } catch (error) {
            throw new Error(error.message);
        }
    });

    // Helper to list files recursively (needed for status)
    ipcMain.handle('git:listFiles', async (event, { dir }) => {
        try {
            const files = [];
            async function traverse(currentDir) {
                const entries = await fs.promises.readdir(currentDir);
                for (const entry of entries) {
                    if (entry === '.git') continue;
                    const fullPath = path.join(currentDir, entry);
                    const stats = await fs.promises.stat(fullPath);
                    if (stats.isDirectory()) {
                        await traverse(fullPath);
                    } else if (stats.isFile()) {
                        files.push(fullPath);
                    }
                }
            }
            await traverse(dir);
            return files;
        } catch (error) {
            throw new Error(error.message);
        }
    });

    ipcMain.handle('git:readFile', async (event, { dir, filepath }) => {
        try {
            const fullPath = dir ? path.join(dir, filepath) : filepath;
            const content = await fs.promises.readFile(fullPath, 'utf8');
            return content;
        } catch (error) {
            throw new Error(error.message);
        }
    });

    ipcMain.handle('git:writeFile', async (event, { dir, filepath, content }) => {
        try {
            const fullPath = dir ? path.join(dir, filepath) : filepath;
            const dirname = path.dirname(fullPath);
            await fs.promises.mkdir(dirname, { recursive: true });
            await fs.promises.writeFile(fullPath, content, 'utf8');
            return { success: true };
        } catch (error) {
            throw new Error(error.message);
        }
    });

    ipcMain.handle('git:isGitRepo', async (event, { dir }) => {
        try {
            const gitDir = path.join(dir, '.git');
            const stats = await fs.promises.stat(gitDir);
            return stats.isDirectory();
        } catch {
            return false;
        }
    });

    ipcMain.handle('git:init', async (event, { dir }) => {
        try {
            await git.init({
                fs,
                dir,
                defaultBranch: 'main'
            });
            return { success: true };
        } catch (error) {
            throw new Error(error.message);
        }
    });

    ipcMain.handle('git:findRepoRoot', async (event, { filepath }) => {
        try {
            let currentDir = path.dirname(filepath);
            const { root } = path.parse(currentDir);

            // Safety check to avoid infinite loops
            let depth = 0;
            const maxDepth = 50;

            while (depth < maxDepth) {
                const gitDir = path.join(currentDir, '.git');
                try {
                    const stats = await fs.promises.stat(gitDir);
                    if (stats.isDirectory()) {
                        return currentDir;
                    }
                } catch (e) {
                    // Not a git repo or can't access
                }

                if (currentDir === root) return null;

                const parent = path.dirname(currentDir);
                if (parent === currentDir) return null; // Reached root
                currentDir = parent;
                depth++;
            }
            return null;
        } catch (error) {
            console.error('Error finding repo root:', error);
            return null;
        }
    });
}

module.exports = { setupGitHandlers };
