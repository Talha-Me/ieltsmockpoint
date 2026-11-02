const fs = require('fs');
const path = require('path');

const listeningHtmlPath = path.join(__dirname, '../views/cambridgetest/listening-practice-v2.html');
const readingHtmlPath = path.join(__dirname, '../views/cambridgetest/reading-practice-v2.html');
const listeningJsPath = path.join(__dirname, '../views/cambridgetest/scripts-listening-practice-v2.js');
const readingJsPath = path.join(__dirname, '../views/cambridgetest/scripts-reading-practice-v2.js');
const listeningCssPath = path.join(__dirname, '../views/cambridgetest/styles-listening-v2.css');
const readingCssPath = path.join(__dirname, '../views/cambridgetest/styles-reading-v2.css');

// 1. MODAL HTML TEMPLATE
const unlockModalHtml = `
  <!-- Test Page Unlock Modal (Phase 2 & Phase 3) -->
  <div id="psUnlockModal" class="ps-modal-overlay" style="z-index: 250000;" onclick="if(event.target===this)closeTestUnlockModal();">
    <div class="ps-modal-card">
      <button type="button" class="ps-close-btn" onclick="closeTestUnlockModal()" aria-label="Close modal">&times;</button>
      <div id="psUnlockIconWrap" style="width: 58px; height: 58px; border-radius: 16px; background: #fdecee; border: 1.5px solid rgba(224, 32, 45, 0.28); display: inline-flex; align-items: center; justify-content: center; color: #e0202d; margin-bottom: 14px;">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
      </div>
      <div id="psUnlockBadge" style="display:inline-block; font-size:0.75rem; font-weight:700; letter-spacing:0.04em; padding:3px 10px; border-radius:999px; margin-bottom:10px; background:#fdecee; color:#e0202d; border:1px solid rgba(224, 32, 45, 0.25);">FREE CANDIDATE ACCOUNT</div>
      <h4 id="psUnlockTitle" style="font-family:'Sora',sans-serif; font-size: 1.3rem; font-weight: 800; color: #0b2b52; margin-bottom: 10px;">Sign In Required to Unlock</h4>
      <p id="psUnlockDesc" style="color: #64748b; font-size: 0.90rem; line-height: 1.5; margin-bottom: 22px;">Please sign in or create a free candidate account to practice this section and save your progress to your personal dashboard.</p>
      
      <div style="display:flex; flex-direction:column; gap:10px;">
        <a id="psUnlockPrimaryBtn" href="/login" style="display:inline-flex; align-items:center; justify-content:center; gap:8px; padding:12px 22px; border-radius:10px; background:#e0202d; color:#ffffff; font-family:'Sora',sans-serif; font-weight:700; font-size:0.92rem; text-decoration:none; box-shadow:0 8px 20px rgba(224, 32, 45, 0.28); transition:all 0.2s;">
          <span>Sign In / Register Free</span> &rarr;
        </a>
        <a id="psUnlockBackBtn" href="javascript:void(0)" onclick="closeTestUnlockModal()" style="display:inline-flex; align-items:center; justify-content:center; padding:10px 18px; border-radius:10px; background:#f8fafc; color:#64748b; font-weight:600; font-size:0.86rem; text-decoration:none; border:1px solid #e2e8f0; transition:all 0.2s;">
          Cancel / Keep Practicing
        </a>
      </div>
      <div id="psUnlockSecondaryAction" style="margin-top:14px; display:none;"></div>
    </div>
  </div>
`;

// 2. MODAL & LOCKED PILL CSS
const modalCss = `
/* === Test Page Unlock Modal & Locked Section Pill Styles === */
.cl-section-pill.locked,
.cr-section-practice-badge.locked {
  background: #fdecee !important;
  color: #b91c1c !important;
  border-color: #fca5a5 !important;
  cursor: pointer !important;
  display: inline-flex !important;
  align-items: center !important;
  gap: 5px !important;
  font-family: inherit !important;
  font-size: 11.5px !important;
  font-weight: 700 !important;
  padding: 3px 10px !important;
  border-radius: 6px !important;
  transition: all 0.2s ease !important;
}
.cl-section-pill.locked:hover,
.cr-section-practice-badge.locked:hover {
  background: #fee2e2 !important;
  color: #e0202d !important;
  border-color: #f87171 !important;
  box-shadow: 0 4px 12px rgba(224, 32, 45, 0.25) !important;
  transform: translateY(-1px) !important;
}
.ps-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(11, 43, 82, 0.65);
  backdrop-filter: blur(4px);
  z-index: 250000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.25s ease;
}
.ps-modal-overlay.open {
  opacity: 1;
  pointer-events: auto;
}
.ps-modal-card {
  background: #ffffff;
  border-radius: 20px;
  border: 1.5px solid #e2e8f0;
  box-shadow: 0 24px 50px rgba(11, 43, 82, 0.25);
  width: 100%;
  max-width: 440px;
  text-align: center;
  padding: 32px 28px;
  position: relative;
  transform: translateY(16px) scale(0.97);
  transition: transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.ps-modal-overlay.open .ps-modal-card {
  transform: none;
}
.ps-close-btn {
  position: absolute;
  top: 14px;
  right: 16px;
  background: #f1f5f9;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, color 0.2s;
}
.ps-close-btn:hover {
  background: #fee2e2;
  color: #e0202d;
}
`;

// Update listening HTML
let lHtml = fs.readFileSync(listeningHtmlPath, 'utf8');
if (!lHtml.includes('id="psUnlockModal"')) {
  lHtml = lHtml.replace('</body>', `${unlockModalHtml}\n</body>`);
  fs.writeFileSync(listeningHtmlPath, lHtml, 'utf8');
  console.log('Added unlock modal to listening-practice-v2.html');
}

// Update reading HTML
let rHtml = fs.readFileSync(readingHtmlPath, 'utf8');
if (!rHtml.includes('id="psUnlockModal"')) {
  rHtml = rHtml.replace('</body>', `${unlockModalHtml}\n</body>`);
  fs.writeFileSync(readingHtmlPath, rHtml, 'utf8');
  console.log('Added unlock modal to reading-practice-v2.html');
}

// Update listening CSS
let lCss = fs.readFileSync(listeningCssPath, 'utf8');
if (!lCss.includes('ps-modal-overlay')) {
  lCss += `\n${modalCss}\n`;
  fs.writeFileSync(listeningCssPath, lCss, 'utf8');
  console.log('Added modal CSS to styles-listening-v2.css');
}

// Update reading CSS
let rCss = fs.readFileSync(readingCssPath, 'utf8');
if (!rCss.includes('ps-modal-overlay')) {
  rCss += `\n${modalCss}\n`;
  fs.writeFileSync(readingCssPath, rCss, 'utf8');
  console.log('Added modal CSS to styles-reading-v2.css');
}

console.log('HTML and CSS components installed successfully!');
