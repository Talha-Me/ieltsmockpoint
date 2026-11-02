const fs = require('fs');
const html = fs.readFileSync('../FrontPage/Frontend/home.html', 'utf8');
const headEnd = html.indexOf('</head>');
const head = html.substring(0, headEnd);
const parts = head.split('<script type="application/ld+json">');
parts.slice(1).forEach((p, idx) => {
  const jsonStr = p.substring(0, p.indexOf('</script>'));
  console.log(`=== Schema #${idx+1} ===`);
  try {
    const obj = JSON.parse(jsonStr);
    console.log(JSON.stringify(obj, null, 2).substring(0, 400) + '...');
  } catch(e) {
    console.log('Error parsing JSON:', e.message);
    console.log(jsonStr.substring(0, 200));
  }
});
