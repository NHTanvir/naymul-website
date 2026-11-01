import { reduceMotion } from './env';
import { initMagnetic, initParallax, initRipples, initSpotlight, initTilt } from './effects';
import { initCounters, initReveal, initTyping } from './reveal';
import { initProgress, initScrollSpy, initSmoothScroll } from './scroll';
import { initContactForm } from './contact';

document.body.classList.add('mp-js');
initReveal();
initCounters();
initTyping();
initProgress();
initSmoothScroll();
initScrollSpy();
initContactForm();

if (!reduceMotion) {
  initSpotlight();
  initTilt();
  initMagnetic();
  initParallax();
  initRipples();
}
