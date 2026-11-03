const fs = require('fs');

const authJs = fs.readFileSync('D:/personal websites/ieltsmockpoint/routes/auth.js', 'utf8');

const rIdx = authJs.indexOf('reading_practice');
console.log(authJs.substring(rIdx - 50, rIdx + 400));
