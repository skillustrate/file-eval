---
name: file-eval
description: Token-optimized multi-file markdown evaluator with 6 specialized hats (Security Auditor, FinOps, Red-Teamer, Ops Realist, Champion, Arbiter). Synthesizes competing technical proposals, system architectures, or RFCs through adversarial grilling into a single best-of-breed document.
argument-hint: "[repetitions] [target_role] [evaluation_criteria]"
arguments:
  - repetitions
  - target_role
  - evaluation_criteria
context: fork
agent: Plan
allowed-tools:
  - Bash
---

# File Evaluation & Synthesis (6-Hat Enterprise Suite)

## Discovered Markdown Documents

```!
# Discover candidate input documents dynamically without arbitrary truncation
FOUND_FILES=$(find . -maxdepth 3 -name "*.md" ! -name "SKILL.md" ! -name "README*.md" ! -name "evals.json" ! -name "STANDALONE_PROMPT.md" ! -name "USAGE_ACROSS_ALL_LLMS.md" ! -name "final-synthesized-*.md" ! -name "arena-*.md")

if [ -z "$FOUND_FILES" ]; then
  FOUND_FILES=$(find . -maxdepth 1 -name "*.md" ! -name "README*.md")
fi

for file in $FOUND_FILES; do
  echo "=== FILE: $file ==="
  cat "$file"
  echo "=== END FILE ==="
  echo ""
done
```

## Objective
Evaluate candidate `.md` documents through comprehensive multi-hat adversarial grilling—covering technical architecture, cybersecurity, FinOps economics, and production operations—iteratively refining the design via delta patches to produce the definitive best-of-breed document and saving it directly to a final `.md` file.

> **⚡ ZERO-LOSS INGESTION & FIDELITY PROTOCOL**:
> 1. **Zero-Loss Technical Ingestion**: "Synthesis" means **unifying and supersetting** the best technical details, NEVER summarizing, dropping, or truncating specific empirical tables, external URLs, licenses, taxonomies (A–L, ATLAS, OWASP), mathematical formulas, or mapping matrices from candidate documents. All distinct intelligence must be preserved in full detail.
> 2. **Intermediate Token-Efficiency**: Use concise **Delta Patches (bulleted diffs/fixes)** during intermediate defense rounds (Hats 1–6). Do NOT re-render drafts between rounds.
> 3. **Unabridged Disk Persistence**: The finalized document written to disk via `write_to_file` must be the **complete, fully exhaustive, production-grade specification** (no placeholders, no `TODO`s, no compressed tables).

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
- **Comparative Matrix**: Output a compact table comparing all inputs across Architecture, Security, FinOps, Ops, and Baseline Score (/100).
- Select baseline foundation or define the Integrated Draft v0 strategy.

### Step 2: Multi-Round Grilling Loop (Delta-Patch Workflow)
For each round `r` from `1` to `TOTAL_ROUNDS`:
1. **The Grilling (1-2 sharp bullets per hat)**: Hats 2, 3, 4, and 5 each pose targeted attack vectors.
2. **The Defense & Delta-Patch**: Hat 1 issues architectural resolutions + **Delta Patch** (bulleted spec modifications).
3. **The Arbiter 100-Point Scorecard**: Hat 6 scores the 5 pillars (/20 each).

### Step 3: Final Best-of-Breed Consolidation & File Creation
1. Compile all accumulated delta patches into the definitive, production-grade output markdown document.
2. **Write the complete, unabridged document to disk** as `final-synthesized-document.md` (or relevant topic name) using `write_to_file`. Ensure 100% preservation of all tables, formulas, and matrices.
3. Provide the verified clickable file link in the final report.

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
- Provide the verified link to the unabridged file written to disk.
- Include the complete, full text or detailed section-by-section specification ensuring zero-loss preservation of all technical tables.

## 4. Expert Evaluator Final Verdict & Evolution Delta
- Final Arbiter Scorecard (`X/100`), evolution delta summary, and link to the saved final `.md` file.
```
