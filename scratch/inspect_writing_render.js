const fs = require('fs');
const content = fs.readFileSync('D:/personal websites/ieltsmockpoint/public/cambridge-writing.html', 'utf8');

const renderIdx = content.indexOf('function render()');
if (renderIdx !== -1) {
  console.log(content.substring(renderIdx, renderIdx + 1500));
}
