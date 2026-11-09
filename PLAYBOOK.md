# Spec-Driven Development Playbook

Welcome to the **Spec-Driven Development (SDD)** standard operating procedure. This playbook defines the 5-phase workflow between human developers and AI coding agents to build deterministic, verifiable software with complete local context control.

---

## Workflow Overview

```
[Phase 1: Specs] ──> [Phase 2: Task Matrix] ──> [Phase 3: Visual Inspection]
                                                          │
[Phase 5: Diff Verification] <── [Phase 4: Atomic Execution] <┘
```

---

## Phase 1: Specs (`01-specs/`)

**Actor:** Human Developer (or Human + Agent in planning mode)

1. Open `01-specs/PRD.md` and define or refine the product requirements:
   - Core user stories and workflows.
   - Functional requirements and edge cases.
   - Measurable acceptance criteria for each capability.
2. Open `01-specs/ARCHITECTURE.md` and establish the technical boundaries:
   - Directory layout and file responsibilities inside `03-src/`.
   - Data structures, storage keys, state flow, and coding conventions.
   - Zero-dependency or library constraints.

> **Gate 1:** Specifications are unambiguous and every planned source file is documented in `01-specs/ARCHITECTURE.md`.

---

## Phase 2: Task Matrix (`02-tasks/tasks.csv`)

**Actor:** AI Agent guided by `skills/01-spec-to-tasks.md`

1. Instruct your AI coding agent:
   ```text
   Follow skills/01-spec-to-tasks.md to decompose 01-specs/PRD.md and 01-specs/ARCHITECTURE.md into atomic tasks in 02-tasks/tasks.csv.
   ```
2. The agent generates or updates rows in `02-tasks/tasks.csv` with the exact schema:
   - `task_id`: Unique sequential identifier (e.g., `TASK-01`, `TASK-02`).
   - `phase`: Logical milestone (`Setup`, `Core`, `Feature`, `Audit`).
   - `title`: Concise imperative summary of the atomic work unit.
   - `scope_files`: Semicolon-separated list of allowed file paths inside `03-src/` (e.g., `03-src/app.js;03-src/style.css`).
   - `status`: Current state (`TODO`, `IN_PROGRESS`, `DONE`).
   - `acceptance_criteria`: Concrete, testable outcome verifying the task is complete.

> **Gate 2:** Every task touches as few files as possible and has a verifiable acceptance criterion.

---

## Phase 3: Visual Inspection (`scripts/check.mjs` & `00-console/dashboard.html`)

**Actor:** Human Developer

1. Run the local validation script in your terminal to verify CSV integrity and file scope safety:
   ```bash
   node scripts/check.mjs
   ```
2. Open `00-console/dashboard.html` in any browser (either via a local static server or directly opening the file and loading `02-tasks/tasks.csv`):
   - Inspect the **Total Tasks**, **Completed**, **In Progress**, **Pending**, and **Completion Rate (%)** metrics.
   - Review the **Scope Files** badges for each task to ensure proper isolation.
   - Confirm the execution order before unlocking the agent on source code.

> **Gate 3:** `node scripts/check.mjs` exits with code `0` and the roadmap in `00-console/dashboard.html` matches expectations.

---

## Phase 4: Atomic Execution (`skills/02-task-executor.md`)

**Actor:** AI Agent

1. Assign a single atomic task to your agent:
   ```text
   Execute TASK-02 using skills/02-task-executor.md.
   ```
2. During execution, the agent adheres strictly to `AGENTS.md` / `CLAUDE.md`:
   - Reads `01-specs/PRD.md`, `01-specs/ARCHITECTURE.md`, and the target row in `02-tasks/tasks.csv`.
   - Modifies **only** the files listed in `scope_files` for `TASK-02`.
   - Leaves all other files untouched.
   - Stops immediately after completing the code changes for `TASK-02`.

> **Gate 4:** Only files declared in `scope_files` appear in `git status --short`.

---

## Phase 5: Diff Verification (`skills/03-diff-auditor.md`)

**Actor:** Human Developer + AI Diff Auditor

1. Inspect the working tree changes in your Git diff viewer (or run `skills/03-diff-auditor.md` to have the agent self-audit against scope locks and acceptance criteria).
2. Open `03-src/index.html` in the browser to test the behavior specified in `acceptance_criteria`.
3. Once verified:
   - Update the task's `status` in `02-tasks/tasks.csv` to `DONE`.
   - Re-run `node scripts/check.mjs` to confirm clean status.
   - Stage and commit the atomic unit in Git:
     ```bash
     git add .
     git commit -m "feat(TASK-02): implement bookmark addition and localStorage persistence"
     ```
4. Repeat **Phase 4** and **Phase 5** for the next task until completion rate reaches `100%`.
