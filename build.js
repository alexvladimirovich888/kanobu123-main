import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Ensure public and dist directories exist
const publicDir = path.join(__dirname, 'public');
const distDir = path.join(__dirname, 'dist');
fs.mkdirSync(publicDir, { recursive: true });
fs.mkdirSync(distDir, { recursive: true });

// Copy index.html
if (fs.existsSync(path.join(__dirname, 'index.html'))) {
  fs.copyFileSync(path.join(__dirname, 'index.html'), path.join(publicDir, 'index.html'));
  fs.copyFileSync(path.join(__dirname, 'index.html'), path.join(distDir, 'index.html'));
}

// Copy archives
copyDir(path.join(__dirname, 'archives'), path.join(publicDir, 'archives'));
copyDir(path.join(__dirname, 'archives'), path.join(distDir, 'archives'));

// Copy images
copyDir(path.join(__dirname, 'images'), path.join(publicDir, 'images'));
copyDir(path.join(__dirname, 'images'), path.join(distDir, 'images'));

console.log('Build complete: synced files to public/ and dist/');
