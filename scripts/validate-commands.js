#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

console.log('=== Tier 1: Validating Command & Argument Parity ===');

const skillsDir = path.join(process.cwd(), 'skills');
let errors = [];

if (fs.existsSync(skillsDir)) {
  const entries = fs.readdirSync(skillsDir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const skillMd = path.join(skillsDir, entry.name, 'SKILL.md');
    if (!fs.existsSync(skillMd)) continue;
    
    const content = fs.readFileSync(skillMd, 'utf-8');
    if (content.includes('arguments:') && !content.includes('argument-hint:')) {
      errors.push(`[${entry.name}] Has arguments defined but missing argument-hint`);
    }
  }
}

if (errors.length > 0) {
  console.error('\n❌ Command Parity Validation Failed:');
  errors.forEach(err => console.error('  - ' + err));
  process.exit(1);
} else {
  console.log('✅ All command parameters and argument hints are synchronized!\n');
  process.exit(0);
}
