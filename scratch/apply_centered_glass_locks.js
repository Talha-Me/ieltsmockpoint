const fs = require('fs');
const path = require('path');

// 1. Update FrontPage/Frontend/mocks.html
const mocksPath = path.resolve(__dirname, '../FrontPage/Frontend/mocks.html');
let mocksHtml = fs.readFileSync(mocksPath, 'utf8');

// Modern Centered Glassy Lock CSS for Mocks
const newMocksCss = `/* Full Card Translucent Centered Glassy Lock */
.card.is-locked {
  position: relative !important;
  cursor: pointer !important;
}

.card.is-locked > *:not(.card-lock-overlay) {
  opacity: 0.38 !important;
  filter: grayscale(40%) blur(0.6px) !important;
  pointer-events: none !important;
  user-select: none !important;
}

.card-lock-overlay {
  position: absolute;
  inset: 0;
  z-index: 20;
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 20px;
  text-align: center;
  border-radius: inherit;
  transition: all 0.28s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: pointer;
}

.card.premium.is-locked .card-lock-overlay {
  background: rgba(7, 28, 53, 0.78);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}

.card-lock-badge {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #ffffff;
  border: 2px solid rgba(21, 101, 201, 0.25);
  box-shadow: 0 12px 30px rgba(11, 43, 82, 0.14), 0 2px 6px rgba(0,0,0,0.04);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1565c9;
  margin-bottom: 12px;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.card.premium.is-locked .card-lock-badge {
  background: rgba(255, 255, 255, 0.14);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: #ffffff;
  box-shadow: 0 14px 32px rgba(0, 0, 0, 0.4);
}

.card-lock-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.84rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: #0b2b52;
  background: #ffffff;
  border: 1.5px solid rgba(21, 101, 201, 0.25);
  padding: 7px 18px;
  border-radius: 999px;
  box-shadow: 0 4px 14px rgba(11, 43, 82, 0.08);
  transition: all 0.25s ease;
}

.card.premium.is-locked .card-lock-label {
  background: rgba(255, 255, 255, 0.18);
  border-color: rgba(255, 255, 255, 0.3);
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3);
}

/* Hover Micro-interactions */
.card.is-locked:hover {
  transform: translateY(-4px) !important;
  box-shadow: 0 18px 36px rgba(11, 43, 82, 0.12) !important;
}

.card.is-locked:hover .card-lock-overlay {
  background: rgba(255, 255, 255, 0.62);
}

.card.premium.is-locked:hover .card-lock-overlay {
  background: rgba(7, 28, 53, 0.72);
}

.card.is-locked:hover .card-lock-badge {
  transform: scale(1.1);
  color: #e0202d;
  border-color: rgba(224, 32, 45, 0.45);
  box-shadow: 0 16px 36px rgba(224, 32, 45, 0.25);
}

.card.is-locked:hover .card-lock-label {
  background: #e0202d;
  border-color: #e0202d;
  color: #ffffff;
  box-shadow: 0 6px 20px rgba(224, 32, 45, 0.35);
}

.card.premium.is-locked:hover .card-lock-badge {
  transform: scale(1.1);
  background: rgba(224, 32, 45, 0.32);
  border-color: #e0202d;
  color: #ffffff;
  box-shadow: 0 18px 38px rgba(224, 32, 45, 0.35);
}

.card.premium.is-locked:hover .card-lock-label {
  background: #e0202d;
  border-color: #e0202d;
  color: #ffffff;
  box-shadow: 0 6px 20px rgba(224, 32, 45, 0.4);
}`;

// Replace the old .card.is-locked CSS
const oldCssRegex = /\/\* Transparent Glassy Lock for Mock Cards \*\/[\s\S]*?<\/style>/;
if (oldCssRegex.test(mocksHtml)) {
  mocksHtml = mocksHtml.replace(oldCssRegex, `${newMocksCss}\n\n</style>`);
}

// Replace lockMockCard JS implementation
const newLockMockCardJs = `function lockMockCard(c) {
  if (c.classList.contains('is-locked')) return;
  c.classList.add('is-locked');
  
  // Remove any legacy lock elements
  const oldLock = c.querySelector('.card-glass-lock, .card-lock-overlay');
  if (oldLock) oldLock.remove();

  const isPrem = c.classList.contains('premium');
  const btnLabel = currentMockPhase === 3 ? 'Unlock Premium' : 'Unlock Test';

  const overlayHtml = \`
    <div class="card-lock-overlay" title="Sign in to unlock">
      <div class="card-lock-badge">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
      </div>
      <div class="card-lock-label">
        <span>\${btnLabel}</span>
        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </div>
    </div>
  \`;
  c.insertAdjacentHTML('beforeend', overlayHtml);
}`;

const oldLockJsRegex = /function lockMockCard\(c\)[\s\S]*?\n\}/;
if (oldLockJsRegex.test(mocksHtml)) {
  mocksHtml = mocksHtml.replace(oldLockJsRegex, newLockMockCardJs);
}

fs.writeFileSync(mocksPath, mocksHtml, 'utf8');
console.log('FrontPage/Frontend/mocks.html updated successfully with centered frosted glass locks!');

// 2. Update public/reading-exercises.html
const rePath = path.resolve(__dirname, '../public/reading-exercises.html');
let reHtml = fs.readFileSync(rePath, 'utf8');

// Add / replace .card.is-locked CSS in reading-exercises.html
const reOldCssRegex = /\/\* Glassy lock on exercise cards \*\/[\s\S]*?<\/style>/;
if (reOldCssRegex.test(reHtml)) {
  reHtml = reHtml.replace(reOldCssRegex, `${newMocksCss}\n\n</style>`);
}

// Update card rendering in reading-exercises.html
reHtml = reHtml.replace(
  /\$\{lockIcon\}\s*<span class="bignum">/g,
  '<span class="bignum">'
);

const reOverlaySnippet = `\${isLocked ? \`
            <div class="card-lock-overlay" title="Sign in to unlock">
              <div class="card-lock-badge">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <div class="card-lock-label">
                <span>Unlock Exercise</span>
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </div>
            </div>
          \` : ''}`;

reHtml = reHtml.replace(
  /<article class="card \$\{isDone \? 'done' : ''\} \$\{isLocked \? 'is-locked' : ''\}"[^>]*>/g,
  `$&\\n          ${reOverlaySnippet}`
);

fs.writeFileSync(rePath, reHtml, 'utf8');
console.log('public/reading-exercises.html updated successfully with centered frosted glass locks!');

// 3. Update public/listening-exercises.html
const lePath = path.resolve(__dirname, '../public/listening-exercises.html');
let leHtml = fs.readFileSync(lePath, 'utf8');

const leOldCssRegex = /\/\* Glassy lock on exercise cards \*\/[\s\S]*?<\/style>/;
if (leOldCssRegex.test(leHtml)) {
  leHtml = leHtml.replace(leOldCssRegex, `${newMocksCss}\n\n</style>`);
}

leHtml = leHtml.replace(
  /\$\{lockIcon\}\s*<span class="bignum">/g,
  '<span class="bignum">'
);

leHtml = leHtml.replace(
  /<article class="card \$\{isDone \? 'done' : ''\} \$\{isLocked \? 'is-locked' : ''\}"[^>]*>/g,
  `$&\\n          ${reOverlaySnippet}`
);

fs.writeFileSync(lePath, leHtml, 'utf8');
console.log('public/listening-exercises.html updated successfully with centered frosted glass locks!');
