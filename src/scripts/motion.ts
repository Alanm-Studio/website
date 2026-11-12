// Movimiento con GSAP: textos que aparecen línea por línea (reveal) y zoom de fotos al scrollear (Equipo).
// Respeta "reducir movimiento": si está activo, no se anima nada.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

const root = document.documentElement;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Mismo selector que el CSS que los oculta hasta animarlos (global.css → .motion …)
const TEXTOS = 'main :is(h1, h2, h3, p):not(dialog *):not(.svc-body):not(.truncate):not([class*="line-clamp"]):not([data-no-reveal])';

function reveal() {
  document.querySelectorAll<HTMLElement>(TEXTOS).forEach((el) => {
    if (!el.textContent?.trim() || el.offsetParent === null) { el.style.visibility = 'visible'; return; }
    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      autoSplit: true,
      onSplit(self) {
        gsap.set(el, { visibility: 'visible' });
        return gsap.from(self.lines, {
          yPercent: 110,
          duration: 0.9,
          ease: 'power4.out',
          stagger: 0.08,
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        });
      },
    });
  });
}

function zoom() {
  document.querySelectorAll<HTMLElement>('[data-zoom]').forEach((frame) => {
    const img = frame.querySelector('img, [data-zoom-media]');
    if (!img) return;
    gsap.fromTo(img, { scale: 1.3 }, {
      scale: 1,
      ease: 'none',
      scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom 40%', scrub: true },
    });
  });
}

if (!reduced) {
  (document.fonts?.ready ?? Promise.resolve()).then(() => {
    reveal();
    zoom();
    ScrollTrigger.refresh();
  });
} else {
  root.classList.remove('motion');
}
