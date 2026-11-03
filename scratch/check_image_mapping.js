const fs = require('fs');
const path = require('path');

const dir = path.resolve(__dirname, '../Writing part 1 pictures');
const files = fs.readdirSync(dir);

const mapping = {};

for (const f of files) {
  const match = f.match(/cambridge[-_]ielts[-_](\d+)[-_]academic[-_]writing[-_]test[-_](\d+)/i);
  if (!match) {
    console.error(`ERROR: No match for file: ${f}`);
    continue;
  }
  const book = parseInt(match[1]);
  const testNo = parseInt(match[2]);
  const key = `${book}-${testNo}`;
  const url = `https://pub-f88da22cc9ae4937a6641b7ee1702c05.r2.dev/Writing%20part%201%20pictures/${encodeURIComponent(f)}`;
  
  if (mapping[key]) {
    console.warn(`WARNING: Duplicate key ${key}: ${f} and ${mapping[key].file}`);
  }
  mapping[key] = { book, testNo, file: f, url };
}

console.log(`Mapped ${Object.keys(mapping).length} tests.`);

// Check all books 12-21, tests 1-4
let missing = [];
for (let b = 12; b <= 21; b++) {
  for (let t = 1; t <= 4; t++) {
    const key = `${b}-${t}`;
    if (!mapping[key]) {
      missing.push(key);
    } else {
      console.log(`Cambridge ${b} Test ${t} -> ${mapping[key].file}`);
    }
  }
}

if (missing.length > 0) {
  console.error("Missing mapping for:", missing);
} else {
  console.log("\nALL 40 tests have an exact, unique 1-to-1 image mapping!");
}
