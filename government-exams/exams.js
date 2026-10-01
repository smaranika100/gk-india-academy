/**
 * GK INDIA ACADEMY — Government Exams Interactive Portal Engine
 * Modular, Accessible, and High-Performance
 */

document.addEventListener('DOMContentLoaded', () => {
  initGovernmentExamsPortal();
});

function initGovernmentExamsPortal() {
  // Check if exam data is loaded
  if (typeof examsData === 'undefined') {
    console.error('examsData is not loaded. Ensure exams-data.js is included before exams.js');
    return;
  }

  // DOM Elements
  const searchInput = document.getElementById('examSearchInput');
  const categorySelect = document.getElementById('examCategorySelect');
  const qualificationSelect = document.getElementById('examQualificationSelect');
  const clearFiltersBtn = document.getElementById('clearFiltersBtn');
  const examsGrid = document.getElementById('popularExamsGrid');
  const categoriesGrid = document.getElementById('examCategoriesGrid');
  const updatesGrid = document.getElementById('examUpdatesGrid');
  const quickLinksContainer = document.getElementById('quickLinksContainer');
  const resultsCountElem = document.getElementById('filterResultsCount');
  const activeChipsContainer = document.getElementById('activeFilterChips');

  // Stats elements
  const statQuestions = document.getElementById('statQuestions');
  const statExams = document.getElementById('statExams');
  const statCategories = document.getElementById('statCategories');
  const statDaily = document.getElementById('statDaily');

  // State
  let currentSearchQuery = '';
  let currentCategory = 'All Exams';
  let currentQualification = 'Any Qualification';

  // Check URL params for pre-selected category
  const urlParams = new URLSearchParams(window.location.search);
  const paramCategory = urlParams.get('category');
  if (paramCategory) {
    currentCategory = paramCategory;
    if (categorySelect) categorySelect.value = paramCategory;
  }

  // 1. Populate Configurable Statistics
  if (typeof examStatsData !== 'undefined') {
    if (statQuestions) statQuestions.textContent = examStatsData.questions;
    if (statExams) statExams.textContent = examStatsData.exams;
    if (statCategories) statCategories.textContent = examStatsData.categories;
    if (statDaily) statDaily.textContent = examStatsData.daily;
  }

  // 2. Render Quick Links
  function renderQuickLinks() {
    if (!quickLinksContainer || typeof quickLinksData === 'undefined') return;
    quickLinksContainer.innerHTML = '';

    quickLinksData.forEach(link => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `quick-link-btn ${currentCategory === link.category ? 'active' : ''}`;
      btn.textContent = link.label;
      btn.setAttribute('aria-label', `Filter by ${link.label} exams`);

      btn.addEventListener('click', () => {
        currentCategory = (currentCategory === link.category) ? 'All Exams' : link.category;
        if (categorySelect) categorySelect.value = currentCategory;
        updateActiveCategoryUI();
        filterAndRenderExams();
        // Scroll to exams section smoothly
        const examsSection = document.getElementById('popular-exams');
        if (examsSection) examsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });

      quickLinksContainer.appendChild(btn);
    });
  }

  // 3. Render Category Cards
  function renderCategoryCards() {
    if (!categoriesGrid || typeof examCategoriesData === 'undefined') return;
    categoriesGrid.innerHTML = '';

    examCategoriesData.forEach(cat => {
      const card = document.createElement('div');
      card.className = `exam-category-card ${currentCategory === cat.filterKey ? 'active' : ''}`;
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', `Explore ${cat.name}`);

      // Count exams in this category
      const count = examsData.filter(e => e.category.toLowerCase() === cat.filterKey.toLowerCase()).length;

      card.innerHTML = `
        <div class="cat-card-top">
          <div class="cat-icon-wrap ${cat.colorTheme}">
            <i class="fas ${cat.icon}"></i>
          </div>
          <span class="cat-count-badge">${count} Exams</span>
        </div>
        <h3 class="cat-card-title">${cat.name}</h3>
        <p class="cat-card-desc">${cat.shortDesc}</p>
        <div class="cat-card-action">
          <span>Explore Exams</span>
          <i class="fas fa-arrow-right"></i>
        </div>
      `;

      const selectCategory = () => {
        currentCategory = (currentCategory === cat.filterKey) ? 'All Exams' : cat.filterKey;
        if (categorySelect) categorySelect.value = currentCategory;
        updateActiveCategoryUI();
        filterAndRenderExams();

        const examsSection = document.getElementById('popular-exams');
        if (examsSection) examsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      };

      card.addEventListener('click', selectCategory);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectCategory();
        }
      });

      categoriesGrid.appendChild(card);
    });
  }

  function updateActiveCategoryUI() {
    // Update category card active states
    document.querySelectorAll('.exam-category-card').forEach((card, idx) => {
      const cat = examCategoriesData[idx];
      if (cat && cat.filterKey === currentCategory) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });

    // Update quick links active states
    document.querySelectorAll('.quick-link-btn').forEach((btn, idx) => {
      const link = quickLinksData[idx];
      if (link && link.category === currentCategory) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // 4. Status Badge Helper
  function getStatusBadgeHtml(status) {
    if (!status) return '';
    const slug = status.toLowerCase().replace(/\s+/g, '-');
    let icon = 'fa-clock';
    if (slug.includes('open')) icon = 'fa-door-open';
    if (slug.includes('closed')) icon = 'fa-lock';
    if (slug.includes('admit')) icon = 'fa-id-card';
    if (slug.includes('soon')) icon = 'fa-bell';
    if (slug.includes('result')) icon = 'fa-trophy';

    return `<span class="exam-status-badge status-${slug}"><i class="fas ${icon}"></i> ${status}</span>`;
  }

  // 5. Render Exam Cards
  function filterAndRenderExams() {
    if (!examsGrid) return;
    examsGrid.innerHTML = '';

    const query = currentSearchQuery.trim().toLowerCase();

    const filtered = examsData.filter(exam => {
      // Search text match
      const matchesSearch = !query ||
        exam.name.toLowerCase().includes(query) ||
        exam.organization.toLowerCase().includes(query) ||
        exam.category.toLowerCase().includes(query) ||
        exam.qualification.toLowerCase().includes(query) ||
        (exam.description && exam.description.toLowerCase().includes(query));

      // Category match
      const matchesCategory = (currentCategory === 'All Exams') ||
        (exam.category.toLowerCase() === currentCategory.toLowerCase());

      // Qualification match
      let matchesQualification = true;
      if (currentQualification !== 'Any Qualification') {
        matchesQualification = exam.qualification.toLowerCase().includes(currentQualification.toLowerCase());
      }

      return matchesSearch && matchesCategory && matchesQualification;
    });

    // Update results count
    if (resultsCountElem) {
      resultsCountElem.innerHTML = `Showing <strong>${filtered.length}</strong> of <strong>${examsData.length}</strong> examinations`;
    }

    // Update active filter chips
    renderActiveFilterChips();

    // Empty state
    if (filtered.length === 0) {
      examsGrid.innerHTML = `
        <div class="no-results-box">
          <div class="no-results-icon"><i class="fas fa-filter-circle-xmark"></i></div>
          <h3 class="no-results-title">No Examinations Match Your Criteria</h3>
          <p class="no-results-sub">Try changing the search keywords or resetting the category and qualification filters.</p>
          <button type="button" class="btn btn-primary" onclick="window.clearAllExamFilters()">
            <i class="fas fa-rotate-left"></i> Reset All Filters
          </button>
        </div>
      `;
      return;
    }

    // Render cards
    filtered.forEach(exam => {
      const card = document.createElement('article');
      card.className = 'gov-exam-card';
      card.setAttribute('data-category', exam.category);
      card.setAttribute('data-qualification', exam.qualification);

      // Reusable link URLs: support clean /government-exams/[slug] or detail.html?exam=[slug]
      const detailUrl = `/government-exams/${exam.slug}`;
      const mcqUrl = `/mcqs/${exam.mcqCategory || exam.category.toLowerCase().replace(/\s+/g, '-')}`;

      card.innerHTML = `
        <div class="exam-card-badge-row">
          <span class="exam-category-badge">${exam.category}</span>
          ${getStatusBadgeHtml(exam.status)}
        </div>
        <h3 class="gov-exam-title">${exam.name}</h3>
        <div class="gov-exam-org">
          <i class="fas fa-building-columns"></i>
          <span>${exam.organization}</span>
        </div>
        <div class="gov-exam-meta-grid">
          <div class="meta-item">
            <span class="meta-item-label">Qualification</span>
            <span class="meta-item-val" title="${exam.qualification}">${exam.qualification}</span>
          </div>
          <div class="meta-item">
            <span class="meta-item-label">Age Limit</span>
            <span class="meta-item-val" title="${exam.ageLimit}">${exam.ageLimit.split('(')[0].trim()}</span>
          </div>
        </div>
        <p class="gov-exam-desc">${exam.description}</p>
        <div class="gov-exam-card-actions">
          <a href="${detailUrl}" class="btn-exam-details" aria-label="View Details for ${exam.name}">
            <span>View Details</span>
            <i class="fas fa-arrow-right"></i>
          </a>
          <a href="${mcqUrl}" class="btn-exam-mcqs" aria-label="Practice MCQs for ${exam.name}">
            <i class="fas fa-pencil-alt"></i>
            <span>Practice MCQs</span>
          </a>
        </div>
      `;

      examsGrid.appendChild(card);
    });
  }

  // 6. Render Active Filter Chips
  function renderActiveFilterChips() {
    if (!activeChipsContainer) return;
    activeChipsContainer.innerHTML = '';

    if (currentSearchQuery.trim()) {
      const chip = document.createElement('span');
      chip.className = 'filter-chip';
      chip.innerHTML = `Search: "${currentSearchQuery.trim()}" <button aria-label="Clear search query" onclick="window.clearSearchQuery()"><i class="fas fa-times"></i></button>`;
      activeChipsContainer.appendChild(chip);
    }

    if (currentCategory !== 'All Exams') {
      const chip = document.createElement('span');
      chip.className = 'filter-chip';
      chip.innerHTML = `Category: ${currentCategory} <button aria-label="Clear category filter" onclick="window.clearCategoryFilter()"><i class="fas fa-times"></i></button>`;
      activeChipsContainer.appendChild(chip);
    }

    if (currentQualification !== 'Any Qualification') {
      const chip = document.createElement('span');
      chip.className = 'filter-chip';
      chip.innerHTML = `Qualification: ${currentQualification} <button aria-label="Clear qualification filter" onclick="window.clearQualificationFilter()"><i class="fas fa-times"></i></button>`;
      activeChipsContainer.appendChild(chip);
    }
  }

  // 7. Render Latest Exam Updates
  function renderExamUpdates() {
    if (!updatesGrid || typeof examUpdatesData === 'undefined') return;
    updatesGrid.innerHTML = '';

    examUpdatesData.forEach(upd => {
      const card = document.createElement('article');
      card.className = 'update-card';

      const readMoreUrl = upd.examSlug ? `/government-exams/${upd.examSlug}` : '#';

      card.innerHTML = `
        <div class="update-header-row">
          <span class="update-type-pill">${upd.updateType}</span>
          <span class="update-date-text"><i class="far fa-calendar-alt"></i> ${upd.date}</span>
        </div>
        <h4 class="update-exam-title">${upd.examName}</h4>
        <div class="update-org-name">${upd.organization}</div>
        <p class="update-summary">${upd.description}</p>
        <a href="${readMoreUrl}" class="update-read-btn">
          <span>Read More Details</span>
          <i class="fas fa-chevron-right"></i>
        </a>
      `;

      updatesGrid.appendChild(card);
    });
  }

  // 8. Event Listeners
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value;
      filterAndRenderExams();
    });
  }

  if (categorySelect) {
    categorySelect.addEventListener('change', (e) => {
      currentCategory = e.target.value;
      updateActiveCategoryUI();
      filterAndRenderExams();
    });
  }

  if (qualificationSelect) {
    qualificationSelect.addEventListener('change', (e) => {
      currentQualification = e.target.value;
      filterAndRenderExams();
    });
  }

  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', () => {
      window.clearAllExamFilters();
    });
  }

  // Global Filter Reset Helpers
  window.clearAllExamFilters = function() {
    currentSearchQuery = '';
    currentCategory = 'All Exams';
    currentQualification = 'Any Qualification';

    if (searchInput) searchInput.value = '';
    if (categorySelect) categorySelect.value = 'All Exams';
    if (qualificationSelect) qualificationSelect.value = 'Any Qualification';

    updateActiveCategoryUI();
    filterAndRenderExams();
  };

  window.clearSearchQuery = function() {
    currentSearchQuery = '';
    if (searchInput) searchInput.value = '';
    filterAndRenderExams();
  };

  window.clearCategoryFilter = function() {
    currentCategory = 'All Exams';
    if (categorySelect) categorySelect.value = 'All Exams';
    updateActiveCategoryUI();
    filterAndRenderExams();
  };

  window.clearQualificationFilter = function() {
    currentQualification = 'Any Qualification';
    if (qualificationSelect) qualificationSelect.value = 'Any Qualification';
    filterAndRenderExams();
  };

  // Initial Execution
  renderQuickLinks();
  renderCategoryCards();
  renderExamUpdates();
  filterAndRenderExams();
}
