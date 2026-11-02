const fs = require('fs');
const content = fs.readFileSync('../app.js', 'utf8');
const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("app.get('/')") || lines[i].includes('app.get("/")') || lines[i].includes('express.static')) {
    console.log(i + 1, lines[i]);
  }
}
