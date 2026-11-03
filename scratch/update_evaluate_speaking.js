const fs = require('fs');

let ev = fs.readFileSync('../routes/evaluate.js', 'utf8');

// Function to sanitize spoken answers
const sanitizeFn = `
function sanitizeSpeakingAnswer(text) {
  if (!text || typeof text !== 'string') return '';
  const trimmed = text.trim();
  if (
    trimmed.includes('Listening to your voice') ||
    trimmed.includes('Speak clearly into your microphone') ||
    trimmed.includes('Your spoken words will appear here')
  ) {
    return '';
  }
  return trimmed;
}
`;

if (!ev.includes('function sanitizeSpeakingAnswer')) {
  ev = ev.replace('async function evaluateSpeakingInterview(speakingData) {', sanitizeFn + '\nasync function evaluateSpeakingInterview(speakingData) {');
}

// Update how answers are mapped into sections
const oldP1Map = 'const a = answers[`p1_q${idx}`] || "(No response recorded)";';
const newP1Map = 'const a = sanitizeSpeakingAnswer(answers[`p1_q${idx}`]) || "(No response recorded)";';
if (ev.includes(oldP1Map)) {
  ev = ev.replace(oldP1Map, newP1Map);
}

const oldP2Map = 'const p2Ans = answers["p2_response"] || "(No response recorded)";';
const newP2Map = 'const p2Ans = sanitizeSpeakingAnswer(answers["p2_response"]) || "(No response recorded)";';
if (ev.includes(oldP2Map)) {
  ev = ev.replace(oldP2Map, newP2Map);
}

const oldP3Map = 'const a = answers[`p3_q${idx}`] || "(No response recorded)";';
const newP3Map = 'const a = sanitizeSpeakingAnswer(answers[`p3_q${idx}`]) || "(No response recorded)";';
if (ev.includes(oldP3Map)) {
  ev = ev.replace(oldP3Map, newP3Map);
}

fs.writeFileSync('../routes/evaluate.js', ev, 'utf8');
console.log('Successfully added answer sanitization to routes/evaluate.js');
