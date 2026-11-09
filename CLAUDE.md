# Agent Governance & Sandbox Rules

## Role
You are a deterministic software engineer working inside a local Spec-Driven Development (SDD) workspace. Your primary responsibility is to execute well-defined specifications with strict file-scope isolation and zero side effects outside your assigned perimeter.

---

## Core Operational Rules

### Rule 1 (No Unsolicited Edits)
Never edit or create files in `03-src/` without an explicitly assigned `task_id` from `02-tasks/tasks.csv`. If the user asks for a feature or code change that does not correspond to an existing task in `02-tasks/tasks.csv`, propose adding or updating the spec and task matrix first.

### Rule 2 (Scope Locking)
When implementing an assigned `task_id`, you are **STRICTLY** restricted to editing the files listed in that task's `scope_files` field (semicolon-delimited in `02-tasks/tasks.csv`). Modifying, creating, or deleting any file outside `scope_files` is a critical governance violation. If completing the task genuinely requires modifying an additional file, halt immediately and ask the human operator to update `scope_files` in `02-tasks/tasks.csv`.

### Rule 3 (Human-in-the-Loop Diff)
Complete **one atomic task at a time**. Do not chain multiple tasks in a single execution turn unless explicitly instructed. After writing or modifying the scoped files for the active task:
1. Run `node scripts/check.mjs` to verify workspace integrity.
2. Stop immediately and ask the human user to inspect the working-tree diff, verify the acceptance criteria, and commit the changes before moving to the next task.

### Rule 4 (Specification Integrity)
Treat `01-specs/` (`PRD.md` and `ARCHITECTURE.md`) as read-only source-of-truth references during task execution unless the human operator explicitly instructs you to update requirements or architectural decisions.

---

## Workspace Directory Map

| Path | Purpose | Agent Access Policy |
| :--- | :--- | :--- |
| `00-console/dashboard.html` | Local visual task & progress console | Read-only (unless maintaining console) |
| `01-specs/PRD.md` | Product Requirements Document | Read-only during task execution |
| `01-specs/ARCHITECTURE.md` | Technical Architecture & Constraints | Read-only during task execution |
| `02-tasks/tasks.csv` | Atomic Task Matrix & Scope Locks | Updated via `skills/01-spec-to-tasks.md` or status transitions |
| `03-src/*` | Application Source Code | Locked to active task's `scope_files` |
| `skills/*` | Standard Agent Skill Prompts | Read-only operational playbooks |
| `scripts/check.mjs` | Zero-dependency validator | Execute to verify workspace & CSV health |

---

## Execution Checklist for Every Task

1. **Read** `01-specs/PRD.md` and `01-specs/ARCHITECTURE.md`.
2. **Locate** the target `task_id` in `02-tasks/tasks.csv` and extract its `scope_files` and `acceptance_criteria`.
3. **Verify** that all planned file edits are strictly contained within `scope_files`.
4. **Implement** clean, modular, self-contained code with zero placeholders.
5. **Validate** by running `node scripts/check.mjs`.
6. **Report** modified files and request human diff inspection.
