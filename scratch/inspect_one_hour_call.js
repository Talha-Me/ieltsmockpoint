const fs = require('fs');

const js = fs.readFileSync('D:/personal websites/ieltsmockpoint/views/cambridgetest/scripts-reading-practice-v2.js', 'utf8');

let idx = -1;
while ((idx = js.indexOf('showOneHourModal', idx + 1)) !== -1) {
  console.log('Match at', idx, ':\n', js.substring(idx - 100, idx + 200));
}
