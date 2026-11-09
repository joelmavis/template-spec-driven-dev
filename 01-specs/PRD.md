# Product Requirements Document (PRD): Minimal Local Bookmark Manager

**Project Name:** Minimal Local Bookmark Manager  
**Document Version:** 1.0.0  
**Status:** Approved  
**Target Directory:** `03-src/`

---

## 1. Product Overview

The **Minimal Local Bookmark Manager** is a fast, zero-dependency, local-first web utility designed for developers to save, categorize, filter, and manage technical bookmarks right in their browser. All data is persisted strictly in the browser's `localStorage` without external servers, accounts, or cloud trackers.

---

## 2. User Personas & Goals

- **Developer / Engineer:** Needs a lightweight dashboard to organize documentation links, GitHub repositories, RFCs, and articles by category (`Docs`, `Tools`, `Articles`, `GitHub`) with instant filtering.
- **SDD Practitioners:** Uses this application as a practical reference project for learning Spec-Driven Development (SDD), scope-locked task execution, and human-in-the-loop diff auditing.

---

## 3. Core Features & Requirements

### 3.1 Responsive UI Layout & Form Controls (`TASK-01`)
- **Header / Navbar:** Displays the application title, subtitle, and total saved bookmark counter badge.
- **Bookmark Capture Form (`#bookmark-form`):**
  - **Title Input (`#bookmark-title`):** Text input for the human-readable resource title (e.g., `"MDN Web Docs — Fetch API"`).
  - **URL Input (`#bookmark-url`):** Input field for the target HTTP/HTTPS URL (e.g., `"https://developer.mozilla.org"`).
  - **Category Select (`#bookmark-category`):** Dropdown menu with predefined developer categories: `Docs`, `Tools`, `Articles`, and `GitHub`.
  - **Submit Button (`#submit-btn`):** Primary action button to add the bookmark.
- **Category Filter Bar (`#filter-bar`):** Horizontal pill group with buttons for `All`, `Docs`, `Tools`, `Articles`, and `GitHub`.
- **Bookmark Grid (`#bookmark-grid`):** Responsive CSS Grid container that renders saved bookmark cards or an informative empty-state message when no bookmarks match.

### 3.2 Bookmark Addition, Deletion & `localStorage` Persistence (`TASK-02`)
- **Storage Key:** All bookmark records are serialized as a JSON array under the `localStorage` key `devmarks_bookmarks_v1`.
- **Adding a Bookmark:**
  - Submitting `#bookmark-form` creates a new bookmark object with `{ id, title, url, category, createdAt }`.
  - Saves the updated array to `localStorage` and immediately re-renders `#bookmark-grid`.
  - Resets the form fields and updates the total bookmark count badge.
- **Deleting a Bookmark:**
  - Each rendered bookmark card includes a delete button (`data-action="delete"`).
  - Clicking delete removes the corresponding item by `id` from state and `localStorage`, then re-renders the grid.

### 3.3 Category Tag Filtering (`TASK-03`)
- **Interactive Filter Pills:**
  - Clicking any category button in `#filter-bar` (`All`, `Docs`, `Tools`, `Articles`, `GitHub`) sets the active filter state.
  - Updates the `.active` visual class on the selected filter pill.
  - Dynamically filters `#bookmark-grid` to show only bookmarks matching the selected category (or all bookmarks when `All` is active) without refreshing the page.

### 3.4 Input Validation & URL Sanity Checks (`TASK-04`)
- **Empty Field Prevention:**
  - Trims whitespace on title and URL inputs before processing.
  - Rejects submissions if either title or URL is empty.
- **URL Sanity Check:**
  - Validates URLs using the native `URL` constructor and enforces `http:` or `https:` protocols.
- **Inline Error Toast (`#toast-container`):**
  - Displays a non-blocking, accessible error notification whenever validation fails, and automatically dismisses it after 3.5 seconds.

---

## 4. Non-Functional Requirements

- **Zero External Dependencies:** Must run directly in any modern browser using standard HTML5, vanilla CSS3, and native ES6 JavaScript (`type="module"`).
- **Accessibility & UX:** Semantic HTML landmarks (`<header>`, `<main>`, `<section>`), keyboard-navigable controls, focus rings, and responsive layout from mobile (`360px`) to desktop (`1440px+`).
- **Security:** User-supplied strings (`title`, `url`, `category`) must be safely escaped or inserted via `textContent` / safe DOM APIs to prevent XSS injection.
