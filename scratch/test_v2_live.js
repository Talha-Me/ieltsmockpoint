const http = require('http');

['http://localhost:5001/cambridge-listening-v2?book=21&test=1', 'http://localhost:5001/cambridge-reading-v2?book=21&test=1'].forEach(url => {
  http.get(url, res => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', () => {
      console.log(url.split('?')[0].split('/').pop(), '-> Status:', res.statusCode, 'Length:', d.length, 'Has psUnlockModal:', d.includes('id="psUnlockModal"'));
    });
  });
});
