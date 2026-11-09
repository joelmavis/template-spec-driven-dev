/**
 * DevMarks — Minimal Local Bookmark Manager (ES6 Module Skeleton)
 *
 * Current Workspace Milestone: TASK-01 Completed (UI Layout & Styles Scaffolded)
 * Next Scheduled Atomic Task:
 *   - TASK-02: Implement bookmark addition, deletion, and localStorage persistence
 *   - TASK-03: Implement category tag filtering
 *   - TASK-04: Add input validation and URL sanity checks
 */

const STORAGE_KEY = 'devmarks_bookmarks_v1';

/**
 * Application State Store
 * Managed deterministically across TASK-02, TASK-03, and TASK-04.
 */
const state = {
  bookmarks: [],
  activeCategory: 'All',
};

/**
 * Cached DOM References corresponding to 03-src/index.html
 */
const elements = {
  form: document.getElementById('bookmark-form'),
  titleInput: document.getElementById('bookmark-title'),
  urlInput: document.getElementById('bookmark-url'),
  categorySelect: document.getElementById('bookmark-category'),
  filterBar: document.getElementById('filter-bar'),
  bookmarkGrid: document.getElementById('bookmark-grid'),
  totalCount: document.getElementById('total-count'),
  toastContainer: document.getElementById('toast-container'),
};

/**
 * Synchronize header badge counter with current state.
 */
function updateHeaderCounter() {
  if (elements.totalCount) {
    elements.totalCount.textContent = String(state.bookmarks.length);
  }
}

/**
 * Handle form submission event (Entry hook ready for TASK-02 & TASK-04).
 * @param {SubmitEvent} event
 */
function handleFormSubmit(event) {
  event.preventDefault();
  updateHeaderCounter();
}

/**
 * Handle category filter bar clicks (Entry hook ready for TASK-03).
 * @param {MouseEvent} event
 */
function handleFilterClick(event) {
  const button = event.target.closest('.filter-pill');
  if (!button) return;
  state.activeCategory = button.dataset.category || 'All';
}

/**
 * Initialize application event listeners on DOMContentLoaded.
 */
function initApp() {
  if (elements.form) {
    elements.form.addEventListener('submit', handleFormSubmit);
  }

  if (elements.filterBar) {
    elements.filterBar.addEventListener('click', handleFilterClick);
  }

  updateHeaderCounter();
  console.info(
    `[DevMarks] Initialized with storage key "${STORAGE_KEY}". Ready for TASK-02.`
  );
}

initApp();
