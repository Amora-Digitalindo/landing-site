/**
 * Shared navbar + mobile drawer + footer for every page on the root static site.
 *
 * Usage: add empty placeholders where the chrome should render, then load this
 * script (no defer/async) immediately after the LAST placeholder — and before
 * any other script that depends on the injected markup already being in the
 * DOM (e.g. the page's scroll-reveal observer, which queries `.reveal` and
 * needs the footer's `.reveal` element to exist by the time it runs):
 *
 *   <div id="site-navbar"></div>
 *   ...page content...
 *   <div id="site-footer"></div>
 *   <script>window.SITE_ROOT = '';</script>  // '../' for pages one folder deep
 *   <script src="assets/js/site-chrome.js"></script>
 *   <script> ...rest of the page's scripts... </script>
 *
 * This is the single source of truth for the nav/footer markup — edit here,
 * not on individual pages.
 */
(function () {
  // Use a clean root or enforce an absolute path fallback
  var ROOT = '/';

  function isHomePage() {
    // True only if exactly at the root path or the root index
    return location.pathname === '/' || location.pathname === '/index.html';
  }

  function homeLink() {
    return isHomePage() ? '#' : ROOT;
  }

  function sectionLink(id) {
    // If we are on an internal page (not the homepage), force an absolute URL
    // routing back to the home origin root plus the hash.
    if (isHomePage()) {
      return '#' + id;
    } else {
      // Using location.origin guarantees it goes back to https://yourdomain.com/#id
      // instead of relative appending.
      return location.origin + ROOT + '#' + id;
    }
  }

  var LOGO_SVG =
    '<svg class="fill-layer" viewBox="0 0 1920 543.72" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M275.89,231.79l-133.21-.08c-9.26,0-15.77-8.44-16.34-16.17-.53-7.21,5.44-18.25,15.1-18.26l136.44-.05c9.33,0,15.6,10.19,15.69,16.75.13,9.54-6.62,17.82-17.66,17.81Z" />' +
    '<path d="M311.09,133.93c-.27,11.13-8.98,29.11-21.53,29.08l-72.33-.18c-9.62-.02-16.27-8.86-16.45-16.74-.23-9.57,7.54-17.64,17.7-17.63h82.53c2.86,0,10.15,2.72,10.08,5.47Z" />' +
    '<path d="M310.83,295.14c.01,2.77-8.19,5.07-10.68,5.04l-82.9.15c-9.12-1-15.79-6.91-16.61-15.62-.56-5.97,4.65-18.04,13.55-18.12l75.5-.72c11.64-.11,21.08,17.23,21.14,29.28Z" />' +
    '<path d="M590.54,219.75c0-22.45-4.21-43.36-12.65-63.61-20.32-48.74-67.64-77.2-120.33-74.38-75.28,4.02-121.7,65.64-120.6,139.51,1.07,72.26,51.5,133.27,125.5,133.07,33.37-.09,63.38-13.17,85.29-38.64l4.11,34.29,38.72-.33-.04-129.91ZM467.24,314.43c-34.33,1.25-64.46-16.96-78.76-48.6-25.02-55.36-4.37-128.01,55.41-142.26,29.41-7.01,57.02.63,77.58,20.9,16.6,16.36,26.43,38.58,26.59,62.31l.26,39.18c-1.9,17.55-12.46,31.51-12.46,31.51-16.25,23.98-40.66,35.93-68.62,36.95Z" />' +
    '<path d="M840.46,172.07l-1.16,177.65h-41.59s-.58-175.02-.58-175.02c-.11-32.99-26.89-55.26-58.66-53.61-28.56,1.48-51.22,23.56-51.33,53.74l-.65,175.01-41.17-.22.07-173.05c1.38-21.1,6.39-40.54,18.31-57.69,17.47-24.61,44.94-36.63,74.97-37.42,32.14-.84,61.35,11.43,80.21,37.72,17.75-25.09,44.22-36.44,73.27-37.63,32.65-1.34,63.42,11.38,82.21,38.18,11.54,17.46,16.03,36.85,17.96,58.08l.08,171.91-41.67.17-1.14-177.9c-.2-30.69-25.31-51.11-54.26-51s-54.68,20.09-54.89,51.09Z" />' +
    '<path d="M1191.82,318.18c63.97.81,106.05-49.29,100.49-112.94-4.63-53.07-48.95-92.25-102.24-89.29-25.94.04-49.46,10.31-68.45,28.46l-30.68-33.68c33.36-33.26,77.78-47.93,124.1-41.21,44.69,6.71,84.05,32.1,105.72,72.08,24.02,44.31,25.27,96.8,4.05,142.13-24.55,52.44-76.19,83.02-133.75,82.08-67.23-1.1-124.74-46.29-138.96-112.24l44.14-13.31c9.84,45.75,47.79,77.33,95.58,77.94Z" />' +
    '<path d="M1126.23,395.28c23.3-5.91,44.44,8.25,49.76,29.82,5.4,21.86-7.72,44.23-30.18,49.58-21.02,5.01-43.07-7.17-49.01-28.75-5.8-21.08,6.19-44.76,29.43-50.65Z" />' +
    '<path d="M1228.4,466.23c-17.47-14.63-18.96-39.83-5.22-57.22,14.08-17.82,40.15-19.96,57.31-6.13,17.14,13.82,20.42,39.79,6.33,57.36s-39.79,21.59-58.41,5.99Z" />' +
    '<path d="M1438.23,178.68l-1.08,171.16-41.92-.12.08-163.85c0-13.75,2.5-26.79,6.78-39.36,17.1-50.25,71.83-68.58,122.4-63.4l-.08,40.03c-15.63-1.73-28.74-1.62-43.44,2.28-22.99,7-42.58,26.29-42.75,53.26Z" />' +
    '<path d="M1793.66,219.75c0-22.45-4.21-43.36-12.65-63.61-20.32-48.74-67.64-77.2-120.33-74.38-75.28,4.02-121.7,65.64-120.6,139.51,1.07,72.26,51.5,133.27,125.5,133.07,33.37-.09,63.38-13.17,85.29-38.64l4.11,34.29,38.72-.33-.04-129.91ZM1670.36,314.43c-34.33,1.25-64.46-16.96-78.76-48.6-25.02-55.36-4.37-128.01,55.41-142.26,29.41-7.01,57.02.63,77.58,20.9,16.6,16.36,26.43,38.58,26.59,62.31l.26,39.18c-1.9,17.55-12.46,31.51-12.46,31.51-16.25,23.98-40.66,35.93-68.62,36.95Z" />' +
    '</svg>' +
    '<svg class="stroke-layer" viewBox="0 0 1920 543.72" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M275.89,231.79l-133.21-.08c-9.26,0-15.77-8.44-16.34-16.17-.53-7.21,5.44-18.25,15.1-18.26l136.44-.05c9.33,0,15.6,10.19,15.69,16.75.13,9.54-6.62,17.82-17.66,17.81Z" />' +
    '<path d="M311.09,133.93c-.27,11.13-8.98,29.11-21.53,29.08l-72.33-.18c-9.62-.02-16.27-8.86-16.45-16.74-.23-9.57,7.54-17.64,17.7-17.63h82.53c2.86,0,10.15,2.72,10.08,5.47Z" />' +
    '<path d="M310.83,295.14c.01,2.77-8.19,5.07-10.68,5.04l-82.9.15c-9.12-1-15.79-6.91-16.61-15.62-.56-5.97,4.65-18.04,13.55-18.12l75.5-.72c11.64-.11,21.08,17.23,21.14,29.28Z" />' +
    '<path d="M590.54,219.75c0-22.45-4.21-43.36-12.65-63.61-20.32-48.74-67.64-77.2-120.33-74.38-75.28,4.02-121.7,65.64-120.6,139.51,1.07,72.26,51.5,133.27,125.5,133.07,33.37-.09,63.38-13.17,85.29-38.64l4.11,34.29,38.72-.33-.04-129.91ZM467.24,314.43c-34.33,1.25-64.46-16.96-78.76-48.6-25.02-55.36-4.37-128.01,55.41-142.26,29.41-7.01,57.02.63,77.58,20.9,16.6,16.36,26.43,38.58,26.59,62.31l.26,39.18c-1.9,17.55-12.46,31.51-12.46,31.51-16.25,23.98-40.66,35.93-68.62,36.95Z" />' +
    '<path d="M840.46,172.07l-1.16,177.65h-41.59s-.58-175.02-.58-175.02c-.11-32.99-26.89-55.26-58.66-53.61-28.56,1.48-51.22,23.56-51.33,53.74l-.65,175.01-41.17-.22.07-173.05c1.38-21.1,6.39-40.54,18.31-57.69,17.47-24.61,44.94-36.63,74.97-37.42,32.14-.84,61.35,11.43,80.21,37.72,17.75-25.09,44.22-36.44,73.27-37.63,32.65-1.34,63.42,11.38,82.21,38.18,11.54,17.46,16.03,36.85,17.96,58.08l.08,171.91-41.67.17-1.14-177.9c-.2-30.69-25.31-51.11-54.26-51s-54.68,20.09-54.89,51.09Z" />' +
    '<path d="M1191.82,318.18c63.97.81,106.05-49.29,100.49-112.94-4.63-53.07-48.95-92.25-102.24-89.29-25.94.04-49.46,10.31-68.45,28.46l-30.68-33.68c33.36-33.26,77.78-47.93,124.1-41.21,44.69,6.71,84.05,32.1,105.72,72.08,24.02,44.31,25.27,96.8,4.05,142.13-24.55,52.44-76.19,83.02-133.75,82.08-67.23-1.1-124.74-46.29-138.96-112.24l44.14-13.31c9.84,45.75,47.79,77.33,95.58,77.94Z" />' +
    '<path d="M1126.23,395.28c23.3-5.91,44.44,8.25,49.76,29.82,5.4,21.86-7.72,44.23-30.18,49.58-21.02,5.01-43.07-7.17-49.01-28.75-5.8-21.08,6.19-44.76,29.43-50.65Z" />' +
    '<path d="M1228.4,466.23c-17.47-14.63-18.96-39.83-5.22-57.22,14.08-17.82,40.15-19.96,57.31-6.13,17.14,13.82,20.42,39.79,6.33,57.36s-39.79,21.59-58.41,5.99Z" />' +
    '<path d="M1438.23,178.68l-1.08,171.16-41.92-.12.08-163.85c0-13.75,2.5-26.79,6.78-39.36,17.1-50.25,71.83-68.58,122.4-63.4l-.08,40.03c-15.63-1.73-28.74-1.62-43.44,2.28-22.99,7-42.58,26.29-42.75,53.26Z" />' +
    '<path d="M1793.66,219.75c0-22.45-4.21-43.36-12.65-63.61-20.32-48.74-67.64-77.2-120.33-74.38-75.28,4.02-121.7,65.64-120.6,139.51,1.07,72.26,51.5,133.27,125.5,133.07,33.37-.09,63.38-13.17,85.29-38.64l4.11,34.29,38.72-.33-.04-129.91ZM1670.36,314.43c-34.33,1.25-64.46-16.96-78.76-48.6-25.02-55.36-4.37-128.01,55.41-142.26,29.41-7.01,57.02.63,77.58,20.9,16.6,16.36,26.43,38.58,26.59,62.31l.26,39.18c-1.9,17.55-12.46,31.51-12.46,31.51-16.25,23.98-40.66,35.93-68.62,36.95Z" />' +
    '</svg>';

  function navHtml() {
    return (
      '<nav id="navbar">' +
      '  <div class="nav-inner">' +
      '    <a href="' + homeLink() + '" class="nav-logo">' +
      '      <div class="logo-anim" aria-label="Amora.id">' + LOGO_SVG + '</div>' +
      '    </a>' +
      '    <div class="nav-links">' +
      '      <a href="' + sectionLink('fitur') + '">Fitur</a>' +
      '      <a href="' + sectionLink('vip-program') + '">VIP Merchant</a>' +
      '      <a href="' + sectionLink('harga') + '">Harga</a>' +
      '      <a href="' + sectionLink('faq') + '">FAQ</a>' +
      '    </div>' +
      '    <div class="nav-ctas">' +
      '      <a href="https://admin.amora.id/" class="btn-ghost">Masuk</a>' +
      '      <a href="https://admin.amora.id/" class="btn-primary">' +
      '        Buat Toko' +
      '        <svg data-icon viewBox="0 0 24 24" width="14" height="14"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>' +
      '      </a>' +
      '    </div>' +
      '    <button class="hamburger" id="hamburger" aria-label="Menu">' +
      '      <svg data-icon viewBox="0 0 24 24" width="22" height="22"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>' +
      '    </button>' +
      '  </div>' +
      '</nav>'
    );
  }

  function mobileMenuHtml() {
    return (
      '<div class="mobile-menu" id="mobileMenu">' +
      '  <div class="menu-body">' +
      '    <div class="mobile-nav-links">' +
      '      <a href="' + sectionLink('fitur') + '" class="mobile-link">Fitur</a>' +
      '      <a href="' + sectionLink('vip-program') + '" class="mobile-link">VIP Merchant</a>' +
      '      <a href="' + sectionLink('harga') + '" class="mobile-link">Harga</a>' +
      '      <a href="' + sectionLink('faq') + '" class="mobile-link">FAQ</a>' +
      '    </div>' +
      '  </div>' +
      '  <div class="menu-footer">' +
      '    <div class="mobile-ctas">' +
      '      <a href="https://admin.amora.id/" class="outline">Masuk</a>' +
      '      <a href="https://admin.amora.id/" class="filled">Buat Toko</a>' +
      '    </div>' +
      '    <div class="mobile-legal">' +
      '      <a href="https://amora.id/syarat-ketentuan">Syarat &amp; Ketentuan</a>' +
      '      <a href="https://amora.id/kebijakan-privasi">Kebijakan Privasi</a>' +
      '    </div>' +
      '  </div>' +
      '</div>'
    );
  }

  var THREADS_PATH =
    'M342.383 237.038a177.282 177.282 0 00-6.707-3.046c-3.948-72.737-43.692-114.379-110.429-114.805-38.505-.255-72.972 15.445-94.454 48.041l36.702 25.178c15.265-23.159 39.221-28.096 56.864-28.096.204 0 .408 0 .61.002 21.974.14 38.555 6.529 49.287 18.987 7.81 9.071 13.034 21.606 15.621 37.425-19.483-3.311-40.553-4.329-63.077-3.038-63.45 3.655-104.24 40.661-101.501 92.08 1.391 26.083 14.385 48.523 36.587 63.181 18.772 12.391 42.95 18.45 68.077 17.079 33.183-1.819 59.215-14.48 77.377-37.63 13.793-17.58 22.516-40.363 26.368-69.069 15.814 9.544 27.535 22.103 34.007 37.2 11.006 25.665 11.648 67.84-22.764 102.223-30.15 30.121-66.392 43.151-121.164 43.554-60.758-.45-106.708-19.935-136.583-57.915-27.976-35.562-42.434-86.93-42.973-152.674.539-65.746 14.997-117.114 42.973-152.676 29.875-37.979 75.824-57.463 136.582-57.914 61.197.455 107.948 20.033 138.967 58.195 15.21 18.713 26.676 42.248 34.236 69.688L440 161.532c-9.163-33.775-23.582-62.881-43.203-87.017C357.031 25.59 298.872.519 223.936 0h-.3C148.851.518 91.344 25.683 52.709 74.795 18.331 118.499.598 179.308.002 255.535l-.002.18.002.18c.596 76.225 18.329 137.037 52.707 180.741 38.635 49.11 96.142 74.277 170.927 74.794h.3c66.486-.462 113.352-17.868 151.96-56.442 50.51-50.463 48.99-113.718 32.342-152.549-11.945-27.847-34.716-50.463-65.855-65.401zM227.587 344.967c-27.808 1.567-56.699-10.916-58.124-37.651-1.056-19.823 14.108-41.942 59.831-44.577a266.87 266.87 0 0115.422-.45c16.609 0 32.145 1.613 46.271 4.701-5.268 65.798-36.172 76.483-63.4 77.977z';

  function footerHtml() {
    return (
      '<footer>' +
      '  <div class="footer-inner">' +
      '    <div class="footer-grid reveal">' +
      '      <div class="footer-brand">' +
      '        <img src="' + ROOT + 'assets/logo.png" alt="Amora.id">' +
      '        <p>Solusi Website Jualan untuk Bisnis Modern Indonesia</p>' +
      '      </div>' +
      '      <div class="footer-col">' +
      '        <h4>Amora.id</h4>' +
      '        <ul>' +
      '          <li><a href="' + sectionLink('fitur') + '">Fitur</a></li>' +
      '          <li><a href="' + sectionLink('vip-program') + '">VIP Merchant</a></li>' +
      '          <li><a href="' + sectionLink('harga') + '">Harga</a></li>' +
      '          <li><a href="' + sectionLink('faq') + '">FAQ</a></li>' +
      '        </ul>' +
      '      </div>' +
      '      <div class="footer-col">' +
      '        <h4>Kontak</h4>' +
      '        <ul style="gap:14px">' +
      '          <li class="footer-contact-item">' +
      '            <svg data-icon viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>' +
      '            <a href="mailto:hello@amora.id">hello@amora.id</a>' +
      '          </li>' +
      '          <li class="footer-contact-item">' +
      '            <svg data-icon viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>' +
      '            <a href="mailto:support@amora.id">support@amora.id</a>' +
      '          </li>' +
      '          <li class="footer-contact-item">' +
      '            <svg data-icon viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.58 1.22h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6.13 6.13l1.32-1.32a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>' +
      '            <a href="https://wa.me/6285117208085" target="_blank" rel="noopener">0851 1720 8085</a>' +
      '          </li>' +
      '          <li class="footer-social">' +
      '            <a href="https://www.instagram.com/amora.commerce" target="_blank" rel="noopener" aria-label="Instagram"><svg data-icon viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg></a>' +
      '            <a href="https://www.threads.com/@amora.commerce" target="_blank" rel="noopener" aria-label="Threads"><svg viewBox="0 0 440 511.43" fill="currentColor"><path fill-rule="nonzero" d="' + THREADS_PATH + '" /></svg></a>' +
      '          </li>' +
      '        </ul>' +
      '      </div>' +
      '    </div>' +
      '    <div class="footer-bottom">' +
      '      <p>© 2026 Amora.id. Hak cipta dilindungi.</p>' +
      '      <div class="footer-legal-links">' +
      '        <a href="https://amora.id/syarat-ketentuan">Syarat &amp; Ketentuan</a>' +
      '        <a href="https://amora.id/kebijakan-privasi">Kebijakan Privasi</a>' +
      '      </div>' +
      '    </div>' +
      '  </div>' +
      '</footer>'
    );
  }

  function initBehavior() {
    var navbar = document.getElementById('navbar');
    if (!navbar) return;

    window.addEventListener('scroll', function () {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });

    var hamburger = document.getElementById('hamburger');
    var mobileMenu = document.getElementById('mobileMenu');
    if (!hamburger || !mobileMenu) return;

    var ICON_HAMBURGER = '<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>';
    var ICON_CLOSE = '<line x1="18" y1="6" x2="6" y2="18" stroke-width="2.5"/><line x1="6" y1="6" x2="18" y2="18" stroke-width="2.5"/>';

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

    hamburger.addEventListener('click', function () {
      mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
    });

    document.querySelectorAll('.mobile-link, .mobile-ctas a, .mobile-legal a, .nav-logo').forEach(function (el) {
      el.addEventListener('click', closeMenu);
    });
  }

  function playLogoAnimation() {
    var la = document.querySelector('.logo-anim');
    if (!la) return;

    var fp = la.querySelectorAll('.fill-layer path');
    var sp = la.querySelectorAll('.stroke-layer path');
    var sl = la.querySelector('.stroke-layer');
    var groups = [[0, 1, 2], [3], [4], [5], [6, 7], [8], [9]];
    var gd = [0, .15, .30, .45, .58, .72, .86];

    function setupStroke() {
      sp.forEach(function (p) { var l = p.getTotalLength(); p.style.strokeDasharray = l; p.style.strokeDashoffset = l; });
    }

    function playOutline() {
      sl.style.opacity = '1'; sl.style.animation = 'none';
      sp.forEach(function (p) { p.style.transition = 'none'; });
      void la.offsetWidth;
      setupStroke();
      sp.forEach(function (p) { p.style.strokeOpacity = '1'; });
      void la.offsetWidth;
      sl.style.animation = 'strokeGlow 3.2s cubic-bezier(.16,1,.3,1) forwards';
      groups.forEach(function (g, gi) {
        var d = gd[gi];
        g.forEach(function (i) {
          sp[i].style.transition = 'stroke-dashoffset 1s cubic-bezier(.22,1,.36,1) ' + d + 's,stroke-opacity .5s ease ' + (d + 1.8) + 's';
          sp[i].style.strokeDashoffset = '0';
          sp[i].style.strokeOpacity = '0';
        });
      });
    }

    setupStroke();
    setTimeout(function () {
      groups.forEach(function (g, gi) {
        var d = gd[gi];
        g.forEach(function (i) {
          fp[i].style.transition = 'opacity .55s cubic-bezier(.16,1,.3,1) ' + d + 's,filter .6s cubic-bezier(.16,1,.3,1) ' + d + 's';
          fp[i].style.opacity = '1';
          fp[i].style.filter = 'blur(0)';
        });
      });
      playOutline();
    }, 60);
    setInterval(playOutline, 4200);
  }

  function mount() {
    var navSlot = document.getElementById('site-navbar');
    var footerSlot = document.getElementById('site-footer');

    if (navSlot) navSlot.outerHTML = navHtml() + mobileMenuHtml();
    if (footerSlot) footerSlot.outerHTML = footerHtml();

    initBehavior();
    playLogoAnimation();
  }

  // Runs synchronously as soon as this script executes — the placeholders
  // must already be in the DOM at that point (script tag placed after them).
  mount();
})();
