const fs = require('fs');
const content = fs.readFileSync('D:/personal websites/ieltsmockpoint/views/speaking_engine/speaking-test.html', 'utf8');

const introIdx = content.indexOf('id="introScreen"');
if (introIdx !== -1) {
  console.log('--- introScreen ---');
  console.log(content.substring(introIdx, introIdx + 1500));
}
