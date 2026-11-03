const fs = require('fs');

const listeningJs = fs.readFileSync('D:/personal websites/ieltsmockpoint/views/test_pages/listening/scripts-listening.js', 'utf8');

const sIdx = listeningJs.indexOf('async function submitTest() {\n  if (isSubmitting) return;');
console.log(listeningJs.substring(sIdx, sIdx + 1500));
