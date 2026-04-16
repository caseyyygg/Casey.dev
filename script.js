/* =============================================
   PORTFOLIO — Interactive Enhancements
   script.js
   ============================================= */

/* ══════════════════════════════════════
   1. SCROLL PROGRESS BAR
══════════════════════════════════════ */
function initScrollProgress() {
  const bar = document.createElement('div');
  bar.id = 'scroll-progress';
  document.body.prepend(bar);

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = pct + '%';
  }, { passive: true });
}


/* ══════════════════════════════════════
   2. CUSTOM CURSOR
══════════════════════════════════════ */
function initCursor() {
  // Only on non-touch devices
  if (window.matchMedia('(hover: none)').matches) return;

  const dot   = document.createElement('div');
  const ring  = document.createElement('div');
  dot.id  = 'cursor-dot';
  ring.id = 'cursor-ring';
  document.body.append(dot, ring);

  let mouseX = -100, mouseY = -100;
  let ringX  = -100, ringY  = -100;
  let rafId;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  // Smooth ring lerp
  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
    rafId = requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover states
  const clickables = 'a, button, .btn, .nav-cta, .hobby-card, .project-card, .skill-tag, .about-card, .contact-link';

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(clickables)) {
      ring.classList.add('cursor-hover');
      dot.classList.add('cursor-hover');
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(clickables)) {
      ring.classList.remove('cursor-hover');
      dot.classList.remove('cursor-hover');
    }
  });

  document.addEventListener('mousedown', () => {
    ring.classList.add('cursor-click');
    dot.classList.add('cursor-click');
  });
  document.addEventListener('mouseup', () => {
    ring.classList.remove('cursor-click');
    dot.classList.remove('cursor-click');
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity = '1';
    ring.style.opacity = '1';
  });
}


/* ══════════════════════════════════════
   3. TYPING EFFECT — Hero Sub
══════════════════════════════════════ */
function initTypingEffect() {
  const roles = [
    '3rd Year CS Student',
    'UI/UX Designer',
    'Front-end Developer',
    'Based in the Philippines',
  ];

  const target = document.querySelector('.hero-sub');
  if (!target) return;

  // Wrap text in a span we can control
  target.innerHTML = '<span class="typed-text"></span><span class="typed-cursor">|</span>';
  const typedEl = target.querySelector('.typed-text');

  let roleIdx   = 0;
  let charIdx   = 0;
  let deleting  = false;
  let pauseTick = 0;

  const TYPING_SPEED  = 55;
  const DELETE_SPEED  = 30;
  const PAUSE_AFTER   = 38;   // ticks to wait after full word

  function tick() {
    const current = roles[roleIdx];

    if (!deleting && pauseTick < PAUSE_AFTER && charIdx === current.length) {
      pauseTick++;
      setTimeout(tick, 50);
      return;
    }

    if (pauseTick >= PAUSE_AFTER && !deleting) {
      deleting  = true;
      pauseTick = 0;
    }

    if (deleting) {
      charIdx--;
      typedEl.textContent = current.slice(0, charIdx);
      if (charIdx === 0) {
        deleting = false;
        roleIdx  = (roleIdx + 1) % roles.length;
        setTimeout(tick, 400);
        return;
      }
      setTimeout(tick, DELETE_SPEED);
    } else {
      charIdx++;
      typedEl.textContent = current.slice(0, charIdx);
      setTimeout(tick, TYPING_SPEED);
    }
  }

  // Start after hero animation finishes
  setTimeout(tick, 900);
}


/* ══════════════════════════════════════
   4. COUNT-UP NUMBERS — About Stats
══════════════════════════════════════ */
function initCountUp() {
  const stats = [
    { el: null, end: 3,  suffix: 'rd', duration: 1200 },
    { el: null, end: 10, suffix: '+',  duration: 1600 },
    { el: null, end: 5,  suffix: '+',  duration: 1400 },
  ];

  const statEls = document.querySelectorAll('.stat-num');
  if (statEls.length < 3) return;

  stats.forEach((s, i) => { s.el = statEls[i]; });

  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  function countUp(stat) {
    const startTime = performance.now();
    function step(now) {
      const elapsed  = now - startTime;
      const progress = Math.min(elapsed / stat.duration, 1);
      const eased    = easeOutCubic(progress);
      const value    = Math.floor(eased * stat.end);
      stat.el.textContent = value + stat.suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // Trigger when stats enter viewport
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        stats.forEach(countUp);
        observer.disconnect();
      }
    });
  }, { threshold: 0.5 });

  const statsContainer = document.querySelector('.about-stats');
  if (statsContainer) observer.observe(statsContainer);
}


/* ══════════════════════════════════════
   5. FLIP HOBBY CARDS
══════════════════════════════════════ */
function initHobbyFlip() {
  const flipData = {
    '🎮': {
      back: 'Nothing beats unwinding with a good game. It actually sharpens my problem-solving and eye for UI/UX patterns without me even realising.'
    },
    '🍳': {
      back: 'Cooking is just design thinking in the kitchen — experimenting, iterating, and sharing the results. Always worth the process.'
    },
    '📺': {
      back: 'Great films teach composition, pacing, and storytelling — skills that translate directly into thoughtful visual design.'
    },
    '🎵': {
      back: 'Music sets the mood for every design session. From lo-fi to classical — the right track unlocks a different kind of focus.'
    },
    '📚': {
      back: 'Pinterest rabbit holes are my creative fuel — color palettes, grid layouts, and micro-interactions I bookmark for future work.'
    },
  };

  document.querySelectorAll('.hobby-card').forEach(card => {
    const iconEl = card.querySelector('.hobby-icon');
    if (!iconEl) return;
    const emoji   = iconEl.textContent.trim();
    const data    = flipData[emoji];
    if (!data) return;

    // Wrap in flip structure
    const front = card.innerHTML;
    card.classList.add('hobby-flip-card');
    card.innerHTML = `
      <div class="hobby-flip-inner">
        <div class="hobby-flip-front">${front}</div>
        <div class="hobby-flip-back">
          <div class="hobby-flip-emoji">${emoji}</div>
          <p class="hobby-flip-text">${data.back}</p>
        </div>
      </div>
    `;
  });
}


/* ══════════════════════════════════════
   6. SCROLL ANIMATIONS (existing + enhanced)
══════════════════════════════════════ */
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger children within a section
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.project-card, .hobby-card, .skill-category, .bar-row, .about-card').forEach(el => {
    el.classList.add('animate-on-scroll');
    observer.observe(el);
  });

  // Bar animation on scroll
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.bar-fill').forEach(bar => {
          bar.style.width = bar.style.getPropertyValue('--w') || bar.getAttribute('data-w');
        });
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.proficiency-bars').forEach(el => barObserver.observe(el));
}


/* ══════════════════════════════════════
   7. NAV ACTIVE HIGHLIGHT
══════════════════════════════════════ */
function initNavHighlight() {
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 100) current = section.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }, { passive: true });
}


/* ══════════════════════════════════════
   8. SKILL TAG HOVER RIPPLE
══════════════════════════════════════ */
function initSkillRipple() {
  document.querySelectorAll('.skill-tag').forEach(tag => {
    tag.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      ripple.classList.add('skill-ripple');
      const rect = this.getBoundingClientRect();
      ripple.style.left = (e.clientX - rect.left) + 'px';
      ripple.style.top  = (e.clientY - rect.top)  + 'px';
      this.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });
}


/* ══════════════════════════════════════
   INIT ALL
══════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initCursor();
  initTypingEffect();
  initCountUp();
  initHobbyFlip();
  initScrollAnimations();
  initNavHighlight();
  initSkillRipple();
});
