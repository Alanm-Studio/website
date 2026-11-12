// Movimiento con GSAP: textos que aparecen línea por línea (reveal) y zoom de fotos al scrollear (Equipo).
// Respeta "reducir movimiento": si está activo, no se anima nada.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

const root = document.documentElement;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;


// Como nicocrespo.com:
// - Títulos: cada palabra sube desde una máscara, una tras otra (el H1 del hero, letra por letra).
// - Párrafos: cada palabra pasa de casi transparente a opaca, atada al scroll.
const TITULOS = 'main :is(h1, h2, h3):not(dialog *):not(.svc-body):not(.truncate):not([class*="line-clamp"]):not([data-no-reveal])';
const PARRAFOS = 'main p:not(dialog *):not(.svc-body):not(.truncate):not([class*="line-clamp"]):not([data-no-reveal])';

function visible(el: HTMLElement) {
  if (!el.textContent?.trim() || el.offsetParent === null) { el.style.visibility = 'visible'; return false; }
  return true;
}

function reveal() {
  document.querySelectorAll<HTMLElement>(TITULOS).forEach((el) => {
    if (!visible(el)) return;
    const porLetra = el.tagName === 'H1';
    SplitText.create(el, {
      type: porLetra ? 'words,chars' : 'words',
      mask: porLetra ? 'chars' : 'words',
      autoSplit: true,
      onSplit(self) {
        gsap.set(el, { visibility: 'visible' });
        return gsap.from(porLetra ? self.chars : self.words, {
          yPercent: 110,
          duration: 1,
          ease: 'expo.out',
          stagger: porLetra ? 0.025 : 0.1,
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        });
      },
    });
  });
  document.querySelectorAll<HTMLElement>(PARRAFOS).forEach((el) => {
    if (!visible(el)) return;
    SplitText.create(el, {
      type: 'words',
      autoSplit: true,
      onSplit(self) {
        gsap.set(el, { visibility: 'visible' });
        return gsap.fromTo(self.words, { opacity: 0.14 }, {
          opacity: 1,
          ease: 'none',
          stagger: 0.1,
          scrollTrigger: { trigger: el, start: 'top 92%', end: 'bottom 55%', scrub: true },
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
