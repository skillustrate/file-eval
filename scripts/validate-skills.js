#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function parseFrontmatter(content) {
  if (!content.startsWith('---')) return null;
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;
  const yamlText = match[1];
  const data = {};
  for (const line of yamlText.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const colonIdx = trimmed.indexOf(':');
    if (colonIdx !== -1) {
      const key = trimmed.slice(0, colonIdx).trim();
      let value = trimmed.slice(colonIdx + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      data[key] = value;
    }
  }
  return data;
}

function validateSkillDir(baseDir) {
  const errors = [];
  if (!fs.existsSync(baseDir)) return errors;
  
  const entries = fs.readdirSync(baseDir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const skillName = entry.name;
    const skillMdPath = path.join(baseDir, skillName, 'SKILL.md');
    
    if (!fs.existsSync(skillMdPath)) {
      errors.push(`[${skillName}] Missing SKILL.md in ${path.relative(process.cwd(), path.join(baseDir, skillName))}`);
      continue;
    }

    const content = fs.readFileSync(skillMdPath, 'utf-8');
    const fm = parseFrontmatter(content);
    
    if (!fm) {
      errors.push(`[${skillName}] Invalid or missing YAML frontmatter in SKILL.md`);
      continue;
    }

    if (!fm.name || fm.name !== skillName) {
      errors.push(`[${skillName}] Frontmatter name "${fm.name}" does not match folder name "${skillName}"`);
    }

    if (!fm.description || fm.description.length < 15) {
      errors.push(`[${skillName}] Frontmatter description is too short or missing (< 15 chars)`);
    }

    if (!content.includes('# ')) {
      errors.push(`[${skillName}] SKILL.md missing markdown title header (# Title)`);
    }
  }
  return errors;
}

console.log('=== Tier 1: Validating Skill Structures ===');
const searchDirs = [
  path.join(process.cwd(), 'skills'),
  path.join(process.cwd(), '.claude', 'skills')
];

let totalErrors = [];
for (const dir of searchDirs) {
  if (fs.existsSync(dir)) {
    const errs = validateSkillDir(dir);
    totalErrors = totalErrors.concat(errs);
  }
}

if (totalErrors.length > 0) {
  console.error('\n❌ Skill Validation Failed:');
  totalErrors.forEach(err => console.error('  - ' + err));
  process.exit(1);
} else {
  console.log('✅ All skill structures, frontmatter, and headings are valid!\n');
  process.exit(0);
}
