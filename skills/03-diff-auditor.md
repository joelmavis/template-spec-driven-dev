# Skill 03: Diff & Scope Auditor (`03-diff-auditor`)

## Purpose
Audit uncommitted working-tree changes after an atomic task execution to verify scope-lock compliance, specification adherence, code safety, and generate a clean Conventional Commit message.

---

## Audit Procedure

When invoked for a specific `task_id` (e.g., `TASK-02`), perform the following checks in order:

### 1. Scope Lock Audit
1. Read the `scope_files` column for the target `task_id` in `02-tasks/tasks.csv`.
2. Inspect modified and untracked files using `git status --short` and `git diff --name-only`.
3. Verify that **every** modified file inside `03-src/` is present in `scope_files`.
   - If any unauthorized file was modified, mark the audit as **FAILED (Scope Violation)** and instruct how to revert the unauthorized file (`git checkout -- <file>`).

### 2. Acceptance Criteria & Spec Audit
1. Compare `git diff` against the task's `acceptance_criteria` in `02-tasks/tasks.csv` and the requirements in `01-specs/PRD.md` & `01-specs/ARCHITECTURE.md`.
2. Check for:
   - Complete implementation with zero `TODO` or placeholder comments.
   - Safe DOM manipulation (no unescaped `innerHTML` with raw user input).
   - Proper error handling and edge-case coverage.

### 3. Automated Workspace Validation
1. Execute `node scripts/check.mjs` and confirm it exits with status code `0`.

---

## Audit Report Output Format

Provide the human operator with a structured Markdown audit report:

```markdown
### Diff Audit Report — <TASK-ID>

- **Audit Verdict:** PASS / FAIL
- **Locked Scope (`tasks.csv`):** `<scope_files>`
- **Actual Modified Files:** `<git diff --name-only>`
- **Scope Compliance:** Verified (No out-of-scope edits)
- **Acceptance Criteria Check:** Verified (`<acceptance_criteria>`)

#### Recommended Git Commit
\`\`\`bash
git add .
git commit -m "feat(<TASK-ID>): <concise summary of atomic change>"
\`\`\`
```
