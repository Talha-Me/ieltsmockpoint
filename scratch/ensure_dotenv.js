const fs = require('fs');
const path = require('path');

// 1. In routes/evaluate.js
let ev = fs.readFileSync('../routes/evaluate.js', 'utf8');
if (!ev.includes('require("dotenv").config')) {
  ev = 'require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });\n' + ev;
  fs.writeFileSync('../routes/evaluate.js', ev, 'utf8');
  console.log('Added dotenv to routes/evaluate.js');
}

// 2. In app.js
let app = fs.readFileSync('../app.js', 'utf8');
if (!app.startsWith('require("dotenv").config')) {
  app = 'require("dotenv").config({ path: require("path").resolve(__dirname, ".env") });\n' + app;
  fs.writeFileSync('../app.js', app, 'utf8');
  console.log('Added dotenv to top of app.js');
}
