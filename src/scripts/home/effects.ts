/** Cursor-following glow inside the hero. */
export function initSpotlight() {
  const hero = document.querySelector<HTMLElement>('.mp-hero');
  if (!hero) return;
  const spot = document.createElement('div');
  spot.className = 'mp-spotlight';
  hero.appendChild(spot);
  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    spot.style.setProperty('--mp-x', `${e.clientX - rect.left}px`);
    spot.style.setProperty('--mp-y', `${e.clientY - rect.top}px`);
    spot.style.opacity = '1';
  });
  hero.addEventListener('mouseleave', () => (spot.style.opacity = '0'));
}

/** Gentle 3D tilt that follows the pointer on cards and portraits. */
export function initTilt() {
  const cards = document.querySelectorAll<HTMLElement>(
    '.mp-service, .mp-project, .mp-stack-cat, .mp-hero__imgwrap, .mp-about__imgwrap',
  );
  cards.forEach((card) => {
    let raf = 0;
    card.style.transformStyle = 'preserve-3d';
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        card.style.transform = `perspective(900px) rotateX(${(-py * 6).toFixed(2)}deg) rotateY(${(px * 6).toFixed(2)}deg) translateZ(0)`;
      });
    });
    card.addEventListener('mouseleave', () => {
      cancelAnimationFrame(raf);
      card.style.transform = '';
    });
  });
}

/** Primary buttons lean slightly toward the cursor. */
export function initMagnetic() {
  document.querySelectorAll<HTMLElement>('.mp-btn--primary, .nt-cta').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${(x * 0.18).toFixed(1)}px, ${(y * 0.18).toFixed(1)}px)`;
    });
    btn.addEventListener('mouseleave', () => (btn.style.transform = ''));
  });
}

/** Hero layers drift at different speeds while scrolling. */
export function initParallax() {
  const portrait = document.querySelector<HTMLElement>('.mp-hero__imgwrap');
  const blob = document.querySelector<HTMLElement>('.mp-hero__blob');
  const dots = document.querySelector<HTMLElement>('.mp-hero__dots');
  if (!portrait && !blob && !dots) return;
  let ticking = false;
  const update = () => {
    const y = window.scrollY;
    portrait?.style.setProperty('--mp-py', `${(y * 0.06).toFixed(1)}px`);
    if (blob) blob.style.transform = `translate3d(0, ${(y * 0.12).toFixed(1)}px, 0)`;
    if (dots) dots.style.transform = `translate3d(0, ${(y * 0.18).toFixed(1)}px, 0)`;
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
}

/** Material-style ripple on chips and social icons. */
export function initRipples() {
  const sel = '.mp-stack-chip, .mp-hero__chip, .mp-hero__social a';
  document.addEventListener('click', (e) => {
    const t = (e.target as Element).closest?.<HTMLElement>(sel);
    if (!t) return;
    const rect = t.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.6;
    const ripple = document.createElement('span');
    ripple.className = 'mp-ripple';
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
    t.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  });
}
