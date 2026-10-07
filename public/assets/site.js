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

// Original template gallery buttons were empty; show their existing section photos.
document.querySelectorAll('[data-gallery]').forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    const photos = JSON.parse(link.dataset.gallery);
    let index = 0;
    const dialog = document.createElement('dialog');
    dialog.className = 'migration-gallery';
    dialog.setAttribute('aria-label', 'Photo gallery');
    dialog.innerHTML = '<button type="button" data-close>Close</button><img alt=""><div class="migration-gallery-controls"><button type="button" data-previous>Previous</button><span aria-live="polite"></span><button type="button" data-next>Next</button></div>';
    const picture = dialog.querySelector('img');
    function show(offset) {
      index = (index + offset + photos.length) % photos.length;
      picture.src = photos[index];
      picture.alt = `Gallery photo ${index + 1} of ${photos.length}`;
      dialog.querySelector('span').textContent = `${index + 1} / ${photos.length}`;
    }
    dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
    dialog.querySelector('[data-previous]').addEventListener('click', () => show(-1));
    dialog.querySelector('[data-next]').addEventListener('click', () => show(1));
    dialog.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft') show(-1);
      if (event.key === 'ArrowRight') show(1);
    });
    dialog.addEventListener('close', () => { dialog.remove(); link.focus(); });
    document.body.append(dialog);
    show(0);
    dialog.showModal();
  });
});
