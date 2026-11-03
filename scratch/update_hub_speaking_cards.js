const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
function edit(rel, pairs) {
  const p = path.join(root, rel);
  let c = fs.readFileSync(p, 'utf8');
  for (const [a, b, label] of pairs) {
    if (!c.includes(a)) { console.log('NOT FOUND:', rel, label); continue; }
    c = c.replace(a, () => b);
    console.log('OK:', rel, label);
  }
  fs.writeFileSync(p, c, 'utf8');
}

edit('FrontPage/Frontend/Practice-hub.html', [
  // header button
  ["${m.id==='listening'?'<a class=\"btn btn-red\" href=\"/listening-exercises\">Practice by Question Type →</a>':''}",
   "${m.id==='listening'?'<a class=\"btn btn-red\" href=\"/listening-exercises\">Practice by Question Type →</a>':''}${m.id==='speaking'?'<a class=\"btn btn-red\" href=\"/speaking.html#speaking-tests\">Practice by Part →</a>':''}",
   'header btn'],
  // banner
  ["    g+=`<div class=\"grid\">`;\r\n    let k=0",
   `    else if(m.id==='speaking'){
      g+=\`
        <div class="reading-feature-banner reveal">
          <div class="rf-content">
            <span class="rf-badge">NEW • AI EXAMINER</span>
            <h3>Practice IELTS Speaking by Part</h3>
            <p>Talk to a lifelike 3D examiner with a natural British voice (male or female). Practise Part 1, Part 2 or Part 3 on its own, or sit the full test, and get an instant band score with sentence-level upgrades.</p>
            <div class="rf-chips">
              <span>✓ Part 1 Interview</span>
              <span>✓ Part 2 Cue Card + Timer</span>
              <span>✓ Part 3 Discussion</span>
              <span>✓ Live Speech Recognition</span>
              <span>✓ 5 Full Tests</span>
            </div>
          </div>
          <a href="/speaking.html#speaking-tests" class="btn-banner">
            Explore All Speaking Tests →
          </a>
        </div>
      \`;
    }
    g+=\`<div class="grid">\`;\r\n    let k=0`, 'banner'],
  ["      const isExercisesMode = isReading || isListening;\r\n      const exercisesBaseUrl = isReading ? '/reading-exercises' : '/listening-exercises';\r\n      const setsCount = isReading ? '100+ exercises' : (isListening ? '70+ exercises' : `${list.length} set${list.length===1?'':'s'}`);",
   "      const isSpeaking = m.id === 'speaking';\r\n      const isExercisesMode = isReading || isListening || isSpeaking;\r\n      const exercisesBaseUrl = isReading ? '/reading-exercises' : '/listening-exercises';\r\n      const exercisesHref = isSpeaking ? `/speaking.html?part=${String(o.t).replace('Part-','')}#speaking-tests` : `${exercisesBaseUrl}?type=${encodeURIComponent(o.t)}`;\r\n      const setsCount = isReading ? '100+ exercises' : (isListening ? '70+ exercises' : (isSpeaking ? '5 tests' : `${list.length} set${list.length===1?'':'s'}`));",
   'vars'],
  ["<a href=\"${exercisesBaseUrl}?type=${encodeURIComponent(o.t)}\" class=\"btn-card-reading\">", "<a href=\"${exercisesHref}\" class=\"btn-card-reading\">", 'cta href'],
]);
