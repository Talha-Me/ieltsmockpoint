const fs = require('fs');

const listeningJs = fs.readFileSync('D:/personal websites/ieltsmockpoint/views/test_pages/listening/scripts-listening.js', 'utf8');

const sIdx = listeningJs.indexOf('submitTest()');
// search around active timer in scripts-listening.js
const tIdx = listeningJs.indexOf('minutesRemaining <= 0');
console.log(listeningJs.substring(tIdx - 100, tIdx + 400));
