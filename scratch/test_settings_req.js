const http = require('http');

http.get('http://localhost:5001/api/system-settings', res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Data:', data);
  });
}).on('error', err => {
  console.log('Server not currently running on 5001 or error:', err.message);
});
