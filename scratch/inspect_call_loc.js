const fs = require('fs');
const js = fs.readFileSync('D:/personal websites/ieltsmockpoint/views/cambridgetest/cambridge-writing-test.js', 'utf8');
const idx = js.indexOf('if (isCurrentSessionLocked');
if (idx !== -1) {
  console.log(js.substring(idx - 200, idx + 400));
}
