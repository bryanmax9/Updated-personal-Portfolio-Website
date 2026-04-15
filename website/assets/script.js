// ── Word Pull-Up ─────────────────────────────────────────────────────────────
// Splits text inside [data-pull-up] elements into animated word spans
function buildPullUp(el) {
  const text = el.getAttribute('data-text') || el.textContent;
  const isItalic = el.hasAttribute('data-italic');
  el.textContent = '';

  const container = document.createElement('span');
  container.className = 'pull-up' + (el.getAttribute('data-gap') === 'multi' ? ' pull-up-multi' : '');

  text.split(' ').forEach((word) => {
    const wrap = document.createElement('span');
    wrap.className = 'pull-up-word-wrap';
    const inner = document.createElement('span');
    inner.className = 'pull-up-word' + (isItalic ? ' font-serif-italic' : '');
    inner.textContent = word;
    wrap.appendChild(inner);
    container.appendChild(wrap);
  });

  el.appendChild(container);
  return container.querySelectorAll('.pull-up-word');
}

function triggerPullUp(words, delayBase, delayStep) {
  words.forEach((w, i) => {
    setTimeout(() => w.classList.add('visible'), (delayBase + i * delayStep) * 1000);
  });
}

// ── Animated Paragraph (scroll-linked character opacity) ──────────────────────
function buildScrollReveal(el) {
  const text = el.getAttribute('data-text') || el.textContent;
  el.textContent = '';
  [...text].forEach((char) => {
    const span = document.createElement('span');
    span.className = 'anim-char';
    span.textContent = char;
    el.appendChild(span);
  });
}

function updateScrollReveal() {
  const paras = document.querySelectorAll('[data-anim="scroll-chars"]');
  const vh = window.innerHeight;

  paras.forEach((para) => {
    const rect = para.getBoundingClientRect();
    // start: element top at 85% viewport height, end: element top at 25%
    const startY = vh * 0.85;
    const endY   = vh * 0.25;
    const total  = para.children.length;

    // Progress of the whole container through the scroll window [0..1]
    const progress = (startY - rect.top) / (startY - endY);

    Array.from(para.children).forEach((char, i) => {
      const charStart = i / total;
      const charEnd   = charStart + 0.08;
      const charProgress = (progress - charStart) / (charEnd - charStart);
      const opacity = 0.15 + Math.max(0, Math.min(1, charProgress)) * 0.85;
      char.style.opacity = opacity;
    });
  });
}

// ── IntersectionObserver helpers ──────────────────────────────────────────────
function observeOnce(selector, margin, callback) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callback(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: margin || '0px' }
  );
  document.querySelectorAll(selector).forEach((el) => observer.observe(el));
}

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // ── Hero animations (fire immediately on load) ───────────────────────────
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    // The title words are already in the DOM from HTML; just trigger
    const words = heroTitle.querySelectorAll('.pull-up-word');
    // Fade in title container
    requestAnimationFrame(() => {
      heroTitle.classList.add('loaded');
      triggerPullUp(words, 0, 0.08);
    });
  }

  // Hero desc + cta
  requestAnimationFrame(() => {
    document.querySelectorAll('.hero-desc, .hero-cta').forEach((el) => {
      // CSS handles the delay via transition-delay
      requestAnimationFrame(() => el.classList.add('loaded'));
    });
  });

  // ── Build scroll-reveal paragraphs ──────────────────────────────────────
  document.querySelectorAll('[data-anim="scroll-chars"]').forEach(buildScrollReveal);
  window.addEventListener('scroll', updateScrollReveal, { passive: true });
  updateScrollReveal();

  // ── Feature cards ────────────────────────────────────────────────────────
  observeOnce('.feature-card', '-80px 0px', (el) => {
    const delay = parseFloat(el.dataset.delay || '0');
    setTimeout(() => el.classList.add('visible'), delay * 1000);
  });

  // ── Experience rows ──────────────────────────────────────────────────────
  observeOnce('.exp-row', '0px', (el) => {
    const delay = parseFloat(el.dataset.delay || '0');
    setTimeout(() => el.classList.add('visible'), delay * 1000);
  });

  // ── In-view pull-up (about + contact headings) ───────────────────────────
  observeOnce('[data-anim="pull-up-view"]', '-60px 0px', (el) => {
    const words = el.querySelectorAll('.pull-up-word');
    const base = parseFloat(el.dataset.delayBase || '0');
    const step = parseFloat(el.dataset.delayStep || '0.065');
    triggerPullUp(words, base, step);
  });

  // ── Profile & Resume cards ───────────────────────────────────────────────
  observeOnce('.profile-photo-card, .profile-resume-card', '-40px 0px', (el) => {
    el.classList.add('visible');
  });

  // ── Skill groups ─────────────────────────────────────────────────────────
  observeOnce('.skill-group', '-40px 0px', (el) => {
    const delay = parseFloat(el.dataset.delay || '0');
    setTimeout(() => el.classList.add('visible'), delay * 1000);
  });

  // ── Contact CTA scroll reveal ────────────────────────────────────────────
  observeOnce('.contact-cta-wrap', '0px', (el) => {
    el.classList.add('visible');
  });
});
