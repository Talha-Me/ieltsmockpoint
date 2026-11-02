const fs = require('fs');

['../views/cambridgetest/scripts-listening-practice.js', '../views/cambridgetest/scripts-reading-practice.js'].forEach(f => {
  if (fs.existsSync(f)) {
    const c = fs.readFileSync(f, 'utf8');
    const lines = c.split('\n');
    lines.forEach((l, i) => {
      if (l.toLowerCase().includes('practice this') || l.toLowerCase().includes('part only') || l.toLowerCase().includes('section only')) {
        console.log(f, i+1, l.trim());
      }
    });
  }
});
