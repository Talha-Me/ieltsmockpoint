const fs = require('fs');
const path = require('path');

const screenshotCardCss = `
/* ========================================================
   Exact Mockup: Soft Ice-Blue Frosted Card with Center Lock & Bottom Unlock Prompt
   ======================================================== */
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

.card.is-locked .pill,
.card.is-locked .pill.pill-cambridge,
.card.is-locked .pill.pill-bank {
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

/* Translucent Frosted Start Button */
.card.is-locked .btn,
.card.is-locked a.btn,
.card.is-locked .btn.btn-red,
.card.is-locked .btn.btn-locked {
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
  transition: all 0.28s cubic-bezier(0.16, 1, 0.3, 1);
}

.center-lock-circle svg {
  fill: #0b2b52 !important;
  width: 26px !important;
  height: 26px !important;
  display: block;
  transition: fill 0.25s ease;
}

/* Bottom Left 'Unlock Exercise >' Indicator */
.card-bottom-unlock {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 14px;
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.84rem;
  font-weight: 600;
  color: #64748b;
  user-select: none;
  transition: color 0.22s ease, transform 0.22s ease;
}

.card-bottom-unlock svg {
  stroke: #64748b;
  width: 16px !important;
  height: 16px !important;
  display: inline-block;
  vertical-align: middle;
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
  fill: #e0202d !important;
}

.card.is-locked:hover .card-bottom-unlock {
  color: #e0202d;
  transform: translateX(2px);
}

.card.is-locked:hover .card-bottom-unlock svg {
  stroke: #e0202d;
}
`;

// 1. Update public/reading-exercises.html
const rePath = path.resolve(__dirname, '../public/reading-exercises.html');
let reHtml = fs.readFileSync(rePath, 'utf8');

// Insert CSS before closing </style>
if (reHtml.includes('/* Exact Mockup: Soft Ice-Blue')) {
  reHtml = reHtml.replace(/\/\* =+[\s\S]*?Exact Mockup: Soft Ice-Blue[\s\S]*?<\/style>/, `${screenshotCardCss}\n</style>`);
} else {
  reHtml = reHtml.replace('</style>', `${screenshotCardCss}\n</style>`);
}

// Update card rendering in reading-exercises.html
reHtml = reHtml.replace(
  /const btnHtml = isLocked[\s\S]*?: `<a href="\$\{ex\.link\}"[^>]*>Start practice.*?<\/a>`;/,
  `const btnHtml = isLocked
          ? '<button type="button" class="btn btn-red btn-locked" onclick="openExUnlockModal()">Start practice &rarr;</button>'
          : \`<a href="\${ex.link}" target="_blank" rel="noopener noreferrer" class="btn btn-red" onclick="markDone('\${storageKey}')">Start practice &rarr;</a>\`;`
);

// Ensure bottom unlock indicator is present
if (!reHtml.includes('class="card-bottom-unlock"')) {
  reHtml = reHtml.replace(
    /\$\{btnHtml\}\s*<\/div>\s*<\/article>/g,
    `\${btnHtml}
            </div>
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

fs.writeFileSync(rePath, reHtml, 'utf8');
console.log('public/reading-exercises.html updated successfully!');

// 2. Update public/listening-exercises.html
const lePath = path.resolve(__dirname, '../public/listening-exercises.html');
let leHtml = fs.readFileSync(lePath, 'utf8');

if (leHtml.includes('/* Exact Mockup: Soft Ice-Blue')) {
  leHtml = leHtml.replace(/\/\* =+[\s\S]*?Exact Mockup: Soft Ice-Blue[\s\S]*?<\/style>/, `${screenshotCardCss}\n</style>`);
} else {
  leHtml = leHtml.replace('</style>', `${screenshotCardCss}\n</style>`);
}

leHtml = leHtml.replace(
  /const btnHtml = isLocked[\s\S]*?: `<a href="\$\{ex\.link\}"[^>]*>Start practice.*?<\/a>`;/,
  `const btnHtml = isLocked
          ? '<button type="button" class="btn btn-red btn-locked" onclick="openExUnlockModal()">Start practice &rarr;</button>'
          : \`<a href="\${ex.link}" target="_blank" rel="noopener noreferrer" class="btn btn-red" onclick="markDone('\${storageKey}')">Start practice &rarr;</a>\`;`
);

if (!leHtml.includes('class="card-bottom-unlock"')) {
  leHtml = leHtml.replace(
    /\$\{btnHtml\}\s*<\/div>\s*<\/article>/g,
    `\${btnHtml}
            </div>
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

fs.writeFileSync(lePath, leHtml, 'utf8');
console.log('public/listening-exercises.html updated successfully!');

// 3. Update FrontPage/Frontend/Practice-hub.html
const hubPath = path.resolve(__dirname, '../FrontPage/Frontend/Practice-hub.html');
let hubHtml = fs.readFileSync(hubPath, 'utf8');

const hubLockedCss = `
.sets a.set-locked {
  background: #f1f6fd !important;
  color: #64748b !important;
  border: 1px solid #dbeafe !important;
  cursor: pointer !important;
  display: inline-flex !important;
  align-items: center !important;
  gap: 3px !important;
  font-weight: 700 !important;
  border-radius: 8px !important;
  box-shadow: 0 2px 6px rgba(21, 101, 201, 0.06) !important;
  transition: all 0.2s ease !important;
}
.sets a.set-locked svg {
  stroke: #64748b !important;
  transition: stroke 0.2s ease !important;
}
.sets a.set-locked:hover {
  background: #fde8e8 !important;
  border-color: #fca5a5 !important;
  color: #e0202d !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 10px rgba(224, 32, 45, 0.16) !important;
}
.sets a.set-locked:hover svg {
  stroke: #e0202d !important;
}
`;

if (hubHtml.includes('.sets a.set-locked {')) {
  hubHtml = hubHtml.replace(/\.sets a\.set-locked[\s\S]*?\.sets a\.set-locked:hover\s*\{[\s\S]*?\}/, hubLockedCss);
} else {
  hubHtml = hubHtml.replace('</style>', `${hubLockedCss}\n</style>`);
}

fs.writeFileSync(hubPath, hubHtml, 'utf8');
console.log('FrontPage/Frontend/Practice-hub.html updated successfully!');
