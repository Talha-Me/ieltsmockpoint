// fix_hub_braces.js
// Fix the extra closing brace before the speaking else-if block

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'FrontPage', 'Frontend', 'Practice-hub.html');
let content = fs.readFileSync(filePath, 'utf8');

// Normalize line endings to LF for easy processing
const normalized = content.replace(/\r\n/g, '\n');

// The bad pattern: listening block ends with "      `;\n    }\n    } else if(m.id==='speaking'){"
// Should be:                                  "      `;\n    } else if(m.id==='speaking'){"
const bad  = "      `;\n    }\n    } else if(m.id==='speaking'){";
const good = "      `;\n    } else if(m.id==='speaking'){";

if (!normalized.includes(bad)) {
  console.error('Pattern not found! Dumping nearby context...');
  const idx = normalized.indexOf("} else if(m.id==='speaking')");
  console.log('Context:', JSON.stringify(normalized.substring(idx - 50, idx + 60)));
  process.exit(1);
}

const fixed = normalized.replace(bad, good);
// Write back with CRLF where original had CRLF (restore original mixed endings would be complex, just use LF)
fs.writeFileSync(filePath, fixed, 'utf8');
console.log('Fixed! Removed extra closing brace before speaking block.');

// Verify
const verify = fs.readFileSync(filePath, 'utf8');
const count = (verify.match(/\} else if\(m\.id==='speaking'\)/g) || []).length;
console.log('speaking else-if occurrences:', count, '(should be 1)');
