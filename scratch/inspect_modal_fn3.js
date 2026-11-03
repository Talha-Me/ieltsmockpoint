const fs = require('fs');
const content = fs.readFileSync('D:/personal websites/ieltsmockpoint/public/cambridge-writing.html', 'utf8');

const modalFnIdx = content.indexOf('FREE CANDIDATE ACCOUNT');
if (modalFnIdx !== -1) {
  console.log(content.substring(modalFnIdx - 100, modalFnIdx + 1200));
}
