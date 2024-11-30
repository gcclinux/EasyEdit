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