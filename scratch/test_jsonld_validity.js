const http = require('http');

http.get('http://localhost:5001/', res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const s = data.indexOf('<script type="application/ld+json">');
    const e = data.indexOf('</script>', s);
    const jsonStr = data.substring(s + 35, e).trim();
    try {
      const obj = JSON.parse(jsonStr);
      console.log('JSON-LD valid! Graph count:', obj['@graph'].length);
      obj['@graph'].forEach((item, i) => {
        console.log(`  ${i+1}. @type: ${item['@type']} - ${item.name || item.url || ''}`);
      });
    } catch(err) {
      console.error('Invalid JSON-LD:', err.message);
    }
  });
});
