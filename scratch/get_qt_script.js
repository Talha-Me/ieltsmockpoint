const fs = require('fs');
const html = fs.readFileSync('../FrontPage/Frontend/home.html', 'utf8');

const start = html.indexOf('const SVG={');
const end = html.indexOf('// band predictor', start);
console.log(html.substring(start, end));
