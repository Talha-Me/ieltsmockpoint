const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'views', 'cambridgetest', 'cambridge-writing-test.html');
const jsPath = path.join(__dirname, '..', 'views', 'cambridgetest', 'cambridge-writing-test.js');

// 1. Update HTML
let html = fs.readFileSync(htmlPath, 'utf8');

const modalCss = `
    /* Test Page Unlock Modal (Phase 2 & Phase 3) */
    .ps-modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(11, 43, 82, 0.72);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      z-index: 250000;
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
      text-align: center;
      padding: 34px 28px;
      box-shadow: 0 24px 60px rgba(11, 43, 82, 0.28);
      border: 1.5px solid #dbeafe;
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
`;

if (!html.includes('.ps-modal-overlay')) {
  html = html.replace('</style>', modalCss + '\n  </style>');
}

const modalHtml = `
  <!-- Test Page Unlock Modal (Phase 2 & Phase 3) -->
  <div id="psUnlockModal" class="ps-modal-overlay" onclick="if(event.target===this)closeTestUnlockModal();">
    <div class="ps-modal-card">
      <button type="button" class="ps-close-btn" onclick="closeTestUnlockModal()" aria-label="Close modal">&times;</button>
      <div id="psUnlockIconWrap" style="width: 58px; height: 58px; border-radius: 16px; background: #fdecee; border: 1.5px solid rgba(224, 32, 45, 0.28); display: inline-flex; align-items: center; justify-content: center; color: #e0202d; margin: 0 auto 14px;">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
      </div>
      <div id="psUnlockBadge" style="display:inline-block; font-size:0.75rem; font-weight:700; letter-spacing:0.04em; padding:3px 10px; border-radius:999px; margin-bottom:10px; background:#fdecee; color:#e0202d; border:1px solid rgba(224, 32, 45, 0.25);">FREE CANDIDATE ACCOUNT</div>
      <h4 id="psUnlockTitle" style="font-family:'Sora',sans-serif; font-size: 1.3rem; font-weight: 800; color: #0b2b52; margin-bottom: 10px;">Sign In Required to Unlock</h4>
      <p id="psUnlockDesc" style="color: #64748b; font-size: 0.90rem; line-height: 1.55; margin-bottom: 22px;">Please sign in or create a free candidate account to practice this Cambridge Writing session and save your essay evaluation.</p>
      
      <div style="display:flex; flex-direction:column; gap:10px;">
        <a id="psUnlockPrimaryBtn" href="/login" style="display:inline-flex; align-items:center; justify-content:center; gap:8px; padding:12px 22px; border-radius:10px; background:#e0202d; color:#ffffff; font-family:'Sora',sans-serif; font-weight:700; font-size:0.92rem; text-decoration:none; box-shadow:0 8px 20px rgba(224, 32, 45, 0.28); transition:all 0.2s;">
          <span>Sign In / Register Free</span> &rarr;
        </a>
        <a id="psUnlockBackBtn" href="/cambridge-writing.html" style="display:inline-flex; align-items:center; justify-content:center; padding:10px 18px; border-radius:10px; background:#f8fafc; color:#64748b; font-weight:600; font-size:0.86rem; text-decoration:none; border:1px solid #e2e8f0; transition:all 0.2s;">
          Back to Cambridge Writing
        </a>
      </div>
      <div id="psUnlockSecondaryAction" style="margin-top:14px; display:none;"></div>
    </div>
  </div>
`;

if (!html.includes('id="psUnlockModal"')) {
  html = html.replace('</body>', modalHtml + '\n</body>');
}
fs.writeFileSync(htmlPath, html, 'utf8');
console.log('Updated cambridge-writing-test.html with modal');

// 2. Update JS
let js = fs.readFileSync(jsPath, 'utf8');

const phaseEngineCode = `
// ==========================================
// PHASE & ACCESS CONTROL ENGINE (Phase 2 & Phase 3)
// ==========================================
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
    }
  } catch (e) {
    console.warn('Could not fetch system settings, defaulting to phase 1:', e);
  }
}

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

function isCurrentSessionLocked(bookNum, testNum, taskMode) {
  if (appPhase === 1) return false;
  const user = getUserAccessState();
  if (appPhase === 2 && user.isLoggedIn) return false;
  if (appPhase === 3 && user.isPremium) return false;

  const freeTestsAllowed = appSettings.freeFullMocksCount !== undefined ? Number(appSettings.freeFullMocksCount) : 1;
  const freePartsAllowed = appSettings.freePartsPerTest !== undefined ? Number(appSettings.freePartsPerTest) : 1;

  if (taskMode === 1 || taskMode === 2) {
    // Single task practice mode
    if (Number(taskMode) > freePartsAllowed) return true;
  } else {
    // Full test mode
    if (Number(testNum) > freeTestsAllowed) return true;
  }

  return false;
}

function openTestUnlockModal() {
  const modal = document.getElementById('psUnlockModal');
  if (!modal) return;

  const iconWrap = document.getElementById('psUnlockIconWrap');
  const tagBadge = document.getElementById('psUnlockBadge');
  const titleEl = document.getElementById('psUnlockTitle');
  const descEl = document.getElementById('psUnlockDesc');
  const primaryBtn = document.getElementById('psUnlockPrimaryBtn');
  const secondaryAction = document.getElementById('psUnlockSecondaryAction');

  const currUrl = encodeURIComponent(window.location.pathname + window.location.search);

  if (appPhase === 3) {
    if (iconWrap) {
      iconWrap.style.background = 'rgba(224, 32, 45, 0.08)';
      iconWrap.style.borderColor = 'rgba(224, 32, 45, 0.28)';
      iconWrap.style.color = '#e0202d';
      iconWrap.innerHTML = '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>';
    }
    if (tagBadge) {
      tagBadge.style.display = 'inline-block';
      tagBadge.style.background = '#fee2e2';
      tagBadge.style.color = '#b91c1c';
      tagBadge.style.border = '1px solid #fca5a5';
      tagBadge.textContent = 'PREMIUM PLAN REQUIRED';
    }
    if (titleEl) titleEl.textContent = 'Unlock with Premium Access';
    if (descEl) descEl.textContent = 'Upgrade to IELTS Mockpoint Premium to access all Cambridge Writing tests, Task 1 and Task 2 separate practice, and instant AI examiner evaluations.';
    if (primaryBtn) {
      primaryBtn.style.background = '#e0202d';
      primaryBtn.href = '/pricing';
      primaryBtn.innerHTML = '<span>Upgrade to Premium / Buy Pass</span> &rarr;';
    }
    if (secondaryAction) {
      const u = getUserAccessState();
      if (!u.isLoggedIn) {
        secondaryAction.innerHTML = \`<a href="/login?redirect=\${currUrl}" style="font-size:0.86rem; color:#1565c9; text-decoration:none; font-weight:600;">Already have a paid account? <span style="text-decoration:underline;">Sign In</span></a>\`;
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
      iconWrap.innerHTML = '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#e0202d" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>';
    }
    if (tagBadge) {
      tagBadge.style.display = 'inline-block';
      tagBadge.style.background = '#fdecee';
      tagBadge.style.color = '#e0202d';
      tagBadge.style.border = '1px solid rgba(224, 32, 45, 0.25)';
      tagBadge.textContent = 'FREE CANDIDATE ACCOUNT';
    }
    if (titleEl) titleEl.textContent = 'Sign In Required to Unlock';
    if (descEl) descEl.textContent = 'Please log in or register a free candidate account to take this Cambridge Writing session and save your writing report.';
    if (primaryBtn) {
      primaryBtn.style.background = '#e0202d';
      primaryBtn.href = \`/login?redirect=\${currUrl}\`;
      primaryBtn.innerHTML = '<span>Sign In / Register Free</span> &rarr;';
    }
    if (secondaryAction) {
      secondaryAction.style.display = 'none';
    }
  }

  modal.classList.add('open');
}

function closeTestUnlockModal() {
  const m = document.getElementById('psUnlockModal');
  if (m) m.classList.remove('open');
}
window.openTestUnlockModal = openTestUnlockModal;
window.closeTestUnlockModal = closeTestUnlockModal;
`;

if (!js.includes('function isCurrentSessionLocked')) {
  // Inject right after initial variable declarations
  js = js.replace('let singleTaskMode = null;', 'let singleTaskMode = null;\n' + phaseEngineCode);
}

// In startTest(), check if current session is locked!
const oldStartTest = `function startTest() {
  const overlay = document.getElementById("listeningOverlay");
  if (overlay) overlay.style.display = "none";
  startTimer();
}`;

const newStartTest = `async function startTest() {
  if (!appSettingsLoaded) {
    await fetchSystemPhase();
  }

  const pathParts = window.location.pathname.split("/").filter(Boolean);
  let bookNum = 18, testNum = 1;
  if (pathParts.includes("writing")) {
    const wIdx = pathParts.indexOf("writing");
    bookNum = parseInt(pathParts[wIdx + 1]) || 18;
    testNum = parseInt(pathParts[wIdx + 2]) || 1;
  }

  if (isCurrentSessionLocked(bookNum, testNum, singleTaskMode)) {
    openTestUnlockModal();
    return;
  }

  const overlay = document.getElementById("listeningOverlay");
  if (overlay) overlay.style.display = "none";
  startTimer();
}`;

if (js.includes(oldStartTest)) {
  js = js.replace(oldStartTest, newStartTest);
  console.log('Replaced startTest with phase check');
}

fs.writeFileSync(jsPath, js, 'utf8');
console.log('Updated cambridge-writing-test.js with Phase 2 & 3 access control');
