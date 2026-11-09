# Spec-Driven Dev Workspace Template

> **"Plan with specs, execute with locked file scopes, verify with diffs."**

[![License: MIT](https://img.shields.io/badge/License-MIT-indigo.svg)](./LICENSE)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-Zero-10b981)](#)

A community-created starter template for **Spec-Driven Development (SDD)** with AI coding agents. It keeps product specifications, atomic task matrices, agent scope-locking rules, and source code in a single local folder so your agent stays focused and predictable.

---

## Why I Built This Template

When working with AI coding agents, it is easy for them to hallucinate requirements, touch unrelated files, or refactor too much at once. I put together this lightweight folder structure to enforce **four simple guardrails**:

1. **All Context in One Folder:** Product requirements (`01-specs/PRD.md`), architecture (`01-specs/ARCHITECTURE.md`), task list (`02-tasks/tasks.csv`), and source code (`03-src/`) live together in version control.
2. **File Scope Locking (`scope_files`):** Every atomic task in `02-tasks/tasks.csv` declares the exact semicolon-separated list of files the agent is allowed to edit.
3. **Agent Sandbox Rules (`AGENTS.md` & `CLAUDE.md`):** Pre-configured rules prevent unsolicited edits and make the agent stop after each task for human diff review.
4. **Built-in Visual Dashboard:** Includes a zero-dependency visual console (`00-console/dashboard.html`) that you can preview directly inside your workspace without starting any server.

---

## Quickstart Guide (Step-by-Step)

This template comes with a ready-to-run sample app (**DevMarks — Minimal Local Bookmark Manager**) where `TASK-01` is already finished (`DONE`) and `TASK-02` to `TASK-04` are waiting (`TODO`). Follow the 4 steps below to experience the full workflow in minutes:

### Step 1: Get This Template
- **Option A (Recommended in Puppyone):** Click **"Use this template" (使用此模版)** on the Puppyone template details page to create a new workspace directly.
- **Option B (Git Clone):** Clone this repository into your local workspace folder:
  ```bash
  git clone https://github.com/joelmavis/template-spec-driven-dev.git
  cd template-spec-driven-dev
  ```

### Step 2: Preview the Task Dashboard (Directly in Puppyone)
You do **not** need an external browser or local server:
1. In the left file tree of Puppyone, click **`00-console/dashboard.html`**.
2. Use Puppyone's built-in **HTML Preview** to view the visual dashboard directly:
   - Check overall progress (**25% Done**, 1 of 4 tasks completed).
   - See which files each task is allowed to modify under **Locked Scope Files**.
3. *(Optional)* To run the terminal health check, enter this command in the terminal:
   ```bash
   node scripts/check.mjs
   ```

### Step 3: Copy & Paste a Prompt to Your Agent
Open the **Agent Chat** panel in Puppyone, copy the prompt below, and send it to the Agent to execute `TASK-02`:

```text
Read AGENTS.md and execute TASK-02 using skills/02-task-executor.md.
```

**What happens next:**
- The Agent reads the requirements in `01-specs/` and the scope rules in `02-tasks/tasks.csv`.
- Because `TASK-02` locks `scope_files` to `03-src/app.js`, the Agent **only** edits `03-src/app.js` and leaves all other files untouched.
- Once finished, the Agent automatically stops and waits for your review.

### Step 4: Verify the Diff & Preview the App
1. **Check the Diff:** Click the modified file `03-src/app.js` in Puppyone's **Diff Viewer** to confirm only the expected file was changed.
2. **Preview the App Inside Puppyone:** Click **`03-src/index.html`** in the file tree to preview the Bookmark Manager directly inside Puppyone and try adding a bookmark.
3. **Complete & Next Task:** Ask the Agent to mark `TASK-02` as done and continue to `TASK-03` when you are ready:
   ```text
   Mark TASK-02 as DONE in 02-tasks/tasks.csv, then execute TASK-03 using skills/02-task-executor.md.
   ```

---

## How to Use This Template for Your Own Project

Once you are familiar with the sample workflow, follow these 3 steps to build your own project:

### 1. Ask the Agent to Clean the Sample App
Send this prompt in the Agent Chat:
```text
Clean all sample files inside 03-src/ so we can start a new project.
```

### 2. Write Your Requirements & Generate Tasks
Edit `01-specs/PRD.md` (what you want to build) and `01-specs/ARCHITECTURE.md` (tech stack & files), or ask the Agent to write them for you, then send:
```text
Follow skills/01-spec-to-tasks.md to generate a fresh task list in 02-tasks/tasks.csv based on 01-specs/PRD.md and 01-specs/ARCHITECTURE.md.
```

### 3. Preview the Roadmap & Execute Task by Task
1. Click **`00-console/dashboard.html`** in Puppyone to inspect your newly generated task list.
2. Execute tasks one by one with:
   ```text
   Execute TASK-01 using skills/02-task-executor.md.
   ```

---

## Common Agent Prompts Cheat Sheet

| What You Want to Do | Where to Input | Prompt to Send |
| :--- | :--- | :--- |
| **Break specs into tasks** | Agent Chat | `Follow skills/01-spec-to-tasks.md to update 02-tasks/tasks.csv from 01-specs/.` |
| **Run a specific task** | Agent Chat | `Read AGENTS.md and execute TASK-02 using skills/02-task-executor.md.` |
| **Audit current changes** | Agent Chat | `Run skills/03-diff-auditor.md for TASK-02 to check scope compliance.` |
| **Validate CSV & scopes** | Terminal | `node scripts/check.mjs` |
| **View visual roadmap** | File Tree | Click `00-console/dashboard.html` (HTML Preview inside Puppyone) |

---

## Repository Directory Structure

```text
.
├── LICENSE                        # Standard MIT License
├── README.md                      # Quickstart guide & prompt cheat sheet
├── AGENTS.md                      # Governance & scope-lock rules for AI coding agents
├── CLAUDE.md                      # Identical governance rules for Claude Code / Anthropic agents
├── PLAYBOOK.md                    # 5-phase SOP for humans and AI agents
├── 00-console/
│   └── dashboard.html             # Visual task console (Preview directly inside Puppyone)
├── 01-specs/
│   ├── PRD.md                     # Product Requirements Document (Sample: Bookmark Manager)
│   └── ARCHITECTURE.md            # Technical Architecture & file boundaries
├── 02-tasks/
│   └── tasks.csv                  # Atomic task matrix with scope_files locks & statuses
├── 03-src/                        # Application source code (Sample at TASK-01 DONE state)
│   ├── index.html                 # App entry page (Preview directly inside Puppyone)
│   ├── style.css                  # Responsive dark/light theme variables and components
│   └── app.js                     # Modular ES6 state & event skeleton ready for TASK-02
├── skills/
│   ├── 01-spec-to-tasks.md        # Skill prompt: Decompose 01-specs/ into 02-tasks/tasks.csv
│   ├── 02-task-executor.md        # Skill prompt: Execute one task strictly within scope_files
│   └── 03-diff-auditor.md         # Skill prompt: Audit git diff against scope & acceptance criteria
└── scripts/
    └── check.mjs                  # Zero-dependency Node.js validator for tasks.csv & 03-src/
```

---

## License

Released under the [MIT License](./LICENSE).
