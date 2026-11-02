const http = require('http');

http.get('http://localhost:5001/', res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('HTML Length:', data.length);
    console.log('Contains Question Type Hub:', data.includes('Question Type Hub'));
    console.log('Contains /listening-exercises?type=:', data.includes('/listening-exercises?type='));
    console.log('Contains /reading-exercises?type=:', data.includes('/reading-exercises?type='));
    console.log('Contains btn-card-reading:', data.includes('btn-card-reading'));
    console.log('Contains Course schema:', data.includes('Course'));
    console.log('Contains WebApplication schema:', data.includes('WebApplication'));
  });
});
