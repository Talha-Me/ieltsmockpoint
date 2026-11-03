const fs = require('fs');
const html = fs.readFileSync('public/writing-exercises.html', 'utf8');
console.log('Includes brand logo?', html.includes('/Brandlogo.png'));
console.log('Includes shared-layout.js?', html.includes('/shared-layout.js'));
console.log('Includes auth-nav.js?', html.includes('/auth-nav.js'));
console.log('Includes mobile sidebar?', html.includes('id="sb"'));
console.log('Includes footer?', html.includes('<footer'));
console.log('Includes unlock modal?', html.includes('id="ex-unlock-modal"'));
console.log('Includes exercises grid?', html.includes('id="exercisesGrid"'));
