const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '..', 'FrontPage', 'Frontend', 'Practice-hub.html');
let content = fs.readFileSync(targetFile, 'utf8');

// Replace isTypeLocked helper
const isTypeLockedFunc = `
function isTypeLocked(idx, moduleId) {
  if (hubPhase === 1) return false;
  let user = null;
  try { user = JSON.parse(localStorage.getItem('user') || 'null'); } catch(e) {}
  const isLoggedIn = !!(user && (user.email || user.name));
  const isPremium = !!(user && (user.isPremium || user.role === 'admin' || user.plan === 'premium'));
  if (hubPhase === 2) {
    if (isLoggedIn) return false;
    const allowed = hubSettings.freePracticeHubSets !== undefined ? Number(hubSettings.freePracticeHubSets) : 2;
    return idx >= allowed;
  }
  if (hubPhase === 3) {
    if (isPremium) return false;
    const allowed = hubSettings.freePracticeHubSets !== undefined ? Number(hubSettings.freePracticeHubSets) : 0;
    return idx >= allowed;
  }
  return false;
}
`;

// Insert isTypeLocked after getFreeHubSetsQuota
if (!content.includes('function isTypeLocked(')) {
  content = content.replace('function getFreeHubSetsQuota() {', isTypeLockedFunc + '\nfunction getFreeHubSetsQuota() {');
}

// Target snippet to replace in build()
const oldSnippet = `      const isReading = m.id === 'reading';
      const isListening = m.id === 'listening';
      const isExercisesMode = isReading || isListening;
      const exercisesBaseUrl = isReading ? '/reading-exercises' : '/listening-exercises';
      const setsCount = isReading ? '100+ exercises' : (isListening ? '70+ exercises' : \`\${list.length} set\${list.length===1?'':'s'}\`);
      totalTypes += 1;
      totalSets += (isReading ? 100 : (isListening ? 70 : list.length));
      const body = isExercisesMode
        ? \`<div class="reading-card-cta">
            <a href="\${exercisesBaseUrl}?type=\${encodeURIComponent(o.t)}" class="btn-card-reading">
              <span>Practice \${esc(o.n)}</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </a>
           </div>\`
        : (list.length ? \`<div class="sets">\${setsHTML(m,o.t,list)}</div>\` : \`<div class="soon">Coming soon</div>\`);
      g+=\`<article class="card reveal" data-s="\${esc((m.name+' '+o.n+' '+grp+' '+o.d+' ielts practice').toLowerCase())}"><span class="bignum">\${String(k).padStart(2,'0')}</span><div class="ico" aria-hidden="true">\${getSvgIcon(o.t, m.id)}</div><h3>\${esc(o.n)}</h3><p>\${esc(o.d)}</p><div class="meta"><span>\${m.name}\${grp?' · '+grp.replace('Task 1 · ','T1 ').replace('Task 2 · ','T2 '):''}</span><span>\${m.meta}</span><span class="cnt">\${setsCount}</span><span class="ok">Free</span></div>\${body}</article>\`;`;

const newSnippet = `      const isReading = m.id === 'reading';
      const isListening = m.id === 'listening';
      const isExercisesMode = isReading || isListening;
      const exercisesBaseUrl = isReading ? '/reading-exercises' : '/listening-exercises';
      const setsCount = isReading ? '100+ exercises' : (isListening ? '70+ exercises' : \`\${list.length} set\${list.length===1?'':'s'}\`);
      totalTypes += 1;
      totalSets += (isReading ? 100 : (isListening ? 70 : list.length));

      const isLocked = isTypeLocked(k - 1, m.id);

      const lockOverlayHtml = isLocked ? \`
        <div class="card-center-lock" aria-hidden="true">
          <div class="center-lock-circle">
            <svg viewBox="0 0 24 24" width="26" height="26">
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
            </svg>
          </div>
        </div>
      \` : '';

      const bottomUnlockHtml = isLocked ? \`
        <div class="card-bottom-unlock">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          <span>Unlock Practice &rsaquo;</span>
        </div>
      \` : '';

      const btnAction = isLocked
        ? \`<button type="button" class="btn-card-reading btn-card-locked" onclick="openHubUnlockModal()">Start Practice &rarr;</button>\`
        : (isExercisesMode
            ? \`<a href="\${exercisesBaseUrl}?type=\${encodeURIComponent(o.t)}" class="btn-card-reading"><span>Start Practice &rarr;</span></a>\`
            : (list.length ? \`<div class="sets">\${setsHTML(m,o.t,list)}</div>\` : \`<div class="soon">Coming soon</div>\`)
          );

      g+=\`<article class="card reveal \${isLocked ? 'is-locked' : ''}" data-s="\${esc((m.name+' '+o.n+' '+grp+' '+o.d+' ielts practice').toLowerCase())}" \${isLocked ? 'onclick="openHubUnlockModal()"' : ''}>
        \${lockOverlayHtml}
        <span class="bignum">\${String(k).padStart(2,'0')}</span>
        <div class="card-head-row">
          <span class="pill">\${esc(m.name.toUpperCase())} IELTS</span>
          <div class="ico" aria-hidden="true">\${getSvgIcon(o.t, m.id)}</div>
        </div>
        <h3>\${esc(o.n)}</h3>
        <p>\${esc(o.d)}</p>
        <div class="chips">
          <span>\${setsCount}</span>
          <span>\${m.meta}</span>
        </div>
        <div class="card-action-wrap">
          \${btnAction}
        </div>
        \${bottomUnlockHtml}
      </article>\`;`;

if (content.includes(oldSnippet)) {
  content = content.replace(oldSnippet, newSnippet);
  console.log('Successfully replaced oldSnippet with newSnippet!');
} else {
  console.error('Could not find oldSnippet in Practice-hub.html!');
  process.exit(1);
}

fs.writeFileSync(targetFile, content, 'utf8');
console.log('Practice-hub.html updated and saved!');
