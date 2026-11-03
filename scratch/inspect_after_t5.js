const fs = require('fs');
const content = fs.readFileSync('D:/personal websites/ieltsmockpoint/FrontPage/Frontend/speaking.html', 'utf8');

const t5Idx = content.indexOf('Speaking Mock Test 5');
console.log(content.substring(t5Idx + 800, t5Idx + 1600));
