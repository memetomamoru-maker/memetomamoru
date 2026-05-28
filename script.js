/* めめとのもり — refined edition / interactions */

const header = document.querySelector('[data-header]');
const sideIndex = document.querySelector('[data-side-index]');

const onScroll = () => {
  const y = window.scrollY;
  header.classList.toggle('is-scrolled', y > 18);
  if (sideIndex) sideIndex.classList.toggle('is-visible', y > window.innerHeight * 0.6);

  // scroll progress 0 → 1 across page; drive leaf decay color
  const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  const progress = Math.min(1, Math.max(0, y / max));

  // green → ochre → brown. It should feel like the season is changing while scrolling.
  const decay = Math.pow(progress, 1.35) * 100;
  document.documentElement.style.setProperty('--leaf-decay', decay.toFixed(1));

  // Before the fallen-leaf footer strip enters the viewport, airborne leaves fade out.
  // Fade is completed while the footer leaf illustration is still just below the screen.
  const footerReturn = document.querySelector('.footer-return') || document.querySelector('.footer');
  let leafOpacity = 1;
  if (footerReturn) {
    const rect = footerReturn.getBoundingClientRect();

    // Start fading while the leaf pile is still far below the viewport.
    // End fading before the leaf pile appears, so only the grounded leaves remain.
    const fadeStart = window.innerHeight * 1.65;
    const fadeEnd = window.innerHeight * 1.08;
    const t = (fadeStart - rect.top) / Math.max(1, fadeStart - fadeEnd);
    leafOpacity = 1 - Math.min(1, Math.max(0, t));
  } else if (progress > 0.82) {
    leafOpacity = Math.max(0, 1 - ((progress - 0.82) / 0.10));
  }
  document.documentElement.style.setProperty('--leaf-air-opacity', leafOpacity.toFixed(3));
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- reveal on scroll ---------- */
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReduced) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

  /* ---------- hero parallax (subtle) ---------- */
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const y = Math.min(window.scrollY, window.innerHeight);
      heroBg.style.setProperty('translate', `0 ${y * 0.05}px`);
    }, { passive: true });
  }

  /* ---------- atmospheric particles ---------- */
  const layer = document.createElement('div');
  layer.className = 'particles';
  document.body.appendChild(layer);

  const COUNT = window.innerWidth < 720 ? 6 : 11;
  for (let i = 0; i < COUNT; i++) {
    const p = document.createElement('span');
    p.className = 'particle';
    const left = Math.random() * 100;
    const dur = 22 + Math.random() * 18;
    const delay = -Math.random() * dur;
    const scale = 0.7 + Math.random() * 0.9;
    p.style.left = left + 'vw';
    p.style.animationDuration = dur + 's';
    p.style.animationDelay = delay + 's';
    p.style.scale = scale.toFixed(2);
    layer.appendChild(p);
  }
} else {
  document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
}

/* ---------- side-index current section highlight ---------- */
const sections = ['about','works','profile','links']
  .map(id => document.getElementById(id))
  .filter(Boolean);
const navLinks = [...document.querySelectorAll('.nav a, .side-index a')];

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      const id = e.target.id;
      navLinks.forEach(a => {
        const matches = a.getAttribute('href') === '#' + id;
        a.classList.toggle('is-current', matches);
      });
    }
  });
}, { rootMargin: '-45% 0px -45% 0px' });

sections.forEach(s => sectionObserver.observe(s));

/* ---------- smooth-scroll for in-page anchors ---------- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href').slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: prefersReduced ? 'auto' : 'smooth' });
    }
  });
});


/* ---------- footer return to top ---------- */
const footerTopTrigger = document.querySelector('.footer-top-trigger');

if (footerTopTrigger) {
  footerTopTrigger.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
  });
}
