#!/usr/bin/env node
/**
 * Spec-Driven Development Workspace Validator (scripts/check.mjs)
 * Zero-dependency Node.js ESM script that validates:
 *   1. Presence and non-emptiness of core workspace files
 *   2. CSV syntax and required schema headers in 02-tasks/tasks.csv
 *   3. Valid status values and task_id formatting
 *   4. That all files declared in scope_files reside within 03-src/ and exist (or can be created in 03-src/)
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const TASKS_CSV_PATH = path.join(ROOT_DIR, '02-tasks', 'tasks.csv');
const SRC_DIR = path.join(ROOT_DIR, '03-src');

const REQUIRED_HEADERS = [
  'task_id',
  'phase',
  'title',
  'scope_files',
  'status',
  'acceptance_criteria',
];

const VALID_STATUSES = new Set(['TODO', 'IN_PROGRESS', 'DONE']);

const REQUIRED_WORKSPACE_FILES = [
  'LICENSE',
  'README.md',
  'AGENTS.md',
  'CLAUDE.md',
  'PLAYBOOK.md',
  '00-console/dashboard.html',
  '01-specs/PRD.md',
  '01-specs/ARCHITECTURE.md',
  '02-tasks/tasks.csv',
  'skills/01-spec-to-tasks.md',
  'skills/02-task-executor.md',
  'skills/03-diff-auditor.md',
];

/**
 * Parse a single CSV line respecting RFC-4180 double quotes.
 * @param {string} line
 * @returns {string[] | null}
 */
function parseCsvLine(line) {
  const fields = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      fields.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }

  if (inQuotes) {
    return null; // Unclosed quote syntax error
  }

  fields.push(current.trim());
  return fields;
}

function pad(str, width) {
  const s = String(str ?? '');
  return s.length >= width ? s.slice(0, width - 1) + '…' : s.padEnd(width, ' ');
}

function main() {
  const errors = [];
  const warnings = [];

  console.log('================================================================================');
  console.log(' Spec-Driven Development · Workspace & Task Matrix Check');
  console.log('================================================================================\n');

  // 1. Validate core workspace files exist
  for (const relPath of REQUIRED_WORKSPACE_FILES) {
    const absPath = path.join(ROOT_DIR, relPath);
    if (!fs.existsSync(absPath)) {
      errors.push(`Missing required workspace file: ${relPath}`);
    } else {
      const stat = fs.statSync(absPath);
      if (stat.size === 0) {
        errors.push(`Workspace file is empty (0 bytes): ${relPath}`);
      }
    }
  }

  if (!fs.existsSync(TASKS_CSV_PATH)) {
    console.error('✖ Fatal: 02-tasks/tasks.csv does not exist.');
    process.exit(1);
  }

  // 2. Read and validate 02-tasks/tasks.csv
  const rawCsv = fs.readFileSync(TASKS_CSV_PATH, 'utf8');
  const lines = rawCsv
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length < 2) {
    errors.push('02-tasks/tasks.csv must contain a header row and at least one task row.');
  }

  const headerFields = lines.length > 0 ? parseCsvLine(lines[0]) : [];
  if (!headerFields) {
    errors.push('CSV header row has unclosed quotes.');
  } else {
    const matchesSchema =
      headerFields.length === REQUIRED_HEADERS.length &&
      REQUIRED_HEADERS.every((col, idx) => headerFields[idx] === col);

    if (!matchesSchema) {
      errors.push(
        `Invalid CSV headers. Expected "${REQUIRED_HEADERS.join(',')}", found "${headerFields.join(',')}"`
      );
    }
  }

  // 3. Validate each task row
  const tasks = [];
  const seenIds = new Set();

  for (let i = 1; i < lines.length; i++) {
    const rowNumber = i + 1;
    const fields = parseCsvLine(lines[i]);

    if (!fields) {
      errors.push(`Row ${rowNumber}: Malformed CSV syntax (unclosed quote).`);
      continue;
    }

    if (fields.length !== REQUIRED_HEADERS.length) {
      errors.push(
        `Row ${rowNumber}: Expected ${REQUIRED_HEADERS.length} columns, found ${fields.length}.`
      );
      continue;
    }

    const [task_id, phase, title, scope_files, status, acceptance_criteria] = fields;

    if (!/^TASK-\d{2,}$/.test(task_id)) {
      errors.push(`Row ${rowNumber}: Invalid task_id "${task_id}" (expected format TASK-XX).`);
    }
    if (seenIds.has(task_id)) {
      errors.push(`Row ${rowNumber}: Duplicate task_id "${task_id}".`);
    }
    seenIds.add(task_id);

    if (!phase) {
      errors.push(`Row ${rowNumber} (${task_id}): "phase" cannot be empty.`);
    }
    if (!title) {
      errors.push(`Row ${rowNumber} (${task_id}): "title" cannot be empty.`);
    }
    if (!acceptance_criteria) {
      errors.push(`Row ${rowNumber} (${task_id}): "acceptance_criteria" cannot be empty.`);
    }
    if (!VALID_STATUSES.has(status)) {
      errors.push(
        `Row ${rowNumber} (${task_id}): Invalid status "${status}". Allowed: TODO, IN_PROGRESS, DONE.`
      );
    }

    // Validate scope_files
    const scopes = scope_files
      .split(';')
      .map((s) => s.trim())
      .filter(Boolean);

    if (scopes.length === 0) {
      errors.push(`Row ${rowNumber} (${task_id}): "scope_files" must declare at least one file.`);
    }

    for (const scopeFile of scopes) {
      const normalized = scopeFile.replace(/\\/g, '/');
      if (!normalized.startsWith('03-src/') || normalized.includes('..')) {
        errors.push(
          `Row ${rowNumber} (${task_id}): Scope file "${scopeFile}" must reside strictly inside 03-src/.`
        );
        continue;
      }

      const absScopePath = path.resolve(ROOT_DIR, normalized);
      if (!absScopePath.startsWith(SRC_DIR + path.sep)) {
        errors.push(
          `Row ${rowNumber} (${task_id}): Scope path traversal detected in "${scopeFile}".`
        );
        continue;
      }

      const parentDir = path.dirname(absScopePath);
      const exists = fs.existsSync(absScopePath);
      const canCreate = fs.existsSync(parentDir);

      if (status === 'DONE' && !exists) {
        errors.push(
          `Row ${rowNumber} (${task_id}): Task is marked DONE but scoped file "${scopeFile}" does not exist.`
        );
      } else if (!exists && !canCreate) {
        errors.push(
          `Row ${rowNumber} (${task_id}): Parent directory for scoped file "${scopeFile}" does not exist inside 03-src/.`
        );
      } else if (!exists) {
        warnings.push(`${task_id}: Scoped file "${scopeFile}" will be created inside 03-src/.`);
      }
    }

    tasks.push({
      task_id,
      phase,
      title,
      scope_files,
      status,
      acceptance_criteria,
    });
  }

  // 4. Print Terminal Summary Table
  const colWidths = {
    id: 9,
    phase: 9,
    status: 13,
    scope: 34,
    title: 44,
  };

  const divider =
    '─'.repeat(colWidths.id) +
    '─┼─' +
    '─'.repeat(colWidths.phase) +
    '─┼─' +
    '─'.repeat(colWidths.status) +
    '─┼─' +
    '─'.repeat(colWidths.scope) +
    '─┼─' +
    '─'.repeat(colWidths.title);

  console.log(
    `${pad('TASK ID', colWidths.id)} │ ${pad('PHASE', colWidths.phase)} │ ${pad(
      'STATUS',
      colWidths.status
    )} │ ${pad('SCOPE FILES', colWidths.scope)} │ ${pad('TITLE', colWidths.title)}`
  );
  console.log(divider);

  for (const t of tasks) {
    console.log(
      `${pad(t.task_id, colWidths.id)} │ ${pad(t.phase, colWidths.phase)} │ ${pad(
        t.status,
        colWidths.status
      )} │ ${pad(t.scope_files, colWidths.scope)} │ ${pad(t.title, colWidths.title)}`
    );
  }

  console.log('');

  const total = tasks.length;
  const doneCount = tasks.filter((t) => t.status === 'DONE').length;
  const inProgressCount = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
  const todoCount = tasks.filter((t) => t.status === 'TODO').length;
  const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  console.log(
    `Summary: ${total} Total │ ${doneCount} DONE │ ${inProgressCount} IN_PROGRESS │ ${todoCount} TODO │ Completion: ${pct}%`
  );

  if (warnings.length > 0) {
    console.log('\nNotes:');
    for (const w of warnings) {
      console.log(`  ℹ ${w}`);
    }
  }

  if (errors.length > 0) {
    console.error('\n✖ Validation Failed with Errors:');
    for (const err of errors) {
      console.error(`  - ${err}`);
    }
    process.exit(1);
  }

  console.log('\n✔ Workspace validation passed! All specs, tasks, and scope locks are healthy.');
  process.exit(0);
}

main();
