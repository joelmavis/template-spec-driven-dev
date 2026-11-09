# Spec-Driven Dev Workspace Template

> **"Plan with specs, execute with locked file scopes, verify with diffs."**

[![License: MIT](https://img.shields.io/badge/License-MIT-indigo.svg)](./LICENSE)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-Zero-10b981)](#)

A personal, community-created starter template for **Spec-Driven Development (SDD)** with AI coding agents. It keeps product specifications, atomic task matrices, agent scope-locking rules, and source code in a single local folder without any external SaaS dependencies.

---

## Why I Built This Template

When working with AI coding agents, it is easy for them to hallucinate requirements, touch unrelated files, or refactor too much at once. I put together this lightweight folder structure to enforce **four simple guardrails**:

1. **Local-First Context:** Product requirements (`01-specs/PRD.md`), architecture (`01-specs/ARCHITECTURE.md`), task matrices (`02-tasks/tasks.csv`), and source code (`03-src/`) live together in version control.
2. **Scope-Locked Execution (`scope_files`):** Every atomic task in `02-tasks/tasks.csv` declares the exact semicolon-separated list of files the agent is allowed to touch.
3. **Deterministic Agent Sandboxing (`AGENTS.md` & `CLAUDE.md`):** Pre-configured rules forbid unsolicited edits and enforce single-task human-in-the-loop diff verification.
4. **Zero-Dependency Local Tooling:** Includes a standalone visual progress console (`00-console/dashboard.html`) and a Node.js validation script (`scripts/check.mjs`).

---

## Quickstart Guide

### 1. Use This Template
Click **"Use this template"** on GitHub (or clone this repository directly) to start your own project:

```bash
git clone https://github.com/joelmavis/template-spec-driven-dev.git
cd template-spec-driven-dev
```

### 2. Validate Workspace & Open Console
Run the built-in validator to check the task matrix and scope locks:

```bash
node scripts/check.mjs
```

Open `00-console/dashboard.html` in your browser to view the interactive task dashboard, completion progress bar, and locked file scopes.

### 3. Run an Atomic Task with Your AI Agent
Try executing the next atomic task in the included sample project (**Minimal Local Bookmark Manager**):

```text
Read AGENTS.md and execute TASK-02 using skills/02-task-executor.md.
```

Once the agent finishes editing `03-src/app.js`, inspect `git diff`, test `03-src/index.html` in your browser, mark `TASK-02` as `DONE` in `02-tasks/tasks.csv`, and commit!

---

## Repository Directory Structure

```text
.
├── LICENSE                        # Standard MIT License
├── README.md                      # Workspace overview & quickstart guide
├── AGENTS.md                      # Governance & scope-lock rules for AI coding agents
├── CLAUDE.md                      # Identical governance rules for Claude Code / Anthropic agents
├── PLAYBOOK.md                    # 5-phase SOP for humans and AI agents
├── 00-console/
│   └── dashboard.html             # Zero-dependency dark-mode visual console for tasks.csv
├── 01-specs/
│   ├── PRD.md                     # Product Requirements Document (Sample: Bookmark Manager)
│   └── ARCHITECTURE.md            # Technical Architecture & file boundaries
├── 02-tasks/
│   └── tasks.csv                  # Atomic task matrix with scope_files locks & statuses
├── 03-src/                        # Application source code (Sample at TASK-01 DONE state)
│   ├── index.html                 # Semantic HTML5 layout and form controls
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

## Starting Your Own Project

This template ships with a small sample app (**DevMarks — Minimal Local Bookmark Manager**) where `TASK-01` is completed (`DONE`) and `TASK-02` through `TASK-04` are queued (`TODO`) so you can try the workflow immediately.

When you are ready to replace the sample project with your own application:

1. **Clean Sample Source Files:**
   Remove the sample files inside `03-src/`:
   ```bash
   rm -rf 03-src/*
   ```
2. **Write Your Specifications:**
   - Replace `01-specs/PRD.md` with your product's user stories, features, and acceptance criteria.
   - Replace `01-specs/ARCHITECTURE.md` with your tech stack and target file tree inside `03-src/`.
3. **Generate Your Task Matrix:**
   Prompt your AI agent:
   ```text
   Follow skills/01-spec-to-tasks.md to generate a fresh 02-tasks/tasks.csv from 01-specs/PRD.md and 01-specs/ARCHITECTURE.md.
   ```
4. **Verify & Build:**
   Run `node scripts/check.mjs`, review the plan in `00-console/dashboard.html`, and execute one task at a time via `skills/02-task-executor.md`.

---

## License

Released under the [MIT License](./LICENSE).
