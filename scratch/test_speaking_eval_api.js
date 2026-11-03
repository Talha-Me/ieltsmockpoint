const http = require('http');

const payload = JSON.stringify({
  testId: 1,
  answers: {
    p1_q0: "I am originally from Sylhet, which is a picturesque city located in the northeastern part of Bangladesh, surrounded by lush green tea gardens.",
    p1_q1: "What I love most is the serene environment and the welcoming attitude of the local people.",
    p1_q2: "I generally prefer outdoor activities because being close to nature refreshes my mind after a long week of work.",
    p1_q3: "Yes, over the past decade it has seen rapid urbanization with lots of new modern shopping malls and infrastructure.",
    p2_response: "I would like to talk about a memorable journey I took to Cox's Bazar two years ago with my university friends. We travelled by train, which was a very scenic route. During the trip we walked along the longest natural sea beach in the world, tasted delicious local seafood, and watched the breathtaking sunset. It was unforgettable because it was our last trip together before starting our professional careers.",
    p3_q0: "Modern technology has completely revolutionized travel through instant online bookings, GPS navigation, and digital translation apps.",
    p3_q1: "Without a doubt, travelling internationally breaks down cultural stereotypes and fosters global empathy and tolerance.",
    p3_q2: "Mass tourism often leads to severe environmental degradation, excessive plastic waste, and commercialization of historic local traditions.",
    p3_q3: "I believe people will travel even more in the future as global transportation becomes faster, more eco-friendly, and more affordable."
  }
});

const req = http.request('http://localhost:5001/api/evaluate-speaking', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload)
  }
}, (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    try {
      const json = JSON.parse(data);
      console.log('Success:', json.success);
      console.log('Overall Band:', json.data?.overall_band);
      console.log('FC Score:', json.data?.fluency_coherence?.score);
      console.log('LR Score:', json.data?.lexical_resource?.score);
      console.log('GRA Score:', json.data?.grammar?.score);
      console.log('PR Score:', json.data?.pronunciation?.score);
      console.log('Strengths:', json.data?.strengths);
    } catch(e) {
      console.log('Raw output:', data);
    }
  });
});

req.on('error', e => console.error('Error:', e.message));
req.write(payload);
req.end();
