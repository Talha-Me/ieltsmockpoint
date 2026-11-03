const fs = require('fs');
const vm = require('vm');

const filePath = '../views/speaking_engine/speaking-test.html';
let html = fs.readFileSync(filePath, 'utf8');

// Target the exact faulty region:
const badBlock = `      // Vocab
      const vList = document.getElementById('resVocabList');
      vList.innerHTML = (ev.recommended_vocabulary || []).map(v => \`
        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:12px;">
          <strong style="color:var(--navy); font-size:0.92rem; display:block;">\${v.term}</strong>
          <span style="font-size:0.80rem; color:#64748b; display:block; margin-top:2px;">\${v.meaning}</span>
          <p style="font-size:0.78rem; color:#1e293b; margin-top:6px; font-style:italic;">"\${v.example}"</p>
        </div>
      \`).join('');
    }

      // Automatically save to candidate dashboard
      try {
        const uStr = localStorage.getItem('user') || localStorage.getItem('ielts_user');
        const u = uStr ? JSON.parse(uStr) : null;
        fetch('/api/student/record-test', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: u ? u.email : '',
            testType: 'Speaking Practice',
            module: 'speaking',
            testId: 'speaking-test-' + currentTest.id + '-' + selectedMode,
            title: currentTest.title + ' (' + modeTitle + ')',
            speakingScore: Number(ev.overall_band),
            speakingBand: Number(ev.overall_band),
            overallBand: Number(ev.overall_band),
            feedback: {
              overallBand: ev.overall_band,
              fluency_coherence: ev.fluency_coherence,
              lexical_resource: ev.lexical_resource,
              grammar: ev.grammar,
              pronunciation: ev.pronunciation,
              summary: ev.summary_feedback,
              strengths: ev.strengths,
              corrections: ev.corrections,
              recommended_vocabulary: ev.recommended_vocabulary
            },
            answers: candidateAnswers
          })
        }).catch(err => console.warn('Speaking dashboard sync note:', err));
      } catch(syncErr) {
        console.warn('Speaking sync failed:', syncErr);
      }
    }

    function setActivePill(pillId) {`;

const goodBlock = `      // Vocab
      const vList = document.getElementById('resVocabList');
      vList.innerHTML = (ev.recommended_vocabulary || []).map(v => \`
        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:12px;">
          <strong style="color:var(--navy); font-size:0.92rem; display:block;">\${v.term}</strong>
          <span style="font-size:0.80rem; color:#64748b; display:block; margin-top:2px;">\${v.meaning}</span>
          <p style="font-size:0.78rem; color:#1e293b; margin-top:6px; font-style:italic;">"\${v.example}"</p>
        </div>
      \`).join('');

      // Automatically save to candidate dashboard
      try {
        const uStr = localStorage.getItem('user') || localStorage.getItem('ielts_user');
        const u = uStr ? JSON.parse(uStr) : null;
        fetch('/api/student/record-test', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: u ? u.email : '',
            testType: 'Speaking Practice',
            module: 'speaking',
            testId: 'speaking-test-' + currentTest.id + '-' + selectedMode,
            title: currentTest.title + ' (' + modeTitle + ')',
            speakingScore: Number(ev.overall_band),
            speakingBand: Number(ev.overall_band),
            overallBand: Number(ev.overall_band),
            feedback: {
              overallBand: ev.overall_band,
              fluency_coherence: ev.fluency_coherence,
              lexical_resource: ev.lexical_resource,
              grammar: ev.grammar,
              pronunciation: ev.pronunciation,
              summary: ev.summary_feedback,
              strengths: ev.strengths,
              corrections: ev.corrections,
              recommended_vocabulary: ev.recommended_vocabulary
            },
            answers: candidateAnswers
          })
        }).catch(err => console.warn('Speaking dashboard sync note:', err));
      } catch(syncErr) {
        console.warn('Speaking sync failed:', syncErr);
      }
    }

    function setActivePill(pillId) {`;

if (html.includes(badBlock)) {
  html = html.replace(badBlock, goodBlock);
  fs.writeFileSync(filePath, html, 'utf8');
  console.log('Fixed bad block in speaking-test.html');
} else {
  console.warn('badBlock not found directly, trying normalized replace');
}
