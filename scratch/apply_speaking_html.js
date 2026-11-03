const fs = require('fs');

const path = 'D:/personal websites/ieltsmockpoint/FrontPage/Frontend/speaking.html';
let content = fs.readFileSync(path, 'utf8');

// 1. Add CSS before </style>
const modalCss = `
/* Phase 2 / Phase 3 Modal & Lock Styles */
.ps-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(11, 43, 82, 0.68);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  z-index: 200000;
  display: none;
  align-items: center;
  justify-content: center;
  padding: 16px;
}
.ps-modal-overlay.open {
  display: flex;
}
.ps-modal-card {
  position: relative;
  background: #ffffff;
  border-radius: 24px;
  width: 100%;
  max-width: 440px;
  box-shadow: 0 24px 60px rgba(11, 43, 82, 0.24);
  border: 1.5px solid #dbeafe;
  text-align: center;
  padding: 32px 28px;
  animation: psPop 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes psPop {
  from { opacity: 0; transform: scale(0.94) translateY(12px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
.ps-close-btn {
  position: absolute;
  right: 18px;
  top: 18px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid var(--line, #e2e8f0);
  background: #f8fafc;
  color: var(--navy, #0b2b52);
  font-size: 20px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}
.ps-close-btn:hover {
  background: #e2e8f0;
  transform: rotate(90deg);
}
.ps-lock-glass {
  display: inline-flex;
  align-items: center;
  margin-left: 6px;
}
`;

if (!content.includes('.ps-modal-overlay')) {
  content = content.replace('</style>', modalCss + '\n</style>');
  console.log('Added modal CSS to speaking.html');
}

// 2. Add Modal HTML before </body>
const modalHtml = `
<!-- Access Control Modal (Phase 2 & Phase 3) -->
<div id="psUnlockModal" class="ps-modal-overlay" style="z-index: 200000 !important;" onclick="if(event.target===this)closeUnlockModal();">
  <div class="ps-modal-card">
    <button type="button" class="ps-close-btn" onclick="closeUnlockModal()" aria-label="Close modal">&times;</button>
    <div id="psUnlockIconWrap" style="width: 58px; height: 58px; border-radius: 16px; background: #fdecee; border: 1.5px solid rgba(224, 32, 45, 0.28); display: inline-flex; align-items: center; justify-content: center; color: #e0202d; margin: 0 auto 14px;">
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
      </svg>
    </div>
    <div id="psUnlockBadge" style="display:inline-block; font-size:0.75rem; font-weight:700; letter-spacing:0.04em; padding:3px 10px; border-radius:999px; margin-bottom:10px; background:#fdecee; color:#e0202d; border:1px solid rgba(224, 32, 45, 0.25);">FREE CANDIDATE ACCOUNT</div>
    <h4 id="psUnlockTitle" style="font-family:'Sora',sans-serif; font-size: 1.3rem; font-weight: 800; color: #0b2b52; margin-bottom: 8px;">Sign In Required to Unlock</h4>
    <p id="psUnlockDesc" style="font-size: 0.88rem; color: #64748b; line-height: 1.55; margin-bottom: 22px;">
      Please log in or create a free candidate account to access all Speaking Mock Tests and save your results.
    </p>
    <div style="display: flex; flex-direction: column; gap: 10px;">
      <a id="psUnlockPrimaryBtn" href="/login" style="display: inline-flex; align-items: center; justify-content: center; gap: 8px; width: 100%; padding: 13px 20px; border-radius: 12px; font-weight: 700; font-size: 0.95rem; color: #fff; background: #e0202d; text-decoration: none; transition: transform 0.2s, box-shadow 0.2s; box-shadow: 0 8px 20px rgba(224, 32, 45, 0.28);">
        <span>Sign In / Register Free</span> &rarr;
      </a>
      <button type="button" onclick="closeUnlockModal()" style="background: none; border: none; font-size: 0.86rem; color: #64748b; font-weight: 600; cursor: pointer; padding: 6px;">
        Maybe later
      </button>
    </div>
    <div id="psUnlockSecondaryAction" style="margin-top: 14px; display: none;"></div>
  </div>
</div>
`;

if (!content.includes('id="psUnlockModal"')) {
  content = content.replace('</body>', modalHtml + '\n</body>');
  console.log('Added modal HTML to speaking.html');
}

// 3. Add JS Access Logic
const accessScript = `
/* ---------- Phase 2 & Phase 3 Access Control ---------- */
let appPhase = 1;
let appSettings = {};
let appSettingsLoaded = false;

async function fetchSystemPhase() {
  try {
    const res = await fetch('/api/system-settings');
    const data = await res.json();
    if (data && data.success && data.settings) {
      appPhase = Number(data.settings.currentPhase) || 1;
      appSettings = data.settings || {};
      appSettingsLoaded = true;
      applySpeakingAccessRules();
    }
  } catch (e) {
    console.warn('System settings fetch failed, defaulting to phase 1', e);
  }
}
fetchSystemPhase();

function getUserAccessState() {
  try {
    const u = JSON.parse(localStorage.getItem('user') || 'null');
    if (!u || (!u.email && !u.name)) {
      return { isLoggedIn: false, isPremium: false };
    }
    const isPremium = !!(u.isPremium || u.role === 'admin' || u.plan === 'premium');
    return { isLoggedIn: true, isPremium };
  } catch (e) {
    return { isLoggedIn: false, isPremium: false };
  }
}

function isSpeakingTestLocked(testNo) {
  if (appPhase === 1) return false;
  const user = getUserAccessState();
  if (appPhase === 2 && user.isLoggedIn) return false;
  if (appPhase === 3 && user.isPremium) return false;
  const freeTestsAllowed = appSettings.freeFullMocksCount !== undefined ? Number(appSettings.freeFullMocksCount) : 1;
  return Number(testNo) > freeTestsAllowed;
}

function isSpeakingPartLocked(partNo, testNo) {
  if (appPhase === 1) return false;
  const user = getUserAccessState();
  if (appPhase === 2 && user.isLoggedIn) return false;
  if (appPhase === 3 && user.isPremium) return false;

  const freeTestsAllowed = appSettings.freeFullMocksCount !== undefined ? Number(appSettings.freeFullMocksCount) : 1;
  if (Number(testNo) > freeTestsAllowed) return true;

  const freePartsAllowed = appSettings.freePartsPerTest !== undefined ? Number(appSettings.freePartsPerTest) : 1;
  return Number(partNo) > freePartsAllowed;
}

function openUnlockModal(phaseOverride) {
  const phase = phaseOverride || appPhase;
  const modal = document.getElementById('psUnlockModal');
  if (!modal) return;
  modal.style.zIndex = '200000';

  const iconWrap = document.getElementById('psUnlockIconWrap');
  const tagBadge = document.getElementById('psUnlockBadge');
  const titleEl = document.getElementById('psUnlockTitle');
  const descEl = document.getElementById('psUnlockDesc');
  const primaryBtn = document.getElementById('psUnlockPrimaryBtn');
  const secondaryAction = document.getElementById('psUnlockSecondaryAction');

  const currUrl = encodeURIComponent(window.location.pathname + window.location.search);

  if (phase === 3) {
    if (iconWrap) {
      iconWrap.style.background = 'rgba(224, 32, 45, 0.08)';
      iconWrap.style.borderColor = 'rgba(224, 32, 45, 0.28)';
      iconWrap.style.color = '#e0202d';
      iconWrap.innerHTML = '<svg viewBox=\"0 0 24 24\" width=\"28\" height=\"28\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z\"></path></svg>';
    }
    if (tagBadge) {
      tagBadge.style.display = 'inline-block';
      tagBadge.style.background = '#fee2e2';
      tagBadge.style.color = '#b91c1c';
      tagBadge.style.border = '1px solid #fca5a5';
      tagBadge.textContent = 'PREMIUM PLAN REQUIRED';
    }
    if (titleEl) titleEl.textContent = 'Unlock with Premium Access';
    if (descEl) descEl.textContent = 'Upgrade to IELTS Mockpoint Premium to access all Speaking Mock Tests, interactive 3D AI Examiner sessions, Part 1, 2 & 3 individual practices, and instant official band scoring.';
    if (primaryBtn) {
      primaryBtn.style.background = '#e0202d';
      primaryBtn.style.boxShadow = '0 6px 18px rgba(224, 32, 45, 0.32)';
      primaryBtn.href = '/pricing';
      primaryBtn.innerHTML = '<span>Upgrade to Premium / Buy Pass</span> &rarr;';
    }
    if (secondaryAction) {
      const u = getUserAccessState();
      if (!u.isLoggedIn) {
        secondaryAction.innerHTML = '<a href=\"/login?redirect=' + currUrl + '\" style=\"font-size:0.86rem; color:#1565c9; text-decoration:none; font-weight:600;\">Already have a paid account? <span style=\"text-decoration:underline;\">Sign In</span></a>';
        secondaryAction.style.display = 'block';
      } else {
        secondaryAction.style.display = 'none';
      }
    }
  } else {
    if (iconWrap) {
      iconWrap.style.background = '#fdecee';
      iconWrap.style.borderColor = 'rgba(224, 32, 45, 0.28)';
      iconWrap.style.color = '#e0202d';
      iconWrap.innerHTML = '<svg viewBox=\"0 0 24 24\" width=\"28\" height=\"28\" fill=\"none\" stroke=\"#e0202d\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"3\" y=\"11\" width=\"18\" height=\"11\" rx=\"2\" ry=\"2\"></rect><path d=\"M7 11V7a5 5 0 0 1 10 0v4\"></path></svg>';
    }
    if (tagBadge) {
      tagBadge.style.display = 'inline-block';
      tagBadge.style.background = '#fdecee';
      tagBadge.style.color = '#e0202d';
      tagBadge.style.border = '1px solid rgba(224, 32, 45, 0.25)';
      tagBadge.textContent = 'FREE CANDIDATE ACCOUNT';
    }
    if (titleEl) titleEl.textContent = 'Sign In Required to Unlock';
    if (descEl) descEl.textContent = 'Please log in or create a free candidate account to practice all Speaking tests with the 3D AI Examiner and save your recordings & evaluations.';
    if (primaryBtn) {
      primaryBtn.style.background = '#e0202d';
      primaryBtn.style.boxShadow = '0 8px 20px rgba(224, 32, 45, 0.28)';
      primaryBtn.href = '/login?redirect=' + currUrl;
      primaryBtn.innerHTML = '<span>Sign In / Register Free</span> &rarr;';
    }
    if (secondaryAction) {
      secondaryAction.style.display = 'none';
    }
  }

  modal.classList.add('open');
}

function closeUnlockModal() {
  const m = document.getElementById('psUnlockModal');
  if (m) m.classList.remove('open');
}
window.openUnlockModal = openUnlockModal;
window.closeUnlockModal = closeUnlockModal;

function applySpeakingAccessRules() {
  if (appPhase === 1) return;
  const grid = document.getElementById('spGrid');
  if (!grid) return;

  const partFocus = new URLSearchParams(location.search).get('part');

  grid.querySelectorAll('.sp-card').forEach((card, idx) => {
    const testNo = idx + 1;
    const testLocked = isSpeakingTestLocked(testNo);

    // Main Take Test button
    const mainBtnWrap = card.querySelector('.sp-card-actions');
    if (mainBtnWrap) {
      const takeTestLink = mainBtnWrap.querySelector('a.btn-red, button.btn-red');
      if (takeTestLink) {
        if (partFocus && ['1','2','3'].includes(partFocus)) {
          const partLocked = isSpeakingPartLocked(partFocus, testNo);
          if (partLocked) {
            takeTestLink.outerHTML = '<button type=\"button\" class=\"btn btn-red\" onclick=\"openUnlockModal()\" title=\"Locked – Sign in or Upgrade to unlock\">Start Part ' + partFocus + ' <svg viewBox=\"0 0 24 24\" width=\"13\" height=\"13\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\" style=\"margin-left:4px;\"><rect x=\"3\" y=\"11\" width=\"18\" height=\"11\" rx=\"2\" ry=\"2\"></rect><path d=\"M7 11V7a5 5 0 0 1 10 0v4\"></path></svg></button>';
          }
        } else if (testLocked) {
          takeTestLink.outerHTML = '<button type=\"button\" class=\"btn btn-red\" onclick=\"openUnlockModal()\" title=\"Locked – Sign in or Upgrade to unlock\">Take Test <svg viewBox=\"0 0 24 24\" width=\"13\" height=\"13\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\" style=\"margin-left:4px;\"><rect x=\"3\" y=\"11\" width=\"18\" height=\"11\" rx=\"2\" ry=\"2\"></rect><path d=\"M7 11V7a5 5 0 0 1 10 0v4\"></path></svg></button>';
        }
      }
    }

    // Practice Popover items
    const pop = card.querySelector('.part-popover');
    if (pop) {
      const partLabels = { '1': 'Interview', '2': 'Cue Card', '3': 'Discussion' };
      [1, 2, 3].forEach(pNum => {
        const pLocked = isSpeakingPartLocked(pNum, testNo);
        const item = pop.querySelector('a[href*=\"part=' + pNum + '\"], div[role=\"menuitem\"][data-part=\"' + pNum + '\"]');
        if (item) {
          if (pLocked) {
            item.outerHTML = '<div role=\"menuitem\" data-part=\"' + pNum + '\" onclick=\"openUnlockModal()\" style=\"cursor:pointer; display:flex; justify-content:space-between; align-items:center; padding:9px 12px; border-radius:8px; font-size:.82rem; font-weight:600; color:var(--muted); background:var(--surface);\">Part ' + pNum + ' <span style=\"font-size:.72rem; display:flex; align-items:center; gap:4px;\">' + partLabels[pNum] + ' <svg viewBox=\"0 0 24 24\" width=\"12\" height=\"12\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\"><rect x=\"3\" y=\"11\" width=\"18\" height=\"11\" rx=\"2\" ry=\"2\"></rect><path d=\"M7 11V7a5 5 0 0 1 10 0v4\"></path></svg></span></div>';
          }
        }
      });
    }
  });
}
`;

if (!content.includes('applySpeakingAccessRules')) {
  content = content.replace('</script>\n</body>', accessScript + '\n</script>\n</body>');
  console.log('Added access control script to speaking.html');
}

fs.writeFileSync(path, content, 'utf8');
console.log('Successfully updated FrontPage/Frontend/speaking.html');
