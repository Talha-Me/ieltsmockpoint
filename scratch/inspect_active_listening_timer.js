const fs = require('fs');

const listeningJs = fs.readFileSync('D:/personal websites/ieltsmockpoint/views/test_pages/listening/scripts-listening.js', 'utf8');
const activePart = listeningJs.substring(listeningJs.indexOf('let parsedQuestionData = null;'));

let idx = -1;
while ((idx = activePart.indexOf('submitTest', idx + 1)) !== -1) {
  console.log('Active submitTest call/def at', idx, ':\n', activePart.substring(idx - 60, idx + 200));
}
