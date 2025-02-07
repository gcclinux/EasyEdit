const fs = require('fs');
const path = require('path');

// Only proceed if platform is Windows
if (process.platform === 'win32') {
  const outputDir = path.join(__dirname, 'dist');
  const files = fs.readdirSync(outputDir);

  files.forEach(file => {
    const versionPattern = /\d+\.\d+\.\d+/;
    if (file.endsWith('.exe') || file.endsWith('.msi') || file.endsWith('.zip')) {  
      const match = file.match(versionPattern);
      if (match && (file.startsWith('EasyEdit ') || file.startsWith('EasyEdit-'))) {
        const version = match[0];
        let newName;
        if (file.includes('Setup') || file.endsWith('.msi')) {
          newName = `EasyEdit-Setup-${version}${path.extname(file)}`;
        } else if (file.endsWith('.zip') && file.includes('win')) {
          newName = `EasyEdit-Portable-${version}.zip`;
        } else {
          newName = `EasyEdit-Portable-${version}.exe`;
        }
        fs.renameSync(path.join(outputDir, file), path.join(outputDir, newName));
      }
    }
  });
}