# Technical Architecture: Minimal Local Bookmark Manager

**Document Version:** 1.0.0  
**Architecture Paradigm:** Zero-Dependency Vanilla HTML5 / CSS3 / ES6 Module  
**Source Root:** `03-src/`

---

## 1. System Structure & File Responsibilities

The application is strictly partitioned into three files inside `03-src/` to demonstrate clean separation of concerns and enable fine-grained `scope_files` locking in `02-tasks/tasks.csv`.

```text
03-src/
├── index.html   # Semantic HTML5 structure, form controls, filter bar, and #bookmark-grid container
├── style.css    # Design tokens (CSS variables), responsive grid, card styling, filter pills, and toast UI
└── app.js       # State management, localStorage persistence, DOM rendering, filtering, and URL validation
```

| File | Responsibility | Assigned Tasks |
| :--- | :--- | :--- |
| `03-src/index.html` | Document skeleton, navbar, `#bookmark-form`, `#filter-bar`, `#bookmark-grid`, `#toast-container` | `TASK-01` |
| `03-src/style.css` | Dark/light theme tokens, layout grid, form controls, category badges, active filter states | `TASK-01`, `TASK-03` |
| `03-src/app.js` | Application state store, `localStorage` I/O, event listeners, card rendering, tag filtering, URL validation | `TASK-02`, `TASK-03`, `TASK-04` |

---

## 2. Data Model & Storage Schema

### 2.1 Bookmark Entity
Each bookmark item stored in memory and persisted in `localStorage` conforms to the following JSON schema:

```json
{
  "id": "bm_1730800000000_a1b2c",
  "title": "MDN Web Docs — URL API",
  "url": "https://developer.mozilla.org/en-US/docs/Web/API/URL",
  "category": "Docs",
  "createdAt": "2026-11-05T10:00:00.000Z"
}
```

### 2.2 `localStorage` Contract
- **Storage Key:** `devmarks_bookmarks_v1`
- **Format:** JSON-serialized array of `Bookmark` objects.
- **Fallback:** If `localStorage` is empty or contains malformed JSON, the application initializes securely with an empty array `[]`.

---

## 3. State Management & Data Flow (`03-src/app.js`)

The application uses a unidirectional state-to-DOM flow encapsulated inside `03-src/app.js`:

```
[User Event (Submit / Filter / Delete)]
          │
          ▼
[Validation & State Mutation (state.bookmarks / state.activeCategory)]
          │
          ▼
[Persistence Sync (localStorage.setItem)]
          │
          ▼
[Declarative Render (renderBookmarks() + updateCounts())]
```

### Core Module Functions in `03-src/app.js`
1. `loadBookmarksFromStorage()`: Reads and parses `devmarks_bookmarks_v1` from `localStorage`.
2. `saveBookmarksToStorage(bookmarks)`: Serializes the current bookmark array into `localStorage`.
3. `validateBookmarkInput(title, rawUrl)`: Checks for non-empty strings and verifies valid `http:` or `https:` URL syntax (`TASK-04`).
4. `addBookmark(title, url, category)`: Prepends a new bookmark entry, persists state, and triggers UI render (`TASK-02`).
5. `deleteBookmark(id)`: Filters out the target bookmark by `id`, persists state, and triggers UI render (`TASK-02`).
6. `setFilterCategory(category)`: Updates `state.activeCategory`, toggles pill active states, and re-renders filtered cards (`TASK-03`).
7. `renderBookmarks()`: Clears and populates `#bookmark-grid` based on `state.bookmarks` and `state.activeCategory`.
8. `showToast(message, type)`: Renders a temporary notification banner inside `#toast-container` (`TASK-04`).

---

## 4. Styling & Design System (`03-src/style.css`)

- **CSS Custom Properties:** All colors, spacing, border radii, and shadows are defined on `:root` (with automatic `@media (prefers-color-scheme: light)` adaptation).
- **Responsive Grid:** `#bookmark-grid` uses `grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))` to adapt seamlessly across mobile, tablet, and desktop viewports.
- **Category Badges:** Distinct semantic badge colors for `Docs` (blue), `Tools` (emerald), `Articles` (amber), and `GitHub` (purple).
