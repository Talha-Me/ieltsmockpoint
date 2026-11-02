const { execSync } = require('child_process');

const diff = execSync('git diff -U1 ../FrontPage/Frontend/home.html', { encoding: 'utf8' });
const lines = diff.split('\n');
lines.forEach(l => {
  if (l.startsWith('@@')) console.log(l);
});
