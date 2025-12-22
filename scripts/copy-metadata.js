import fs from 'fs';
import path from 'path';

const distDir = path.join(process.cwd(), 'dist');
const releaseDir = path.join(distDir, 'release');

// Ensure dist/release exists
if (!fs.existsSync(releaseDir)) {
    fs.mkdirSync(releaseDir, { recursive: true });
}

// Copy package.json
fs.copyFileSync(
    path.join(process.cwd(), 'package.json'),
    path.join(distDir, 'package.json')
);

// Copy release/latest.json
if (fs.existsSync(path.join(process.cwd(), 'release', 'latest.json'))) {
    fs.copyFileSync(
        path.join(process.cwd(), 'release', 'latest.json'),
        path.join(distDir, 'release', 'latest.json')
    );
}

console.log('Metadata copied to dist/');
