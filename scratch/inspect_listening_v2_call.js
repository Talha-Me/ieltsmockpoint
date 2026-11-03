const fs = require('fs');
const js = fs.readFileSync('D:/personal websites/ieltsmockpoint/views/cambridgetest/scripts-listening-practice-v2.js', 'utf8');

let idx = -1;
while ((idx = js.indexOf('isCurrentSessionLocked()', idx + 1)) !== -1) {
  console.log('Call at', idx, ':\n', js.substring(idx - 100, idx + 250));
}
