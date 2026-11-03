const fs = require('fs');
const js = fs.readFileSync('D:/personal websites/ieltsmockpoint/views/cambridgetest/scripts-listening-practice-v2.js', 'utf8');

const lockIdx = js.indexOf('isCurrentSessionLocked');
if (lockIdx !== -1) {
  console.log(js.substring(lockIdx - 100, lockIdx + 1400));
}
