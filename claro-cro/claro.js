/* Claro — interactions. Content works without JavaScript; this adds motion and the selector/story behavior. */
(function () {
  'use strict';
  const root = document.documentElement;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const supportsIO = 'IntersectionObserver' in window;
  if (supportsIO && !reduce) root.classList.add('js');

  /* Topbar + mobile CTA */
  const topbar = document.querySelector('.site-header');
  const mobileCta = document.querySelector('.mobile-cta');
  /* The bar is a duplicate of in-page links on desktop (hidden from everyone there); on phones it is the primary action, so expose it exactly when it is shown. */
  const syncCta = () => {
    if (!mobileCta) return;
    const shown = getComputedStyle(mobileCta).display !== 'none' && mobileCta.classList.contains('is-visible') && !mobileCta.classList.contains('is-suppressed');
    mobileCta.setAttribute('aria-hidden', String(!shown));
    mobileCta.querySelectorAll('a').forEach(a => { a.tabIndex = shown ? 0 : -1; });
  };
  const onScroll = () => {
    const y = window.scrollY || 0;
    topbar.classList.toggle('is-scrolled', y > 24);
    if (mobileCta) { mobileCta.classList.toggle('is-visible', y > window.innerHeight * 0.6); syncCta(); }
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  /* Hide the sticky bar while the Contacto buttons are on screen (they would be the same button twice). */
  const contactActions = document.querySelector('.contact-actions');
  if (mobileCta && contactActions && supportsIO) {
    const cio = new IntersectionObserver(es => { es.forEach(e => mobileCta.classList.toggle('is-suppressed', e.isIntersecting)); syncCta(); }, { threshold: 0.2 });
    cio.observe(contactActions);
  }
  /* Phones: second biography paragraph starts collapsed behind "Leer más". */
  const phoneMq = window.matchMedia('(max-width: 720px)');
  const moreDetails = document.querySelectorAll('details.more');
  if (phoneMq.matches) moreDetails.forEach(d => { d.open = false; });
  /* Rotating or resizing to a wider layout reopens it, so the paragraph is never stranded. */
  phoneMq.addEventListener('change', e => { if (!e.matches) moreDetails.forEach(d => { d.open = true; }); });
  /* Swipe rows get position dots (shown only where the rows scroll). */
  if (supportsIO) document.querySelectorAll('.review-grid, .article-grid').forEach(row => {
    const cards = [...row.children]; if (cards.length < 2) return;
    const dots = document.createElement('div'); dots.className = 'dots'; dots.setAttribute('aria-hidden', 'true');
    cards.forEach(() => dots.appendChild(document.createElement('i')));
    row.after(dots);
    const set = i => [...dots.children].forEach((d, j) => d.classList.toggle('is-on', i === j));
    set(0);
    /* Active dot follows the scroll position, which is correct whatever number of cards fit on screen. */
    row.addEventListener('scroll', () => {
      const step = cards[1].offsetLeft - cards[0].offsetLeft || 1;
      set(Math.max(0, Math.min(cards.length - 1, Math.round(row.scrollLeft / step))));
    }, { passive: true });
  });

  /* Menu sheet */
  const toggle = document.querySelector('.menu-toggle');
  const sheet = document.getElementById('menu-sheet');
  const scrim = document.querySelector('.menu-scrim');
  let lastFocus = null;
  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    sheet.hidden = !open;
    if (scrim) scrim.hidden = !open;
    document.body.classList.toggle('menu-open', open);
    /* Page behind the sheet is inert while it is open (header stays live so the close button works). */
    document.querySelectorAll('main, footer, .mobile-cta').forEach(el => { if (open) el.setAttribute('inert', ''); else el.removeAttribute('inert'); });
    if (open) { lastFocus = document.activeElement; sheet.focus(); }
    else (lastFocus && lastFocus !== document.body ? lastFocus : toggle).focus();
  }
  /* Keep Tab inside the open sheet (toggle button + sheet links + sheet button). */
  document.addEventListener('keydown', e => {
    if (e.key !== 'Tab' || sheet.hidden) return;
    const items = [toggle, ...sheet.querySelectorAll('a[href], button')].filter(el => el.offsetParent !== null);
    const first = items[0], last = items[items.length - 1];
    if (e.shiftKey && (document.activeElement === first || document.activeElement === sheet)) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  toggle.addEventListener('click', () => setMenu(sheet.hidden));
  sheet.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !sheet.hidden) setMenu(false); });
  document.addEventListener('click', e => { if (!sheet.hidden && !e.target.closest('.site-header')) setMenu(false); });

  /* Reveal */
  if (supportsIO && !reduce) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in'); io.unobserve(en.target);
        /* Cards inside a horizontal carousel reveal together. */
        const row = en.target.closest('.article-grid, .review-grid');
        if (row) row.querySelectorAll('[data-reveal]').forEach(c => { c.classList.add('is-in'); io.unobserve(c); });
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));
  }

  /* Count-up */
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = Number(el.dataset.count);
    const run = () => {
      if (reduce) { el.textContent = target; return; }
      el.textContent = '0';
      const start = performance.now(), dur = 1300;
      const tick = now => { const t = Math.min(1, (now - start) / dur); el.textContent = Math.round(target * (1 - Math.pow(1 - t, 4))); if (t < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    };
    if (supportsIO && !reduce) { const o = new IntersectionObserver(es => { es.forEach(e => { if (e.isIntersecting) { run(); o.disconnect(); } }); }, { threshold: 0.5 }); o.observe(el); }
    else run();
  });

  /* Segmented selector (tabs) */
  const seg = document.querySelector('.seg');
  if (seg) {
    const tabs = [...seg.querySelectorAll('[role="tab"]')];
    const thumb = seg.querySelector('.seg-thumb');
    const panels = tabs.map(t => document.getElementById(t.getAttribute('aria-controls')));
    const moveThumb = tab => {
      const r = tab.getBoundingClientRect(), s = seg.getBoundingClientRect();
      thumb.style.width = r.width + 'px';
      thumb.style.transform = 'translateX(' + (r.left - s.left - 5) + 'px)';
    };
    const select = (i, focus) => {
      tabs.forEach((t, j) => {
        const on = i === j;
        t.setAttribute('aria-selected', String(on));
        t.classList.toggle('is-active', on);
        t.tabIndex = on ? 0 : -1;
        const p = panels[j];
        if (on) { p.hidden = false; p.classList.toggle('is-active', true); if (!reduce) { p.classList.remove('is-entering'); void p.offsetWidth; p.classList.add('is-entering'); } }
        else { p.hidden = true; p.classList.remove('is-active'); }
      });
      moveThumb(tabs[i]);
      if (focus) tabs[i].focus();
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(i, false));
      t.addEventListener('keydown', e => {
        let n = null;
        if (e.key === 'ArrowRight') n = (i + 1) % tabs.length;
        if (e.key === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
        if (e.key === 'Home') n = 0;
        if (e.key === 'End') n = tabs.length - 1;
        if (n !== null) { e.preventDefault(); select(n, true); }
      });
    });
    panels.forEach((p, j) => { if (j !== 0) { p.hidden = true; p.classList.remove('is-active'); } });
    document.querySelector('.panels').classList.add('is-ready');
    moveThumb(tabs[0]);
    window.addEventListener('resize', () => moveThumb(tabs.find(t => t.classList.contains('is-active')) || tabs[0]));
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => moveThumb(tabs.find(t => t.classList.contains('is-active')) || tabs[0]));
  }

  /* Journey: sticky image stack follows the active step */
  const stack = document.querySelector('[data-stack]');
  const steps = [...document.querySelectorAll('.jstep')];
  if (stack && steps.length) {
    const imgs = stack.querySelectorAll('img');
    const counter = stack.querySelector('[data-counter]');
    const activate = i => {
      steps.forEach((s, j) => s.classList.toggle('is-active', i === j));
      imgs.forEach((im, j) => im.classList.toggle('is-active', i === j));
      if (counter) counter.textContent = String(i + 1).padStart(2, '0');
    };
    if (supportsIO) {
      const sio = new IntersectionObserver(entries => {
        entries.forEach(en => { if (en.isIntersecting) activate(Number(en.target.dataset.step)); });
      }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
      steps.forEach(s => sio.observe(s));
    } else steps.forEach(s => s.classList.add('is-active'));
  }

  /* FAQ height animation */
  document.querySelectorAll('.faq-list details').forEach(d => {
    const summary = d.querySelector('summary'), body = d.querySelector('.faq-body');
    if (!summary || !body || reduce) return;
    let busy = false;
    const finish = (open) => { body.style.height = ''; body.style.transition = ''; d.open = open; busy = false; };
    summary.addEventListener('click', e => {
      e.preventDefault();
      if (busy) return;
      busy = true;
      let timer;
      const done = open => () => { clearTimeout(timer); body.removeEventListener('transitionend', onEnd); finish(open); };
      let onEnd;
      if (d.open) {
        body.style.height = body.offsetHeight + 'px';
        void body.offsetHeight;
        body.style.transition = 'height .4s cubic-bezier(.65,0,.35,1)';
        body.style.height = '0px';
        onEnd = done(false); body.addEventListener('transitionend', onEnd); timer = setTimeout(onEnd, 500);
      } else {
        d.open = true;
        const h = body.offsetHeight;
        body.style.height = '0px';
        void body.offsetHeight;
        body.style.transition = 'height .5s cubic-bezier(.16,1,.3,1)';
        body.style.height = h + 'px';
        onEnd = done(true); body.addEventListener('transitionend', onEnd); timer = setTimeout(onEnd, 600);
      }
    });
  });

  /* Video dialog */
  const dialog = document.querySelector('.video-dialog');
  if (dialog && typeof dialog.showModal === 'function') {
    const player = dialog.querySelector('.dialog-player'), title = dialog.querySelector('#dialog-title'), yt = dialog.querySelector('.dialog-youtube');
    let opener = null;
    dialog.addEventListener('close', () => { player.innerHTML = ''; if (opener) opener.focus(); });
    dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
    document.querySelectorAll('[data-video]').forEach(a => {
      a.addEventListener('click', e => {
        e.preventDefault(); opener = a;
        const id = a.dataset.video; title.textContent = a.dataset.title || ''; yt.href = 'https://www.youtube.com/watch?v=' + id;
        player.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0" title="' + (a.dataset.title || 'Video') + '" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>';
        dialog.showModal();
      });
    });
  }
})();
