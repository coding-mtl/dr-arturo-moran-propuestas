/* Site — interactions (approved Claro script + multi-page additions). Content works without JavaScript; this adds motion and the selector/story behavior. */
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
  const ctaTargets = document.querySelectorAll('.contact-actions, .form-card, .cta-band');
  if (mobileCta && ctaTargets.length && supportsIO) {
    const seen = new Set();
    const cio = new IntersectionObserver(es => { es.forEach(e => { if (e.isIntersecting) seen.add(e.target); else seen.delete(e.target); }); mobileCta.classList.toggle('is-suppressed', seen.size > 0); syncCta(); }, { threshold: 0.2 });
    ctaTargets.forEach(t => cio.observe(t));
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
  if (toggle && sheet) {
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
  }

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

  /* Clips: poster until clicked, then the real video (nothing downloads before the click). */
  document.querySelectorAll('.clip[data-src]').forEach(clip => {
    const btn = clip.querySelector('button');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const v = document.createElement('video');
      v.src = clip.dataset.src; v.controls = true; v.autoplay = true; v.playsInline = true; v.setAttribute('playsinline', '');
      v.poster = clip.querySelector('img') ? clip.querySelector('img').src : '';
      v.setAttribute('aria-label', btn.getAttribute('aria-label') || 'Video');
      document.querySelectorAll('.clip video').forEach(o => o.pause());
      clip.replaceChildren(v);
      v.focus();
      const p = v.play(); if (p && p.catch) p.catch(() => {});
    });
  });

  /* Articles index: topic filters (all cards stay in the HTML for search engines). */
  const filterBar = document.querySelector('.filters');
  if (filterBar) {
    const cards = [...document.querySelectorAll('.post-grid [data-tags]')];
    const count = document.querySelector('.filter-count');
    const apply = tag => {
      let n = 0;
      cards.forEach(c => { const on = tag === 'todos' || c.dataset.tags.split(' ').includes(tag); c.hidden = !on; if (on) n++; });
      filterBar.querySelectorAll('.filter').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.tag === tag)));
      if (count) count.textContent = n + (n === 1 ? ' artículo' : ' artículos');
      try { history.replaceState(null, '', tag === 'todos' ? location.pathname : '#' + tag); } catch (e) {}
    };
    filterBar.addEventListener('click', e => { const b = e.target.closest('.filter'); if (b) apply(b.dataset.tag); });
    const initial = location.hash.slice(1);
    if (initial && filterBar.querySelector('[data-tag="' + CSS.escape(initial) + '"]')) apply(initial);
  }

  /* Table of contents: highlight the section being read. */
  const tocLinks = [...document.querySelectorAll('.toc a')];
  if (tocLinks.length && supportsIO) {
    const map = new Map(tocLinks.map(a => [decodeURIComponent(a.hash.slice(1)), a]));
    const tio = new IntersectionObserver(es => {
      es.forEach(e => { if (e.isIntersecting) { tocLinks.forEach(a => a.classList.remove('is-current')); const a = map.get(e.target.id); if (a) a.classList.add('is-current'); } });
    }, { rootMargin: '-20% 0px -70% 0px' });
    map.forEach((a, id) => { const h = document.getElementById(id); if (h) tio.observe(h); });
  }

  /* Lead form: timing field for spam filtering, no double submits, simple phone check. */
  document.querySelectorAll('form.lead-form').forEach(f => {
    const ts = f.querySelector('input[name="ts"]'); if (ts) ts.value = String(Date.now());
    const page = f.querySelector('input[name="pagina"]'); if (page) page.value = location.pathname;
    f.addEventListener('submit', e => {
      const tel = f.querySelector('input[name="telefono"]');
      if (tel && tel.value.replace(/\D/g, '').length < 10) { e.preventDefault(); tel.setCustomValidity('Escribe tu número a 10 dígitos.'); tel.reportValidity(); return; }
      try { sessionStorage.setItem('lead_draft', JSON.stringify(Object.fromEntries([...new FormData(f)].filter(([k]) => ['nombre', 'telefono', 'correo', 'articulacion', 'mensaje'].includes(k))))); } catch (e2) {}
      const btn = f.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; btn.textContent = 'Enviando…'; }
    });
    const tel = f.querySelector('input[name="telefono"]');
    if (tel) tel.addEventListener('input', () => tel.setCustomValidity(''));
  });
  /* Back/forward cache: re-enable the button if the visitor returns to the page. */
  window.addEventListener('pageshow', () => document.querySelectorAll('form.lead-form button[type="submit"]').forEach(b => { b.disabled = false; b.textContent = b.dataset.label || b.textContent; }));

  /* Form errors returned by the server (?error=...): explain and offer WhatsApp/phone. */
  const err = new URLSearchParams(location.search).get('error');
  const card = document.querySelector('.form-card');
  if (err && card) {
    const msgs = {
      datos: 'Revisa tus datos: necesitamos tu nombre, un teléfono a 10 dígitos y que aceptes el aviso de privacidad.',
      limite: 'Recibimos varias solicitudes desde tu conexión. Si necesitas algo más, escríbenos por WhatsApp o llámanos.',
      envio: 'No pudimos enviar tu solicitud en este momento. Por favor escríbenos por WhatsApp o llama al 81 2201 0912.'
    };
    const box = document.createElement('p');
    box.className = 'form-error'; box.setAttribute('role', 'alert');
    box.textContent = msgs[err] || msgs.envio;
    const form = card.querySelector('form');
    card.insertBefore(box, form);
    /* Put back what the visitor had typed. */
    try {
      const draft = JSON.parse(sessionStorage.getItem('lead_draft') || '{}');
      Object.entries(draft).forEach(([k, v]) => { const el = form.elements[k]; if (el && !el.value) el.value = v; });
    } catch (e) {}
    card.scrollIntoView({ block: 'start' });
  }
})();
