const fs = require('fs');
const html = fs.readFileSync('../FrontPage/Frontend/home.html', 'utf8');
const start = html.indexOf('<script type="application/ld+json">');
const end = html.indexOf('</script>', start);
console.log(html.substring(start, end + 9));
