const fs = require('fs');

const appJs = fs.readFileSync('D:/personal websites/ieltsmockpoint/app.js', 'utf8');
const idx = appJs.indexOf('reading-practice-v2.html');
console.log(appJs.substring(idx - 300, idx + 400));
