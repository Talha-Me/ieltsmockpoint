const fs = require('fs');
const path = require('path');

const files = [
  { path: path.join(__dirname, '..', 'public', 'reading-exercises.html'), closeFn: 'closeExUnlockModal' },
  { path: path.join(__dirname, '..', 'public', 'listening-exercises.html'), closeFn: 'closeExUnlockModal' },
  { path: path.join(__dirname, '..', 'public', 'cambridge-reading.html'), closeFn: 'closeUnlockModal' },
  { path: path.join(__dirname, '..', 'public', 'cambridge-listening.html'), closeFn: 'closeUnlockModal' }
];

files.forEach(({ path: f, closeFn }) => {
  let content = fs.readFileSync(f, 'utf8');
  if (!content.includes('pageshow')) {
    const snippet = `
// Reset modal and unlock body when navigating back (e.g. from login page)
window.addEventListener('pageshow', () => {
  try { ${closeFn}(); } catch(e) {}
  document.body.style.overflow = '';
});
`;
    content = content.replace('</body>', snippet + '\n</body>');
    fs.writeFileSync(f, content, 'utf8');
    console.log('Added pageshow listener to:', path.basename(f));
  }
});
