const fs = require('fs');

const listeningJs = fs.readFileSync('D:/personal websites/ieltsmockpoint/views/test_pages/listening/scripts-listening.js', 'utf8');
const activePart = listeningJs.substring(listeningJs.indexOf('let parsedQuestionData = null;'));

const sIdx = activePart.indexOf('async function submitTest() {');
console.log(activePart.substring(sIdx, sIdx + 1500));
