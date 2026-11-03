const fs = require('fs');
const content = fs.readFileSync('D:/personal websites/ieltsmockpoint/views/speaking_engine/speaking-test.html', 'utf8');

const navIdx = content.indexOf('<header');
if (navIdx !== -1) {
  console.log(content.substring(navIdx, navIdx + 1200));
}
