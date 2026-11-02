const fs = require('fs');
const path = require('path');

const mocksPath = path.resolve(__dirname, '../FrontPage/Frontend/mocks.html');
let html = fs.readFileSync(mocksPath, 'utf8');

// 1. Add CSS for .card.is-locked and .card-glass-lock
const cssToInsert = `
/* Transparent Glassy Lock for Mock Cards */
.card.is-locked {
  position: relative;
  cursor: pointer;
}
.card.is-locked .btn {
  background: #f1f5f9 !important;
  color: #64748b !important;
  border-color: #cbd5e1 !important;
  box-shadow: none !important;
}
.card.is-locked .btn:hover {
  background: #e2e8f0 !important;
  color: #1e293b !important;
}
.card-glass-lock {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1.5px solid rgba(148, 163, 184, 0.4);
  box-shadow: 0 4px 14px rgba(11, 43, 82, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  z-index: 5;
  transition: all 0.22s ease;
}
.card.is-locked:hover .card-glass-lock {
  background: rgba(224, 32, 45, 0.12);
  border-color: rgba(224, 32, 45, 0.45);
  color: #e0202d;
  transform: scale(1.08);
}
.card.premium.is-locked .card-glass-lock {
  background: rgba(255, 255, 255, 0.16);
  border-color: rgba(255, 255, 255, 0.28);
  color: #fff;
}
.card.premium.is-locked:hover .card-glass-lock {
  background: rgba(224, 32, 45, 0.32);
  border-color: #e0202d;
  color: #fff;
}
`;

html = html.replace('</style>', `${cssToInsert}\n</style>`);

// 2. Add Mock Unlock Modal HTML before </body>
const modalHtml = `
<!-- Mock Test Unlock Modal -->
<div id="mock-unlock-modal" class="fmc-overlay" style="z-index: 10001;" hidden aria-hidden="true" onclick="if(event.target===this)closeMockUnlockModal();">
  <div class="fmc-card" style="max-width: 440px; text-align: center; padding: 34px 28px;">
    <button type="button" class="fmc-close" onclick="closeMockUnlockModal()" aria-label="Close modal">&times;</button>
    <div id="mockUnlockIconWrap" style="width: 58px; height: 58px; border-radius: 16px; background: #f0f7ff; border: 1.5px solid #bcd9fb; display: inline-flex; align-items: center; justify-content: center; color: var(--blue,#1565c9); margin: 0 auto 14px;">
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
      </svg>
    </div>
    <div id="mockUnlockBadge" style="display:inline-block; font-size:0.75rem; font-weight:700; letter-spacing:0.04em; padding:3px 10px; border-radius:999px; margin-bottom:10px; background:#e0f2fe; color:#0369a1;">FREE CANDIDATE ACCOUNT</div>
    <h3 id="mockUnlockTitle" style="font-family:'Sora',sans-serif; font-size: 1.3rem; font-weight: 800; color: #0b2b52; margin-bottom: 8px;">Sign In Required to Unlock</h3>
    <p id="mockUnlockDesc" style="font-size: 0.88rem; color: #64748b; line-height: 1.55; margin-bottom: 22px;">
      Please log in or create a free candidate account to unlock all 12 Academic and 9 Premium mock tests and track your complete progress on your personal dashboard.
    </p>
    <div style="display: flex; flex-direction: column; gap: 10px;">
      <a href="/login?redirect=/mocks" id="mockUnlockPrimaryBtn" style="padding: 12px 20px; border-radius: 10px; background: #1565c9; color: #fff; text-decoration: none; font-weight: 700; font-size: 0.92rem; display: flex; align-items: center; justify-content: center; gap: 8px;">
        <span>Sign In / Register Free</span> &rarr;
      </a>
      <button type="button" onclick="closeMockUnlockModal()" style="padding: 10px 16px; border-radius: 10px; background: #f1f5f9; border: 1px solid #e2e8f0; color: #475569; font-weight: 600; font-size: 0.86rem; cursor: pointer;">
        Maybe Later
      </button>
    </div>
  </div>
</div>
`;

html = html.replace('</body>', `${modalHtml}\n</body>`);

// 3. Add JS for Quotas & Card Locking in mocks.html
const jsToInsert = `
// =========================================================================
// MOCK TEST PHASE & QUOTA LOCKING (Phase 1: Free, Phase 2: Freemium, Phase 3: Paid)
// =========================================================================
let currentMockPhase = 1;

function openMockUnlockModal(phaseOverride) {
  const phase = phaseOverride || currentMockPhase;
  const modal = document.getElementById('mock-unlock-modal');
  if (!modal) return;

  const iconWrap = document.getElementById('mockUnlockIconWrap');
  const tagBadge = document.getElementById('mockUnlockBadge');
  const titleEl = document.getElementById('mockUnlockTitle');
  const descEl = document.getElementById('mockUnlockDesc');
  const primaryBtn = document.getElementById('mockUnlockPrimaryBtn');

  if (phase === 3) {
    if (iconWrap) {
      iconWrap.style.background = 'rgba(224, 32, 45, 0.08)';
      iconWrap.style.borderColor = 'rgba(224, 32, 45, 0.28)';
      iconWrap.style.color = '#e0202d';
      iconWrap.innerHTML = '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>';
    }
    if (tagBadge) {
      tagBadge.style.background = '#fee2e2';
      tagBadge.style.color = '#b91c1c';
      tagBadge.textContent = 'PREMIUM PLAN REQUIRED';
    }
    if (titleEl) titleEl.textContent = 'Unlock with Premium Access';
    if (descEl) descEl.textContent = 'Upgrade to IELTS Mockpoint Premium or purchase a test pass to unlock all Academic and Premium mock tests without limits.';
    if (primaryBtn) {
      primaryBtn.style.background = '#e0202d';
      primaryBtn.href = '/pricing';
      primaryBtn.innerHTML = '<span>Upgrade to Premium / Buy Pass</span> &rarr;';
    }
  } else {
    if (iconWrap) {
      iconWrap.style.background = '#f0f7ff';
      iconWrap.style.borderColor = '#bcd9fb';
      iconWrap.style.color = '#1565c9';
      iconWrap.innerHTML = '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>';
    }
    if (tagBadge) {
      tagBadge.style.background = '#e0f2fe';
      tagBadge.style.color = '#0369a1';
      tagBadge.textContent = 'FREE CANDIDATE ACCOUNT';
    }
    if (titleEl) titleEl.textContent = 'Sign In Required to Unlock';
    if (descEl) descEl.textContent = 'Please log in or create a free candidate account to unlock all 12 Academic and 9 Premium mock tests and track your progress on your personal dashboard.';
    if (primaryBtn) {
      primaryBtn.style.background = '#1565c9';
      primaryBtn.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
      primaryBtn.innerHTML = '<span>Sign In / Register Free</span> &rarr;';
    }
  }

  modal.removeAttribute('hidden');
  void modal.offsetWidth;
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeMockUnlockModal() {
  const modal = document.getElementById('mock-unlock-modal');
  if (!modal) return;
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  setTimeout(() => {
    if (!modal.classList.contains('active')) modal.setAttribute('hidden', '');
  }, 260);
  document.body.style.overflow = '';
}
window.openMockUnlockModal = openMockUnlockModal;
window.closeMockUnlockModal = closeMockUnlockModal;

async function checkAndApplyMockQuotas() {
  try {
    const res = await fetch('/api/system-settings');
    const data = await res.json();
    if (!data || !data.success || !data.settings) return;
    const settings = data.settings;
    currentMockPhase = Number(settings.currentPhase) || 1;

    if (currentMockPhase === 1) return; // Phase 1 is 100% free

    let user = null;
    try {
      user = JSON.parse(localStorage.getItem('user') || 'null');
    } catch(e) {}
    const isLoggedIn = !!(user && (user.email || user.name));
    const isPremium = !!(user && (user.isPremium || user.role === 'admin' || user.plan === 'premium'));

    if (currentMockPhase === 2 && isLoggedIn) return; // Phase 2: logged-in user gets all free
    if (currentMockPhase === 3 && isPremium) return;  // Phase 3: premium gets all free

    const freeAcad = settings.freeAcademicMocksCount !== undefined ? Number(settings.freeAcademicMocksCount) : (Number(settings.freeFullMocksCount) || 1);
    const freePrem = settings.freePremiumMocksCount !== undefined ? Number(settings.freePremiumMocksCount) : 1;

    // Academic Mock Cards
    const acadCards = document.querySelectorAll('#panel-ACADEMIC .card');
    acadCards.forEach((c, idx) => {
      if (idx >= freeAcad && !c.classList.contains('soon')) {
        lockMockCard(c);
      }
    });

    // Premium Mock Cards
    const premCards = document.querySelectorAll('#panel-PREMIUM .card');
    premCards.forEach((c, idx) => {
      if (idx >= freePrem && !c.classList.contains('soon')) {
        lockMockCard(c);
      }
    });
  } catch(e) {
    console.error('Failed to apply mock quotas:', e);
  }
}

function lockMockCard(c) {
  c.classList.add('is-locked');
  const lockSvg = '<div class="card-glass-lock" title="Sign in to unlock"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg></div>';
  c.insertAdjacentHTML('beforeend', lockSvg);
  const btn = c.querySelector('.btn');
  if (btn) {
    btn.innerHTML = '<span>Unlock Test</span> <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.4" style="margin-left:4px;vertical-align:-1px;"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>';
  }
}

document.addEventListener('DOMContentLoaded', checkAndApplyMockQuotas);
`;

// Also update click interceptor in mocks.html so locked card opens openMockUnlockModal
const oldClickInterceptor = `  // Intercept all clicks on test cards leading to /passcodes
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href*="/passcodes"]');
    if (!link) return;`;

const newClickInterceptor = `  // Intercept all clicks on test cards leading to /passcodes
  document.addEventListener('click', (e) => {
    const lockedCard = e.target.closest('.card.is-locked, article.is-locked');
    if (lockedCard) {
      e.preventDefault();
      e.stopPropagation();
      openMockUnlockModal();
      return;
    }
    const link = e.target.closest('a[href*="/passcodes"]');
    if (!link) return;`;

html = html.replace(oldClickInterceptor, newClickInterceptor);

// Insert js before </script></body>
html = html.replace('</script>\n</body>', `${jsToInsert}\n</script>\n</body>`);

fs.writeFileSync(mocksPath, html, 'utf8');
console.log('Updated FrontPage/Frontend/mocks.html successfully.');
