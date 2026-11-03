const fs = require('fs');

function updateDashboardFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Add CSS before </style>
  const reviewCss = `
    /* Test Review Modal & Action Button */
    .btn-review-item {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 6px 14px;
      border-radius: 8px;
      font-size: 0.80rem;
      font-weight: 700;
      color: #0b2b52;
      background: #eaf2fd;
      border: 1px solid #bfdbfe;
      cursor: pointer;
      transition: all 0.2s;
      white-space: nowrap;
    }
    .btn-review-item:hover {
      background: #0b2b52;
      color: #ffffff;
      border-color: #0b2b52;
      transform: translateY(-1px);
    }
    .dash-modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(11, 43, 82, 0.72);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      z-index: 200000;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }
    .dash-modal-overlay.open {
      display: flex;
    }
    .dash-modal-card {
      position: relative;
      background: #ffffff;
      border-radius: 20px;
      width: 100%;
      max-width: 880px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 24px 60px rgba(11, 43, 82, 0.28);
      border: 1.5px solid #dbeafe;
      padding: 28px 24px;
      animation: dashPop 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    @keyframes dashPop {
      from { opacity: 0; transform: scale(0.95) translateY(12px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }
    .review-tab-btn {
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 0.84rem;
      font-weight: 700;
      border: 1px solid #e2e8f0;
      background: #f8fafc;
      color: #475569;
      cursor: pointer;
      transition: all 0.2s;
    }
    .review-tab-btn.active {
      background: #0b2b52;
      color: #ffffff;
      border-color: #0b2b52;
    }
    .q-rev-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 10px 14px;
      border-radius: 10px;
      margin-bottom: 8px;
      font-size: 0.86rem;
    }
    .q-rev-item.correct {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
    }
    .q-rev-item.incorrect {
      background: #fef2f2;
      border: 1px solid #fecaca;
    }
    .q-rev-item.unanswered {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
    }
  `;

  if (!content.includes('.btn-review-item')) {
    content = content.replace('</style>', reviewCss + '\n</style>');
  }

  // 2. Add 'Action' Column header in table
  const oldThead = `                <tr>
                  <th>Test &amp; Category</th>
                  <th>Date Taken</th>
                  <th>Listening</th>
                  <th>Reading</th>
                  <th>Writing</th>
                  <th>Band Score</th>
                </tr>`;

  const newThead = `                <tr>
                  <th>Test &amp; Category</th>
                  <th>Date Taken</th>
                  <th>Listening</th>
                  <th>Reading</th>
                  <th>Writing</th>
                  <th>Band Score</th>
                  <th>Review</th>
                </tr>`;

  if (content.includes(oldThead)) {
    content = content.replace(oldThead, newThead);
  }

  // 3. Update empty state colspan="6" to colspan="7" and render row to include review button
  content = content.replace('<td colspan="6">', '<td colspan="7">');

  const oldRowEnd = `            <td><span class="score-badge-circle mod">\${wBand}</span></td>
            <td><span class="score-badge-circle overall">\${oBand}</span></td>
          </tr>`;

  const newRowEnd = `            <td><span class="score-badge-circle mod">\${wBand}</span></td>
            <td><span class="score-badge-circle overall">\${oBand}</span></td>
            <td>
              <button type="button" class="btn-review-item" onclick="openTestReviewModal('\${item.id}')">
                Review &rarr;
              </button>
            </td>
          </tr>`;

  if (content.includes(oldRowEnd)) {
    content = content.replace(oldRowEnd, newRowEnd);
  }

  // 4. Modal HTML and Review Logic before </body>
  const reviewModalHtml = `
  <!-- Test Review Modal -->
  <div id="testReviewModal" class="dash-modal-overlay" onclick="if(event.target===this)closeTestReviewModal();">
    <div class="dash-modal-card">
      <button type="button" onclick="closeTestReviewModal()" style="position:absolute; right:18px; top:18px; width:32px; height:32px; border-radius:50%; border:1px solid #e2e8f0; background:#f8fafc; font-size:20px; line-height:1; cursor:pointer; color:#0b2b52;" aria-label="Close">&times;</button>
      
      <div style="margin-bottom:18px; padding-right:36px;">
        <span id="revBadgeType" style="display:inline-block; font-size:0.75rem; font-weight:700; padding:3px 10px; border-radius:999px; background:#eaf2fd; color:#1565c9; border:1px solid #bfdbfe; margin-bottom:8px;">Full Mock Review</span>
        <h3 id="revTitle" style="font-family:'Sora',sans-serif; color:#0b2b52; font-size:1.35rem; font-weight:800; margin-bottom:4px;">Academic Mock Test 1</h3>
        <p id="revDate" style="color:#64748b; font-size:0.84rem;">Completed on 03 Nov 2026</p>
      </div>

      <!-- KPI Summary Strip -->
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:10px; margin-bottom:20px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:14px; padding:12px;">
        <div style="text-align:center;">
          <span style="font-size:0.72rem; color:#64748b; font-weight:700; text-transform:uppercase;">Overall Band</span>
          <div id="revOverallBand" style="font-family:'Sora',sans-serif; font-size:1.4rem; font-weight:800; color:#e0202d;">--</div>
        </div>
        <div style="text-align:center;">
          <span style="font-size:0.72rem; color:#64748b; font-weight:700; text-transform:uppercase;">Listening</span>
          <div id="revListeningBand" style="font-size:1.15rem; font-weight:700; color:#0b2b52;">--</div>
        </div>
        <div style="text-align:center;">
          <span style="font-size:0.72rem; color:#64748b; font-weight:700; text-transform:uppercase;">Reading</span>
          <div id="revReadingBand" style="font-size:1.15rem; font-weight:700; color:#0b2b52;">--</div>
        </div>
        <div style="text-align:center;">
          <span style="font-size:0.72rem; color:#64748b; font-weight:700; text-transform:uppercase;">Writing</span>
          <div id="revWritingBand" style="font-size:1.15rem; font-weight:700; color:#0b2b52;">--</div>
        </div>
      </div>

      <!-- Module Navigation Tabs -->
      <div style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:16px; border-bottom:1.5px solid #e2e8f0; padding-bottom:10px;">
        <button type="button" class="review-tab-btn active" id="tabBtnListening" onclick="switchReviewTab('listening')">🎧 Listening (1–40)</button>
        <button type="button" class="review-tab-btn" id="tabBtnReading" onclick="switchReviewTab('reading')">📖 Reading (1–40)</button>
        <button type="button" class="review-tab-btn" id="tabBtnWriting" onclick="switchReviewTab('writing')">✍️ Writing AI Evaluation</button>
      </div>

      <!-- Tab Content: Listening -->
      <div id="tabContentListening" style="display:block;">
        <div id="revListeningList" style="max-height:420px; overflow-y:auto; padding-right:6px;">
          <!-- Questions will be injected here -->
        </div>
      </div>

      <!-- Tab Content: Reading -->
      <div id="tabContentReading" style="display:none;">
        <div id="revReadingList" style="max-height:420px; overflow-y:auto; padding-right:6px;">
          <!-- Questions will be injected here -->
        </div>
      </div>

      <!-- Tab Content: Writing -->
      <div id="tabContentWriting" style="display:none;">
        <div id="revWritingContent" style="max-height:420px; overflow-y:auto; padding-right:6px;">
          <!-- Writing tasks and criteria feedback will be injected here -->
        </div>
      </div>
    </div>
  </div>

  <script>
    let activeReviewRecord = null;

    async function openTestReviewModal(recordId) {
      const modal = document.getElementById('testReviewModal');
      if (!modal) return;

      // 1. Find from globalHistory or fetch by ID
      let rec = globalHistory.find(h => String(h.id) === String(recordId));
      if (!rec || !rec.mistakes || Object.keys(rec.mistakes).length === 0) {
        try {
          const res = await fetch('/api/student/test-record/' + recordId);
          const data = await res.json();
          if (data && data.success && data.record) {
            rec = data.record;
          }
        } catch (e) {
          console.warn('Could not fetch single record:', e);
        }
      }

      activeReviewRecord = rec || {};

      // Populate Header
      document.getElementById('revTitle').textContent = rec.title || 'IELTS Mock Test';
      document.getElementById('revDate').textContent = 'Completed on ' + (rec.completedAt ? new Date(rec.completedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit' }) : 'Recently');
      document.getElementById('revBadgeType').textContent = rec.testType || 'Full Mock Review';

      // Populate KPI Strip
      document.getElementById('revOverallBand').textContent = rec.overallBand ? Number(rec.overallBand).toFixed(1) : (rec.readingBand && rec.listeningBand ? ((rec.readingBand + rec.listeningBand)/2).toFixed(1) : '--');
      document.getElementById('revListeningBand').textContent = rec.listeningBand ? 'Band ' + Number(rec.listeningBand).toFixed(1) : (rec.listeningScore ? rec.listeningScore + ' / 40' : '--');
      document.getElementById('revReadingBand').textContent = rec.readingBand ? 'Band ' + Number(rec.readingBand).toFixed(1) : (rec.readingScore ? rec.readingScore + ' / 40' : '--');
      document.getElementById('revWritingBand').textContent = rec.writingBand ? 'Band ' + Number(rec.writingBand).toFixed(1) : '--';

      // Render Modules
      renderModuleQuestions('listening', rec);
      renderModuleQuestions('reading', rec);
      renderWritingFeedback(rec);

      switchReviewTab('listening');
      modal.classList.add('open');
    }

    function closeTestReviewModal() {
      const modal = document.getElementById('testReviewModal');
      if (modal) modal.classList.remove('open');
    }

    function switchReviewTab(tabName) {
      ['Listening', 'Reading', 'Writing'].forEach(t => {
        const btn = document.getElementById('tabBtn' + t);
        const content = document.getElementById('tabContent' + t);
        const isActive = t.toLowerCase() === tabName.toLowerCase();
        if (btn) btn.classList.toggle('active', isActive);
        if (content) content.style.display = isActive ? 'block' : 'none';
      });
    }

    function renderModuleQuestions(mod, rec) {
      const container = document.getElementById(mod === 'listening' ? 'revListeningList' : 'revReadingList');
      if (!container) return;

      const mistakesData = rec.mistakes || {};
      const answersData = rec.answers || {};

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
        container.innerHTML = '<div style=\"text-align:center; padding:32px 14px; color:#64748b;\"><p style=\"font-weight:700;\">Detailed 1–40 breakdown saved for this module.</p><p style=\"font-size:0.84rem;\">Official score: ' + (mod === 'listening' ? (rec.listeningScore || 0) : (rec.readingScore || 0)) + ' / 40</p></div>';
        return;
      }

      let html = '';
      list.forEach((item, idx) => {
        const qNum = item.qNum || (idx + 1);
        const isCorrect = item.isCorrect === true;
        const yourAns = Array.isArray(item.yourAns) ? item.yourAns.join(', ') : (item.yourAns || '(Not Answered)');
        const officialAns = Array.isArray(item.officialAns) ? item.officialAns.join(' / ') : (item.officialAns || '--');
        const isUnanswered = !item.yourAns || item.yourAns === '' || item.yourAns === '(Not Answered)';

        const statusClass = isCorrect ? 'correct' : (isUnanswered ? 'unanswered' : 'incorrect');
        const statusBadge = isCorrect
          ? '<span style=\"color:#16a34a; font-weight:700;\">✅ Correct</span>'
          : (isUnanswered ? '<span style=\"color:#64748b; font-weight:600;\">⚠️ Unanswered</span>' : '<span style=\"color:#dc2626; font-weight:700;\">❌ Incorrect</span>');

        html += '<div class=\"q-rev-item ' + statusClass + '\">' +
          '<div style=\"display:flex; align-items:center; gap:10px;\">' +
            '<span style=\"font-weight:800; color:#0b2b52; min-width:32px;\">Q' + qNum + '</span>' +
            '<div>' +
              '<div><strong>Your Answer:</strong> <span style=\"color:' + (isCorrect ? '#16a34a' : (isUnanswered ? '#64748b' : '#dc2626')) + ';\">' + escapeHtml(yourAns) + '</span></div>' +
              (!isCorrect ? '<div style=\"font-size:0.80rem; color:#475569;\"><strong>Correct Answer:</strong> <span style=\"color:#16a34a; font-weight:700;\">' + escapeHtml(officialAns) + '</span></div>' : '') +
            '</div>' +
          '</div>' +
          '<div>' + statusBadge + '</div>' +
        '</div>';
      });

      container.innerHTML = html;
    }

    function renderWritingFeedback(rec) {
      const container = document.getElementById('revWritingContent');
      if (!container) return;

      const fb = rec.feedback || {};
      const t1 = fb.task1 || null;
      const t2 = fb.task2 || null;

      if (!t1 && !t2 && !rec.writingBand) {
        container.innerHTML = '<div style=\"text-align:center; padding:32px 14px; color:#64748b;\"><p style=\"font-weight:700;\">No Writing evaluation recorded for this session.</p></div>';
        return;
      }

      let html = '';

      if (t1) {
        html += '<div style=\"background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:16px; margin-bottom:14px;\">' +
          '<div style=\"display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;\">' +
            '<h4 style=\"margin:0; color:#0b2b52; font-size:1.05rem;\">Writing Task 1 Assessment</h4>' +
            '<span style=\"background:#e0202d; color:#fff; font-weight:800; font-size:0.85rem; padding:3px 10px; border-radius:999px;\">Band ' + (t1.band || '--') + '</span>' +
          '</div>' +
          '<p style=\"font-size:0.85rem; color:#475569; line-height:1.55; margin-bottom:8px;\">' + escapeHtml(t1.summary_feedback || t1.feedback || '') + '</p>' +
        '</div>';
      }

      if (t2) {
        html += '<div style=\"background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:16px;\">' +
          '<div style=\"display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;\">' +
            '<h4 style=\"margin:0; color:#0b2b52; font-size:1.05rem;\">Writing Task 2 Assessment</h4>' +
            '<span style=\"background:#e0202d; color:#fff; font-weight:800; font-size:0.85rem; padding:3px 10px; border-radius:999px;\">Band ' + (t2.band || '--') + '</span>' +
          '</div>' +
          '<p style=\"font-size:0.85rem; color:#475569; line-height:1.55; margin-bottom:8px;\">' + escapeHtml(t2.summary_feedback || t2.feedback || '') + '</p>' +
        '</div>';
      }

      container.innerHTML = html;
    }
  </script>
  `;

  if (!content.includes('id="testReviewModal"')) {
    content = content.replace('</body>', reviewModalHtml + '\n</body>');
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully updated:', filePath);
}

updateDashboardFile('D:/personal websites/ieltsmockpoint/FrontPage/Frontend/dashboard.html');
updateDashboardFile('D:/personal websites/ieltsmockpoint/public/dashboard.html');
