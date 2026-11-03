const fs = require('fs');

const path = 'D:/personal websites/ieltsmockpoint/views/test_pages/reading/scripts-reading.js';
let content = fs.readFileSync(path, 'utf8');

const sIdx = content.indexOf('async function submitTest(reason) {');
const endIdx = content.indexOf('showMockConfirmationModal(scoreToSend, mistakesToSend, reason);\n}');

console.log('sIdx:', sIdx, 'endIdx:', endIdx);
if (sIdx !== -1 && endIdx !== -1) {
  console.log(content.substring(sIdx, endIdx + 70));
}
