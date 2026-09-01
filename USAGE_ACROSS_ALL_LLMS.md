# Universal Usage Guide: file-eval (6-Hat Enterprise Suite)

This guide provides instructions for running the **file-eval** skill across **every major AI environment and LLM platform**.

---

## 🚀 Supported Platforms & Environments

| Platform / Environment | Method | Command / Action |
| :--- | :--- | :--- |
| **Claude Code (CLI)** | Native Skill Slash Command | `/file-eval 2 "Cloud Architect"` |
| **Gemini CLI / Antigravity** | Native Agent Skill | Automatic skill activation or `/file-eval` |
| **Cursor / Windsurf / Copilot** | Rules or Chat Prompt | Reference `@SKILL.md` or paste prompt in agent panel |
| **ChatGPT / Claude.ai / Gemini Web** | Copy-Paste Standalone Prompt | Paste from [`STANDALONE_PROMPT.md`](./STANDALONE_PROMPT.md) |
| **Local Ollama / Llama 3 / DeepSeek** | CLI Script / Prompt Pipe | `python scripts/run_evaluator.py --export-prompt \| ollama run llama3` |
| **Python / REST API Integration** | Python CLI Runner | `python scripts/run_evaluator.py sample_inputs/*.md -r 3` |

---

## 🎩 The Six Specialized Evaluation Hats

```
 🎩 Hat 1: Champion Synthesizer (Defends design & issues targeted spec delta patches)
 🎩 Hat 2: Adversarial Red-Teamer (Attacks architectural bottlenecks, SPOFs & scale limits)
 🎩 Hat 3: Security & Compliance Auditor (Attacks IAM, zero-trust, data privacy & encryption)
 🎩 Hat 4: FinOps & Cost Engineer (Attacks cloud spend, egress fees, waste & sub-optimal licensing)
 🎩 Hat 5: Production & Ops Realist (Attacks MTTR, telemetry blind spots & rollback hazards)
 🎩 Hat 6: Chief Arbiter (Impartially evaluates 5-pillar 100-pt scorecard & approves production readiness)
```

---

## 1. Claude Code CLI (Anthropic)

### Commands:
```bash
# Default invocation (defaults to 2 rounds or prompts for count):
/file-eval

# Custom iterations and specific domain role:
/file-eval "3" "Principal Enterprise Architect"

# Automated evals:
evaluate my file-eval skill with skill-creator
```

---

## 2. Web LLM Interfaces (ChatGPT, Claude.ai, Gemini Advanced, DeepSeek)

1. Open [`STANDALONE_PROMPT.md`](./STANDALONE_PROMPT.md).
2. Copy the template.
3. Paste the contents of your markdown files into the `<INSERT FILE CONTENT HERE>` sections.
4. Paste the whole block into ChatGPT, Claude.ai, Gemini, or DeepSeek and press Enter.

---

## 3. Local LLMs (Ollama / DeepSeek / Llama 3)

```bash
# Generate prompt from files and pipe directly to Ollama:
python scripts/run_evaluator.py sample_inputs/*.md --rounds 2 --export-prompt | ollama run qwen2.5-coder:32b
```
