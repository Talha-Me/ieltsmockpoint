const http = require('http');

['http://localhost:5001/speaking', 'http://localhost:5001/speaking.html'].forEach(url => {
  http.get(url, res => {
    console.log(url, 'Status:', res.statusCode);
  });
});
