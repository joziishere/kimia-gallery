/* ---------- Hamburger drawer ---------- */
const burger = document.getElementById('burger');
const drawer = document.getElementById('drawer');
const scrim  = document.getElementById('scrim');

function setDrawer(open) {
  var fa = document.documentElement.lang === 'fa';
  drawer.classList.toggle('open', open);
  scrim.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', String(open));
  burger.setAttribute('aria-label', open
    ? (fa ? 'بستن منو' : 'Close navigation')
    : (fa ? 'باز کردن منو' : 'Open navigation'));
  drawer.setAttribute('aria-hidden', String(!open));
}

burger.addEventListener('click', () => setDrawer(!drawer.classList.contains('open')));
scrim.addEventListener('click', () => setDrawer(false));
drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setDrawer(false)));
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && drawer.classList.contains('open')) {
    setDrawer(false);
    burger.focus();
  }
});
