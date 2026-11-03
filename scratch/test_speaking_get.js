const http = require('http');

http.get('http://localhost:5001/speaking-test?id=1', res => {
  let body = '';
  res.on('data', c => body += c);
  res.on('end', () => {
    console.log('GET status:', res.statusCode);
    console.log('Includes cardExFemale:', body.includes('cardExFemale'));
    console.log('Includes cardExMale:', body.includes('cardExMale'));
    console.log('Includes previewVoiceSample:', body.includes('previewVoiceSample'));
    console.log('Includes avatar-hair-female:', body.includes('avatar-hair-female'));
    console.log('Includes avatar-necklace:', body.includes('avatar-necklace'));
  });
});
