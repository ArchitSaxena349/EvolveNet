const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');

const targets = [
  // client debug output
  path.join(repoRoot, 'client', 'build-debug.txt'),
  // common logs
  path.join(repoRoot, 'npm-debug.log'),
  path.join(repoRoot, 'yarn-debug.log'),
  path.join(repoRoot, 'yarn-error.log'),
  path.join(repoRoot, 'build-output.log'),
  // any leftover .DS_Store files
];

function removeIfExists(p) {
  try {
    if (fs.existsSync(p)) {
      fs.unlinkSync(p);
      console.log('Deleted:', p);
    }
  } catch (err) {
    console.error('Failed to delete', p, err.message);
  }
}

// walk repo for some common unwanted files (very conservative)
function walkAndClean(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      // skip node_modules and .git
      if (e.name === 'node_modules' || e.name === '.git') continue;
      walkAndClean(full);
    } else {
      if (e.name === '.DS_Store' || e.name.endsWith('.log') && full.includes('build-debug') === false) {
        removeIfExists(full);
      }
    }
  }
}

console.log('Starting clean script...');
targets.forEach(removeIfExists);

try {
  walkAndClean(repoRoot);
  console.log('Clean complete');
} catch (err) {
  console.error('Clean encountered an error:', err.message);
  process.exitCode = 1;
}
