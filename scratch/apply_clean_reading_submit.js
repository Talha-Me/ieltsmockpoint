const fs = require('fs');

const path = 'D:/personal websites/ieltsmockpoint/views/test_pages/reading/scripts-reading.js';
let content = fs.readFileSync(path, 'utf8');

const sIdx = content.indexOf('async function submitTest(reason) {');
const targetCall = 'showMockConfirmationModal(scoreToSend, mistakesToSend, reason);';
const callIdx = content.indexOf(targetCall, sIdx);
const closeIdx = content.indexOf('}', callIdx);

console.log('sIdx:', sIdx, 'callIdx:', callIdx, 'closeIdx:', closeIdx);

const replacement = `  // রিডিং শেষ হলে কোনো মডাল বা ইন্টারাপশন ছাড়া সরাসরি মক লবিতে রিডাইরেক্ট করবে যাতে Writing Video ও Writing Test চালু হয়
  window.location.href = "/mock-test";
}`;

content = content.substring(0, callIdx) + replacement + content.substring(closeIdx + 1);

fs.writeFileSync(path, content, 'utf8');
console.log('Successfully replaced showMockConfirmationModal with auto-redirect to /mock-test!');
