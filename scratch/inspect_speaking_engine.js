const fs = require('fs');
const content = fs.readFileSync('D:/personal websites/ieltsmockpoint/views/speaking_engine/speaking-test.html', 'utf8');
console.log('File length:', content.length, 'lines:', content.split('\n').length);

const startIdx = content.indexOf('startSpeakingExam');
if (startIdx !== -1) {
  console.log('--- startSpeakingExam ---');
  console.log(content.substring(startIdx - 100, startIdx + 800));
}
