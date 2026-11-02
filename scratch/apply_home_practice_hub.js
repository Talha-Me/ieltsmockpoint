const fs = require('fs');
const path = require('path');

const homePath = path.join(__dirname, '../FrontPage/Frontend/home.html');
let html = fs.readFileSync(homePath, 'utf8');

// 1. UPDATE TITLE, META DESCRIPTION & KEYWORDS
html = html.replace(
  /<title>[^<]+<\/title>/,
  '<title>Free IELTS Mock Test Online 2026 | Full Mock, IELTS Practice & Question Type Hub</title>'
);

html = html.replace(
  /<meta name="description" content="[^"]*">/,
  '<meta name="description" content="Take a free IELTS mock test online with full IELTS practice tests, Cambridge 10-21 exams, and free IELTS practice by question type for Listening, Reading, Writing & Speaking. Authentic exam interface, instant band score & answers.">'
);

html = html.replace(
  /<meta name="keywords" content="[^"]*">/,
  '<meta name="keywords" content="IELTS mock test, free IELTS mock test, IELTS mock test online, IELTS practice, free IELTS practice, question type practice, IELTS question type practice, IELTS practice by question type, Cambridge IELTS practice test, IELTS listening practice by question type, IELTS reading practice by question type, free full IELTS mock test, Cambridge IELTS 10 to 19, IELTS writing practice, IELTS speaking mock test, IELTS band score calculator, IELTS computer based mock test, IELTS academic mock test, IELTS general training mock test, IELTS mock test Bangladesh">'
);

// 2. ENHANCE JSON-LD SCHEMA IN HEAD
const jsonLdStart = html.indexOf('<script type="application/ld+json">');
if (jsonLdStart !== -1) {
  const jsonLdEnd = html.indexOf('</script>', jsonLdStart);
  if (jsonLdEnd !== -1) {
    const rawJson = html.substring(jsonLdStart + 35, jsonLdEnd).trim();
    try {
      const parsed = JSON.parse(rawJson);
      if (parsed['@graph']) {
        // Update ItemList to include listening-exercises and reading-exercises
        const itemList = parsed['@graph'].find(g => g['@type'] === 'ItemList');
        if (itemList && Array.isArray(itemList.itemListElement)) {
          itemList.itemListElement = [
            { "@type": "ListItem", "position": 1, "name": "Free Full IELTS Mock Tests", "url": "https://ieltsmockpoint.com/mocks.html" },
            { "@type": "ListItem", "position": 2, "name": "IELTS Listening Practice by Question Type", "url": "https://ieltsmockpoint.com/listening-exercises" },
            { "@type": "ListItem", "position": 3, "name": "IELTS Reading Practice by Question Type", "url": "https://ieltsmockpoint.com/reading-exercises" },
            { "@type": "ListItem", "position": 4, "name": "IELTS Practice Hub (All Question Types)", "url": "https://ieltsmockpoint.com/practice-hub" },
            { "@type": "ListItem", "position": 5, "name": "Cambridge IELTS Listening Practice Test", "url": "https://ieltsmockpoint.com/cambridge-listening.html" },
            { "@type": "ListItem", "position": 6, "name": "Cambridge IELTS Reading Practice Test", "url": "https://ieltsmockpoint.com/cambridge-reading.html" },
            { "@type": "ListItem", "position": 7, "name": "Cambridge IELTS Writing Practice Test", "url": "https://ieltsmockpoint.com/cambridge-writing.html" },
            { "@type": "ListItem", "position": 8, "name": "IELTS Speaking Mock Test", "url": "https://ieltsmockpoint.com/speaking.html" }
          ];
        }

        // Add FAQ questions if not present
        const faq = parsed['@graph'].find(g => g['@type'] === 'FAQPage');
        if (faq && Array.isArray(faq.mainEntity)) {
          const hasQTypeFAQ = faq.mainEntity.some(q => q.name.includes('question type'));
          if (!hasQTypeFAQ) {
            faq.mainEntity.push({
              "@type": "Question",
              "name": "Where can I practice IELTS by question type for free?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "IELTS Mockpoint provides free practice for all major question types including Note Completion, Multiple Choice, Matching Headings, True/False/Not Given, Map Labelling, and Flow-charts with instant answers and script evidence."
              }
            });
          }
        }

        // Add Course & WebApplication schemas if not present
        if (!parsed['@graph'].some(g => g['@type'] === 'Course')) {
          parsed['@graph'].push({
            "@type": "Course",
            "name": "Free IELTS Mock Test & Question Type Practice",
            "description": "Comprehensive online IELTS preparation platform featuring full-length mock tests, Cambridge exams, and dedicated question-type practice for Listening, Reading, Writing, and Speaking.",
            "provider": {
              "@type": "Organization",
              "name": "IELTS Mockpoint",
              "sameAs": "https://ieltsmockpoint.com/"
            },
            "isAccessibleForFree": true,
            "hasCourseInstance": {
              "@type": "CourseInstance",
              "courseMode": "Online"
            }
          });
        }

        if (!parsed['@graph'].some(g => g['@type'] === 'WebApplication')) {
          parsed['@graph'].push({
            "@type": "WebApplication",
            "name": "IELTS Mockpoint Practice Engine",
            "url": "https://ieltsmockpoint.com/",
            "applicationCategory": "EducationalApplication",
            "operatingSystem": "All",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          });
        }

        const newLdJson = JSON.stringify(parsed);
        html = html.substring(0, jsonLdStart + 35) + newLdJson + html.substring(jsonLdEnd);
        console.log('JSON-LD schema updated successfully!');
      }
    } catch(e) {
      console.warn('Error parsing JSON-LD:', e.message);
    }
  }
}

// 3. UPDATE CSS FOR .qt CARDS, ACTION BUTTONS & META
const cssToAdd = `
/* Enhanced Question Type Cards with Practice Hub Integration */
.qt {
  display: flex;
  flex-direction: column;
}
.qt-meta-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}
.qt-chip {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--navy);
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 3px 8px;
}
.qt-badge-free {
  font-size: 0.7rem;
  font-weight: 700;
  color: #047857;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  border-radius: 6px;
  padding: 3px 8px;
}
.qt-card-action {
  margin-top: auto;
  padding-top: 14px;
}
.btn-card-reading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
  padding: 10px 16px;
  border-radius: 10px;
  font-family: 'Sora', sans-serif;
  font-size: 0.84rem;
  font-weight: 700;
  text-decoration: none;
  color: #fff !important;
  background: var(--red);
  border: 1.5px solid transparent;
  transition: all 0.22s cubic-bezier(0.2, 0.8, 0.2, 1);
  box-shadow: 0 4px 14px rgba(224, 32, 45, 0.22);
  position: relative;
  overflow: hidden;
  cursor: pointer;
}
.btn-card-reading::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 60%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.32), transparent);
  transform: skewX(-20deg);
  transition: left 0.55s ease;
}
.btn-card-reading:hover::before {
  left: 140%;
}
.btn-card-reading:hover {
  background: var(--red-dark);
  box-shadow: 0 8px 20px rgba(224, 32, 45, 0.35);
  transform: translateY(-2px);
  color: #fff !important;
}
.btn-card-reading svg {
  transition: transform 0.22s ease;
  flex-shrink: 0;
}
.btn-card-reading:hover svg {
  transform: translateX(4px);
}
.qt-note-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 22px;
}
.qt-hub-link {
  font-family: 'Sora', sans-serif;
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--blue);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: color 0.2s;
}
.qt-hub-link:hover {
  color: var(--red);
  text-decoration: underline;
}
`;

if (!html.includes('.btn-card-reading')) {
  html = html.replace('</style>', `${cssToAdd}\n</style>`);
  console.log('Added CSS for .btn-card-reading');
}

// 4. UPDATE SECTION #qtypes HTML (HEADING, QUICK LINKS)
const newSectionHtml = `<section id="qtypes" aria-labelledby="qt-h">
  <div class="wrap">
    <div class="section-head reveal">
      <div class="kicker">Free IELTS practice by question type &bull; IELTS Practice Hub</div>
      <h2 id="qt-h">Free IELTS practice: fix the exact question types that cost you marks</h2>
      <p>Master every question type with authentic exercises from Cambridge 10-21 &amp; Practice Bank. Instant audio player, smart text evidence highlighting, and real exam conditions managed inside the Practice Hub.</p>
    </div>
    <div class="qt-how reveal">
      <div><b>1</b>Choose a skill (Listening, Reading, Writing)</div>
      <div><b>2</b>Pick your target question type</div>
      <div><b>3</b>Practice with instant evidence &amp; feedback</div>
    </div>
    <div class="qt-tabs reveal" id="qtTabs" role="tablist" aria-label="Choose a skill"></div>
    <div class="qt-note" id="qtNote"></div>
    <div class="qt-grid" id="qtGrid"></div>

    <!-- Static crawlable links (SEO optimized for search engines) -->
    <nav class="qlinks reveal" aria-label="All IELTS practice sets by question type">
      <div>
        <h3>IELTS Listening practice by question type</h3>
        <ul>
          <li><a href="/listening-exercises?type=Note-Completion">Note Completion</a></li>
          <li><a href="/listening-exercises?type=Form-Completion">Form Completion</a></li>
          <li><a href="/listening-exercises?type=Table-Completion">Table Completion</a></li>
          <li><a href="/listening-exercises?type=Multiple-Choice">Multiple Choice</a></li>
          <li><a href="/listening-exercises?type=Map-Labelling">Map Labelling</a></li>
          <li><a href="/listening-exercises?type=Flow-chart-Completion">Flow-chart Completion</a></li>
          <li><a href="/listening-exercises?type=Matching">Matching Information</a></li>
          <li><a href="/listening-exercises?type=Sentence-Completion">Sentence Completion</a></li>
          <li><a href="/listening-exercises" style="background:var(--red);color:#fff;border-color:var(--red);">All 70+ Listening Exercises &rarr;</a></li>
        </ul>
      </div>
      <div>
        <h3>IELTS Reading practice by question type</h3>
        <ul>
          <li><a href="/reading-exercises?type=True-False-NotGiven">True / False / Not Given</a></li>
          <li><a href="/reading-exercises?type=Matching-Headings">Matching Headings</a></li>
          <li><a href="/reading-exercises?type=Multiple-Choice">Multiple Choice</a></li>
          <li><a href="/reading-exercises?type=Note-Completion">Note Completion</a></li>
          <li><a href="/reading-exercises?type=Summary-Completion">Summary Completion</a></li>
          <li><a href="/reading-exercises?type=Matching-Information">Matching Information</a></li>
          <li><a href="/reading-exercises?type=Sentence-Completion">Sentence Completion</a></li>
          <li><a href="/reading-exercises?type=Sentence-Endings">Sentence Endings</a></li>
          <li><a href="/reading-exercises?type=List-of-People">List of People</a></li>
          <li><a href="/reading-exercises" style="background:var(--red);color:#fff;border-color:var(--red);">All 100+ Reading Exercises &rarr;</a></li>
        </ul>
      </div>
      <div>
        <h3>IELTS Writing &amp; Practice Hub</h3>
        <ul>
          <li><a href="/cambridge-writing.html">Academic Writing Task 1 (Graphs &amp; Charts)</a></li>
          <li><a href="/cambridge-writing.html">General Writing Task 1 (Letters)</a></li>
          <li><a href="/cambridge-writing.html">Writing Task 2 (Essays)</a></li>
          <li><a href="/practice-hub?skill=writing#hub">All Writing Tasks</a></li>
          <li><a href="/practice-hub" style="background:var(--navy);color:#fff;border-color:var(--navy);">Practice Hub: All Skills &rarr;</a></li>
        </ul>
      </div>
    </nav>

    <div class="hub reveal">
      <div class="hub-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg></div>
      <div>
        <h3>Practice Hub: every free IELTS practice set in one place</h3>
        <p>Don't want to drill one by one? Open the Practice Hub to access all 170+ Listening, Reading and Writing exercises on a single page.</p>
        <div class="hub-stats"><span><b class="num" data-target="19">0</b> question types</span><span><b class="num" data-target="170">0</b> practice exercises</span><span><b>3</b> skills</span></div>
      </div>
      <a href="/practice-hub" class="btn btn-red" title="IELTS Practice Hub">Open Practice Hub &rarr;</a>
    </div>
  </div>
</section>`;

const secStart = html.indexOf('<section id="qtypes"');
const secEnd = html.indexOf('</section>', secStart) + 10;
if (secStart !== -1 && secEnd !== -1) {
  html = html.substring(0, secStart) + newSectionHtml + html.substring(secEnd);
  console.log('Updated #qtypes section HTML');
}

// 5. UPDATE JAVASCRIPT LOGIC (QT, renderQT)
const oldScriptStart = html.indexOf('const SVG={');
const oldScriptEnd = html.indexOf('// band predictor', oldScriptStart);

const newScript = `const SVG={
  Listening:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>',
  Reading:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
  Writing:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>'
};
const QT={
  Listening:{
    hubUrl:'/listening-exercises',
    hubTitle:'Explore All Listening Exercises (70+)',
    metaChip:'70+ Exercises · Audio Sync',
    items:[
      {v:"Note-Completion",l:"Note Completion",d:"Fill in notes as you listen with facts and numbers."},
      {v:"Form-Completion",l:"Form Completion",d:"Capture details like names, dates and order codes."},
      {v:"Table-Completion",l:"Table Completion",d:"Complete categorical tables and schedules from audio."},
      {v:"Multiple-Choice",l:"Multiple Choice",d:"Pick the right option and avoid distractors."},
      {v:"Map-Labelling",l:"Plan, Map & Diagram Labelling",d:"Follow directions and label places on visual maps."},
      {v:"Flow-chart-Completion",l:"Flow-chart Completion",d:"Follow a process step by step from start to finish."},
      {v:"Matching",l:"Matching Information",d:"Match speakers, items or opinions to categories."},
      {v:"Sentence-Completion",l:"Sentence Completion",d:"Complete sentences with exact words heard in audio."}
    ]
  },
  Reading:{
    hubUrl:'/reading-exercises',
    hubTitle:'Explore All Reading Exercises (100+)',
    metaChip:'100+ Exercises · Text Evidence',
    items:[
      {v:"Note-Completion",l:"Note Completion",d:"Complete notes using words directly from the passage."},
      {v:"True-False-NotGiven",l:"True / False / Not Given",d:"Judge each statement against facts in the text."},
      {v:"Matching-Headings",l:"Matching Headings",d:"Match the best heading to each paragraph or section."},
      {v:"Multiple-Choice",l:"Multiple Choice",d:"Choose the best answer with passage evidence."},
      {v:"Summary-Completion",l:"Summary Completion",d:"Fill gaps in a concise summary of the text."},
      {v:"Matching-Information",l:"Matching Information",d:"Find which paragraph contains specific details."},
      {v:"Sentence-Completion",l:"Sentence Completion",d:"Finish sentences accurately within the word limit."},
      {v:"Sentence-Endings",l:"Sentence Endings",d:"Match sentence halves correctly using context."},
      {v:"List-of-People",l:"Matching Features (People)",d:"Match statements or opinions to named researchers."}
    ]
  },
  Writing:{
    hubUrl:'/practice-hub?skill=writing#hub',
    hubTitle:'Open Writing Practice Hub',
    metaChip:'Timed Practice · Word Count',
    items:[
      {v:"Task-1",l:"Task 1 · Academic & General",d:"Graphs, charts, maps, processes & letters in 20 min."},
      {v:"Task-2",l:"Task 2 · Essays",d:"Opinion, discussion and problem-solution essays in 40 min."}
    ]
  }
};

const tabs=document.getElementById('qtTabs'),qg=document.getElementById('qtGrid'),qn=document.getElementById('qtNote');
Object.keys(QT).forEach((k,i)=>{
  const b=document.createElement('button');
  b.className='qt-tab'+(i===0?' active':'');
  b.dataset.k=k;
  b.setAttribute('role','tab');
  b.setAttribute('aria-selected',i===0);
  b.innerHTML=\`\${SVG[k]}\${k} <em>\${QT[k].items.length} types</em>\`;
  b.onclick=()=>{
    tabs.querySelectorAll('.qt-tab').forEach(x=>{x.classList.remove('active');x.setAttribute('aria-selected',false);});
    b.classList.add('active');
    b.setAttribute('aria-selected',true);
    renderQT(k);
  };
  tabs.appendChild(b);
});

function renderQT(k){
  qg.innerHTML='';
  const group=QT[k];
  const n=group.items.length;
  qn.innerHTML=\`<div class="qt-note-bar"><div><b>\${k}:</b> \${n} official question types with authentic exercises, instant evidence & answers.</div><a href="\${group.hubUrl}" class="qt-hub-link">\${group.hubTitle} &rarr;</a></div>\`;
  
  group.items.forEach((it,i)=>{
    const c=document.createElement('div');
    c.className='qt';
    c.style.animationDelay=(i*55)+'ms';
    
    let targetUrl='';
    if(k==='Listening') targetUrl=\`/listening-exercises?type=\${encodeURIComponent(it.v)}\`;
    else if(k==='Reading') targetUrl=\`/reading-exercises?type=\${encodeURIComponent(it.v)}\`;
    else targetUrl=\`/cambridge-writing.html\`;

    c.innerHTML=\`
      <span class="bn">\${String(i+1).padStart(2,'0')}</span>
      <span class="tag">\${k}</span>
      <h3>\${it.l}</h3>
      <p>\${it.d}</p>
      <div class="qt-meta-row">
        <span class="qt-chip">\${group.metaChip}</span>
        <span class="qt-badge-free">Free Practice</span>
      </div>
      <div class="qt-card-action">
        <a href="\${targetUrl}" class="btn-card-reading" aria-label="Practice \${it.l}">
          <span>Practice \${it.l}</span>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </a>
      </div>
    \`;
    qg.appendChild(c);
  });
}
renderQT('Listening');

`;

if (oldScriptStart !== -1 && oldScriptEnd !== -1) {
  html = html.substring(0, oldScriptStart) + newScript + html.substring(oldScriptEnd);
  console.log('Updated QT script logic');
}

fs.writeFileSync(homePath, html, 'utf8');
console.log('FrontPage/Frontend/home.html successfully written!');
