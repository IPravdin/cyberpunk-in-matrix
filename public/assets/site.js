// Portable replacements for the small set of interactions used by this site.
const menu = document.querySelector('#navMobile');
const toggles = [...document.querySelectorAll('.hamburger')];
const openToggle = document.querySelector('.birdseye-header .hamburger');
function setMenu(open) {
  document.body.classList.toggle('nav-open', open);
  toggles.forEach(button => button.setAttribute('aria-expanded', String(open)));
  if (menu) menu.inert = !open;
  if (open) menu?.querySelector('button, a')?.focus();
  else if (menu?.contains(document.activeElement)) openToggle?.focus();
}
setMenu(false);
toggles.forEach(button => button.addEventListener('click', () => {
  setMenu(!document.body.classList.contains('nav-open'));
}));
document.addEventListener('keydown', event => {
  if (!document.body.classList.contains('nav-open')) return;
  if (event.key === 'Escape') setMenu(false);
  if (event.key === 'Tab') {
    const items = [...menu.querySelectorAll('button, a[href]')];
    const first = items[0], last = items.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first.focus();
    }
  }
});
window.addEventListener('resize', () => { if (window.innerWidth > 1024) setMenu(false); });
function updateHeader() { document.body.classList.toggle('affix', window.scrollY > 50); }
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();
