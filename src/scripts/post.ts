/**
 * Single-post enhancements: reading progress bar, a table of contents built
 * from the post's h2/h3 headings, and the "copy link" share button.
 */
import { slugify } from '@/lib/slug';

function initReadingProgress() {
  const bar = document.getElementById('ntReadingProgress');
  const article = document.querySelector<HTMLElement>('.nt-single');
  if (!bar || !article) return;
  let ticking = false;
  const update = () => {
    const rect = article.getBoundingClientRect();
    const total = rect.height - window.innerHeight;
    const pct = total > 0 ? Math.max(0, Math.min(1, -rect.top / total)) : 0;
    bar.style.transform = `scaleX(${pct.toFixed(4)})`;
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

function initToc() {
  const toc = document.getElementById('ntToc');
  const list = document.getElementById('ntTocList');
  const content = document.querySelector('.nt-single__content');
  if (!toc || !list || !content) return;

  const headings = content.querySelectorAll<HTMLHeadingElement>('h2, h3');
  if (headings.length < 2) return;

  const seen = new Set<string>();
  const entries: { heading: HTMLHeadingElement; link: HTMLAnchorElement }[] = [];
  headings.forEach((h) => {
    let id = h.id || slugify(h.textContent ?? '').slice(0, 60) || 'section';
    if (seen.has(id)) {
      let n = 2;
      while (seen.has(`${id}-${n}`)) n++;
      id = `${id}-${n}`;
    }
    seen.add(id);
    h.id = id;

    const li = document.createElement('li');
    li.className = `nt-toc__item nt-toc__item--${h.tagName.toLowerCase()}`;
    const a = document.createElement('a');
    a.href = `#${id}`;
    a.textContent = h.textContent;
    li.appendChild(a);
    list.appendChild(li);
    entries.push({ heading: h, link: a });
  });
  toc.hidden = false;

  list.addEventListener('click', (e) => {
    const link = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
    if (!link) return;
    const target = document.getElementById(link.hash.slice(1));
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 90, behavior: 'smooth' });
    history.replaceState(null, '', link.hash);
  });

  const observer = new IntersectionObserver(
    (changes) => {
      for (const change of changes) {
        if (!change.isIntersecting) continue;
        entries.forEach((en) => en.link.classList.toggle('is-active', en.heading === change.target));
      }
    },
    { rootMargin: '-20% 0px -65% 0px', threshold: 0 },
  );
  entries.forEach((en) => observer.observe(en.heading));
}

function initCopyLink() {
  document.querySelectorAll<HTMLButtonElement>('.nt-share__copy').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const url = btn.dataset.url ?? window.location.href;
      try {
        await navigator.clipboard.writeText(url);
      } catch {
        return;
      }
      const icon = btn.querySelector('i');
      if (!icon) return;
      const orig = icon.className;
      icon.className = 'fa-solid fa-check';
      btn.classList.add('is-copied');
      setTimeout(() => {
        icon.className = orig;
        btn.classList.remove('is-copied');
      }, 1600);
    });
  });
}

initReadingProgress();
initToc();
initCopyLink();
