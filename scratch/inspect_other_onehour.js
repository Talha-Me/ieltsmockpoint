const fs = require('fs');

function searchInFiles(dir, term) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = dir + '/' + f;
    if (fs.statSync(full).isDirectory()) continue;
    const content = fs.readFileSync(full, 'utf8');
    if (content.includes(term)) {
      console.log(`Found '${term}' in ${f}`);
    }
  }
}

searchInFiles('D:/personal websites/ieltsmockpoint/views/cambridgetest', 'oneHourModal');
searchInFiles('D:/personal websites/ieltsmockpoint/views/cambridgetest', 'hasShownOneHourAlert');
searchInFiles('D:/personal websites/ieltsmockpoint/views/cambridgetest', '১ ঘণ্টা');
