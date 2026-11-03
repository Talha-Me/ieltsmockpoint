const fs = require('fs');
const content = fs.readFileSync('D:/personal websites/ieltsmockpoint/FrontPage/Frontend/speaking.html', 'utf8');
const gridIdx = content.indexOf('id="spGrid"');
const endGridIdx = content.indexOf('</div>', gridIdx + 3000);
console.log(content.substring(gridIdx + 2000, gridIdx + 4500));
