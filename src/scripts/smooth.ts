// Scroll suave con Lenis (https://lenis.dev), sincronizado con GSAP ScrollTrigger.
// En touch se deja el scroll nativo del celular; se apaga si el usuario prefiere menos movimiento.
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

declare global { interface Window { __lenis?: Lenis } }

if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const lenis = new Lenis({
    duration: 1.15,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    syncTouch: false,
    anchors: { offset: -88 },
    // Los paneles con scroll propio (aside de Proyectos, "Ver todos", menú) scrollean solos.
    prevent: (node: HTMLElement) => !!node.closest?.('[data-left], dialog, [data-menu], [data-lenis-prevent]'),
  });
  window.__lenis = lenis;
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}
