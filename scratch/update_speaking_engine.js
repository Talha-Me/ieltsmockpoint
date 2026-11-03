const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'views', 'speaking_engine', 'speaking-test.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Replace 3D avatar CSS with enhanced Male & Female styles and switcher styles
const oldAvatarCssMarker = '/* 3D Examiner Avatar Component */';
const newAvatarCss = `/* 3D Examiner Avatar Component */
    .examiner-3d-wrapper {
      position: relative;
      width: 170px;
      height: 180px;
      margin: 6px auto 14px;
      transform-style: preserve-3d;
      transition: transform 0.4s ease;
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

    /* Examiner Head */
    .avatar-head {
      position: relative;
      width: 90px;
      height: 104px;
      background: #f7d5b8;
      border-radius: 45px 45px 40px 40px;
      box-shadow: inset -3px -4px 10px rgba(180, 110, 70, 0.25), 0 8px 20px rgba(0,0,0,0.25);
      z-index: 5;
      display: flex;
      flex-direction: column;
      align-items: center;
      transition: transform 0.3s ease;
    }

    /* --- MALE HAIR --- */
    .examiner-3d-wrapper.male .avatar-hair-male {
      position: absolute;
      top: -6px;
      width: 98px;
      height: 48px;
      background: #3e2723;
      border-radius: 48px 48px 0 0;
      z-index: 6;
      box-shadow: inset 0 3px 6px rgba(255, 255, 255, 0.15);
    }
    .examiner-3d-wrapper.male .avatar-hair-male::after {
      content: '';
      position: absolute;
      bottom: -10px;
      left: -2px;
      right: -2px;
      height: 16px;
      background: #3e2723;
      border-radius: 0 0 10px 10px;
    }
    .examiner-3d-wrapper.female .avatar-hair-male { display: none !important; }

    /* --- FEMALE HAIR --- */
    .examiner-3d-wrapper.female .avatar-hair-female {
      position: absolute;
      top: -8px;
      width: 104px;
      height: 56px;
      background: linear-gradient(180deg, #42261a 0%, #2a150c 100%);
      border-radius: 52px 52px 18px 18px;
      z-index: 6;
      box-shadow: inset 0 3px 6px rgba(255, 255, 255, 0.2);
    }
    .examiner-3d-wrapper.female .avatar-hair-female::before {
      content: '';
      position: absolute;
      bottom: -50px;
      left: -12px;
      right: -12px;
      height: 75px;
      background: linear-gradient(180deg, #381f14 0%, #241108 100%);
      border-radius: 0 0 28px 28px;
      z-index: -2;
      box-shadow: 0 6px 14px rgba(0,0,0,0.3);
    }
    .examiner-3d-wrapper.female .female-hair-strand-left {
      position: absolute;
      top: 14px;
      left: -9px;
      width: 16px;
      height: 72px;
      background: linear-gradient(180deg, #42261a 0%, #2a150c 100%);
      border-radius: 10px 0 16px 16px;
      z-index: 9;
      box-shadow: 2px 4px 8px rgba(0,0,0,0.25);
    }
    .examiner-3d-wrapper.female .female-hair-strand-right {
      position: absolute;
      top: 14px;
      right: -9px;
      width: 16px;
      height: 72px;
      background: linear-gradient(180deg, #42261a 0%, #2a150c 100%);
      border-radius: 0 10px 16px 16px;
      z-index: 9;
      box-shadow: -2px 4px 8px rgba(0,0,0,0.25);
    }
    .examiner-3d-wrapper.male .avatar-hair-female,
    .examiner-3d-wrapper.male .female-hair-strand-left,
    .examiner-3d-wrapper.male .female-hair-strand-right {
      display: none !important;
    }

    /* Female Earrings & Blush */
    .examiner-3d-wrapper.female .avatar-earring {
      position: absolute;
      top: 68px;
      width: 7px;
      height: 7px;
      background: radial-gradient(circle, #ffffff 40%, #cbd5e1 100%);
      border-radius: 50%;
      z-index: 10;
      box-shadow: 0 2px 4px rgba(0,0,0,0.35);
    }
    .examiner-3d-wrapper.female .avatar-earring.left { left: 4px; }
    .examiner-3d-wrapper.female .avatar-earring.right { right: 4px; }

    .examiner-3d-wrapper.female .avatar-blush {
      position: absolute;
      top: 58px;
      width: 15px;
      height: 8px;
      background: rgba(244, 114, 182, 0.3);
      border-radius: 50%;
      filter: blur(1px);
      z-index: 7;
    }
    .examiner-3d-wrapper.female .avatar-blush.left { left: 7px; }
    .examiner-3d-wrapper.female .avatar-blush.right { right: 7px; }

    .examiner-3d-wrapper.male .avatar-earring,
    .examiner-3d-wrapper.male .avatar-blush {
      display: none !important;
    }

    /* Glasses */
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
      border: 2.5px solid #1e293b;
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.2);
      box-shadow: 0 2px 4px rgba(0,0,0,0.15);
    }
    .examiner-3d-wrapper.female .glasses-lens {
      border-color: #831843;
      border-radius: 8px 8px 12px 12px;
    }
    .glasses-bridge {
      position: absolute;
      top: 8px;
      left: 24px;
      width: 14px;
      height: 2.5px;
      background: #1e293b;
    }
    .examiner-3d-wrapper.female .glasses-bridge {
      background: #831843;
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
      background: #be5959;
      border-radius: 4px 4px 10px 10px;
      z-index: 8;
      transition: all 0.15s ease;
    }
    .examiner-3d-wrapper.female .avatar-mouth {
      background: #be3455;
    }

    .examiner-3d-wrapper.speaking .avatar-mouth {
      animation: lipSyncTalk 0.24s infinite alternate ease-in-out;
    }

    @keyframes lipSyncTalk {
      0% { height: 5px; width: 16px; border-radius: 4px 4px 8px 8px; background: #be5959; }
      50% { height: 12px; width: 14px; border-radius: 8px; background: #6b1d1d; }
      100% { height: 8px; width: 20px; border-radius: 6px 6px 12px 12px; background: #943d3d; }
    }

    .examiner-3d-wrapper.listening .examiner-3d-character {
      animation: avatarListenNod 3.5s ease-in-out infinite;
    }

    @keyframes avatarListenNod {
      0%, 100% { transform: rotate(0deg) translateY(0); }
      30% { transform: rotate(1.8deg) translateY(-2px); }
      60% { transform: rotate(-1.5deg) translateY(1px); }
      80% { transform: rotate(0deg) translateY(2px); }
    }

    /* Shoulders & Suit */
    .avatar-body {
      position: relative;
      margin-top: -16px;
      width: 140px;
      height: 65px;
      background: #0f1f38;
      border-radius: 40px 40px 0 0;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      display: flex;
      justify-content: center;
      z-index: 4;
      overflow: hidden;
    }
    .examiner-3d-wrapper.female .avatar-body {
      background: linear-gradient(180deg, #13243f 0%, #091526 100%);
    }

    .avatar-shirt {
      width: 32px;
      height: 34px;
      background: #ffffff;
      clip-path: polygon(0 0, 100% 0, 50% 100%);
    }
    .examiner-3d-wrapper.female .avatar-shirt {
      width: 36px;
      height: 28px;
      background: #fdfaf6;
      clip-path: polygon(15% 0, 85% 0, 50% 100%);
    }

    .avatar-tie {
      position: absolute;
      top: 8px;
      width: 10px;
      height: 48px;
      background: var(--red);
      clip-path: polygon(25% 0, 75% 0, 100% 80%, 50% 100%, 0 80%);
    }
    .examiner-3d-wrapper.female .avatar-tie { display: none !important; }

    .avatar-necklace {
      display: none;
      position: absolute;
      top: 14px;
      width: 8px;
      height: 8px;
      background: radial-gradient(circle, #f8fafc 40%, #94a3b8 100%);
      border-radius: 50%;
      box-shadow: 0 1px 3px rgba(0,0,0,0.3);
    }
    .examiner-3d-wrapper.female .avatar-necklace { display: block !important; }

    /* Lanyard */
    .avatar-lanyard {
      position: absolute;
      bottom: 2px;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 4px;
      padding: 2px 6px;
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.65rem;
      font-weight: 800;
      color: #0b2b52;
      box-shadow: 0 2px 4px rgba(0,0,0,0.15);
    }

    /* Examiner Character Selector Cards */
    .st-examiner-choice-btn {
      background: #ffffff;
      border: 2px solid var(--line);
      border-radius: 14px;
      padding: 12px 18px;
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      min-width: 240px;
      transition: all 0.2s ease;
    }
    .st-examiner-choice-btn:hover {
      border-color: var(--blue);
      transform: translateY(-2px);
    }
    .st-examiner-choice-btn.active {
      border-color: var(--blue);
      background: #eff6ff;
      box-shadow: 0 6px 18px rgba(21, 101, 201, 0.12);
    }

    /* In-Test Switcher Pills */
    .st-live-examiner-toggle {
      display: inline-flex;
      background: rgba(255, 255, 255, 0.15);
      border-radius: 20px;
      padding: 2px;
      border: 1px solid rgba(255, 255, 255, 0.25);
    }
    .st-switch-btn {
      font-family: 'Sora', sans-serif;
      font-size: 0.72rem;
      font-weight: 700;
      padding: 3px 10px;
      border-radius: 16px;
      border: none;
      background: transparent;
      color: #e2e8f0;
      cursor: pointer;
      transition: all 0.2s;
    }
    .st-switch-btn.active {
      background: #ffffff;
      color: var(--navy);
      box-shadow: 0 2px 6px rgba(0,0,0,0.2);
    }
`;

const avatarCssRegex = /\/\* 3D Examiner Avatar Component \*\/[\s\S]*?\.avatar-lanyard span\{[^}]*\}/;
content = content.replace(avatarCssRegex, newAvatarCss);

// 2. Replace the Welcome Screen to include Examiner Selection
const oldWelcomeChoice = `<div style="margin-bottom:16px;">
        <span style="font-size:0.80rem; font-weight:700; color:var(--muted); display:block; margin-bottom:8px; text-transform:uppercase; letter-spacing:0.5px;">Choose Practice Mode:</span>
        <div class="st-mode-selector-wrap">
          <button type="button" class="st-mode-btn active" id="modeBtnAll" onclick="setPracticeMode('all')">Full Test (Parts 1, 2 &amp; 3)</button>
          <button type="button" class="st-mode-btn" id="modeBtnP1" onclick="setPracticeMode('1')">Part 1 Only (Interview)</button>
          <button type="button" class="st-mode-btn" id="modeBtnP2" onclick="setPracticeMode('2')">Part 2 Only (Cue Card)</button>
          <button type="button" class="st-mode-btn" id="modeBtnP3" onclick="setPracticeMode('3')">Part 3 Only (Discussion)</button>
        </div>
      </div>`;

const newWelcomeChoice = `<!-- Examiner Character Selection (Female / Male) -->
      <div style="margin-bottom:20px;">
        <span style="font-size:0.80rem; font-weight:700; color:var(--muted); display:block; margin-bottom:8px; text-transform:uppercase; letter-spacing:0.5px;">Choose Examiner Avatar &amp; Voice:</span>
        <div style="display:flex; justify-content:center; gap:12px; flex-wrap:wrap;">
          <button type="button" class="st-examiner-choice-btn active" id="btnExFemale" onclick="setExaminerGender('female', false)">
            <span style="font-size:1.6rem;">👩</span>
            <div style="text-align:left;">
              <strong style="display:block; font-size:0.88rem; color:var(--navy);">Dr. Sarah Jenkins</strong>
              <span style="display:block; font-size:0.75rem; color:var(--muted);">Female British Neural Voice</span>
            </div>
            <i class="bi bi-check-circle-fill" style="color:var(--green); font-size:1.15rem; margin-left:auto;"></i>
          </button>

          <button type="button" class="st-examiner-choice-btn" id="btnExMale" onclick="setExaminerGender('male', false)">
            <span style="font-size:1.6rem;">👨</span>
            <div style="text-align:left;">
              <strong style="display:block; font-size:0.88rem; color:var(--navy);">Dr. Oliver Bennett</strong>
              <span style="display:block; font-size:0.75rem; color:var(--muted);">Male British Neural Voice</span>
            </div>
            <i class="bi bi-check-circle-fill" style="color:var(--green); font-size:1.15rem; margin-left:auto; display:none;"></i>
          </button>
        </div>
      </div>

      <!-- Practice Mode Choice -->
      <div style="margin-bottom:16px;">
        <span style="font-size:0.80rem; font-weight:700; color:var(--muted); display:block; margin-bottom:8px; text-transform:uppercase; letter-spacing:0.5px;">Choose Practice Mode:</span>
        <div class="st-mode-selector-wrap">
          <button type="button" class="st-mode-btn active" id="modeBtnAll" onclick="setPracticeMode('all')">Full Test (Parts 1, 2 &amp; 3)</button>
          <button type="button" class="st-mode-btn" id="modeBtnP1" onclick="setPracticeMode('1')">Part 1 Only (Interview)</button>
          <button type="button" class="st-mode-btn" id="modeBtnP2" onclick="setPracticeMode('2')">Part 2 Only (Cue Card)</button>
          <button type="button" class="st-mode-btn" id="modeBtnP3" onclick="setPracticeMode('3')">Part 3 Only (Discussion)</button>
        </div>
      </div>`;

content = content.replace(oldWelcomeChoice, newWelcomeChoice);

// 3. Replace the 3D Examiner HTML & Dialogue Header
const oldStageAvatarRegex = /<!-- 3D Avatar -->[\s\S]*?<!-- Spoken Subtitle Box -->[\s\S]*?<div class="st-examiner-label">[\s\S]*?<\/div>/;

const newStageAvatarHtml = `<!-- 3D Avatar -->
        <div class="examiner-3d-wrapper female" id="examiner3D">
          <div class="sound-pulse-ring"></div>
          <div class="examiner-3d-character">
            <!-- Head -->
            <div class="avatar-head">
              <!-- Male Hair -->
              <div class="avatar-hair-male"></div>

              <!-- Female Hair -->
              <div class="avatar-hair-female">
                <div class="female-hair-strand-left"></div>
                <div class="female-hair-strand-right"></div>
              </div>

              <!-- Female Earrings -->
              <div class="avatar-earring left"></div>
              <div class="avatar-earring right"></div>

              <!-- Female Blush -->
              <div class="avatar-blush left"></div>
              <div class="avatar-blush right"></div>

              <!-- Glasses -->
              <div class="avatar-glasses">
                <div class="glasses-lens"></div>
                <div class="glasses-bridge"></div>
                <div class="glasses-lens"></div>
              </div>
              <div class="avatar-eyes">
                <div class="avatar-eye"></div>
                <div class="avatar-eye"></div>
              </div>
              <div class="avatar-nose"></div>
              <div class="avatar-mouth" id="avatarMouth"></div>
            </div>
            <!-- Body -->
            <div class="avatar-body">
              <div class="avatar-shirt"></div>
              <div class="avatar-tie"></div>
              <div class="avatar-necklace"></div>
              <div class="avatar-lanyard">
                <i class="bi bi-patch-check-fill" style="color:#1565c9;"></i>
                <span>BC-EXAMINER</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Spoken Subtitle Box -->
        <div class="st-examiner-dialogue-box">
          <div class="st-examiner-label">
            <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
              <span id="examinerNameBadge">Dr. Sarah Jenkins • British Council Examiner</span>
              <div class="st-live-examiner-toggle" title="Switch Examiner Avatar & Voice">
                <button type="button" class="st-switch-btn active" id="switchBtnF" onclick="setExaminerGender('female')">👩 Female</button>
                <button type="button" class="st-switch-btn" id="switchBtnM" onclick="setExaminerGender('male')">👨 Male</button>
              </div>
            </div>
            <span id="stSectionIndicator" style="color:#cbd5e1;">(Part 1 • Question 1 of 4)</span>
          </div>`;

content = content.replace(oldStageAvatarRegex, newStageAvatarHtml);

// 4. Update JavaScript to handle gender switching and correct audio playing
const oldJsStart = `// State
    let currentTest = null;
    let selectedMode = 'all'; // 'all', '1', '2', '3'`;

const newJsStart = `// State
    let currentTest = null;
    let selectedMode = 'all'; // 'all', '1', '2', '3'
    let selectedGender = 'female'; // 'female' or 'male'
    let currentAudioKey = '';
    let currentAudioText = '';

    function setExaminerGender(gender, autoReplay = true) {
      selectedGender = gender;

      // Update Welcome screen buttons
      const btnF = document.getElementById('btnExFemale');
      const btnM = document.getElementById('btnExMale');
      if (btnF && btnM) {
        btnF.classList.toggle('active', gender === 'female');
        btnM.classList.toggle('active', gender === 'male');
        const chkF = btnF.querySelector('.bi-check-circle-fill');
        const chkM = btnM.querySelector('.bi-check-circle-fill');
        if (chkF) chkF.style.display = (gender === 'female') ? 'block' : 'none';
        if (chkM) chkM.style.display = (gender === 'male') ? 'block' : 'none';
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
          ? 'Dr. Sarah Jenkins • British Council Examiner' 
          : 'Dr. Oliver Bennett • British Council Examiner';
      }

      // Replay audio with newly selected voice if currently on an exam screen
      if (autoReplay && currentAudioKey && document.getElementById('examScreen').style.display === 'flex') {
        repeatCurrentAudio();
      }
    }`;

content = content.replace(oldJsStart, newJsStart);

// 5. Update playExaminerVoice and repeatCurrentAudio
const oldAudioRegex = /\/\/ Audio Playback with Studio British Neural Voice[\s\S]*?function speakBrowserTTS\([\s\S]*?window\.speechSynthesis\.speak\(utter\);\s*}/;

const newAudioJs = `// Audio Playback with Studio British Neural Voice (Male & Female Support)
    function playExaminerVoice(audioKey, fallbackText, onDone) {
      currentAudioKey = audioKey;
      currentAudioText = fallbackText;

      if (currentAudioObj) {
        try { currentAudioObj.pause(); currentAudioObj.currentTime = 0; } catch(e){}
      }

      setExaminerVisualState('speaking');

      const prefix = (selectedGender === 'male') ? 'm_' : 'f_';
      const audioUrl = \`/audio/speaking/\${prefix}\${audioKey}.mp3\`;

      const audio = new Audio(audioUrl);
      currentAudioObj = audio;
      let finished = false;

      const finishHandler = () => {
        if (finished) return;
        finished = true;
        setExaminerVisualState('listening');
        if (onDone) onDone();
      };

      audio.onended = finishHandler;
      audio.onerror = () => {
        // Fallback: try default un-prefixed audio file
        const altAudio = new Audio(\`/audio/speaking/\${audioKey}.mp3\`);
        altAudio.onended = finishHandler;
        altAudio.onerror = () => {
          console.warn('Audio file error, falling back to speech synthesis.');
          speakBrowserTTS(fallbackText, finishHandler);
        };
        altAudio.play().catch(() => speakBrowserTTS(fallbackText, finishHandler));
      };

      audio.play().catch(err => {
        console.warn('Audio autoplay prevented, falling back to browser voice:', err);
        speakBrowserTTS(fallbackText, finishHandler);
      });
    }

    function speakBrowserTTS(text, onComplete) {
      if (!('speechSynthesis' in window)) {
        if (onComplete) onComplete();
        return;
      }
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = 0.95;
      const voices = window.speechSynthesis.getVoices();
      const brVoices = voices.filter(v => v.lang === 'en-GB' || v.name.includes('British') || v.name.includes('UK'));

      if (selectedGender === 'male') {
        const maleVoice = brVoices.find(v => /male|george|oliver|ryan|thomas/i.test(v.name));
        if (maleVoice) utter.voice = maleVoice;
        else if (brVoices[0]) utter.voice = brVoices[0];
      } else {
        const femVoice = brVoices.find(v => /female|sarah|sonia|libby|hazel|susan/i.test(v.name));
        if (femVoice) utter.voice = femVoice;
        else if (brVoices[0]) utter.voice = brVoices[0];
      }

      utter.onend = onComplete;
      utter.onerror = onComplete;
      window.speechSynthesis.speak(utter);
    }`;

content = content.replace(oldAudioRegex, newAudioJs);

// 6. Update repeatCurrentAudio and question presenters to use audioKeys
const oldRepeatRegex = /function repeatCurrentAudio\(\) \{[\s\S]*?playExaminerVoice\(audioUrl, text\);\s*\}/;
const newRepeatJs = `function repeatCurrentAudio() {
      if (currentAudioKey) {
        playExaminerVoice(currentAudioKey, currentAudioText);
      }
    }`;
content = content.replace(oldRepeatRegex, newRepeatJs);

// In presentPart1Question
content = content.replace(
  `const audioUrl = \`/audio/speaking/t\${currentTest.id}_p1_q\${currentQIndex}.mp3\`;
      playExaminerVoice(audioUrl, qText, () => {
        startRecording();
      });`,
  `const audioKey = \`t\${currentTest.id}_p1_q\${currentQIndex}\`;
      playExaminerVoice(audioKey, qText, () => {
        startRecording();
      });`
);

// In setupPart2
content = content.replace(
  `playExaminerVoice('/audio/speaking/part2_intro.mp3', "In this part, I am going to give you a topic, and I would like you to talk about it for 1 to 2 minutes. You have one minute to prepare.", () => {
        startPart2PrepTimer();
      });`,
  `playExaminerVoice('part2_intro', "In this part, I am going to give you a topic, and I would like you to talk about it for 1 to 2 minutes. You have one minute to prepare.", () => {
        startPart2PrepTimer();
      });`
);

// In startPart2Speaking
content = content.replace(
  `playExaminerVoice('/audio/speaking/part2_start_speaking.mp3', "All right, remember you have up to two minutes for this, so please begin speaking now.", () => {
        startRecording();
      });`,
  `playExaminerVoice('part2_start_speaking', "All right, remember you have up to two minutes for this, so please begin speaking now.", () => {
        startRecording();
      });`
);

// In presentPart3Question
content = content.replace(
  `const audioUrl = \`/audio/speaking/t\${currentTest.id}_p3_q\${currentQIndex}.mp3\`;
      playExaminerVoice(audioUrl, qText, () => {
        startRecording();
      });`,
  `const audioKey = \`t\${currentTest.id}_p3_q\${currentQIndex}\`;
      playExaminerVoice(audioKey, qText, () => {
        startRecording();
      });`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('SUCCESSFULLY_UPDATED_SPEAKING_ENGINE_AVATARS_AND_VOICES');
