/**
 * Shared Layout Manager - IELTS Mockpoint
 * Zero-flicker, pre-paint synchronized shared navbar, dropdown menus, mobile sidebar, and footer across all pages.
 */
(function () {
  if (window.__sharedLayoutLoaded) return;
  window.__sharedLayoutLoaded = true;

  var NAV_CACHE_KEY = 'mp_shared_nav_v12';
  
  function syncUserSessionFromServer() {
    fetch('/auth/me', { credentials: 'same-origin' })
      .then(function(r) {
        if (!r.ok) return null;
        return r.json();
      })
      .then(function(d) {
        if (d && d.success && d.user) {
          var nextStr = JSON.stringify(d.user);
          try {
            var prevStr = localStorage.getItem('user');
            if (prevStr !== nextStr) {
              localStorage.setItem('user', nextStr);
              window.dispatchEvent(new CustomEvent('mp:user-synced', { detail: d.user }));
            }
          } catch (e) {}
        }
      })
      .catch(function() {});
  }

  var mpSystemSettingsCache = null;

  function isGuestUserForReminder() {
    try {
      var u = JSON.parse(localStorage.getItem('user') || 'null');
      return !(u && (u.email || u.name));
    } catch (e) {
      return true;
    }
  }

  function isTargetTestOrPracticeHref(href) {
    if (!href) return false;
    try {
      var u = new URL(href, window.location.origin);
      if (u.origin !== window.location.origin) return false;
      var p = u.pathname;
      return (
        p.indexOf('/cambridge-listening-v2') === 0 ||
        p.indexOf('/cambridge-reading-v2') === 0 ||
        p.indexOf('/cambridge-reading-test') === 0 ||
        p.indexOf('/cambridge/writing/') === 0 ||
        p.indexOf('/cambridge-writing-test') === 0 ||
        p.indexOf('/speaking-test') === 0 ||
        p.indexOf('/listening-practice') === 0 ||
        p.indexOf('/reading-practice') === 0 ||
        p.indexOf('/writing-practice') === 0 ||
        p.indexOf('/passcodes') === 0 ||
        p.indexOf('/mock-test') === 0
      );
    } catch (e) {
      return false;
    }
  }

  function ensureLoginReminderModal() {
    if (document.getElementById('mp-login-reminder-modal')) return;
    if (!document.getElementById('mp-login-reminder-styles')) {
      var st = document.createElement('style');
      st.id = 'mp-login-reminder-styles';
      st.textContent = [
        '#mp-login-reminder-modal{position:fixed;inset:0;z-index:250000;display:none;align-items:center;justify-content:center;padding:18px;background:rgba(11,43,82,.56);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);opacity:0;transition:opacity .24s ease}',
        '#mp-login-reminder-modal.open{display:flex;opacity:1}',
        '#mp-login-reminder-modal .mp-lr-card{position:relative;width:100%;max-width:455px;background:#fff;border-radius:22px;padding:34px 28px 28px;text-align:center;border:1.5px solid #dbeafe;box-shadow:0 28px 65px rgba(11,43,82,.26);overflow:hidden;transform:translateY(16px) scale(.96);opacity:0;transition:transform .28s cubic-bezier(.16,1,.3,1),opacity .24s ease}',
        '#mp-login-reminder-modal.open .mp-lr-card{transform:translateY(0) scale(1);opacity:1}',
        '#mp-login-reminder-modal .mp-lr-top-bar{position:absolute;top:0;left:0;width:100%;height:4px;background:linear-gradient(90deg,#0b2b52 0%,#1565c9 52%,#e0202d 100%)}',
        '#mp-login-reminder-modal .mp-lr-close{position:absolute;top:14px;right:14px;width:34px;height:34px;border-radius:50%;border:1px solid #e2e8f0;background:#f8fafc;color:#0b2b52;font-size:19px;font-weight:700;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .18s ease}',
        '#mp-login-reminder-modal .mp-lr-close:hover{background:#fee2e2;color:#e0202d;border-color:#fecaca}',
        '#mp-login-reminder-modal .mp-lr-icon{width:60px;height:60px;border-radius:16px;margin:0 auto 14px;background:#eaf2fd;border:1.5px solid #cfe2fe;color:#1565c9;display:inline-flex;align-items:center;justify-content:center;box-shadow:0 8px 20px rgba(21,101,201,.12)}',
        '#mp-login-reminder-modal .mp-lr-badge{display:inline-block;font-family:"Inter",sans-serif;font-size:.72rem;font-weight:800;letter-spacing:.06em;text-transform:uppercase;padding:4px 12px;border-radius:999px;background:#eaf2fd;color:#1565c9;border:1px solid #cfe2fe;margin-bottom:10px}',
        '#mp-login-reminder-modal .mp-lr-title{font-family:"Sora",system-ui,sans-serif;font-size:1.32rem;font-weight:800;color:#0b2b52;margin:0 0 9px;line-height:1.28}',
        '#mp-login-reminder-modal .mp-lr-desc{font-family:"Inter",sans-serif;font-size:.9rem;color:#5d708c;line-height:1.6;margin:0 0 16px}',
        '#mp-login-reminder-modal .mp-lr-perks{display:flex;flex-wrap:wrap;justify-content:center;gap:7px;margin-bottom:22px}',
        '#mp-login-reminder-modal .mp-lr-perk{font-family:"Inter",sans-serif;font-size:.77rem;font-weight:700;color:#0b2b52;background:#f4f7fb;border:1px solid #e3e9f3;padding:5px 10px;border-radius:999px;display:inline-flex;align-items:center;gap:5px}',
        '#mp-login-reminder-modal .mp-lr-perk i{color:#16a34a;font-style:normal;font-weight:900}',
        '#mp-login-reminder-modal .mp-lr-actions{display:flex;flex-direction:column;gap:10px}',
        '#mp-login-reminder-modal .mp-lr-btn-primary{padding:13px 20px;border-radius:11px;background:#e0202d;color:#fff;text-decoration:none;font-family:"Sora",sans-serif;font-weight:700;font-size:.94rem;display:flex;align-items:center;justify-content:center;gap:8px;box-shadow:0 8px 20px rgba(224,32,45,.28);transition:background .18s ease,transform .18s ease}',
        '#mp-login-reminder-modal .mp-lr-btn-primary:hover{background:#b5121d;transform:translateY(-1px)}',
        '#mp-login-reminder-modal .mp-lr-btn-skip{padding:11px 18px;border-radius:11px;background:#f8fafc;border:1.5px solid #dbeafe;color:#0b2b52;font-family:"Sora",sans-serif;font-weight:700;font-size:.87rem;cursor:pointer;transition:all .18s ease}',
        '#mp-login-reminder-modal .mp-lr-btn-skip:hover{background:#eaf2fd;border-color:#93c5fd;color:#1565c9}'
      ].join('');
      document.head.appendChild(st);
    }

    var wrap = document.createElement('div');
    wrap.id = 'mp-login-reminder-modal';
    wrap.setAttribute('role', 'dialog');
    wrap.setAttribute('aria-modal', 'true');
    wrap.setAttribute('aria-labelledby', 'mpLrTitle');
    wrap.innerHTML = [
      '<div class="mp-lr-card">',
      '  <div class="mp-lr-top-bar"></div>',
      '  <button type="button" class="mp-lr-close" id="mpLrCloseBtn" aria-label="Close">&times;</button>',
      '  <div class="mp-lr-icon">',
      '    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">',
      '      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>',
      '      <polyline points="17 21 17 13 7 13 7 21"></polyline>',
      '      <polyline points="7 3 7 8 15 8"></polyline>',
      '    </svg>',
      '  </div>',
      '  <div class="mp-lr-badge">Save Your Band Score &amp; Progress</div>',
      '  <h3 class="mp-lr-title" id="mpLrTitle">Sign In to Save Your Test Results</h3>',
      '  <p class="mp-lr-desc">You can take this test free right away, or sign in with a free candidate account so your band scores, answers, and progress stay saved on your Dashboard.</p>',
      '  <div class="mp-lr-perks">',
      '    <span class="mp-lr-perk"><i>&#10003;</i> Saved Band Scores</span>',
      '    <span class="mp-lr-perk"><i>&#10003;</i> Review Past Mistakes</span>',
      '    <span class="mp-lr-perk"><i>&#10003;</i> 100% Free Account</span>',
      '  </div>',
      '  <div class="mp-lr-actions">',
      '    <a href="/login" id="mpLrSignInBtn" class="mp-lr-btn-primary"><span>Sign In / Register Free</span> &rarr;</a>',
      '    <button type="button" id="mpLrSkipBtn" class="mp-lr-btn-skip">Skip for now &amp; Start Test &rarr;</button>',
      '  </div>',
      '</div>'
    ].join('');
    document.body.appendChild(wrap);
  }

  var pendingReminderNav = null;

  function closeLoginReminderModal() {
    var modal = document.getElementById('mp-login-reminder-modal');
    if (!modal) return;
    modal.classList.remove('open');
    setTimeout(function() {
      if (!modal.classList.contains('open')) {
        modal.style.display = 'none';
      }
    }, 220);
  }

  function openLoginReminderModal(href, target) {
    ensureLoginReminderModal();
    pendingReminderNav = { href: href, target: target || '' };
    var modal = document.getElementById('mp-login-reminder-modal');
    var signInBtn = document.getElementById('mpLrSignInBtn');
    var skipBtn = document.getElementById('mpLrSkipBtn');
    var closeBtn = document.getElementById('mpLrCloseBtn');

    try {
      var u = new URL(href, window.location.origin);
      var redir = encodeURIComponent(u.pathname + u.search);
      if (signInBtn) signInBtn.href = '/login?redirect=' + redir;
    } catch (e) {
      if (signInBtn) signInBtn.href = '/login';
    }

    if (skipBtn && !skipBtn.__bound) {
      skipBtn.__bound = true;
      skipBtn.addEventListener('click', function() {
        var mode = (mpSystemSettingsCache && mpSystemSettingsCache.loginReminderMode) || 'every_time';
        if (mode === 'once_per_session') {
          try { sessionStorage.setItem('mp_p1_login_reminder_skipped', '1'); } catch (e) {}
        }
        var dest = pendingReminderNav;
        pendingReminderNav = null;
        closeLoginReminderModal();
        if (dest && dest.href) {
          if (dest.target === '_blank') {
            window.open(dest.href, '_blank', 'noopener,noreferrer');
          } else {
            window.location.href = dest.href;
          }
        }
      });
    }

    if (closeBtn && !closeBtn.__bound) {
      closeBtn.__bound = true;
      closeBtn.addEventListener('click', function() {
        pendingReminderNav = null;
        closeLoginReminderModal();
      });
    }

    if (modal && !modal.__bgBound) {
      modal.__bgBound = true;
      modal.addEventListener('click', function(e) {
        if (e.target === modal) {
          pendingReminderNav = null;
          closeLoginReminderModal();
        }
      });
      window.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('open')) {
          pendingReminderNav = null;
          closeLoginReminderModal();
        }
      });
    }

    modal.style.display = 'flex';
    void modal.offsetWidth;
    modal.classList.add('open');
  }

  function bindPhase1LoginReminderInterceptor() {
    if (window.__mpLoginReminderBound) return;
    window.__mpLoginReminderBound = true;
    document.addEventListener('click', function(e) {
      var link = e.target && e.target.closest ? e.target.closest('a[href]') : null;
      if (!link) return;
      if (link.id === 'mpLrSignInBtn' || link.id === 'fmc-confirm-btn') return;
      if (link.closest('.is-locked') || link.closest('.locked')) return;
      // On mocks.html, clicking /passcodes already opens #fmc-modal with a guest banner
      if (link.getAttribute('href') && link.getAttribute('href').indexOf('/passcodes') !== -1 && document.getElementById('fmc-modal')) return;
      if (!isTargetTestOrPracticeHref(link.href)) return;
      if (!mpSystemSettingsCache) return;
      if (Number(mpSystemSettingsCache.currentPhase) !== 1) return;
      if (mpSystemSettingsCache.loginReminderEnabled === false) return;
      if (!isGuestUserForReminder()) return;
      var reminderMode = mpSystemSettingsCache.loginReminderMode || 'every_time';
      if (reminderMode === 'once_per_session') {
        try {
          if (sessionStorage.getItem('mp_p1_login_reminder_skipped') === '1') return;
        } catch (err) {}
      }

      e.preventDefault();
      e.stopPropagation();
      openLoginReminderModal(link.href, link.getAttribute('target') || '');
    }, true);
  }

  function syncFooterPricingLinkShared() {
    fetch('/api/system-settings')
      .then(function(r) { return r.json(); })
      .then(function(d) {
        if (d && d.success && d.settings) {
          mpSystemSettingsCache = d.settings;
          window.__mpSystemSettings = d.settings;
          var isPhase3 = Number(d.settings.currentPhase) === 3;
          var els = document.querySelectorAll('.footer-pricing-link, #footer-pricing-link');
          els.forEach(function(el) {
            el.style.display = isPhase3 ? 'inline-flex' : 'none';
            if (isPhase3) el.style.alignItems = 'center';
          });
        }
      }).catch(function() {});
  }

  var FOOTER_CACHE_KEY = 'mp_shared_footer_v6';
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
      '/recent-reading-tests': '/cambridge-reading',
      '/recent-reading-tests.html': '/cambridge-reading',
      '/recent-listening-tests': '/cambridge-listening',
      '/recent-writing-tests': '/cambridge-writing',
      '/reading-exercises': '/cambridge-reading',
      '/listening-exercises': '/cambridge-listening',
      '/writing-exercises': '/cambridge-writing',
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
    syncUserSessionFromServer();
    bindPhase1LoginReminderInterceptor();
    syncFooterPricingLinkShared();

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
