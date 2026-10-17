(() => {
  'use strict';
  document.body.classList.add('js');
  const header = document.querySelector('.site-header');
  const headerInner = document.querySelector('.header-inner');
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('navigation');
  function closeMenu(restoreFocus = false) {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menú');
    headerInner.classList.remove('menu-open');
    if (restoreFocus) toggle.focus();
  }
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    headerInner.classList.toggle('menu-open', open);
    if (open) nav.querySelector('a').focus();
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') closeMenu(true);
  });
  document.addEventListener('click', e => {
    if (!header.contains(e.target) && toggle.getAttribute('aria-expanded') === 'true') closeMenu();
  });
  window.matchMedia('(min-width: 701px)').addEventListener('change', e => { if (e.matches) closeMenu(); });
  const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 16);
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  const dialog = document.querySelector('.video-dialog');
  const player = dialog.querySelector('.dialog-player');
  let videoTrigger = null;
  let previousOverflow = '';
  if (typeof dialog.showModal === 'function') {
    document.querySelectorAll('[data-video]').forEach(link => link.addEventListener('click', e => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      videoTrigger = link;
      const frame = document.createElement('iframe');
      frame.src = `https://www.youtube-nocookie.com/embed/${link.dataset.video}?autoplay=1&rel=0`;
      frame.title = link.dataset.title;
      frame.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen';
      frame.allowFullscreen = true;
      frame.referrerPolicy = 'strict-origin-when-cross-origin';
      player.replaceChildren(frame);
      dialog.querySelector('#dialog-title').textContent = link.dataset.title;
      dialog.querySelector('.dialog-youtube').href = link.href;
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      dialog.showModal();
      dialog.querySelector('.dialog-close').focus();
    }));
    dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', e => {
      const rect = dialog.getBoundingClientRect();
      if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) dialog.close();
    });
    dialog.addEventListener('close', () => {
      player.replaceChildren();
      document.body.style.overflow = previousOverflow;
      videoTrigger?.focus({ preventScroll: true });
    });
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (new URLSearchParams(location.search).has('capture')) {
    document.documentElement.classList.add('capture');
  } else if (!reducedMotion.matches) {
    document.documentElement.classList.add('intro-ready');
    if ('IntersectionObserver' in window) {
      try {
        const observer = new IntersectionObserver(entries => entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        }), { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });
        document.querySelectorAll('.reveal').forEach(item => observer.observe(item));
        document.documentElement.classList.add('reveal-enabled');
        reducedMotion.addEventListener('change', e => {
          if (e.matches) document.documentElement.classList.remove('reveal-enabled', 'intro-ready');
        });
      } catch (_) {
        document.documentElement.classList.remove('reveal-enabled');
      }
    }
  }
})();
