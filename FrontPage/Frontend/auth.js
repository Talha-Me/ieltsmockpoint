/* auth.js — synced with public/auth-nav.js */
(function () {
  if (window.__authNavLoaded) return;
  var s = document.createElement('script');
  s.src = '/auth-nav.js';
  (document.head || document.documentElement).appendChild(s);
})();
