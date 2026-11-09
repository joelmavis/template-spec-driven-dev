# Spec-Driven Development Playbook

This playbook defines the 5-phase workflow between human developers and AI coding agents to build deterministic, verifiable software with strict file-scope control.

---

## Workflow Overview

```
[Phase 1: Specs] ──> [Phase 2: Task Matrix] ──> [Phase 3: Visual Inspection]
                                                          │
[Phase 5: Diff Verification] <── [Phase 4: Atomic Execution] <┘
```

---

## Phase 1: Write Specs (`01-specs/`)

**Where:** `01-specs/PRD.md` & `01-specs/ARCHITECTURE.md`

1. Open `01-specs/PRD.md` and define the product requirements:
   - Core user stories and workflows.
   - Functional requirements and edge cases.
   - Measurable acceptance criteria for each capability.
2. Open `01-specs/ARCHITECTURE.md` and define the technical boundaries:
   - Directory layout and file responsibilities inside `03-src/`.
   - Data structures, storage keys, state flow, and coding conventions.

> **Gate 1:** Specifications are unambiguous and every planned source file is documented in `01-specs/ARCHITECTURE.md`.

---

## Phase 2: Generate the Task Matrix (`02-tasks/tasks.csv`)

**Where:** Agent Chat Panel

1. Send this prompt to your Agent:
   ```text
   Follow skills/01-spec-to-tasks.md to decompose 01-specs/PRD.md and 01-specs/ARCHITECTURE.md into atomic tasks in 02-tasks/tasks.csv.
   ```
2. The agent populates `02-tasks/tasks.csv` with the exact schema:
   - `task_id`: Unique sequential identifier (e.g., `TASK-01`, `TASK-02`).
   - `phase`: Logical milestone (`Setup`, `Core`, `Feature`, `Audit`).
   - `title`: Concise summary of the atomic work unit.
   - `scope_files`: Semicolon-separated list of allowed file paths inside `03-src/` (e.g., `03-src/app.js;03-src/style.css`).
   - `status`: Current state (`TODO`, `IN_PROGRESS`, `DONE`).
   - `acceptance_criteria`: Concrete, testable outcome verifying the task is complete.

> **Gate 2:** Every task touches as few files as possible and has a verifiable acceptance criterion.

---

## Phase 3: Visual Inspection (`00-console/dashboard.html` & `scripts/check.mjs`)

**Where:** Puppyone File Tree (HTML Preview) & Terminal

1. Click **`00-console/dashboard.html`** directly in the Puppyone file tree to open the built-in HTML preview:
   - Inspect **Total Tasks**, **Completed**, **In Progress**, **Pending**, and **Completion Rate (%)**.
   - Review the **Locked Scope Files** tags for each task to ensure proper isolation.
2. *(Optional)* Run the validation script in the terminal to verify CSV syntax and file scope safety:
   ```bash
   node scripts/check.mjs
   ```

> **Gate 3:** The roadmap in `00-console/dashboard.html` matches expectations and `node scripts/check.mjs` exits with code `0`.

---

## Phase 4: Atomic Execution (`skills/02-task-executor.md`)

**Where:** Agent Chat Panel

1. Assign a single atomic task to your Agent:
   ```text
   Read AGENTS.md and execute TASK-02 using skills/02-task-executor.md.
   ```
2. During execution, the Agent follows `AGENTS.md` / `CLAUDE.md`:
   - Reads `01-specs/PRD.md`, `01-specs/ARCHITECTURE.md`, and the target row in `02-tasks/tasks.csv`.
   - Modifies **only** the files listed in `scope_files` for `TASK-02`.
   - Stops immediately after completing the code changes for `TASK-02`.

> **Gate 4:** Only files declared in `scope_files` are modified.

---

## Phase 5: Diff Verification & HTML Preview (`skills/03-diff-auditor.md`)

**Where:** Puppyone Diff Viewer & HTML Preview

1. Inspect the modified files in the **Diff Viewer** (or send `Run skills/03-diff-auditor.md for TASK-02` in Agent Chat).
2. Click **`03-src/index.html`** directly in Puppyone to preview the application and verify `acceptance_criteria`.
3. Once verified:
   - Update the task's `status` in `02-tasks/tasks.csv` to `DONE`.
   - Stage and commit the atomic unit in Git:
     ```bash
     git add .
     git commit -m "feat(TASK-02): implement bookmark addition and localStorage persistence"
     ```
4. Repeat **Phase 4** and **Phase 5** for the next task until completion rate reaches `100%`.
