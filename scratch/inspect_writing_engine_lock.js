const fs = require('fs');
const content = fs.readFileSync('D:/personal websites/ieltsmockpoint/views/cambridgetest/cambridge-writing-test.js', 'utf8');

const lockIdx = content.indexOf('isCurrentSessionLocked');
if (lockIdx !== -1) {
  console.log('--- isCurrentSessionLocked in writing-test.js ---');
  console.log(content.substring(lockIdx - 100, lockIdx + 1200));
} else {
  console.log('Searching for appPhase or isTestLocked:');
  const pIdx = content.indexOf('appPhase');
  if (pIdx !== -1) console.log(content.substring(pIdx - 50, pIdx + 1200));
}
