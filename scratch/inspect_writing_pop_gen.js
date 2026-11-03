const fs = require('fs');
const content = fs.readFileSync('D:/personal websites/ieltsmockpoint/public/cambridge-writing.html', 'utf8');

const popIdx = content.indexOf('pop-w-');
if (popIdx !== -1) {
  console.log(content.substring(popIdx - 100, popIdx + 1200));
}
