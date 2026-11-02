const fs = require('fs');
const path = require('path');

const readingFile = path.resolve(__dirname, '../public/cambridge-reading.html');
const listeningFile = path.resolve(__dirname, '../public/cambridge-listening.html');

// -------------------------------------------------------------
// 1. UPDATE READING
// -------------------------------------------------------------
let rContent = fs.readFileSync(readingFile, 'utf8');

// Target block for openPracticeModal & Unlock Modal in Reading
const rTargetStart = `function openPracticeModal(book, testNo) {`;
const rTargetEnd = `</body>`;

const rStartIndex = rContent.indexOf(rTargetStart);
const rEndIndex = rContent.lastIndexOf(rTargetEnd);

if (rStartIndex === -1 || rEndIndex === -1) {
  console.error('Could not find markers in cambridge-reading.html');
  process.exit(1);
}

const rNewSection = `async function openPracticeModal(book, testNo) {
  const modal = document.getElementById('practiceSectionModal');
  if (!modal) return;

  if (!appSettingsLoaded) {
    await fetchSystemPhase();
  }

  document.getElementById('psBookNum').textContent = book;
  document.getElementById('psTestNum').textContent = testNo;

  const sectionsListEl = document.getElementById('psSectionsList');
  const partsListEl = document.getElementById('psPartsList');
  const passageBaseUrl = \`/cambridge-reading-v2?book=\${book}&test=\${testNo}\`;

  // 1. Whole Passages List (Passage 1, 2, 3)
  const passages = [
    { num: 1, title: 'Passage 1', detail: 'Questions 1–13' },
    { num: 2, title: 'Passage 2', detail: 'Questions 14–26' },
    { num: 3, title: 'Passage 3', detail: 'Questions 27–40' }
  ];

  let pHtml = '';
  passages.forEach((p, idx) => {
    const isLocked = checkItemLocked(idx);
    if (!isLocked) {
      pHtml += \`
        <a href="\${passageBaseUrl}&passage=\${p.num}" target="_blank" class="ps-choice-row">
          <span class="ps-choice-title">\${p.title}</span>
          <span class="ps-choice-detail">\${p.detail}</span>
        </a>
      \`;
    } else {
      pHtml += \`
        <div class="ps-choice-row locked" onclick="openUnlockModal()" title="Locked section">
          <span class="ps-choice-title" style="color:var(--muted,#64748b);">\${p.title}</span>
          <span class="ps-choice-detail" style="color:var(--muted,#64748b);">\${p.detail} \${glassyLockSvg}</span>
        </div>
      \`;
    }
  });
  partsListEl.innerHTML = pHtml;

  // 2. Sections List
  sectionsListEl.innerHTML = '<div style="text-align:center; padding: 14px; color: var(--muted); font-size:0.86rem;">Loading sections...</div>';

  fetch(\`/api/cambridge-reading-v2/\${book}/\${testNo}\`)
    .then(r => r.json())
    .then(d => {
      if (d && d.success && d.data && d.data.questionGroups && d.data.questionGroups.length) {
        const groups = d.data.questionGroups;
        function getIds(g) {
          if (g.questionIds && g.questionIds.length) return g.questionIds;
          if (g.ids && g.ids.length) return g.ids;
          const ids = [];
          if (g.items) {
            g.items.forEach(it => {
              const val = it.id || it.questionNumber || it.qNo;
              if (val) ids.push(Number(val));
            });
          }
          if (g.statements) {
            g.statements.forEach(st => {
              const val = st.id || st.questionNumber || st.qNo;
              if (val) ids.push(Number(val));
            });
          }
          if (g.sentences) {
            g.sentences.forEach(s => {
              const matches = String(s).match(/\\[blank:(\\d+)\\]/g) || [];
              matches.forEach(m => ids.push(Number(m.replace(/\\D/g, ""))));
            });
          }
          if (g.title) {
            const m = g.title.match(/(\\d+)\\s*[-–—]\\s*(\\d+)/);
            if (m && ids.length === 0) {
              for (let i = Number(m[1]); i <= Number(m[2]); i++) ids.push(i);
            }
          }
          return [...new Set(ids)].sort((a, b) => a - b);
        }

        let sHtml = '';
        groups.forEach((g, gIdx) => {
          const qIds = getIds(g);
          if (!qIds.length) return;
          const qStart = qIds[0];
          const qEnd = qIds[qIds.length - 1];
          const typeName = getFriendlyGroupType(g.type);
          const sUrl = \`/cambridge-reading-v2?book=\${book}&test=\${testNo}&section=\${qStart}-\${qEnd}\`;
          const isLocked = checkItemLocked(gIdx);

          if (!isLocked) {
            sHtml += \`
              <a href="\${sUrl}" target="_blank" class="ps-choice-row">
                <span class="ps-choice-q">Questions \${qStart}–\${qEnd}</span>
                <span class="ps-choice-type">\${typeName}</span>
              </a>
            \`;
          } else {
            sHtml += \`
              <div class="ps-choice-row locked" onclick="openUnlockModal()" title="Locked section">
                <span class="ps-choice-q" style="color:var(--muted,#64748b);">Questions \${qStart}–\${qEnd}</span>
                <span class="ps-choice-type" style="color:var(--muted,#64748b);">\${typeName} \${glassyLockSvg}</span>
              </div>
            \`;
          }
        });
        sectionsListEl.innerHTML = sHtml;
      } else {
        sectionsListEl.innerHTML = '<div style="text-align:center; padding:10px; color:var(--muted); font-size:12px;">Please use whole passage practice below</div>';
      }
    })
    .catch(() => {
      sectionsListEl.innerHTML = '<div style="text-align:center; padding:10px; color:var(--muted); font-size:12px;">Please use whole passage practice below</div>';
    });

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closePracticeModal() {
  const modal = document.getElementById('practiceSectionModal');
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = '';
}
window.openPracticeModal = openPracticeModal;
window.closePracticeModal = closePracticeModal;

/* ---------- grid click handlers ---------- */
grid.addEventListener('click', e => {
  const link = e.target.closest('a[data-key]');
  if (link) { done[link.dataset.key] = 1; saveDone(); return; }

  const pBtn = e.target.closest('.practice-btn');
  if (pBtn) {
    e.preventDefault();
    e.stopPropagation();
    const book = Number(pBtn.dataset.book);
    const testNo = Number(pBtn.dataset.test);
    openPracticeModal(book, testNo);
    return;
  }
});

addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closePracticeModal();
    closeUnlockModal();
    setMenu(false);
  }
});

/* ---------- animated counters ---------- */
setupTabs();
render();

const cio=new IntersectionObserver(es=>es.forEach(e=>{
  if(!e.isIntersecting)return;cio.unobserve(e.target);
  const el=e.target,to=+el.dataset.to,suf=el.dataset.suffix||'',t0=performance.now(),dur=1100;
  (function tick(n){const p=Math.min((n-t0)/dur,1),v=Math.round(to*(1-Math.pow(1-p,3)));el.textContent=v+suf;if(p<1)requestAnimationFrame(tick);})(t0);
}),{threshold:.6});
document.querySelectorAll('[data-to]').forEach(el=>cio.observe(el));

/* =========================================================================
   DYNAMIC ACCESS & UNLOCK MODAL LOGIC (Phase 1, 2, 3)
   ========================================================================= */
let appPhase = 1;
let appSettingsLoaded = false;

async function fetchSystemPhase() {
  try {
    const res = await fetch('/api/system-settings');
    const data = await res.json();
    if (data && data.success && data.settings) {
      appPhase = Number(data.settings.currentPhase) || 1;
      appSettingsLoaded = true;
    }
  } catch(e) {
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
  } catch(e) {
    return { isLoggedIn: false, isPremium: false };
  }
}

function checkItemLocked(itemIndex) {
  // Phase 1: Open growth — 100% free for everyone, zero locks
  if (appPhase === 1) return false;

  const user = getUserAccessState();

  // Phase 2: Freemium / Lead Gen — Logged in users get everything free; guests only get item 0 (1 free)
  if (appPhase === 2) {
    if (user.isLoggedIn) return false;
    return itemIndex > 0;
  }

  // Phase 3: Paid / Monetization — Premium users get everything; non-premium get item 0
  if (appPhase === 3) {
    if (user.isPremium) return false;
    return itemIndex > 0;
  }

  return false;
}

const glassyLockSvg = '<span class="ps-lock-glass" title="Locked item"><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg></span>';

function openUnlockModal(phaseOverride) {
  const phase = phaseOverride || appPhase;
  const modal = document.getElementById('psUnlockModal');
  if (!modal) return;

  const iconWrap = document.getElementById('psUnlockIconWrap');
  const tagBadge = document.getElementById('psUnlockBadge');
  const titleEl = document.getElementById('psUnlockTitle');
  const descEl = document.getElementById('psUnlockDesc');
  const primaryBtn = document.getElementById('psUnlockPrimaryBtn');
  const secondaryAction = document.getElementById('psUnlockSecondaryAction');

  const currUrl = encodeURIComponent(window.location.pathname + window.location.search);

  if (phase === 3) {
    // Phase 3: Paid / Premium Upgrade
    if (iconWrap) {
      iconWrap.style.background = 'rgba(224, 32, 45, 0.08)';
      iconWrap.style.borderColor = 'rgba(224, 32, 45, 0.28)';
      iconWrap.style.color = '#e0202d';
      iconWrap.innerHTML = \`
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
        </svg>
      \`;
    }
    if (tagBadge) {
      tagBadge.style.display = 'inline-block';
      tagBadge.style.background = '#fee2e2';
      tagBadge.style.color = '#b91c1c';
      tagBadge.textContent = 'PREMIUM PLAN REQUIRED';
    }
    if (titleEl) titleEl.textContent = 'Unlock with Premium Access';
    if (descEl) descEl.textContent = 'Upgrade to IELTS Mockpoint Premium or purchase a test pass to unlock all practice passages, question types, full mock tests, and AI evaluation without limits.';
    if (primaryBtn) {
      primaryBtn.style.background = '#e0202d';
      primaryBtn.style.boxShadow = '0 6px 18px rgba(224, 32, 45, 0.32)';
      primaryBtn.href = '/pricing';
      primaryBtn.innerHTML = \`<span>Upgrade to Premium / Buy Pass</span> &rarr;\`;
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
    // Phase 2: Freemium / Candidate Sign In
    if (iconWrap) {
      iconWrap.style.background = '#f0f7ff';
      iconWrap.style.borderColor = '#bcd9fb';
      iconWrap.style.color = '#1565c9';
      iconWrap.innerHTML = \`
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
      \`;
    }
    if (tagBadge) {
      tagBadge.style.display = 'inline-block';
      tagBadge.style.background = '#e0f2fe';
      tagBadge.style.color = '#0369a1';
      tagBadge.textContent = 'FREE CANDIDATE ACCOUNT';
    }
    if (titleEl) titleEl.textContent = 'Sign In Required to Unlock';
    if (descEl) descEl.textContent = 'Please log in or create a free candidate account to practice all passages, question types, and save your progress to your personal dashboard.';
    if (primaryBtn) {
      primaryBtn.style.background = '#1565c9';
      primaryBtn.style.boxShadow = '0 6px 18px rgba(21, 101, 201, 0.32)';
      primaryBtn.href = \`/login?redirect=\${currUrl}\`;
      primaryBtn.innerHTML = \`<span>Log In / Register (Free)</span> &rarr;\`;
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

</script>

<!-- Practice Modal matching user reference -->
<div id="practiceSectionModal" class="ps-modal-overlay" onclick="if(event.target===this)closePracticeModal();">
  <div class="ps-modal-card">
    <button type="button" class="ps-close-btn" onclick="closePracticeModal()" aria-label="Close modal">&times;</button>
    <h3 class="ps-modal-title">
      Cambridge IELTS <span id="psBookNum">21</span> Academic<br>
      Reading Test <span id="psTestNum">1</span>
    </h3>

    <div class="ps-sub-label">Choose a section to practice (opens in a new tab):</div>
    <div class="ps-list-group" id="psSectionsList"></div>

    <div class="ps-sub-label" style="margin-top:18px;">Or practice a whole passage:</div>
    <div class="ps-list-group" id="psPartsList"></div>
  </div>
</div>

<!-- Practice Unlock Modal -->
<div id="psUnlockModal" class="ps-modal-overlay" style="z-index: 9999;" onclick="if(event.target===this)closeUnlockModal();">
  <div class="ps-modal-card" style="max-width: 440px; text-align: center; padding: 32px 28px;">
    <button type="button" class="ps-close-btn" onclick="closeUnlockModal()" aria-label="Close modal">&times;</button>
    <div id="psUnlockIconWrap" style="width: 58px; height: 58px; border-radius: 16px; background: #f0f7ff; border: 1.5px solid #bcd9fb; display: inline-flex; align-items: center; justify-content: center; color: var(--blue,#1565c9); margin-bottom: 14px;">
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
      </svg>
    </div>
    <div id="psUnlockBadge" style="display:inline-block; font-size:0.75rem; font-weight:700; letter-spacing:0.04em; padding:3px 10px; border-radius:999px; margin-bottom:10px;">FREE CANDIDATE ACCOUNT</div>
    <h4 id="psUnlockTitle" style="font-family:'Sora',sans-serif; font-size: 1.3rem; font-weight: 800; color: #0b2b52; margin-bottom: 8px;">Sign In Required to Unlock</h4>
    <p id="psUnlockDesc" style="font-size: 0.88rem; color: #64748b; line-height: 1.55; margin-bottom: 22px;">
      Please log in or create a free candidate account to practice all passages, question types, and save your progress to your personal dashboard!
    </p>
    <div style="display: flex; flex-direction: column; gap: 10px;">
      <a href="/login" id="psUnlockPrimaryBtn" style="padding: 12px 20px; border-radius: 10px; background: #1565c9; color: #fff; text-decoration: none; font-weight: 700; font-size: 0.92rem; display: flex; align-items: center; justify-content: center; gap: 8px; transition: transform 0.15s ease;">
        <span>Log In / Register (Free)</span> &rarr;
      </a>
      <div id="psUnlockSecondaryAction" style="display:none; margin-top:2px;"></div>
      <button type="button" onclick="closeUnlockModal()" style="padding: 10px 16px; border-radius: 10px; background: #f1f5f9; border: 1px solid #e2e8f0; color: #475569; font-weight: 600; font-size: 0.86rem; cursor: pointer; transition: background 0.15s ease;">
        Maybe Later
      </button>
    </div>
  </div>
</div>
`;

rContent = rContent.slice(0, rStartIndex) + rNewSection + rContent.slice(rEndIndex);
fs.writeFileSync(readingFile, rContent, 'utf8');
console.log('Successfully updated cambridge-reading.html');

// -------------------------------------------------------------
// 2. UPDATE LISTENING
// -------------------------------------------------------------
let lContent = fs.readFileSync(listeningFile, 'utf8');

const lTargetStart = `function openPracticeModal(book, testNo) {`;
const lTargetEnd = `</body>`;

const lStartIndex = lContent.indexOf(lTargetStart);
const lEndIndex = lContent.lastIndexOf(lTargetEnd);

if (lStartIndex === -1 || lEndIndex === -1) {
  console.error('Could not find markers in cambridge-listening.html');
  process.exit(1);
}

const lNewSection = `async function openPracticeModal(book, testNo) {
  const modal = document.getElementById('practiceSectionModal');
  if (!modal) return;

  if (!appSettingsLoaded) {
    await fetchSystemPhase();
  }

  document.getElementById('psBookNum').textContent = book;
  document.getElementById('psTestNum').textContent = testNo;

  const sectionsListEl = document.getElementById('psSectionsList');
  const partsListEl = document.getElementById('psPartsList');
  const partBaseUrl = \`/cambridge-listening-v2?book=\${book}&test=\${testNo}\`;

  // 1. Whole Parts List (Part 1, 2, 3, 4)
  const parts = [
    { num: 1, title: 'Part 1', detail: 'Questions 1–10' },
    { num: 2, title: 'Part 2', detail: 'Questions 11–20' },
    { num: 3, title: 'Part 3', detail: 'Questions 21–30' },
    { num: 4, title: 'Part 4', detail: 'Questions 31–40' }
  ];

  let pHtml = '';
  parts.forEach((p, idx) => {
    const isLocked = checkItemLocked(idx);
    if (!isLocked) {
      pHtml += \`
        <a href="\${partBaseUrl}&part=\${p.num}" target="_blank" class="ps-choice-row">
          <span class="ps-choice-title">\${p.title}</span>
          <span class="ps-choice-detail">\${p.detail}</span>
        </a>
      \`;
    } else {
      pHtml += \`
        <div class="ps-choice-row locked" onclick="openUnlockModal()" title="Locked section">
          <span class="ps-choice-title" style="color:var(--muted,#64748b);">\${p.title}</span>
          <span class="ps-choice-detail" style="color:var(--muted,#64748b);">\${p.detail} \${glassyLockSvg}</span>
        </div>
      \`;
    }
  });
  partsListEl.innerHTML = pHtml;

  // 2. Sections List
  sectionsListEl.innerHTML = '<div style="text-align:center; padding: 14px; color: var(--muted); font-size:0.86rem;">Loading sections...</div>';

  fetch(\`/api/cambridge-listening-v2/\${book}/\${testNo}\`)
    .then(r => r.json())
    .then(d => {
      if (d && d.success && d.data && d.data.questionGroups && d.data.questionGroups.length) {
        const groups = d.data.questionGroups;
        let sHtml = '';
        groups.forEach((g, gIdx) => {
          const qIds = g.questionIds || g.ids || [];
          const qStart = qIds[0];
          const qEnd = qIds[qIds.length - 1];
          const typeName = getFriendlyGroupType(g.type);
          const sUrl = \`/cambridge-listening-v2?book=\${book}&test=\${testNo}&section=\${qStart}-\${qEnd}\`;
          const isLocked = checkItemLocked(gIdx);

          if (!isLocked) {
            sHtml += \`
              <a href="\${sUrl}" target="_blank" class="ps-choice-row">
                <span class="ps-choice-q">Questions \${qStart}–\${qEnd}</span>
                <span class="ps-choice-type">\${typeName}</span>
              </a>
            \`;
          } else {
            sHtml += \`
              <div class="ps-choice-row locked" onclick="openUnlockModal()" title="Locked section">
                <span class="ps-choice-q" style="color:var(--muted,#64748b);">Questions \${qStart}–\${qEnd}</span>
                <span class="ps-choice-type" style="color:var(--muted,#64748b);">\${typeName} \${glassyLockSvg}</span>
              </div>
            \`;
          }
        });
        sectionsListEl.innerHTML = sHtml;
      } else {
        sectionsListEl.innerHTML = '<div style="text-align:center; padding:10px; color:var(--muted); font-size:12px;">Please use whole part practice below</div>';
      }
    })
    .catch(() => {
      sectionsListEl.innerHTML = '<div style="text-align:center; padding:10px; color:var(--muted); font-size:12px;">Please use whole part practice below</div>';
    });

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closePracticeModal() {
  const modal = document.getElementById('practiceSectionModal');
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = '';
}
window.openPracticeModal = openPracticeModal;
window.closePracticeModal = closePracticeModal;

/* ---------- grid click handlers ---------- */
grid.addEventListener('click', e => {
  const link = e.target.closest('a[data-key]');
  if (link) { done[link.dataset.key] = 1; saveDone(); return; }

  const pBtn = e.target.closest('.practice-btn');
  if (pBtn) {
    e.preventDefault();
    e.stopPropagation();
    const book = Number(pBtn.dataset.book);
    const testNo = Number(pBtn.dataset.test);
    openPracticeModal(book, testNo);
    return;
  }
});

addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closePracticeModal();
    closeUnlockModal();
    setMenu(false);
  }
});

/* ---------- animated counters ---------- */
setupTabs();
render();

const cio=new IntersectionObserver(es=>es.forEach(e=>{
  if(!e.isIntersecting)return;cio.unobserve(e.target);
  const el=e.target,to=+el.dataset.to,suf=el.dataset.suffix||'',t0=performance.now(),dur=1100;
  (function tick(n){const p=Math.min((n-t0)/dur,1),v=Math.round(to*(1-Math.pow(1-p,3)));el.textContent=v+suf;if(p<1)requestAnimationFrame(tick);})(t0);
}),{threshold:.6});
document.querySelectorAll('[data-to]').forEach(el=>cio.observe(el));

/* =========================================================================
   DYNAMIC ACCESS & UNLOCK MODAL LOGIC (Phase 1, 2, 3)
   ========================================================================= */
let appPhase = 1;
let appSettingsLoaded = false;

async function fetchSystemPhase() {
  try {
    const res = await fetch('/api/system-settings');
    const data = await res.json();
    if (data && data.success && data.settings) {
      appPhase = Number(data.settings.currentPhase) || 1;
      appSettingsLoaded = true;
    }
  } catch(e) {
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
  } catch(e) {
    return { isLoggedIn: false, isPremium: false };
  }
}

function checkItemLocked(itemIndex) {
  // Phase 1: Open growth — 100% free for everyone, zero locks
  if (appPhase === 1) return false;

  const user = getUserAccessState();

  // Phase 2: Freemium / Lead Gen — Logged in users get everything free; guests only get item 0 (1 free)
  if (appPhase === 2) {
    if (user.isLoggedIn) return false;
    return itemIndex > 0;
  }

  // Phase 3: Paid / Monetization — Premium users get everything; non-premium get item 0
  if (appPhase === 3) {
    if (user.isPremium) return false;
    return itemIndex > 0;
  }

  return false;
}

const glassyLockSvg = '<span class="ps-lock-glass" title="Locked item"><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg></span>';

function openUnlockModal(phaseOverride) {
  const phase = phaseOverride || appPhase;
  const modal = document.getElementById('psUnlockModal');
  if (!modal) return;

  const iconWrap = document.getElementById('psUnlockIconWrap');
  const tagBadge = document.getElementById('psUnlockBadge');
  const titleEl = document.getElementById('psUnlockTitle');
  const descEl = document.getElementById('psUnlockDesc');
  const primaryBtn = document.getElementById('psUnlockPrimaryBtn');
  const secondaryAction = document.getElementById('psUnlockSecondaryAction');

  const currUrl = encodeURIComponent(window.location.pathname + window.location.search);

  if (phase === 3) {
    // Phase 3: Paid / Premium Upgrade
    if (iconWrap) {
      iconWrap.style.background = 'rgba(224, 32, 45, 0.08)';
      iconWrap.style.borderColor = 'rgba(224, 32, 45, 0.28)';
      iconWrap.style.color = '#e0202d';
      iconWrap.innerHTML = \`
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
        </svg>
      \`;
    }
    if (tagBadge) {
      tagBadge.style.display = 'inline-block';
      tagBadge.style.background = '#fee2e2';
      tagBadge.style.color = '#b91c1c';
      tagBadge.textContent = 'PREMIUM PLAN REQUIRED';
    }
    if (titleEl) titleEl.textContent = 'Unlock with Premium Access';
    if (descEl) descEl.textContent = 'Upgrade to IELTS Mockpoint Premium or purchase a test pass to unlock all practice passages, question types, full mock tests, and AI evaluation without limits.';
    if (primaryBtn) {
      primaryBtn.style.background = '#e0202d';
      primaryBtn.style.boxShadow = '0 6px 18px rgba(224, 32, 45, 0.32)';
      primaryBtn.href = '/pricing';
      primaryBtn.innerHTML = \`<span>Upgrade to Premium / Buy Pass</span> &rarr;\`;
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
    // Phase 2: Freemium / Candidate Sign In
    if (iconWrap) {
      iconWrap.style.background = '#f0f7ff';
      iconWrap.style.borderColor = '#bcd9fb';
      iconWrap.style.color = '#1565c9';
      iconWrap.innerHTML = \`
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
      \`;
    }
    if (tagBadge) {
      tagBadge.style.display = 'inline-block';
      tagBadge.style.background = '#e0f2fe';
      tagBadge.style.color = '#0369a1';
      tagBadge.textContent = 'FREE CANDIDATE ACCOUNT';
    }
    if (titleEl) titleEl.textContent = 'Sign In Required to Unlock';
    if (descEl) descEl.textContent = 'Please log in or create a free candidate account to practice all passages, question types, and save your progress to your personal dashboard.';
    if (primaryBtn) {
      primaryBtn.style.background = '#1565c9';
      primaryBtn.style.boxShadow = '0 6px 18px rgba(21, 101, 201, 0.32)';
      primaryBtn.href = \`/login?redirect=\${currUrl}\`;
      primaryBtn.innerHTML = \`<span>Log In / Register (Free)</span> &rarr;\`;
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

</script>

<!-- Practice Modal matching user reference -->
<div id="practiceSectionModal" class="ps-modal-overlay" onclick="if(event.target===this)closePracticeModal();">
  <div class="ps-modal-card">
    <button type="button" class="ps-close-btn" onclick="closePracticeModal()" aria-label="Close modal">&times;</button>
    <h3 class="ps-modal-title">
      Cambridge IELTS <span id="psBookNum">21</span> Academic<br>
      Listening Test <span id="psTestNum">1</span>
    </h3>

    <div class="ps-sub-label">Choose a section to practice (opens in a new tab):</div>
    <div class="ps-list-group" id="psSectionsList"></div>

    <div class="ps-sub-label" style="margin-top:18px;">Or practice a whole part:</div>
    <div class="ps-list-group" id="psPartsList"></div>
  </div>
</div>

<!-- Practice Unlock Modal -->
<div id="psUnlockModal" class="ps-modal-overlay" style="z-index: 9999;" onclick="if(event.target===this)closeUnlockModal();">
  <div class="ps-modal-card" style="max-width: 440px; text-align: center; padding: 32px 28px;">
    <button type="button" class="ps-close-btn" onclick="closeUnlockModal()" aria-label="Close modal">&times;</button>
    <div id="psUnlockIconWrap" style="width: 58px; height: 58px; border-radius: 16px; background: #f0f7ff; border: 1.5px solid #bcd9fb; display: inline-flex; align-items: center; justify-content: center; color: var(--blue,#1565c9); margin-bottom: 14px;">
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
      </svg>
    </div>
    <div id="psUnlockBadge" style="display:inline-block; font-size:0.75rem; font-weight:700; letter-spacing:0.04em; padding:3px 10px; border-radius:999px; margin-bottom:10px;">FREE CANDIDATE ACCOUNT</div>
    <h4 id="psUnlockTitle" style="font-family:'Sora',sans-serif; font-size: 1.3rem; font-weight: 800; color: #0b2b52; margin-bottom: 8px;">Sign In Required to Unlock</h4>
    <p id="psUnlockDesc" style="font-size: 0.88rem; color: #64748b; line-height: 1.55; margin-bottom: 22px;">
      Please log in or create a free candidate account to practice all passages, question types, and save your progress to your personal dashboard!
    </p>
    <div style="display: flex; flex-direction: column; gap: 10px;">
      <a href="/login" id="psUnlockPrimaryBtn" style="padding: 12px 20px; border-radius: 10px; background: #1565c9; color: #fff; text-decoration: none; font-weight: 700; font-size: 0.92rem; display: flex; align-items: center; justify-content: center; gap: 8px; transition: transform 0.15s ease;">
        <span>Log In / Register (Free)</span> &rarr;
      </a>
      <div id="psUnlockSecondaryAction" style="display:none; margin-top:2px;"></div>
      <button type="button" onclick="closeUnlockModal()" style="padding: 10px 16px; border-radius: 10px; background: #f1f5f9; border: 1px solid #e2e8f0; color: #475569; font-weight: 600; font-size: 0.86rem; cursor: pointer; transition: background 0.15s ease;">
        Maybe Later
      </button>
    </div>
  </div>
</div>
`;

lContent = lContent.slice(0, lStartIndex) + lNewSection + lContent.slice(lEndIndex);
fs.writeFileSync(listeningFile, lContent, 'utf8');
console.log('Successfully updated cambridge-listening.html');
