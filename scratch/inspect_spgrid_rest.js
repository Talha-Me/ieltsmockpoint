const fs = require('fs');
const content = fs.readFileSync('D:/personal websites/ieltsmockpoint/FrontPage/Frontend/speaking.html', 'utf8');

const spGridStart = content.indexOf('<div class="sp-grid" id="spGrid">');
console.log(content.substring(spGridStart + 2200, spGridStart + 5000));
