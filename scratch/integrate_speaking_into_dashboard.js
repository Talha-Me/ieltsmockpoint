const fs = require('fs');

function updateDashboard(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Add speaking filter button
  if (!content.includes("filterActivity('speaking', this)")) {
    content = content.replace(
      '<button type="button" class="filter-tab" onclick="filterActivity(\'writing\', this)">AI Writing</button>',
      '<button type="button" class="filter-tab" onclick="filterActivity(\'writing\', this)">AI Writing</button>\n            <button type="button" class="filter-tab" onclick="filterActivity(\'speaking\', this)">AI Speaking</button>'
    );
  }

  // 2. Add badge style for speaking
  if (!content.includes('.badge-test-type.speaking')) {
    content = content.replace(
      '.badge-test-type.writing { background: #f3e8ff; color: #7e22ce; }',
      '.badge-test-type.writing { background: #f3e8ff; color: #7e22ce; }\n    .badge-test-type.speaking { background: #fdf2f8; color: #db2777; border: 1px solid #fbcfe8; }'
    );
  }

  // 3. Update table headers to include Speaking
  if (!content.includes('<th>Speaking</th>')) {
    content = content.replace(
      '<th>Listening</th>\n                  <th>Reading</th>\n                  <th>Writing</th>\n                  <th>Band Score</th>',
      '<th>Listening</th>\n                  <th>Reading</th>\n                  <th>Writing</th>\n                  <th>Speaking</th>\n                  <th>Band Score</th>'
    );
  }

  // 4. Update filterActivity logic
  if (!content.includes("category === 'speaking'")) {
    content = content.replace(
      "filtered = globalHistory.filter(h => String(h.testType || '').toLowerCase().includes('writing') || h.writingBand > 0);",
      "filtered = globalHistory.filter(h => String(h.testType || '').toLowerCase().includes('writing') || h.writingBand > 0);\n      } else if (category === 'speaking') {\n        filtered = globalHistory.filter(h => String(h.testType || '').toLowerCase().includes('speaking') || (h.speakingBand && h.speakingBand > 0) || h.module === 'speaking');"
    );
  }

  // 5. Update handleTableSearch logic
  if (!content.includes("activeFilter === 'speaking'")) {
    content = content.replace(
      "if (activeFilter === 'writing') return t.includes('writing') || h.writingBand > 0;",
      "if (activeFilter === 'writing') return t.includes('writing') || h.writingBand > 0;\n          if (activeFilter === 'speaking') return t.includes('speaking') || (h.speakingBand && h.speakingBand > 0) || h.module === 'speaking';"
    );
  }

  // 6. Update table row generation to include Speaking Band column
  if (!content.includes('const sBand = item.speakingBand')) {
    content = content.replace(
      'const wBand = item.writingBand ? item.writingBand.toFixed(1) : \'--\';',
      'const wBand = item.writingBand ? item.writingBand.toFixed(1) : \'--\';\n        const sBand = (item.speakingBand && item.speakingBand > 0) ? item.speakingBand.toFixed(1) : \'--\';'
    );
    content = content.replace(
      '<td><span class="score-badge-circle mod">${wBand}</span></td>\n            <td><span class="score-badge-circle overall">${oBand}</span></td>',
      '<td><span class="score-badge-circle mod">${wBand}</span></td>\n            <td><span class="score-badge-circle mod">${sBand}</span></td>\n            <td><span class="score-badge-circle overall">${oBand}</span></td>'
    );
    content = content.replace(
      'else if (tl.includes(\'writing\')) badgeClass = \'writing\';',
      'else if (tl.includes(\'writing\')) badgeClass = \'writing\';\n        else if (tl.includes(\'speaking\')) badgeClass = \'speaking\';'
    );
  }

  // 7. Add Speaking to Modal Header KPI Strip
  if (!content.includes('id="revSpeakingBand"')) {
    const writingKpi = `<div style="text-align:center;">
          <span style="font-size:0.72rem; color:#64748b; font-weight:700; text-transform:uppercase;">Writing</span>
          <div id="revWritingBand" style="font-size:1.15rem; font-weight:700; color:#0b2b52;">--</div>
        </div>`;
    const speakingKpi = `<div style="text-align:center;">
          <span style="font-size:0.72rem; color:#64748b; font-weight:700; text-transform:uppercase;">Speaking</span>
          <div id="revSpeakingBand" style="font-size:1.15rem; font-weight:700; color:#0b2b52;">--</div>
        </div>`;
    content = content.replace(writingKpi, writingKpi + '\n        ' + speakingKpi);
  }

  // 8. Add Speaking Tab in Modal Navigation
  if (!content.includes('id="tabBtnSpeaking"')) {
    content = content.replace(
      '<button type="button" class="review-tab-btn" id="tabBtnWriting" onclick="switchReviewTab(\'writing\')">✍️ Writing AI Evaluation</button>',
      '<button type="button" class="review-tab-btn" id="tabBtnWriting" onclick="switchReviewTab(\'writing\')">✍️ Writing AI Evaluation</button>\n        <button type="button" class="review-tab-btn" id="tabBtnSpeaking" onclick="switchReviewTab(\'speaking\')">🎙️ Speaking AI Evaluation</button>'
    );
  }

  // 9. Add Tab Content: Speaking
  if (!content.includes('id="tabContentSpeaking"')) {
    const writingTabClose = `      <!-- Tab Content: Writing -->
      <div id="tabContentWriting" style="display:none;">
        <div id="revWritingContent" style="max-height:420px; overflow-y:auto; padding-right:6px;">
          <!-- Writing tasks and criteria feedback will be injected here -->
        </div>
      </div>`;

    const speakingTabContent = `      <!-- Tab Content: Speaking -->
      <div id="tabContentSpeaking" style="display:none;">
        <div id="revSpeakingContent" style="max-height:420px; overflow-y:auto; padding-right:6px;">
          <!-- Speaking criteria, examiner feedback, and corrections will be injected here -->
        </div>
      </div>`;

    content = content.replace(writingTabClose, writingTabClose + '\n\n' + speakingTabContent);
  }

  // 10. Update switchReviewTab and openTestReviewModal
  if (!content.includes("renderSpeakingFeedback(rec);")) {
    content = content.replace(
      "renderWritingFeedback(rec);",
      "renderWritingFeedback(rec);\n      renderSpeakingFeedback(rec);"
    );
    content = content.replace(
      "document.getElementById('revWritingBand').textContent = rec.writingBand ? 'Band ' + Number(rec.writingBand).toFixed(1) : '--';",
      "document.getElementById('revWritingBand').textContent = rec.writingBand ? 'Band ' + Number(rec.writingBand).toFixed(1) : '--';\n      document.getElementById('revSpeakingBand').textContent = (rec.speakingBand && rec.speakingBand > 0) ? 'Band ' + Number(rec.speakingBand).toFixed(1) : '--';"
    );
    content = content.replace(
      "['Listening', 'Reading', 'Writing'].forEach(t => {",
      "['Listening', 'Reading', 'Writing', 'Speaking'].forEach(t => {"
    );
  }

  // Auto-switch initial modal tab based on module
  if (!content.includes("auto-select initial tab")) {
    content = content.replace(
      "switchReviewTab(initialTab || 'listening');",
      `// auto-select initial tab
      if (initialTab) {
        switchReviewTab(initialTab);
      } else if (rec.module === 'speaking' || String(rec.testType || '').toLowerCase().includes('speaking') || (rec.speakingBand > 0 && !rec.listeningBand && !rec.readingBand)) {
        switchReviewTab('speaking');
      } else if (rec.module === 'writing' || String(rec.testType || '').toLowerCase().includes('writing') || (rec.writingBand > 0 && !rec.listeningBand && !rec.readingBand)) {
        switchReviewTab('writing');
      } else if (rec.module === 'reading' || (rec.readingBand > 0 && !rec.listeningBand)) {
        switchReviewTab('reading');
      } else {
        switchReviewTab('listening');
      }`
    );
  }

  // 11. Add renderSpeakingFeedback function
  if (!content.includes("function renderSpeakingFeedback(rec)")) {
    const speakingFn = `
    function renderSpeakingFeedback(rec) {
      const container = document.getElementById('revSpeakingContent');
      if (!container) return;

      const fb = rec.feedback || {};
      const fc = fb.fluency_coherence || {};
      const lr = fb.lexical_resource || {};
      const gra = fb.grammar || fb.grammatical_range || {};
      const pr = fb.pronunciation || {};
      const sBand = rec.speakingBand || fb.overallBand || fb.overall_band;

      if (!sBand && !fb.summary_feedback && !fb.summary) {
        container.innerHTML = \`
          <div style="text-align:center; padding:32px 14px; color:#64748b;">
            <p style="font-weight:700;">No AI Speaking evaluation recorded for this session.</p>
            <p style="font-size:0.84rem;">Take a Speaking practice test to see detailed fluency, vocabulary, grammar & pronunciation feedback here.</p>
          </div>
        \`;
        return;
      }

      let html = \`
        <div style="background:#fff; border:1px solid #e2e8f0; border-radius:12px; padding:18px; margin-bottom:14px; box-shadow:0 1px 3px rgba(0,0,0,0.03);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:8px;">
            <div>
              <span style="font-size:0.75rem; font-weight:800; color:#db2777; text-transform:uppercase; letter-spacing:0.5px;">AI Examiner Evaluation</span>
              <h4 style="margin:2px 0 0; color:#0b2b52; font-size:1.05rem; font-weight:800;">IELTS Speaking Performance</h4>
            </div>
            <span class="score-badge-circle overall" style="background:#db2777;">Band \${Number(sBand).toFixed(1)}</span>
          </div>
          \${fb.summary_feedback || fb.summary ? \`<p style="font-size:0.90rem; color:#334155; line-height:1.6; margin-bottom:14px; background:#f8fafc; padding:12px; border-radius:8px; border-left:4px solid #db2777;">\${escapeHtml(fb.summary_feedback || fb.summary)}</p>\` : ''}

          <!-- 4 IELTS Speaking Criteria Grid -->
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:12px; margin-bottom:16px;">
            <div style="background:#fdf2f8; border:1px solid #fbcfe8; border-radius:10px; padding:12px;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                <strong style="font-size:0.82rem; color:#9d174d;">Fluency &amp; Coherence</strong>
                <span style="font-weight:800; font-size:0.85rem; color:#9d174d;">Band \${fc.score ? Number(fc.score).toFixed(1) : '--'}</span>
              </div>
              <p style="font-size:0.78rem; color:#475569; margin:0; line-height:1.4;">\${escapeHtml(fc.comment || 'Good tempo, natural pauses and cohesive flow.')}</p>
            </div>

            <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:10px; padding:12px;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                <strong style="font-size:0.82rem; color:#166534;">Lexical Resource</strong>
                <span style="font-weight:800; font-size:0.85rem; color:#166534;">Band \${lr.score ? Number(lr.score).toFixed(1) : '--'}</span>
              </div>
              <p style="font-size:0.78rem; color:#475569; margin:0; line-height:1.4;">\${escapeHtml(lr.comment || 'Rich vocabulary and accurate topic-specific phrases.')}</p>
            </div>

            <div style="background:#eff6ff; border:1px solid #bfdbfe; border-radius:10px; padding:12px;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                <strong style="font-size:0.82rem; color:#1e40af;">Grammatical Range</strong>
                <span style="font-weight:800; font-size:0.85rem; color:#1e40af;">Band \${gra.score ? Number(gra.score).toFixed(1) : '--'}</span>
              </div>
              <p style="font-size:0.78rem; color:#475569; margin:0; line-height:1.4;">\${escapeHtml(gra.comment || 'Variety of complex structures used accurately.')}</p>
            </div>

            <div style="background:#fefce8; border:1px solid #fef08a; border-radius:10px; padding:12px;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                <strong style="font-size:0.82rem; color:#854d0e;">Pronunciation</strong>
                <span style="font-weight:800; font-size:0.85rem; color:#854d0e;">Band \${pr.score ? Number(pr.score).toFixed(1) : '--'}</span>
              </div>
              <p style="font-size:0.78rem; color:#475569; margin:0; line-height:1.4;">\${escapeHtml(pr.comment || 'Intelligible, good rhythm and clear stress patterns.')}</p>
            </div>
          </div>
        </div>
      \`;

      // Corrections
      if (Array.isArray(fb.corrections) && fb.corrections.length > 0) {
        html += \`
          <div style="background:#fff; border:1px solid #e2e8f0; border-radius:12px; padding:16px; margin-bottom:14px;">
            <h5 style="margin:0 0 10px; color:#0b2b52; font-size:0.92rem; font-weight:800;">Grammar &amp; Fluency Corrections</h5>
            <div style="display:flex; flex-direction:column; gap:8px;">
              \${fb.corrections.map(c => \`
                <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:10px;">
                  <div style="text-decoration:line-through; color:#dc2626; font-size:0.82rem; margin-bottom:2px;">\${escapeHtml(c.original || '')}</div>
                  <div style="font-weight:700; color:#16a34a; font-size:0.84rem; margin-bottom:4px;">\${escapeHtml(c.improved || '')}</div>
                  <div style="font-size:0.76rem; color:#64748b;"><strong>Note:</strong> \${escapeHtml(c.reason || '')}</div>
                </div>
              \`).join('')}
            </div>
          </div>
        \`;
      }

      container.innerHTML = html;
    }
`;
    content = content.replace("function renderWritingFeedback(rec) {", speakingFn + "\n    function renderWritingFeedback(rec) {");
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully updated', filePath);
}

updateDashboard('../FrontPage/Frontend/dashboard.html');
updateDashboard('../public/dashboard.html');
