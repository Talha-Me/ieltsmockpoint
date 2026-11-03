// check_build_fn.js
const fs = require('fs');
const content = fs.readFileSync('FrontPage/Frontend/Practice-hub.html', 'utf8');

const buildStart = content.indexOf('function build()');
const buildEnd = content.indexOf('\nfunction countTo(', buildStart);
const buildFn = content.substring(buildStart, buildEnd);

// Check brace balance
let open = 0, close = 0;
for (const c of buildFn) { if(c==='{') open++; if(c==='}') close++; }
console.log('build() braces - open:', open, 'close:', close, open===close ? '✅ balanced' : '❌ UNBALANCED');

// Show if-else chain lines
const lines = buildFn.split('\n');
lines.forEach((l, i) => {
  const t = l.trim();
  if (t.includes("if(m.id===") || t.startsWith("} else if") || t.startsWith("else if") || t === '}' || t.startsWith("g+=`<div class=\"grid\"")) {
    console.log(`  L${i+1}: ${t.substring(0, 100)}`);
  }
});
