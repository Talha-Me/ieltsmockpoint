const fs = require('fs');
const content = fs.readFileSync('D:/personal websites/ieltsmockpoint/views/cambridgetest/cambridge-writing-test.js', 'utf8');

const startIdx = content.indexOf('function startTest');
if (startIdx !== -1) {
  console.log(content.substring(startIdx, startIdx + 800));
}
