const fs = require('fs');
const path = require('path');

function updateExercisesFile(filePath, isListening = false) {
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Update Grid and Card CSS
  const oldCardStylesRegex = /\.grid\s*\{[\s\S]*?perspective:\s*1200px;\s*\}/;
  const newGridCss = `.grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)) !important;
      gap: 20px !important;
      padding-bottom: 70px;
      min-height: 320px;
    }`;

  if (oldCardStylesRegex.test(content)) {
    content = content.replace(oldCardStylesRegex, newGridCss);
  }

  // Sizing styles to inject right before </style>
  const exactCardCss = `
/* ========================================================
   Uniform Sizing matching /mocks (Clean ~270px proportions)
   ======================================================== */
.card {
  position: relative !important;
  background: #fff;
  border: 1.5px solid var(--line) !important;
  border-radius: 20px !important;
  padding: 24px 22px 22px !important;
  overflow: hidden !important;
  display: flex !important;
  flex-direction: column !important;
  min-height: 275px !important;
  max-height: 310px !important;
  box-sizing: border-box !important;
  transition: transform 0.25s ease-out, border-color 0.25s, box-shadow 0.25s !important;
}
.card:hover {
  transform: translateY(-6px) !important;
  border-color: var(--blue) !important;
  box-shadow: 0 20px 40px rgba(21, 101, 201, 0.13) !important;
}
.card .bignum {
  position: absolute !important;
  right: 14px !important;
  top: -6px !important;
  font-family: 'Sora', sans-serif !important;
  font-weight: 800 !important;
  font-size: 5rem !important;
  color: var(--blue-light) !important;
  line-height: 1 !important;
  pointer-events: none !important;
  user-select: none !important;
  transition: color 0.3s !important;
}
.card:hover .bignum {
  color: #fdecee !important;
}
.card .pill {
  position: relative !important;
  align-self: flex-start !important;
  max-width: 82% !important;
  font-size: 0.66rem !important;
  font-weight: 800 !important;
  letter-spacing: 0.06em !important;
  padding: 4px 10px !important;
  border-radius: 999px !important;
  margin-bottom: 14px !important;
}
.card h3 {
  position: relative !important;
  font-family: 'Sora', sans-serif !important;
  font-size: 1.15rem !important;
  font-weight: 700 !important;
  color: var(--navy) !important;
  margin-bottom: 4px !important;
  line-height: 1.35 !important;
}
.card .sub-source {
  position: relative !important;
  font-size: 0.78rem !important;
  color: var(--muted) !important;
  margin-bottom: 10px !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  max-width: 88% !important;
}
.chips {
  position: relative !important;
  display: flex !important;
  gap: 6px !important;
  flex-wrap: wrap !important;
  margin-bottom: 16px !important;
}
.chips span {
  font-size: 0.74rem !important;
  font-weight: 600 !important;
  color: var(--muted) !important;
  background: var(--surface) !important;
  border-radius: 8px !important;
  padding: 4px 8px !important;
}
.card-actions {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  gap: 10px !important;
  position: relative !important;
  margin-top: auto !important;
  padding-top: 0 !important;
  border-top: none !important;
  width: 100% !important;
}
.card-actions .btn {
  width: 100% !important;
  justify-content: center !important;
  padding: 10px 18px !important;
  font-size: 0.88rem !important;
  font-weight: 700 !important;
  box-sizing: border-box !important;
}
.center-lock-circle {
  width: 54px !important;
  height: 54px !important;
}
.center-lock-circle svg {
  width: 24px !important;
  height: 24px !important;
}
.card-bottom-unlock {
  margin-top: 10px !important;
  font-size: 0.8rem !important;
}
`;

  // Insert before </style> if not already there
  if (!content.includes('Uniform Sizing matching /mocks')) {
    content = content.replace('</style>', exactCardCss + '\n</style>');
  }

  // 2. Update renderExercises card HTML
  const oldCardHtmlRegex = /<article class="card \${isDone \? 'done' : ''}[\s\S]*?<\/article>/;
  const newCardHtml = `<article class="card \${isDone ? 'done' : ''} \${isLocked ? 'is-locked' : ''}" data-k="\${storageKey}" data-source="\${ex.sourceType || 'cambridge'}" onclick="\${isLocked ? 'openExUnlockModal()' : ''}">
            \${isLocked ? \`
              <div class="card-center-lock" aria-hidden="true">
                <div class="center-lock-circle">
                  <svg viewBox="0 0 24 24" width="24" height="24">
                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                  </svg>
                </div>
              </div>
            \` : ''}
            <span class="bignum">\${numStr}</span>
            <span class="\${pillClass}">\${escapeHtml(pillText)}</span>
            <h3>\${escapeHtml(titleText)}</h3>
            <div class="sub-source">\${escapeHtml(sourceText)}</div>
            <div class="chips">
              <span class="q-range-chip">\${escapeHtml(ex.qRange)}</span>
              <span>\${ex.questionsCount || 6} Questions</span>
              \${isDone ? '<span class="done">Completed ✓</span>' : ''}
            </div>
            <div class="card-actions">
              \${btnHtml}
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
          </article>`;

  if (oldCardHtmlRegex.test(content)) {
    content = content.replace(oldCardHtmlRegex, newCardHtml);
    console.log('Replaced card template in:', path.basename(filePath));
  } else {
    console.warn('Could not match oldCardHtmlRegex in:', path.basename(filePath));
  }

  fs.writeFileSync(filePath, content, 'utf8');
}

const readingFile = path.join(__dirname, '..', 'public', 'reading-exercises.html');
const listeningFile = path.join(__dirname, '..', 'public', 'listening-exercises.html');

updateExercisesFile(readingFile, false);
updateExercisesFile(listeningFile, true);
console.log('Done updating reading & listening exercises!');
