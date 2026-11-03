const fs = require('fs');

const path = 'D:/personal websites/ieltsmockpoint/views/speaking_engine/speaking-test.html';
let content = fs.readFileSync(path, 'utf8');

// 1. Add modal CSS before </style>
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
`;

if (!content.includes('.ps-modal-overlay')) {
  content = content.replace('</style>', modalCss + '\n  </style>');
  console.log('Added modal CSS to speaking-test.html');
}

// 2. Add modal HTML before </body>
const modalHtml = `
  <!-- Access Control Modal (Phase 2 & Phase 3) -->
  <div id="psUnlockModal" class="ps-modal-overlay" style="z-index: 200000 !important;" onclick="if(event.target===this)closeTestUnlockModal();">
    <div class="ps-modal-card">
      <button type="button" class="ps-close-btn" onclick="closeTestUnlockModal()" aria-label="Close modal">&times;</button>
      <div id="psUnlockIconWrap" style="width: 58px; height: 58px; border-radius: 16px; background: #fdecee; border: 1.5px solid rgba(224, 32, 45, 0.28); display: inline-flex; align-items: center; justify-content: center; color: #e0202d; margin: 0 auto 14px;">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
      </div>
      <div id="psUnlockBadge" style="display:inline-block; font-size:0.75rem; font-weight:700; letter-spacing:0.04em; padding:3px 10px; border-radius:999px; margin-bottom:10px; background:#fdecee; color:#e0202d; border:1px solid rgba(224, 32, 45, 0.25);">FREE CANDIDATE ACCOUNT</div>
      <h4 id="psUnlockTitle" style="font-family:'Sora',sans-serif; font-size: 1.3rem; font-weight: 800; color: #0b2b52; margin-bottom: 8px;">Sign In Required to Unlock</h4>
      <p id="psUnlockDesc" style="font-size: 0.88rem; color: #64748b; line-height: 1.55; margin-bottom: 22px;">
        Please log in or create a free candidate account to practice this speaking test.
      </p>
      <div style="display: flex; flex-direction: column; gap: 10px;">
        <a id="psUnlockPrimaryBtn" href="/login" style="display: inline-flex; align-items: center; justify-content: center; gap: 8px; width: 100%; padding: 13px 20px; border-radius: 12px; font-weight: 700; font-size: 0.95rem; color: #fff; background: #e0202d; text-decoration: none; transition: transform 0.2s, box-shadow 0.2s; box-shadow: 0 8px 20px rgba(224, 32, 45, 0.28);">
          <span>Sign In / Register Free</span> &rarr;
        </a>
        <button type="button" id="psUnlockBackBtn" onclick="closeTestUnlockModal()" style="background: none; border: none; font-size: 0.86rem; color: #64748b; font-weight: 600; cursor: pointer; padding: 6px;">
          Back to Speaking Tests
        </button>
      </div>
      <div id="psUnlockSecondaryAction" style="margin-top: 14px; display: none;"></div>
    </div>
  </div>
`;

if (!content.includes('id="psUnlockModal"')) {
  content = content.replace('</body>', modalHtml + '\n</body>');
  console.log('Added modal HTML to speaking-test.html');
}

// 3. Add Phase Access Logic and integrate with loadTest, setPracticeMode, and startSpeakingExam
const accessFunctions = `
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
        }
      } catch (e) {
        console.warn('System settings fetch failed, defaulting to phase 1', e);
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

    function isSpeakingSessionLocked(tNo, pMode) {
      if (appPhase === 1) return false;
      const user = getUserAccessState();
      if (appPhase === 2 && user.isLoggedIn) return false;
      if (appPhase === 3 && user.isPremium) return false;

      const freeTestsAllowed = appSettings.freeFullMocksCount !== undefined ? Number(appSettings.freeFullMocksCount) : 1;
      const freePartsAllowed = appSettings.freePartsPerTest !== undefined ? Number(appSettings.freePartsPerTest) : 1;

      const tNum = Number(tNo) || 1;
      if (tNum > freeTestsAllowed) return true;

      if (pMode && pMode !== 'all') {
        const pNum = Number(pMode) || 1;
        if (pNum > freePartsAllowed) return true;
      }
      return false;
    }

    function openTestUnlockModal() {
      const modal = document.getElementById('psUnlockModal');
      if (!modal) return;
      modal.style.zIndex = '200000';

      const iconWrap = document.getElementById('psUnlockIconWrap');
      const tagBadge = document.getElementById('psUnlockBadge');
      const titleEl = document.getElementById('psUnlockTitle');
      const descEl = document.getElementById('psUnlockDesc');
      const primaryBtn = document.getElementById('psUnlockPrimaryBtn');
      const backBtn = document.getElementById('psUnlockBackBtn');
      const secondaryAction = document.getElementById('psUnlockSecondaryAction');

      const currUrl = encodeURIComponent(window.location.pathname + window.location.search);

      if (backBtn) {
        backBtn.textContent = 'Back to Speaking Tests';
        backBtn.onclick = () => { window.location.href = '/speaking.html'; };
      }

      if (appPhase === 3) {
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
        if (titleEl) titleEl.textContent = 'Unlock Speaking Practice';
        if (descEl) descEl.textContent = 'Upgrade to IELTS Mockpoint Premium to access all Speaking Mock Tests, interactive 3D AI Examiner sessions, Part 1, 2 & 3 practice, and instant official band scoring.';
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
        if (descEl) descEl.textContent = 'Please log in or create a free candidate account to practice this speaking test with the 3D AI Examiner and save your evaluation.';
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

    function closeTestUnlockModal() {
      if (isSpeakingSessionLocked(testId, selectedMode)) {
        window.location.href = '/speaking.html';
        return;
      }
      const m = document.getElementById('psUnlockModal');
      if (m) m.classList.remove('open');
    }
    window.openTestUnlockModal = openTestUnlockModal;
    window.closeTestUnlockModal = closeTestUnlockModal;

    function updateIntroLockNotice() {
      const startBtn = document.querySelector('#introScreen .st-btn-next');
      if (!startBtn) return;
      const locked = isSpeakingSessionLocked(testId, selectedMode);
      const textSpan = startBtn.querySelector('span');
      if (locked) {
        startBtn.style.background = '#e0202d';
        if (textSpan) textSpan.innerHTML = 'Unlock Speaking Practice 🔒';
      } else {
        startBtn.style.background = 'var(--red)';
        if (textSpan) textSpan.innerHTML = 'Start Speaking Practice';
      }
    }
`;

// Insert accessFunctions right after `const requestedPart = urlParams.get('part');\n    if (requestedPart && ['1', '2', '3'].includes(requestedPart)) {\n      selectedMode = requestedPart;\n    }`
if (!content.includes('isSpeakingSessionLocked')) {
  const anchor = "selectedMode = requestedPart;\n    }";
  const anchorIdx = content.indexOf(anchor);
  if (anchorIdx !== -1) {
    content = content.replace(anchor, anchor + '\n' + accessFunctions);
    console.log('Inserted accessFunctions into speaking-test.html');
  } else {
    console.warn('Anchor not found for accessFunctions!');
  }
}

// 4. Update setPracticeMode to refresh lock notices and indicators
const oldSetPracticeMode = `    function setPracticeMode(mode) {
      selectedMode = mode;
      ['all', '1', '2', '3'].forEach(m => {
        const btn = document.getElementById('modeBtn' + (m === 'all' ? 'All' : 'P' + m));
        if (btn) btn.classList.toggle('active', m === mode);
      });
      updateStepPills();
    }`;

const newSetPracticeMode = `    function setPracticeMode(mode) {
      selectedMode = mode;
      ['all', '1', '2', '3'].forEach(m => {
        const btn = document.getElementById('modeBtn' + (m === 'all' ? 'All' : 'P' + m));
        if (btn) {
          btn.classList.toggle('active', m === mode);
          const isModeLocked = isSpeakingSessionLocked(testId, m);
          const lockBadge = btn.querySelector('.mode-lock-icon');
          if (isModeLocked && !lockBadge) {
            const span = document.createElement('span');
            span.className = 'mode-lock-icon';
            span.style.cssText = 'margin-left:6px; font-size:0.85em; opacity:0.85;';
            span.innerHTML = '🔒';
            btn.appendChild(span);
          } else if (!isModeLocked && lockBadge) {
            lockBadge.remove();
          }
        }
      });
      updateStepPills();
      updateIntroLockNotice();
    }`;

if (content.includes(oldSetPracticeMode)) {
  content = content.replace(oldSetPracticeMode, newSetPracticeMode);
  console.log('Updated setPracticeMode in speaking-test.html');
}

// 5. Update loadTest to await fetchSystemPhase() and check if session is locked
const oldLoadTest = `    async function loadTest() {
      try {
        const res = await fetch('/api/speaking-tests');
        const d = await res.json();
        if (d && d.success && d.tests) {
          currentTest = d.tests.find(t => t.id === testId) || d.tests[0];
        }
      } catch(e) {
        console.warn('Using fallback test data');
      }

      setPracticeMode(selectedMode);
      document.getElementById('stTopTestTitle').textContent = currentTest ? currentTest.title : \`Speaking Test \${testId}\`;
      document.getElementById('introTitle').textContent = currentTest ? currentTest.title : \`Speaking Test \${testId}\`;
    }`;

const newLoadTest = `    async function loadTest() {
      await fetchSystemPhase();
      try {
        const res = await fetch('/api/speaking-tests');
        const d = await res.json();
        if (d && d.success && d.tests) {
          currentTest = d.tests.find(t => t.id === testId) || d.tests[0];
        }
      } catch(e) {
        console.warn('Using fallback test data');
      }

      setPracticeMode(selectedMode);
      document.getElementById('stTopTestTitle').textContent = currentTest ? currentTest.title : \`Speaking Test \${testId}\`;
      document.getElementById('introTitle').textContent = currentTest ? currentTest.title : \`Speaking Test \${testId}\`;

      if (isSpeakingSessionLocked(testId, selectedMode)) {
        updateIntroLockNotice();
        openTestUnlockModal();
      }
    }`;

if (content.includes(oldLoadTest)) {
  content = content.replace(oldLoadTest, newLoadTest);
  console.log('Updated loadTest in speaking-test.html');
}

// 6. Update startSpeakingExam to enforce lock check
const oldStartSpeakingExam = `    // Start Exam Flow
    function startSpeakingExam() {
      document.getElementById('introScreen').style.display = 'none';
      document.getElementById('examScreen').style.display = 'flex';
      initSpeechRecognition();

      if (selectedMode === '2') {
        setupPart2();
      } else if (selectedMode === '3') {
        setupPart3();
      } else {
        setupPart1();
      }
    }`;

const newStartSpeakingExam = `    // Start Exam Flow
    async function startSpeakingExam() {
      if (!appSettingsLoaded) {
        await fetchSystemPhase();
      }
      if (isSpeakingSessionLocked(testId, selectedMode)) {
        openTestUnlockModal();
        return;
      }
      document.getElementById('introScreen').style.display = 'none';
      document.getElementById('examScreen').style.display = 'flex';
      initSpeechRecognition();

      if (selectedMode === '2') {
        setupPart2();
      } else if (selectedMode === '3') {
        setupPart3();
      } else {
        setupPart1();
      }
    }`;

if (content.includes(oldStartSpeakingExam)) {
  content = content.replace(oldStartSpeakingExam, newStartSpeakingExam);
  console.log('Updated startSpeakingExam in speaking-test.html');
}

fs.writeFileSync(path, content, 'utf8');
console.log('Successfully updated views/speaking_engine/speaking-test.html');
