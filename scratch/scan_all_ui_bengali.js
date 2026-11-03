const fs = require('fs');
const path = require('path');

const bengaliRegex = /[\u0980-\u09FF]/;

function scanDir(dir) {
  let results = [];
  try {
    const list = fs.readdirSync(dir);
    for (const item of list) {
      if (item === 'node_modules' || item === '.git' || item === 'scratch' || item === '.user_uploaded') continue;
      const full = path.join(dir, item);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        results = results.concat(scanDir(full));
      } else if (item.endsWith('.js') || item.endsWith('.html') || item.endsWith('.ejs') || item.endsWith('.json')) {
        const content = fs.readFileSync(full, 'utf8');
        if (bengaliRegex.test(content)) {
          // check if bengali is in non-comment lines
          const lines = content.split('\n');
          lines.forEach((line, idx) => {
            const tr = line.trim();
            if (bengaliRegex.test(tr) && !tr.startsWith('//') && !tr.startsWith('/*') && !tr.startsWith('*')) {
              results.push({ file: full, line: idx + 1, text: tr.substring(0, 120) });
            }
          });
        }
      }
    }
  } catch(e) {}
  return results;
}

const res = scanDir('D:/personal websites/ieltsmockpoint');
console.log('Total matches found:', res.length);
res.forEach(r => {
  if (r.file.includes('mock') || r.file.includes('test_pages') || r.file.includes('client') || r.file.includes('reading') || r.file.includes('writing') || r.file.includes('listening')) {
    console.log(`${r.file}:${r.line}: ${r.text}`);
  }
});
