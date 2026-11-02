const fs = require('fs');
const path = require('path');

const listeningJsPath = path.join(__dirname, '../views/cambridgetest/scripts-listening-practice-v2.js');
const readingJsPath = path.join(__dirname, '../views/cambridgetest/scripts-reading-practice-v2.js');

// Helper code to inject at top of scripts
const phaseCheckFunctions = `
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
    } catch(e) {
      console.warn('Could not fetch system settings, default to phase 1:', e);
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
    } catch(e) {
      return { isLoggedIn: false, isPremium: false };
    }
  }

  function isSectionLocked(gIdx) {
    if (appPhase === 1) return false;
    const user = getUserAccessState();
    const testNum = Number(testParam) || 1;
    const freeTestQuota = appSettings.freeFullMocksCount !== undefined ? Number(appSettings.freeFullMocksCount) : 1;

    if (appPhase === 2) {
      if (user.isLoggedIn) return false;
      if (testNum > freeTestQuota) return true;
      const allowed = appSettings.freeQuestionTypesPerTest !== undefined ? Number(appSettings.freeQuestionTypesPerTest) : 0;
      return gIdx >= allowed;
    }

    if (appPhase === 3) {
      if (user.isPremium) return false;
      if (testNum > freeTestQuota) return true;
      const allowed = appSettings.freeQuestionTypesPerTest !== undefined ? Number(appSettings.freeQuestionTypesPerTest) : 0;
      return gIdx >= allowed;
    }

    return false;
  }

  function isCurrentSessionLocked() {
    if (appPhase === 1) return false;
    const user = getUserAccessState();
    if (appPhase === 2 && user.isLoggedIn) return false;
    if (appPhase === 3 && user.isPremium) return false;

    const testNum = Number(testParam) || 1;
    const freeTestsAllowed = appSettings.freeFullMocksCount !== undefined ? Number(appSettings.freeFullMocksCount) : 1;
    if (testNum > freeTestsAllowed) return true;

    if (practiceMode === 'part') {
      const partIdx = (targetPart || 1) - 1;
      const freePartsAllowed = appSettings.freePartsPerTest !== undefined ? Number(appSettings.freePartsPerTest) : 1;
      if (partIdx >= freePartsAllowed) return true;
    } else if (practiceMode === 'section') {
      const groups = testData.questionGroups || [];
      const gIdx = groups.indexOf(targetGroup);
      const freeSecAllowed = appSettings.freeQuestionTypesPerTest !== undefined ? Number(appSettings.freeQuestionTypesPerTest) : 0;
      if (gIdx >= freeSecAllowed) return true;
    }

    return false;
  }

  function openTestUnlockModal(triggerReason) {
    const modal = document.getElementById('psUnlockModal');
    if (!modal) return;

    const iconWrap = document.getElementById('psUnlockIconWrap');
    const tagBadge = document.getElementById('psUnlockBadge');
    const titleEl = document.getElementById('psUnlockTitle');
    const descEl = document.getElementById('psUnlockDesc');
    const primaryBtn = document.getElementById('psUnlockPrimaryBtn');
    const backBtn = document.getElementById('psUnlockBackBtn');
    const secondaryAction = document.getElementById('psUnlockSecondaryAction');

    const currUrl = encodeURIComponent(window.location.pathname + window.location.search);
    const isSessionBlocked = isCurrentSessionLocked();

    if (backBtn) {
      if (isSessionBlocked) {
        backBtn.textContent = 'Back to Cambridge Tests';
        backBtn.onclick = () => { window.location.href = window.location.pathname.includes('reading') ? '/cambridge-reading.html' : '/cambridge-listening.html'; };
      } else {
        backBtn.textContent = 'Cancel / Keep Practicing';
        backBtn.onclick = () => { closeTestUnlockModal(); };
      }
    }

    if (appPhase === 3) {
      // Phase 3: Paid / Premium
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
      if (descEl) descEl.textContent = 'Upgrade to IELTS Mockpoint Premium to access all Cambridge tests, individual section practices, and full audio transcripts with explanations.';
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
      // Phase 2: Candidate Free Account
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
      if (descEl) descEl.textContent = 'Please sign in or create a free candidate account to practice this section and save your progress to your personal dashboard.';
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
    if (isCurrentSessionLocked()) {
      window.location.href = window.location.pathname.includes('reading') ? '/cambridge-reading.html' : '/cambridge-listening.html';
      return;
    }
    const m = document.getElementById('psUnlockModal');
    if (m) m.classList.remove('open');
  }

  window.openTestUnlockModal = openTestUnlockModal;
  window.closeTestUnlockModal = closeTestUnlockModal;
`;

// ==========================================
// 1. UPDATE LISTENING SCRIPT
// ==========================================
let lJs = fs.readFileSync(listeningJsPath, 'utf8');

if (!lJs.includes('// PHASE & ACCESS CONTROL ENGINE')) {
  // Inject right after variables declaration
  const insertMarker = 'let testData = null;';
  lJs = lJs.replace(insertMarker, `${insertMarker}\n${phaseCheckFunctions}`);
}

// In initTest(): await fetchSystemPhase() and check isCurrentSessionLocked()
const oldInitL = 'testData = json.data;\n\n      // Determine practice mode (full, part, or section)';
const newInitL = `testData = json.data;

      // Fetch System Phase Settings
      await fetchSystemPhase();

      // Determine practice mode (full, part, or section)`;

lJs = lJs.replace(oldInitL, newInitL);

// In initTest() after determinePracticeMode(): check if session is locked
const oldDetL = '// Setup Header Title & Badges\n      setupHeaderTitle();';
const newDetL = `if (isCurrentSessionLocked()) {
        setupHeaderTitle();
        openTestUnlockModal('session');
        partsContainer.innerHTML = \`
          <div style="text-align:center; padding: 60px 20px;">
            <div style="width:64px; height:64px; border-radius:18px; background:#fdecee; border:1.5px solid #fca5a5; display:inline-flex; align-items:center; justify-content:center; color:#e0202d; margin-bottom:16px;">
              <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            </div>
            <h3 style="font-family:'Sora',sans-serif; color:#0b2b52; margin-bottom:8px;">\${appPhase === 3 ? 'Premium Subscription Required' : 'Sign In Required to Unlock'}</h3>
            <p style="color:#64748b; max-width:440px; margin:0 auto 20px;">\${appPhase === 3 ? 'This Cambridge test / section requires an active IELTS Mockpoint Premium subscription.' : 'Please sign in or create a free candidate account to access this Cambridge practice test.'}</p>
            <button type="button" class="cl-btn-finish" onclick="openTestUnlockModal('session')" style="padding:10px 24px; font-weight:700;">Unlock Access Now</button>
          </div>
        \`;
        return;
      }

      // Setup Header Title & Badges
      setupHeaderTitle();`;

lJs = lJs.replace(oldDetL, newDetL);

// In renderQuestionGroup(): check isSectionLocked(groupIndex)
const oldPillL = `    let sectionPillHtml = "";
    if (practiceMode === "section") {
      sectionPillHtml = \`<span class="cl-section-pill active"><i class="bi bi-bullseye"></i> Section Practice Mode</span>\`;
    } else {
      sectionPillHtml = \`<a href="/cambridge-listening-v2?book=\${bookParam}&test=\${testParam}&section=\${qStart}-\${qEnd}" target="_blank" class="cl-section-pill" title="Practice Questions \${qStart}–\${qEnd} in a new tab"><i class="bi bi-box-arrow-up-right"></i> Practice this section only</a>\`;
    }`;

const newPillL = `    let sectionPillHtml = "";
    if (practiceMode === "section") {
      sectionPillHtml = \`<span class="cl-section-pill active"><i class="bi bi-bullseye"></i> Section Practice Mode</span>\`;
    } else {
      const isLocked = isSectionLocked(groupIndex);
      if (isLocked) {
        sectionPillHtml = \`<button type="button" class="cl-section-pill locked" onclick="openTestUnlockModal('section')" title="Locked - Sign In / Upgrade to practice this section only"><i class="bi bi-lock-fill"></i> Practice this section only</button>\`;
      } else {
        sectionPillHtml = \`<a href="/cambridge-listening-v2?book=\${bookParam}&test=\${testParam}&section=\${qStart}-\${qEnd}" target="_blank" class="cl-section-pill" title="Practice Questions \${qStart}–\${qEnd} in a new tab"><i class="bi bi-box-arrow-up-right"></i> Practice this section only</a>\`;
      }
    }`;

lJs = lJs.replace(oldPillL, newPillL);

fs.writeFileSync(listeningJsPath, lJs, 'utf8');
console.log('scripts-listening-practice-v2.js updated successfully!');


// ==========================================
// 2. UPDATE READING SCRIPT
// ==========================================
let rJs = fs.readFileSync(readingJsPath, 'utf8');

if (!rJs.includes('// PHASE & ACCESS CONTROL ENGINE')) {
  const insertMarkerR = 'let testData = null;';
  rJs = rJs.replace(insertMarkerR, `${insertMarkerR}\n${phaseCheckFunctions}`);
}

// In initTest(): await fetchSystemPhase()
const oldInitR = 'testData = json.data;\n\n      // Determine practice mode';
const newInitR = `testData = json.data;

      // Fetch System Phase Settings
      await fetchSystemPhase();

      // Determine practice mode`;

rJs = rJs.replace(oldInitR, newInitR);

// Check if session is locked in Reading
const oldDetR = '// Render Split Screen Content\n      renderSplitScreen();';
const newDetR = `if (isCurrentSessionLocked()) {
        openTestUnlockModal('session');
        const pCol = document.getElementById('passageCol');
        const qCol = document.getElementById('questionsCol');
        if (pCol) {
          pCol.innerHTML = \`
            <div style="text-align:center; padding: 60px 20px;">
              <div style="width:64px; height:64px; border-radius:18px; background:#fdecee; border:1.5px solid #fca5a5; display:inline-flex; align-items:center; justify-content:center; color:#e0202d; margin-bottom:16px;">
                <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </div>
              <h3 style="font-family:'Sora',sans-serif; color:#0b2b52; margin-bottom:8px;">\${appPhase === 3 ? 'Premium Subscription Required' : 'Sign In Required to Unlock'}</h3>
              <p style="color:#64748b; max-width:440px; margin:0 auto 20px;">\${appPhase === 3 ? 'This Cambridge reading test / section requires an active IELTS Mockpoint Premium subscription.' : 'Please sign in or create a free candidate account to access this Cambridge practice test.'}</p>
              <button type="button" class="cr-btn-finish" onclick="openTestUnlockModal('session')" style="padding:10px 24px; font-weight:700;">Unlock Access Now</button>
            </div>
          \`;
        }
        if (qCol) qCol.innerHTML = '';
        return;
      }

      // Render Split Screen Content
      renderSplitScreen();`;

rJs = rJs.replace(oldDetR, newDetR);

// In renderQuestionGroup(): check isSectionLocked(gIdx)
const oldPillR = `    if (!isBankSet) {
      if (practiceMode === "section") {
        sectionPillHtml = \`<span class="cr-section-practice-badge active"><i class="bi bi-bullseye"></i> Section Practice Mode</span>\`;
      } else {
        sectionPillHtml = \`<a href="/cambridge-reading-v2?book=\${bookParam}&test=\${testParam}&section=\${qStart}-\${qEnd}" target="_blank" rel="noopener" class="cr-section-practice-badge" title="Practice Questions \${qStart}–\${qEnd} in a new tab"><i class="bi bi-box-arrow-up-right"></i> Practice this section only</a>\`;
      }
    }`;

const newPillR = `    if (!isBankSet) {
      if (practiceMode === "section") {
        sectionPillHtml = \`<span class="cr-section-practice-badge active"><i class="bi bi-bullseye"></i> Section Practice Mode</span>\`;
      } else {
        const isLocked = isSectionLocked(gIdx);
        if (isLocked) {
          sectionPillHtml = \`<button type="button" class="cr-section-practice-badge locked" onclick="openTestUnlockModal('section')" title="Locked - Sign In / Upgrade to practice this section only"><i class="bi bi-lock-fill"></i> Practice this section only</button>\`;
        } else {
          sectionPillHtml = \`<a href="/cambridge-reading-v2?book=\${bookParam}&test=\${testParam}&section=\${qStart}-\${qEnd}" target="_blank" rel="noopener" class="cr-section-practice-badge" title="Practice Questions \${qStart}–\${qEnd} in a new tab"><i class="bi bi-box-arrow-up-right"></i> Practice this section only</a>\`;
        }
      }
    }`;

rJs = rJs.replace(oldPillR, newPillR);

fs.writeFileSync(readingJsPath, rJs, 'utf8');
console.log('scripts-reading-practice-v2.js updated successfully!');
