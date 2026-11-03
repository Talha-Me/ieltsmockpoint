const fs = require('fs');
const content = fs.readFileSync('D:/personal websites/ieltsmockpoint/FrontPage/Frontend/speaking.html', 'utf8');

const spGridStart = content.indexOf('<div class="sp-grid" id="spGrid">');
const spGridEnd = content.indexOf('</div>\n    </div>\n  </section>', spGridStart);

console.log('spGrid start:', spGridStart, 'spGrid end:', spGridEnd);
console.log(content.substring(spGridStart, spGridStart + 2500));
