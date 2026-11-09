# Skill 02: Atomic Task Executor (`02-task-executor`)

## Purpose
Execute a single assigned `task_id` from `02-tasks/tasks.csv` while strictly enforcing file-level scope locking (`scope_files`) and specification alignment.

---

## Pre-Execution Gate

Before touching any file in `03-src/`, verify:
1. A specific `task_id` (e.g., `TASK-02`) has been explicitly assigned by the human user.
2. You have read `AGENTS.md` / `CLAUDE.md`, `01-specs/PRD.md`, `01-specs/ARCHITECTURE.md`, and the target row in `02-tasks/tasks.csv`.

---

## Strict Scope-Lock Enforcement

Let `ALLOWED_FILES` be the semicolon-split list in the `scope_files` column of the assigned `task_id`.

- **ALLOWED:** Reading any file in the repository for context; editing or creating files listed in `ALLOWED_FILES`; updating the `status` column of the active task in `02-tasks/tasks.csv` if requested.
- **FORBIDDEN:** Editing, formatting, renaming, or creating any file in `03-src/` that is **not** explicitly listed in `ALLOWED_FILES`.

If you discover that fulfilling `acceptance_criteria` is impossible without modifying an out-of-scope file:
1. **STOP** immediately before making unauthorized edits.
2. Explain why the additional file is needed.
3. Ask the human operator to approve adding that file to `scope_files` in `02-tasks/tasks.csv`.

---

## Implementation Standards

1. **Zero Placeholders:** Never write `// TODO`, `// implement later`, or stubbed functions for the active task. Deliver complete, working code that satisfies the task's `acceptance_criteria`.
2. **Preserve Existing Functionality:** Do not break capabilities delivered by prior `DONE` tasks.
3. **Security & Clean Code:**
   - Use semantic DOM APIs (`textContent`, `createElement`, or safe HTML escaping) to prevent XSS.
   - Maintain modular ES6 functions and clear JSDoc comments as defined in `01-specs/ARCHITECTURE.md`.
   - Use zero external runtime dependencies unless explicitly permitted by `01-specs/ARCHITECTURE.md`.

---

## Post-Execution Handoff

Once the code changes for the single assigned `task_id` are complete:
1. Run `node scripts/check.mjs` to ensure workspace validity.
2. Run `git status --short` (if Git is available) to prove only `scope_files` were modified.
3. Present a concise summary containing:
   - **Assigned Task:** `task_id` & `title`
   - **Modified Files:** Exact list of changed files compared against `scope_files`
   - **How to Verify:** Step-by-step instructions to test `acceptance_criteria` in the browser
4. **Stop and wait** for the human user to inspect the diff and commit the changes.
