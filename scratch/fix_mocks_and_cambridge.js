const fs = require('fs');
const path = require('path');

// =========================================================================
// 1. FIX CAMBRIDGE READING & LISTENING MODAL Z-INDEX (Bug 2)
// =========================================================================
function fixCambridgeZIndex(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Change psUnlockModal style="z-index: 9999;" to style="z-index: 200000 !important;"
  content = content.replace(
    'id="psUnlockModal" class="ps-modal-overlay" style="z-index: 9999;"',
    'id="psUnlockModal" class="ps-modal-overlay" style="z-index: 200000 !important;"'
  );
  content = content.replace(
    `id="psUnlockModal" class="ps-modal-overlay" style="z-index:9999;"`,
    'id="psUnlockModal" class="ps-modal-overlay" style="z-index: 200000 !important;"'
  );

  // Also in openUnlockModal, ensure modal.style.zIndex is 200000
  if (!content.includes("modal.style.zIndex = '200000'")) {
    content = content.replace(
      "const modal = document.getElementById('psUnlockModal');\n  if (!modal) return;",
      "const modal = document.getElementById('psUnlockModal');\n  if (!modal) return;\n  modal.style.zIndex = '200000';"
    );
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Fixed Cambridge z-index in:', path.basename(filePath));
}

fixCambridgeZIndex(path.join(__dirname, '..', 'public', 'cambridge-reading.html'));
fixCambridgeZIndex(path.join(__dirname, '..', 'public', 'cambridge-listening.html'));


// =========================================================================
// 2. FIX MOCKS.HTML POPUP RE-OPEN & BCACHE BACK BUTTON (Bug 1)
// =========================================================================
const mocksPath = path.join(__dirname, '..', 'FrontPage', 'Frontend', 'mocks.html');
let mocks = fs.readFileSync(mocksPath, 'utf8');

// HTML for mock-unlock-modal
const mockUnlockModalHtml = `
<!-- Full Mock Test Unlock Modal -->
<div id="mock-unlock-modal" style="position:fixed; inset:0; z-index:999999; background:rgba(11,43,82,0.58); backdrop-filter:blur(6px); -webkit-backdrop-filter:blur(6px); display:none; align-items:center; justify-content:center; padding:16px;" onclick="if(event.target===this)closeMockUnlockModal();">
  <div style="background:#fff; border-radius:24px; max-width:440px; width:100%; text-align:center; padding:36px 30px; position:relative; box-shadow:0 24px 60px rgba(11,43,82,0.24); border:1.5px solid #dbeafe; overflow:hidden;">
    <div style="position:absolute; top:0; left:0; width:100%; height:4px; background:linear-gradient(90deg, #0b2b52 0%, #1565c9 50%, #e0202d 100%);"></div>
    <button type="button" onclick="closeMockUnlockModal()" style="position:absolute; right:16px; top:16px; width:34px; height:34px; border-radius:50%; border:1px solid #e2e8f0; background:#f8fafc; color:#0b2b52; font-size:18px; font-weight:700; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all 0.2s;">&times;</button>
    <div id="mockUnlockIconWrap" style="width:58px; height:58px; border-radius:16px; background:#fdecee; border:1.5px solid rgba(224, 32, 45, 0.28); display:inline-flex; align-items:center; justify-content:center; color:#e0202d; margin:0 auto 16px;">
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#e0202d" stroke-width="2.2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
    </div>
    <div id="mockUnlockBadge" style="display:inline-block; font-size:0.75rem; font-weight:800; letter-spacing:0.06em; padding:4px 12px; border-radius:999px; margin-bottom:12px; background:#fdecee; color:#e0202d; border:1px solid rgba(224, 32, 45, 0.25);">FREE CANDIDATE ACCOUNT</div>
    <h3 id="mockUnlockTitle" style="font-family:'Sora',sans-serif; font-size:1.35rem; font-weight:800; color:#0b2b52; margin-bottom:10px; line-height:1.3;">Sign In Required to Unlock</h3>
    <p id="mockUnlockDesc" style="font-size:0.89rem; color:#475569; line-height:1.6; margin-bottom:24px;">
      Please log in or create a free candidate account to unlock all 12 Academic and 9 Premium mock tests and track your progress on your personal dashboard.
    </p>
    <div style="display:flex; flex-direction:column; gap:10px;">
      <a href="/login?redirect=/mocks.html" id="mockUnlockPrimaryBtn" style="padding:13px 22px; border-radius:12px; background:#e0202d; color:#fff; text-decoration:none; font-weight:700; font-size:0.95rem; font-family:'Sora',sans-serif; display:flex; align-items:center; justify-content:center; gap:8px; box-shadow:0 8px 20px rgba(224, 32, 45, 0.28); transition:all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);">
        <span>Sign In / Register Free</span> &rarr;
      </a>
      <button type="button" onclick="closeMockUnlockModal()" style="padding:11px 18px; border-radius:12px; background:#f8fafc; border:1.5px solid #dbeafe; color:#0b2b52; font-weight:700; font-size:0.88rem; font-family:'Sora',sans-serif; cursor:pointer; transition:all 0.2s;">
        Maybe Later
      </button>
    </div>
  </div>
</div>
`;

// Insert modal HTML before </body> if not present
if (!mocks.includes('id="mock-unlock-modal"')) {
  mocks = mocks.replace('</body>', mockUnlockModalHtml + '\n</body>');
  console.log('Injected mock-unlock-modal HTML into mocks.html!');
}

// Update openMockUnlockModal & closeMockUnlockModal in mocks.html
const oldModalJs = `  modal.removeAttribute('hidden');
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
}`;

const newModalJs = `  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeMockUnlockModal() {
  const modal = document.getElementById('mock-unlock-modal');
  if (modal) modal.style.display = 'none';
  document.body.style.overflow = '';
}

// Restore & clean up on page navigation back / bfcache
window.addEventListener('pageshow', (e) => {
  closeMockUnlockModal();
  document.body.style.overflow = '';
  checkAndApplyMockQuotas();
});`;

if (mocks.includes(oldModalJs)) {
  mocks = mocks.replace(oldModalJs, newModalJs);
  console.log('Updated openMockUnlockModal & closeMockUnlockModal in mocks.html!');
}

// In lockMockCard, add onclick="openMockUnlockModal()"
if (!mocks.includes("c.setAttribute('onclick', 'openMockUnlockModal()')")) {
  mocks = mocks.replace(
    "c.classList.add('is-locked');",
    "c.classList.add('is-locked');\n  c.setAttribute('onclick', 'openMockUnlockModal()');"
  );
  console.log('Added onclick="openMockUnlockModal()" to locked cards in mocks.html!');
}

// Ensure click listener on document also catches any sub-elements
mocks = mocks.replace(
  "const lockedCard = e.target.closest('.card.is-locked, article.is-locked');",
  "const lockedCard = e.target.closest('.card.is-locked, article.is-locked, .card-bottom-unlock, .card-center-lock');"
);

fs.writeFileSync(mocksPath, mocks, 'utf8');
console.log('Saved mocks.html successfully!');
