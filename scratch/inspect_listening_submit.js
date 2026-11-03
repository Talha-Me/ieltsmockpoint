const fs = require('fs');

const listeningJs = fs.readFileSync('D:/personal websites/ieltsmockpoint/views/test_pages/listening/scripts-listening.js', 'utf8');

console.log('--- submitTest in scripts-listening.js ---');
let idx = -1;
while ((idx = listeningJs.indexOf('submitTest', idx + 1)) !== -1) {
  console.log('Match at', idx, ':\n', listeningJs.substring(idx - 50, idx + 250));
}
