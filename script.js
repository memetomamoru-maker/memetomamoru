/* めめとのもり — performance tuned interactions */

const header = document.querySelector('[data-header]');
const sideIndex = document.querySelector('[data-side-index]');
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let ticking = false;
const onScroll = () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    const y = window.scrollY;
    if (header) header.classList.toggle('is-scrolled', y > 18);
    if (sideIndex) sideIndex.classList.toggle('is-visible', y > window.innerHeight * 0.6);

    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const progress = Math.min(1, Math.max(0, y / maxScroll));
    document.body.classList.toggle('leaves-mid', progress > 0.32 && progress <= 0.64);
    document.body.classList.toggle('leaves-autumn', progress > 0.64);

    ticking = false;
  });
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- lightweight drifting leaves ---------- */
if (!prefersReduced) {
  const layer = document.querySelector('.particles');
  const isMobile = window.matchMedia('(max-width: 720px)').matches;
  const count = isMobile ? 8 : 14;
  if (layer) {
    for (let i = 0; i < count; i += 1) {
      const leaf = document.createElement('span');
      leaf.className = 'particle leaf';
      leaf.style.left = `${Math.random() * 100}%`;
      leaf.style.animationDuration = `${18 + Math.random() * 16}s`;
      leaf.style.animationDelay = `${-Math.random() * 24}s`;
      leaf.style.transform = `translate3d(0,-10vh,0) rotate(${Math.random() * 180}deg)`;
      leaf.style.opacity = '0';
      layer.appendChild(leaf);
    }
  }
}

/* ---------- reveal on scroll ---------- */
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
