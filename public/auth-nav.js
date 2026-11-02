/* auth-nav.js
 * Zero-flicker shared auth navbar controller.
 * Renders cached profile synchronously before first paint (via MutationObserver in <head>)
 * and verifies session in the background without unnecessary DOM replacement.
 */
(function () {
  if (window.__authNavLoaded) return;
  window.__authNavLoaded = true;

  var css = [
    'html.an-cached-auth #hd .nav-actions > a.btn, html.an-cached-auth #sb .sb-actions > a.btn { visibility: hidden; }',
    '.an-wrap{position:relative;display:inline-flex;align-items:center;margin:0;padding:0}',
    '.an-btn{display:inline-flex;align-items:center;gap:10px;height:42px;box-sizing:border-box;background:#fff;border:1.5px solid var(--line,#e3e9f3);border-radius:999px;padding:3px 14px 3px 3px;margin:0;cursor:pointer;font-family:"Inter",system-ui,-apple-system,sans-serif;color:var(--navy,#0b2b52);font-weight:700;font-size:.9rem;line-height:1;white-space:nowrap;transition:border-color .2s,box-shadow .2s}',
    '.an-btn:hover{border-color:var(--blue,#1565c9);box-shadow:0 6px 16px rgba(21,101,201,.14)}',
    '.an-av{width:34px;height:34px;aspect-ratio:1/1;border-radius:50%;background:var(--navy,#0b2b52);color:#fff;display:inline-flex;align-items:center;justify-content:center;font-family:"Sora",system-ui,sans-serif;font-weight:800;font-size:.92rem;line-height:1;overflow:hidden;flex:none}',
    '.an-av img{width:34px!important;height:34px!important;object-fit:cover;display:block}',
    '.an-name{max-width:110px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-family:"Inter",system-ui,-apple-system,sans-serif;font-weight:700;font-size:.9rem;line-height:1.2}',
    '.an-menu{position:absolute;right:0;top:calc(100% + 10px);min-width:230px;background:#fff;border:1.5px solid var(--line,#e3e9f3);border-radius:16px;box-shadow:0 20px 44px rgba(11,43,82,.18);padding:14px;z-index:120;display:none;text-align:left}',
    '.an-menu.open{display:block}',
    '.an-info{padding:4px 6px 12px;border-bottom:1px solid var(--line,#e3e9f3);margin-bottom:10px}',
    '.an-info b{display:block;color:var(--navy,#0b2b52);font-family:"Inter",system-ui,-apple-system,sans-serif;font-size:.95rem;font-weight:700;line-height:1.3;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    '.an-info span{display:block;color:var(--muted,#5d708c);font-family:"Inter",system-ui,-apple-system,sans-serif;font-size:.8rem;line-height:1.3;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-top:2px}',
    '.an-menu-link{display:flex;align-items:center;gap:8px;padding:9px 12px;margin:8px 0 10px 0;background:#f0f7ff;border:1.2px solid #cfe2fe;border-radius:10px;color:var(--navy,#0b2b52);font-family:"Inter",sans-serif;font-weight:700;font-size:.86rem;text-decoration:none;transition:all .18s ease}',
    '.an-menu-link:hover{background:#e0effe;border-color:#93c5fd;color:var(--blue,#1565c9);transform:translateY(-1px)}',
    '.an-out{width:100%;padding:11px 14px;border:none;border-radius:10px;background:var(--red,#e0202d);color:#fff;font-family:"Inter",system-ui,-apple-system,sans-serif;font-weight:700;font-size:.9rem;line-height:1.2;cursor:pointer;transition:background .2s}',
    '.an-out:hover{background:var(--red-dark,#b5121d)}',
    '.an-side{display:grid;gap:12px}',
    '.an-side .an-row{display:flex;align-items:center;gap:12px}',
    '.an-side .an-info{border:none;padding:0;margin:0;min-width:0}',
    '@media(max-width:1120px){.an-btn{height:38px;padding:2px 12px 2px 2px;gap:8px;font-size:.86rem}.an-av{width:32px;height:32px;font-size:.86rem}.an-av img{width:32px!important;height:32px!important}.an-name{max-width:96px;font-size:.86rem}}',
    '@media(max-width:600px){.an-name{display:none}.an-btn{padding:3px}}'
  ].join('');

  var globalBound = false;
  var authFetchStarted = false;
  var activeUser = null;

  function addStyle() {
    if (document.getElementById('an-style')) return;
    var s = document.createElement('style');
    s.id = 'an-style';
    s.textContent = css;
    (document.head || document.documentElement).appendChild(s);
  }

  // Inject styles immediately in <head> before first paint
  addStyle();

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function getCachedUser() {
    try {
      var u = JSON.parse(localStorage.getItem('user') || 'null');
      if (u && (u.name || u.email)) return u;
    } catch (e) {}
    return null;
  }

  function userSig(u) {
    if (!u) return '';
    return [u.name || '', u.email || '', u.avatar || ''].join('|');
  }

  function avatarHtml(u) {
    if (u.avatar) {
      return '<img src="' + esc(u.avatar) + '" width="34" height="34" decoding="sync" alt="" referrerpolicy="no-referrer">';
    }
    var n = (u.name || u.email || '?').trim();
    return esc(n.charAt(0).toUpperCase());
  }

  function firstName(u) {
    return (u.name || u.email || 'Account').trim().split(/\s+/)[0];
  }

  function logout() {
    fetch('/logout', { method: 'POST', credentials: 'same-origin' })
      .catch(function () {})
      .then(function () {
        try {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        } catch (e) {}
        window.location.href = '/';
      });
  }

  function render(user) {
    if (!user) return;
    activeUser = user;
    addStyle();

    var sig = userSig(user);
    var navBoxes = document.querySelectorAll('.nav-actions');
    var sbBoxes = document.querySelectorAll('.sb-actions');

    // Desktop navbar (idempotent: skip if already rendered with identical user signature)
    navBoxes.forEach(function (box) {
      if (box.getAttribute('data-an-sig') === sig && box.querySelector('.an-wrap')) return;
      box.setAttribute('data-an-sig', sig);
      box.innerHTML =
        '<div class="an-wrap">' +
        '<button type="button" class="an-btn" aria-haspopup="true" aria-expanded="false">' +
        '<span class="an-av">' + avatarHtml(user) + '</span>' +
        '<span class="an-name">' + esc(firstName(user)) + '</span></button>' +
        '<div class="an-menu" role="menu">' +
        '<div class="an-info"><b>' + esc(user.name || 'My account') + '</b><span>' + esc(user.email || '') + '</span></div>' +
        '<a href="/dashboard" class="an-menu-link">' +
        '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1565c9" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>' +
        '<span>My Progress Dashboard</span></a>' +
        '<button type="button" class="an-out">Log out</button>' +
        '</div></div>';

      var btn = box.querySelector('.an-btn');
      var menu = box.querySelector('.an-menu');
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var open = menu.classList.toggle('open');
        btn.setAttribute('aria-expanded', String(open));
      });
      menu.addEventListener('click', function (e) { e.stopPropagation(); });
      box.querySelector('.an-out').addEventListener('click', logout);
    });

    // Mobile sidebar (idempotent)
    sbBoxes.forEach(function (box) {
      if (box.getAttribute('data-an-sig') === sig && box.querySelector('.an-side')) return;
      box.setAttribute('data-an-sig', sig);
      box.innerHTML =
        '<div class="an-side">' +
        '<div class="an-row"><span class="an-av">' + avatarHtml(user) + '</span>' +
        '<div class="an-info"><b>' + esc(user.name || 'My account') + '</b><span>' + esc(user.email || '') + '</span></div></div>' +
        '<a href="/dashboard" class="an-menu-link">' +
        '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1565c9" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>' +
        '<span>My Progress Dashboard</span></a>' +
        '<button type="button" class="an-out">Log out</button></div>';
      box.querySelector('.an-out').addEventListener('click', logout);
    });

    if (navBoxes.length > 0) {
      document.documentElement.classList.remove('an-cached-auth');
    }

    if (!globalBound) {
      globalBound = true;
      document.addEventListener('click', function () {
        document.querySelectorAll('.an-menu.open').forEach(function (m) { m.classList.remove('open'); });
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
          document.querySelectorAll('.an-menu.open').forEach(function (m) { m.classList.remove('open'); });
        }
      });
    }
  }

  // 1) Pre-first-paint synchronous rendering when cached user exists in localStorage
  var initialCached = getCachedUser();
  if (initialCached) {
    activeUser = initialCached;
    document.documentElement.classList.add('an-cached-auth');

    if (document.readyState === 'loading' && typeof MutationObserver !== 'undefined') {
      var mo = new MutationObserver(function () {
        var hdActions = document.querySelector('#hd .nav-actions');
        var sbActions = document.querySelector('#sb .sb-actions');
        if (hdActions && hdActions.children.length > 0) {
          render(activeUser);
        }
        if (hdActions && sbActions && sbActions.querySelector('.an-side')) {
          mo.disconnect();
        }
      });
      mo.observe(document.documentElement, { childList: true, subtree: true });
      document.addEventListener('DOMContentLoaded', function () {
        mo.disconnect();
        document.documentElement.classList.remove('an-cached-auth');
      }, { once: true });
    }
  }

  function verifySession() {
    if (authFetchStarted) return;
    authFetchStarted = true;

    fetch('/auth/me', { credentials: 'same-origin' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        if (data && data.user) {
          try { localStorage.setItem('user', JSON.stringify(data.user)); } catch (e) {}
          render(data.user);
        } else if (activeUser) {
          // Session expired on server; clear stale cache cleanly
          activeUser = null;
          try {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
          } catch (e) {}
          window.location.reload();
        }
      })
      .catch(function () {});
  }

  function start() {
    var u = activeUser || getCachedUser();
    if (u) render(u);
    document.documentElement.classList.remove('an-cached-auth');
    verifySession();
  }

  // Expose hook so shared-layout.js can re-apply auth UI if #hd / #sb is ever replaced
  window.initAuthNav = start;

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
