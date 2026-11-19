const fs = require('fs');
const path = require('path');
const { getTask1VisualHtml } = require('./task1Visuals');
const { getWritingSampleFaqs } = require('./writingSampleFaqs');

let cachedShell = null;
function getSharedShell() {
  if (cachedShell) return cachedShell;
  const refPath = path.join(__dirname, '..', 'public', 'listening-exercises.html');
  const refHtml = fs.readFileSync(refPath, 'utf8');
  const refStyle = refHtml.slice(refHtml.indexOf('<style>') + 7, refHtml.indexOf('</style>'));
  const navCssStart = refStyle.indexOf('/* Container */');
  const navCssEnd = refStyle.indexOf('/* Page Hero */') !== -1 ? refStyle.indexOf('/* Page Hero */') : refStyle.indexOf('/* Hero */');
  const sharedNavCss = refStyle.slice(navCssStart, navCssEnd);
  const sharedFooterCss = refStyle.slice(refStyle.indexOf('/* Footer */'));
  const sharedHeaderHtml = refHtml.slice(refHtml.indexOf('<!-- Shared Header -->'), refHtml.indexOf('</header>') + 9);
  const sharedFooterHtml = refHtml.slice(refHtml.indexOf('<!-- Shared Footer -->'), refHtml.indexOf('</footer>') + 9);
  cachedShell = { sharedNavCss, sharedFooterCss, sharedHeaderHtml, sharedFooterHtml };
  return cachedShell;
}

function esc(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderWritingSamplePage(sample, allSamples) {
  const { sharedNavCss, sharedFooterCss, sharedHeaderHtml, sharedFooterHtml } = getSharedShell();
  const canonical = `https://ieltsmockpoint.com/writing-samples/${sample.slug}`;
  const c1Label = sample.module === 'task2' ? 'Task Response' : 'Task Achievement';
  const c1Val = sample.module === 'task2' ? sample.criteria.tr : sample.criteria.ta;

  const related = allSamples
    .filter(s => s.slug !== sample.slug && (s.module === sample.module || s.band === sample.band))
    .slice(0, 3);

  const faqs = getWritingSampleFaqs(sample);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: `${sample.title} — ${sample.type} (Band ${sample.band})`,
        description: sample.seoDesc,
        mainEntityOfPage: canonical,
        author: { '@type': 'Organization', name: 'IELTS Mockpoint' },
        publisher: { '@type': 'Organization', name: 'IELTS Mockpoint', url: 'https://ieltsmockpoint.com' }
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ieltsmockpoint.com/' },
          { '@type': 'ListItem', position: 2, name: 'IELTS Writing Samples', item: 'https://ieltsmockpoint.com/writing-samples' },
          { '@type': 'ListItem', position: 3, name: sample.title, item: canonical }
        ]
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map(f => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a }
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
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${esc(sample.seoTitle)}</title>
  <meta name="description" content="${esc(sample.seoDesc)}">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <meta name="theme-color" content="#0b2b52">
  <link rel="canonical" href="${canonical}">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="IELTS Mockpoint">
  <meta property="og:title" content="${esc(sample.seoTitle)}">
  <meta property="og:description" content="${esc(sample.seoDesc)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="https://ieltsmockpoint.com/Brandlogo.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(sample.title)} | IELTS Mockpoint">
  <meta name="twitter:description" content="${esc(sample.metaDesc || sample.summary || '')}">
  <meta name="twitter:image" content="https://ieltsmockpoint.com/Brandlogo.png">
  <link rel="icon" type="image/png" href="/mpfavicon.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sora:wght@600;700;800&display=swap" rel="stylesheet">
  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
  <style>
    :root {
      --navy: #0b2b52;
      --blue: #1565c9;
      --blue-light: #eaf2fd;
      --red: #e0202d;
      --red-dark: #b5121d;
      --surface: #f4f7fb;
      --bg: #ffffff;
      --text: #0f2038;
      --muted: #5d708c;
      --line: #e3e9f3;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    h1, h2, h3, h4 { font-family: 'Sora', sans-serif; color: var(--navy); line-height: 1.22; }
    a { color: inherit; text-decoration: none; }
    #prog {
      position: fixed; top: 0; left: 0; height: 3px; width: 0;
      background: linear-gradient(90deg, var(--blue), var(--red));
      z-index: 200; transition: width 0.1s linear;
    }
    ${sharedNavCss}

    main { position: relative; z-index: 1; flex: 1; }

    /* Single-Blog Editorial Hero */
    .article-hero {
      position: relative;
      overflow: hidden;
      padding: 64px 0 42px;
      background: linear-gradient(180deg, #f8fbff 0, #fff 100%);
      border-bottom: 1px solid var(--line);
    }
    .shape { position: absolute; border-radius: 50%; pointer-events: none; }
    .shape.a {
      top: -210px; left: -180px; width: 520px; height: 520px;
      background: radial-gradient(circle at 30% 30%, var(--blue-light), transparent 70%);
      animation: float 9s ease-in-out infinite;
    }
    .shape.b {
      bottom: -240px; right: -160px; width: 480px; height: 480px;
      background: radial-gradient(circle at 70% 70%, rgba(224, 32, 45, .08), transparent 70%);
      animation: float 11s ease-in-out infinite reverse;
    }
    @keyframes float { 50% { transform: translateY(22px); } }

    .hero-in { position: relative; z-index: 1; max-width: 900px; }
    .crumbs { font-size: .82rem; color: var(--muted); margin-bottom: 20px; }
    .crumbs a { color: var(--blue); font-weight: 600; }
    .kicker {
      display: inline-flex; align-items: center; gap: 8px;
      color: var(--red); font-size: .84rem; font-weight: 800;
      margin-bottom: 14px;
    }
    .kicker:before { content: ''; width: 7px; height: 7px; border-radius: 50%; background: var(--red); }
    .article-hero h1 { font-size: clamp(1.9rem, 4.2vw, 3rem); margin-bottom: 16px; letter-spacing: -.025em; }
    .excerpt { font-size: 1.04rem; line-height: 1.72; color: var(--muted); max-width: 760px; }
    .meta { display: flex; flex-wrap: wrap; gap: 10px 18px; margin-top: 22px; color: var(--muted); font-size: .84rem; align-items: center; }
    .meta b { color: var(--navy); }
    .pill { background: var(--blue-light); color: var(--blue); padding: 6px 12px; border-radius: 999px; font-weight: 800; font-size: .74rem; }
    .pill.band { background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; }

    /* Single-Blog 2-Column Layout */
    .article-layout {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 290px;
      gap: 36px;
      align-items: start;
      padding: 50px 0 76px;
    }
    .article-card { min-width: 0; }

    .prompt-quote {
      border-left: 4px solid var(--blue);
      background: var(--blue-light);
      padding: 18px 22px;
      border-radius: 0 14px 14px 0;
      color: var(--navy);
      margin-bottom: 30px;
      font-size: 1rem;
      line-height: 1.7;
      font-weight: 600;
    }
    .prompt-quote span {
      display: block;
      font-family: 'Sora', sans-serif;
      font-size: .74rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: .04em;
      color: var(--blue);
      margin-bottom: 6px;
    }
    .t1-visual {
      background: #ffffff;
      border: 1.5px solid var(--line);
      border-radius: 16px;
      padding: 16px;
      margin: -10px 0 30px;
      box-shadow: 0 8px 22px rgba(11, 43, 82, .05);
    }
    .t1-visual figcaption {
      font-family: 'Sora', sans-serif;
      font-size: .82rem;
      font-weight: 700;
      color: var(--navy);
      margin-bottom: 12px;
      text-align: center;
    }
    .t1-visual svg { width: 100%; height: auto; display: block; border-radius: 10px; }
    .t1-table-wrap { overflow-x: auto; }
    .t1-table { width: 100%; border-collapse: collapse; font-size: .9rem; }
    .t1-table th, .t1-table td { padding: 10px 12px; border: 1px solid var(--line); text-align: left; }
    .t1-table th { background: var(--blue-light); color: var(--navy); font-family: 'Sora', sans-serif; font-size: .82rem; font-weight: 700; }
    .t1-table tr:nth-child(even) td { background: #f8fafc; }

    .essay-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 20px;
      padding-bottom: 14px;
      border-bottom: 1px solid var(--line);
      flex-wrap: wrap;
    }
    .copy-btn {
      background: var(--surface);
      border: 1.5px solid var(--line);
      color: var(--navy);
      padding: 8px 15px;
      border-radius: 999px;
      font-family: 'Sora', sans-serif;
      font-size: .78rem;
      font-weight: 700;
      cursor: pointer;
      transition: all .2s;
    }
    .copy-btn:hover { border-color: var(--blue); color: var(--blue); background: var(--blue-light); }

    .essay-para { margin-bottom: 20px; font-size: 1.06rem; line-height: 1.85; color: #334155; white-space: pre-line; }
    .para-tag {
      display: inline-block;
      font-family: 'Sora', sans-serif;
      font-size: .69rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: .04em;
      color: var(--blue);
      background: var(--blue-light);
      padding: 3px 9px;
      border-radius: 6px;
      margin-bottom: 6px;
    }

    .section-block {
      margin-top: 38px;
      padding-top: 30px;
      border-top: 1px solid var(--line);
    }
    .section-block h2 { font-size: 1.45rem; margin-bottom: 14px; }
    .crit-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 16px 0; }
    .crit-box {
      background: var(--surface);
      border: 1.5px solid var(--line);
      border-radius: 14px;
      padding: 14px 10px;
      text-align: center;
    }
    .crit-box strong { display: block; font-family: 'Sora', sans-serif; font-size: 1.3rem; color: var(--blue); }
    .crit-box span { font-size: .74rem; color: var(--muted); font-weight: 700; }

    .vocab-list { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
    .v-chip {
      background: var(--blue-light);
      border: 1px solid #d3e4fa;
      color: var(--navy);
      font-size: .82rem;
      font-weight: 700;
      padding: 6px 12px;
      border-radius: 8px;
    }
    .tip-list { padding-left: 20px; color: #334155; font-size: 1rem; line-height: 1.8; }
    .tip-list li { margin-bottom: 8px; }

    .faq-block details {
      background: #fff;
      border: 1.5px solid var(--line);
      border-radius: 14px;
      padding: 16px 20px;
      margin-bottom: 12px;
      transition: border-color .2s;
    }
    .faq-block details:hover { border-color: #bfdbfe; }
    .faq-block summary {
      font-family: 'Sora', sans-serif;
      font-weight: 700;
      font-size: .98rem;
      color: var(--navy);
      cursor: pointer;
      list-style: none;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .faq-block summary::after { content: "+"; color: var(--red); font-size: 1.25rem; font-weight: 800; }
    .faq-block details[open] summary::after { content: "−"; }
    .faq-block details p {
      margin-top: 10px;
      font-size: .94rem;
      color: #475569;
      line-height: 1.7;
    }

    /* Sticky Sidebar */
    .side-card {
      position: sticky;
      top: 94px;
      background: var(--surface);
      border: 1.5px solid var(--line);
      border-radius: 20px;
      padding: 22px;
    }
    .side-card h3 { font-size: 1rem; margin-bottom: 12px; }
    .toc-links { display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }
    .toc-links a {
      font-size: .86rem;
      font-weight: 600;
      color: var(--muted);
      padding: 6px 10px;
      border-radius: 8px;
      transition: all .18s;
    }
    .toc-links a:hover { background: #fff; color: var(--blue); }
    .side-cta {
      display: block;
      text-align: center;
      background: var(--red);
      color: #fff;
      padding: 12px 16px;
      border-radius: 12px;
      font-family: 'Sora', sans-serif;
      font-weight: 700;
      font-size: .86rem;
      box-shadow: 0 10px 22px rgba(224, 32, 45, .25);
      transition: background .2s, transform .2s;
    }
    .side-cta:hover { background: var(--red-dark); transform: translateY(-2px); }

    /* Related Posts (Blog Style) */
    .rel-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; margin-top: 18px; }
    .rel-card {
      background: #fff;
      border: 1.5px solid var(--line);
      border-radius: 18px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      transition: transform .25s, border-color .25s, box-shadow .25s;
    }
    .rel-card:hover { transform: translateY(-6px); border-color: var(--blue); box-shadow: 0 18px 36px rgba(21, 101, 201, .12); }
    .rel-card .tag { align-self: flex-start; font-size: .7rem; font-weight: 800; color: var(--red); background: #fdecee; border-radius: 6px; padding: 3px 9px; }
    .rel-card strong { font-family: 'Sora', sans-serif; font-size: .95rem; color: var(--navy); line-height: 1.35; }

    ${sharedFooterCss}

    @media (max-width: 920px) {
      .article-layout { grid-template-columns: 1fr; }
      .side-card { position: static; }
      .rel-grid { grid-template-columns: 1fr; }
      .crit-grid { grid-template-columns: repeat(2, 1fr); }
    }
  </style>
  <script src="/shared-layout.js"></script>
  <script src="/auth-nav.js"></script>
</head>
<body>
  <div id="prog"></div>
  ${sharedHeaderHtml}

  <main>
    <section class="article-hero">
      <div class="shape a" aria-hidden="true"></div>
      <div class="shape b" aria-hidden="true"></div>
      <div class="wrap">
        <div class="hero-in">
          <div class="crumbs">
            <a href="/">Home</a> &rsaquo; <a href="/writing-samples">IELTS Writing Samples</a> &rsaquo; ${esc(sample.type)}
          </div>
          <div class="kicker">${esc(sample.moduleLabel)} &middot; ${esc(sample.type)}</div>
          <h1>${esc(sample.title)}</h1>
          <p class="excerpt">${esc(sample.seoDesc)}</p>
          <div class="meta">
            <span class="pill band">Band ${esc(sample.band)}</span>
            <span class="pill">${sample.wordCount} Words</span>
            <span>Reviewed by <b>IELTS Mockpoint</b></span>
          </div>
        </div>
      </div>
    </section>

    <div class="wrap">
      <div class="article-layout">
        <article class="article-card">
          <div class="prompt-quote" id="sec-prompt">
            <span>Official-Style Question Prompt</span>
            ${esc(sample.prompt)}
          </div>
          ${sample.module === 'task1' ? getTask1VisualHtml(sample.slug) : ''}

          <div class="essay-head" id="sec-essay">
            <h2>Full Model Answer (${sample.wordCount} Words)</h2>
            <button type="button" class="copy-btn" id="copySampleBtn">Copy Model Answer</button>
          </div>

          <div id="essayTextBody">
            ${sample.paragraphs.map(p => `<div class="essay-para"><span class="para-tag">${esc(p.label)}</span><div>${esc(p.text)}</div></div>`).join('')}
          </div>

          <section class="section-block" id="sec-review">
            <h2>Examiner Breakdown &amp; Band ${esc(sample.band)} Feedback</h2>
            <div class="crit-grid">
              <div class="crit-box"><strong>${esc(c1Val)}</strong><span>${esc(c1Label)}</span></div>
              <div class="crit-box"><strong>${esc(sample.criteria.cc)}</strong><span>Coherence</span></div>
              <div class="crit-box"><strong>${esc(sample.criteria.lr)}</strong><span>Lexical Resource</span></div>
              <div class="crit-box"><strong>${esc(sample.criteria.gra)}</strong><span>Grammar Range</span></div>
            </div>
            <p style="font-size:1rem;line-height:1.78;color:#334155;">${esc(sample.examinerNote)}</p>
          </section>

          <section class="section-block" id="sec-vocab">
            <h2>Band 8–9 Vocabulary &amp; Exam Tips</h2>
            <div class="vocab-list">
              ${sample.vocab.map(v => `<span class="v-chip">${esc(v)}</span>`).join('')}
            </div>
            <ul class="tip-list" style="margin-top:18px;">
              ${(sample.tips || []).map(t => `<li>${esc(t)}</li>`).join('')}
            </ul>
          </section>

          <section class="section-block faq-block" id="sec-faq">
            <h2>Frequently Asked Questions (${esc(sample.type)})</h2>
            ${faqs.map((f, i) => `
              <details${i === 0 ? ' open' : ''}>
                <summary>${esc(f.q)}</summary>
                <p>${esc(f.a)}</p>
              </details>
            `).join('')}
          </section>

          <section class="section-block">
            <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;">
              <h2 style="margin:0;">More IELTS Writing Samples</h2>
              <a href="/writing-samples" style="color:var(--blue);font-family:'Sora',sans-serif;font-weight:700;font-size:.88rem;">All 15 Samples &rarr;</a>
            </div>
            <div class="rel-grid">
              ${related.map(r => `<a href="/writing-samples/${r.slug}" class="rel-card">
                <span class="tag">${esc(r.type)} &middot; Band ${esc(r.band)}</span>
                <strong>${esc(r.title)}</strong>
              </a>`).join('')}
            </div>
          </section>
        </article>

        <aside class="side-card">
          <h3>Sample Quick Navigation</h3>
          <div class="toc-links">
            <a href="#sec-prompt">1. Question Prompt</a>
            <a href="#sec-essay">2. Model Answer (${sample.wordCount}w)</a>
            <a href="#sec-review">3. Examiner Breakdown</a>
            <a href="#sec-vocab">4. Vocabulary &amp; Tips</a>
            <a href="#sec-faq">5. Frequently Asked Questions</a>
          </div>
          <a href="/cambridge-writing.html" class="side-cta">Practice Writing Test Free &rarr;</a>
          <a href="/writing-exercises" style="display:block;margin-top:10px;text-align:center;color:var(--blue);font-weight:700;font-size:.84rem;text-decoration:none;">Practice by Task Type &rarr;</a>
        </aside>
      </div>
    </div>
  </main>

  ${sharedFooterHtml}

  <script>
    const prog = document.getElementById('prog'), hd = document.getElementById('hd');
    addEventListener('scroll', () => {
      if (hd) hd.classList.toggle('scrolled', scrollY > 10);
      const h = document.documentElement.scrollHeight - innerHeight;
      if (prog) prog.style.width = (h > 0 ? scrollY / h * 100 : 0) + '%';
    }, { passive: true });

    document.getElementById('copySampleBtn').addEventListener('click', function () {
      const text = ${JSON.stringify(sample.paragraphs.map(p => p.text).join('\n\n'))};
      navigator.clipboard.writeText(text).then(() => {
        this.textContent = 'Copied!';
      }).catch(() => {});
    });
  </script>
</body>
</html>`;
}

module.exports = { renderWritingSamplePage };
