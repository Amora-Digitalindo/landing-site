// ── Navbar scroll state ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// ── Mobile hamburger menu ──
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

const ICON_HAMBURGER = `<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>`;
const ICON_CLOSE = `<line x1="18" y1="6" x2="6" y2="18" stroke-width="2.5"/><line x1="6" y1="6" x2="18" y2="18" stroke-width="2.5"/>`;

function openMenu() {
  mobileMenu.classList.add('open');
  navbar.classList.add('menu-open');
  hamburger.querySelector('svg').innerHTML = ICON_CLOSE;
  hamburger.setAttribute('aria-label', 'Tutup menu');
  document.documentElement.style.overflow = 'hidden';
}
function closeMenu() {
  mobileMenu.classList.remove('open');
  navbar.classList.remove('menu-open');
  hamburger.querySelector('svg').innerHTML = ICON_HAMBURGER;
  hamburger.setAttribute('aria-label', 'Menu');
  document.documentElement.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
});
document.querySelectorAll('.mobile-link, .mobile-ctas a, .mobile-legal a, .nav-logo').forEach(el => {
  el.addEventListener('click', closeMenu);
});

// ── Logo SVG animation ──
(function () {
  var la = document.querySelector('.logo-anim');
  if (!la) return;
  var fp = la.querySelectorAll('.fill-layer path');
  var sp = la.querySelectorAll('.stroke-layer path');
  var sl = la.querySelector('.stroke-layer');
  var groups = [[0, 1, 2], [3], [4], [5], [6, 7], [8], [9]];
  var gd = [0, .15, .30, .45, .58, .72, .86];

  function setupStroke() {
    sp.forEach(function (p) { var l = p.getTotalLength(); p.style.strokeDasharray = l; p.style.strokeDashoffset = l });
  }
  function playOutline() {
    sl.style.opacity = '1'; sl.style.animation = 'none';
    sp.forEach(function (p) { p.style.transition = 'none' });
    void la.offsetWidth;
    setupStroke();
    sp.forEach(function (p) { p.style.strokeOpacity = '1' });
    void la.offsetWidth;
    sl.style.animation = 'strokeGlow 3.2s cubic-bezier(.16,1,.3,1) forwards';
    groups.forEach(function (g, gi) {
      var d = gd[gi]; g.forEach(function (i) {
        sp[i].style.transition = 'stroke-dashoffset 1s cubic-bezier(.22,1,.36,1) ' + d + 's,stroke-opacity .5s ease ' + (d + 1.8) + 's';
        sp[i].style.strokeDashoffset = '0'; sp[i].style.strokeOpacity = '0';
      })
    });
  }
  // intro: fill bloom + outline
  setupStroke();
  setTimeout(function () {
    groups.forEach(function (g, gi) {
      var d = gd[gi]; g.forEach(function (i) {
        fp[i].style.transition = 'opacity .55s cubic-bezier(.16,1,.3,1) ' + d + 's,filter .6s cubic-bezier(.16,1,.3,1) ' + d + 's';
        fp[i].style.opacity = '1'; fp[i].style.filter = 'blur(0)';
      })
    });
    playOutline();
  }, 60);
  setInterval(playOutline, 4200);
})();
