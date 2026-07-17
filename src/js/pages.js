/* ==========================================================================
   OJT Portfolio - Pages JavaScript
   Page-specific logic for Documents, Weekly Logs, etc.
   ========================================================================== */

// ==========================================================================
// Data Loading Utilities
// ==========================================================================

async function loadJSON(path) {
  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`Failed to load ${path}:`, error);
    return null;
  }
}

// ==========================================================================
// Documents Page Logic
// ==========================================================================

async function initDocumentsPage() {
  const container = document.getElementById('documents-grid');
  const statsContainer = document.getElementById('documents-stats');
  const toolbar = document.querySelector('.documents-toolbar');

  if (!container) return;

  // Show loading state
  container.innerHTML = '<div class="loading">Loading documents...</div>';

  // Load data
  const data = await loadJSON('../../data/documents.json');
  if (!data || !data.documents) {
    container.innerHTML = Components.renderEmptyState({
      icon: Components.icons['file-text'],
      title: 'No Documents Found',
      description: 'Add documents to the data/documents.json file to display them here.',
      action: { text: 'Learn More', href: '#', variant: 'secondary' }
    });
    return;
  }

  // Render stats
  if (statsContainer) {
    renderDocumentStats(data.documents, statsContainer);
  }

  // Render documents
  renderDocuments(data.documents, container);

  // Initialize filters
  initDocumentFilters(data.documents, container);

  // Initialize search
  initDocumentSearch(data.documents, container);
}

function renderDocumentStats(documents, container) {
  const statuses = [...new Set(documents.map(d => d.status))];
  const stats = [
    { label: 'Total Documents', value: documents.length, icon: Components.icons['file-text'] },
    { label: 'Statuses', value: statuses.length, icon: Components.icons.tag },
    { label: 'This Month', value: documents.filter(d => isThisMonth(d.date)).length, icon: Components.icons.calendar },
    { label: 'Downloads', value: documents.reduce((sum, d) => sum + (d.downloads || 0), 0), icon: Components.icons.download }
  ];

  container.innerHTML = stats.map(stat => Components.renderStat(stat)).join('');
}

function renderDocuments(documents, container) {
  if (!documents.length) {
    container.innerHTML = Components.renderEmptyState({
      icon: Components.icons['file-text'],
      title: 'No Documents Match',
      description: 'Try adjusting your filters or search terms.',
    });
    return;
  }

  container.innerHTML = documents.map(doc => renderDocumentCard(doc)).join('');

  // Add click handlers for download buttons
  container.querySelectorAll('.doc-download').forEach(btn => {
    btn.addEventListener('click', () => {
      const docId = btn.dataset.docId;
      handleDocumentDownload(docId);
    });
  });

  container.querySelectorAll('.doc-view').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const docPath = btn.dataset.docPath;
      handleDocumentView(docPath);
    });
  });
}

function renderDocumentCard(doc) {
  const statusClass = `document-card-status ${doc.status?.toLowerCase().replace(/\s+/g, '-')}`;
  const date = Components.formatDate ? Components.formatDate(doc.date) : new Date(doc.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  const fileIcon = getFileIcon(doc.type);

  return `
    <article class="document-card card" data-status="${doc.status}" data-id="${doc.id}">
      <div class="document-card-icon" aria-hidden="true">
        ${fileIcon}
      </div>
      <header class="card-header">
        <h3 class="card-title">${Components.escapeHtml(doc.title)}</h3>
        ${doc.description ? `<p class="card-subtitle">${Components.escapeHtml(doc.description)}</p>` : ''}
      </header>
      <div class="document-card-meta">
        <span class="document-card-date">${Components.icons.calendar} ${date}</span>
        <span class="${statusClass}">${Components.escapeHtml(doc.status)}</span>
      </div>
      <div class="card-body">
        ${doc.summary ? Components.escapeHtml(doc.summary) : ''}
      </div>
      <footer class="card-footer">
        <div class="document-card-actions">
          <button class="btn btn-secondary btn-sm doc-view" data-doc-id="${doc.id}" data-doc-path="${doc.filePath}" aria-label="View ${doc.title}">
            ${Components.icons.external} View
          </button>
          <a href="${doc.filePath}" class="btn btn-primary btn-sm doc-download" data-doc-id="${doc.id}" download aria-label="Download ${doc.title}">
            ${Components.icons.download} Download
          </a>
        </div>
      </footer>
    </article>
  `;
}

function getFileIcon(type) {
  const icons = {
    pdf: Components.icons.pdf,
    doc: Components.icons.doc,
    docx: Components.icons.doc,
    image: Components.icons.image,
    jpg: Components.icons.image,
    png: Components.icons.image,
    txt: Components.icons.file,
    default: Components.icons.file
  };
  return icons[type?.toLowerCase()] || icons.default;
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function isThisMonth(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
}

function initDocumentFilters(documents, container) {
  const filterContainer = document.querySelector('.documents-filters');
  if (!filterContainer) return;

  const statuses = ['all', ...new Set(documents.map(d => d.status))];

  filterContainer.innerHTML = statuses.map(status => `
    <button class="filter-btn ${status === 'all' ? 'active' : ''}" data-status="${status}" aria-pressed="${status === 'all'}">
      ${status === 'all' ? 'All' : capitalizeFirst(status)}
    </button>
  `).join('');

  filterContainer.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      filterContainer.querySelectorAll('.filter-btn').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');

      const status = btn.dataset.status;
      const filtered = status === 'all' ? documents : documents.filter(d => d.status === status);
      renderDocuments(filtered, container);
    });
  });
}

function initDocumentSearch(documents, container) {
  const searchInput = document.querySelector('.documents-search-input');
  if (!searchInput) return;

  const debouncedSearch = debounce((query) => {
    const filtered = documents.filter(doc =>
      doc.title.toLowerCase().includes(query.toLowerCase()) ||
      doc.description?.toLowerCase().includes(query.toLowerCase()) ||
      doc.status?.toLowerCase().includes(query.toLowerCase()) ||
      doc.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
    renderDocuments(filtered, container);
  }, 300);

  searchInput.addEventListener('input', (e) => {
    debouncedSearch(e.target.value);
  });
}

function handleDocumentDownload(docId) {
  // Track download analytics if needed
  console.log('Downloading document:', docId);
  Components.showToast?.('Download started', 'success');
}

function handleDocumentView(docPath) {
  if (!docPath) return;
  console.log('Viewing document:', docPath);
  window.open(docPath, '_blank');
}

// ==========================================================================
// Weekly Logs Page Logic
// ==========================================================================

async function initWeeklyLogsPage() {
  const container = document.getElementById('logs-timeline');
  const statsContainer = document.getElementById('logs-summary');

  if (!container) return;

  container.innerHTML = '<div class="loading">Loading weekly logs...</div>';

  const data = await loadJSON('../../data/weekly-logs.json');
  if (!data || !data.logs) {
    container.innerHTML = Components.renderEmptyState({
      icon: Components.icons.calendar,
      title: 'No Weekly Logs Found',
      description: 'Add weekly logs to the data/weekly-logs.json file to display them here.',
    });
    return;
  }

  // Render stats
  if (statsContainer) {
    renderLogsStats(data.logs, statsContainer);
  }

  // Render logs
  renderLogs(data.logs, container);

  // Initialize week selector
  initLogsFilters(data.logs, container);
}

function renderLogsStats(logs, container) {
  const totalHours = logs.reduce((sum, log) => sum + (log.hours || 0), 0);
  const categories = [...new Set(logs.flatMap(l => l.tags || []))];
  const thisMonth = logs.filter(log => isThisMonth(log.weekEnding)).length;

  const stats = [
    { label: 'Total Entries', value: logs.length, icon: Components.icons['file-text'] },
    { label: 'Hours Logged', value: totalHours.toFixed(1), icon: Components.icons.clock },
    { label: 'Categories', value: categories.length, icon: Components.icons.tag },
    { label: 'This Month', value: thisMonth, icon: Components.icons.calendar }
  ];

  container.innerHTML = stats.map((stat, i) => {
    const variants = ['primary', 'accent', 'warm', 'rose'];
    return Components.renderStat({ ...stat, className: variants[i] });
  }).join('');
}

function renderLogs(logs, container) {
  if (!logs.length) {
    container.innerHTML = Components.renderEmptyState({
      icon: Components.icons.calendar,
      title: 'No Logs Match',
      description: 'Try adjusting your filters.',
    });
    return;
  }

  // Sort by date descending
  const sortedLogs = [...logs].sort((a, b) => new Date(b.weekEnding) - new Date(a.weekEnding));

  container.innerHTML = sortedLogs.map((log, index) => renderLogEntry(log, index)).join('');
}

function renderLogEntry(log, index) {
  const weekLabel = `Week ${getWeekNumber(log.weekEnding)}`;
  const dateRange = formatWeekRange(log.weekStarting, log.weekEnding);
  const hours = log.hours || 0;

  const documentationLink = log.documentationUrl || log.reflectionUrl;
  const weeklyReportLink = log.weeklyReportUrl || log.reportUrl;

  const links = [];
  if (documentationLink) {
    links.push(`<a href="${documentationLink}" class="log-link" target="_blank" rel="noopener">${Components.icons['file-text']} Documentation</a>`);
  }
  if (weeklyReportLink) {
    links.push(`<a href="${weeklyReportLink}" class="log-link" target="_blank" rel="noopener">${Components.icons.external} Weekly Report</a>`);
  }

  return `
    <article class="log-entry" data-week="${getWeekNumber(log.weekEnding)}" style="animation-delay: ${index * 100}ms">
      <div class="log-entry-marker" aria-hidden="true"></div>
      <div class="log-entry-card card">
        <header class="log-entry-header">
          <div>
            <h3 class="log-entry-week">${Components.escapeHtml(weekLabel)}</h3>
            <time class="log-entry-date" datetime="${log.weekEnding}">${Components.icons.calendar} ${dateRange}</time>
          </div>
        </header>
        <footer class="log-entry-footer">
          <div class="log-entry-hours">
            ${Components.icons.clock} ${hours} hours
          </div>
          ${links.length ? `<div class="log-entry-links">${links.join('')}</div>` : ''}
        </footer>
      </div>
    </article>
  `;
}

function getWeekNumber(dateString) {
  const date = new Date(dateString);
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

function formatWeekRange(start, end) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const options = { month: 'short', day: 'numeric' };
  return `${startDate.toLocaleDateString('en-US', options)} - ${endDate.toLocaleDateString('en-US', options)}`;
}

function initLogsFilters(logs, container) {
  const filterContainer = document.querySelector('.logs-filters');
  const select = document.querySelector('.logs-filter-select');
  if (!filterContainer || !select) return;

  const weeks = [...new Set(logs.map(log => getWeekNumber(log.weekEnding)).sort((a, b) => a - b))];
  select.innerHTML = '<option value="all">All weeks</option>' + weeks.map(week => `
    <option value="${week}">Week ${week}</option>
  `).join('');

  select.addEventListener('change', (event) => {
    const selectedWeek = event.target.value;
    const entries = container.querySelectorAll('.log-entry');

    entries.forEach(entry => {
      const entryWeek = entry.dataset.week;
      if (selectedWeek === 'all' || entryWeek === selectedWeek) {
        entry.style.display = '';
        entry.style.animation = 'slideUp 0.4s ease forwards';
      } else {
        entry.style.display = 'none';
      }
    });
  });
}

// ==========================================================================
// Home Page Logic
// ==========================================================================

async function initHomePage() {
  // Load profile data for dynamic content
  const data = await loadJSON('../../data/profile.json');
  if (data) {
    updateHomeContent(data);
  }

  // Initialize hero stats counter animation
  animateStats();
}

function updateHomeContent(profile) {
  // Update greeting
  const greeting = document.querySelector('.hero-greeting');
  if (greeting && profile.greeting) {
    greeting.innerHTML = `${profile.greeting} <span class="wave" aria-hidden="true">👋</span>`;
  }

  // Update hero title
  const title = document.querySelector('.hero-title');
  if (title && profile.name) {
    title.innerHTML = `I'm <span class="highlight">${profile.name}</span>`;
  }

  // Update description
  const desc = document.querySelector('.hero-description');
  if (desc && profile.bio) {
    desc.textContent = profile.bio;
  }

  // Update stats
  if (profile.stats) {
    document.querySelectorAll('.hero-stat').forEach((stat, i) => {
      if (profile.stats[i]) {
        const num = stat.querySelector('.hero-stat-number');
        const label = stat.querySelector('.hero-stat-label');
        if (num && profile.stats[i].value) num.textContent = profile.stats[i].value;
        if (label && profile.stats[i].label) label.textContent = profile.stats[i].label;
      }
    });
  }
}

function animateStats() {
  const statNumbers = document.querySelectorAll('.hero-stat-number, .stat-number, .summary-number');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.dataset.target || el.textContent);
        if (!isNaN(target) && !el.classList.contains('animated')) {
          el.classList.add('animated');
          animateNumber(el, 0, target, 1500);
        }
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => observer.observe(el));
}

function animateNumber(element, start, end, duration) {
  const decimals = (end.toString().split('.')[1] || '').length;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOutCubic(progress);
    const current = start + (end - start) * eased;
    element.textContent = current.toFixed(decimals);

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = end.toFixed(decimals);
    }
  }

  requestAnimationFrame(update);
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

// ==========================================================================
// Utility Functions
// ==========================================================================

function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ==========================================================================
// Initialize Based on Current Page
// ==========================================================================

function initPage() {
  const page = Components.getCurrentPage();

  switch (page) {
    case 'index':
      initHomePage();
      break;
    case 'documents':
      initDocumentsPage();
      break;
    case 'weekly-logs':
      initWeeklyLogsPage();
      break;
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPage);
} else {
  initPage();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initDocumentsPage,
    initWeeklyLogsPage,
    initHomePage,
    loadJSON
  };
}