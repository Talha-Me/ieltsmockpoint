const fs = require('fs');
const path = require('path');

const sPath = path.join(__dirname, '../FrontPage/Frontend/speaking.html');
let html = fs.readFileSync(sPath, 'utf8');

// 1. UPDATE TITLE & META DESCRIPTION
html = html.replace(
  /<title>[^<]+<\/title>/,
  '<title>Free IELTS Speaking Mock Test Online 2026 | Live AI Voice Simulation</title>'
);

html = html.replace(
  /<meta name="description" content="[^"]*">/,
  '<meta name="description" content="Take a free IELTS Speaking mock test online with a live AI examiner. Practise Part 1 Interview, Part 2 Cue Card with 1-min timer, and Part 3 Discussion with instant band score and sentence upgrades.">'
);

// 2. NEW HERO HTML
const newHeroHtml = `<section class="hero">
  <div class="shape a"></div><div class="shape b"></div>
  <div class="wrap hero-inner">
    <div class="reveal">
      <p class="crumb"><a href="/">Home</a> / IELTS Speaking</p>
      <div><span class="soon" style="background:#ecfdf5;color:#047857;border:1px solid #a7f3d0;">● LIVE AI SIMULATION</span><span class="paid" style="background:#eaf2fd;color:#1565c9;border:1px solid #bcd9fb;">Free Voice Practice</span></div>
      <h1>Live IELTS Speaking Mock Test: <span class="accent">Practise with AI Examiner</span></h1>
      <p class="lead">Sit an authentic 11–14 minute full IELTS Speaking exam. The AI examiner speaks real Cambridge questions aloud, transcribes your speech in real-time, and generates official band scores across Fluency, Vocabulary, Grammar, and Pronunciation.</p>
      <div class="hero-ctas">
        <a href="/speaking-test" class="btn btn-red" title="Start Free Speaking Mock Test">Start Free Speaking Test &rarr;</a>
        <a href="#speaking-tests" class="btn btn-outline" title="Browse Speaking Tests">Choose from 5 Mock Tests</a>
      </div>
      <div class="band-strip">
        <div class="band-cell"><strong>11–14 min</strong><span>Full Exam Simulation</span></div>
        <div class="band-cell"><strong>3 Parts</strong><span>Interactive Voice</span></div>
        <div class="band-cell"><strong>4 Criteria</strong><span>Instant Band Score</span></div>
      </div>
    </div>
    <div class="hero-side reveal">
      <div class="hero-card">
        <div class="mic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/></svg></div>
        <h2>Live AI Voice Examiner</h2>
        <p>Interactive speech recognition, 60s cue card preparation timer, and detailed sentence-level upgrades.</p>
        <div class="wave" aria-hidden="true"><i style="animation-delay:0s"></i><i style="animation-delay:.1s"></i><i style="animation-delay:.2s"></i><i style="animation-delay:.3s"></i><i style="animation-delay:.4s"></i><i style="animation-delay:.5s"></i><i style="animation-delay:.6s"></i><i style="animation-delay:.7s"></i><i style="animation-delay:.8s"></i><i style="animation-delay:.9s"></i><i style="animation-delay:.2s"></i><i style="animation-delay:.5s"></i></div>
      </div>
    </div>
  </div>
</section>`;

const heroStart = html.indexOf('<section class="hero"');
const heroEnd = html.indexOf('</section>', heroStart) + 10;
if (heroStart !== -1 && heroEnd !== -1) {
  html = html.substring(0, heroStart) + newHeroHtml + html.substring(heroEnd);
}

// 3. ADD AVAILABLE SPEAKING TESTS SECTION (BEFORE #format)
const speakingTestsSection = `
<section id="speaking-tests" style="background:#ffffff; border-bottom:1px solid var(--line); padding:60px 0;">
  <div class="wrap">
    <div class="section-head reveal">
      <div class="kicker">Official Full-Length Practice</div>
      <h2>Select an IELTS Speaking Mock Test</h2>
      <p>Choose any test below to start a live voice interview with the AI examiner. Each test contains authentic Part 1, Part 2 Cue Card, and Part 3 Discussion questions.</p>
    </div>

    <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(320px, 1fr)); gap:22px; margin-top:32px;">
      
      <!-- Test 1 -->
      <article class="reveal" style="background:var(--surface); border:1.5px solid var(--line); border-radius:18px; padding:24px; display:flex; flex-direction:column; transition:all 0.25s;" onmouseover="this.style.borderColor='var(--blue)'; this.style.transform='translateY(-4px)'" onmouseout="this.style.borderColor='var(--line)'; this.style.transform='none'">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <span style="font-family:'Sora',sans-serif; font-size:1.5rem; font-weight:800; color:var(--red);">01</span>
          <span style="font-size:0.72rem; font-weight:700; color:#047857; background:#ecfdf5; border:1px solid #a7f3d0; padding:2px 8px; border-radius:4px;">FREE FULL TEST</span>
        </div>
        <h3 style="font-family:'Sora',sans-serif; font-size:1.1rem; font-weight:800; color:var(--navy); margin-bottom:10px;">Speaking Mock Test 1</h3>
        <p style="font-size:0.84rem; color:var(--muted); line-height:1.5; margin-bottom:16px;">
          <strong>Part 1:</strong> Hometown &amp; Free Time<br>
          <strong>Part 2:</strong> Describe a memorable journey you made<br>
          <strong>Part 3:</strong> Modern Tourism &amp; Travel Technology
        </p>
        <div style="margin-top:auto; padding-top:14px; border-top:1px dashed var(--line); display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size:0.78rem; color:var(--muted); font-weight:600;"><i class="bi bi-clock"></i> 11–14 min</span>
          <a href="/speaking-test?id=1" class="btn btn-red" style="padding:8px 18px; font-size:0.86rem;">Start Test &rarr;</a>
        </div>
      </article>

      <!-- Test 2 -->
      <article class="reveal" style="background:var(--surface); border:1.5px solid var(--line); border-radius:18px; padding:24px; display:flex; flex-direction:column; transition:all 0.25s;" onmouseover="this.style.borderColor='var(--blue)'; this.style.transform='translateY(-4px)'" onmouseout="this.style.borderColor='var(--line)'; this.style.transform='none'">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <span style="font-family:'Sora',sans-serif; font-size:1.5rem; font-weight:800; color:var(--blue);">02</span>
          <span style="font-size:0.72rem; font-weight:700; color:#1e40af; background:#eff6ff; border:1px solid #bfdbfe; padding:2px 8px; border-radius:4px;">ACADEMIC &amp; GT</span>
        </div>
        <h3 style="font-family:'Sora',sans-serif; font-size:1.1rem; font-weight:800; color:var(--navy); margin-bottom:10px;">Speaking Mock Test 2</h3>
        <p style="font-size:0.84rem; color:var(--muted); line-height:1.5; margin-bottom:16px;">
          <strong>Part 1:</strong> Studies, Work &amp; Mobile Technology<br>
          <strong>Part 2:</strong> Describe an ambitious person you know<br>
          <strong>Part 3:</strong> Ambition, Success &amp; Career Pressure
        </p>
        <div style="margin-top:auto; padding-top:14px; border-top:1px dashed var(--line); display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size:0.78rem; color:var(--muted); font-weight:600;"><i class="bi bi-clock"></i> 11–14 min</span>
          <a href="/speaking-test?id=2" class="btn btn-red" style="padding:8px 18px; font-size:0.86rem;">Start Test &rarr;</a>
        </div>
      </article>

      <!-- Test 3 -->
      <article class="reveal" style="background:var(--surface); border:1.5px solid var(--line); border-radius:18px; padding:24px; display:flex; flex-direction:column; transition:all 0.25s;" onmouseover="this.style.borderColor='var(--blue)'; this.style.transform='translateY(-4px)'" onmouseout="this.style.borderColor='var(--line)'; this.style.transform='none'">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <span style="font-family:'Sora',sans-serif; font-size:1.5rem; font-weight:800; color:var(--blue);">03</span>
          <span style="font-size:0.72rem; font-weight:700; color:#1e40af; background:#eff6ff; border:1px solid #bfdbfe; padding:2px 8px; border-radius:4px;">ACADEMIC &amp; GT</span>
        </div>
        <h3 style="font-family:'Sora',sans-serif; font-size:1.1rem; font-weight:800; color:var(--navy); margin-bottom:10px;">Speaking Mock Test 3</h3>
        <p style="font-size:0.84rem; color:var(--muted); line-height:1.5; margin-bottom:16px;">
          <strong>Part 1:</strong> Food, Cooking &amp; Daily Routine<br>
          <strong>Part 2:</strong> Describe a challenging problem you solved<br>
          <strong>Part 3:</strong> Problem Solving, Education &amp; Artificial Intelligence
        </p>
        <div style="margin-top:auto; padding-top:14px; border-top:1px dashed var(--line); display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size:0.78rem; color:var(--muted); font-weight:600;"><i class="bi bi-clock"></i> 11–14 min</span>
          <a href="/speaking-test?id=3" class="btn btn-red" style="padding:8px 18px; font-size:0.86rem;">Start Test &rarr;</a>
        </div>
      </article>

      <!-- Test 4 -->
      <article class="reveal" style="background:var(--surface); border:1.5px solid var(--line); border-radius:18px; padding:24px; display:flex; flex-direction:column; transition:all 0.25s;" onmouseover="this.style.borderColor='var(--blue)'; this.style.transform='translateY(-4px)'" onmouseout="this.style.borderColor='var(--line)'; this.style.transform='none'">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <span style="font-family:'Sora',sans-serif; font-size:1.5rem; font-weight:800; color:var(--blue);">04</span>
          <span style="font-size:0.72rem; font-weight:700; color:#1e40af; background:#eff6ff; border:1px solid #bfdbfe; padding:2px 8px; border-radius:4px;">ACADEMIC &amp; GT</span>
        </div>
        <h3 style="font-family:'Sora',sans-serif; font-size:1.1rem; font-weight:800; color:var(--navy); margin-bottom:10px;">Speaking Mock Test 4</h3>
        <p style="font-size:0.84rem; color:var(--muted); line-height:1.5; margin-bottom:16px;">
          <strong>Part 1:</strong> Friendships, Social Life &amp; Music<br>
          <strong>Part 2:</strong> Describe a traditional celebration or festival<br>
          <strong>Part 3:</strong> Cultural Heritage, Traditions &amp; Globalization
        </p>
        <div style="margin-top:auto; padding-top:14px; border-top:1px dashed var(--line); display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size:0.78rem; color:var(--muted); font-weight:600;"><i class="bi bi-clock"></i> 11–14 min</span>
          <a href="/speaking-test?id=4" class="btn btn-red" style="padding:8px 18px; font-size:0.86rem;">Start Test &rarr;</a>
        </div>
      </article>

      <!-- Test 5 -->
      <article class="reveal" style="background:var(--surface); border:1.5px solid var(--line); border-radius:18px; padding:24px; display:flex; flex-direction:column; transition:all 0.25s;" onmouseover="this.style.borderColor='var(--blue)'; this.style.transform='translateY(-4px)'" onmouseout="this.style.borderColor='var(--line)'; this.style.transform='none'">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <span style="font-family:'Sora',sans-serif; font-size:1.5rem; font-weight:800; color:var(--blue);">05</span>
          <span style="font-size:0.72rem; font-weight:700; color:#1e40af; background:#eff6ff; border:1px solid #bfdbfe; padding:2px 8px; border-radius:4px;">ACADEMIC &amp; GT</span>
        </div>
        <h3 style="font-family:'Sora',sans-serif; font-size:1.1rem; font-weight:800; color:var(--navy); margin-bottom:10px;">Speaking Mock Test 5</h3>
        <p style="font-size:0.84rem; color:var(--muted); line-height:1.5; margin-bottom:16px;">
          <strong>Part 1:</strong> Shopping Habits, Transport &amp; Daily Life<br>
          <strong>Part 2:</strong> Describe a practical skill you'd like to learn<br>
          <strong>Part 3:</strong> Lifelong Learning &amp; The Future of Employment
        </p>
        <div style="margin-top:auto; padding-top:14px; border-top:1px dashed var(--line); display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size:0.78rem; color:var(--muted); font-weight:600;"><i class="bi bi-clock"></i> 11–14 min</span>
          <a href="/speaking-test?id=5" class="btn btn-red" style="padding:8px 18px; font-size:0.86rem;">Start Test &rarr;</a>
        </div>
      </article>

    </div>
  </div>
</section>
`;

if (!html.includes('id="speaking-tests"')) {
  const formatIdx = html.indexOf('<section id="format">');
  if (formatIdx !== -1) {
    html = html.substring(0, formatIdx) + speakingTestsSection + '\n' + html.substring(formatIdx);
  }
}

fs.writeFileSync(sPath, html, 'utf8');
console.log('FrontPage/Frontend/speaking.html updated with Speaking Tests!');
