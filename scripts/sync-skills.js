#!/usr/bin/env node
/**
 * Synchronizes skills from canonical skills/ directory to all target platform directories:
 * - .agents/skills/ (Open Agentic standard)
 * - .claude/skills/ (Claude Code plugin standard)
 * - .gemini/skills/ (Google Antigravity / Gemini CLI standard)
 * - Optional: user's global ~/.gemini/skills/ directory
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const rootDir = path.resolve(__dirname, '..');
const sourceSkillsDir = path.join(rootDir, 'skills');

const targetDirs = [
  path.join(rootDir, '.agents', 'skills'),
  path.join(rootDir, '.claude', 'skills'),
  path.join(rootDir, '.gemini', 'skills')
];

// Check for local user global Gemini config directory
const userHome = os.homedir();
const userGeminiSkills = path.join(userHome, '.gemini', 'skills');
if (fs.existsSync(userGeminiSkills)) {
  targetDirs.push(userGeminiSkills);
}

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();

  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    fs.copyFileSync(src, dest);
  }
}

console.log('=== Synchronizing Skills Across Target Platforms ===');
console.log(`Source: ${sourceSkillsDir}`);

if (!fs.existsSync(sourceSkillsDir)) {
  console.error(`❌ Source directory ${sourceSkillsDir} does not exist.`);
  process.exit(1);
}

const skills = fs.readdirSync(sourceSkillsDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

for (const skill of skills) {
  const srcSkillDir = path.join(sourceSkillsDir, skill);
  console.log(`\n📦 Syncing skill: [${skill}]`);

  for (const targetBase of targetDirs) {
    const destSkillDir = path.join(targetBase, skill);
    copyRecursiveSync(srcSkillDir, destSkillDir);
    console.log(`  -> Synced to ${destSkillDir}`);
  }
}

console.log('\n✅ All skills synchronized successfully!\n');
