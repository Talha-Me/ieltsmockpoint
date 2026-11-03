const fs = require('fs');
const content = fs.readFileSync('D:/personal websites/ieltsmockpoint/views/speaking_engine/speaking-test.html', 'utf8');

const modeIdx = content.indexOf('function setPracticeMode');
console.log(content.substring(modeIdx - 100, modeIdx + 1600));
