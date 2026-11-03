const fs = require('fs');
const js = fs.readFileSync('D:/personal websites/ieltsmockpoint/views/cambridgetest/cambridge-writing-test.js', 'utf8');

const modalIdx = js.indexOf('function openTestUnlockModal');
if (modalIdx !== -1) {
  console.log(js.substring(modalIdx, modalIdx + 2000));
}
