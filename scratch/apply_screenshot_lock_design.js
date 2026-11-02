const fs = require('fs');
const path = require('path');

// 1. Update FrontPage/Frontend/mocks.html
const mocksPath = path.resolve(__dirname, '../FrontPage/Frontend/mocks.html');
let mocksHtml = fs.readFileSync(mocksPath, 'utf8');

const screenshotCardCss = `/* Exact Mockup: Soft Ice-Blue Frosted Card with Center Lock & Bottom Unlock Prompt */
.card.is-locked {
  position: relative !important;
  background: #f1f6fd !important;
  border: 1.5px solid #dbeafe !important;
  cursor: pointer !important;
  box-shadow: 0 4px 18px rgba(21, 101, 201, 0.05) !important;
  transition: transform 0.25s, border-color 0.25s, box-shadow 0.25s !important;
}

.card.is-locked .bignum {
  color: #dbeafe !important;
}

.card.is-locked .pill {
  background: #e0edfe !important;
  color: #1e40af !important;
}

.card.is-locked h3 {
  color: #0b2b52 !important;
  opacity: 0.9;
}

.card.is-locked .chips span {
  background: #e2edfb !important;
  color: #475569 !important;
}

/* Translucent Frosted Start Test Button */
.card.is-locked .btn,
.card.is-locked .btn.btn-red {
  background: rgba(224, 32, 45, 0.42) !important;
  color: rgba(255, 255, 255, 0.88) !important;
  border: none !important;
  backdrop-filter: blur(2px) !important;
  -webkit-backdrop-filter: blur(2px) !important;
  box-shadow: none !important;
  pointer-events: none !important;
  user-select: none !important;
}

/* Floating Centerpiece Padlock Badge */
.card-center-lock {
  position: absolute;
  top: 48%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  pointer-events: none;
}

.center-lock-circle {
  width: 58px;
  height: 58px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 2px solid rgba(255, 255, 255, 0.95);
  box-shadow: 0 10px 26px rgba(21, 101, 201, 0.18), 0 2px 6px rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0b2b52;
  transition: all 0.28s cubic-bezier(0.16, 1, 0.3, 1);
}

.center-lock-circle svg {
  fill: #0b2b52;
  transition: fill 0.25s ease;
}

/* Bottom Left 'Unlock Test >' Indicator */
.card-bottom-unlock {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 14px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.84rem;
  font-weight: 600;
  color: #64748b;
  user-select: none;
  transition: color 0.22s ease, transform 0.22s ease;
}

.card-bottom-unlock svg {
  stroke: #64748b;
  transition: stroke 0.22s ease;
  flex-shrink: 0;
}

/* Hover States matching user screenshot */
.card.is-locked:hover {
  transform: translateY(-6px) !important;
  border-color: #bfdbfe !important;
  box-shadow: 0 16px 36px rgba(21, 101, 201, 0.12) !important;
}

.card.is-locked:hover .center-lock-circle {
  transform: scale(1.1);
  box-shadow: 0 14px 32px rgba(224, 32, 45, 0.22);
  border-color: rgba(224, 32, 45, 0.3);
}

.card.is-locked:hover .center-lock-circle svg {
  fill: #e0202d;
}

.card.is-locked:hover .card-bottom-unlock {
  color: #e0202d;
  transform: translateX(2px);
}

.card.is-locked:hover .card-bottom-unlock svg {
  stroke: #e0202d;
}

/* Premium Card Variants */
.card.premium.is-locked {
  background: #0d284a !important;
  border-color: #1e3a5f !important;
}

.card.premium.is-locked .bignum {
  color: rgba(255, 255, 255, 0.08) !important;
}

.card.premium.is-locked h3 {
  color: #ffffff !important;
}

.card.premium.is-locked .center-lock-circle {
  background: rgba(255, 255, 255, 0.16);
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.4);
}

.card.premium.is-locked .center-lock-circle svg {
  fill: #ffffff;
}

.card.premium.is-locked .card-bottom-unlock {
  color: rgba(255, 255, 255, 0.7);
}

.card.premium.is-locked .card-bottom-unlock svg {
  stroke: rgba(255, 255, 255, 0.7);
}

.card.premium.is-locked:hover .center-lock-circle {
  background: rgba(224, 32, 45, 0.3);
  border-color: #e0202d;
}

.card.premium.is-locked:hover .center-lock-circle svg {
  fill: #ffffff;
}

.card.premium.is-locked:hover .card-bottom-unlock {
  color: #ffffff;
}

.card.premium.is-locked:hover .card-bottom-unlock svg {
  stroke: #ffffff;
}`;

// Replace CSS in mocks.html
const oldCssRegex = /\/\* Full Card Translucent Centered Glassy Lock \*\/[\s\S]*?<\/style>/;
if (oldCssRegex.test(mocksHtml)) {
  mocksHtml = mocksHtml.replace(oldCssRegex, `${screenshotCardCss}\n\n</style>`);
}

// Replace lockMockCard implementation in mocks.html
const newLockMockCardJs = `function lockMockCard(c) {
  if (c.classList.contains('is-locked')) return;
  c.classList.add('is-locked');
  
  // Clean up any old lock overlays/icons
  c.querySelectorAll('.card-glass-lock, .card-lock-overlay, .card-center-lock, .card-bottom-unlock').forEach(el => el.remove());

  const btnLabel = currentMockPhase === 3 ? 'Unlock Premium' : 'Unlock Test';

  // 1. Floating Centerpiece Solid Padlock Badge (from user mockup)
  const centerLockHtml = \`
    <div class="card-center-lock" aria-hidden="true">
      <div class="center-lock-circle">
        <svg viewBox="0 0 24 24" width="26" height="26">
          <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
        </svg>
      </div>
    </div>
  \`;
  c.insertAdjacentHTML('beforeend', centerLockHtml);

  // 2. Bottom Left Action Indicator (from user mockup)
  const bottomUnlockHtml = \`
    <div class="card-bottom-unlock">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
      </svg>
      <span>\${btnLabel} &rsaquo;</span>
    </div>
  \`;
  c.insertAdjacentHTML('beforeend', bottomUnlockHtml);
}`;

const oldLockJsRegex = /function lockMockCard\(c\)[\s\S]*?\n\}/;
if (oldLockJsRegex.test(mocksHtml)) {
  mocksHtml = mocksHtml.replace(oldLockJsRegex, newLockMockCardJs);
}

fs.writeFileSync(mocksPath, mocksHtml, 'utf8');
console.log('mocks.html updated successfully with exact screenshot design!');

// 2. Update reading-exercises.html & listening-exercises.html
[
  path.resolve(__dirname, '../public/reading-exercises.html'),
  path.resolve(__dirname, '../public/listening-exercises.html')
].forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace CSS
  const oldExCss = /\/\* Full Card Translucent Centered Glassy Lock \*\/[\s\S]*?<\/style>/;
  if (oldExCss.test(content)) {
    content = content.replace(oldExCss, `${screenshotCardCss}\n\n</style>`);
  }

  // Remove any old overlay injection and add center lock + bottom unlock
  content = content.replace(
    /\$\{isLocked \? `[\s\S]*?` : ''\}/g,
    `\${isLocked ? \`
            <div class="card-center-lock" aria-hidden="true">
              <div class="center-lock-circle">
                <svg viewBox="0 0 24 24" width="26" height="26">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                </svg>
              </div>
            </div>
    \` : ''}`
  );

  // In exercise card, after the button, add bottom unlock indicator
  if (!content.includes('class="card-bottom-unlock"')) {
    content = content.replace(
      /\$\{btnHtml\}\s*<\/article>/g,
      `\${btnHtml}
            \${isLocked ? \`
              <div class="card-bottom-unlock">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <span>Unlock Exercise &rsaquo;</span>
              </div>
            \` : ''}
          </article>`
    );
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(path.basename(filePath) + ' updated successfully with exact screenshot design!');
});
