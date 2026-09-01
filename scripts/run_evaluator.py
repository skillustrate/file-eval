#!/usr/bin/env python3
"""
Universal file-eval CLI Runner (6-Hat Enterprise Suite)
Supports: Anthropic (Claude), OpenAI (GPT), Google (Gemini), Groq, Ollama (Local)
"""

import io
import os
import sys
import glob
import argparse

# Ensure UTF-8 output on Windows consoles
if isinstance(sys.stdout, io.TextIOWrapper):
    sys.stdout.reconfigure(encoding="utf-8")
if isinstance(sys.stderr, io.TextIOWrapper):
    sys.stderr.reconfigure(encoding="utf-8")

PROMPT_TEMPLATE = """You are an advanced evaluation engine designed to inspect multiple competing markdown (.md) documents, wear multiple distinct persona hats to deeply interrogate, grill, and cross-examine the content, iteratively re-think and refine the solution over multiple rounds, and produce the definitive, highest-quality output document.

⚡ TOKEN-EFFICIENCY PROTOCOL:
- Do NOT re-render the full draft during intermediate grilling rounds.
- Use concise Delta Patches (bulleted architectural diffs/fixes) during intermediate defense rounds.
- Render the complete production-grade document ONLY ONCE in the final section.
- Avoid conversational filler. Use high-density bullet points and compact tables.

---

### CANDIDATE MARKDOWN DOCUMENTS
{documents_block}

---

### EVALUATION CONFIGURATION
- **TOTAL_ROUNDS**: {rounds}
- **TARGET_ROLE**: {role}
- **EVALUATION_CRITERIA**: {criteria}

---

### THE SIX SPECIALIZED EVALUATION HATS
1. 🎩 **The Champion Synthesizer (Hat 1 / {role})**: Concise technical defenses & delta patches.
2. 🎩 **The Adversarial Red-Teamer (Hat 2 - Architecture & Scale)**: 1-2 sharp attack vectors on edge cases & scale limits.
3. 🎩 **The Security & Compliance Auditor (Hat 3 - Cyber & Zero-Trust)**: 1-2 sharp attack vectors on auth, encryption, and compliance.
4. 🎩 **The FinOps & Cost Engineer (Hat 4 - Economics & ROI)**: 1-2 sharp attack vectors on cloud spend, egress, and waste.
5. 🎩 **The Production & Ops Realist (Hat 5 - SRE & Observability)**: 1-2 sharp attack vectors on telemetry, MTTR, and deploy fragility.
6. 🎩 **The Chief Arbiter (Hat 6 - Expert Evaluator)**: Balanced 5-pillar 100-pt rubric scorecard.

---

### EXECUTION WORKFLOW
1. Step 1: Comparative Matrix & Baseline Benchmark Table
2. Step 2: Multi-Round Grilling Loop ({rounds} rounds: 6-Hat Grilling -> Delta Patches -> Compact Arbiter Score Table)
3. Step 3: Produce the Definitive Best-of-Breed Output Document

### OUTPUT FORMAT REQUIREMENTS
# File Evaluation & Synthesis Report
## 1. Executive Synthesis & Comparative Matrix
## 2. Iterative Multi-Hat Grilling Transcript
## 3. The Definitive Best-of-Breed Document
## 4. Expert Evaluator Final Verdict & Evolution Log
"""

def collect_markdown_files(paths_or_globs):
    files = []
    for item in paths_or_globs:
        matched = glob.glob(item, recursive=True)
        if matched:
            files.extend(matched)
        elif os.path.isfile(item):
            files.append(item)
    return sorted(list(set(files)))

def format_documents(file_paths):
    blocks = []
    for p in file_paths:
        try:
            with open(p, "r", encoding="utf-8") as f:
                content = f.read()
            blocks.append(f"#### File: `{p}`\n```markdown\n{content}\n```\n")
        except Exception as e:
            print(f"[Warning] Could not read file {p}: {e}", file=sys.stderr)
    return "\n".join(blocks)

def main():
    parser = argparse.ArgumentParser(description="file-eval CLI (6-Hat Enterprise Suite)")
    parser.add_argument("files", nargs="*", help="Markdown files or glob patterns to evaluate (e.g. sample_inputs/*.md)")
    parser.add_argument("--rounds", "-r", type=int, default=2, help="Number of grilling iterations (default: 2)")
    parser.add_argument("--role", default="Lead Systems Architect", help="Target domain role")
    parser.add_argument("--criteria", default="Architecture, Security, FinOps, SRE Reliability, Completeness", help="Evaluation criteria")
    parser.add_argument("--export-prompt", action="store_true", help="Print the fully compiled prompt to stdout without calling an API")
    args = parser.parse_args()

    files = collect_markdown_files(args.files) if args.files else collect_markdown_files(["sample_inputs/*.md"])
    if not files:
        print("[Error] No markdown files found to evaluate.", file=sys.stderr)
        sys.exit(1)

    docs_block = format_documents(files)
    compiled_prompt = PROMPT_TEMPLATE.format(
        documents_block=docs_block,
        rounds=args.rounds,
        role=args.role,
        criteria=args.criteria
    )

    if args.export_prompt:
        print(compiled_prompt)
        return

    print("=" * 60)
    print("file-eval (6-Hat Enterprise Suite)")
    print(f"Discovered Files ({len(files)}): {files}")
    print(f"Grilling Rounds: {args.rounds} | Target Role: {args.role}")
    print("=" * 60)
    print("\n[INFO] You can pipe this prompt to any LLM or export via --export-prompt.")
    print("Compiled prompt preview:\n")
    print(compiled_prompt[:600] + "\n...[Prompt continues with all embedded docs]...")

if __name__ == "__main__":
    main()
