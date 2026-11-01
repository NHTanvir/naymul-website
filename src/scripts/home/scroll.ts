import { reduceMotion } from './env';

/** Fill the top progress bar and mark the body once the page has scrolled. */
export function initProgress() {
  const bar = document.getElementById('mpProgress');
  let ticking = false;
  const update = () => {
    const h = document.documentElement;
    const scrolled = h.scrollTop;
    if (bar) {
      const total = h.scrollHeight - h.clientHeight;
      bar.style.width = `${total > 0 ? (scrolled / total) * 100 : 0}%`;
    }
    document.body.classList.toggle('mp-scrolled', scrolled > 8);
    ticking = false;
  };
  window.addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    },
    { passive: true },
  );
  update();
}

/** Smooth-scroll in-page anchors, including "/#section" links on the homepage. */
export function initSmoothScroll() {
  if (reduceMotion) return;
  document.addEventListener('click', (e) => {
    const link = (e.target as Element).closest?.('a[href*="#"]');
    if (!link) return;
    const url = new URL(link.getAttribute('href') ?? '', window.location.href);
    if (url.pathname !== window.location.pathname || url.hash.length < 2) return;
    const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', url.hash === '#hero' ? window.location.pathname : url.hash);
  });
}

/** Highlight the nav item for the section currently in view and keep the URL hash in sync. */
export function initScrollSpy() {
  const items = document.querySelectorAll<HTMLElement>('.nt-nav [data-nav-id]');
  if (!items.length) return;

  const tracked = ['hero', 'about', 'skills', 'services', 'projects', 'get-in-touch'];
  const navIds = new Set(['hero', 'about', 'skills', 'services', 'projects']);
  const sections = tracked
    .map((id) => document.getElementById(id))
    .filter((el): el is HTMLElement => el !== null);
  if (!sections.length) return;

  const setActive = (id: string) => {
    items.forEach((li) => {
      const on = li.dataset.navId === id;
      li.classList.toggle('nt-active', on);
      li.querySelector('a')?.toggleAttribute('aria-current', on);
    });
  };

  const pick = () => {
    const trigger = window.innerHeight * 0.35;
    let current = sections[0];
    for (const s of sections) {
      if (s.getBoundingClientRect().top - trigger <= 0) current = s;
      else break;
    }
    setActive(navIds.has(current.id) ? current.id : 'hero');
    const want = current.id === 'hero' ? '' : `#${current.id}`;
    if (window.location.hash !== want) {
      history.replaceState(null, '', want || window.location.pathname);
    }
  };

  let ticking = false;
  window.addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        pick();
        ticking = false;
      });
    },
    { passive: true },
  );
  pick();
}
