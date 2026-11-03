const fs = require('fs');
const content = fs.readFileSync('D:/personal websites/ieltsmockpoint/public/cambridge-writing.html', 'utf8');

const modalFnIdx = content.indexOf('function openUnlockModal');
if (modalFnIdx !== -1) {
  console.log(content.substring(modalFnIdx, modalFnIdx + 2000));
}
