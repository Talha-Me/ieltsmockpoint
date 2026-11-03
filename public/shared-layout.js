/**
 * Shared Layout Manager - IELTS Mockpoint
 * Zero-flicker, pre-paint synchronized shared navbar, dropdown menus, mobile sidebar, and footer across all pages.
 */
(function () {
  if (window.__sharedLayoutLoaded) return;
  window.__sharedLayoutLoaded = true;

  var NAV_CACHE_KEY = 'mp_shared_nav_v10';
  
  function syncFooterPricingLinkShared() {
    fetch('/api/system-settings')
      .then(function(r) { return r.json(); })
      .then(function(d) {
        if (d && d.success && d.settings) {
          var isPhase3 = Number(d.settings.currentPhase) === 3;
          var els = document.querySelectorAll('.footer-pricing-link, #footer-pricing-link');
          els.forEach(function(el) {
            el.style.display = isPhase3 ? 'inline-flex' : 'none';
            if (isPhase3) el.style.alignItems = 'center';
          });
        }
      }).catch(function() {});
  }

  var FOOTER_CACHE_KEY = 'mp_shared_footer_v5';
  var globalListenersBound = false;

  var sharedCss = [
    'html{scrollbar-gutter:stable;max-width:100%;overflow-x:clip}',
    'body{max-width:100%;overflow-x:clip}',
    '#hd{position:sticky;top:env(safe-area-inset-top,0);z-index:150;background:rgba(255,255,255,.94);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border-bottom:1px solid var(--line,#e3e9f3);box-sizing:border-box;transition:box-shadow .25s}',
    '#hd.scrolled{box-shadow:0 6px 18px rgba(11,43,82,.08)}',
    '#hd nav.wrap{display:flex!important;align-items:center!important;justify-content:space-between!important;max-width:1140px!important;width:100%!important;margin:0 auto!important;padding:0 24px!important;height:74px!important;gap:16px!important;box-sizing:border-box!important}',
    '#hd .brand{display:flex;align-items:center;gap:10px;text-decoration:none;font-family:"Sora",system-ui,sans-serif;font-weight:800;font-size:1.3rem;line-height:1;color:var(--navy,#0b2b52);flex-shrink:0}',
    '#hd .brand img{height:46px!important;width:138px!important;aspect-ratio:3/1;display:block;object-fit:contain}',
    '#hd .brand .txt{display:none;align-items:center;gap:8px}',
    '#hd .nav-links{display:flex;align-items:center;gap:20px;margin:0;padding:0}',
    '#hd .nav-links>a,#hd .nav-links>.nav-dd>.nav-dd-trigger{display:inline-flex;align-items:center;gap:4px;font-family:"Inter",system-ui,-apple-system,sans-serif;font-size:.92rem;line-height:1.4;color:var(--muted,#5d708c);text-decoration:none;font-weight:500;position:relative;padding:4px 0;margin:0;white-space:nowrap;transition:color .2s}',
    '#hd .nav-links>a::after,#hd .nav-links>.nav-dd>.nav-dd-trigger::after{content:"";position:absolute;left:0;bottom:-2px;width:0;height:2px;background:var(--red,#e0202d);transition:width .2s}',
    '#hd .nav-links>a:hover,#hd .nav-links>a.current,#hd .nav-links>a.cur,#hd .nav-links>.nav-dd>.nav-dd-trigger:hover,#hd .nav-links>.nav-dd>.nav-dd-trigger.current,#hd .nav-links>.nav-dd>.nav-dd-trigger.cur,#hd .nav-links>.nav-dd:not(.dd-closed):hover>.nav-dd-trigger,#hd .nav-links>.nav-dd:not(.dd-closed):focus-within>.nav-dd-trigger{color:var(--navy,#0b2b52);font-weight:500;text-shadow:0 0 .35px currentColor}',
    '#hd .nav-links>a:hover::after,#hd .nav-links>a.current::after,#hd .nav-links>a.cur::after,#hd .nav-links>.nav-dd>.nav-dd-trigger:hover::after,#hd .nav-links>.nav-dd>.nav-dd-trigger.current::after,#hd .nav-links>.nav-dd>.nav-dd-trigger.cur::after,#hd .nav-links>.nav-dd:not(.dd-closed):hover>.nav-dd-trigger::after,#hd .nav-links>.nav-dd:not(.dd-closed):focus-within>.nav-dd-trigger::after{width:100%}',
    '#hd .nav-dd{position:relative;display:inline-flex;align-items:center}',
    '#hd .nav-caret{width:12px;height:12px;flex-shrink:0;opacity:.72;margin-top:1px;transition:transform .2s ease,opacity .2s ease,color .2s ease}',
    '#hd .nav-dd:not(.dd-closed):hover>.nav-dd-trigger .nav-caret,#hd .nav-dd:not(.dd-closed):focus-within>.nav-dd-trigger .nav-caret{transform:rotate(180deg);opacity:1;color:var(--red,#e0202d)}',
    '#hd .nav-dd-menu{position:absolute;top:100%;left:-12px;padding-top:12px;min-width:214px;z-index:160;opacity:0;visibility:hidden;pointer-events:none;transform:translateY(8px);transition:opacity .18s ease,transform .18s cubic-bezier(.2,.8,.2,1),visibility .18s}',
    '#hd .nav-dd:not(.dd-closed):hover>.nav-dd-menu,#hd .nav-dd:not(.dd-closed):focus-within>.nav-dd-menu{opacity:1;visibility:visible;pointer-events:auto;transform:translateY(0)}',
    '#hd .nav-dd-card{background:#fff;border:1px solid var(--line,#e3e9f3);border-radius:14px;padding:7px;box-shadow:0 18px 42px rgba(11,43,82,.14),0 4px 12px rgba(11,43,82,.06);display:flex;flex-direction:column;gap:2px;position:relative}',
    '#hd .nav-dd-card::before{content:"";position:absolute;top:-6px;left:26px;width:10px;height:10px;background:#fff;border-top:1px solid var(--line,#e3e9f3);border-left:1px solid var(--line,#e3e9f3);transform:rotate(45deg)}',
    '#hd .nav-links>.nav-dd:last-child>.nav-dd-menu{left:auto;right:-12px}',
    '#hd .nav-links>.nav-dd:last-child .nav-dd-card::before{left:auto;right:24px}',
    '#hd .nav-links .nav-dd-menu a.nav-dd-item{display:flex!important;align-items:center;gap:10px;padding:9px 11px!important;border-radius:9px;font-family:"Inter",system-ui,-apple-system,sans-serif;font-size:.875rem!important;font-weight:600!important;line-height:1.35!important;color:var(--navy,#0b2b52)!important;text-decoration:none!important;text-shadow:none!important;white-space:nowrap;position:relative;transition:background .16s ease,color .16s ease}',
    '#hd .nav-links .nav-dd-menu a.nav-dd-item::after{content:none!important;display:none!important;width:0!important}',
    '#hd .nav-links .nav-dd-menu a.nav-dd-item:hover,#hd .nav-links .nav-dd-menu a.nav-dd-item:focus-visible,#hd .nav-links .nav-dd-menu a.nav-dd-item.sub-current{background:var(--blue-light,#eaf2fd)!important;color:var(--blue,#1565c9)!important}',
    '#hd .nav-dd-ico{width:28px;height:28px;border-radius:8px;background:#f4f7fb;color:var(--blue,#1565c9);display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;transition:background .16s ease,color .16s ease,transform .16s ease}',
    '#hd .nav-dd-ico.ico-gold{background:#fff6e5;color:#d97706}',
    '#hd .nav-links .nav-dd-menu a.nav-dd-item:hover .nav-dd-ico:not(.ico-gold),#hd .nav-links .nav-dd-menu a.nav-dd-item.sub-current .nav-dd-ico:not(.ico-gold){background:#d8e8fc;color:var(--blue,#1565c9);transform:scale(1.05)}',
    '#hd .nav-links .nav-dd-menu a.nav-dd-item:hover .nav-dd-ico.ico-gold{background:#fde8be;color:#b45309;transform:scale(1.05)}',
    '#hd .nav-actions{display:flex;gap:12px;align-items:center;justify-content:flex-end;min-width:221px;flex-shrink:0}',
    '#hd .nav-actions .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:11px 22px;border-radius:9px;font-family:"Inter",system-ui,-apple-system,sans-serif;font-size:.92rem;font-weight:700;line-height:1.2;text-decoration:none;border-width:1.5px;border-style:solid;white-space:nowrap;box-sizing:border-box;cursor:pointer}',
    '#hd .nav-actions .btn-outline{color:var(--navy,#0b2b52);border-color:var(--line,#e3e9f3);background:#fff}',
    '#hd .nav-actions .btn-outline:hover{border-color:var(--blue,#1565c9);color:var(--blue,#1565c9)}',
    '#hd .nav-actions .btn-red{background:var(--red,#e0202d);border-color:transparent;color:#fff}',
    '#hd .nav-actions .btn-red:hover{background:var(--red-dark,#b5121d)}',
    '#hd .menu-btn{display:none;align-items:center;justify-content:center;background:var(--blue-light,#eaf2fd);border:none;color:var(--navy,#0b2b52);width:42px;height:42px;border-radius:10px;cursor:pointer;flex-shrink:0;transition:background .2s,color .2s}',
    '#hd .menu-btn:hover{background:#dce9fb}',
    '@media(max-width:1150px){#hd .nav-links{gap:13px}#hd .nav-links>a,#hd .nav-links>.nav-dd>.nav-dd-trigger{font-size:.865rem}#hd .nav-actions{gap:8px;min-width:182px}#hd .nav-actions .btn{padding:9px 15px;font-size:.875rem}}',
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
    '#sb .sb-links>a{display:flex;align-items:center;justify-content:space-between;padding:13px 6px;border-bottom:1px solid var(--line,#e3e9f3);text-decoration:none;font-weight:600;font-size:.95rem;color:var(--navy,#0b2b52);transition:padding .2s,color .2s}',
    '#sb .sb-links>a:hover,#sb .sb-links>a.current{color:var(--red,#e0202d);padding-left:12px}',
    '#sb .sb-dd{border-bottom:1px solid var(--line,#e3e9f3)}',
    '#sb .sb-dd-head{display:flex;align-items:center;justify-content:space-between;gap:8px}',
    '#sb .sb-links .sb-dd-head a.sb-dd-link{flex:1;display:flex;align-items:center;padding:13px 6px!important;border-bottom:none!important;text-decoration:none;font-weight:600;font-size:.95rem;color:var(--navy,#0b2b52);transition:padding .2s,color .2s}',
    '#sb .sb-links .sb-dd-head a.sb-dd-link:hover,#sb .sb-links .sb-dd-head a.sb-dd-link.current{color:var(--red,#e0202d);padding-left:12px!important}',
    '#sb .sb-dd-btn{width:34px;height:34px;border-radius:8px;border:none;background:var(--surface,#f4f7fb);color:var(--navy,#0b2b52);display:inline-flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;transition:background .2s,color .2s}',
    '#sb .sb-dd-btn:hover,#sb .sb-dd.open .sb-dd-btn{background:var(--blue-light,#eaf2fd);color:var(--blue,#1565c9)}',
    '#sb .sb-dd-btn svg{transition:transform .22s ease}',
    '#sb .sb-dd.open .sb-dd-btn svg{transform:rotate(180deg)}',
    '#sb .sb-dd-sub{display:none;flex-direction:column;gap:2px;padding:0 0 10px 8px}',
    '#sb .sb-dd.open .sb-dd-sub{display:flex}',
    '#sb .sb-links .sb-dd-sub a{display:flex;align-items:center;justify-content:flex-start;padding:9px 12px!important;border-bottom:none!important;border-radius:8px;text-decoration:none;font-weight:500!important;font-size:.88rem!important;color:var(--muted,#5d708c)!important;transition:background .16s,color .16s,padding .16s}',
    '#sb .sb-links .sb-dd-sub a:hover,#sb .sb-links .sb-dd-sub a.sub-current{background:var(--blue-light,#eaf2fd);color:var(--blue,#1565c9)!important;padding-left:16px!important}',
    '#sb .sb-actions{margin-top:auto;display:grid;gap:10px;flex-shrink:0}',
    'footer{border-top:1px solid var(--line,#e3e9f3);padding:56px 0 32px;background:var(--surface,#f4f7fb);position:relative;z-index:1}',
    'footer>.wrap{max-width:1140px!important;width:100%!important;margin:0 auto!important;padding:0 24px!important;box-sizing:border-box!important}',
    'footer .fgrid{display:grid;grid-template-columns:1.5fr 1fr 1fr 1fr 1.1fr;gap:32px;margin-bottom:36px}',
    'footer .fgrid h4{font-family:"Sora",system-ui,sans-serif;font-size:.88rem;color:var(--blue,#1565c9);margin-bottom:14px;font-weight:700;text-transform:uppercase;letter-spacing:.04em}',
    'footer .fgrid a:not(.brand){display:block;font-size:.9rem;color:var(--muted,#5d708c);text-decoration:none;margin-bottom:10px;transition:color .15s ease}',
    'footer .fgrid a:not(.brand):hover{color:var(--red,#e0202d)}',
    '@media(max-width:992px){footer .fgrid{grid-template-columns:1fr 1fr 1fr;gap:28px}}',
    '@media(max-width:640px){footer .fgrid{grid-template-columns:1fr 1fr;gap:24px}footer .fgrid>div:first-child{grid-column:1/-1;margin-bottom:8px}}',
    '@media(max-width:420px){footer>.wrap{padding:0 16px!important}}'
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
    var rawPath = window.location.pathname.toLowerCase().replace(/\.html$/, '').replace(/\/$/, '');
    if (!rawPath) rawPath = '/home';

    var navAliases = {
      '/reading-exercises': '/cambridge-reading',
      '/listening-exercises': '/cambridge-listening',
      '/reading-practice': '/cambridge-reading',
      '/listening-practice': '/cambridge-listening',
      '/writing-practice': '/cambridge-writing'
    };
    if (navAliases[rawPath]) {
      return navAliases[rawPath];
    }
    if (rawPath.indexOf('/blog/') === 0) {
      return '/blog';
    }
    if (rawPath.indexOf('/learn/') === 0) {
      return '/learn';
    }
    return rawPath;
  }

  function highlightActiveLinks(root) {
    var currentPath = resolveCurrentPath();
    var exactPath = window.location.pathname.toLowerCase().replace(/\.html$/, '').replace(/\/$/, '') || '/home';
    var exactSearch = (window.location.search || '').toLowerCase();
    var exactHash = (window.location.hash || '').toLowerCase();
    var scope = root || document;

    var topLinks = scope.querySelectorAll(
      '.nav-links > a, .nav-links > .nav-dd > .nav-dd-trigger, .sb-links > a, .sb-links > .sb-dd > .sb-dd-head > .sb-dd-link'
    );
    topLinks.forEach(function (link) {
      link.classList.remove('current', 'cur');
      var href = link.getAttribute('href');
      if (!href) return;
      var linkPath = href.split('#')[0].split('?')[0].toLowerCase().replace(/\.html$/, '').replace(/\/$/, '');
      if (linkPath === currentPath || (currentPath === '/home' && (linkPath === '' || linkPath === '/' || linkPath === '/home'))) {
        link.classList.add('current', 'cur');
      }
    });

    var subLinks = scope.querySelectorAll('.nav-dd-menu a, .sb-dd-sub a');
    subLinks.forEach(function (sub) {
      sub.classList.remove('sub-current', 'current', 'cur');
      var href = sub.getAttribute('href');
      if (!href) return;
      var noHash = href.split('#')[0];
      var linkHash = href.indexOf('#') !== -1 ? '#' + href.split('#')[1].toLowerCase() : '';
      var linkSearch = noHash.indexOf('?') !== -1 ? '?' + noHash.split('?')[1].toLowerCase() : '';
      var linkPath = noHash.split('?')[0].toLowerCase().replace(/\.html$/, '').replace(/\/$/, '');

      var matched = false;
      if (linkPath === exactPath) {
        if (linkSearch) {
          matched = exactSearch === linkSearch;
        } else if (linkHash) {
          matched = exactHash === linkHash;
        } else if (!exactHash && !exactSearch && (exactPath === '/listening-exercises' || exactPath === '/reading-exercises')) {
          matched = true;
        }
      }
      if (matched) {
        sub.classList.add('sub-current');
      }
    });
  }

  // Compute canonical structure signature ignoring runtime classes (.current/.scrolled) & logged-in .nav-actions
  function getHeaderSignature(hd) {
    if (!hd) return '';
    var clone = hd.cloneNode(true);
    clone.classList.remove('scrolled');
    clone.querySelectorAll('.current, .cur, .sub-current, .dd-closed').forEach(function (el) {
      el.classList.remove('current', 'cur', 'sub-current', 'dd-closed');
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
    clone.querySelectorAll('.current, .cur, .sub-current, .open').forEach(function (el) {
      el.classList.remove('current', 'cur', 'sub-current', 'open');
      if (!el.className) el.removeAttribute('class');
    });
    clone.querySelectorAll('.sb-dd-btn').forEach(function (btn) {
      btn.setAttribute('aria-expanded', 'false');
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

      hd.querySelectorAll('.nav-dd').forEach(function (dd) {
        dd.onmouseleave = function () {
          dd.classList.remove('dd-closed');
        };
        dd.querySelectorAll('.nav-dd-menu a').forEach(function (item) {
          item.onclick = function () {
            dd.classList.add('dd-closed');
            if (typeof item.blur === 'function') item.blur();
            setTimeout(function () { highlightActiveLinks(); }, 30);
          };
        });
      });
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
      sb.querySelectorAll('.sb-dd-btn').forEach(function (btn) {
        btn.onclick = function (e) {
          e.preventDefault();
          e.stopPropagation();
          var group = btn.closest('.sb-dd');
          if (!group) return;
          var willOpen = !group.classList.contains('open');
          group.classList.toggle('open', willOpen);
          btn.setAttribute('aria-expanded', String(willOpen));
        };
      });

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

      window.addEventListener('hashchange', function () {
        highlightActiveLinks();
      });

      window.addEventListener('popstate', function () {
        highlightActiveLinks();
      });

      window.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
          setMenu(false);
          var active = document.activeElement;
          if (active && active.closest && active.closest('.nav-dd')) {
            var parentDd = active.closest('.nav-dd');
            parentDd.classList.add('dd-closed');
            if (typeof active.blur === 'function') active.blur();
          }
        }
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
        syncFooterPricingLinkShared();
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
