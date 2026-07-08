// TJ Edits — script.js

// Nav scroll effect
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// Hamburger menu
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  const isOpen = navLinks.classList.contains('open');
  spans[0].style.transform = isOpen ? 'translateY(7px) rotate(45deg)' : '';
  spans[1].style.opacity = isOpen ? '0' : '';
  spans[2].style.transform = isOpen ? 'translateY(-7px) rotate(-45deg)' : '';
});

// Close menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => {
      s.style.transform = '';
      s.style.opacity = '';
    });
  });
});

// Intersection Observer: fade-up on scroll
const fadeEls = document.querySelectorAll('.fade-up');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

fadeEls.forEach(el => observer.observe(el));

// Work card click: play video placeholder
document.querySelectorAll('.work-thumb').forEach(thumb => {
  thumb.addEventListener('click', () => {
    const play = thumb.querySelector('.work-play');
    if (!play) return;
    const isPaused = play.textContent.trim() === '▶';
    play.textContent = isPaused ? '⏸' : '▶';
    play.style.background = isPaused ? '#fff' : 'rgba(247,243,236,0.92)';
  });
});

// Parallax on hero deco elements (subtle)
const decos = document.querySelectorAll('.deco');
let ticking = false;
window.addEventListener('scroll', () => {
  if (ticking) return;
  requestAnimationFrame(() => {
    const y = window.scrollY;
    decos.forEach((el, i) => {
      const speed = 0.04 + (i % 4) * 0.015;
      const dir = i % 2 === 0 ? -1 : 1;
      el.style.transform = (el.style.transform || '').replace(/translateY\([^)]*\)/g, '') +
        ` translateY(${dir * y * speed}px)`;
    });
    ticking = false;
  });
  ticking = true;
}, { passive: true });

// Smooth counter animation for stats strip
function animateCounter(el, target, suffix = '') {
  const dur = 1600;
  const start = performance.now();
  const update = (now) => {
    const t = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    const val = target === Infinity ? '∞' : Math.round(eased * target) + suffix;
    el.textContent = val;
    if (t < 1 && target !== Infinity) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const stripObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    document.querySelectorAll('.strip-num').forEach(el => {
      const txt = el.textContent.trim();
      if (txt === '∞') return;
      const num = parseInt(txt.replace(/\D/g, ''));
      const suffix = txt.includes('+') ? '+' : '';
      animateCounter(el, num, suffix);
    });
    stripObserver.disconnect();
  }
}, { threshold: 0.5 });

const strip = document.querySelector('.about-strip');
if (strip) stripObserver.observe(strip);
