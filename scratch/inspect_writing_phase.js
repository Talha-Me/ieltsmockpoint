const fs = require('fs');
const writing = fs.readFileSync('D:/personal websites/ieltsmockpoint/public/cambridge-writing.html', 'utf8');

const testLockIdx = writing.indexOf('function isTestLocked');
if (testLockIdx !== -1) {
  console.log('--- Lock Functions ---');
  console.log(writing.substring(testLockIdx, testLockIdx + 1200));
}

const modalMarkupIdx = writing.indexOf('id="psUnlockModal"');
if (modalMarkupIdx !== -1) {
  console.log('--- Modal Markup ---');
  console.log(writing.substring(modalMarkupIdx - 35, modalMarkupIdx + 1500));
}

const styleIdx = writing.indexOf('.ps-modal-overlay');
if (styleIdx !== -1) {
  console.log('--- Modal CSS ---');
  console.log(writing.substring(styleIdx, styleIdx + 1500));
}
