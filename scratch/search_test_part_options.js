const fs = require('fs');
const path = require('path');

function searchPhrase(dir, phrase) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const f of files) {
    const full = path.join(dir, f.name);
    if (f.isDirectory()) searchPhrase(full, phrase);
    else if (f.isFile() && (f.name.endsWith('.js') || f.name.endsWith('.html') || f.name.endsWith('.ejs'))) {
      const c = fs.readFileSync(full, 'utf8');
      if (c.toLowerCase().includes(phrase.toLowerCase())) {
        console.log('FOUND:', full);
        const lines = c.split('\n');
        lines.forEach((l, i) => {
          if (l.toLowerCase().includes(phrase.toLowerCase())) {
            console.log(`  Line ${i+1}: ${l.trim().substring(0, 120)}`);
          }
        });
      }
    }
  }
}

console.log('--- Searching for "this part only" ---');
searchPhrase('../views', 'this part only');
console.log('--- Searching for "this section only" ---');
searchPhrase('../views', 'this section only');
console.log('--- Searching for "practice this part" ---');
searchPhrase('../views', 'practice this part');
