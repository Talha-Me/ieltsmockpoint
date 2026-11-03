const fs = require('fs');
const content = fs.readFileSync('D:/personal websites/ieltsmockpoint/views/speaking_engine/speaking-test.html', 'utf8');

const testInitIdx = content.indexOf('currentTest');
if (testInitIdx !== -1) {
  console.log('--- currentTest and URL init ---');
  console.log(content.substring(testInitIdx - 50, testInitIdx + 1200));
}
