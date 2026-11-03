const fs = require('fs');

const filePath = '../views/speaking_engine/speaking-test.html';
let html = fs.readFileSync(filePath, 'utf8');

// 1. REVISE CSS FOR 3D AVATAR & EXAMINER CARDS
const oldAvatarCssMarker = '    /* Examiner Head */';
const newCssBlock = `    /* =========================================================
       EXAMINER SELECTION CARDS UI (REDESIGNED PREMIUM DESIGN)
       ========================================================= */
    .examiner-cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 16px;
      max-width: 660px;
      margin: 0 auto 22px;
    }

    .ex-card {
      background: #ffffff;
      border: 2px solid #e2e8f0;
      border-radius: 16px;
      padding: 18px 20px;
      text-align: left;
      cursor: pointer;
      position: relative;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      display: flex;
      flex-direction: column;
      box-shadow: 0 2px 6px rgba(0,0,0,0.03);
    }

    .ex-card:hover {
      transform: translateY(-3px);
      border-color: #94a3b8;
      box-shadow: 0 8px 20px rgba(0,0,0,0.07);
    }

    .ex-card.active {
      border-color: #1565c9;
      background: linear-gradient(180deg, #f0f7ff 0%, #ffffff 100%);
      box-shadow: 0 8px 24px rgba(21, 101, 201, 0.16);
    }

    .ex-card-badge-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
    }

    .ex-flag {
      font-size: 1.15rem;
    }

    .ex-status-pill {
      font-size: 0.70rem;
      font-weight: 700;
      color: #1565c9;
      background: #eaf2fd;
      padding: 3px 8px;
      border-radius: 6px;
      text-transform: uppercase;
      letter-spacing: 0.4px;
    }

    .ex-card-avatar-wrap {
      width: 54px;
      height: 54px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 12px;
      position: relative;
      font-size: 1.8rem;
    }

    .ex-card-avatar-wrap.female {
      background: linear-gradient(135deg, #fce7f3 0%, #f3e8ff 100%);
      border: 2px solid #fbcfe8;
    }

    .ex-card-avatar-wrap.male {
      background: linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%);
      border: 2px solid #bfdbfe;
    }

    .ex-card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 2px;
    }

    .ex-name {
      font-family: 'Sora', sans-serif;
      font-size: 1.05rem;
      font-weight: 800;
      color: var(--navy);
      margin: 0;
    }

    .ex-select-radio {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 2px solid #cbd5e1;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 0.82rem;
      background: #ffffff;
      transition: all 0.2s ease;
    }

    .ex-card.active .ex-select-radio {
      border-color: #10b981;
      background: #10b981;
    }

    .ex-role {
      font-size: 0.78rem;
      color: var(--muted);
      display: block;
      margin-bottom: 8px;
    }

    .ex-accent-pill {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      background: #f1f5f9;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 0.74rem;
      font-weight: 700;
      color: #334155;
      margin-bottom: 10px;
      width: fit-content;
    }

    .ex-card.active .ex-accent-pill {
      background: #eaf2fd;
      color: #1565c9;
    }

    .ex-tags {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
      margin-bottom: 14px;
    }

    .ex-tag {
      font-size: 0.70rem;
      font-weight: 600;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      padding: 2px 7px;
      border-radius: 5px;
      color: #64748b;
    }

    .btn-voice-preview {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      background: #ffffff;
      border: 1.5px solid #cbd5e1;
      border-radius: 8px;
      padding: 7px 12px;
      font-size: 0.78rem;
      font-weight: 700;
      color: #334155;
      cursor: pointer;
      transition: all 0.2s ease;
      width: 100%;
    }

    .btn-voice-preview:hover {
      background: #f8fafc;
      border-color: #94a3b8;
      color: #0f172a;
    }

    .ex-card.active .btn-voice-preview {
      border-color: #bfdbfe;
      color: #1d4ed8;
      background: #eff6ff;
    }

    /* =========================================================
       3D EXAMINER AVATAR SYSTEM (FEMALE & MALE DUAL SPECIALIZATION)
       ========================================================= */
    .examiner-3d-wrapper {
      position: relative;
      width: 170px;
      height: 185px;
      margin: 6px auto 14px;
      transform-style: preserve-3d;
      transition: all 0.4s ease;
    }

    .examiner-3d-character {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      animation: avatarBreath 4s ease-in-out infinite;
    }

    @keyframes avatarBreath {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-3px); }
    }

    /* Head Base */
    .avatar-head {
      position: relative;
      width: 88px;
      height: 102px;
      background: #f7d5b8;
      border-radius: 44px 44px 38px 38px;
      box-shadow: inset -3px -4px 10px rgba(180, 110, 70, 0.22), 0 8px 20px rgba(0,0,0,0.22);
      z-index: 5;
      display: flex;
      flex-direction: column;
      align-items: center;
      transition: all 0.3s ease;
    }

    /* ------------------------------------
       FEMALE EXAMINER (Dr. Sarah Jenkins)
       ------------------------------------ */
    .examiner-3d-wrapper.female .avatar-head {
      background: #fce1cb;
      border-radius: 44px 44px 36px 36px;
      box-shadow: inset -2px -3px 8px rgba(220, 120, 90, 0.2), 0 8px 22px rgba(219, 39, 119, 0.18);
    }

    .examiner-3d-wrapper.female .avatar-hair-male {
      display: none !important;
    }

    .examiner-3d-wrapper.female .avatar-hair-female {
      display: block !important;
      position: absolute;
      top: -8px;
      width: 102px;
      height: 52px;
      background: linear-gradient(135deg, #3d2314 0%, #5a3219 50%, #2e170a 100%);
      border-radius: 50px 50px 14px 14px;
      z-index: 6;
      box-shadow: inset 0 4px 6px rgba(255, 215, 0, 0.2), 0 3px 6px rgba(0,0,0,0.25);
    }

    /* Flowing Hair Strands over Shoulders */
    .examiner-3d-wrapper.female .female-hair-strand-left {
      display: block !important;
      position: absolute;
      top: 32px;
      left: -9px;
      width: 18px;
      height: 84px;
      background: linear-gradient(180deg, #3d2314 0%, #542d17 55%, #2a1508 100%);
      border-radius: 14px 0 16px 14px;
      box-shadow: -2px 4px 8px rgba(0,0,0,0.25);
      z-index: 12;
      transform: rotate(2deg);
    }
    .examiner-3d-wrapper.female .female-hair-strand-right {
      display: block !important;
      position: absolute;
      top: 32px;
      right: -9px;
      width: 18px;
      height: 84px;
      background: linear-gradient(180deg, #3d2314 0%, #542d17 55%, #2a1508 100%);
      border-radius: 0 14px 14px 16px;
      box-shadow: 2px 4px 8px rgba(0,0,0,0.25);
      z-index: 12;
      transform: rotate(-2deg);
    }

    /* Pearl Stud Earrings */
    .examiner-3d-wrapper.female .avatar-earring {
      display: block !important;
      position: absolute;
      top: 56px;
      width: 7px;
      height: 7px;
      background: radial-gradient(circle at 35% 35%, #ffffff 0%, #e2e8f0 60%, #94a3b8 100%);
      border-radius: 50%;
      box-shadow: 0 1px 4px rgba(0,0,0,0.35);
      z-index: 14;
    }
    .examiner-3d-wrapper.female .avatar-earring.left { left: 1px; }
    .examiner-3d-wrapper.female .avatar-earring.right { right: 1px; }

    /* Soft Natural Pink Blush */
    .examiner-3d-wrapper.female .avatar-blush {
      display: block !important;
      position: absolute;
      top: 60px;
      width: 16px;
      height: 9px;
      background: radial-gradient(circle, rgba(244, 114, 182, 0.65) 0%, rgba(244, 114, 182, 0) 75%);
      border-radius: 50%;
      z-index: 7;
    }
    .examiner-3d-wrapper.female .avatar-blush.left { left: 10px; }
    .examiner-3d-wrapper.female .avatar-blush.right { right: 10px; }

    /* Designer Glasses (Chic Burgundy/Purple Frames) */
    .examiner-3d-wrapper.female .glasses-lens {
      border: 2px solid #a855f7;
      border-radius: 10px 10px 8px 8px;
      background: rgba(253, 244, 255, 0.25);
      box-shadow: 0 2px 5px rgba(168, 85, 247, 0.25);
    }
    .examiner-3d-wrapper.female .glasses-bridge {
      background: #a855f7;
    }

    /* Feminine Rose Lips */
    .examiner-3d-wrapper.female .avatar-mouth {
      background: #db2777;
      border-radius: 5px 5px 12px 12px;
    }

    /* Elegant Plum/Burgundy Tailored Blazer */
    .examiner-3d-wrapper.female .avatar-body {
      background: linear-gradient(135deg, #4c1d6b 0%, #2b113d 100%);
      box-shadow: 0 4px 14px rgba(76, 29, 107, 0.35);
    }
    .examiner-3d-wrapper.female .avatar-shirt {
      width: 36px;
      height: 38px;
      background: #fff5f8;
      clip-path: polygon(15% 0, 85% 0, 50% 100%);
    }
    .examiner-3d-wrapper.female .avatar-tie {
      display: none !important;
    }
    .examiner-3d-wrapper.female .avatar-necklace {
      display: block !important;
      position: absolute;
      top: 16px;
      width: 16px;
      height: 14px;
      border-bottom: 2px solid #f59e0b;
      border-radius: 50%;
      z-index: 9;
    }
    .examiner-3d-wrapper.female .avatar-necklace::after {
      content: '';
      position: absolute;
      bottom: -3px;
      left: 6px;
      width: 4px;
      height: 4px;
      background: #f59e0b;
      border-radius: 50%;
      box-shadow: 0 1px 3px rgba(245, 158, 11, 0.6);
    }

    /* ------------------------------------
       MALE EXAMINER (Dr. Oliver Bennett)
       ------------------------------------ */
    .examiner-3d-wrapper.male .avatar-head {
      background: #f5d3b3;
      border-radius: 45px 45px 38px 38px;
    }

    .examiner-3d-wrapper.male .avatar-hair-female {
      display: none !important;
    }
    .examiner-3d-wrapper.male .female-hair-strand-left,
    .examiner-3d-wrapper.male .female-hair-strand-right {
      display: none !important;
    }
    .examiner-3d-wrapper.male .avatar-earring {
      display: none !important;
    }
    .examiner-3d-wrapper.male .avatar-blush {
      display: none !important;
    }
    .examiner-3d-wrapper.male .avatar-necklace {
      display: none !important;
    }

    .examiner-3d-wrapper.male .avatar-hair-male {
      display: block !important;
      position: absolute;
      top: -7px;
      width: 98px;
      height: 46px;
      background: linear-gradient(135deg, #1f2937 0%, #374151 50%, #111827 100%);
      border-radius: 46px 46px 4px 4px;
      z-index: 6;
      box-shadow: inset 0 3px 6px rgba(255, 255, 255, 0.12), 0 3px 6px rgba(0,0,0,0.25);
    }
    .examiner-3d-wrapper.male .avatar-hair-male::before {
      content: '';
      position: absolute;
      bottom: -15px;
      left: 2px;
      width: 6px;
      height: 16px;
      background: #1f2937;
      border-radius: 0 0 2px 2px;
    }
    .examiner-3d-wrapper.male .avatar-hair-male::after {
      content: '';
      position: absolute;
      bottom: -15px;
      right: 2px;
      width: 6px;
      height: 16px;
      background: #1f2937;
      border-radius: 0 0 2px 2px;
    }

    /* Male Glasses (Sharp Charcoal Navy Frames) */
    .examiner-3d-wrapper.male .glasses-lens {
      border: 2.5px solid #0f172a;
      border-radius: 5px;
      background: rgba(255, 255, 255, 0.2);
    }
    .examiner-3d-wrapper.male .glasses-bridge {
      background: #0f172a;
    }

    .examiner-3d-wrapper.male .avatar-mouth {
      background: #a85555;
      border-radius: 3px 3px 8px 8px;
    }

    /* British Council Navy Suit & Crimson Tie */
    .examiner-3d-wrapper.male .avatar-body {
      background: linear-gradient(135deg, #0b223d 0%, #071526 100%);
      box-shadow: 0 4px 14px rgba(11, 34, 61, 0.35);
    }
    .examiner-3d-wrapper.male .avatar-shirt {
      width: 32px;
      height: 34px;
      background: #ffffff;
      clip-path: polygon(0 0, 100% 0, 50% 100%);
    }
    .examiner-3d-wrapper.male .avatar-tie {
      display: block !important;
      position: absolute;
      top: 8px;
      width: 10px;
      height: 48px;
      background: var(--red);
      clip-path: polygon(25% 0, 75% 0, 100% 80%, 50% 100%, 0 80%);
    }

    /* ------------------------------------
       COMMON FACIAL ATTRIBUTES & LIP SYNC
       ------------------------------------ */
    /* Glasses Base */
    .avatar-glasses {
      position: absolute;
      top: 36px;
      display: flex;
      gap: 10px;
      z-index: 10;
    }
    .glasses-lens {
      width: 26px;
      height: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.15);
    }
    .glasses-bridge {
      position: absolute;
      top: 8px;
      left: 24px;
      width: 14px;
      height: 2.5px;
    }

    /* Eyes */
    .avatar-eyes {
      position: absolute;
      top: 40px;
      display: flex;
      gap: 16px;
      z-index: 8;
    }
    .avatar-eye {
      width: 11px;
      height: 11px;
      background: #1e293b;
      border-radius: 50%;
      position: relative;
      animation: avatarBlink 4.2s infinite;
    }
    .avatar-eye::after {
      content: '';
      position: absolute;
      top: 2px;
      right: 2px;
      width: 3.5px;
      height: 3.5px;
      background: #ffffff;
      border-radius: 50%;
    }

    @keyframes avatarBlink {
      0%, 96%, 100% { transform: scaleY(1); }
      98% { transform: scaleY(0.1); }
    }

    /* Nose */
    .avatar-nose {
      position: absolute;
      top: 60px;
      width: 6px;
      height: 10px;
      border-right: 2px solid #e0aa82;
      border-bottom: 2px solid #e0aa82;
      border-radius: 2px;
      z-index: 7;
    }

    /* Mouth / Lip Sync */
    .avatar-mouth {
      position: absolute;
      bottom: 14px;
      width: 18px;
      height: 6px;
      z-index: 8;
      transition: all 0.15s ease;
    }

    /* When Examiner is speaking: animated mouth phonemes */
    .examiner-3d-wrapper.speaking .avatar-mouth {
      animation: lipSyncTalk 0.24s infinite alternate ease-in-out;
    }

    @keyframes lipSyncTalk {
      0% { height: 5px; width: 16px; border-radius: 4px 4px 8px 8px; }
      50% { height: 12px; width: 14px; border-radius: 8px; }
      100% { height: 8px; width: 20px; border-radius: 6px 6px 12px 12px; }
    }

    /* When Candidate is speaking: Examiner listens & nods encouragingly */
    .examiner-3d-wrapper.listening .examiner-3d-character {
      animation: avatarListenNod 3.5s ease-in-out infinite;
    }

    @keyframes avatarListenNod {
      0%, 100% { transform: rotate(0deg) translateY(0); }
      30% { transform: rotate(1.8deg) translateY(-2px); }
      60% { transform: rotate(-1.5deg) translateY(1px); }
      80% { transform: rotate(0deg) translateY(2px); }
    }

    /* Shoulders & Suit Base */
    .avatar-body {
      position: relative;
      margin-top: -16px;
      width: 140px;
      height: 65px;
      border-radius: 40px 40px 0 0;
      display: flex;
      justify-content: center;
      z-index: 4;
      overflow: hidden;
    }

    /* British Council Examiner Lanyard Badge */
    .avatar-lanyard {
      position: absolute;
      bottom: 2px;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 4px;
      padding: 2px 6px;
      font-size: 7.5px;
      font-weight: 800;
      color: #0b2b52;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      display: flex;
      align-items: center;
      gap: 3px;
      z-index: 10;
    }

    /* Sound Frequency Ring */
    .sound-pulse-ring {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 150px;
      height: 150px;
      border-radius: 50%;
      border: 2px solid rgba(59, 130, 246, 0.4);
      opacity: 0;
      transition: all 0.3s ease;
    }
    .examiner-3d-wrapper.speaking .sound-pulse-ring {
      opacity: 1;
      animation: soundPulse 1.4s ease-out infinite;
    }
    @keyframes soundPulse {
      0% { transform: translate(-50%, -50%) scale(0.95); opacity: 0.8; }
      100% { transform: translate(-50%, -50%) scale(1.35); opacity: 0; }
    }
`;

// Replace from `/* Examiner Head */` to `.examiner-3d-wrapper.speaking .sound-pulse-ring {`
const cssEndMarker = '    /* Examination Stage Room Layout */';
const startIdx = html.indexOf(oldAvatarCssMarker);
const endIdx = html.indexOf(cssEndMarker);

if (startIdx !== -1 && endIdx !== -1) {
  html = html.substring(0, startIdx) + newCssBlock + '\n\n' + html.substring(endIdx);
  console.log('Successfully replaced 3D Avatar and Examiner Cards CSS');
} else {
  console.warn('Could not find CSS boundaries:', startIdx, endIdx);
}

// 2. REVISE INTRO SCREEN EXAMINER SELECTION HTML
const oldIntroCardsStart = '      <!-- Examiner Character Selection (Female / Male) -->';
const oldIntroCardsEnd = '      <!-- Practice Mode Choice -->';
const p1 = html.indexOf(oldIntroCardsStart);
const p2 = html.indexOf(oldIntroCardsEnd, p1 + 10);

const newIntroCardsHtml = `      <!-- Examiner Character Selection (Female / Male) -->
      <div style="margin-bottom:24px;">
        <span style="font-size:0.80rem; font-weight:800; color:var(--muted); display:block; margin-bottom:12px; text-transform:uppercase; letter-spacing:0.6px;">Choose Your Official IELTS Speaking Examiner:</span>
        
        <div class="examiner-cards-grid">
          <!-- Card 1: Dr. Sarah Jenkins (Female) -->
          <div class="ex-card active" id="cardExFemale" onclick="setExaminerGender('female', false)">
            <div class="ex-card-badge-top">
              <span class="ex-flag">🇬🇧 UK</span>
              <span class="ex-status-pill">Certified Examiner</span>
            </div>
            
            <div style="display:flex; align-items:center; gap:14px; margin-bottom:10px;">
              <div class="ex-card-avatar-wrap female">
                👩‍💼
              </div>
              <div style="flex:1;">
                <div class="ex-card-header">
                  <h3 class="ex-name">Dr. Sarah Jenkins</h3>
                  <div class="ex-select-radio checked" id="radioExF">
                    <i class="bi bi-check-lg"></i>
                  </div>
                </div>
                <span class="ex-role">Senior British Council Accredited Examiner</span>
              </div>
            </div>

            <div class="ex-accent-pill">
              <i class="bi bi-soundwave" style="color:#d946ef;"></i> Female British Voice (RP / Oxford)
            </div>

            <div class="ex-tags">
              <span class="ex-tag">⭐ Clear Articulation</span>
              <span class="ex-tag">Warm &amp; Encouraging</span>
            </div>

            <button type="button" class="btn-voice-preview" onclick="event.stopPropagation(); previewVoiceSample('female')">
              <i class="bi bi-volume-up-fill" style="color:#d946ef;"></i> Listen to Dr. Sarah (Sample)
            </button>
          </div>

          <!-- Card 2: Dr. Oliver Bennett (Male) -->
          <div class="ex-card" id="cardExMale" onclick="setExaminerGender('male', false)">
            <div class="ex-card-badge-top">
              <span class="ex-flag">🇬🇧 UK</span>
              <span class="ex-status-pill">Certified Examiner</span>
            </div>
            
            <div style="display:flex; align-items:center; gap:14px; margin-bottom:10px;">
              <div class="ex-card-avatar-wrap male">
                👨‍💼
              </div>
              <div style="flex:1;">
                <div class="ex-card-header">
                  <h3 class="ex-name">Dr. Oliver Bennett</h3>
                  <div class="ex-select-radio" id="radioExM">
                    <i class="bi bi-check-lg" style="display:none;"></i>
                  </div>
                </div>
                <span class="ex-role">Cambridge Assessment Speaking Specialist</span>
              </div>
            </div>

            <div class="ex-accent-pill">
              <i class="bi bi-soundwave" style="color:#2563eb;"></i> Male British Voice (London / Neutral)
            </div>

            <div class="ex-tags">
              <span class="ex-tag">⭐ Precise &amp; Steady</span>
              <span class="ex-tag">Standard IELTS Pacing</span>
            </div>

            <button type="button" class="btn-voice-preview" onclick="event.stopPropagation(); previewVoiceSample('male')">
              <i class="bi bi-volume-up-fill" style="color:#2563eb;"></i> Listen to Dr. Oliver (Sample)
            </button>
          </div>
        </div>
      </div>\n`;

if (p1 !== -1 && p2 !== -1) {
  html = html.substring(0, p1) + newIntroCardsHtml + html.substring(p2);
  console.log('Successfully replaced Intro Screen Examiner Cards HTML');
} else {
  console.warn('Could not find Intro Cards HTML boundaries:', p1, p2);
}

// 3. UPDATE IN-TEST SWITCHER PILLS HTML
const oldInTestToggle = `<div class="st-live-examiner-toggle" title="Switch Examiner Avatar & Voice">
                <button type="button" class="st-switch-btn active" id="switchBtnF" onclick="setExaminerGender('female')">👩 Female</button>
                <button type="button" class="st-switch-btn" id="switchBtnM" onclick="setExaminerGender('male')">👨 Male</button>
              </div>`;

const newInTestToggle = `<div class="st-live-examiner-toggle" title="Switch Examiner Avatar & Voice">
                <button type="button" class="st-switch-btn active" id="switchBtnF" onclick="setExaminerGender('female')"><i class="bi bi-person-fill"></i> Dr. Sarah (Female)</button>
                <button type="button" class="st-switch-btn" id="switchBtnM" onclick="setExaminerGender('male')"><i class="bi bi-person-fill"></i> Dr. Oliver (Male)</button>
              </div>`;

if (html.includes(oldInTestToggle)) {
  html = html.replace(oldInTestToggle, newInTestToggle);
}

// 4. UPDATE setExaminerGender JS AND ADD previewVoiceSample
const oldSetExMarker = '    function setExaminerGender(gender, autoReplay = true) {';
const newJsBlock = `    // Audio Voice Preview for Examiner Selection Screen
    function previewVoiceSample(gender) {
      setExaminerGender(gender, false);
      const greeting = (gender === 'female')
        ? "Good afternoon. My name is Dr. Sarah Jenkins. I will be conducting your IELTS speaking test today. Please speak clearly into your microphone."
        : "Good afternoon. My name is Dr. Oliver Bennett. I will be your IELTS speaking examiner today. Remember to answer each question as fully as you can.";
      speakBrowserTTS(greeting);
    }

    function setExaminerGender(gender, autoReplay = true) {
      selectedGender = gender;

      // Update Welcome screen cards
      const cardF = document.getElementById('cardExFemale');
      const cardM = document.getElementById('cardExMale');
      if (cardF && cardM) {
        cardF.classList.toggle('active', gender === 'female');
        cardM.classList.toggle('active', gender === 'male');
        const radF = document.getElementById('radioExF');
        const radM = document.getElementById('radioExM');
        if (radF) {
          radF.classList.toggle('checked', gender === 'female');
          const icon = radF.querySelector('i');
          if (icon) icon.style.display = (gender === 'female') ? 'block' : 'none';
        }
        if (radM) {
          radM.classList.toggle('checked', gender === 'male');
          const icon = radM.querySelector('i');
          if (icon) icon.style.display = (gender === 'male') ? 'block' : 'none';
        }
      }

      // Update in-test switcher pills
      const swF = document.getElementById('switchBtnF');
      const swM = document.getElementById('switchBtnM');
      if (swF && swM) {
        swF.classList.toggle('active', gender === 'female');
        swM.classList.toggle('active', gender === 'male');
      }

      // Update 3D avatar wrapper class
      const wrapper = document.getElementById('examiner3D');
      if (wrapper) {
        wrapper.classList.remove('male', 'female');
        wrapper.classList.add(gender);
      }

      // Update Name Badge
      const badge = document.getElementById('examinerNameBadge');
      if (badge) {
        badge.textContent = (gender === 'female') 
          ? 'Dr. Sarah Jenkins • Senior British Council Examiner' 
          : 'Dr. Oliver Bennett • Senior British Council Examiner';
      }

      // Replay audio with newly selected voice if currently on an exam screen
      if (autoReplay && currentAudioKey && document.getElementById('examScreen').style.display === 'flex') {
        repeatCurrentAudio();
      }
    }`;

// Find setExaminerGender function end
const fnStart = html.indexOf(oldSetExMarker);
const fnEnd = html.indexOf('let currentStage = \'part1\';', fnStart);

if (fnStart !== -1 && fnEnd !== -1) {
  html = html.substring(0, fnStart) + newJsBlock + '\n\n    ' + html.substring(fnEnd);
  console.log('Successfully updated setExaminerGender and added previewVoiceSample');
} else {
  console.warn('Could not locate setExaminerGender boundaries:', fnStart, fnEnd);
}

fs.writeFileSync(filePath, html, 'utf8');
console.log('Updated speaking-test.html with stunning Examiner UI and 3D female character!');
