const http = require('http');

const payload = JSON.stringify({
  task1: {
    question: "The chart below shows the number of men and women in further education in Britain.",
    essay: "The bar chart illustrates the proportions of male and female students in further education across three academic years: 1970/71, 1980/81, and 1990/91. Overall, it can be clearly seen that full-time education saw a continuous increase for both genders, while part-time education showed fluctuating trends. In 1970/71, the number of men in full-time education was approximately 100 thousand, whereas women accounted for about 50 thousand. Over the following two decades, both figures rose significantly, with female full-time students reaching almost 200 thousand by 1990/91. In contrast, part-time education was dominated by male students initially at around 1,000 thousand, though women's participation increased dramatically to nearly equal men by 1990/91."
  },
  task2: {
    question: "Some people think that universities should provide graduates with the knowledge and skills needed in the workplace.",
    essay: "" // Empty / unsubmitted!
  }
});

const req = http.request({
  host: 'localhost',
  port: 5001,
  path: '/evaluate-writing-all',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload)
  }
}, res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    console.log('HTTP Status:', res.statusCode);
    const json = JSON.parse(d);
    console.log('final_band:', json.data?.final_band);
    console.log('task1 band:', json.data?.task1?.overall_band);
    console.log('task2 band:', json.data?.task2?.overall_band);
    console.log('task2 not_submitted:', json.data?.task2?.not_submitted);
  });
});

req.on('error', err => console.error(err));
req.write(payload);
req.end();
