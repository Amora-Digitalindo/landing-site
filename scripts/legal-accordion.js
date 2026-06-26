// Build accordion structure dynamically
document.querySelectorAll('.legal-section').forEach((section) => {
  const h3 = section.querySelector('h3');
  const bodyChildren = Array.from(section.children).filter((el) => el !== h3);

  const trigger = document.createElement('button');
  trigger.className = 'legal-section-trigger';
  trigger.setAttribute('aria-expanded', 'false');
  trigger.innerHTML = `<h3>${h3.textContent}</h3><svg class="legal-chevron" data-icon viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`;

  const body = document.createElement('div');
  body.className = 'legal-section-body';
  const inner = document.createElement('div');
  inner.className = 'legal-section-body-inner';
  bodyChildren.forEach((child) => inner.appendChild(child));
  body.appendChild(inner);

  section.innerHTML = '';
  section.appendChild(trigger);
  section.appendChild(body);

  trigger.addEventListener('click', () => {
    const isOpen = section.classList.toggle('open');
    trigger.setAttribute('aria-expanded', isOpen);
  });
});

// Scroll reveal (fade-in only, no expand on load)
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        sectionObserver.unobserve(e.target);
      }
    });
  },
  { threshold: 0.06, rootMargin: '-20px' }
);
document.querySelectorAll('.legal-section').forEach((el, i) => {
  el.style.transitionDelay = `${i * 0.04}s`;
  sectionObserver.observe(el);
});
