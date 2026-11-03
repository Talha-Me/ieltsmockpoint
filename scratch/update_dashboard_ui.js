const fs = require('fs');
const path = require('path');

function updateDashboard(filePath) {
  let content = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');

  // 1. Add Latest Test Review Banner right before <div class="filter-tabs">
  const bannerNeedle = '<div class="filter-tabs">';
  const bannerHtml = `<!-- Latest Completed Test Review Banner -->
          <div id="latestTestReviewBanner" style="display:none; background:linear-gradient(135deg, #0b2b52 0%, #1565c9 100%); color:#fff; border-radius:14px; padding:18px 22px; margin-bottom:22px; box-shadow:0 4px 15px rgba(11,43,82,0.15); align-items:center; justify-content:space-between; flex-wrap:wrap; gap:14px;">
            <div style="display:flex; align-items:center; gap:14px;">
              <div style="width:44px; height:44px; border-radius:12px; background:rgba(255,255,255,0.15); display:flex; align-items:center; justify-content:center; font-size:22px; flex-shrink:0;">📋</div>
              <div>
                <div style="font-size:0.75rem; text-transform:uppercase; letter-spacing:0.5px; opacity:0.85; font-weight:700;">Latest Exam Attempt</div>
                <div id="bannerTestTitle" style="font-size:1.1rem; font-weight:800; font-family:'Sora',sans-serif;">IELTS Mock Test</div>
                <div id="bannerTestScores" style="font-size:0.84rem; opacity:0.92; margin-top:2px;">Listening: -- | Reading: -- | Writing: -- | Overall: --</div>
              </div>
            </div>
            <button id="bannerReviewBtn" type="button" style="background:#ffffff; color:#0b2b52; border:none; padding:10px 22px; border-radius:999px; font-weight:800; font-size:0.88rem; cursor:pointer; display:inline-flex; align-items:center; gap:6px; box-shadow:0 2px 8px rgba(0,0,0,0.15); transition:transform 0.2s;" onmouseover="this.style.transform='scale(1.04)'" onmouseout="this.style.transform='scale(1)'">
              🔍 Review 1–40 Questions &amp; Feedback &rarr;
            </button>
          </div>

          `;

  if (!content.includes('id="latestTestReviewBanner"')) {
    content = content.replace(bannerNeedle, bannerHtml + bannerNeedle);
  }

  // 2. Call renderLatestBanner inside loadDashboardData
  const loadDataNeedle = 'renderChart(globalHistory);';
  const loadDataCall = 'renderChart(globalHistory);\n          renderLatestBanner(globalHistory);';
  if (content.includes(loadDataNeedle) && !content.includes('renderLatestBanner(globalHistory);')) {
    content = content.replace(loadDataNeedle, loadDataCall);
  }

  // 3. Define renderLatestBanner function right before renderActivityTable
  const beforeRenderActivityNeedle = 'function renderActivityTable(items) {';
  const renderLatestBannerFn = `function renderLatestBanner(history) {
      const banner = document.getElementById('latestTestReviewBanner');
      if (!banner) return;
      if (!history || history.length === 0) {
        banner.style.display = 'none';
        return;
      }
      const latest = history[0];
      document.getElementById('bannerTestTitle').textContent = latest.title || 'IELTS Mock Test';
      const oBand = latest.overallBand ? latest.overallBand.toFixed(1) : (latest.listeningBand || latest.readingBand || latest.writingBand ? '--' : '--');
      const lScore = latest.listeningBand ? 'Listening: Band ' + latest.listeningBand.toFixed(1) : (latest.listeningScore ? 'Listening: ' + latest.listeningScore + '/40' : '');
      const rScore = latest.readingBand ? 'Reading: Band ' + latest.readingBand.toFixed(1) : (latest.readingScore ? 'Reading: ' + latest.readingScore + '/40' : '');
      const wScore = latest.writingBand ? 'Writing: Band ' + latest.writingBand.toFixed(1) : '';
      const scoresArr = [lScore, rScore, wScore].filter(Boolean);
      document.getElementById('bannerTestScores').textContent = (scoresArr.length ? scoresArr.join(' | ') + ' | ' : '') + 'Overall: Band ' + oBand;

      const btn = document.getElementById('bannerReviewBtn');
      if (btn) {
        btn.onclick = () => openTestReviewModal(latest.id);
      }
      banner.style.display = 'flex';
    }

    `;

  if (!content.includes('function renderLatestBanner(')) {
    content = content.replace(beforeRenderActivityNeedle, renderLatestBannerFn + beforeRenderActivityNeedle);
  }

  // 4. Update table rows rendering to make Test Name clickable with Review button AND high-contrast Action button
  const oldRowCode = `        rows += \`
          <tr>
            <td>
              <div class="test-cell-name">
                <span>\${escapeHtml(item.title || 'IELTS Mock Test')}</span>
                <span class="badge-test-type \${badgeClass}">\${escapeHtml(tType)}</span>
              </div>
            </td>
            <td>\${dateStr}</td>
            <td><span class="score-badge-circle mod">\${lBand}</span></td>
            <td><span class="score-badge-circle mod">\${rBand}</span></td>
            <td><span class="score-badge-circle mod">\${wBand}</span></td>
            <td><span class="score-badge-circle overall">\${oBand}</span></td>
            <td>
              <button type="button" class="btn-review-item" onclick="openTestReviewModal('\${item.id}')">
                Review &rarr;
              </button>
            </td>
          </tr>
        \`;`;

  const newRowCode = `        rows += \`
          <tr>
            <td>
              <div class="test-cell-name">
                <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                  <a href="javascript:void(0)" onclick="openTestReviewModal('\${item.id}')" style="color:#0b2b52; font-weight:800; font-size:0.95rem; text-decoration:none;" title="Click to view full test review">
                    \${escapeHtml(item.title || 'IELTS Mock Test')}
                  </a>
                  <button type="button" class="btn-review-item" onclick="openTestReviewModal('\${item.id}')" style="padding:2px 8px; font-size:0.75rem; background:#0b2b52; color:#ffffff; border-radius:6px; border:none; cursor:pointer;">
                    Review 🔍
                  </button>
                </div>
                <span class="badge-test-type \${badgeClass}">\${escapeHtml(tType)}</span>
              </div>
            </td>
            <td>\${dateStr}</td>
            <td><span class="score-badge-circle mod">\${lBand}</span></td>
            <td><span class="score-badge-circle mod">\${rBand}</span></td>
            <td><span class="score-badge-circle mod">\${wBand}</span></td>
            <td><span class="score-badge-circle overall">\${oBand}</span></td>
            <td>
              <button type="button" class="btn-review-item" onclick="openTestReviewModal('\${item.id}')" style="background:#0b2b52; color:#ffffff; font-weight:800; border-color:#0b2b52; padding:7px 16px; border-radius:8px; box-shadow:0 2px 6px rgba(11,43,82,0.18);">
                🔍 Review &rarr;
              </button>
            </td>
          </tr>
        \`;`;

  if (content.includes(oldRowCode)) {
    content = content.replace(oldRowCode, newRowCode);
  }

  // 5. Update renderWritingVault to add Review button on writing cards
  const oldVaultEnd = `            <div class="eval-feedback-text">
              <strong style="color:var(--navy); display:block; margin-bottom:4px;">Examiner Assessment:</strong>
              \${escapeHtml(fb.overallFeedback || fb.summary || 'Official standard IELTS Writing evaluation completed under Cambridge assessment rubrics.')}
            </div>
          </div>
        \`;`;

  const newVaultEnd = `            <div class="eval-feedback-text">
              <strong style="color:var(--navy); display:block; margin-bottom:4px;">Examiner Assessment:</strong>
              \${escapeHtml(fb.overallFeedback || fb.summary || 'Official standard IELTS Writing evaluation completed under Cambridge assessment rubrics.')}
            </div>
            <div style="margin-top:14px; display:flex; justify-content:flex-end;">
              <button type="button" class="btn-review-item" onclick="openTestReviewModal('\${item.id}', 'writing')" style="background:#0b2b52; color:#ffffff; font-weight:800; border-color:#0b2b52; padding:8px 16px; border-radius:8px;">
                📝 View Detailed Evaluation &rarr;
              </button>
            </div>
          </div>
        \`;`;

  if (content.includes(oldVaultEnd)) {
    content = content.replace(oldVaultEnd, newVaultEnd);
  }

  // 6. Update openTestReviewModal signature and renderWritingFeedback
  const oldModalStart = 'async function openTestReviewModal(recordId) {';
  const newModalStart = 'async function openTestReviewModal(recordId, initialTab = "listening") {';
  if (content.includes(oldModalStart)) {
    content = content.replace(oldModalStart, newModalStart);
  }

  const oldTabSwitch = "switchReviewTab('listening');";
  const newTabSwitch = "switchReviewTab(initialTab || 'listening');";
  if (content.includes(oldTabSwitch)) {
    content = content.replace(oldTabSwitch, newTabSwitch);
  }

  // 7. Update renderWritingFeedback function
  const oldFeedbackMarker = 'function renderWritingFeedback(rec) {';
  const oldFeedbackEnd = 'container.innerHTML = html;\n    }';
  const fStart = content.indexOf(oldFeedbackMarker);
  const fEnd = content.indexOf(oldFeedbackEnd, fStart);

  if (fStart !== -1 && fEnd !== -1) {
    const fullEnd = fEnd + oldFeedbackEnd.length;
    const newFeedbackFn = `function renderWritingFeedback(rec) {
      const container = document.getElementById('revWritingContent');
      if (!container) return;

      const fb = rec.feedback || {};
      const t1 = fb.task1 || fb.task1Feedback || null;
      const t2 = fb.task2 || fb.task2Feedback || null;

      if (!t1 && !t2 && !rec.writingBand) {
        container.innerHTML = '<div style="text-align:center; padding:32px 14px; color:#64748b;"><p style="font-weight:700;">No Writing evaluation recorded for this session.</p></div>';
        return;
      }

      let html = '';

      const t1Band = (t1 && !t1.not_submitted && (t1.overall_band || t1.band)) ? (t1.overall_band || t1.band) : 0;
      const t2Band = (t2 && !t2.not_submitted && (t2.overall_band || t2.band)) ? (t2.overall_band || t2.band) : 0;

      if (t1Band === 0 || t2Band === 0) {
        html += '<div style="background:#fef2f2; border:1px solid #fecaca; border-radius:10px; padding:12px 16px; margin-bottom:16px; color:#991b1b; font-size:0.86rem; line-height:1.5;">' +
          '<strong>⚠️ Official IELTS Weighting Rule:</strong> ' +
          'Task 2 carries <strong>twice (2/3)</strong> the weight of Task 1 (1/3). ' +
          (t2Band === 0 ? 'Because Task 2 was not submitted (Band 0), your combined Writing Band is calculated as: <code>(Task 1 + 2 &times; 0) / 3</code>.' : 'Because Task 1 was not submitted (Band 0), your combined Writing Band is calculated as: <code>(0 + 2 &times; Task 2) / 3</code>.') +
        '</div>';
      }

      const renderCriteriaChips = (item) => {
        if (!item) return '';
        const tr = item.task_response?.score || item.taskResponseBand || '--';
        const cc = item.coherence_cohesion?.score || item.coherenceBand || '--';
        const lr = item.lexical_resource?.score || item.lexicalBand || '--';
        const gr = item.grammar?.score || item.grammarBand || '--';
        return '<div style="display:flex; gap:8px; flex-wrap:wrap; margin:10px 0;">' +
          '<span style="background:#eaf2fd; color:#0b2b52; font-size:0.75rem; font-weight:700; padding:2px 8px; border-radius:4px;">Task Response: ' + tr + '</span>' +
          '<span style="background:#eaf2fd; color:#0b2b52; font-size:0.75rem; font-weight:700; padding:2px 8px; border-radius:4px;">Coherence: ' + cc + '</span>' +
          '<span style="background:#eaf2fd; color:#0b2b52; font-size:0.75rem; font-weight:700; padding:2px 8px; border-radius:4px;">Lexical: ' + lr + '</span>' +
          '<span style="background:#eaf2fd; color:#0b2b52; font-size:0.75rem; font-weight:700; padding:2px 8px; border-radius:4px;">Grammar: ' + gr + '</span>' +
        '</div>';
      };

      if (t1) {
        html += '<div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:16px; margin-bottom:14px;">' +
          '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">' +
            '<h4 style="margin:0; color:#0b2b52; font-size:1.05rem;">Writing Task 1 Assessment</h4>' +
            '<span style="background:' + (t1Band ? '#e0202d' : '#94a3b8') + '; color:#fff; font-weight:800; font-size:0.85rem; padding:3px 10px; border-radius:999px;">' +
              (t1Band ? 'Band ' + t1Band : 'Not Submitted (Band 0)') +
            '</span>' +
          '</div>' +
          renderCriteriaChips(t1) +
          '<p style="font-size:0.86rem; color:#475569; line-height:1.55; margin:0;">' + escapeHtml(t1.summary_feedback || t1.feedback || 'Evaluated under IELTS Task 1 criteria.') + '</p>' +
        '</div>';
      }

      if (t2) {
        html += '<div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:16px;">' +
          '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">' +
            '<h4 style="margin:0; color:#0b2b52; font-size:1.05rem;">Writing Task 2 Assessment</h4>' +
            '<span style="background:' + (t2Band ? '#e0202d' : '#94a3b8') + '; color:#fff; font-weight:800; font-size:0.85rem; padding:3px 10px; border-radius:999px;">' +
              (t2Band ? 'Band ' + t2Band : 'Not Submitted (Band 0)') +
            '</span>' +
          '</div>' +
          renderCriteriaChips(t2) +
          '<p style="font-size:0.86rem; color:#475569; line-height:1.55; margin:0;">' + escapeHtml(t2.summary_feedback || t2.feedback || 'Evaluated under IELTS Task 2 criteria.') + '</p>' +
        '</div>';
      }

      container.innerHTML = html;
    }`;
    content = content.slice(0, fStart) + newFeedbackFn + content.slice(fullEnd);
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully updated ' + path.basename(filePath));
}

updateDashboard(path.join(__dirname, '../FrontPage/Frontend/dashboard.html'));
updateDashboard(path.join(__dirname, '../public/dashboard.html'));
