/* Peak Season Media — vanilla JS, no dependencies.
   Accessibility notes:
   - Dropdowns are <button aria-expanded> so they work by keyboard and touch.
     Desktop hover-open is CSS-only; JS only manages the explicit toggle state.
   - Accordions use native <details>, so no JS is required for them at all.
   - Escape closes any open menu and returns focus to its trigger. */
(function () {
  'use strict';

  var DESKTOP = '(min-width: 1080px)';
  var isDesktop = function () { return window.matchMedia(DESKTOP).matches; };

  /* ---- Mobile nav ---- */
  var toggle = document.getElementById('nav-toggle');
  var nav = document.getElementById('site-nav');

  function closeNav() {
    if (!nav || !toggle) return;
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  /* ---- Dropdowns ---- */
  var drops = Array.prototype.slice.call(document.querySelectorAll('.drop-toggle'));

  function closeAllDrops(except) {
    document.querySelectorAll('.has-drop.open').forEach(function (el) {
      if (el === except) return;
      el.classList.remove('open');
      var t = el.querySelector('.drop-toggle');
      if (t) t.setAttribute('aria-expanded', 'false');
    });
  }

  drops.forEach(function (btn) {
    var li = btn.closest('.has-drop');
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = li.classList.contains('open');
      closeAllDrops();
      if (!isOpen) {
        li.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.has-drop')) closeAllDrops();
    // Tapping outside the open mobile sheet closes it
    if (!isDesktop() && nav && nav.classList.contains('open') &&
        !e.target.closest('.site-nav') && !e.target.closest('#nav-toggle')) {
      closeNav();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var openDrop = document.querySelector('.has-drop.open');
    if (openDrop) {
      var t = openDrop.querySelector('.drop-toggle');
      closeAllDrops();
      if (t) t.focus();
      return;
    }
    if (nav && nav.classList.contains('open')) {
      closeNav();
      if (toggle) toggle.focus();
    }
  });

  /* Reset menu state when crossing the desktop breakpoint */
  var mq = window.matchMedia(DESKTOP);
  var onChange = function () { closeAllDrops(); closeNav(); };
  if (mq.addEventListener) mq.addEventListener('change', onChange);
  else if (mq.addListener) mq.addListener(onChange);

  /* ---- FAQ accordions: one open at a time, per the design spec ---- */
  document.querySelectorAll('[data-accordion]').forEach(function (group) {
    var items = Array.prototype.slice.call(group.querySelectorAll('details'));
    items.forEach(function (d) {
      d.addEventListener('toggle', function () {
        if (!d.open) return;
        items.forEach(function (other) { if (other !== d) other.open = false; });
      });
    });
  });

  /* ---- Footer year ---- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();

/* ==========================================================================
   Accessibility options widget
   Self-hosted. Applies CSS preference classes to <html> and remembers the
   choice in localStorage. It deliberately does NOT rewrite the page, inject
   ARIA, or alter the accessibility tree — those are the behaviours that make
   third-party overlays interfere with a visitor's own assistive technology.
   ========================================================================== */
(function () {
  'use strict';

  var KEY = 'psm-a11y';
  var root = document.documentElement;

  var TOGGLES = [
    { id: 'contrast', cls: 'a11y-contrast', label: 'Higher contrast' },
    { id: 'links',    cls: 'a11y-links',    label: 'Highlight links' },
    { id: 'spacing',  cls: 'a11y-spacing',  label: 'More text spacing' },
    { id: 'motion',   cls: 'a11y-motion',   label: 'Reduce motion' }
  ];
  var SIZES = [
    { id: 'default', cls: '',              label: 'Default' },
    { id: 'lg',      cls: 'a11y-text-lg',  label: 'Large' },
    { id: 'xl',      cls: 'a11y-text-xl',  label: 'Larger' }
  ];

  function read() {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; }
  }
  function write(s) {
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {}
  }

  var state = read();

  function apply() {
    TOGGLES.forEach(function (t) { root.classList.toggle(t.cls, !!state[t.id]); });
    SIZES.forEach(function (s) { if (s.cls) root.classList.remove(s.cls); });
    var size = SIZES.filter(function (s) { return s.id === state.size; })[0];
    if (size && size.cls) root.classList.add(size.cls);
  }

  apply(); // before paint where possible

  document.addEventListener('DOMContentLoaded', function () {
    var fab = document.getElementById('a11y-fab');
    var panel = document.getElementById('a11y-panel');
    if (!fab || !panel) return;

    function sync() {
      TOGGLES.forEach(function (t) {
        var b = panel.querySelector('[data-a11y="' + t.id + '"]');
        if (!b) return;
        var on = !!state[t.id];
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
        var s = b.querySelector('.a11y-state');
        if (s) s.textContent = on ? 'On' : 'Off';
      });
      SIZES.forEach(function (s) {
        var b = panel.querySelector('[data-a11y-size="' + s.id + '"]');
        if (b) b.setAttribute('aria-pressed', (state.size || 'default') === s.id ? 'true' : 'false');
      });
    }

    function openPanel() {
      panel.hidden = false;
      fab.setAttribute('aria-expanded', 'true');
      var first = panel.querySelector('button');
      if (first) first.focus();
    }
    function closePanel(refocus) {
      panel.hidden = true;
      fab.setAttribute('aria-expanded', 'false');
      if (refocus) fab.focus();
    }

    fab.addEventListener('click', function () {
      if (panel.hidden) openPanel(); else closePanel(true);
    });

    panel.addEventListener('click', function (e) {
      var t = e.target.closest('[data-a11y]');
      if (t) {
        var id = t.getAttribute('data-a11y');
        state[id] = !state[id];
        apply(); write(state); sync();
        return;
      }
      var sz = e.target.closest('[data-a11y-size]');
      if (sz) {
        state.size = sz.getAttribute('data-a11y-size');
        apply(); write(state); sync();
        return;
      }
      if (e.target.closest('[data-a11y-reset]')) {
        state = {};
        apply(); write(state); sync();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !panel.hidden) closePanel(true);
    });
    document.addEventListener('click', function (e) {
      if (panel.hidden) return;
      if (!e.target.closest('#a11y-panel') && !e.target.closest('#a11y-fab')) closePanel(false);
    });

    sync();
  });
})();
