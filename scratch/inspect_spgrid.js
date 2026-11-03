const fs = require('fs');
const content = fs.readFileSync('D:/personal websites/ieltsmockpoint/FrontPage/Frontend/speaking.html', 'utf8');
const gridIdx = content.indexOf('id="spGrid"');
if (gridIdx !== -1) {
  console.log('--- spGrid Content ---');
  console.log(content.substring(gridIdx, gridIdx + 3000));
}
