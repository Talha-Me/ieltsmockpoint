const fs = require('fs');
let html = fs.readFileSync('../views/speaking_engine/speaking-test.html', 'utf8');

if (!html.includes('/api/student/record-test')) {
  const insertMarker = '    function setActivePill(pillId) {';
  const syncCode = `      // Automatically save to candidate dashboard
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
  html = html.replace(insertMarker, syncCode);
  fs.writeFileSync('../views/speaking_engine/speaking-test.html', html, 'utf8');
  console.log('Successfully added dashboard sync to speaking-test.html');
} else {
  console.log('Already added dashboard sync');
}
