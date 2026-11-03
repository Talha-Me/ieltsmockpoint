const fs = require('fs');

const s = fs.readFileSync('../FrontPage/Frontend/speaking.html', 'utf8');
const heroIdx = s.indexOf('<section class="hero"');
const heroEnd = s.indexOf('</section>', heroIdx) + 10;
console.log('=== CURRENT HERO HTML ===');
console.log(s.substring(heroIdx, heroEnd));
