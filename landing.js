// ExpensO marketing page — theme toggle + light/dark screenshot swap.
// No dependencies, no tracking. Wrapped defensively since localStorage can
// throw in a private window or with blocked site data.

(function () {
  var root = document.documentElement;

  function safeGet(key) {
    try { return window.localStorage.getItem(key); } catch (e) { return null; }
  }
  function safeSet(key, value) {
    try { window.localStorage.setItem(key, value); } catch (e) {}
  }

  var stored = safeGet('expenso-theme');
  if (stored === 'light' || stored === 'dark') {
    root.setAttribute('data-theme', stored);
  }

  var toggle = document.getElementById('theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var current = root.getAttribute('data-theme');
      var prefersDark = window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches;
      var effectiveIsLight = current ? current === 'light' : !prefersDark;
      var next = effectiveIsLight ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      safeSet('expenso-theme', next);
    });
  }

  // Light/dark screenshot toggles inside feature cards (Budgets, Cash flow).
  document.querySelectorAll('[data-shot-toggle]').forEach(function (group) {
    var img = document.getElementById(group.getAttribute('data-shot-toggle'));
    if (!img) return;
    var buttons = group.querySelectorAll('button[data-src]');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        buttons.forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
        btn.setAttribute('aria-pressed', 'true');
        img.src = btn.getAttribute('data-src');
      });
    });
  });
})();
