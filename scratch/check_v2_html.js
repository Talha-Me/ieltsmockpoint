const fs = require('fs');

const l = fs.readFileSync('../views/cambridgetest/listening-practice-v2.html', 'utf8');
const r = fs.readFileSync('../views/cambridgetest/reading-practice-v2.html', 'utf8');

console.log('--- listening-practice-v2.html (size: ' + l.length + ') ---');
console.log('--- reading-practice-v2.html (size: ' + r.length + ') ---');

// Search for modal, dialog, settings, menu, etc.
['part', 'section', 'modal', 'popup', 'menu', 'dropdown'].forEach(w => {
  console.log('Listening has ' + w + ':', l.toLowerCase().includes(w));
  console.log('Reading has ' + w + ':', r.toLowerCase().includes(w));
});
