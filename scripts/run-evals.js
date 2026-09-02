#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Parse CLI flags
const args = process.argv.slice(2);
let minRank1 = 80;
let behavioralMode = false;
let targetSkill = null;
let dryRun = false;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--min-rank1' && args[i + 1]) {
    minRank1 = parseFloat(args[i + 1]);
    i++;
  } else if (args[i] === '--behavioral') {
    behavioralMode = true;
    if (args[i + 1] && !args[i + 1].startsWith('--')) {
      targetSkill = args[i + 1];
      i++;
    }
  } else if (args[i] === '--dry-run') {
    dryRun = true;
  }
}

// Tokenize & simple stemmer for TF-IDF
function tokenize(text) {
  if (!text) return [];
  return text.toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2)
    .map(w => {
      // Basic English suffix stripping
      if (w.endsWith('ing')) return w.slice(0, -3);
      if (w.endsWith('tion')) return w.slice(0, -4);
      if (w.endsWith('ies')) return w.slice(0, -3) + 'y';
      if (w.endsWith('es')) return w.slice(0, -2);
      if (w.endsWith('s') && !w.endsWith('ss')) return w.slice(0, -1);
      if (w.endsWith('ed')) return w.slice(0, -2);
      return w;
    });
}

function computeSimilarity(tokensA, tokensB) {
  const setA = new Set(tokensA);
  const setB = new Set(tokensB);
  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  if (union.size === 0) return 0;
  return intersection.size / union.size;
}

function tfidfScore(queryTokens, docTokens, corpusDocTokens) {
  const docLen = docTokens.length;
  if (docLen === 0) return 0;
  
  const tf = {};
  for (const t of docTokens) {
    tf[t] = (tf[t] || 0) + 1;
  }
  
  let score = 0;
  for (const q of queryTokens) {
    const termFreq = (tf[q] || 0) / docLen;
    // Corpus IDF
    const docsWithTerm = corpusDocTokens.filter(d => d.includes(q)).length;
    const idf = Math.log((corpusDocTokens.length + 1) / (docsWithTerm + 1)) + 1;
    score += termFreq * idf;
  }
  return score;
}

// Load skills
const skills = new Map();
const skillDirs = [
  path.join(process.cwd(), 'skills'),
  path.join(process.cwd(), '.claude', 'skills')
];

for (const sDir of skillDirs) {
  if (!fs.existsSync(sDir)) continue;
  for (const entry of fs.readdirSync(sDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const name = entry.name;
    const skillMd = path.join(sDir, name, 'SKILL.md');
    if (fs.existsSync(skillMd) && !skills.has(name)) {
      const content = fs.readFileSync(skillMd, 'utf-8');
      const descMatch = content.match(/description:\s*([^\n]+)/);
      const desc = descMatch ? descMatch[1].trim() : '';
      skills.set(name, {
        name,
        description: desc,
        tokens: tokenize(desc + ' ' + name + ' ' + content)
      });
    }
  }
}

// Load case files
const casesDir = path.join(process.cwd(), 'evals', 'cases');
if (!fs.existsSync(casesDir)) {
  console.error(`[Error] Missing evals/cases directory`);
  process.exit(1);
}

const caseFiles = fs.readdirSync(casesDir).filter(f => f.endsWith('.json'));
const cases = [];

for (const cFile of caseFiles) {
  const filePath = path.join(casesDir, cFile);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  cases.push(data);
}

if (behavioralMode) {
  console.log('=== Tier 3: Behavioral Evaluation Runner ===');
  const targetCases = targetSkill ? cases.filter(c => c.skill_name === targetSkill) : cases;
  
  if (targetCases.length === 0) {
    console.error(`[Error] No eval cases found for skill: ${targetSkill}`);
    process.exit(1);
  }

  for (const sc of targetCases) {
    console.log(`\nSkill: ${sc.skill_name}`);
    for (const ev of (sc.evals || [])) {
      console.log(`  Eval #${ev.id} [${ev.kind || 'execution'}]: "${ev.prompt}"`);
      console.log(`  Expected Output: ${ev.expected_output}`);
      console.log(`  Fixtures: ${JSON.stringify(ev.files || [])}`);
      console.log(`  Expectations (${ev.expectations ? ev.expectations.length : 0}):`);
      (ev.expectations || []).forEach((exp, idx) => console.log(`    ${idx + 1}. ${exp}`));
      
      if (ev.kind === 'execution' && ev.files) {
        for (const f of ev.files) {
          const fixturePath = path.join(process.cwd(), 'evals', 'fixtures', f);
          if (!fs.existsSync(fixturePath)) {
            console.error(`  ❌ [Error] Missing fixture path: evals/fixtures/${f}`);
            process.exit(1);
          } else {
            console.log(`  ✓ Fixture verified: evals/fixtures/${f}`);
          }
        }
      }
    }
  }

  if (dryRun) {
    console.log('\n[Dry-run] Behavioral evaluation plan verified successfully (no tokens spent).');
    process.exit(0);
  } else {
    console.log('\n[Behavioral Sandbox] Ready for headless grading harness.');
    process.exit(0);
  }
}

// Tier 2 Trigger & Routing Evaluation
console.log('=== Tier 2: Trigger & Routing Evaluation ===\n');

let totalPositive = 0;
let rank1Matches = 0;
let topKMatches = 0;
let totalNegative = 0;
let passedNegative = 0;
let errors = [];

const allSkillTokens = Array.from(skills.values()).map(s => s.tokens);

// Check description collisions across skills
const skillList = Array.from(skills.values());
for (let i = 0; i < skillList.length; i++) {
  for (let j = i + 1; j < skillList.length; j++) {
    const sim = computeSimilarity(skillList[i].tokens, skillList[j].tokens);
    if (sim >= 0.75) {
      errors.push(`Description collision ERROR (>=75%): ${skillList[i].name} vs ${skillList[j].name} (${(sim*100).toFixed(1)}%)`);
    } else if (sim >= 0.50) {
      console.warn(`⚠️ [Warning] Description similarity high (>=50%): ${skillList[i].name} vs ${skillList[j].name} (${(sim*100).toFixed(1)}%)`);
    }
  }
}

for (const c of cases) {
  const skillName = c.skill_name;
  const targetSkillObj = skills.get(skillName);
  
  if (!targetSkillObj) {
    errors.push(`[${skillName}] Eval case exists but skill not found in skills/ catalog`);
    continue;
  }

  // Schema checks
  if (!c.trigger || !c.trigger.positive || c.trigger.positive.length < 3) {
    errors.push(`[${skillName}] Must have at least 3 positive trigger prompts (found ${c.trigger?.positive?.length || 0})`);
  }
  if (!c.trigger || !c.trigger.negative || c.trigger.negative.length < 2) {
    errors.push(`[${skillName}] Must have at least 2 negative trigger prompts (found ${c.trigger?.negative?.length || 0})`);
  }
  if (!c.evals || c.evals.length < 1) {
    errors.push(`[${skillName}] Must have at least 1 behavioral eval case`);
  }

  // Run positive triggers
  console.log(`Checking routing for skill: ${skillName}`);
  for (const pos of (c.trigger?.positive || [])) {
    totalPositive++;
    const qTokens = tokenize(pos.prompt);
    const scores = [];
    
    for (const [sName, sObj] of skills.entries()) {
      const score = tfidfScore(qTokens, sObj.tokens, allSkillTokens);
      scores.push({ name: sName, score });
    }
    scores.sort((a, b) => b.score - a.score);
    
    const rank = scores.findIndex(s => s.name === skillName) + 1;
    const topK = pos.top_k || 3;
    
    if (rank === 1) {
      rank1Matches++;
      topKMatches++;
      console.log(`  ✓ [Rank 1] Positive prompt: "${pos.prompt}"`);
    } else if (rank <= topK && rank > 0) {
      topKMatches++;
      console.log(`  ✓ [Rank ${rank} <= top_${topK}] Positive prompt: "${pos.prompt}"`);
    } else {
      console.error(`  ❌ [Rank ${rank} > top_${topK}] Positive prompt: "${pos.prompt}" (Outranked by: ${scores.slice(0, 3).map(s=>s.name).join(', ')})`);
      errors.push(`[${skillName}] Positive prompt did not meet top_${topK}: "${pos.prompt}" (Rank ${rank})`);
    }
  }

  // Run negative triggers
  for (const neg of (c.trigger?.negative || [])) {
    totalNegative++;
    const qTokens = tokenize(neg.prompt);
    const scores = [];
    for (const [sName, sObj] of skills.entries()) {
      const score = tfidfScore(qTokens, sObj.tokens, allSkillTokens);
      scores.push({ name: sName, score });
    }
    scores.sort((a, b) => b.score - a.score);
    
    const rank = scores.findIndex(s => s.name === skillName) + 1;
    // Pass if not rank 1
    if (rank !== 1 || scores.length <= 1) {
      passedNegative++;
      console.log(`  ✓ [Negative passed] Target was not rank 1 (Rank ${rank}): "${neg.prompt}"`);
    } else {
      console.error(`  ❌ [Negative failed] Target erroneously ranked 1st: "${neg.prompt}"`);
      errors.push(`[${skillName}] Negative prompt incorrectly ranked #1 for this skill: "${neg.prompt}"`);
    }
  }
}

const rank1Rate = totalPositive > 0 ? (rank1Matches / totalPositive) * 100 : 0;
console.log('\n--------------------------------------------------');
console.log(`Trigger Rank-1 Rate: ${rank1Rate.toFixed(1)}% (Floor requirement: ${minRank1}%)`);
console.log(`Top-K Pass Rate: ${totalPositive > 0 ? ((topKMatches / totalPositive) * 100).toFixed(1) : 0}% (${topKMatches}/${totalPositive})`);
console.log(`Negative Rejection Rate: ${totalNegative > 0 ? ((passedNegative / totalNegative) * 100).toFixed(1) : 0}% (${passedNegative}/${totalNegative})`);
console.log('--------------------------------------------------');

if (rank1Rate < minRank1) {
  errors.push(`Trigger rank-1 rate ${rank1Rate.toFixed(1)}% is below minimum floor of ${minRank1}%`);
}

if (errors.length > 0) {
  console.error('\n❌ Trigger & Routing Evaluation Failed:');
  errors.forEach(e => console.error('  - ' + e));
  process.exit(1);
} else {
  console.log('\n✅ Tier 2 Trigger & Routing Evaluation Passed!\n');
  process.exit(0);
}
