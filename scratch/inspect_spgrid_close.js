const fs = require('fs');
const content = fs.readFileSync('D:/personal websites/ieltsmockpoint/FrontPage/Frontend/speaking.html', 'utf8');

const spGridStart = content.indexOf('id="pop-sp-4"');
console.log(content.substring(spGridStart, spGridStart + 800));
