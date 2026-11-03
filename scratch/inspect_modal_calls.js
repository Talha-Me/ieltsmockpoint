const fs = require('fs');
const js = fs.readFileSync('D:/personal websites/ieltsmockpoint/views/cambridgetest/cambridge-writing-test.js', 'utf8');
const html = fs.readFileSync('D:/personal websites/ieltsmockpoint/views/cambridgetest/cambridge-writing-test.html', 'utf8');

console.log('openTestUnlockModal in JS:');
let idx = -1;
while ((idx = js.indexOf('openTestUnlockModal', idx + 1)) !== -1) {
  console.log('Match at', idx, ':\n', js.substring(idx - 100, idx + 150));
}

console.log('openTestUnlockModal in HTML:');
idx = -1;
while ((idx = html.indexOf('openTestUnlockModal', idx + 1)) !== -1) {
  console.log('Match at', idx, ':\n', html.substring(idx - 100, idx + 150));
}
