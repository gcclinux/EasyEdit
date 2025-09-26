// Author: Ricardo Wagemaker

document.addEventListener('DOMContentLoaded', () => {
    // Safe close button hookup
    const closeBtn = document.getElementById('closeBtn');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            try { window.close(); } catch (e) { /* ignore */ }
        });
    }

    // Populate version if possible. In Electron (or Node-enabled contexts) we can read package.json.
    const versionEl = document.getElementById('version');
    if (!versionEl) return;

    try {
        // require may not be available in a plain browser; guard it
        // eslint-disable-next-line no-undef
        const path = require('path');
        // eslint-disable-next-line no-undef
        const fs = require('fs');
        const packageJsonPath = path.join(__dirname, '../package.json');
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        const version = packageJson.version || 'unknown';
        versionEl.textContent = version;
    } catch (err) {
        // Fallback: try to fetch package.json over HTTP (if served), else use 'unknown'
        (async () => {
            try {
                const resp = await fetch('/package.json');
                if (resp.ok) {
                    const pkg = await resp.json();
                    versionEl.textContent = pkg.version || 'unknown';
                    return;
                }
            } catch (e) {
                // ignore
            }
            versionEl.textContent = 'unknown';
        })();
    }
});