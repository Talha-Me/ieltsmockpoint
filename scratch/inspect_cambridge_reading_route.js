const fs = require('fs');

const appJs = fs.readFileSync('D:/personal websites/ieltsmockpoint/app.js', 'utf8');

let idx = -1;
while ((idx = appJs.indexOf('/cambridge/reading', idx + 1)) !== -1) {
  console.log('Match at', idx, ':\n', appJs.substring(idx - 50, idx + 300));
}
