/**
 * OJT Portfolio - Components Module
 * Handles dynamic rendering of header, footer, and shared UI components
 */

const Components = (function() {
  'use strict';

  // ==========================================================================
  // Configuration
  // ==========================================================================
  const config = {
    siteName: 'Karl\'s OJT Portfolio',
    shortName: 'KARL',
    navigation: [
      { href: 'index.html', label: 'About Me', icon: 'user' },
      { href: 'documents.html', label: 'Documents', icon: 'file-text' },
      { href: 'weekly-logs.html', label: 'Weekly Logs', icon: 'calendar' }
    ],
    contact: {
      email: 'romerokarl434@gmail.com',
      phone: '+63 (976) 454-0437',
      location: 'Caloocan City, Philippines',
      linkedin: 'https://www.linkedin.com/in/karltristanromero',
      github: 'https://github.com/karltristanromero',
      portfolio: 'https://karl.dev'
    },
    socialLinks: [
      { name: 'LinkedIn', href: 'https://www.linkedin.com/in/karltristanromero/karl', icon: 'linkedin' },
      { name: 'GitHub', href: 'https://github.com/karltristanromero', icon: 'github' },
      { name: 'Email', href: 'mailto:romerokarl434@gmail.com', icon: 'mail' }
    ],
    footerNote: 'Built with care for my OJT journey'
  };

  // ==========================================================================
  // SVG Icons
  // ==========================================================================
  const icons = {
    user: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    'file-text': '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
    pdf: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><path d="M9 15h6"/></svg>',
    doc: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="16" x2="8" y2="16"/><line x1="16" y1="12" x2="8" y2="12"/><line x1="10" y1="8" x2="9" y2="8"/></svg>',
    image: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>',
    file: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16v16H4z"/><path d="M8 2v4"/><path d="M16 2v4"/></svg>',
    calendar: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
    menu: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
    close: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    linkedin: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>',
    github: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>',
    mail: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
    phone: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
    location: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    download: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
    external: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
    clock: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    tag: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>',
    technology: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 3v3"/><path d="M15 3v3"/><path d="M9 21v-3"/><path d="M15 21v-3"/><path d="M3 9h3"/><path d="M3 15h3"/><path d="M21 9h-3"/><path d="M21 15h-3"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>'
  };

  // ==========================================================================
  // Template Functions
  // ==========================================================================

  /**
   * Render the header component
   */
  function renderHeader() {
    const currentPage = getCurrentPage();
    const navItems = config.navigation.map(item => {
      const resolvedHref = resolvePageHref(item.href);
      const isActive = (currentPage === 'index' && resolvedHref.endsWith('index.html')) ||
                       (currentPage !== 'index' && resolvedHref.endsWith(`${currentPage}.html`));
      return `
        <li>
          <a href="${resolvedHref}" class="nav-link ${isActive ? 'active' : ''}" ${isActive ? 'aria-current="page"' : ''}>
            ${icons[item.icon]}
            ${item.label}
          </a>
        </li>
      `;
    }).join('');

    return `
      <header class="header" role="banner">
        <div class="header-inner">
          <a href="${resolvePageHref('index.html')}" class="logo" aria-label="${config.siteName} - Home">
            <span class="logo-icon" aria-hidden="true">${icons.technology}</span>
            <span class="logo-text">${config.shortName}<span class="logo-accent">.</span></span>
          </a>

          <nav class="nav" role="navigation" aria-label="Main navigation">
            <button class="nav-toggle" aria-expanded="false" aria-controls="nav-menu" aria-label="Toggle navigation menu">
              <span class="nav-toggle-line"></span>
              <span class="nav-toggle-line"></span>
              <span class="nav-toggle-line"></span>
            </button>

            <div class="nav-overlay" aria-hidden="true"></div>

            <ul class="nav-list" id="nav-menu" role="menubar">
              ${navItems}
            </ul>
          </nav>
        </div>
      </header>
    `;
  }

  /**
   * Render the footer component
   */
  function renderFooter() {
    const { contact, socialLinks, footerNote } = config;

    return `
      <footer class="footer" role="contentinfo">
        <div class="footer-inner">
          <div class="footer-grid">
            <div class="footer-brand">
              <a href="${resolvePageHref('index.html')}" class="footer-logo" aria-label="${config.siteName} - Home">
                <span class="logo-icon" aria-hidden="true">${icons.technology}</span>
                <span class="logo-text">${config.shortName}<span class="logo-accent">.</span></span>
              </a>
              <p class="footer-tagline">${footerNote}</p>
            </div>

            <div class="footer-column">
              <h4>Quick Links</h4>
              <ul class="footer-links">
                <li><a href="${resolvePageHref('index.html')}">About Me</a></li>
                <li><a href="${resolvePageHref('documents.html')}">Documents</a></li>
                <li><a href="${resolvePageHref('weekly-logs.html')}">Weekly Logs</a></li>
              </ul>
            </div>

            <div class="footer-column">
              <h4>Contact</h4>
              <ul class="footer-contact">
                <li class="footer-contact-item">
                  ${icons.mail}
                  <a href="mailto:${contact.email}">${contact.email}</a>
                </li>
                <li class="footer-contact-item">
                  ${icons.phone}
                  <a href="tel:${contact.phone.replace(/\D/g, '')}">${contact.phone}</a>
                </li>
                <li class="footer-contact-item">
                  ${icons.location}
                  <span>${contact.location}</span>
                </li>
              </ul>
            </div>

            <div class="footer-column">
              <h4>Connect</h4>
              <div class="footer-social">
                ${socialLinks.map(social => `
                  <a href="${social.href}" class="footer-social-link" aria-label="${social.name}" target="_blank" rel="noopener noreferrer">
                    ${icons[social.icon]}
                  </a>
                `).join('')}
              </div>
            </div>
          </div>

          <div class="footer-bottom">
            <p class="footer-copyright">&copy; ${new Date().getFullYear()} ${config.siteName}. All rights reserved.</p>
            <div class="footer-legal">
              <a href="#privacy">Privacy Policy</a>
              <a href="#terms">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    `;
  }

  /**
   * Render a card component
   */
  function renderCard(data) {
    const {
      title,
      subtitle,
      content,
      tags = [],
      footer,
      icon,
      className = ''
    } = data;

    const tagElements = tags.map(tag => `
      <span class="card-tag ${tag.variant || ''}">${tag.label}</span>
    `).join('');

    return `
      <article class="card ${className}">
        ${icon ? `<div class="card-icon">${icon}</div>` : ''}
        <header class="card-header">
          <h3 class="card-title">${escapeHtml(title)}</h3>
          ${subtitle ? `<p class="card-subtitle">${escapeHtml(subtitle)}</p>` : ''}
        </header>
        ${content ? `<div class="card-body">${content}</div>` : ''}
        ${tags.length ? `<div class="card-tags">${tagElements}</div>` : ''}
        ${footer ? `<footer class="card-footer">${footer}</footer>` : ''}
      </article>
    `;
  }

  /**
   * Render a button component
   */
  function renderButton(data) {
    const {
      text,
      href,
      variant = 'primary',
      size = 'md',
      icon,
      className = '',
      onClick,
      disabled = false,
      type = 'button'
    } = data;

    const isLink = href !== undefined;
    const tag = isLink ? 'a' : 'button';
    const attributes = {
      class: `btn btn-${variant} btn-${size} ${className}`,
      ...(isLink ? { href } : { type, disabled }),
      'aria-disabled': disabled
    };

    return `<${tag} ${Object.entries(attributes).map(([k, v]) => v !== undefined ? `${k}="${v}"` : '').join(' ')}>
      ${icon ? `<span class="btn-icon" aria-hidden="true">${icon}</span>` : ''}
      <span class="btn-text">${escapeHtml(text)}</span>
    </${tag}>`;
  }

  /**
   * Render a badge/tag component
   */
  function renderBadge(data) {
    const { text, variant = 'default', icon, className = '' } = data;
    const variantClass = variant !== 'default' ? `badge-${variant}` : '';
    return `<span class="badge ${variantClass} ${className}">${icon ? `<span aria-hidden="true">${icon}</span>` : ''}${escapeHtml(text)}</span>`;
  }

  /**
   * Render a stat card
   */
  function renderStat(data) {
    const { label, value, icon, trend, className = '' } = data;
    return `
      <div class="stat-card ${className}">
        ${icon ? `<div class="stat-icon" aria-hidden="true">${icon}</div>` : ''}
        <div class="stat-value">${escapeHtml(value)}</div>
        <div class="stat-label">${escapeHtml(label)}</div>
        ${trend ? `<div class="stat-trend ${trend.positive ? 'positive' : 'negative'}">${trend.value}</div>` : ''}
      </div>
    `;
  }

  /**
   * Render empty state
   */
  function renderEmptyState(data) {
    const { icon, title, description, action } = data;
    return `
      <div class="empty-state">
        <div class="empty-state-icon" aria-hidden="true">${icon || icons.wave}</div>
        <h3 class="empty-state-title">${escapeHtml(title)}</h3>
        <p class="empty-state-text">${escapeHtml(description)}</p>
        ${action ? renderButton(action) : ''}
      </div>
    `;
  }

  // ==========================================================================
  // Utility Functions
  // ==========================================================================

  function getCurrentPage() {
    const path = window.location.pathname.replace(/\/+$/, '');
    const page = path.split('/').pop() || 'index';
    return page === '' ? 'index' : page.replace('.html', '');
  }

  function resolvePageHref(href) {
    if (href === 'index.html') return '/';
    if (href === 'documents.html') return '/src/html/documents.html';
    if (href === 'weekly-logs.html') return '/src/html/weekly-logs.html';
    return href;
  }

  function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // ==========================================================================
  // DOM Injection
  // ==========================================================================

  /**
   * Inject header into the page
   */
  function injectHeader() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
      headerPlaceholder.innerHTML = renderHeader();
      initHeaderInteractions();
    }
  }

  /**
   * Inject footer into the page
   */
  function injectFooter() {
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
      footerPlaceholder.innerHTML = renderFooter();
    }
  }

  /**
   * Initialize header interactions (mobile menu, etc.)
   */
  function initHeaderInteractions() {
    const navToggle = document.querySelector('.nav-toggle');
    const navList = document.querySelector('.nav-list');
    const navOverlay = document.querySelector('.nav-overlay');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!navToggle || !navList) return;

    function openMenu() {
      navToggle.setAttribute('aria-expanded', 'true');
      navList.classList.add('is-open');
      navOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      navToggle.setAttribute('aria-expanded', 'false');
      navList.classList.remove('is-open');
      navOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }

    function toggleMenu() {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeMenu();
      } else {
        openMenu();
      }
    }

    navToggle.addEventListener('click', toggleMenu);
    navOverlay.addEventListener('click', closeMenu);

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth < 768) {
          closeMenu();
        }
      });
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navList.classList.contains('is-open')) {
        closeMenu();
        navToggle.focus();
      }
    });

    // Handle resize
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (window.innerWidth >= 768 && navList.classList.contains('is-open')) {
          closeMenu();
        }
      }, 100);
    });
  }

  /**
   * Initialize all components
   */
  function init() {
    // Inject header and footer if placeholders exist
    if (document.getElementById('header-placeholder')) {
      injectHeader();
    }
    if (document.getElementById('footer-placeholder')) {
      injectFooter();
    }
  }

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // ==========================================================================
  // Public API
  // ==========================================================================
  return {
    config,
    icons,
    renderHeader,
    renderFooter,
    renderCard,
    renderButton,
    renderBadge,
    renderStat,
    renderEmptyState,
    injectHeader,
    injectFooter,
    initHeaderInteractions,
    init,
    escapeHtml,
    getCurrentPage
  };
})();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Components;
}