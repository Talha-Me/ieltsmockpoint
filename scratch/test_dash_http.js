const http = require('http');

http.get('http://localhost:5001/dashboard', res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('GET /dashboard status:', res.statusCode);
    console.log('Includes latestTestReviewBanner:', data.includes('latestTestReviewBanner'));
    console.log('Includes btn-review-item in table:', data.includes('btn-review-item'));
    console.log('Includes openTestReviewModal:', data.includes('openTestReviewModal'));
  });
}).on('error', err => console.error(err.message));
