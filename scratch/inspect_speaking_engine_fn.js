const fs = require('fs');
const content = fs.readFileSync('D:/personal websites/ieltsmockpoint/views/speaking_engine/speaking-test.html', 'utf8');

const fnIdx = content.indexOf('function startSpeakingExam');
if (fnIdx !== -1) {
  console.log('--- function startSpeakingExam ---');
  console.log(content.substring(fnIdx - 100, fnIdx + 1200));
}
