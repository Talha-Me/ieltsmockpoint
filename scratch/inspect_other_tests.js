const fs = require('fs');
const files = fs.readdirSync('D:/personal websites/ieltsmockpoint/views/cambridgetest');
console.log('views/cambridgetest files:', files);

for (const f of files) {
  if (f.endsWith('.js') || f.endsWith('.html')) {
    const c = fs.readFileSync('D:/personal websites/ieltsmockpoint/views/cambridgetest/' + f, 'utf8');
    if (c.includes('isCurrentSessionLocked') || c.includes('psUnlockModal')) {
      console.log('Found lock in:', f);
    }
  }
}
