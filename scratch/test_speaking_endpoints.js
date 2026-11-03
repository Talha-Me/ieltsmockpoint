const http = require('http');

const testUrls = [
  'http://localhost:5001/speaking',
  'http://localhost:5001/speaking-test',
  'http://localhost:5001/api/speaking-tests'
];

let pending = testUrls.length;
testUrls.forEach(url => {
  http.get(url, res => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', () => {
      console.log(url, 'Status:', res.statusCode, 'Length:', d.length);
      if (--pending === 0) process.exit(0);
    });
  });
});
