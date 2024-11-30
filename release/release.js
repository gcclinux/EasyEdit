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

// Fetch the remote version from version.json
fetch('https://raw.githubusercontent.com/gcclinux/EasyEdit/refs/heads/main/release/latest.json')
.then(response => {
    if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.json();
})
.then(data => {
    var remoteVersion = data.version;
    document.getElementById('remoteVersion').textContent = remoteVersion;
})
.catch(error => console.error('Error fetching version:', error));

// Check if a new version is available
function checkVersion() {
    var version = document.getElementById('version').textContent;
    var remoteVersion = document.getElementById('remoteVersion').textContent;
    var versionCheck = document.getElementById('version-check');

    console.log("Comparing versions:", version, remoteVersion);

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

    if (compareVersions(remoteVersion, version) > 0) {
        versionCheck.classList.remove('placeholder');
        versionCheck.innerHTML = 'New version available <a href="https://github.com/gcclinux/EasyEdit/releases/tag/latest">here</a>';
    } else {
        versionCheck.classList.remove('placeholder');
        versionCheck.textContent = 'You are using the latest version of EasyEdit.';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(checkVersion, 1000);
});