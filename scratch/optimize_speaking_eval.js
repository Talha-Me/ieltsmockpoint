const fs = require('fs');
let ev = fs.readFileSync('../routes/evaluate.js', 'utf8');
ev = ev.replace('const groqModels = ["openai/gpt-oss-120b", "llama-3.3-70b-versatile"];', 'const groqModels = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant"];');
ev = ev.replace('model: "gemini-2.5-flash",', 'model: "gemini-1.5-flash",');
fs.writeFileSync('../routes/evaluate.js', ev, 'utf8');
console.log('Optimized AI models in routes/evaluate.js');
