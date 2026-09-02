---
name: file-eval
description: Token-optimized multi-file markdown evaluator with 6 specialized hats (Security Auditor, FinOps, Red-Teamer, Ops Realist, Champion, Arbiter). Uses delta-patching and iterative grilling to output the best-of-breed document and saves it directly to a final .md file.
---

# File Evaluation & Synthesis (6-Hat Enterprise Suite)

## Discovered Markdown Documents

```!
python3 -c "import os, glob, sys; getattr(sys.stdout, 'reconfigure', lambda **k: None)(encoding='utf-8'); exc={'SKILL.md','README.md','evals.json','STANDALONE_PROMPT.md','USAGE_ACROSS_ALL_LLMS.md','synthesize-designs-project-files-v2.md'}; files=[f for f in glob.glob('./**/*.md', recursive=True) if os.path.basename(f) not in exc and not os.path.basename(f).startswith('final-synthesized-')][:5] or [f for f in glob.glob('./*.md') if os.path.basename(f) not in exc][:3]; [print(f'=== FILE: {f} ===\n' + open(f, 'r', encoding='utf-8', errors='ignore').read() + '\n=== END FILE ===\n') for f in files]" 2>/dev/null || python -c "import os, glob, sys; getattr(sys.stdout, 'reconfigure', lambda **k: None)(encoding='utf-8'); exc={'SKILL.md','README.md','evals.json','STANDALONE_PROMPT.md','USAGE_ACROSS_ALL_LLMS.md','synthesize-designs-project-files-v2.md'}; files=[f for f in glob.glob('./**/*.md', recursive=True) if os.path.basename(f) not in exc and not os.path.basename(f).startswith('final-synthesized-')][:5] or [f for f in glob.glob('./*.md') if os.path.basename(f) not in exc][:3]; [print(f'=== FILE: {f} ===\n' + open(f, 'r', encoding='utf-8', errors='ignore').read() + '\n=== END FILE ===\n') for f in files]"
```

> **Note**: If candidate files are not automatically injected above, discover and inspect all candidate `.md` proposal files in the current workspace or `sample_inputs/` using available file tools before proceeding.

## Objective
Evaluate candidate `.md` documents through comprehensive multi-hat adversarial grilling—covering technical architecture, cybersecurity, FinOps economics, and production operations—iteratively refining the design via delta patches to produce the definitive best-of-breed document and saving it directly to a final `.md` file.

> **⚡ TOKEN-EFFICIENCY PROTOCOL**:
> 1. **No full draft re-rendering during intermediate rounds.**
> 2. Use **Delta Patches (bulleted diffs/fixes)** during intermediate defense rounds.
> 3. Emit the **Complete Final Document only once** in the final output section.
> 4. Keep grilling vectors sharp (1-2 bullets per hat), high-density, and free of filler.

---

## The Six Specialized Evaluation Hats

1. 🎩 **The Champion Synthesizer (Hat 1 / `$target_role`)**: Primary author & domain lead (defaults to `"Lead Systems Architect"`). Synthesizes strengths, provides defense, and issues delta patches.
2. 🎩 **The Adversarial Red-Teamer (Hat 2 - Architecture & Scale)**: Attacks bottlenecks, scaling limits, SPOFs, and race conditions.
3. 🎩 **The Security & Compliance Auditor (Hat 3 - Cyber & Zero-Trust)**: Attacks IAM/RBAC flaws, unencrypted flows, secrets, and compliance gaps.
4. 🎩 **The FinOps & Cost Engineer (Hat 4 - Economics & ROI)**: Attacks runaway cloud spend, egress fees, and resource waste.
5. 🎩 **The Production & Ops Realist (Hat 5 - SRE & Observability)**: Attacks MTTR, telemetry blind spots, and deployment/rollback fragility.
6. 🎩 **The Chief Arbiter (Hat 6 - Expert Evaluator)**: Impartially scores iterations against a 100-point balanced scorecard (20 pts per pillar).

---

## Step-by-Step Execution Workflow

### Step 1: Ingestion & Fast Comparative Benchmark
- **Repetitions (`$repetitions`)**: If specified, set `TOTAL_ROUNDS = $repetitions`. If empty/unspecified, note: *"No repetition count specified; defaulting to 2 grilling rounds (pass `/file-eval <N>` to customize)"* and use `TOTAL_ROUNDS = 2`.
- **Comparative Matrix**: Output a compact table comparing all inputs across Architecture & Soundness, Security & Compliance, FinOps & Cost Efficiency, Production & Ops Readiness, and Baseline Score (/100).
- Select baseline foundation or define the Integrated Draft v0 strategy.

### Step 2: Multi-Round Grilling Loop (Delta-Patch Workflow)
For each round `r` from `1` to `TOTAL_ROUNDS`:
1. **The Grilling (1-2 sharp bullets per hat)**: Hats 2, 3, 4, and 5 each pose targeted attack vectors.
2. **The Defense & Delta-Patch**: Hat 1 issues architectural resolutions + **Delta Patch** (bulleted spec modifications).
3. **The Arbiter 100-Point Scorecard**: Hat 6 scores these 5 fixed pillars (/20 each) — always use this exact naming, in this order: Architecture & Soundness, Security & Compliance, FinOps & Cost Efficiency, Production & Ops Readiness, Completeness & Polish.

### Step 3: Final Best-of-Breed Consolidation & File Creation
1. Compile all accumulated delta patches into the definitive, production-grade output markdown document.
2. **Save the finalized document directly to disk as `final-synthesized-document.md` (or relevant topic name) and provide the file link.**

---

## Required Output Structure

```markdown
# File Evaluation & Synthesis Report

## 1. Executive Synthesis & Comparative Matrix
- Compact candidate comparison table.
- Baseline approach selection & justification.

## 2. Iterative Multi-Hat Grilling Transcript
- Complete transcript for `TOTAL_ROUNDS` rounds with all 6 Hat badges (🎩), concise attack vectors, champion delta patches, and scorecards.

## 3. The Definitive Best-of-Breed Document
- The complete, fully refined, production-ready markdown document.

## 4. Expert Evaluator Final Verdict & Evolution Delta
- Final Arbiter Scorecard (`X/100`), evolution delta summary, and link to the saved final `.md` file.
```
