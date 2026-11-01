import { initCounters, initReveal, initTyping } from './reveal';
import { initProgress, initScrollSpy, initSmoothScroll } from './scroll';

document.body.classList.add('mp-js');
initReveal();
initCounters();
initTyping();
initProgress();
initSmoothScroll();
initScrollSpy();
