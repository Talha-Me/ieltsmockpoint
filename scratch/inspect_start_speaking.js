const fs = require('fs');
const content = fs.readFileSync('D:/personal websites/ieltsmockpoint/views/speaking_engine/speaking-test.html', 'utf8');

const sIdx = content.indexOf('function startSpeakingExam');
console.log(content.substring(sIdx - 150, sIdx + 400));
