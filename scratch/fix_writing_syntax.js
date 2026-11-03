const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'public', 'cambridge-writing.html');
let content = fs.readFileSync(filePath, 'utf8');

const badBlockStart = '  list.forEach((t, i) => {';
const badBlockEnd = '    /* 3D tilt + spotlight */';

const sIdx = content.indexOf(badBlockStart);
const eIdx = content.indexOf(badBlockEnd);

if (sIdx === -1 || eIdx === -1) {
  console.error('Markers not found!');
  process.exit(1);
}

const fixedBlock = `  list.forEach((t, i) => {
    const pad = String(t.testNo).padStart(2, '0');
    const key = \`cw|\${t.book}|\${t.testNo}\`;
    const fullTestUrl = \`/cambridge/writing/\${t.book}/\${t.testNo}\`;
    const id = \`pop-w-\${t.book}-\${t.testNo}\`;
    const isDone = done[key] || done[\`\${key}|1\`] || done[\`\${key}|2\`];

    const testLocked = isTestLocked(t.testNo);
    const p1Locked = isPartLocked(1);
    const p2Locked = isPartLocked(2);

    const mainBtnHtml = testLocked
      ? \`<button type="button" class="btn btn-red" onclick="openUnlockModal()" title="Locked – Sign in or Upgrade to unlock">Take Test <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-left:4px;"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg></button>\`
      : \`<a href="\${fullTestUrl}" class="btn btn-red" data-key="\${key}" title="Free IELTS Writing practice test – Cambridge \${t.book} Test \${pad}">Take Test →</a>\`;

    const p1Html = p1Locked
      ? \`<div role="menuitem" onclick="openUnlockModal()" style="cursor:pointer; display:flex; justify-content:space-between; align-items:center; padding:9px 12px; border-radius:8px; font-size:.82rem; font-weight:600; color:var(--muted); background:var(--surface);">Part 1 <span style="font-size:.72rem; display:flex; align-items:center; gap:4px;">Task 1 · 20 min 🔒</span></div>\`
      : \`<a role="menuitem" href="\${fullTestUrl}?task=1" data-key="\${key}|1">Part 1 <span>Task 1 · 20 min</span></a>\`;

    const p2Html = p2Locked
      ? \`<div role="menuitem" onclick="openUnlockModal()" style="cursor:pointer; display:flex; justify-content:space-between; align-items:center; padding:9px 12px; border-radius:8px; font-size:.82rem; font-weight:600; color:var(--muted); background:var(--surface);">Part 2 <span style="font-size:.72rem; display:flex; align-items:center; gap:4px;">Task 2 · 40 min 🔒</span></div>\`
      : \`<a role="menuitem" href="\${fullTestUrl}?task=2" data-key="\${key}|2">Part 2 <span>Task 2 · 40 min</span></a>\`;

    const card = document.createElement('div');
    card.className = 'card';
    card.style.animationDelay = Math.min(i * 40, 600) + 'ms';
    card.innerHTML = \`
      <span class="bignum">\${pad}</span>
      <span class="pill">CAMBRIDGE \${t.book}</span>
      <h3>Cambridge \${t.book} Writing Test \${pad}</h3>
      <p class="card-desc">Free IELTS Academic Writing practice with authentic Cambridge Task 1 and Task 2 questions.</p>
      <div class="chips">
        <span>⏱ 60 Min Timer</span>
        <span>2 Tasks</span>
        <span>150+ & 250+ Words</span>
        \${isDone ? '<span class="done">✓ Attempted</span>' : ''}
      </div>
      <div class="card-actions">
        \${mainBtnHtml}
        <div class="practice-drop-wrap">
          <button type="button" class="btn btn-outline" aria-haspopup="true" aria-expanded="false" aria-controls="\${id}">Practice <span class="caret">▾</span></button>
          <div class="part-popover" id="\${id}" role="menu">
            \${p1Html}
            \${p2Html}
          </div>
        </div>
      </div>\`;

`;

content = content.substring(0, sIdx) + fixedBlock + content.substring(eIdx);
fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully fixed syntax error in public/cambridge-writing.html');
