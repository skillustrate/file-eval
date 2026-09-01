# 🎩 file-eval (6-Hat Enterprise Suite)

An enterprise-grade evaluation engine designed to deeply interrogate, grill, and synthesize multiple competing architectural proposals. It uses **6 specialized persona hats** to perform iterative, multi-round reviews, delivering a definitive, high-quality "best-of-breed" output while maximizing token efficiency.

---

## 🚀 How to Use

You can use this tool in two ways depending on your technical preference:

### 🟢 Method 1: Quick & Easy (No Installation)
**Best for:** Casual users using ChatGPT, Claude, or Gemini web interfaces.

1.  Open `STANDALONE_PROMPT.md` in this repository.
2.  Copy the entire content of the file.
3.  Paste the content into your LLM chat window.
4.  **Crucial:** Paste your own Markdown documents (or the ones in `sample_inputs/`) into the chat after the prompt to begin the evaluation.

### 🔵 Method 2: Developer Automation (CLI)
**Best for:** Developers who want to automate evaluations or test multiple files at once.

1.  **Clone the repo:**
    ```bash
    git clone https://github.com/Nesmarkib/skillustrate.git
    cd skillustrate
    ```
2.  **Run the evaluator script:**
    Use the Python script to automatically package your files into a perfect prompt.
    ```bash
    # Evaluate all sample inputs at once
    python scripts/run_evaluator.py sample_inputs/*.md

    # Specify a specific file and custom role
    python scripts/run_evaluator.py sample_inputs/proposal-a-event-driven.md --role "Principal Architect"
    ```
3.  **Pro Tip (Optional - Direct Pipe to LLM or Clipboard):**
    You can pipe the prompt directly to an LLM CLI tool (like [`llm`](https://github.com/simonw/llm), installable via `pip install llm`) to evaluate immediately in your terminal, or copy it directly to your clipboard:
    ```bash
    # Option A: Run directly in terminal via llm CLI (requires: pip install llm)
    python scripts/run_evaluator.py sample_inputs/*.md | llm

    # Option B: Copy prompt directly to clipboard to paste into web chat (Windows)
    python scripts/run_evaluator.py sample_inputs/*.md | clip
    ```

---

## 🎩 The 6 Evaluation Hats
The engine cycles through these personas to ensure a 360-degree review:

1.  **The Champion Synthesizer**: Defends the architecture and produces targeted spec delta patches.
2.  **The Adversarial Red-Teamer**: Attacks structural bottlenecks, scaling limits, and single points of failure.
3.  **The Security & Compliance Auditor**: Attacks IAM, zero-trust violations, encryption, and compliance risks.
4.  **The FinOps & Cost Engineer**: Attacks runaway cloud bills, over-provisioning, and egress costs.
5.  **The Production & Ops Realist**: Attacks MTTR, telemetry blind spots, and deployment fragility.
6.  **The Chief Arbiter**: Impartially grades the final result against a balanced 5-pillar 100-point rubric.

---

## ⚡ Token-Efficiency (Delta-Patching)
To save costs and reduce "AI chatter," this suite uses:
*   **Delta-Patching**: Only sends concise updates/fixes during intermediate rounds instead of re-writing the whole document.
*   **Single Master Generation**: The full, polished document is only rendered once at the very end.
*   **Result:** Reduces token consumption by **~65% to 75%**.

---

## 📁 Project Structure
*   `STANDALONE_PROMPT.md`: The core "Brain" (the master prompt).
*   `scripts/run_evaluator.py`: The "Assistant" (automates file reading and prompt assembly).
*   `sample_inputs/`: Example Markdown files to test the skill.
*   `.agents/`, `.claude/` & `.gemini/`: Specialized configuration files for integrating the `file-eval` skill directly into AI agents.

---

## 📁 Folder Structure

```
skillustrate/
├── README.md
├── USAGE_ACROSS_ALL_LLMS.md
├── STANDALONE_PROMPT.md
├── file-eval.code-workspace
├── sample_inputs/
│   ├── proposal-a-event-driven.md
│   ├── proposal-b-monolithic-modular.md
│   └── proposal-c-serverless-microservices.md
├── scripts/
│   └── run_evaluator.py
├── .claude/skills/file-eval/
│   ├── SKILL.md
│   └── evals/evals.json
├── .agents/skills/file-eval/
│   ├── SKILL.md
│   └── evals/evals.json
└── .gemini/skills/file-eval/
    ├── SKILL.md
    └── evals/evals.json
```

---
