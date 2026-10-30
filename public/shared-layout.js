/**
 * Shared Layout Manager - IELTS Mockpoint
 * Zero-flicker, pre-paint synchronized shared navbar, mobile sidebar, and footer across all pages.
 */
(function () {
  if (window.__sharedLayoutLoaded) return;
  window.__sharedLayoutLoaded = true;

  var NAV_CACHE_KEY = 'mp_shared_nav_v3';
  var FOOTER_CACHE_KEY = 'mp_shared_footer_v3';
  var globalListenersBound = false;

  var sharedCss = [
    'html{scrollbar-gutter:stable;max-width:100%;overflow-x:clip}',
    'body{max-width:100%;overflow-x:clip}',
    '#hd{position:sticky;top:env(safe-area-inset-top,0);z-index:50;background:rgba(255,255,255,.94);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border-bottom:1px solid var(--line,#e3e9f3);box-sizing:border-box;transition:box-shadow .25s}',
    '#hd.scrolled{box-shadow:0 6px 18px rgba(11,43,82,.08)}',
    '#hd nav.wrap{display:flex!important;align-items:center!important;justify-content:space-between!important;max-width:1140px!important;width:100%!important;margin:0 auto!important;padding:0 24px!important;height:74px!important;gap:16px!important;box-sizing:border-box!important}',
    '#hd .brand{display:flex;align-items:center;gap:10px;text-decoration:none;font-family:"Sora",system-ui,sans-serif;font-weight:800;font-size:1.3rem;line-height:1;color:var(--navy,#0b2b52);flex-shrink:0}',
    '#hd .brand img{height:46px!important;width:138px!important;aspect-ratio:3/1;display:block;object-fit:contain}',
    '#hd .brand .txt{display:none;align-items:center;gap:8px}',
    '#hd .nav-links{display:flex;align-items:center;gap:24px;margin:0;padding:0}',
    '#hd .nav-links a{font-family:"Inter",system-ui,-apple-system,sans-serif;font-size:.92rem;line-height:1.4;color:var(--muted,#5d708c);text-decoration:none;font-weight:500;position:relative;padding:4px 0;margin:0;white-space:nowrap;transition:color .2s}',
    '#hd .nav-links a::after{content:"";position:absolute;left:0;bottom:-2px;width:0;height:2px;background:var(--red,#e0202d);transition:width .2s}',
    '#hd .nav-links a:hover,#hd .nav-links a.current,#hd .nav-links a.cur{color:var(--navy,#0b2b52);font-weight:500;text-shadow:0 0 .35px currentColor}',
    '#hd .nav-links a:hover::after,#hd .nav-links a.current::after,#hd .nav-links a.cur::after{width:100%}',
    '#hd .nav-actions{display:flex;gap:12px;align-items:center;flex-shrink:0}',
    '#hd .nav-actions .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:11px 22px;border-radius:9px;font-family:"Inter",system-ui,-apple-system,sans-serif;font-size:.92rem;font-weight:700;line-height:1.2;text-decoration:none;border-width:1.5px;border-style:solid;white-space:nowrap;box-sizing:border-box;cursor:pointer}',
    '#hd .nav-actions .btn-outline{color:var(--navy,#0b2b52);border-color:var(--line,#e3e9f3);background:#fff}',
    '#hd .nav-actions .btn-outline:hover{border-color:var(--blue,#1565c9);color:var(--blue,#1565c9)}',
    '#hd .nav-actions .btn-red{background:var(--red,#e0202d);border-color:transparent;color:#fff}',
    '#hd .nav-actions .btn-red:hover{background:var(--red-dark,#b5121d)}',
    '#hd .menu-btn{display:none;align-items:center;justify-content:center;background:var(--blue-light,#eaf2fd);border:none;color:var(--navy,#0b2b52);width:42px;height:42px;border-radius:10px;cursor:pointer;flex-shrink:0;transition:background .2s,color .2s}',
    '#hd .menu-btn:hover{background:#dce9fb}',
    '@media(max-width:1120px){#hd .nav-links{gap:15px}#hd .nav-links a{font-size:.875rem}#hd .nav-actions{gap:8px}#hd .nav-actions .btn{padding:9px 15px;font-size:.875rem}}',
    '@media(max-width:992px){#hd .nav-links,#hd .nav-actions{display:none!important}#hd .menu-btn{display:inline-flex!important}}',
    '@media(max-width:480px){#hd nav.wrap{padding-left:16px!important;padding-right:16px!important}#hd .brand img{height:38px!important;width:114px!important}}',
    '#ov.overlay{position:fixed;inset:0;background:rgba(11,43,82,.55);backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px);z-index:990;opacity:0;pointer-events:none;transition:opacity .3s}',
    '#ov.overlay.open{opacity:1;pointer-events:auto}',
    '#sb.sidebar{position:fixed;top:0;right:0;height:100%;height:100dvh;width:min(320px,86vw);background:#fff;z-index:1000;transform:translateX(100%);transition:transform .35s cubic-bezier(.4,0,.2,1);display:flex;flex-direction:column;padding:20px 22px calc(22px + env(safe-area-inset-bottom,0));box-shadow:-12px 0 40px rgba(11,43,82,.18);box-sizing:border-box}',
    '#sb.sidebar.open{transform:none}',
    '#sb .sb-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;padding-top:env(safe-area-inset-top,0);flex-shrink:0}',
    '#sb .sb-close{display:inline-flex;align-items:center;justify-content:center;background:var(--surface,#f4f7fb);border:none;width:38px;height:38px;border-radius:50%;cursor:pointer;color:var(--navy,#0b2b52);transition:background .2s,color .2s}',
    '#sb .sb-close:hover{background:#e6edf7;color:var(--red,#e0202d)}',
    '#sb .sb-links{flex:1;min-height:0;overflow-y:auto;margin-bottom:16px}',
    '#sb .sb-links a{display:flex;align-items:center;justify-content:space-between;padding:13px 6px;border-bottom:1px solid var(--line,#e3e9f3);text-decoration:none;font-weight:600;font-size:.95rem;color:var(--navy,#0b2b52);transition:padding .2s,color .2s}',
    '#sb .sb-links a:hover,#sb .sb-links a.current{color:var(--red,#e0202d);padding-left:12px}',
    '#sb .sb-actions{margin-top:auto;display:grid;gap:10px;flex-shrink:0}'
  ].join('\n');

  function ensureSharedStyles() {
    if (document.getElementById('mp-shared-nav-css')) return;
    var style = document.createElement('style');
    style.id = 'mp-shared-nav-css';
    style.textContent = sharedCss;
    (document.head || document.documentElement).appendChild(style);
  }

  // Inject CSS immediately (runs in <head> before first paint)
  ensureSharedStyles();

  function setMenu(open) {
    var sb = document.getElementById('sb');
    var ov = document.getElementById('ov');
    if (!sb || !ov) return;
    sb.classList.toggle('open', open);
    ov.classList.toggle('open', open);
    sb.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = open ? 'hidden' : '';
  }

  function resolveCurrentPath() {
    var currentPath = window.location.pathname.toLowerCase().replace(/\.html$/, '').replace(/\/$/, '');
    if (!currentPath) currentPath = '/home';

    var navAliases = {
      '/reading-exercises': '/practice-hub',
      '/listening-exercises': '/practice-hub',
      '/writing-practice': '/practice-hub',
      '/reading-practice': '/practice-hub',
      '/listening-practice': '/practice-hub'
    };
    if (navAliases[currentPath]) {
      currentPath = navAliases[currentPath];
    } else if (currentPath.indexOf('/blog/') === 0) {
      currentPath = '/blog';
    } else if (currentPath.indexOf('/learn/') === 0) {
      currentPath = '/learn';
    }
    return currentPath;
  }

  function highlightActiveLinks(root) {
    var currentPath = resolveCurrentPath();
    var scope = root || document;
    var navLinks = scope.querySelectorAll('.nav-links a, .sb-links a');
    navLinks.forEach(function (link) {
      link.classList.remove('current', 'cur');
      var href = link.getAttribute('href');
      if (!href) return;
      var linkPath = href.toLowerCase().replace(/\.html$/, '').replace(/\/$/, '');
      if (linkPath === currentPath || (currentPath === '/home' && (linkPath === '' || linkPath === '/' || linkPath === '/home'))) {
        link.classList.add('current', 'cur');
      }
    });
  }

  // Compute canonical structure signature ignoring runtime classes (.current/.scrolled) & logged-in .nav-actions
  function getHeaderSignature(hd) {
    if (!hd) return '';
    var clone = hd.cloneNode(true);
    clone.classList.remove('scrolled');
    clone.querySelectorAll('.current, .cur').forEach(function (el) {
      el.classList.remove('current', 'cur');
      if (!el.className) el.removeAttribute('class');
    });
    var actions = clone.querySelector('.nav-actions');
    if (actions) actions.innerHTML = '';
    return clone.innerHTML.replace(/\s+/g, ' ').trim();
  }

  function getSidebarSignature(sb) {
    if (!sb) return '';
    var clone = sb.cloneNode(true);
    clone.classList.remove('open');
    clone.querySelectorAll('.current, .cur').forEach(function (el) {
      el.classList.remove('current', 'cur');
      if (!el.className) el.removeAttribute('class');
    });
    var actions = clone.querySelector('.sb-actions');
    if (actions) actions.innerHTML = '';
    return clone.innerHTML.replace(/\s+/g, ' ').trim();
  }

  function applyNavbarHtml(navHtml) {
    if (!navHtml) return false;
    var existingHd = document.getElementById('hd');
    var existingSb = document.getElementById('sb');
    var existingOv = document.getElementById('ov');
    if (!existingHd) return false;

    var temp = document.createElement('div');
    temp.innerHTML = navHtml;

    var newHd = temp.querySelector('#hd');
    var newSb = temp.querySelector('#sb');
    var newOv = temp.querySelector('#ov');

    var changed = false;

    if (newHd && getHeaderSignature(existingHd) !== getHeaderSignature(newHd)) {
      highlightActiveLinks(newHd);
      existingHd.replaceWith(newHd);
      changed = true;
    } else {
      highlightActiveLinks(existingHd);
    }

    if (newSb) {
      if (!existingSb) {
        var anchorHd = document.getElementById('hd');
        if (anchorHd && anchorHd.parentNode) {
          highlightActiveLinks(newSb);
          anchorHd.insertAdjacentElement('afterend', newSb);
          changed = true;
        }
      } else if (getSidebarSignature(existingSb) !== getSidebarSignature(newSb)) {
        highlightActiveLinks(newSb);
        existingSb.replaceWith(newSb);
        changed = true;
      } else {
        highlightActiveLinks(existingSb);
      }
    }

    if (newOv && !existingOv) {
      var anchorSb = document.getElementById('sb') || document.getElementById('hd');
      if (anchorSb && anchorSb.parentNode) {
        anchorSb.insertAdjacentElement('afterend', newOv);
        changed = true;
      }
    }

    bindNavControls(changed);
    return changed;
  }

  function bindNavControls(reInitAuth) {
    ensureSharedStyles();

    var hd = document.getElementById('hd');
    var sb = document.getElementById('sb');
    var ov = document.getElementById('ov');
    var openBtn = document.getElementById('openMenu');
    var closeBtn = document.getElementById('closeMenu');

    if (hd) {
      hd.classList.toggle('scrolled', window.scrollY > 10);
    }

    if (openBtn) {
      openBtn.onclick = function (e) {
        e.preventDefault();
        setMenu(true);
      };
    }
    if (closeBtn) {
      closeBtn.onclick = function (e) {
        e.preventDefault();
        setMenu(false);
      };
    }
    if (ov) {
      ov.onclick = function () {
        setMenu(false);
      };
    }

    if (sb) {
      sb.querySelectorAll('a').forEach(function (a) {
        a.onclick = function () {
          setMenu(false);
        };
      });
    }

    if (!globalListenersBound) {
      globalListenersBound = true;

      window.addEventListener('scroll', function () {
        var curHd = document.getElementById('hd');
        if (curHd) curHd.classList.toggle('scrolled', window.scrollY > 10);
      }, { passive: true });

      window.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') setMenu(false);
      });

      if (window.matchMedia) {
        var mq = window.matchMedia('(min-width: 993px)');
        var onMq = function (e) {
          if (e.matches) setMenu(false);
        };
        if (mq.addEventListener) mq.addEventListener('change', onMq);
        else if (mq.addListener) mq.addListener(onMq);
      }
    }

    highlightActiveLinks();

    if (reInitAuth && window.initAuthNav && typeof window.initAuthNav === 'function') {
      window.initAuthNav();
    }
  }

  // Pre-first-paint synchronous upgrade as soon as #hd enters the DOM while parsing
  var prePainted = false;
  function tryImmediateSync() {
    if (prePainted) return;
    var hd = document.getElementById('hd');
    if (!hd || !hd.querySelector('.nav-actions')) return;
    prePainted = true;
    try {
      var cachedNav = sessionStorage.getItem(NAV_CACHE_KEY);
      if (cachedNav) {
        applyNavbarHtml(cachedNav);
        return;
      }
    } catch (e) {}
    highlightActiveLinks(hd);
  }

  if (document.readyState === 'loading' && typeof MutationObserver !== 'undefined') {
    var mo = new MutationObserver(function () {
      tryImmediateSync();
      if (prePainted) mo.disconnect();
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });
    document.addEventListener('DOMContentLoaded', function () {
      mo.disconnect();
    }, { once: true });
  }

  function applyFooterHtml(footerHtml) {
    if (!footerHtml) return;
    var existingFooter = document.querySelector('footer');
    if (!existingFooter) return;
    var temp = document.createElement('div');
    temp.innerHTML = footerHtml;
    var newFooter = temp.querySelector('footer');
    if (!newFooter) return;
    var a = existingFooter.innerHTML.replace(/\s+/g, ' ').trim();
    var b = newFooter.innerHTML.replace(/\s+/g, ' ').trim();
    if (a !== b) {
      existingFooter.replaceWith(newFooter);
    }
  }

  function loadPartials() {
    ensureSharedStyles();

    // Apply cached partials synchronously if not already applied
    try {
      var cachedNav = sessionStorage.getItem(NAV_CACHE_KEY);
      if (cachedNav) applyNavbarHtml(cachedNav);
      else bindNavControls(false);

      var cachedFooter = sessionStorage.getItem(FOOTER_CACHE_KEY);
      if (cachedFooter) applyFooterHtml(cachedFooter);
    } catch (e) {
      bindNavControls(false);
    }

    // Revalidate /navbar in background — only touches DOM if navbar.html actually changed!
    fetch('/navbar')
      .then(function (r) {
        if (!r.ok) throw new Error('Navbar failed: ' + r.status);
        return r.text();
      })
      .then(function (navHtml) {
        try { sessionStorage.setItem(NAV_CACHE_KEY, navHtml); } catch (e) {}
        applyNavbarHtml(navHtml);
      })
      .catch(function (err) {
        console.warn('Shared navbar loader fallback:', err);
        bindNavControls(false);
      });

    // Revalidate /footer in background — only touches DOM if footer.html actually changed!
    fetch('/footer')
      .then(function (r) {
        if (!r.ok) throw new Error('Footer failed: ' + r.status);
        return r.text();
      })
      .then(function (footerHtml) {
        try { sessionStorage.setItem(FOOTER_CACHE_KEY, footerHtml); } catch (e) {}
        applyFooterHtml(footerHtml);
      })
      .catch(function (err) {
        console.warn('Shared footer loader fallback:', err);
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadPartials);
  } else {
    loadPartials();
  }
})();
