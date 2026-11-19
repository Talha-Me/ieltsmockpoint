const fs = require('fs');
const path = require('path');

let cachedShell = null;
function getSharedShell() {
  if (cachedShell) return cachedShell;
  const refHtml = fs.readFileSync(path.join(__dirname, '..', 'public', 'listening-exercises.html'), 'utf8');
  const blogHtml = fs.readFileSync(path.join(__dirname, '..', 'views', 'blog.html'), 'utf8');
  const navHtml = fs.readFileSync(path.join(__dirname, '..', 'FrontPage', 'Frontend', 'navbar.html'), 'utf8');

  const refStyle = refHtml.slice(refHtml.indexOf('<style>') + 7, refHtml.indexOf('</style>'));
  const navCssStart = refStyle.indexOf('/* Container */');
  const navCssEnd = refStyle.indexOf('/* Page Hero */') !== -1 ? refStyle.indexOf('/* Page Hero */') : refStyle.indexOf('/* Hero */');
  const sharedNavCss = refStyle.slice(navCssStart, navCssEnd);

  const blogStyle = blogHtml.slice(blogHtml.indexOf('<style>') + 7, blogHtml.indexOf('</style>'));
  const fIdx = blogStyle.indexOf('footer{');
  const sharedFooterCss = fIdx !== -1 ? blogStyle.slice(fIdx) : '';
  const sharedFooterHtml = refHtml.slice(refHtml.indexOf('<!-- Shared Footer -->'), refHtml.indexOf('</footer>') + 9);

  cachedShell = { sharedNavCss, sharedFooterCss, sharedHeaderHtml: navHtml.trim(), sharedFooterHtml };
  return cachedShell;
}

function esc(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderSpeakingCueCardPage(card, allCards) {
  const { sharedNavCss, sharedFooterCss, sharedHeaderHtml, sharedFooterHtml } = getSharedShell();
  const canonical = `https://ieltsmockpoint.com/speaking-cue-cards/${card.slug}`;
  const related = allCards
    .filter(c => c.slug !== card.slug)
    .sort((a, b) => (a.category === card.category ? -1 : 1) - (b.category === card.category ? -1 : 1))
    .slice(0, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: `${card.title} — IELTS Speaking Part 2 Cue Card & ${card.band} Sample Answer`,
        description: `IELTS Speaking Part 2 Cue Card: ${card.part2Prompt} Includes ${card.band} sample answer, Band 9 vocabulary, and Part 3 follow-up questions with model answers.`,
        mainEntityOfPage: canonical,
        author: { '@type': 'Organization', name: 'IELTS Mockpoint' },
        publisher: { '@type': 'Organization', name: 'IELTS Mockpoint', url: 'https://ieltsmockpoint.com' }
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ieltsmockpoint.com/' },
          { '@type': 'ListItem', position: 2, name: 'Speaking Cue Cards', item: 'https://ieltsmockpoint.com/speaking-cue-cards' },
          { '@type': 'ListItem', position: 3, name: card.title, item: canonical }
        ]
      },
      {
        '@type': 'FAQPage',
        mainEntity: card.part3Questions.map(item => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a }
        }))
      }
    ]
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-620WY8NNVE"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-620WY8NNVE');
  </script>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(card.title)} | IELTS Speaking Cue Card (${esc(card.band)})</title>
  <meta name="description" content="Read a ${esc(card.band)} IELTS Speaking Part 2 sample answer for '${esc(card.title)}' with cue card bullets, Band 9 vocabulary, 2-minute practice timer, and Part 3 answers.">
  <link rel="canonical" href="${canonical}">
  <meta property="og:title" content="${esc(card.title)} — ${esc(card.band)} Sample Answer | IELTS Mockpoint">
  <meta property="og:description" content="Official-style IELTS Part 2 cue card, ${esc(card.band)} monologue, Band 9 phrases, and Part 3 follow-up answers.">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="https://ieltsmockpoint.com/Brandlogo.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(card.title)} — ${esc(card.band)} Sample Answer | IELTS Mockpoint">
  <meta name="twitter:description" content="Official-style IELTS Part 2 cue card, ${esc(card.band)} monologue, Band 9 phrases, and Part 3 follow-up answers.">
  <meta name="twitter:image" content="https://ieltsmockpoint.com/Brandlogo.png">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Sora:wght@600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
  <style>
    :root{--navy:#0b2b52;--navy-2:#103a6b;--blue:#1565c9;--blue-light:#eaf2fd;--red:#e0202d;--red-dark:#b5121d;--ink:#0d1f36;--muted:#5d708c;--line:#e3e9f3;--surface:#f4f7fb;--white:#ffffff;--r:18px;}
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Inter',system-ui,sans-serif;color:var(--ink);background:#ffffff;line-height:1.65;overflow-x:hidden;-webkit-font-smoothing:antialiased}
    h1,h2,h3,h4{font-family:'Sora',system-ui,sans-serif;color:var(--navy);line-height:1.25}
    .prog{position:fixed;top:0;left:0;height:3px;width:0%;background:linear-gradient(90deg,var(--red),var(--blue));z-index:200}

    ${sharedNavCss}

    /* Hero matching blog.html */
    .hero{position:relative;overflow:hidden;padding:54px 0 46px;background:radial-gradient(900px 500px at 85% -10%,rgba(21,101,201,.11),transparent 60%),radial-gradient(700px 420px at -5% 15%,rgba(224,32,45,.07),transparent 55%),linear-gradient(180deg,#ffffff 0%,#f8fbff 100%);border-bottom:1px solid var(--line)}
    .shape{position:absolute;border-radius:50%;filter:blur(48px);pointer-events:none;z-index:0}
    .shape.a{width:300px;height:300px;background:rgba(21,101,201,.11);top:-90px;right:8%;animation:floatA 14s ease-in-out infinite}
    .shape.b{width:240px;height:240px;background:rgba(224,32,45,.08);bottom:-70px;left:4%;animation:floatB 16s ease-in-out infinite}
    @keyframes floatA{0%,100%{transform:translate(0,0)}50%{transform:translate(-18px,16px)}}
    @keyframes floatB{0%,100%{transform:translate(0,0)}50%{transform:translate(16px,-18px)}}
    .hero-in{position:relative;z-index:1;max-width:860px}
    .crumbs{font-size:.82rem;color:var(--muted);margin-bottom:14px;display:flex;flex-wrap:wrap;gap:6px;align-items:center}
    .crumbs a{color:var(--blue);text-decoration:none;font-weight:600}
    .badge-row{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px;align-items:center}
    .cat-tag{display:inline-flex;align-items:center;gap:6px;padding:5px 12px;border-radius:999px;background:var(--blue-light);color:var(--blue);font-size:.76rem;font-weight:800;text-transform:uppercase;letter-spacing:.05em}
    .band-tag{display:inline-flex;align-items:center;gap:5px;padding:5px 12px;border-radius:999px;background:#fef2f2;color:var(--red);border:1px solid #fecaca;font-size:.76rem;font-weight:800}
    .time-tag{font-size:.8rem;color:var(--muted);font-weight:600}
    .hero h1{font-size:clamp(1.75rem,3.4vw,2.55rem);font-weight:800;letter-spacing:-.025em;margin-bottom:14px}

    /* Main Content Layout */
    .article-wrap{max-width:980px;margin:0 auto;padding:38px 24px 72px;display:grid;grid-template-columns:1fr;gap:28px}
    .cue-card-box{background:#fff;border:1.5px solid #cfe2fe;border-left:5px solid var(--blue);border-radius:18px;padding:26px 28px;box-shadow:0 14px 34px rgba(11,43,82,.07)}
    .cue-label{font-size:.75rem;font-weight:800;text-transform:uppercase;letter-spacing:.07em;color:var(--blue);margin-bottom:8px;display:flex;align-items:center;gap:6px}
    .cue-prompt{font-family:'Sora',sans-serif;font-size:1.18rem;font-weight:700;color:var(--navy);margin-bottom:12px}
    .cue-sub{font-size:.9rem;font-weight:700;color:var(--muted);margin-bottom:8px}
    .cue-bullets{padding-left:20px;color:var(--ink);font-size:.96rem}
    .cue-bullets li{margin-bottom:5px}

    /* Interactive Timer + TTS Bar */
    .practice-bar{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:14px;background:var(--surface);border:1px solid var(--line);border-radius:16px;padding:16px 20px}
    .timer-display{display:flex;align-items:center;gap:12px}
    .timer-clock{font-family:'Sora',sans-serif;font-size:1.55rem;font-weight:800;color:var(--navy);background:#fff;border:1.5px solid #dbeafe;padding:6px 14px;border-radius:12px;min-width:96px;text-align:center}
    .timer-phase{font-size:.82rem;font-weight:700;color:var(--muted)}
    .timer-actions{display:flex;flex-wrap:wrap;gap:8px}
    .t-btn{border:1px solid var(--line);background:#fff;color:var(--navy);font-family:'Inter',sans-serif;font-size:.82rem;font-weight:700;padding:9px 14px;border-radius:10px;cursor:pointer;display:inline-flex;align-items:center;gap:6px;transition:all .16s ease}
    .t-btn:hover{border-color:var(--blue);color:var(--blue);background:var(--blue-light)}
    .t-btn.primary{background:var(--blue);border-color:var(--blue);color:#fff}
    .t-btn.primary:hover{background:var(--navy);border-color:var(--navy);color:#fff}
    .t-btn.red{background:var(--red);border-color:var(--red);color:#fff}
    .t-btn.red:hover{background:var(--red-dark);border-color:var(--red-dark)}

    /* Sample Answer */
    .panel{background:#fff;border:1px solid var(--line);border-radius:18px;padding:28px;box-shadow:0 8px 24px rgba(11,43,82,.04)}
    .panel-head{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;margin-bottom:18px;padding-bottom:14px;border-bottom:1px solid var(--line)}
    .panel-head h2{font-size:1.25rem}
    .answer-body p{font-size:1.02rem;color:#1e293b;margin-bottom:16px;line-height:1.8}
    .answer-body p:last-child{margin-bottom:0}
    .examiner-note{margin-top:20px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:14px;padding:16px 18px;display:flex;gap:12px;align-items:flex-start;font-size:.92rem;color:#14532d}

    /* Vocab Grid */
    .vocab-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px}
    .vocab-item{background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:14px 16px;transition:transform .18s ease,border-color .18s ease}
    .vocab-item:hover{transform:translateY(-2px);border-color:#bfdbfe}
    .vocab-item strong{display:block;font-family:'Sora',sans-serif;font-size:.95rem;color:var(--blue);margin-bottom:4px}
    .vocab-item span{font-size:.86rem;color:var(--muted)}

    /* Part 3 */
    .p3-item{padding:18px 0;border-bottom:1px solid var(--line)}
    .p3-item:last-child{border-bottom:none;padding-bottom:0}
    .p3-q{font-family:'Sora',sans-serif;font-size:1.02rem;font-weight:700;color:var(--navy);margin-bottom:8px}
    .p3-a{font-size:.96rem;color:#334155;line-height:1.7}

    /* CTA Banner matching blog.html */
    .mock{position:relative;overflow:hidden;border-radius:22px;padding:34px 30px;background:linear-gradient(125deg,var(--navy) 0%,var(--navy-2) 55%,var(--blue) 100%);color:#fff;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:20px;box-shadow:0 18px 40px rgba(11,43,82,.18)}
    .mock h3{color:#fff;font-size:1.35rem;margin-bottom:6px}
    .mock p{color:rgba(255,255,255,.85);font-size:.94rem;max-width:520px}
    .mock-btns{display:flex;flex-wrap:wrap;gap:10px}
    .m-btn{padding:11px 20px;border-radius:11px;font-family:'Sora',sans-serif;font-size:.88rem;font-weight:700;text-decoration:none;transition:transform .15s ease}
    .m-btn:hover{transform:translateY(-2px)}
    .m-btn.red{background:var(--red);color:#fff}
    .m-btn.white{background:#fff;color:var(--navy)}

    /* Related Grid */
    .rel-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:16px}
    .rel-card{display:flex;flex-direction:column;background:#fff;border:1px solid var(--line);border-radius:16px;padding:20px;text-decoration:none;color:inherit;transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease}
    .rel-card:hover{transform:translateY(-4px);box-shadow:0 16px 32px rgba(11,43,82,.09);border-color:#bfdbfe}
    .rel-card h4{font-size:1rem;margin:10px 0 8px}
    .rel-card span.go{margin-top:auto;font-size:.84rem;font-weight:700;color:var(--blue)}

    ${sharedFooterCss}
    @media(max-width:640px){.panel,.cue-card-box{padding:20px}.practice-bar{padding:14px}}
  </style>
</head>
<body>
  <div class="prog" id="prog"></div>
  ${sharedHeaderHtml}

  <section class="hero">
    <div class="shape a"></div>
    <div class="shape b"></div>
    <div class="wrap hero-in">
      <div class="crumbs">
        <a href="/">Home</a> &rsaquo;
        <a href="/speaking-cue-cards">Speaking Cue Cards</a> &rsaquo;
        <span>${esc(card.category)}</span>
      </div>
      <div class="badge-row">
        <span class="cat-tag"><i class="bi bi-mic-fill"></i> ${esc(card.category)}</span>
        <span class="band-tag"><i class="bi bi-award-fill"></i> ${esc(card.band)} Sample</span>
        <span class="time-tag"><i class="bi bi-clock"></i> ${esc(card.readTime)}</span>
      </div>
      <h1>${esc(card.title)}</h1>
    </div>
  </section>

  <main class="article-wrap">
    <section class="cue-card-box">
      <div class="cue-label"><i class="bi bi-card-text"></i> IELTS Speaking Part 2 &middot; Candidate Task Card</div>
      <div class="cue-prompt">${esc(card.part2Prompt)}</div>
      <div class="cue-sub">You should say:</div>
      <ul class="cue-bullets">
        ${card.bullets.map(b => `<li>${esc(b)}</li>`).join('')}
      </ul>
    </section>

    <section class="practice-bar" aria-label="Speaking practice timer">
      <div class="timer-display">
        <div class="timer-clock" id="timerClock">01:00</div>
        <div>
          <div style="font-family:'Sora',sans-serif;font-weight:700;font-size:.92rem;color:var(--navy);">Part 2 Practice Timer</div>
          <div class="timer-phase" id="timerPhase">Ready: 1 min prep or 2 min speaking</div>
        </div>
      </div>
      <div class="timer-actions">
        <button type="button" class="t-btn" id="prepTimerBtn"><i class="bi bi-hourglass-split"></i> 1-Min Prep</button>
        <button type="button" class="t-btn red" id="speakTimerBtn"><i class="bi bi-mic-fill"></i> 2-Min Speak</button>
        <button type="button" class="t-btn" id="resetTimerBtn"><i class="bi bi-arrow-counterclockwise"></i> Reset</button>
      </div>
    </section>

    <article class="panel">
      <div class="panel-head">
        <h2><i class="bi bi-chat-square-quote-fill" style="color:var(--blue);margin-right:8px;"></i>${esc(card.band)} Model Answer</h2>
        <button type="button" class="t-btn primary" id="listenSampleBtn"><i class="bi bi-volume-up-fill"></i> Listen to Sample Answer</button>
      </div>
      <div class="answer-body" id="sampleAnswerText">
        ${card.sampleAnswer.map(p => `<p>${esc(p)}</p>`).join('')}
      </div>
      <div class="examiner-note">
        <i class="bi bi-check-circle-fill" style="color:#16a34a;font-size:1.2rem;flex-shrink:0;margin-top:2px;"></i>
        <div><strong>Examiner Tip:</strong> ${esc(card.examinerTip)}</div>
      </div>
    </article>

    <section class="panel">
      <div class="panel-head">
        <h2><i class="bi bi-stars" style="color:var(--red);margin-right:8px;"></i>High-Scoring Vocabulary &amp; Idioms</h2>
      </div>
      <div class="vocab-grid">
        ${card.vocab.map(v => `
          <div class="vocab-item">
            <strong>${esc(v.phrase)}</strong>
            <span>${esc(v.meaning)}</span>
          </div>
        `).join('')}
      </div>
    </section>

    <section class="panel">
      <div class="panel-head">
        <h2><i class="bi bi-question-circle-fill" style="color:var(--blue);margin-right:8px;"></i>Part 3 Follow-Up Questions &amp; Model Answers</h2>
      </div>
      ${card.part3Questions.map((item, idx) => `
        <div class="p3-item">
          <div class="p3-q">Q${idx + 1}. ${esc(item.q)}</div>
          <div class="p3-a">${esc(item.a)}</div>
        </div>
      `).join('')}
    </section>

    <section class="mock">
      <div>
        <h3>Practise This Cue Card with Our AI Examiner</h3>
        <p>Speak aloud with a lifelike 3D IELTS examiner, record your 2-minute response, and receive instant Band score feedback.</p>
      </div>
      <div class="mock-btns">
        <a href="/speaking.html" class="m-btn red">Start AI Speaking Test &rarr;</a>
        <a href="/speaking-cue-cards" class="m-btn white">All Cue Cards</a>
      </div>
    </section>

    <section>
      <h2 style="font-size:1.3rem;margin-bottom:16px;">More IELTS Speaking Cue Cards</h2>
      <div class="rel-grid">
        ${related.map(r => `
          <a href="/speaking-cue-cards/${esc(r.slug)}" class="rel-card">
            <span class="cat-tag" style="align-self:flex-start;">${esc(r.category)} &middot; ${esc(r.band)}</span>
            <h4>${esc(r.title)}</h4>
            <span class="go">Read Sample Answer &rarr;</span>
          </a>
        `).join('')}
      </div>
    </section>
  </main>

  ${sharedFooterHtml}
  <script src="/shared-layout.js"></script>
  <script src="/auth-nav.js"></script>
  <script>
    window.addEventListener('scroll', () => {
      const h = document.documentElement;
      const sc = h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight);
      const p = document.getElementById('prog');
      if (p) p.style.width = (sc * 100) + '%';
    });

    // Interactive Prep & Speaking Timer
    let timerId = null;
    let remaining = 60;
    function fmt(s) {
      const m = Math.floor(s / 60);
      const sec = s % 60;
      return String(m).padStart(2, '0') + ':' + String(sec).padStart(2, '0');
    }
    function startCountdown(seconds, label) {
      if (timerId) clearInterval(timerId);
      remaining = seconds;
      document.getElementById('timerClock').textContent = fmt(remaining);
      document.getElementById('timerPhase').textContent = label;
      timerId = setInterval(() => {
        remaining--;
        document.getElementById('timerClock').textContent = fmt(Math.max(0, remaining));
        if (remaining <= 0) {
          clearInterval(timerId);
          timerId = null;
          document.getElementById('timerPhase').textContent = 'Time up! Review the Band 9 answer below.';
        }
      }, 1000);
    }
    document.getElementById('prepTimerBtn').addEventListener('click', () => startCountdown(60, 'Preparation time running (1 min)...'));
    document.getElementById('speakTimerBtn').addEventListener('click', () => startCountdown(120, 'Speaking time running (2 mins)...'));
    document.getElementById('resetTimerBtn').addEventListener('click', () => {
      if (timerId) clearInterval(timerId);
      timerId = null;
      remaining = 60;
      document.getElementById('timerClock').textContent = '01:00';
      document.getElementById('timerPhase').textContent = 'Ready: 1 min prep or 2 min speaking';
    });

    // Listen to Sample Answer TTS
    let speaking = false;
    document.getElementById('listenSampleBtn').addEventListener('click', function () {
      if (!('speechSynthesis' in window)) return;
      if (speaking) {
        window.speechSynthesis.cancel();
        speaking = false;
        this.innerHTML = '<i class="bi bi-volume-up-fill"></i> Listen to Sample Answer';
        return;
      }
      window.speechSynthesis.cancel();
      const text = Array.from(document.querySelectorAll('#sampleAnswerText p')).map(p => p.textContent).join(' ');
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-GB';
      u.rate = 0.96;
      u.onend = () => {
        speaking = false;
        this.innerHTML = '<i class="bi bi-volume-up-fill"></i> Listen to Sample Answer';
      };
      speaking = true;
      this.innerHTML = '<i class="bi bi-stop-circle-fill"></i> Stop Audio';
      window.speechSynthesis.speak(u);
    });
  </script>
</body>
</html>`;
}

module.exports = { renderSpeakingCueCardPage };
