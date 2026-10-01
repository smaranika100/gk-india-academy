/**
 * GK India Academy - Admin Application Controller
 * Handles SPA navigation, views rendering, search, filters, CRUD modals,
 * Draft/Publish toggles, contact message workflow, and toast notifications.
 */

(function () {
  'use strict';

  // --- State & References ---
  let currentView = 'dashboard';
  let deleteTarget = null; // { collection, id, title }

  // Filter states
  const filterState = {
    topics: { search: '', subject: 'all', status: 'all' },
    questions: { search: '', subject: 'all', difficulty: 'all', status: 'all' },
    affairs: { search: '', category: 'all', status: 'all' },
    exams: { search: '', category: 'all', status: 'all' },
    materials: { search: '', subject: 'all', type: 'all', status: 'all' },
    messages: { search: '', status: 'all' }
  };

  // --- Toast Notifications ---
  function showToast(message, type = 'success', duration = 3500) {
    const container = document.getElementById('admin-toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `admin-toast toast-${type}`;

    let icon = 'fa-check-circle';
    if (type === 'error') icon = 'fa-circle-xmark';
    if (type === 'warning') icon = 'fa-triangle-exclamation';
    if (type === 'info') icon = 'fa-circle-info';

    toast.innerHTML = `
      <i class="fas ${icon} admin-toast-icon"></i>
      <span>${escapeHtml(message)}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(20px)';
      toast.style.transition = 'all 0.25s ease';
      setTimeout(() => toast.remove(), 250);
    }, duration);
  }

  // Helper: Escape HTML strings to prevent XSS
  function escapeHtml(str) {
    if (!str && str !== 0) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // --- Router & View Switcher ---
  function initRouter() {
    function handleRoute() {
      const hash = window.location.hash.replace('#', '') || 'dashboard';
      const validViews = ['dashboard', 'topics', 'questions', 'current-affairs', 'exams', 'study-materials', 'contact-messages'];
      const target = validViews.includes(hash) ? hash : 'dashboard';
      switchView(target);
    }

    window.addEventListener('hashchange', handleRoute);
    handleRoute();
  }

  function switchView(viewName) {
    currentView = viewName;

    // 1. Update Sidebar Active Links
    document.querySelectorAll('.admin-sidebar-nav .admin-nav-link').forEach(link => {
      const href = link.getAttribute('href') || '';
      const linkView = href.replace('/admin/dashboard', 'dashboard').replace('#', '').replace('/admin/', '');
      if (linkView === viewName || (viewName === 'dashboard' && (href.endsWith('dashboard') || href === '#dashboard'))) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // 2. Update Breadcrumb
    const breadcrumbActive = document.querySelector('.admin-breadcrumb-active');
    if (breadcrumbActive) {
      const labels = {
        'dashboard': 'Dashboard Overview',
        'topics': 'Topics Management',
        'questions': 'Questions (MCQs) Management',
        'current-affairs': 'Current Affairs Management',
        'exams': 'Government Exams Management',
        'study-materials': 'Study Materials Management',
        'contact-messages': 'Contact Messages Management'
      };
      breadcrumbActive.textContent = labels[viewName] || 'Dashboard';
    }

    // 3. Show / Hide Panels
    document.querySelectorAll('.admin-view-panel').forEach(panel => {
      if (panel.id === `view-${viewName}`) {
        panel.classList.add('is-active');
      } else {
        panel.classList.remove('is-active');
      }
    });

    // 4. Render Active View
    renderCurrentView();

    // 5. Scroll to top of content
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // --- Header / Sidebar Counts Update ---
  function updateSidebarBadges() {
    const stats = AdminStore.getStats();

    // Sidebar & KPI badges
    const unreadEl = document.getElementById('sidebar-msg-badge');
    if (unreadEl) {
      if (stats.messages.unread > 0) {
        unreadEl.textContent = `${stats.messages.unread} New`;
        unreadEl.style.backgroundColor = 'var(--admin-red)';
        unreadEl.style.color = '#ffffff';
        unreadEl.style.display = 'inline-block';
      } else {
        unreadEl.textContent = stats.messages.total;
        unreadEl.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
        unreadEl.style.color = 'rgba(255, 255, 255, 0.7)';
      }
    }

    const topbarMsgBadge = document.getElementById('topbar-msg-badge');
    if (topbarMsgBadge) {
      if (stats.messages.unread > 0) {
        topbarMsgBadge.textContent = `${stats.messages.unread} New`;
        topbarMsgBadge.style.display = 'inline-block';
      } else {
        topbarMsgBadge.style.display = 'none';
      }
    }

    const topicsBadge = document.getElementById('sidebar-topics-badge');
    if (topicsBadge) topicsBadge.textContent = stats.topics.total;

    const questionsBadge = document.getElementById('sidebar-questions-badge');
    if (questionsBadge) questionsBadge.textContent = stats.questions.total;

    const affairsBadge = document.getElementById('sidebar-affairs-badge');
    if (affairsBadge) affairsBadge.textContent = stats.affairs.total;

    const examsBadge = document.getElementById('sidebar-exams-badge');
    if (examsBadge) examsBadge.textContent = stats.exams.total;

    const materialsBadge = document.getElementById('sidebar-materials-badge');
    if (materialsBadge) materialsBadge.textContent = stats.materials.total;
  }

  // --- Generic Status Toggle (Draft <-> Published) ---
  window.handleTogglePublish = function (collection, id) {
    const updated = AdminStore.togglePublish(collection, id);
    if (updated) {
      const isPub = updated.status === 'published';
      showToast(`Status changed to ${isPub ? 'Published' : 'Draft'}`, isPub ? 'success' : 'info');
      renderCurrentView();
      updateSidebarBadges();
    }
  };

  // --- Deletion Flow with Confirmation Modal ---
  window.promptDelete = function (collection, id, title) {
    deleteTarget = { collection, id, title };
    const modal = document.getElementById('modal-delete-confirm');
    const titleEl = document.getElementById('delete-item-title');
    if (titleEl) titleEl.textContent = `"${title}"`;
    if (modal) modal.classList.add('is-active');
  };

  function initDeleteConfirmModal() {
    const modal = document.getElementById('modal-delete-confirm');
    const confirmBtn = document.getElementById('btn-confirm-delete');
    const cancelBtn = document.getElementById('btn-cancel-delete');
    const closeBtn = document.getElementById('modal-delete-close');

    function closeModal() {
      if (modal) modal.classList.remove('is-active');
      deleteTarget = null;
    }

    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    if (confirmBtn) {
      confirmBtn.addEventListener('click', function () {
        if (!deleteTarget) return;
        const { collection, id, title } = deleteTarget;
        const ok = AdminStore.remove(collection, id);
        closeModal();
        if (ok) {
          showToast(`Deleted "${title}" successfully`, 'warning');
          renderCurrentView();
          updateSidebarBadges();
        }
      });
    }
  }

  // --- 1. RENDER DASHBOARD ---
  function renderDashboard() {
    const stats = AdminStore.getStats();

    // Fill KPI numbers
    const kpiTopics = document.getElementById('kpi-topics-count');
    if (kpiTopics) kpiTopics.textContent = stats.topics.total;

    const kpiQuestions = document.getElementById('kpi-questions-count');
    if (kpiQuestions) kpiQuestions.textContent = stats.questions.total;

    const kpiAffairs = document.getElementById('kpi-affairs-count');
    if (kpiAffairs) kpiAffairs.textContent = stats.affairs.total;

    const kpiExams = document.getElementById('kpi-exams-count');
    if (kpiExams) kpiExams.textContent = stats.exams.total;

    const kpiMaterials = document.getElementById('kpi-materials-count');
    if (kpiMaterials) kpiMaterials.textContent = stats.materials.total;

    const kpiMessages = document.getElementById('kpi-messages-count');
    if (kpiMessages) kpiMessages.textContent = stats.messages.total;

    // Sub-labels
    const subTopics = document.getElementById('kpi-topics-sub');
    if (subTopics) subTopics.textContent = `${stats.topics.published} Published • ${stats.topics.draft} Drafts`;

    const subQuestions = document.getElementById('kpi-questions-sub');
    if (subQuestions) subQuestions.textContent = `${stats.questions.easy} Easy • ${stats.questions.medium} Med • ${stats.questions.hard} Hard`;

    const subMessages = document.getElementById('kpi-messages-sub');
    if (subMessages) {
      subMessages.textContent = `${stats.messages.unread} Unread • ${stats.messages.replied} Replied`;
      if (stats.messages.unread > 0) {
        subMessages.style.color = 'var(--admin-red)';
      } else {
        subMessages.style.color = 'var(--admin-green)';
      }
    }

    // Render Recent Activities Stream
    const activityList = document.getElementById('dashboard-activity-list');
    if (activityList) {
      const questions = AdminStore.getQuestions().slice(0, 3);
      const affairs = AdminStore.getCurrentAffairs().slice(0, 2);
      const messages = AdminStore.getContactMessages().slice(0, 2);

      let html = '';

      messages.forEach(m => {
        html += `
          <div class="admin-activity-item">
            <div class="admin-activity-left">
              <div class="admin-activity-icon" style="background: #fff7ed; color: #ea580c;">
                <i class="fas fa-inbox"></i>
              </div>
              <div>
                <div class="admin-activity-title">Inquiry from ${escapeHtml(m.name)}: "${escapeHtml(m.subject)}"</div>
                <div class="admin-activity-meta">${new Date(m.date).toLocaleDateString()} • Status: ${m.status.toUpperCase()}</div>
              </div>
            </div>
            <a href="#contact-messages" class="admin-btn-action" style="padding: 5px 10px; font-size: 0.75rem;">
              <i class="fas fa-eye"></i> View
            </a>
          </div>
        `;
      });

      affairs.forEach(a => {
        html += `
          <div class="admin-activity-item">
            <div class="admin-activity-left">
              <div class="admin-activity-icon" style="background: #ecfdf5; color: #059669;">
                <i class="fas fa-newspaper"></i>
              </div>
              <div>
                <div class="admin-activity-title">${escapeHtml(a.title)}</div>
                <div class="admin-activity-meta">${a.category} • ${a.date} • ${a.status.toUpperCase()}</div>
              </div>
            </div>
            <span class="admin-status-badge ${a.status}" onclick="handleTogglePublish('affairs', '${a.id}')">
              ${a.status}
            </span>
          </div>
        `;
      });

      questions.forEach(q => {
        html += `
          <div class="admin-activity-item">
            <div class="admin-activity-left">
              <div class="admin-activity-icon" style="background: #fef3c7; color: #d97706;">
                <i class="fas fa-circle-question"></i>
              </div>
              <div>
                <div class="admin-activity-title">${escapeHtml(q.question.substring(0, 75))}...</div>
                <div class="admin-activity-meta">${q.subject} • ${q.difficulty} • ${q.status.toUpperCase()}</div>
              </div>
            </div>
            <span class="admin-status-badge ${q.status}" onclick="handleTogglePublish('questions', '${q.id}')">
              ${q.status}
            </span>
          </div>
        `;
      });

      activityList.innerHTML = html || '<div class="admin-empty-desc" style="padding: 16px 0;">No recent activity found.</div>';
    }
  }

  // --- 2. RENDER TOPICS VIEW ---
  function renderTopics() {
    const tbody = document.getElementById('topics-table-body');
    const countEl = document.getElementById('topics-count-label');
    if (!tbody) return;

    let items = AdminStore.getTopics();
    const { search, subject, status } = filterState.topics;

    if (search) {
      const q = search.toLowerCase();
      items = items.filter(t => t.title.toLowerCase().includes(q) || t.slug.toLowerCase().includes(q) || (t.description && t.description.toLowerCase().includes(q)));
    }
    if (subject !== 'all') {
      items = items.filter(t => t.subject === subject);
    }
    if (status !== 'all') {
      items = items.filter(t => t.status === status);
    }

    if (countEl) countEl.textContent = `Showing ${items.length} topics`;

    if (items.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6">
            <div class="admin-empty-state">
              <i class="fas fa-layer-group admin-empty-icon"></i>
              <div class="admin-empty-title">No Topics Found</div>
              <div class="admin-empty-desc">No topics match your current search and filter criteria.</div>
              <button class="admin-btn-action admin-btn-accent" onclick="openTopicModal()"><i class="fas fa-plus"></i> Add New Topic</button>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = items.map(t => `
      <tr>
        <td>
          <div style="font-weight: 700; color: var(--admin-navy-primary); font-size: 0.92rem;">${escapeHtml(t.title)}</div>
          <div style="font-size: 0.75rem; color: var(--admin-text-muted); font-family: monospace;">/${escapeHtml(t.slug)}</div>
        </td>
        <td>
          <span class="admin-badge-category"><i class="fas fa-book"></i> ${escapeHtml(t.subject)}</span>
        </td>
        <td>
          <strong>${t.questionsCount || 0}</strong> <span style="font-size: 0.75rem; color: #94a3b8;">MCQs</span>
        </td>
        <td style="color: var(--admin-text-muted); font-size: 0.8rem;">
          ${t.createdAt || '—'}
        </td>
        <td>
          <button type="button" class="admin-status-badge ${t.status}" title="Click to toggle Draft / Published" onclick="handleTogglePublish('topics', '${t.id}')">
            <i class="fas ${t.status === 'published' ? 'fa-check' : 'fa-pen'}"></i> ${t.status}
          </button>
        </td>
        <td>
          <div class="admin-table-actions">
            <button class="admin-table-btn btn-edit" title="Edit Topic" onclick="openTopicModal('${t.id}')">
              <i class="fas fa-pencil"></i>
            </button>
            <button class="admin-table-btn btn-delete" title="Delete Topic" onclick="promptDelete('topics', '${t.id}', '${escapeHtml(t.title)}')">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  // --- 3. RENDER QUESTIONS VIEW ---
  function renderQuestions() {
    const tbody = document.getElementById('questions-table-body');
    const countEl = document.getElementById('questions-count-label');
    if (!tbody) return;

    let items = AdminStore.getQuestions();
    const { search, subject, difficulty, status } = filterState.questions;

    if (search) {
      const q = search.toLowerCase();
      items = items.filter(it => it.question.toLowerCase().includes(q) || (it.explanation && it.explanation.toLowerCase().includes(q)));
    }
    if (subject !== 'all') {
      items = items.filter(it => it.subject === subject);
    }
    if (difficulty !== 'all') {
      items = items.filter(it => it.difficulty === difficulty);
    }
    if (status !== 'all') {
      items = items.filter(it => it.status === status);
    }

    if (countEl) countEl.textContent = `Showing ${items.length} questions`;

    if (items.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6">
            <div class="admin-empty-state">
              <i class="fas fa-circle-question admin-empty-icon"></i>
              <div class="admin-empty-title">No Questions Found</div>
              <div class="admin-empty-desc">No practice questions match your active filters.</div>
              <button class="admin-btn-action admin-btn-accent" onclick="openQuestionModal()"><i class="fas fa-plus"></i> Add Question</button>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    const topics = AdminStore.getTopics();
    const topicMap = {};
    topics.forEach(t => { topicMap[t.id] = t.title; });

    tbody.innerHTML = items.map(q => {
      const optLetters = ['A', 'B', 'C', 'D'];
      const correctText = q.options && q.options[q.correctIndex] ? q.options[q.correctIndex] : '—';
      const topicName = topicMap[q.topicId] || q.subject || 'General';

      return `
        <tr>
          <td style="max-width: 320px;">
            <div style="font-weight: 600; color: var(--admin-navy-primary); line-height: 1.35; margin-bottom: 4px;">
              ${escapeHtml(q.question)}
            </div>
            <div style="font-size: 0.74rem; color: var(--admin-green); font-weight: 600;">
              <i class="fas fa-check-circle"></i> (${optLetters[q.correctIndex] || 'A'}): ${escapeHtml(correctText)}
            </div>
          </td>
          <td>
            <span class="admin-badge-category">${escapeHtml(q.subject)}</span>
            <div style="font-size: 0.72rem; color: #64748b; margin-top: 3px;">${escapeHtml(topicName)}</div>
          </td>
          <td>
            <span class="admin-diff-badge ${q.difficulty}">${q.difficulty}</span>
          </td>
          <td style="color: var(--admin-text-muted); font-size: 0.8rem;">
            ${q.createdAt || '—'}
          </td>
          <td>
            <button type="button" class="admin-status-badge ${q.status}" title="Click to toggle Draft / Published" onclick="handleTogglePublish('questions', '${q.id}')">
              <i class="fas ${q.status === 'published' ? 'fa-check' : 'fa-pen'}"></i> ${q.status}
            </button>
          </td>
          <td>
            <div class="admin-table-actions">
              <button class="admin-table-btn btn-edit" title="Edit Question" onclick="openQuestionModal('${q.id}')">
                <i class="fas fa-pencil"></i>
              </button>
              <button class="admin-table-btn btn-delete" title="Delete Question" onclick="promptDelete('questions', '${q.id}', '${escapeHtml(q.question.substring(0, 40))}...')">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // --- 4. RENDER CURRENT AFFAIRS VIEW ---
  function renderAffairs() {
    const tbody = document.getElementById('affairs-table-body');
    const countEl = document.getElementById('affairs-count-label');
    if (!tbody) return;

    let items = AdminStore.getCurrentAffairs();
    const { search, category, status } = filterState.affairs;

    if (search) {
      const q = search.toLowerCase();
      items = items.filter(a => a.title.toLowerCase().includes(q) || (a.summary && a.summary.toLowerCase().includes(q)) || (a.tags && a.tags.some(tag => tag.toLowerCase().includes(q))));
    }
    if (category !== 'all') {
      items = items.filter(a => a.category === category);
    }
    if (status !== 'all') {
      items = items.filter(a => a.status === status);
    }

    if (countEl) countEl.textContent = `Showing ${items.length} articles`;

    if (items.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6">
            <div class="admin-empty-state">
              <i class="fas fa-newspaper admin-empty-icon"></i>
              <div class="admin-empty-title">No Current Affairs Found</div>
              <div class="admin-empty-desc">No current affairs articles match your current search or category filter.</div>
              <button class="admin-btn-action admin-btn-accent" onclick="openAffairsModal()"><i class="fas fa-plus"></i> Add Current Affairs</button>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = items.map(a => `
      <tr>
        <td style="max-width: 320px;">
          <div style="font-weight: 700; color: var(--admin-navy-primary); font-size: 0.9rem; line-height: 1.3; margin-bottom: 4px;">
            ${escapeHtml(a.title)}
          </div>
          <div style="font-size: 0.78rem; color: var(--admin-text-muted); line-height: 1.35;">
            ${escapeHtml(a.summary || '')}
          </div>
          <div style="margin-top: 6px; display: flex; gap: 4px; flex-wrap: wrap;">
            ${(a.tags || []).map(t => `<span style="font-size: 0.68rem; background: #e0f2fe; color: #0369a1; padding: 1px 6px; border-radius: 4px; font-weight: 600;">#${escapeHtml(t)}</span>`).join('')}
          </div>
        </td>
        <td>
          <span class="admin-badge-category"><i class="fas fa-tag"></i> ${escapeHtml(a.category)}</span>
        </td>
        <td style="color: var(--admin-text-muted); font-size: 0.8rem; white-space: nowrap;">
          <i class="far fa-calendar-alt"></i> ${a.date || '—'}
        </td>
        <td>
          <button type="button" class="admin-status-badge ${a.status}" title="Click to toggle Draft / Published" onclick="handleTogglePublish('affairs', '${a.id}')">
            <i class="fas ${a.status === 'published' ? 'fa-check' : 'fa-pen'}"></i> ${a.status}
          </button>
        </td>
        <td>
          <div class="admin-table-actions">
            <button class="admin-table-btn btn-edit" title="Edit Article" onclick="openAffairsModal('${a.id}')">
              <i class="fas fa-pencil"></i>
            </button>
            <button class="admin-table-btn btn-delete" title="Delete Article" onclick="promptDelete('affairs', '${a.id}', '${escapeHtml(a.title)}')">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  // --- 5. RENDER GOVERNMENT EXAMS VIEW ---
  function renderExams() {
    const tbody = document.getElementById('exams-table-body');
    const countEl = document.getElementById('exams-count-label');
    if (!tbody) return;

    let items = AdminStore.getExams();
    const { search, category, status } = filterState.exams;

    if (search) {
      const q = search.toLowerCase();
      items = items.filter(e => e.title.toLowerCase().includes(q) || (e.agency && e.agency.toLowerCase().includes(q)) || (e.eligibility && e.eligibility.toLowerCase().includes(q)));
    }
    if (category !== 'all') {
      items = items.filter(e => e.category === category);
    }
    if (status !== 'all') {
      items = items.filter(e => e.status === status);
    }

    if (countEl) countEl.textContent = `Showing ${items.length} exams`;

    if (items.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6">
            <div class="admin-empty-state">
              <i class="fas fa-graduation-cap admin-empty-icon"></i>
              <div class="admin-empty-title">No Exams Found</div>
              <div class="admin-empty-desc">No government exams match your active search filters.</div>
              <button class="admin-btn-action admin-btn-accent" onclick="openExamModal()"><i class="fas fa-plus"></i> Add New Exam</button>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = items.map(e => `
      <tr>
        <td style="max-width: 280px;">
          <div style="font-weight: 700; color: var(--admin-navy-primary); font-size: 0.9rem;">${escapeHtml(e.title)}</div>
          <div style="font-size: 0.75rem; color: #64748b;">Agency: ${escapeHtml(e.agency || e.category)}</div>
        </td>
        <td>
          <span class="admin-badge-category">${escapeHtml(e.category)}</span>
          <div style="font-size: 0.72rem; color: var(--admin-green); font-weight: 600; margin-top: 2px;">
            ${escapeHtml(e.totalVacancies || 'Announced')}
          </div>
        </td>
        <td style="font-size: 0.78rem; color: var(--admin-text-body); max-width: 200px;">
          ${escapeHtml(e.examDates || 'Check Notification')}
        </td>
        <td style="font-size: 0.78rem; color: var(--admin-text-muted); max-width: 220px;">
          ${escapeHtml(e.eligibility ? e.eligibility.substring(0, 70) + '...' : 'Graduate / 12th')}
        </td>
        <td>
          <button type="button" class="admin-status-badge ${e.status}" title="Click to toggle Draft / Published" onclick="handleTogglePublish('exams', '${e.id}')">
            <i class="fas ${e.status === 'published' ? 'fa-check' : 'fa-pen'}"></i> ${e.status}
          </button>
        </td>
        <td>
          <div class="admin-table-actions">
            <button class="admin-table-btn btn-edit" title="Edit Exam" onclick="openExamModal('${e.id}')">
              <i class="fas fa-pencil"></i>
            </button>
            <button class="admin-table-btn btn-delete" title="Delete Exam" onclick="promptDelete('exams', '${e.id}', '${escapeHtml(e.title)}')">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  // --- 6. RENDER STUDY MATERIALS VIEW ---
  function renderMaterials() {
    const tbody = document.getElementById('materials-table-body');
    const countEl = document.getElementById('materials-count-label');
    if (!tbody) return;

    let items = AdminStore.getStudyMaterials();
    const { search, subject, type, status } = filterState.materials;

    if (search) {
      const q = search.toLowerCase();
      items = items.filter(m => m.title.toLowerCase().includes(q) || (m.description && m.description.toLowerCase().includes(q)));
    }
    if (subject !== 'all') {
      items = items.filter(m => m.subject === subject);
    }
    if (type !== 'all') {
      items = items.filter(m => m.fileType === type);
    }
    if (status !== 'all') {
      items = items.filter(m => m.status === status);
    }

    if (countEl) countEl.textContent = `Showing ${items.length} study items`;

    if (items.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6">
            <div class="admin-empty-state">
              <i class="fas fa-book-open admin-empty-icon"></i>
              <div class="admin-empty-title">No Study Materials Found</div>
              <div class="admin-empty-desc">No study resources found matching the selected filter options.</div>
              <button class="admin-btn-action admin-btn-accent" onclick="openMaterialModal()"><i class="fas fa-plus"></i> Upload / Add Material</button>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = items.map(m => `
      <tr>
        <td style="max-width: 300px;">
          <div style="font-weight: 700; color: var(--admin-navy-primary); font-size: 0.9rem; margin-bottom: 2px;">
            ${escapeHtml(m.title)}
          </div>
          <div style="font-size: 0.75rem; color: var(--admin-text-muted);">
            ${escapeHtml(m.description ? m.description.substring(0, 80) + '...' : '')}
          </div>
        </td>
        <td>
          <span class="admin-badge-category">${escapeHtml(m.subject)}</span>
        </td>
        <td>
          <span style="display: inline-flex; align-items: center; gap: 4px; font-weight: 600; font-size: 0.8rem; color: #4338ca; background: #e0e7ff; padding: 2px 7px; border-radius: 4px;">
            <i class="fas fa-file-pdf"></i> ${escapeHtml(m.fileType)}
          </span>
        </td>
        <td style="font-size: 0.78rem; color: var(--admin-text-muted);">
          ${escapeHtml(m.fileSize || '3.5 MB')} • ${escapeHtml(m.pages || 'PDF')}
        </td>
        <td>
          <button type="button" class="admin-status-badge ${m.status}" title="Click to toggle Draft / Published" onclick="handleTogglePublish('materials', '${m.id}')">
            <i class="fas ${m.status === 'published' ? 'fa-check' : 'fa-pen'}"></i> ${m.status}
          </button>
        </td>
        <td>
          <div class="admin-table-actions">
            <button class="admin-table-btn btn-edit" title="Edit Material" onclick="openMaterialModal('${m.id}')">
              <i class="fas fa-pencil"></i>
            </button>
            <button class="admin-table-btn btn-delete" title="Delete Material" onclick="promptDelete('materials', '${m.id}', '${escapeHtml(m.title)}')">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  // --- 7. RENDER CONTACT MESSAGES VIEW ---
  function renderMessages() {
    const tbody = document.getElementById('messages-table-body');
    const countEl = document.getElementById('messages-count-label');
    if (!tbody) return;

    let items = AdminStore.getContactMessages();
    const { search, status } = filterState.messages;

    if (search) {
      const q = search.toLowerCase();
      items = items.filter(m => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.subject.toLowerCase().includes(q) || m.message.toLowerCase().includes(q));
    }
    if (status !== 'all') {
      items = items.filter(m => m.status === status);
    }

    if (countEl) countEl.textContent = `Showing ${items.length} inquiries`;

    if (items.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6">
            <div class="admin-empty-state">
              <i class="fas fa-inbox admin-empty-icon"></i>
              <div class="admin-empty-title">No Inquiries Found</div>
              <div class="admin-empty-desc">No candidate messages match the selected status.</div>
              <button class="admin-btn-action admin-btn-gold" onclick="simulateTestMessage()"><i class="fas fa-magic"></i> Generate Sample Inquiry</button>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = items.map(m => {
      const isUnread = m.status === 'unread';
      const formattedDate = new Date(m.date).toLocaleString('en-IN', {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });

      return `
        <tr style="${isUnread ? 'background-color: #fffdf5; font-weight: 500;' : ''}">
          <td style="max-width: 180px;">
            <div style="font-weight: 700; color: var(--admin-navy-primary); font-size: 0.88rem;">${escapeHtml(m.name)}</div>
            <a href="mailto:${escapeHtml(m.email)}" style="font-size: 0.74rem; color: var(--admin-blue-vibrant); text-decoration: none;">
              ${escapeHtml(m.email)}
            </a>
          </td>
          <td style="max-width: 320px;">
            <div style="font-weight: 700; color: var(--admin-navy-primary); font-size: 0.88rem; margin-bottom: 2px;">
              ${escapeHtml(m.subject)}
            </div>
            <div style="font-size: 0.78rem; color: var(--admin-text-muted); line-height: 1.35;">
              ${escapeHtml(m.message.substring(0, 85))}...
            </div>
          </td>
          <td style="font-size: 0.78rem; color: var(--admin-text-muted); white-space: nowrap;">
            ${formattedDate}
          </td>
          <td>
            <span class="admin-status-badge ${m.status}">
              ${m.status === 'unread' ? '<i class="fas fa-circle" style="font-size: 0.5rem; color: #ef4444;"></i>' : ''}
              ${m.status}
            </span>
          </td>
          <td>
            <div class="admin-table-actions">
              <button class="admin-table-btn btn-view" title="View & Reply" onclick="openMessageDetailModal('${m.id}')">
                <i class="fas fa-envelope-open-text"></i>
              </button>
              <button class="admin-table-btn" title="Toggle Read Status" onclick="toggleMessageReadStatus('${m.id}')">
                <i class="fas ${m.status === 'unread' ? 'fa-envelope' : 'fa-envelope-open'}"></i>
              </button>
              <button class="admin-table-btn btn-delete" title="Delete Message" onclick="promptDelete('messages', '${m.id}', 'Inquiry from ${escapeHtml(m.name)}')">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // --- Router / View Dispatcher ---
  function renderCurrentView() {
    updateSidebarBadges();
    switch (currentView) {
      case 'dashboard':
        renderDashboard();
        break;
      case 'topics':
        renderTopics();
        break;
      case 'questions':
        renderQuestions();
        break;
      case 'current-affairs':
        renderAffairs();
        break;
      case 'exams':
        renderExams();
        break;
      case 'study-materials':
        renderMaterials();
        break;
      case 'contact-messages':
        renderMessages();
        break;
    }
  }

  // --- Search & Filters Event Listeners ---
  function initFilterListeners() {
    // Topics
    const topicSearch = document.getElementById('filter-topics-search');
    const topicSubj = document.getElementById('filter-topics-subject');
    const topicStatus = document.getElementById('filter-topics-status');
    const topicClear = document.getElementById('btn-clear-topics');

    if (topicSearch) topicSearch.addEventListener('input', e => { filterState.topics.search = e.target.value; renderTopics(); });
    if (topicSubj) topicSubj.addEventListener('change', e => { filterState.topics.subject = e.target.value; renderTopics(); });
    if (topicStatus) topicStatus.addEventListener('change', e => { filterState.topics.status = e.target.value; renderTopics(); });
    if (topicClear) topicClear.addEventListener('click', () => {
      filterState.topics = { search: '', subject: 'all', status: 'all' };
      if (topicSearch) topicSearch.value = '';
      if (topicSubj) topicSubj.value = 'all';
      if (topicStatus) topicStatus.value = 'all';
      renderTopics();
    });

    // Questions
    const qSearch = document.getElementById('filter-questions-search');
    const qSubj = document.getElementById('filter-questions-subject');
    const qDiff = document.getElementById('filter-questions-diff');
    const qStatus = document.getElementById('filter-questions-status');
    const qClear = document.getElementById('btn-clear-questions');

    if (qSearch) qSearch.addEventListener('input', e => { filterState.questions.search = e.target.value; renderQuestions(); });
    if (qSubj) qSubj.addEventListener('change', e => { filterState.questions.subject = e.target.value; renderQuestions(); });
    if (qDiff) qDiff.addEventListener('change', e => { filterState.questions.difficulty = e.target.value; renderQuestions(); });
    if (qStatus) qStatus.addEventListener('change', e => { filterState.questions.status = e.target.value; renderQuestions(); });
    if (qClear) qClear.addEventListener('click', () => {
      filterState.questions = { search: '', subject: 'all', difficulty: 'all', status: 'all' };
      if (qSearch) qSearch.value = '';
      if (qSubj) qSubj.value = 'all';
      if (qDiff) qDiff.value = 'all';
      if (qStatus) qStatus.value = 'all';
      renderQuestions();
    });

    // Affairs
    const afSearch = document.getElementById('filter-affairs-search');
    const afCat = document.getElementById('filter-affairs-category');
    const afStatus = document.getElementById('filter-affairs-status');
    const afClear = document.getElementById('btn-clear-affairs');

    if (afSearch) afSearch.addEventListener('input', e => { filterState.affairs.search = e.target.value; renderAffairs(); });
    if (afCat) afCat.addEventListener('change', e => { filterState.affairs.category = e.target.value; renderAffairs(); });
    if (afStatus) afStatus.addEventListener('change', e => { filterState.affairs.status = e.target.value; renderAffairs(); });
    if (afClear) afClear.addEventListener('click', () => {
      filterState.affairs = { search: '', category: 'all', status: 'all' };
      if (afSearch) afSearch.value = '';
      if (afCat) afCat.value = 'all';
      if (afStatus) afStatus.value = 'all';
      renderAffairs();
    });

    // Exams
    const exSearch = document.getElementById('filter-exams-search');
    const exCat = document.getElementById('filter-exams-category');
    const exStatus = document.getElementById('filter-exams-status');
    const exClear = document.getElementById('btn-clear-exams');

    if (exSearch) exSearch.addEventListener('input', e => { filterState.exams.search = e.target.value; renderExams(); });
    if (exCat) exCat.addEventListener('change', e => { filterState.exams.category = e.target.value; renderExams(); });
    if (exStatus) exStatus.addEventListener('change', e => { filterState.exams.status = e.target.value; renderExams(); });
    if (exClear) exClear.addEventListener('click', () => {
      filterState.exams = { search: '', category: 'all', status: 'all' };
      if (exSearch) exSearch.value = '';
      if (exCat) exCat.value = 'all';
      if (exStatus) exStatus.value = 'all';
      renderExams();
    });

    // Materials
    const matSearch = document.getElementById('filter-materials-search');
    const matSubj = document.getElementById('filter-materials-subject');
    const matType = document.getElementById('filter-materials-type');
    const matStatus = document.getElementById('filter-materials-status');
    const matClear = document.getElementById('btn-clear-materials');

    if (matSearch) matSearch.addEventListener('input', e => { filterState.materials.search = e.target.value; renderMaterials(); });
    if (matSubj) matSubj.addEventListener('change', e => { filterState.materials.subject = e.target.value; renderMaterials(); });
    if (matType) matType.addEventListener('change', e => { filterState.materials.type = e.target.value; renderMaterials(); });
    if (matStatus) matStatus.addEventListener('change', e => { filterState.materials.status = e.target.value; renderMaterials(); });
    if (matClear) matClear.addEventListener('click', () => {
      filterState.materials = { search: '', subject: 'all', type: 'all', status: 'all' };
      if (matSearch) matSearch.value = '';
      if (matSubj) matSubj.value = 'all';
      if (matType) matType.value = 'all';
      if (matStatus) matStatus.value = 'all';
      renderMaterials();
    });

    // Messages
    const msgSearch = document.getElementById('filter-messages-search');
    const msgStatus = document.getElementById('filter-messages-status');
    const msgClear = document.getElementById('btn-clear-messages');
    const btnMarkAllRead = document.getElementById('btn-mark-all-read');

    if (msgSearch) msgSearch.addEventListener('input', e => { filterState.messages.search = e.target.value; renderMessages(); });
    if (msgStatus) msgStatus.addEventListener('change', e => { filterState.messages.status = e.target.value; renderMessages(); });
    if (msgClear) msgClear.addEventListener('click', () => {
      filterState.messages = { search: '', status: 'all' };
      if (msgSearch) msgSearch.value = '';
      if (msgStatus) msgStatus.value = 'all';
      renderMessages();
    });
    if (btnMarkAllRead) {
      btnMarkAllRead.addEventListener('click', () => {
        const msgs = AdminStore.getContactMessages();
        msgs.forEach(m => { if (m.status === 'unread') m.status = 'read'; });
        localStorage.setItem('GK_ADMIN_DATA_MESSAGES_V1', JSON.stringify(msgs));
        showToast('All messages marked as read', 'info');
        renderMessages();
        updateSidebarBadges();
      });
    }
  }

  // --- CRUD MODAL DIALOGS ---

  // 1. Topic Modal
  window.openTopicModal = function (id) {
    const modal = document.getElementById('modal-topic-editor');
    const titleEl = document.getElementById('modal-topic-heading');
    const form = document.getElementById('form-topic-editor');
    if (!modal || !form) return;

    form.reset();
    document.getElementById('topic-edit-id').value = id || '';

    if (id) {
      const topic = AdminStore.getTopics().find(t => t.id === id);
      if (topic) {
        titleEl.textContent = 'Edit Topic';
        document.getElementById('topic-input-title').value = topic.title || '';
        document.getElementById('topic-input-slug').value = topic.slug || '';
        document.getElementById('topic-input-subject').value = topic.subject || 'Indian History';
        document.getElementById('topic-input-desc').value = topic.description || '';
        document.getElementById('topic-input-status').value = topic.status || 'published';
      }
    } else {
      titleEl.textContent = 'Add New Topic';
      document.getElementById('topic-input-status').value = 'published';
    }

    modal.classList.add('is-active');
  };

  // 2. Question Modal
  window.openQuestionModal = function (id) {
    const modal = document.getElementById('modal-question-editor');
    const titleEl = document.getElementById('modal-question-heading');
    const form = document.getElementById('form-question-editor');
    if (!modal || !form) return;

    form.reset();
    document.getElementById('question-edit-id').value = id || '';

    // Populate topic dropdown dynamically
    const topicSelect = document.getElementById('question-input-topic');
    if (topicSelect) {
      const topics = AdminStore.getTopics();
      topicSelect.innerHTML = topics.map(t => `<option value="${t.id}">${escapeHtml(t.title)} (${t.subject})</option>`).join('');
    }

    if (id) {
      const q = AdminStore.getQuestions().find(it => it.id === id);
      if (q) {
        titleEl.textContent = 'Edit Practice Question';
        document.getElementById('question-input-text').value = q.question || '';
        document.getElementById('question-input-subject').value = q.subject || 'Indian Polity';
        if (topicSelect) topicSelect.value = q.topicId || (topics[0] ? topics[0].id : '');
        document.getElementById('question-input-diff').value = q.difficulty || 'Medium';
        document.getElementById('question-input-status').value = q.status || 'published';
        document.getElementById('question-input-exp').value = q.explanation || '';

        const opts = q.options || ['', '', '', ''];
        document.getElementById('opt-val-0').value = opts[0] || '';
        document.getElementById('opt-val-1').value = opts[1] || '';
        document.getElementById('opt-val-2').value = opts[2] || '';
        document.getElementById('opt-val-3').value = opts[3] || '';

        const correctRadio = document.querySelector(`input[name="correct_opt"][value="${q.correctIndex || 0}"]`);
        if (correctRadio) correctRadio.checked = true;
      }
    } else {
      titleEl.textContent = 'Add Practice Question (MCQ)';
      document.getElementById('question-input-status').value = 'published';
      const defaultRadio = document.querySelector('input[name="correct_opt"][value="0"]');
      if (defaultRadio) defaultRadio.checked = true;
    }

    modal.classList.add('is-active');
  };

  // 3. Current Affairs Modal
  window.openAffairsModal = function (id) {
    const modal = document.getElementById('modal-affairs-editor');
    const titleEl = document.getElementById('modal-affairs-heading');
    const form = document.getElementById('form-affairs-editor');
    if (!modal || !form) return;

    form.reset();
    document.getElementById('affairs-edit-id').value = id || '';

    if (id) {
      const a = AdminStore.getCurrentAffairs().find(it => it.id === id);
      if (a) {
        titleEl.textContent = 'Edit Current Affairs Article';
        document.getElementById('affairs-input-title').value = a.title || '';
        document.getElementById('affairs-input-category').value = a.category || 'National';
        document.getElementById('affairs-input-date').value = a.date || new Date().toISOString().split('T')[0];
        document.getElementById('affairs-input-summary').value = a.summary || '';
        document.getElementById('affairs-input-content').value = a.content || '';
        document.getElementById('affairs-input-tags').value = (a.tags || []).join(', ');
        document.getElementById('affairs-input-status').value = a.status || 'published';
      }
    } else {
      titleEl.textContent = 'Add Current Affairs Article';
      document.getElementById('affairs-input-date').value = new Date().toISOString().split('T')[0];
      document.getElementById('affairs-input-status').value = 'published';
    }

    modal.classList.add('is-active');
  };

  // 4. Government Exams Modal
  window.openExamModal = function (id) {
    const modal = document.getElementById('modal-exam-editor');
    const titleEl = document.getElementById('modal-exam-heading');
    const form = document.getElementById('form-exam-editor');
    if (!modal || !form) return;

    form.reset();
    document.getElementById('exam-edit-id').value = id || '';

    if (id) {
      const e = AdminStore.getExams().find(it => it.id === id);
      if (e) {
        titleEl.textContent = 'Edit Government Exam';
        document.getElementById('exam-input-title').value = e.title || '';
        document.getElementById('exam-input-agency').value = e.agency || '';
        document.getElementById('exam-input-category').value = e.category || 'UPSC';
        document.getElementById('exam-input-vacancies').value = e.totalVacancies || '';
        document.getElementById('exam-input-dates').value = e.examDates || '';
        document.getElementById('exam-input-eligibility').value = e.eligibility || '';
        document.getElementById('exam-input-stages').value = e.stages || '';
        document.getElementById('exam-input-syllabus').value = e.syllabusSummary || '';
        document.getElementById('exam-input-status').value = e.status || 'published';
      }
    } else {
      titleEl.textContent = 'Add Government Exam';
      document.getElementById('exam-input-status').value = 'published';
    }

    modal.classList.add('is-active');
  };

  // 5. Study Material Modal
  window.openMaterialModal = function (id) {
    const modal = document.getElementById('modal-material-editor');
    const titleEl = document.getElementById('modal-material-heading');
    const form = document.getElementById('form-material-editor');
    if (!modal || !form) return;

    form.reset();
    document.getElementById('material-edit-id').value = id || '';

    if (id) {
      const m = AdminStore.getStudyMaterials().find(it => it.id === id);
      if (m) {
        titleEl.textContent = 'Edit Study Material';
        document.getElementById('material-input-title').value = m.title || '';
        document.getElementById('material-input-subject').value = m.subject || 'Indian Polity';
        document.getElementById('material-input-type').value = m.fileType || 'PDF Document';
        document.getElementById('material-input-size').value = m.fileSize || '';
        document.getElementById('material-input-pages').value = m.pages || '';
        document.getElementById('material-input-url').value = m.downloadUrl || '#';
        document.getElementById('material-input-desc').value = m.description || '';
        document.getElementById('material-input-status').value = m.status || 'published';
      }
    } else {
      titleEl.textContent = 'Add Study Material';
      document.getElementById('material-input-status').value = 'published';
      document.getElementById('material-input-url').value = '#';
    }

    modal.classList.add('is-active');
  };

  // 6. Contact Message Detail & Reply Modal
  window.openMessageDetailModal = function (id) {
    const modal = document.getElementById('modal-message-detail');
    if (!modal) return;

    const msg = AdminStore.getContactMessages().find(m => m.id === id);
    if (!msg) return;

    // Automatically mark as read if was unread
    if (msg.status === 'unread') {
      AdminStore.markMessageStatus(id, 'read');
      updateSidebarBadges();
      renderMessages();
    }

    document.getElementById('msg-detail-id').value = id;
    document.getElementById('msg-detail-sender').textContent = msg.name;
    document.getElementById('msg-detail-email').textContent = msg.email;
    document.getElementById('msg-detail-email-link').href = `mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`;
    document.getElementById('msg-detail-date').textContent = new Date(msg.date).toLocaleString('en-IN');
    document.getElementById('msg-detail-subject').textContent = msg.subject;
    document.getElementById('msg-detail-body').textContent = msg.message;
    document.getElementById('msg-detail-status-badge').className = `admin-status-badge ${msg.status}`;
    document.getElementById('msg-detail-status-badge').textContent = msg.status.toUpperCase();
    document.getElementById('msg-reply-textarea').value = msg.replyNote || '';

    modal.classList.add('is-active');
  };

  window.toggleMessageReadStatus = function (id) {
    const msg = AdminStore.getContactMessages().find(m => m.id === id);
    if (!msg) return;
    const nextStatus = msg.status === 'unread' ? 'read' : 'unread';
    AdminStore.markMessageStatus(id, nextStatus);
    showToast(`Inquiry marked as ${nextStatus}`, 'info');
    renderMessages();
    updateSidebarBadges();
  };

  window.simulateTestMessage = function () {
    const names = ['Kavita Rathore', 'Manish Tiwari', 'Rohit Aggarwal', 'Deepika Nair', 'Aman Joshi'];
    const exams = ['UPSC CSE 2026', 'SSC CGL', 'RRB NTPC', 'SBI PO'];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomExam = exams[Math.floor(Math.random() * exams.length)];

    AdminStore.addContactMessage({
      name: randomName,
      email: `${randomName.toLowerCase().replace(' ', '.')}@gmail.com`,
      subject: `Inquiry on ${randomExam} 2026 syllabus outline & study material`,
      message: `Hello Team, I am preparing for ${randomExam}. Could you please guide me on where to access the latest chapter-wise MCQs and previous year question papers? Thank you for supporting free education!`
    });

    showToast(`New inquiry received from ${randomName}`, 'info');
    renderMessages();
    renderDashboard();
    updateSidebarBadges();
  };

  // --- Initialize Modal Form Submit Handlers ---
  function initModalForms() {
    // Universal Modal Closes
    document.querySelectorAll('.admin-modal-close, .btn-modal-cancel').forEach(btn => {
      btn.addEventListener('click', function () {
        const modal = this.closest('.admin-modal-overlay');
        if (modal) modal.classList.remove('is-active');
      });
    });

    // Close on overlay backdrop click
    document.querySelectorAll('.admin-modal-overlay').forEach(modal => {
      modal.addEventListener('click', function (e) {
        if (e.target === this) {
          this.classList.remove('is-active');
        }
      });
    });

    // 1. Topic Submit
    const formTopic = document.getElementById('form-topic-editor');
    if (formTopic) {
      formTopic.addEventListener('submit', function (e) {
        e.preventDefault();
        const id = document.getElementById('topic-edit-id').value;
        const title = document.getElementById('topic-input-title').value.trim();
        let slug = document.getElementById('topic-input-slug').value.trim();
        const subject = document.getElementById('topic-input-subject').value;
        const desc = document.getElementById('topic-input-desc').value.trim();
        const status = document.getElementById('topic-input-status').value;

        if (!title) {
          showToast('Topic title is required', 'error');
          return;
        }
        if (!slug) {
          slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        }

        if (id) {
          AdminStore.update('topics', id, { title, slug, subject, description: desc, status });
          showToast(`Topic "${title}" updated successfully`, 'success');
        } else {
          AdminStore.add('topics', { title, slug, subject, description: desc, status, questionsCount: 0 });
          showToast(`Topic "${title}" created successfully`, 'success');
        }

        document.getElementById('modal-topic-editor').classList.remove('is-active');
        renderTopics();
        updateSidebarBadges();
      });
    }

    // 2. Question Submit
    const formQuestion = document.getElementById('form-question-editor');
    if (formQuestion) {
      formQuestion.addEventListener('submit', function (e) {
        e.preventDefault();
        const id = document.getElementById('question-edit-id').value;
        const questionText = document.getElementById('question-input-text').value.trim();
        const subject = document.getElementById('question-input-subject').value;
        const topicId = document.getElementById('question-input-topic').value;
        const diff = document.getElementById('question-input-diff').value;
        const status = document.getElementById('question-input-status').value;
        const exp = document.getElementById('question-input-exp').value.trim();

        const opts = [
          document.getElementById('opt-val-0').value.trim(),
          document.getElementById('opt-val-1').value.trim(),
          document.getElementById('opt-val-2').value.trim(),
          document.getElementById('opt-val-3').value.trim()
        ];

        const checkedRadio = document.querySelector('input[name="correct_opt"]:checked');
        const correctIndex = checkedRadio ? parseInt(checkedRadio.value, 10) : 0;

        if (!questionText) {
          showToast('Question text cannot be empty', 'error');
          return;
        }
        if (opts.some(o => !o)) {
          showToast('Please provide all 4 multiple choice options', 'error');
          return;
        }

        if (id) {
          AdminStore.update('questions', id, {
            question: questionText,
            subject,
            topicId,
            difficulty: diff,
            status,
            explanation: exp,
            options: opts,
            correctIndex
          });
          showToast('Question updated successfully', 'success');
        } else {
          AdminStore.add('questions', {
            question: questionText,
            subject,
            topicId,
            difficulty: diff,
            status,
            explanation: exp,
            options: opts,
            correctIndex
          });
          showToast('New question created successfully', 'success');
        }

        document.getElementById('modal-question-editor').classList.remove('is-active');
        renderQuestions();
        updateSidebarBadges();
      });
    }

    // 3. Current Affairs Submit
    const formAffairs = document.getElementById('form-affairs-editor');
    if (formAffairs) {
      formAffairs.addEventListener('submit', function (e) {
        e.preventDefault();
        const id = document.getElementById('affairs-edit-id').value;
        const title = document.getElementById('affairs-input-title').value.trim();
        const category = document.getElementById('affairs-input-category').value;
        const date = document.getElementById('affairs-input-date').value;
        const summary = document.getElementById('affairs-input-summary').value.trim();
        const content = document.getElementById('affairs-input-content').value.trim();
        const tagsRaw = document.getElementById('affairs-input-tags').value.trim();
        const status = document.getElementById('affairs-input-status').value;

        const tags = tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : [];

        if (!title) {
          showToast('Article headline is required', 'error');
          return;
        }

        if (id) {
          AdminStore.update('affairs', id, { title, category, date, summary, content, tags, status });
          showToast('Current affairs article updated', 'success');
        } else {
          AdminStore.add('affairs', { title, category, date, summary, content, tags, status });
          showToast('New current affairs article published', 'success');
        }

        document.getElementById('modal-affairs-editor').classList.remove('is-active');
        renderAffairs();
        updateSidebarBadges();
      });
    }

    // 4. Exams Submit
    const formExam = document.getElementById('form-exam-editor');
    if (formExam) {
      formExam.addEventListener('submit', function (e) {
        e.preventDefault();
        const id = document.getElementById('exam-edit-id').value;
        const title = document.getElementById('exam-input-title').value.trim();
        const agency = document.getElementById('exam-input-agency').value.trim();
        const category = document.getElementById('exam-input-category').value;
        const vacancies = document.getElementById('exam-input-vacancies').value.trim();
        const dates = document.getElementById('exam-input-dates').value.trim();
        const eligibility = document.getElementById('exam-input-eligibility').value.trim();
        const stages = document.getElementById('exam-input-stages').value.trim();
        const syllabus = document.getElementById('exam-input-syllabus').value.trim();
        const status = document.getElementById('exam-input-status').value;

        if (!title) {
          showToast('Exam title is required', 'error');
          return;
        }

        if (id) {
          AdminStore.update('exams', id, {
            title, agency, category, totalVacancies: vacancies, examDates: dates, eligibility, stages, syllabusSummary: syllabus, status
          });
          showToast(`Exam "${title}" updated`, 'success');
        } else {
          AdminStore.add('exams', {
            title, agency, category, totalVacancies: vacancies, examDates: dates, eligibility, stages, syllabusSummary: syllabus, status
          });
          showToast(`Exam "${title}" created`, 'success');
        }

        document.getElementById('modal-exam-editor').classList.remove('is-active');
        renderExams();
        updateSidebarBadges();
      });
    }

    // 5. Materials Submit
    const formMaterial = document.getElementById('form-material-editor');
    if (formMaterial) {
      formMaterial.addEventListener('submit', function (e) {
        e.preventDefault();
        const id = document.getElementById('material-edit-id').value;
        const title = document.getElementById('material-input-title').value.trim();
        const subject = document.getElementById('material-input-subject').value;
        const type = document.getElementById('material-input-type').value;
        const size = document.getElementById('material-input-size').value.trim();
        const pages = document.getElementById('material-input-pages').value.trim();
        const url = document.getElementById('material-input-url').value.trim() || '#';
        const desc = document.getElementById('material-input-desc').value.trim();
        const status = document.getElementById('material-input-status').value;

        if (!title) {
          showToast('Study material title is required', 'error');
          return;
        }

        if (id) {
          AdminStore.update('materials', id, {
            title, subject, fileType: type, fileSize: size, pages, downloadUrl: url, description: desc, status
          });
          showToast('Study material updated', 'success');
        } else {
          AdminStore.add('materials', {
            title, subject, fileType: type, fileSize: size, pages, downloadUrl: url, description: desc, status
          });
          showToast('Study material added to repository', 'success');
        }

        document.getElementById('modal-material-editor').classList.remove('is-active');
        renderMaterials();
        updateSidebarBadges();
      });
    }

    // 6. Message Reply Note Save
    const btnSaveReply = document.getElementById('btn-save-reply');
    if (btnSaveReply) {
      btnSaveReply.addEventListener('click', function () {
        const id = document.getElementById('msg-detail-id').value;
        const note = document.getElementById('msg-reply-textarea').value.trim();
        if (!id) return;

        AdminStore.markMessageStatus(id, 'replied', note);
        showToast('Reply note recorded and marked as Replied', 'success');
        document.getElementById('modal-message-detail').classList.remove('is-active');
        renderMessages();
        updateSidebarBadges();
      });
    }
  }

  // --- Admin Contact Notifications System ---
  function setupContactNotifications() {
    // 1. Cross-tab storage updates
    window.addEventListener('storage', (e) => {
      if (e.key === 'GK_ADMIN_DATA_MESSAGES_V1') {
        updateSidebarBadges();
        if (currentView === 'dashboard') {
          renderDashboard();
        } else if (currentView === 'contact-messages') {
          renderMessages();
        }
        let list = [];
        try {
          if (e.newValue) list = JSON.parse(e.newValue);
        } catch (_) {}
        const latest = list[0];
        if (latest && latest.status === 'unread') {
          showToast(`🔔 New Candidate Inquiry: ${escapeHtml(latest.name)} - "${escapeHtml(latest.subject)}"`, 'info', 6000);
        }
      }
    });

    // 2. Same-window custom event
    window.addEventListener('gk:new_message', (e) => {
      updateSidebarBadges();
      if (currentView === 'dashboard') {
        renderDashboard();
      } else if (currentView === 'contact-messages') {
        renderMessages();
      }
      const newMsg = e.detail;
      if (newMsg) {
        showToast(`🔔 New Candidate Inquiry: ${escapeHtml(newMsg.name)} - "${escapeHtml(newMsg.subject)}"`, 'info', 6000);
      }
    });
  }

  // --- Initializer ---
  function init() {
    initRouter();
    initFilterListeners();
    initModalForms();
    initDeleteConfirmModal();
    updateSidebarBadges();
    setupContactNotifications();

    // Auto-sync listener from store
    AdminStore.subscribe(() => {
      updateSidebarBadges();
    });
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose helpers globally if needed
  window.AdminApp = {
    switchView,
    showToast,
    renderCurrentView
  };
})();
