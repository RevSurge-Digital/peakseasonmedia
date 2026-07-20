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
