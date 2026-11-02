const fs = require('fs');
const hub = fs.readFileSync('../FrontPage/Frontend/Practice-hub.html', 'utf8');

const idx = hub.indexOf('.btn-card-reading {');
console.log(hub.substring(idx, idx + 1000));
