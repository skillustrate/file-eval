---
description: Token-optimized multi-file markdown evaluator with 6 specialized hats (Security Auditor, FinOps, Red-Teamer, Ops Realist, Champion, Arbiter). Uses delta-patching and iterative grilling to output the best-of-breed document and saves it directly to a final .md file.
argument-hint: "[repetitions] [target_role] [evaluation_criteria]"
---

Run the `file-eval` evaluation workflow on candidate markdown documents using arguments: $ARGUMENTS.

Follow the full 6-hat adversarial evaluation workflow defined in `.claude/skills/file-eval/SKILL.md`:
1. Ingest and benchmark candidate markdown documents.
2. Run iterative multi-round grilling across all 6 hats using delta-patching.
3. Impartially score each round on the 5-pillar scorecard (Architecture & Soundness, Security & Compliance, FinOps & Cost Efficiency, Production & Ops Readiness, Completeness & Polish).
4. Save the final consolidated best-of-breed document to disk as `final-synthesized-document.md` (or relevant topic name) and provide the file link.
