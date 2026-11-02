const fs = require('fs');
const path = require('path');

// 1. Update listening-exercises.html
const listeningPath = path.join(__dirname, '..', 'public', 'listening-exercises.html');
let listening = fs.readFileSync(listeningPath, 'utf8');

// Update JS styles in openExUnlockModal
listening = listening.replace(
  `        if (iconWrap) {
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
        if (descEl) descEl.textContent = 'Please log in or create a free candidate account to practice all Listening exercises for every question type and save your progress to your personal dashboard.';
        if (primaryBtn) {
          primaryBtn.style.background = '#1565c9';
          primaryBtn.href = '/login?redirect=' + encodeURIComponent(window.location.pathname + window.location.search);
          primaryBtn.innerHTML = '<span>Sign In / Register Free</span> &rarr;';
        }`,
  `        if (iconWrap) {
          iconWrap.style.background = '#fdecee';
          iconWrap.style.borderColor = 'rgba(224, 32, 45, 0.28)';
          iconWrap.style.color = '#e0202d';
          iconWrap.innerHTML = '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#e0202d" stroke-width="2.2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>';
        }
        if (tagBadge) {
          tagBadge.style.background = '#fdecee';
          tagBadge.style.color = '#e0202d';
          tagBadge.style.border = '1px solid rgba(224, 32, 45, 0.25)';
          tagBadge.textContent = 'FREE CANDIDATE ACCOUNT';
        }
        if (titleEl) titleEl.textContent = 'Sign In Required to Unlock';
        if (descEl) descEl.textContent = 'Please log in or create a free candidate account to practice all Listening exercises for every question type and save your progress to your personal dashboard.';
        if (primaryBtn) {
          primaryBtn.style.background = '#e0202d';
          primaryBtn.style.boxShadow = '0 8px 20px rgba(224, 32, 45, 0.28)';
          primaryBtn.href = '/login?redirect=' + encodeURIComponent(window.location.pathname + window.location.search);
          primaryBtn.innerHTML = '<span>Sign In / Register Free</span> &rarr;';
        }`
);

// Update HTML markup of ex-unlock-modal in listening-exercises.html
const oldModalHtmlListening = `<!-- Exercise Unlock Modal -->
<div id="ex-unlock-modal" style="position:fixed; inset:0; z-index:99999; background:rgba(11,43,82,0.52); backdrop-filter:blur(6px); -webkit-backdrop-filter:blur(6px); display:none; align-items:center; justify-content:center; padding:16px;" onclick="if(event.target===this)closeExUnlockModal();">
  <div style="background:#fff; border-radius:20px; max-width:440px; width:100%; text-align:center; padding:34px 28px; position:relative; box-shadow:0 24px 60px rgba(11,43,82,0.22); border:1.5px solid #e2e8f0;">
    <button type="button" onclick="closeExUnlockModal()" style="position:absolute; right:16px; top:16px; width:32px; height:32px; border-radius:50%; border:none; background:#f1f5f9; color:#475569; font-size:18px; cursor:pointer;">&times;</button>
    <div id="exUnlockIconWrap" style="width:58px; height:58px; border-radius:16px; background:#f0f7ff; border:1.5px solid #bcd9fb; display:inline-flex; align-items:center; justify-content:center; color:#1565c9; margin:0 auto 14px;">
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
    </div>
    <div id="exUnlockBadge" style="display:inline-block; font-size:0.75rem; font-weight:700; letter-spacing:0.04em; padding:3px 10px; border-radius:999px; margin-bottom:10px; background:#e0f2fe; color:#0369a1;">FREE CANDIDATE ACCOUNT</div>
    <h3 id="exUnlockTitle" style="font-family:'Sora',sans-serif; font-size:1.3rem; font-weight:800; color:#0b2b52; margin-bottom:8px;">Sign In Required to Unlock</h3>
    <p id="exUnlockDesc" style="font-size:0.88rem; color:#64748b; line-height:1.55; margin-bottom:22px;">
      Please log in or create a free candidate account to practice all Listening exercises for every question type and save your progress to your personal dashboard.
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
</div>`;

const newModalHtmlListening = `<!-- Exercise Unlock Modal -->
<div id="ex-unlock-modal" style="position:fixed; inset:0; z-index:99999; background:rgba(11,43,82,0.58); backdrop-filter:blur(6px); -webkit-backdrop-filter:blur(6px); display:none; align-items:center; justify-content:center; padding:16px;" onclick="if(event.target===this)closeExUnlockModal();">
  <div style="background:#fff; border-radius:24px; max-width:440px; width:100%; text-align:center; padding:36px 30px; position:relative; box-shadow:0 24px 60px rgba(11,43,82,0.24); border:1.5px solid #dbeafe; overflow:hidden;">
    <div style="position:absolute; top:0; left:0; width:100%; height:4px; background:linear-gradient(90deg, #0b2b52 0%, #1565c9 50%, #e0202d 100%);"></div>
    <button type="button" onclick="closeExUnlockModal()" style="position:absolute; right:16px; top:16px; width:34px; height:34px; border-radius:50%; border:1px solid #e2e8f0; background:#f8fafc; color:#0b2b52; font-size:18px; font-weight:700; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all 0.2s;">&times;</button>
    <div id="exUnlockIconWrap" style="width:58px; height:58px; border-radius:16px; background:#fdecee; border:1.5px solid rgba(224, 32, 45, 0.28); display:inline-flex; align-items:center; justify-content:center; color:#e0202d; margin:0 auto 16px;">
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#e0202d" stroke-width="2.2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
    </div>
    <div id="exUnlockBadge" style="display:inline-block; font-size:0.75rem; font-weight:800; letter-spacing:0.06em; padding:4px 12px; border-radius:999px; margin-bottom:12px; background:#fdecee; color:#e0202d; border:1px solid rgba(224, 32, 45, 0.25);">FREE CANDIDATE ACCOUNT</div>
    <h3 id="exUnlockTitle" style="font-family:'Sora',sans-serif; font-size:1.35rem; font-weight:800; color:#0b2b52; margin-bottom:10px; line-height:1.3;">Sign In Required to Unlock</h3>
    <p id="exUnlockDesc" style="font-size:0.89rem; color:#475569; line-height:1.6; margin-bottom:24px;">
      Please log in or create a free candidate account to practice all Listening exercises for every question type and save your progress to your personal dashboard.
    </p>
    <div style="display:flex; flex-direction:column; gap:10px;">
      <a href="/login?redirect=" id="exUnlockPrimaryBtn" style="padding:13px 22px; border-radius:12px; background:#e0202d; color:#fff; text-decoration:none; font-weight:700; font-size:0.95rem; font-family:'Sora',sans-serif; display:flex; align-items:center; justify-content:center; gap:8px; box-shadow:0 8px 20px rgba(224, 32, 45, 0.28); transition:all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);">
        <span>Sign In / Register Free</span> &rarr;
      </a>
      <button type="button" onclick="closeExUnlockModal()" style="padding:11px 18px; border-radius:12px; background:#f8fafc; border:1.5px solid #dbeafe; color:#0b2b52; font-weight:700; font-size:0.88rem; font-family:'Sora',sans-serif; cursor:pointer; transition:all 0.2s;">
        Maybe Later
      </button>
    </div>
  </div>
</div>`;

listening = listening.replace(oldModalHtmlListening, newModalHtmlListening);
fs.writeFileSync(listeningPath, listening, 'utf8');
console.log('Updated listening-exercises.html unlock modal!');

// 2. Update reading-exercises.html
const readingPath = path.join(__dirname, '..', 'public', 'reading-exercises.html');
let reading = fs.readFileSync(readingPath, 'utf8');

reading = reading.replace(
  `        if (iconWrap) {
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
        if (descEl) descEl.textContent = 'Please log in or create a free candidate account to practice all Reading exercises for every question type and save your progress to your personal dashboard.';
        if (primaryBtn) {
          primaryBtn.style.background = '#1565c9';
          primaryBtn.href = '/login?redirect=' + encodeURIComponent(window.location.pathname + window.location.search);
          primaryBtn.innerHTML = '<span>Sign In / Register Free</span> &rarr;';
        }`,
  `        if (iconWrap) {
          iconWrap.style.background = '#fdecee';
          iconWrap.style.borderColor = 'rgba(224, 32, 45, 0.28)';
          iconWrap.style.color = '#e0202d';
          iconWrap.innerHTML = '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#e0202d" stroke-width="2.2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>';
        }
        if (tagBadge) {
          tagBadge.style.background = '#fdecee';
          tagBadge.style.color = '#e0202d';
          tagBadge.style.border = '1px solid rgba(224, 32, 45, 0.25)';
          tagBadge.textContent = 'FREE CANDIDATE ACCOUNT';
        }
        if (titleEl) titleEl.textContent = 'Sign In Required to Unlock';
        if (descEl) descEl.textContent = 'Please log in or create a free candidate account to practice all Reading exercises for every question type and save your progress to your personal dashboard.';
        if (primaryBtn) {
          primaryBtn.style.background = '#e0202d';
          primaryBtn.style.boxShadow = '0 8px 20px rgba(224, 32, 45, 0.28)';
          primaryBtn.href = '/login?redirect=' + encodeURIComponent(window.location.pathname + window.location.search);
          primaryBtn.innerHTML = '<span>Sign In / Register Free</span> &rarr;';
        }`
);

const oldModalHtmlReading = oldModalHtmlListening.replace(/Listening/g, 'Reading');
const newModalHtmlReading = newModalHtmlListening.replace(/Listening/g, 'Reading');

reading = reading.replace(oldModalHtmlReading, newModalHtmlReading);
fs.writeFileSync(readingPath, reading, 'utf8');
console.log('Updated reading-exercises.html unlock modal!');

// 3. Update mocks.html
const mocksPath = path.join(__dirname, '..', 'FrontPage', 'Frontend', 'mocks.html');
let mocks = fs.readFileSync(mocksPath, 'utf8');

mocks = mocks.replace(
  `    if (iconWrap) {
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
    }`,
  `    if (iconWrap) {
      iconWrap.style.background = '#fdecee';
      iconWrap.style.borderColor = 'rgba(224, 32, 45, 0.28)';
      iconWrap.style.color = '#e0202d';
      iconWrap.innerHTML = '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#e0202d" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>';
    }
    if (tagBadge) {
      tagBadge.style.background = '#fdecee';
      tagBadge.style.color = '#e0202d';
      tagBadge.style.border = '1px solid rgba(224, 32, 45, 0.25)';
      tagBadge.textContent = 'FREE CANDIDATE ACCOUNT';
    }
    if (titleEl) titleEl.textContent = 'Sign In Required to Unlock';
    if (descEl) descEl.textContent = 'Please log in or create a free candidate account to unlock all 12 Academic and 9 Premium mock tests and track your progress on your personal dashboard.';
    if (primaryBtn) {
      primaryBtn.style.background = '#e0202d';
      primaryBtn.style.boxShadow = '0 8px 20px rgba(224, 32, 45, 0.28)';
      primaryBtn.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
      primaryBtn.innerHTML = '<span>Sign In / Register Free</span> &rarr;';
    }`
);

fs.writeFileSync(mocksPath, mocks, 'utf8');
console.log('Updated mocks.html unlock modal!');

console.log('All unlock modals updated to British Council Red and Blue palette!');
