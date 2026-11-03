const fs = require('fs');

const appJs = fs.readFileSync('D:/personal websites/ieltsmockpoint/app.js', 'utf8');

let idx = -1;
while ((idx = appJs.indexOf('cambridge', idx + 1)) !== -1) {
  const line = appJs.substring(idx - 30, idx + 120);
  if (line.includes('app.get(') || line.includes('app.use(')) {
    console.log(line);
  }
}
