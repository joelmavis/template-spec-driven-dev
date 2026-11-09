# Skill 01: Spec-to-Tasks Decomposer (`01-spec-to-tasks`)

## Purpose
Transform human-authored product and technical specifications in `01-specs/PRD.md` and `01-specs/ARCHITECTURE.md` into an ordered, scope-locked, atomic task matrix stored in `02-tasks/tasks.csv`.

---

## Inputs
1. `01-specs/PRD.md` — Functional requirements, user flows, and feature acceptance rules.
2. `01-specs/ARCHITECTURE.md` — File boundaries inside `03-src/`, module responsibilities, and data structures.
3. `02-tasks/tasks.csv` (if existing) — Preserve `DONE` statuses for tasks that have already been verified.

---

## Output Contract (`02-tasks/tasks.csv`)

You must write valid CSV to `02-tasks/tasks.csv` with the **exact header row**:

```csv
task_id,phase,title,scope_files,status,acceptance_criteria
```

### Column Formatting Rules
1. `task_id`: Sequential identifier formatted as `TASK-01`, `TASK-02`, `TASK-03`, etc.
2. `phase`: One of `Setup`, `Core`, `Feature`, or `Audit`.
3. `title`: Concise, imperative description of the atomic change (under 80 characters; avoid raw commas or wrap in double quotes `""`).
4. `scope_files`: Semicolon-delimited (`;`) relative paths inside `03-src/` that the agent is permitted to create or edit during this task (e.g., `03-src/index.html;03-src/style.css` or `03-src/app.js`).
   - **Principle of Minimal Scope:** Never include a file in `scope_files` unless the task directly requires modifying it.
5. `status`: Must be one of `TODO`, `IN_PROGRESS`, or `DONE`. New unimplemented tasks start as `TODO`.
6. `acceptance_criteria`: Single-sentence, human-verifiable outcome (if the text contains commas, wrap the field in double quotes `"..."`).

---

## Step-by-Step Execution Procedure

1. **Read Specifications:** Parse `01-specs/PRD.md` and `01-specs/ARCHITECTURE.md` in full.
2. **Map Capabilities to Files:** Cross-reference every feature in `PRD.md` with the file structure in `ARCHITECTURE.md`.
3. **Decompose into Atomic Tasks:**
   - Group initial layout and static styling into a `Setup` task (`TASK-01`).
   - Group core state and persistence logic into `Core` tasks (`TASK-02`).
   - Group interactive filters or secondary UI flows into `Feature` tasks (`TASK-03`).
   - Group input validation, error handling, and edge-case hardening into `Audit` tasks (`TASK-04`).
4. **Write `02-tasks/tasks.csv`:** Ensure no trailing spaces or malformed CSV rows.
5. **Validate:** Execute `node scripts/check.mjs` to confirm that all columns, statuses, and `scope_files` paths pass structural checks.
6. **Halt & Report:** Present the updated task matrix to the human operator and suggest reviewing `00-console/dashboard.html` before starting task execution.
