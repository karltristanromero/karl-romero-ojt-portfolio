/* ==========================================================================
   OJT Portfolio - Main JavaScript
   Core functionality: navigation, theme, smooth scroll, utilities
   ========================================================================== */

// ==========================================================================
// Configuration
// ==========================================================================
const AppConfig = {
  // Animation durations
  animation: {
    fast: 150,
    base: 250,
    slow: 350
  },

  // Breakpoints
  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280
  },

  // Scroll offset for anchor links (header height)
  scrollOffset: 80
};

// ==========================================================================
// Utility Functions
// ==========================================================================

/**
 * Debounce function to limit rate of execution
 */
function debounce(func, wait, immediate = false) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(this, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(this, args);
  };
}

/**
 * Throttle function to limit rate of execution
 */
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Check if element is in viewport
 */
function isInViewport(element, threshold = 0) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top <= (window.innerHeight || document.documentElement.clientHeight) * (1 - threshold) &&
    rect.bottom >= (window.innerHeight || document.documentElement.clientHeight) * threshold
  );
}

/**
 * Smooth scroll to element
 */
function smoothScrollTo(target, offset = AppConfig.scrollOffset) {
  const element = typeof target === 'string' ? document.querySelector(target) : target;
  if (!element) return;

  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - offset;

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });
}

/**
 * Get current page name from URL
 */
function getCurrentPage() {
  const path = window.location.pathname.replace(/\/+$/, '');
  const page = path.split('/').pop() || 'index';
  return page === '' ? 'index' : page.replace('.html', '');
}

/**
 * Format date for display
 */
function formatDate(dateString, options = {}) {
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  };
  return new Date(dateString).toLocaleDateString('en-US', defaultOptions);
}

/**
 * Format relative time (e.g., "2 days ago")
 */
function formatRelativeTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffMinutes > 0) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
  return 'Just now';
}

/**
 * Generate unique ID
 */
function generateId(prefix = 'id') {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Create element with attributes and children
 */
function createElement(tag, attributes = {}, children = []) {
  const element = document.createElement(tag);
  Object.entries(attributes).forEach(([key, value]) => {
    if (key === 'class') {
      element.className = value;
    } else if (key === 'style' && typeof value === 'object') {
      Object.assign(element.style, value);
    } else if (key === 'innerHTML') {
      element.innerHTML = value;
    } else if (key.startsWith('data-')) {
      element.setAttribute(key, value);
    } else if (key.startsWith('on') && typeof value === 'function') {
      element.addEventListener(key.slice(2).toLowerCase(), value);
    } else {
      element.setAttribute(key, value);
    }
  });
  children.forEach(child => {
    if (typeof child === 'string') {
      element.appendChild(document.createTextNode(child));
    } else if (child instanceof Node) {
      element.appendChild(child);
    }
  });
  return element;
}

// ==========================================================================
// Intersection Observer for Scroll Animations
// ==========================================================================
class ScrollAnimator {
  constructor(options = {}) {
    this.options = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
      ...options
    };
    this.observer = null;
    this.elements = new Set();
    this.init();
  }

  init() {
    if (typeof IntersectionObserver === 'undefined') {
      // Fallback for browsers without IntersectionObserver
      this.elements.forEach(el => el.classList.add('animate-fade-in'));
      return;
    }

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-slide-up');
          this.observer.unobserve(entry.target);
        }
      });
    }, this.options);
  }

  observe(element) {
    if (element && this.observer) {
      this.observer.observe(element);
      this.elements.add(element);
    }
  }

  observeAll(selector) {
    document.querySelectorAll(selector).forEach(el => this.observe(el));
  }

  disconnect() {
    if (this.observer) {
      this.observer.disconnect();
      this.elements.clear();
    }
  }
}

// ==========================================================================
// Active Navigation Highlighting
// ==========================================================================
function initActiveNavigation() {
  const currentPage = getCurrentPage();
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    const linkPage = href.replace('.html', '');

    if ((currentPage === 'index' && linkPage === 'index') ||
        (currentPage !== 'index' && linkPage === currentPage)) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    }
  });
}

// ==========================================================================
// Smooth Scroll for Anchor Links
// ==========================================================================
function initSmoothScroll() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const href = link.getAttribute('href');
    if (href === '#') return;

    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      smoothScrollTo(target);
      target.focus({ preventScroll: true });
    }
  });
}

// ==========================================================================
// Scroll to Top Button
// ==========================================================================
function initScrollToTop() {
  const scrollBtn = createElement('button', {
    class: 'scroll-to-top',
    'aria-label': 'Scroll to top',
    innerHTML: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>'
  });

  scrollBtn.style.cssText = `
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: var(--primary);
    color: var(--white);
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: var(--shadow-lg);
    opacity: 0;
    visibility: hidden;
    transform: translateY(20px);
    transition: all var(--transition-base);
    z-index: 999;
  `;

  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  scrollBtn.addEventListener('mouseenter', () => {
    scrollBtn.style.background = 'var(--primary-hover)';
    scrollBtn.style.transform = 'translateY(-4px)';
  });

  scrollBtn.addEventListener('mouseleave', () => {
    scrollBtn.style.background = 'var(--primary)';
    scrollBtn.style.transform = 'translateY(0)';
  });

  document.body.appendChild(scrollBtn);

  const toggleScrollBtn = throttle(() => {
    if (window.pageYOffset > 300) {
      scrollBtn.style.opacity = '1';
      scrollBtn.style.visibility = 'visible';
      scrollBtn.style.transform = 'translateY(0)';
    } else {
      scrollBtn.style.opacity = '0';
      scrollBtn.style.visibility = 'hidden';
      scrollBtn.style.transform = 'translateY(20px)';
    }
  }, 100);

  window.addEventListener('scroll', toggleScrollBtn, { passive: true });
}

// ==========================================================================
// Preloader (Optional)
// ==========================================================================
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  window.addEventListener('load', () => {
    preloader.style.opacity = '0';
    preloader.style.visibility = 'hidden';
    setTimeout(() => {
      preloader.remove();
    }, 500);
  });
}

// ==========================================================================
// Image Lazy Loading Enhancement
// ==========================================================================
function initLazyImages() {
  if ('loading' in HTMLImageElement.prototype) {
    // Native lazy loading supported
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
      img.src = img.dataset.src || img.src;
    });
    return;
  }

  // Fallback for browsers without native lazy loading
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        img.removeAttribute('data-src');
        imageObserver.unobserve(img);
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

// ==========================================================================
// Keyboard Navigation Enhancement
// ==========================================================================
function initKeyboardNavigation() {
  // Trap focus in mobile menu when open
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      const navMenu = document.querySelector('.nav-list');
      if (navMenu && navMenu.classList.contains('is-open')) {
        const focusableElements = navMenu.querySelectorAll(
          'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  });
}

// ==========================================================================
// Theme Toggle (Optional - for future dark mode)
// ==========================================================================
function initThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;

  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');

  document.documentElement.setAttribute('data-theme', currentTheme);
  themeToggle.setAttribute('aria-pressed', currentTheme === 'dark');

  themeToggle.addEventListener('click', () => {
    const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    themeToggle.setAttribute('aria-pressed', newTheme === 'dark');
  });
}

// ==========================================================================
// Copy to Clipboard Utility
// ==========================================================================
async function copyToClipboard(text, button) {
  try {
    await navigator.clipboard.writeText(text);
    showToast('Copied to clipboard!', 'success');
    if (button) {
      const originalText = button.innerHTML;
      button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Copied!';
      button.classList.add('copied');
      setTimeout(() => {
        button.innerHTML = originalText;
        button.classList.remove('copied');
      }, 2000);
    }
  } catch (err) {
    showToast('Failed to copy', 'error');
  }
}

// ==========================================================================
// Toast Notification System
// ==========================================================================
function showToast(message, type = 'info', duration = 3000) {
  const container = getOrCreateToastContainer();
  const toast = createElement('div', {
    class: `toast toast-${type}`,
    role: 'alert',
    'aria-live': 'polite'
  }, [
    createElement('span', { class: 'toast-message' }, message),
    createElement('button', {
      class: 'toast-close',
      'aria-label': 'Dismiss',
      onclick: () => toast.remove()
    }, '×')
  ]);

  container.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => {
    toast.classList.add('toast-show');
  });

  // Auto remove
  setTimeout(() => {
    toast.classList.remove('toast-show');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

function getOrCreateToastContainer() {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = createElement('div', { id: 'toast-container' });
    container.style.cssText = `
      position: fixed;
      bottom: 2rem;
      left: 2rem;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      pointer-events: none;
    `;
    document.body.appendChild(container);
  }
  return container;
}

// Add toast styles dynamically
const toastStyles = `
  .toast {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 1.5rem;
    background: var(--bg-card);
    border: 1px solid var(--border-light);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg);
    color: var(--text-primary);
    font-size: var(--fs-sm);
    max-width: 360px;
    transform: translateX(120%);
    opacity: 0;
    transition: all var(--transition-base);
    pointer-events: auto;
  }
  .toast-show {
    transform: translateX(0);
    opacity: 1;
  }
  .toast-success { border-left: 4px solid var(--primary); }
  .toast-error { border-left: 4px solid var(--terracotta); }
  .toast-info { border-left: 4px solid var(--mustard); }
  .toast-close {
    background: none;
    border: none;
    color: var(--text-muted);
    font-size: var(--fs-xl);
    cursor: pointer;
    padding: 0;
    line-height: 1;
    margin-left: auto;
  }
  .toast-close:hover { color: var(--text-primary); }
`;

// Inject toast styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = toastStyles;
  document.head.appendChild(styleSheet);
}

// ==========================================================================
// Initialize All Core Functionality
// ==========================================================================
function initApp() {
  // Wait for components to be rendered first
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
    return;
  }

  // Core initializations
  initActiveNavigation();
  initSmoothScroll();
  initScrollToTop();
  initLazyImages();
  initKeyboardNavigation();
  initThemeToggle();

  // Initialize scroll animator
  window.scrollAnimator = new ScrollAnimator();

  // Observe elements for animation
  const animatedElements = document.querySelectorAll(
    '.card, .section-header, .hero-content > *, .value-card, .stat-card, .journey-card, .document-card, .log-entry'
  );
  animatedElements.forEach(el => window.scrollAnimator.observe(el));

  // Dispatch custom event for other scripts
  window.dispatchEvent(new CustomEvent('app:ready'));
}

// Start initialization
initApp();

// ==========================================================================
// Export for Module Usage
// ==========================================================================
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    AppConfig,
    debounce,
    throttle,
    isInViewport,
    smoothScrollTo,
    getCurrentPage,
    formatDate,
    formatRelativeTime,
    generateId,
    escapeHtml,
    createElement,
    ScrollAnimator,
    copyToClipboard,
    showToast
  };
}