const fs = require('fs');
const path = require('path');

function updateCambridge(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace Phase 2 styles
  content = content.replace(
    `    // Phase 2: Freemium / Candidate Sign In
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
    }`,
    `    // Phase 2: Freemium / Candidate Sign In
    if (iconWrap) {
      iconWrap.style.background = '#fdecee';
      iconWrap.style.borderColor = 'rgba(224, 32, 45, 0.28)';
      iconWrap.style.color = '#e0202d';
      iconWrap.innerHTML = \`
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#e0202d" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
      \`;
    }
    if (tagBadge) {
      tagBadge.style.display = 'inline-block';
      tagBadge.style.background = '#fdecee';
      tagBadge.style.color = '#e0202d';
      tagBadge.style.border = '1px solid rgba(224, 32, 45, 0.25)';
      tagBadge.textContent = 'FREE CANDIDATE ACCOUNT';
    }
    if (titleEl) titleEl.textContent = 'Sign In Required to Unlock';
    if (descEl) descEl.textContent = 'Please log in or create a free candidate account to practice all passages, question types, and save your progress to your personal dashboard.';
    if (primaryBtn) {
      primaryBtn.style.background = '#e0202d';
      primaryBtn.style.boxShadow = '0 8px 20px rgba(224, 32, 45, 0.28)';
      primaryBtn.href = \`/login?redirect=\${currUrl}\`;
      primaryBtn.innerHTML = \`<span>Sign In / Register Free</span> &rarr;\`;
    }`
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Updated Cambridge modal:', path.basename(filePath));
}

updateCambridge(path.join(__dirname, '..', 'public', 'cambridge-reading.html'));
updateCambridge(path.join(__dirname, '..', 'public', 'cambridge-listening.html'));
