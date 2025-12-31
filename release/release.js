// Author: Ricardo Wagemaker

const path = require('path');
const fs = require('fs');

// fucntion to close the window
document.getElementById('closeBtn').addEventListener('click', function() {
    window.close();
});

// Set version number
const packageJsonPath = path.join(__dirname, '../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Retrieve the version from package.json
var version = packageJson.version;
document.getElementById('version').textContent = version;
// Determine remote/latest version. Prefer a local file (packaged apps may ship it),
// otherwise fall back to fetching the canonical release metadata on GitHub.
function setRemoteVersionText(v) {
    document.getElementById('remoteVersion').textContent = v || 'unknown';
}

const localLatestPath = path.join(__dirname, 'latest.json');
let remoteVersion = '';

if (fs.existsSync(localLatestPath)) {
    try {
        const raw = fs.readFileSync(localLatestPath, 'utf8');
        const data = JSON.parse(raw);
        remoteVersion = data.version || '';
        setRemoteVersionText(remoteVersion);
        // run check immediately
        checkVersion();
    } catch (err) {
        console.error('Error reading local latest.json:', err);
        setRemoteVersionText('unknown');
        // fall through to network fetch below
    }
}

if (!remoteVersion) {
    // remote fallback (raw GitHub URL)
    fetch('https://raw.githubusercontent.com/gcclinux/EasyEditor/refs/heads/main/release/latest.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        remoteVersion = data.version || '';
        setRemoteVersionText(remoteVersion);
        checkVersion();
    })
    .catch(error => {
        console.error('Error fetching remote latest.json:', error);
        setRemoteVersionText('unknown');
        const versionCheck = document.getElementById('version-check');
        if (versionCheck) {
            versionCheck.classList.remove('placeholder');
            versionCheck.textContent = 'Unable to determine remote version (offline or network error).';
        }
    });
}

// Check if a new version is available
function checkVersion() {
    var version = document.getElementById('version')?.textContent || '';
    var remoteVersionDom = document.getElementById('remoteVersion')?.textContent || '';
    var versionCheck = document.getElementById('version-check');

    // prefer the variable we may have already set, fall back to DOM text
    var remoteVersionToCompare = (typeof remoteVersion !== 'undefined' && remoteVersion) ? remoteVersion : remoteVersionDom;

    console.log('Comparing versions:', version, remoteVersionToCompare);

    function compareVersions(v1, v2) {
        if (!v1 || !v2) return 0;

        var v1Parts = v1.split('.').map(Number);
        var v2Parts = v2.split('.').map(Number);

        for (var i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
            var v1Part = v1Parts[i] || 0;
            var v2Part = v2Parts[i] || 0;

            if (v1Part > v2Part) return 1;
            if (v1Part < v2Part) return -1;
        }
        return 0;
    }

    if (!remoteVersionToCompare) {
        if (versionCheck) {
            versionCheck.classList.remove('placeholder');
            versionCheck.textContent = 'Remote version unknown.';
        }
        return;
    }

    if (compareVersions(remoteVersionToCompare, version) > 0) {
        versionCheck.classList.remove('placeholder');
        versionCheck.innerHTML = 'New version available <a href="https://github.com/gcclinux/EasyEditor/releases">here</a>';
    } else {
        versionCheck.classList.remove('placeholder');
        versionCheck.textContent = 'You are using the latest version of EasyEditor.';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(checkVersion, 1000);
});