const fs = require('fs');
const path = require('path');

function upgradeDashboard(filePath) {
  let content = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');

  // 1. Add Print Styles and Filter Pill CSS
  const cssNeedle = '/* Test Review Modal & Action Button */';
  const newStyles = `/* Advanced Test Review Modal & Filter Controls */
    .q-filter-pill {
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 0.76rem;
      font-weight: 700;
      border: 1px solid #cbd5e1;
      background: #ffffff;
      color: #475569;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .q-filter-pill:hover {
      background: #f1f5f9;
      border-color: #94a3b8;
    }
    .q-filter-pill.active {
      background: #0b2b52;
      color: #ffffff;
      border-color: #0b2b52;
    }
    .score-badge-circle.band-c1 {
      background: #059669;
      color: #ffffff;
    }
    .score-badge-circle.band-b2 {
      background: #1565c9;
      color: #ffffff;
    }
    .score-badge-circle.band-b1 {
      background: #d97706;
      color: #ffffff;
    }
    .score-badge-circle.band-low {
      background: #dc2626;
      color: #ffffff;
    }
    @media print {
      body * { visibility: hidden; }
      #testReviewModal, #testReviewModal * { visibility: visible; }
      #testReviewModal { position: absolute; left: 0; top: 0; width: 100%; display: block !important; background: transparent; }
      .dash-modal-card { max-width: 100%; max-height: none; box-shadow: none; border: none; padding: 0; }
      .review-tab-btn, .q-filter-pill, .btn-review-item, button { display: none !important; }
      #tabContentListening, #tabContentReading, #tabContentWriting { display: block !important; max-height: none !important; }
    }
    `;

  if (!content.includes('.q-filter-pill {')) {
    content = content.replace(cssNeedle, newStyles + cssNeedle);
  }

  // 2. Add Search Box next to Category Filter Tabs
  const filterTabsNeedle = '<div class="filter-tabs">';
  const searchAndFilters = `<div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:14px;">
            <div class="filter-tabs" style="margin-bottom:0;">
              <button type="button" class="filter-tab active" onclick="filterActivity('all', this)">All Tests &amp; Practice</button>
              <button type="button" class="filter-tab" onclick="filterActivity('full', this)">Full Mocks</button>
              <button type="button" class="filter-tab" onclick="filterActivity('cambridge', this)">Cambridge Practice</button>
              <button type="button" class="filter-tab" onclick="filterActivity('hub', this)">Question Types</button>
              <button type="button" class="filter-tab" onclick="filterActivity('writing', this)">AI Writing</button>
            </div>
            <div style="position:relative; min-width:240px; flex-grow:1; max-width:320px;">
              <input type="text" id="tableSearchBox" placeholder="🔍 Search test title or book..." oninput="handleTableSearch(this.value)" style="width:100%; padding:9px 14px 9px 34px; border-radius:999px; border:1.5px solid #cbd5e1; font-size:0.84rem; outline:none; background:#ffffff; transition:border 0.2s;" onfocus="this.style.borderColor='#1565c9'" onblur="this.style.borderColor='#cbd5e1'">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2.2" style="position:absolute; left:12px; top:50%; transform:translateY(-50%); pointer-events:none;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>
          </div>`;

  if (content.includes(filterTabsNeedle) && !content.includes('id="tableSearchBox"')) {
    // Replace the old filter-tabs block
    const oldFilterStart = content.indexOf('<div class="filter-tabs">');
    const oldFilterEnd = content.indexOf('</div>', oldFilterStart) + 6;
    content = content.slice(0, oldFilterStart) + searchAndFilters + content.slice(oldFilterEnd);
  }

  // 3. Update Modal Header to include Print Button
  const modalCloseBtnNeedle = '<button type="button" onclick="closeTestReviewModal()"';
  const modalHeaderBtns = `<div style="position:absolute; right:18px; top:18px; display:flex; align-items:center; gap:8px;">
        <button type="button" onclick="window.print()" style="padding:6px 12px; border-radius:8px; border:1px solid #cbd5e1; background:#f8fafc; font-size:0.78rem; font-weight:700; color:#0b2b52; cursor:pointer; display:inline-flex; align-items:center; gap:5px;" title="Print or save this score sheet as PDF">🖨️ Print Report</button>
        <button type="button" onclick="closeTestReviewModal()" style="width:32px; height:32px; border-radius:50%; border:1px solid #e2e8f0; background:#f8fafc; font-size:20px; line-height:1; cursor:pointer; color:#0b2b52;" aria-label="Close">&times;</button>
      </div>`;

  if (!content.includes('onclick="window.print()"')) {
    const btnEnd = content.indexOf('</button>', content.indexOf(modalCloseBtnNeedle)) + 9;
    const btnStart = content.indexOf(modalCloseBtnNeedle);
    content = content.slice(0, btnStart) + modalHeaderBtns + content.slice(btnEnd);
  }

  // 4. Update tabContentListening and tabContentReading with Filter Bars
  const oldListeningTabContent = `<div id="tabContentListening" style="display:block;">
        <div id="revListeningList" style="max-height:420px; overflow-y:auto; padding-right:6px;">
          <!-- Questions will be injected here -->
        </div>
      </div>`;

  const newListeningTabContent = `<div id="tabContentListening" style="display:block;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:10px 14px; margin-bottom:12px;">
          <div id="listeningSummaryBadges" style="display:flex; gap:8px; flex-wrap:wrap; font-size:0.80rem; font-weight:700;"></div>
          <div style="display:flex; gap:6px;">
            <button type="button" class="q-filter-pill active" onclick="filterModalQuestions('listening', 'all', this)">All (40)</button>
            <button type="button" class="q-filter-pill" onclick="filterModalQuestions('listening', 'mistakes', this)">Mistakes ❌</button>
            <button type="button" class="q-filter-pill" onclick="filterModalQuestions('listening', 'correct', this)">Correct ✅</button>
            <button type="button" class="q-filter-pill" onclick="filterModalQuestions('listening', 'unanswered', this)">Skipped ⚠️</button>
          </div>
        </div>
        <div id="revListeningList" style="max-height:420px; overflow-y:auto; padding-right:6px;"></div>
      </div>`;

  if (content.includes(oldListeningTabContent)) {
    content = content.replace(oldListeningTabContent, newListeningTabContent);
  }

  const oldReadingTabContent = `<div id="tabContentReading" style="display:none;">
        <div id="revReadingList" style="max-height:420px; overflow-y:auto; padding-right:6px;">
          <!-- Questions will be injected here -->
        </div>
      </div>`;

  const newReadingTabContent = `<div id="tabContentReading" style="display:none;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:10px 14px; margin-bottom:12px;">
          <div id="readingSummaryBadges" style="display:flex; gap:8px; flex-wrap:wrap; font-size:0.80rem; font-weight:700;"></div>
          <div style="display:flex; gap:6px;">
            <button type="button" class="q-filter-pill active" onclick="filterModalQuestions('reading', 'all', this)">All (40)</button>
            <button type="button" class="q-filter-pill" onclick="filterModalQuestions('reading', 'mistakes', this)">Mistakes ❌</button>
            <button type="button" class="q-filter-pill" onclick="filterModalQuestions('reading', 'correct', this)">Correct ✅</button>
            <button type="button" class="q-filter-pill" onclick="filterModalQuestions('reading', 'unanswered', this)">Skipped ⚠️</button>
          </div>
        </div>
        <div id="revReadingList" style="max-height:420px; overflow-y:auto; padding-right:6px;"></div>
      </div>`;

  if (content.includes(oldReadingTabContent)) {
    content = content.replace(oldReadingTabContent, newReadingTabContent);
  }

  // 5. Enhance JS logic: renderModuleQuestions, filterModalQuestions, handleTableSearch, color-coded bands
  const scriptMarker = '<script>\n    let activeReviewRecord = null;';
  const newScriptStart = `<script>
    let activeReviewRecord = null;
    let activeQuestionFilters = { listening: 'all', reading: 'all' };
    let currentTableSearchTerm = '';

    function handleTableSearch(term) {
      currentTableSearchTerm = (term || '').toLowerCase().trim();
      let filtered = globalHistory;
      if (activeFilter !== 'all') {
        filtered = globalHistory.filter(h => {
          const t = String(h.testType || '').toLowerCase();
          if (activeFilter === 'full') return t.includes('full') || t.includes('academic') || t.includes('premium') || t.includes('general');
          if (activeFilter === 'cambridge') return t.includes('cambridge');
          if (activeFilter === 'hub') return t.includes('hub') || t.includes('question') || t.includes('type');
          if (activeFilter === 'writing') return t.includes('writing') || h.writingBand > 0;
          return true;
        });
      }
      if (currentTableSearchTerm) {
        filtered = filtered.filter(h => {
          const title = String(h.title || '').toLowerCase();
          const tType = String(h.testType || '').toLowerCase();
          return title.includes(currentTableSearchTerm) || tType.includes(currentTableSearchTerm);
        });
      }
      renderActivityTable(filtered);
    }

    function filterModalQuestions(mod, filterType, btn) {
      activeQuestionFilters[mod] = filterType;
      const parent = btn.closest('.dash-modal-card');
      if (parent) {
        parent.querySelectorAll(\`#tabContent\${mod.charAt(0).toUpperCase() + mod.slice(1)} .q-filter-pill\`).forEach(b => b.classList.remove('active'));
      }
      btn.classList.add('active');
      renderModuleQuestions(mod, activeReviewRecord);
    }
`;

  if (!content.includes('let activeQuestionFilters =')) {
    content = content.replace(scriptMarker, newScriptStart);
  }

  // 6. Update renderModuleQuestions to support dynamic filters and statistics summary bar
  const oldRenderModStart = 'function renderModuleQuestions(mod, rec) {';
  const oldRenderModEnd = 'container.innerHTML = html;\n    }';

  const mStart = content.indexOf(oldRenderModStart);
  const mEnd = content.indexOf(oldRenderModEnd, mStart);

  if (mStart !== -1 && mEnd !== -1) {
    const fullEnd = mEnd + oldRenderModEnd.length;
    const newRenderModFn = `function renderModuleQuestions(mod, rec) {
      const container = document.getElementById(mod === 'listening' ? 'revListeningList' : 'revReadingList');
      const badgesContainer = document.getElementById(mod === 'listening' ? 'listeningSummaryBadges' : 'readingSummaryBadges');
      if (!container) return;

      const mistakesData = rec.mistakes || {};
      let list = [];
      if (Array.isArray(mistakesData[mod])) {
        list = mistakesData[mod];
      } else if (Array.isArray(mistakesData)) {
        list = mistakesData;
      } else if (typeof mistakesData[mod] === 'object' && mistakesData[mod] !== null) {
        list = Object.keys(mistakesData[mod]).map(k => ({
          qNum: k,
          yourAns: mistakesData[mod][k].userAnswer || mistakesData[mod][k]['Your answer'] || '',
          officialAns: mistakesData[mod][k].correctAnswer || mistakesData[mod][k]['Correct answer'] || '',
          isCorrect: false
        }));
      }

      if (list.length === 0) {
        if (badgesContainer) badgesContainer.innerHTML = '<span style="color:#64748b;">No answer data recorded</span>';
        container.innerHTML = '<div style="text-align:center; padding:32px 14px; color:#64748b;"><p style="font-weight:700;">Detailed 1–40 breakdown saved for this module.</p><p style="font-size:0.84rem;">Official score: ' + (mod === 'listening' ? (rec.listeningScore || 0) : (rec.readingScore || 0)) + ' / 40</p></div>';
        return;
      }

      const totalQ = list.length;
      let countCorrect = 0, countWrong = 0, countUnanswered = 0;

      list.forEach(item => {
        const hasAns = item.yourAns && String(item.yourAns).trim() !== '' && String(item.yourAns).trim() !== '(Not Answered)';
        if (item.isCorrect === true) {
          countCorrect++;
        } else if (!hasAns) {
          countUnanswered++;
        } else {
          countWrong++;
        }
      });

      if (badgesContainer) {
        badgesContainer.innerHTML = \`
          <span style="color:#0b2b52;">Total: \${totalQ}</span>
          <span style="color:#16a34a;">✅ Correct: \${countCorrect}</span>
          <span style="color:#dc2626;">❌ Wrong: \${countWrong}</span>
          \${countUnanswered > 0 ? \`<span style="color:#d97706;">⚠️ Skipped: \${countUnanswered}</span>\` : ''}
          <span style="color:#1565c9;">Band: \${mod === 'listening' ? (rec.listeningBand ? rec.listeningBand.toFixed(1) : '--') : (rec.readingBand ? rec.readingBand.toFixed(1) : '--')}</span>
        \`;
      }

      const activeF = activeQuestionFilters[mod] || 'all';
      let html = '';
      let visibleCount = 0;

      list.forEach((item, idx) => {
        const qNum = item.qNum || (idx + 1);
        const isCorrect = item.isCorrect === true;
        const hasAns = item.yourAns && String(item.yourAns).trim() !== '' && String(item.yourAns).trim() !== '(Not Answered)';
        const isUnanswered = !hasAns;

        if (activeF === 'correct' && !isCorrect) return;
        if (activeF === 'mistakes' && isCorrect) return;
        if (activeF === 'unanswered' && hasAns) return;

        visibleCount++;
        const yourAns = Array.isArray(item.yourAns) ? item.yourAns.join(', ') : (item.yourAns || '(Not Answered)');
        const officialAns = Array.isArray(item.officialAns) ? item.officialAns.join(' / ') : (item.officialAns || '--');

        const statusClass = isCorrect ? 'correct' : (isUnanswered ? 'unanswered' : 'incorrect');
        const statusBadge = isCorrect
          ? '<span style="color:#16a34a; font-weight:700;">✅ Correct</span>'
          : (isUnanswered ? '<span style="color:#64748b; font-weight:600;">⚠️ Unanswered</span>' : '<span style="color:#dc2626; font-weight:700;">❌ Incorrect</span>');

        html += '<div class="q-rev-item ' + statusClass + '">' +
          '<div style="display:flex; align-items:center; gap:10px;">' +
            '<span style="font-weight:800; color:#0b2b52; min-width:32px;">Q' + qNum + '</span>' +
            '<div>' +
              '<div><strong>Your Answer:</strong> <span style="color:' + (isCorrect ? '#16a34a' : (isUnanswered ? '#64748b' : '#dc2626')) + ';">' + escapeHtml(yourAns) + '</span></div>' +
              (!isCorrect ? '<div style="font-size:0.80rem; color:#475569;"><strong>Correct Answer:</strong> <span style="color:#16a34a; font-weight:700;">' + escapeHtml(officialAns) + '</span></div>' : '') +
            '</div>' +
          '</div>' +
          '<div>' + statusBadge + '</div>' +
        '</div>';
      });

      if (visibleCount === 0) {
        html = '<div style="text-align:center; padding:28px; color:#64748b;">No questions match this filter (' + activeF + ').</div>';
      }

      container.innerHTML = html;
    }`;

    content = content.slice(0, mStart) + newRenderModFn + content.slice(fullEnd);
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully upgraded ' + path.basename(filePath));
}

upgradeDashboard(path.join(__dirname, '../FrontPage/Frontend/dashboard.html'));
upgradeDashboard(path.join(__dirname, '../public/dashboard.html'));
