const fs = require('fs');
const html = fs.readFileSync('../FrontPage/Frontend/home.html', 'utf8');

const idx = html.indexOf('function renderQT');
console.log(html.substring(idx - 100, idx + 1200));
