const fs = require('fs');
const path = require('path');

const readingPath = path.resolve(__dirname, '../public/reading-exercises.html');
const listeningPath = path.resolve(__dirname, '../public/listening-exercises.html');

function updateExercisesFile(filePath, skillName) {
  let html = fs.readFileSync(filePath, 'utf8');

  // 1. CSS
  const css = `
.card.is-locked {
  position: relative;
  cursor: pointer;
}
.card.is-locked .btn-locked {
  background: #f1f5f9 !important;
  color: #64748b !important;
  border: 1px solid #cbd5e1 !important;
  font-weight: 700;
  border-radius: 8px;
  padding: 8px 14px;
  cursor: pointer;
}
.card.is-locked:hover .btn-locked {
  background: #e2e8f0 !important;
  color: #1e293b !important;
}
.card-glass-lock {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 32px;
  height: 32px;
  border-radius: 9px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(148, 163, 184, 0.4);
  box-shadow: 0 4px 12px rgba(11, 43, 82, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  z-index: 5;
  transition: all 0.2s ease;
}
.card.is-locked:hover .card-glass-lock {
  background: rgba(224, 32, 45, 0.12);
  border-color: rgba(224, 32, 45, 0.45);
  color: #e0202d;
  transform: scale(1.08);
}
`;
  html = html.replace('</style>', `${css}\n</style>`);

  // 2. Modal HTML before </body>
  const modalHtml = `
<!-- Exercise Unlock Modal -->
<div id="ex-unlock-modal" style="position:fixed; inset:0; z-index:99999; background:rgba(11,43,82,0.52); backdrop-filter:blur(6px); -webkit-backdrop-filter:blur(6px); display:none; align-items:center; justify-content:center; padding:16px;" onclick="if(event.target===this)closeExUnlockModal();">
  <div style="background:#fff; border-radius:20px; max-width:440px; width:100%; text-align:center; padding:34px 28px; position:relative; box-shadow:0 24px 60px rgba(11,43,82,0.22); border:1.5px solid #e2e8f0;">
    <button type="button" onclick="closeExUnlockModal()" style="position:absolute; right:16px; top:16px; width:32px; height:32px; border-radius:50%; border:none; background:#f1f5f9; color:#475569; font-size:18px; cursor:pointer;">&times;</button>
    <div id="exUnlockIconWrap" style="width:58px; height:58px; border-radius:16px; background:#f0f7ff; border:1.5px solid #bcd9fb; display:inline-flex; align-items:center; justify-content:center; color:#1565c9; margin:0 auto 14px;">
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
    </div>
    <div id="exUnlockBadge" style="display:inline-block; font-size:0.75rem; font-weight:700; letter-spacing:0.04em; padding:3px 10px; border-radius:999px; margin-bottom:10px; background:#e0f2fe; color:#0369a1;">FREE CANDIDATE ACCOUNT</div>
    <h3 id="exUnlockTitle" style="font-family:'Sora',sans-serif; font-size:1.3rem; font-weight:800; color:#0b2b52; margin-bottom:8px;">Sign In Required to Unlock</h3>
    <p id="exUnlockDesc" style="font-size:0.88rem; color:#64748b; line-height:1.55; margin-bottom:22px;">
      Please log in or create a free candidate account to practice all ${skillName} exercises for every question type and save your progress to your personal dashboard.
    </p>
    <div style="display:flex; flex-direction:column; gap:10px;">
      <a href="/login?redirect=" id="exUnlockPrimaryBtn" style="padding:12px 20px; border-radius:10px; background:#1565c9; color:#fff; text-decoration:none; font-weight:700; font-size:0.92rem; display:flex; align-items:center; justify-content:center; gap:8px;">
        <span>Sign In / Register Free</span> &rarr;
      </a>
      <button type="button" onclick="closeExUnlockModal()" style="padding:10px 16px; border-radius:10px; background:#f1f5f9; border:1px solid #e2e8f0; color:#475569; font-weight:600; font-size:0.86rem; cursor:pointer;">
        Maybe Later
      </button>
    </div>
  </div>
</div>
`;
  html = html.replace('</body>', `${modalHtml}\n</body>`);

  // 3. Logic injection in script
  const jsHelper = `
    let exPhase = 1;
    let exFreeQuota = 2;

    fetch('/api/system-settings')
      .then(r => r.json())
      .then(d => {
        if (d && d.success && d.settings) {
          exPhase = Number(d.settings.currentPhase) || 1;
          exFreeQuota = d.settings.freePracticeHubSets !== undefined ? Number(d.settings.freePracticeHubSets) : 2;
          applyFilterAndSearch();
        }
      }).catch(() => {});

    function isExerciseLocked(idx) {
      if (exPhase === 1) return false;
      let user = null;
      try { user = JSON.parse(localStorage.getItem('user') || 'null'); } catch(e) {}
      const isLoggedIn = !!(user && (user.email || user.name));
      const isPremium = !!(user && (user.isPremium || user.role === 'admin' || user.plan === 'premium'));
      if (exPhase === 2 && isLoggedIn) return false;
      if (exPhase === 3 && isPremium) return false;
      return idx >= exFreeQuota;
    }

    function openExUnlockModal(phaseOverride) {
      const phase = phaseOverride || exPhase;
      const modal = document.getElementById('ex-unlock-modal');
      if (!modal) return;
      const iconWrap = document.getElementById('exUnlockIconWrap');
      const tagBadge = document.getElementById('exUnlockBadge');
      const titleEl = document.getElementById('exUnlockTitle');
      const descEl = document.getElementById('exUnlockDesc');
      const primaryBtn = document.getElementById('exUnlockPrimaryBtn');

      if (phase === 3) {
        if (iconWrap) {
          iconWrap.style.background = 'rgba(224, 32, 45, 0.08)';
          iconWrap.style.borderColor = 'rgba(224, 32, 45, 0.28)';
          iconWrap.style.color = '#e0202d';
          iconWrap.innerHTML = '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>';
        }
        if (tagBadge) {
          tagBadge.style.background = '#fee2e2';
          tagBadge.style.color = '#b91c1c';
          tagBadge.textContent = 'PREMIUM PLAN REQUIRED';
        }
        if (titleEl) titleEl.textContent = 'Unlock with Premium Access';
        if (descEl) descEl.textContent = 'Upgrade to IELTS Mockpoint Premium or purchase a test pass to unlock all ${skillName} exercises without limits.';
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
          iconWrap.innerHTML = '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>';
        }
        if (tagBadge) {
          tagBadge.style.background = '#e0f2fe';
          tagBadge.style.color = '#0369a1';
          tagBadge.textContent = 'FREE CANDIDATE ACCOUNT';
        }
        if (titleEl) titleEl.textContent = 'Sign In Required to Unlock';
        if (descEl) descEl.textContent = 'Please log in or create a free candidate account to practice all ${skillName} exercises for every question type and save your progress to your personal dashboard.';
        if (primaryBtn) {
          primaryBtn.style.background = '#1565c9';
          primaryBtn.href = '/login?redirect=' + encodeURIComponent(window.location.pathname + window.location.search);
          primaryBtn.innerHTML = '<span>Sign In / Register Free</span> &rarr;';
        }
      }

      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }

    function closeExUnlockModal() {
      const modal = document.getElementById('ex-unlock-modal');
      if (modal) modal.style.display = 'none';
      document.body.style.overflow = '';
    }
    window.openExUnlockModal = openExUnlockModal;
    window.closeExUnlockModal = closeExUnlockModal;
`;

  // Inject jsHelper before function renderExercises
  html = html.replace('function renderExercises(items) {', `${jsHelper}\n    function renderExercises(items) {`);

  // In renderExercises: update card mapping
  const oldCard = `<article class="card \${isDone ? 'done' : ''}" data-k="\${storageKey}" data-source="\${ex.sourceType || 'cambridge'}">
            <span class="bignum">\${numStr}</span>
            <span class="\${pillClass}">\${escapeHtml(pillText)}</span>
            <h3>\${escapeHtml(titleText)}</h3>
            <div class="sub-source">\${escapeHtml(sourceText)}</div>
            <div class="chips">
              <span title="\${escapeHtml(ex.passageTitle)}">\${escapeHtml(ex.passageTitle.slice(0, 32))}\${ex.passageTitle.length > 32 ? '...' : ''}</span>
              <span class="q-range-chip">\${escapeHtml(ex.qRange)}</span>
              \${isDone ? '<span class="done">Completed ✓</span>' : ''}
            </div>
            <div class="card-actions">
              <span class="q-count">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                \${ex.questionsCount || 6} questions
              </span>
              <a href="\${ex.link}" target="_blank" rel="noopener noreferrer" class="btn btn-red" onclick="markDone('\${storageKey}')">
                Start practice →
              </a>
            </div>
          </article>`;

  const newCard = `const isLocked = isExerciseLocked(idx);
        const lockIcon = isLocked ? '<div class="card-glass-lock" title="Sign in to unlock"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.3"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg></div>' : '';
        const btnHtml = isLocked
          ? '<button type="button" class="btn btn-locked" onclick="openExUnlockModal()">Unlock Exercise 🔒</button>'
          : \`<a href="\${ex.link}" target="_blank" rel="noopener noreferrer" class="btn btn-red" onclick="markDone('\${storageKey}')">Start practice →</a>\`;

        return \`
          <article class="card \${isDone ? 'done' : ''} \${isLocked ? 'is-locked' : ''}" data-k="\${storageKey}" data-source="\${ex.sourceType || 'cambridge'}" onclick="\${isLocked ? 'openExUnlockModal()' : ''}">
            \${lockIcon}
            <span class="bignum">\${numStr}</span>
            <span class="\${pillClass}">\${escapeHtml(pillText)}</span>
            <h3>\${escapeHtml(titleText)}</h3>
            <div class="sub-source">\${escapeHtml(sourceText)}</div>
            <div class="chips">
              <span title="\${escapeHtml(ex.passageTitle)}">\${escapeHtml(ex.passageTitle.slice(0, 32))}\${ex.passageTitle.length > 32 ? '...' : ''}</span>
              <span class="q-range-chip">\${escapeHtml(ex.qRange)}</span>
              \${isDone ? '<span class="done">Completed ✓</span>' : ''}
            </div>
            <div class="card-actions">
              <span class="q-count">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                \${ex.questionsCount || 6} questions
              </span>
              \${btnHtml}
            </div>
          </article>
        \`;`;

  html = html.replace(oldCard, newCard);
  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`Updated ${path.basename(filePath)} successfully.`);
}

updateExercisesFile(readingPath, 'Reading');
updateExercisesFile(listeningPath, 'Listening');
