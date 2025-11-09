const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const logoDir = path.join(repoRoot, 'logo');
const clientPublic = path.join(repoRoot, 'client', 'public');
const assetsDir = path.join(clientPublic, 'assets');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function moveFile(src, dest) {
  if (!fs.existsSync(src)) return false;
  ensureDir(path.dirname(dest));
  // if dest exists, back it up
  if (fs.existsSync(dest)) {
    const bak = dest + '.bak';
    fs.renameSync(dest, bak);
    console.log('Backed up', dest, '->', bak);
  }
  fs.renameSync(src, dest);
  console.log('Moved', src, '->', dest);
  return true;
}

function main() {
  console.log('Organize assets: starting');
  ensureDir(assetsDir);

  // Move files from repo root logo/ into client/public/assets
  if (fs.existsSync(logoDir)) {
    const files = fs.readdirSync(logoDir);
    for (const f of files) {
      const src = path.join(logoDir, f);
      const dest = path.join(assetsDir, f);
      try { moveFile(src, dest); } catch (err) { console.error('Failed moving', src, err.message); }
    }
    // remove logoDir if empty
    try {
      const rem = fs.readdirSync(logoDir);
      if (rem.length === 0) {
        fs.rmdirSync(logoDir);
        console.log('Removed empty directory', logoDir);
      }
    } catch (err) {}
  }

  // Move common client public images into assets
  const clientFiles = ['favicon.ico','logo192.png','logo512.png','manifest.json'];
  for (const cf of clientFiles) {
    const src = path.join(clientPublic, cf);
    const dest = path.join(assetsDir, cf);
    try { moveFile(src, dest); } catch (err) { /* ignore */ }
  }

  // Update index.html references if present
  const indexHtml = path.join(clientPublic, 'index.html');
  if (fs.existsSync(indexHtml)) {
    let html = fs.readFileSync(indexHtml, 'utf8');
    html = html.replace(/%PUBLIC_URL%\/favicon.ico/g, '%PUBLIC_URL%/assets/favicon.ico');
    html = html.replace(/%PUBLIC_URL%\/logo192.png/g, '%PUBLIC_URL%/assets/logo192.png');
    html = html.replace(/%PUBLIC_URL%\/manifest.json/g, '%PUBLIC_URL%/assets/manifest.json');
    fs.writeFileSync(indexHtml, html, 'utf8');
    console.log('Updated', indexHtml);
  }

  // Update manifest.json path if it was moved
  const manifestPath = path.join(assetsDir, 'manifest.json');
  if (fs.existsSync(manifestPath)) {
    try {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      if (manifest.icons) {
        manifest.icons = manifest.icons.map(icon => ({ ...icon, src: 'assets/' + path.basename(icon.src) }));
      }
      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
      console.log('Updated manifest icons paths in', manifestPath);
    } catch (err) {
      console.error('Failed updating manifest.json:', err.message);
    }
  }

  console.log('Organize assets: complete');
}

main();
