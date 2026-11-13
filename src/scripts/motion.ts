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
// Todo el sitio (no solo <main>): títulos, subtítulos y etiquetas suben palabra por palabra;
// párrafos, ítems y descripciones se encienden palabra por palabra con el scroll.
// Quedan afuera el menú, el buscador de "Ver todos" y los textos recortados con "…".
const FUERA = ':not(header *):not(dialog *):not(button *):not(.truncate):not([class*="line-clamp"]):not([data-no-reveal]):not([data-no-reveal] *)';
const TITULOS = `:is(h1, h2, h3, h4, h5, h6, [data-reveal="title"])${FUERA}`;
const PARRAFOS = `:is(p, li, blockquote, figcaption, [data-reveal="text"])${FUERA}`;

// Contenedor con scroll propio (ej. la columna izquierda de /proyectos en escritorio); si no hay, la ventana.
function scrollerDe(el: HTMLElement): Element | Window {
  let a = el.parentElement;
  while (a && a !== document.body) {
    const oy = getComputedStyle(a).overflowY;
    if ((oy === 'auto' || oy === 'scroll') && a.scrollHeight > a.clientHeight + 1) return a;
    a = a.parentElement;
  }
  return window;
}

function visible(el: HTMLElement) {
  const bloque = el.querySelector('img, svg, picture, video, iframe, h1, h2, h3, h4, p, li, div, [data-reveal]');
  if (!el.textContent?.trim() || el.offsetParent === null || bloque) { el.style.visibility = 'visible'; return false; }
  return true;
}

function reveal() {
  document.querySelectorAll<HTMLElement>(TITULOS).forEach((el) => {
    if (!visible(el)) return;
    const porLetra = el.tagName === 'H1';
    SplitText.create(el, {
      type: porLetra ? 'words,chars' : 'words',
      mask: porLetra ? 'chars' : 'words',
      charsClass: 'rvc',
      wordsClass: 'rvw',
      autoSplit: true,
      onSplit(self) {
        gsap.set(el, { visibility: 'visible' });
        return gsap.from(porLetra ? self.chars : self.words, {
          yPercent: 110,
          duration: 1,
          ease: 'expo.out',
          stagger: porLetra ? 0.025 : 0.1,
          scrollTrigger: { trigger: el, scroller: scrollerDe(el), start: 'top bottom', once: true },
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
          scrollTrigger: { trigger: el, scroller: scrollerDe(el), start: 'top 92%', end: 'bottom 55%', scrub: true },
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
