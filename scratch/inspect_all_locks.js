const fs = require('fs');
const js = fs.readFileSync('D:/personal websites/ieltsmockpoint/views/cambridgetest/cambridge-writing-test.js', 'utf8');
let idx = -1;
while ((idx = js.indexOf('isCurrentSessionLocked', idx + 1)) !== -1) {
  console.log('Match at', idx, ':\n', js.substring(idx - 50, idx + 150));
}
