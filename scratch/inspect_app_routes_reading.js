const fs = require('fs');

const appJs = fs.readFileSync('D:/personal websites/ieltsmockpoint/app.js', 'utf8');

function findRoute(route) {
  let idx = -1;
  while ((idx = appJs.indexOf(route, idx + 1)) !== -1) {
    console.log(`Route '${route}' at ${idx}:\n`, appJs.substring(idx - 40, idx + 200));
  }
}

console.log('--- reading-test route ---');
findRoute('/reading-test');

console.log('--- cambridge reading route ---');
findRoute('/cambridge/reading');
findRoute('reading-practice');
