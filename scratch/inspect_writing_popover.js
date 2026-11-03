const fs = require('fs');
const content = fs.readFileSync('D:/personal websites/ieltsmockpoint/public/cambridge-writing.html', 'utf8');

const renderIdx = content.indexOf('part-popover');
if (renderIdx !== -1) {
  console.log(content.substring(renderIdx - 100, renderIdx + 1200));
}
