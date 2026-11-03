// CTA fx: el relleno nace en el punto exacto donde entra el cursor y se retira hacia donde sale.
function place(el: HTMLElement, e: PointerEvent) {
  const r = el.getBoundingClientRect();
  const x = e.clientX - r.left, y = e.clientY - r.top;
  const dx = Math.max(x, r.width - x), dy = Math.max(y, r.height - y);
  el.style.setProperty('--fx-x', `${x}px`);
  el.style.setProperty('--fx-y', `${y}px`);
  el.style.setProperty('--fx-r', `${Math.ceil(Math.hypot(dx, dy)) + 2}px`);
}
const find = (e: Event) => (e.target as Element | null)?.closest?.<HTMLElement>('[data-fx="fill"]') ?? null;
document.addEventListener('pointerover', (e) => {
  const el = find(e);
  if (!el || (e.relatedTarget && el.contains(e.relatedTarget as Node))) return;
  el.setAttribute('data-fx-snap', '');
  place(el, e);
  void el.offsetWidth;
  el.removeAttribute('data-fx-snap');
  el.setAttribute('data-fx-in', '');
});
document.addEventListener('pointerout', (e) => {
  const el = find(e);
  if (!el || (e.relatedTarget && el.contains(e.relatedTarget as Node))) return;
  place(el, e);
  el.removeAttribute('data-fx-in');
});
