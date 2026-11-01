import { reduceMotion } from './env';
import { initMagnetic, initParallax, initRipples, initSpotlight, initTilt } from './effects';
import { initCounters, initReveal, initTyping } from './reveal';
import { initProgress, initScrollSpy, initSmoothScroll } from './scroll';

document.body.classList.add('mp-js');
initReveal();
initCounters();
initTyping();
initProgress();
initSmoothScroll();
initScrollSpy();

if (!reduceMotion) {
  initSpotlight();
  initTilt();
  initMagnetic();
  initParallax();
  initRipples();
}
