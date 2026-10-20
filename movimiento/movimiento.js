(() => {
  'use strict';
  document.body.classList.add('js');
  const root = document.documentElement;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const capture = new URLSearchParams(location.search).has('capture');
  const header = document.querySelector('.nav-shell');
  const headerInner = document.querySelector('.header-inner');
  const menu = document.querySelector('.menu-toggle');
  const navigation = document.getElementById('navigation');

  function closeMenu(restoreFocus = false) {
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', 'Abrir menú');
    headerInner.classList.remove('menu-open');
    if (restoreFocus) menu.focus();
  }
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    headerInner.classList.toggle('menu-open', open);
    if (open) navigation.querySelector('a').focus();
  });
  navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') closeMenu(true);
  });
  document.addEventListener('click', e => {
    if (!header.contains(e.target) && menu.getAttribute('aria-expanded') === 'true') closeMenu();
  });
  window.matchMedia('(min-width: 701px)').addEventListener('change', e => { if (e.matches) closeMenu(); });
  const updateHeader = () => header.classList.toggle('scrolled', scrollY > 30);
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  const tabs = [...document.querySelectorAll('.care-tab')];
  const panels = [...document.querySelectorAll('.care-panel')];
  const tabList = document.querySelector('.care-tabs');
  panels.forEach((panel, index) => { panel.hidden = index !== 0; });
  let panelAnimation;
  function activateTab(index, focus = false) {
    const changed = tabs[index].getAttribute('aria-selected') !== 'true';
    panelAnimation?.cancel();
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
      panels[i].hidden = i !== index;
    });
    tabList.style.setProperty('--active', String(index));
    tabList.dataset.active = String(index);
    if (focus) tabs[index].focus({ preventScroll: true });
    if (changed && !capture && !reducedMotion.matches && typeof panels[index].animate === 'function') {
      panelAnimation = panels[index].animate([
        { opacity: 0.15, transform: 'translateY(12px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ], { duration: 520, easing: 'cubic-bezier(.22,1,.36,1)' });
    }
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateTab(index));
    tab.addEventListener('keydown', e => {
      let next;
      if (e.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (e.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      if (e.key === 'Home') next = 0;
      if (e.key === 'End') next = tabs.length - 1;
      if (next !== undefined) { e.preventDefault(); activateTab(next, true); }
    });
  });

  // Warm the original clinical photographs when the care sequence approaches view.
  // Switching a step should reveal its photograph along with the text.
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      panels.forEach(panel => {
        const image = panel.querySelector('img');
        image.loading = 'eager';
        if (typeof image.decode === 'function') image.decode().catch(() => {});
      });
      imageObserver.disconnect();
    }, { rootMargin: '300px' });
    imageObserver.observe(tabList);
  }

  const dialog = document.querySelector('.video-dialog');
  const player = dialog.querySelector('.dialog-player');
  let videoTrigger;
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
      const r = dialog.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close();
    });
    dialog.addEventListener('close', () => {
      player.replaceChildren();
      document.body.style.overflow = previousOverflow;
      videoTrigger?.focus({ preventScroll: true });
    });
  }

  if (capture) root.classList.add('capture');
  else if (!reducedMotion.matches) {
    root.classList.add('motion-ready');
    if ('IntersectionObserver' in window) {
      try {
        const observer = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        }, { threshold: 0.08, rootMargin: '0px 0px -18px 0px' });
        document.querySelectorAll('[data-reveal]').forEach(item => observer.observe(item));
        root.classList.add('reveal-ready');
      } catch (_) { root.classList.remove('reveal-ready'); }
    }
  }
  reducedMotion.addEventListener('change', e => {
    if (e.matches) {
      root.classList.remove('motion-ready', 'reveal-ready');
      panelAnimation?.cancel();
    }
  });
})();
