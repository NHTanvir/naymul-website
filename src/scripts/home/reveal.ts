import { reduceMotion } from './env';

/** Fade sections in as they enter the viewport. */
export function initReveal() {
  const items = document.querySelectorAll<HTMLElement>('.mp-reveal');
  if (!items.length) return;

  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' },
  );
  items.forEach((el) => observer.observe(el));
}

/** Count numbers up from zero when they scroll into view. */
export function initCounters() {
  const counters = document.querySelectorAll<HTMLElement>('.mp-counter');
  if (!counters.length) return;

  const animate = (el: HTMLElement) => {
    const target = parseInt(el.dataset.count ?? '', 10);
    if (Number.isNaN(target)) return;
    if (reduceMotion) {
      el.textContent = String(target);
      return;
    }
    const duration = 1400;
    let start: number | null = null;
    const step = (ts: number) => {
      start ??= ts;
      const p = Math.min((ts - start) / duration, 1);
      el.textContent = String(Math.floor(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(step);
    };
    el.textContent = '0';
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        animate(entry.target as HTMLElement);
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.5 },
  );
  counters.forEach((el) => observer.observe(el));
}

/** Cycle through the words in data-words with a typewriter effect. */
export function initTyping() {
  const el = document.querySelector<HTMLElement>('.mp-typed');
  if (!el || reduceMotion) return;

  let words: string[];
  try {
    words = JSON.parse(el.dataset.words ?? '[]');
  } catch {
    return;
  }
  if (!words.length) return;

  let wordIdx = 0;
  let charIdx = 0;
  let deleting = false;

  const tick = () => {
    const word = words[wordIdx];
    if (!deleting) {
      charIdx++;
      el.textContent = word.slice(0, charIdx);
      if (charIdx === word.length) {
        deleting = true;
        setTimeout(tick, 1800);
        return;
      }
      setTimeout(tick, 75);
      return;
    }
    charIdx--;
    el.textContent = word.slice(0, charIdx);
    if (charIdx === 0) {
      deleting = false;
      wordIdx = (wordIdx + 1) % words.length;
      setTimeout(tick, 320);
      return;
    }
    setTimeout(tick, 38);
  };

  el.textContent = '';
  tick();
}
