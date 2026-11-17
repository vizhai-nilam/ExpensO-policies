/* ExpensO site — theme picker, display size, sidebar stages, scroll-spy, tabs.
   No dependencies, no network, no tracking. Storage access is wrapped because
   localStorage can throw (private window / blocked site data). */
(function () {
  'use strict';
  var root = document.documentElement;

  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  /* ---------------------------------------------------------- themes ---- */
  // Mirrors the app: the Classic (blue) theme in System / Light / Dark.
  var THEMES = {
    'system':        { label: 'System' },
    'classic-light': { label: 'Light', color: '#E9EFFA' },
    'classic-dark':  { label: 'Dark', color: '#0C1322' }
  };
  var mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  function resolve(pref) {
    if (pref === 'system') return mq && mq.matches ? 'classic-dark' : 'classic-light';
    return THEMES[pref] ? pref : 'classic-light';
  }
  function applyTheme(pref) {
    if (!THEMES[pref]) pref = 'classic-light';
    var t = resolve(pref);
    root.setAttribute('data-theme', t);
    root.setAttribute('data-pref', pref);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', (THEMES[t] || {}).color || '#E9EFFA');
    document.querySelectorAll('[data-set-theme]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-set-theme') === pref));
    });
  }
  applyTheme(root.getAttribute('data-pref') || get('expenso-theme') || 'classic-light');
  document.querySelectorAll('[data-set-theme]').forEach(function (b) {
    b.addEventListener('click', function () {
      var p = b.getAttribute('data-set-theme');
      set('expenso-theme', p);
      applyTheme(p);
    });
  });
  if (mq && mq.addEventListener) {
    mq.addEventListener('change', function () {
      if (root.getAttribute('data-pref') === 'system') applyTheme('system');
    });
  }

  /* ---------------------------------------------------- display size ---- */
  function applySize(s) {
    if (['small', 'medium', 'large', 'xl'].indexOf(s) < 0) s = 'small';
    root.setAttribute('data-size', s);
    document.querySelectorAll('[data-set-size]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-set-size') === s));
    });
  }
  applySize(root.getAttribute('data-size') || get('expenso-size') || 'small');
  document.querySelectorAll('[data-set-size]').forEach(function (b) {
    b.addEventListener('click', function () {
      var s = b.getAttribute('data-set-size');
      set('expenso-size', s);
      applySize(s);
    });
  });

  /* --------------------------------------------------------- sidebar ---- */
  var body = document.body;
  var collapse = document.getElementById('sb-collapse');
  var tab = document.getElementById('sb-tab');
  var menu = document.getElementById('menu-btn');
  var scrim = document.getElementById('scrim');
  function wide() { return window.innerWidth > 900; }
  function stage() { return root.getAttribute('data-sb') || 'full'; }
  // Same three stages as the app: hidden -> icon rail -> full menu.
  function setStage(s, save) {
    if (!wide()) { root.removeAttribute('data-sb'); return; }
    if (s === 'full') root.removeAttribute('data-sb'); else root.setAttribute('data-sb', s);
    if (save !== false) set('expenso-sb', s);
    if (menu) menu.setAttribute('aria-expanded', String(s !== 'hidden'));
  }
  var opener = { hidden: 'rail', rail: 'full', full: 'full' };
  var closer = { full: 'rail', rail: 'hidden', hidden: 'hidden' };
  function restore() {
    var st = get('expenso-sb');
    setStage(st === 'rail' || st === 'hidden' ? st : 'full', false);
  }
  restore();
  window.addEventListener('resize', restore);
  if (tab) tab.addEventListener('click', function () {
    var s = stage();
    setStage(s === 'full' ? closer.full : opener[s]);
  });
  if (collapse) collapse.addEventListener('click', function () { setStage(closer[stage()]); });
  function drawer(open) {
    body.classList.toggle('sb-open', open);
    if (menu && !wide()) menu.setAttribute('aria-expanded', String(open));
  }
  if (menu) menu.addEventListener('click', function () {
    if (wide()) setStage(stage() === 'hidden' ? 'full' : 'hidden');
    else drawer(!body.classList.contains('sb-open'));
  });
  if (scrim) scrim.addEventListener('click', function () { drawer(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') drawer(false); });
  document.querySelectorAll('.sidebar a').forEach(function (a) {
    a.addEventListener('click', function () { drawer(false); });
  });

  /* ------------------------------------------------------- scroll-spy --- */
  var links = Array.prototype.slice.call(document.querySelectorAll('.sb-link[data-spy]'));
  var crumb = document.getElementById('crumb-current');
  if (links.length && 'IntersectionObserver' in window) {
    var map = {};
    links.forEach(function (l) { map[l.getAttribute('data-spy')] = l; });
    var visible = {};
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { visible[en.target.id] = en.isIntersecting ? en.intersectionRatio : 0; });
      var best = null, bestR = 0;
      Object.keys(visible).forEach(function (id) { if (visible[id] > bestR) { bestR = visible[id]; best = id; } });
      if (best && map[best]) {
        links.forEach(function (l) { l.classList.remove('active'); l.removeAttribute('aria-current'); });
        map[best].classList.add('active');
        map[best].setAttribute('aria-current', 'true');
        if (crumb) crumb.textContent = map[best].getAttribute('data-title') || map[best].textContent.trim();
      }
    }, { rootMargin: '-72px 0px -55% 0px', threshold: [0, .1, .25, .5, .75, 1] });
    Object.keys(map).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) io.observe(el);
    });
  }

  /* TOC on legal pages */
  var toc = Array.prototype.slice.call(document.querySelectorAll('.toc a'));
  if (toc.length && 'IntersectionObserver' in window) {
    var tmap = {};
    toc.forEach(function (a) { tmap[a.getAttribute('href').slice(1)] = a; });
    var tio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          toc.forEach(function (a) { a.classList.remove('active'); });
          tmap[en.target.id].classList.add('active');
        }
      });
    }, { rootMargin: '-80px 0px -70% 0px' });
    Object.keys(tmap).forEach(function (id) { var el = document.getElementById(id); if (el) tio.observe(el); });
  }

  /* ------------------------------------------------------------ tabs ---- */
  document.querySelectorAll('[data-tabs]').forEach(function (group) {
    var scope = document.getElementById(group.getAttribute('data-tabs'));
    if (!scope) return;
    var btns = group.querySelectorAll('button[data-tab]');
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        btns.forEach(function (x) { x.setAttribute('aria-selected', String(x === b)); });
        scope.querySelectorAll(':scope > [data-panel]').forEach(function (p) {
          p.hidden = p.getAttribute('data-panel') !== b.getAttribute('data-tab');
        });
      });
    });
  });

  /* Open a guide / FAQ item when linked to by hash. */
  function openHash() {
    if (!location.hash) return;
    var el = document.getElementById(location.hash.slice(1));
    if (el && el.tagName === 'DETAILS') el.open = true;
  }
  window.addEventListener('hashchange', openHash);
  openHash();
})();
