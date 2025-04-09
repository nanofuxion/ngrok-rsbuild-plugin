// patcher.js

import  fs from "fs";
import path from "path";
import { execSync } from 'child_process';

// Path to the root of the main project (adjust if deeply nested)
const projectRoot = path.resolve(__dirname, '../../..');

// Paths to the plugin's and main project's patches directories
const pluginPatchesDir = path.join(__dirname, 'patches'); // inside plugin
const projectPatchesDir = path.join(projectRoot, 'patches');

// Step 1: Copy patches to the main project
function copyPatches() {
  if (!fs.existsSync(pluginPatchesDir)) {
    console.warn('⚠️  No patches directory found in plugin.');
    return;
  }

  if (!fs.existsSync(projectPatchesDir)) {
    fs.mkdirSync(projectPatchesDir, { recursive: true });
  }

  const patches = fs.readdirSync(pluginPatchesDir);
  patches.forEach(file => {
    const src = path.join(pluginPatchesDir, file);
    const dest = path.join(projectPatchesDir, file);
    fs.copyFileSync(src, dest);
    console.log(`📦 Copied patch: ${file}`);
  });
}

// Step 2: Run custompatch to apply them
function runCustomPatch() {
  console.log('🔧 Running custompatch...');
  execSync('npx custompatch', {
    cwd: projectRoot,
    stdio: 'inherit',
  });
}

// Step 3: Clean up patches after applying (optional)
function cleanUpPatches() {
  const patches = fs.readdirSync(projectPatchesDir);
  patches.forEach(file => {
    const filePath = path.join(projectPatchesDir, file);
    fs.unlinkSync(filePath);
    console.log(`🧹 Deleted patch: ${file}`);
  });

  // Optional: remove patches folder if empty
  if (fs.readdirSync(projectPatchesDir).length === 0) {
    fs.rmdirSync(projectPatchesDir);
  }
}

// Execute
try {
  console.log('🚀 Starting patch application process...');
  copyPatches();
  runCustomPatch();
  cleanUpPatches(); // remove if you want to keep patches
  console.log('✅ Patch process complete.');
} catch (err) {
  console.error('❌ Failed to apply patches:', err.message);
  process.exit(1);
}
