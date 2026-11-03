const fs = require('fs');

const filePath = '../views/speaking_engine/speaking-test.html';
let html = fs.readFileSync(filePath, 'utf8');

// 1. Update CSS for .st-speech-display to support :empty::before cleanly
const oldDispCss = `.st-speech-display {
      min-height: 110px;
      max-height: 220px;
      overflow-y: auto;
      background: #fafbfc;
      border: 1.5px dashed #cbd5e1;
      border-radius: 12px;
      padding: 16px;
      font-size: 0.98rem;
      line-height: 1.6;
      color: #1e293b;
      outline: none;
    }

    .st-speech-placeholder {
      color: #94a3b8;
      font-style: italic;
    }`;

const newDispCss = `.st-speech-display {
      min-height: 110px;
      max-height: 220px;
      overflow-y: auto;
      background: #fafbfc;
      border: 1.5px dashed #cbd5e1;
      border-radius: 12px;
      padding: 16px;
      font-size: 0.98rem;
      line-height: 1.6;
      color: #1e293b;
      outline: none;
      position: relative;
      cursor: text;
    }

    .st-speech-display:empty::before {
      content: attr(data-placeholder);
      color: #94a3b8;
      font-style: italic;
      pointer-events: none;
      display: block;
    }

    .st-speech-placeholder {
      color: #94a3b8;
      font-style: italic;
    }`;

if (html.includes(oldDispCss)) {
  html = html.replace(oldDispCss, newDispCss);
}

// 2. Update HTML markup for recStatusBadge and speechDisplay
const oldSpeechHtml = `        <!-- Live Transcribed Speech -->
        <div class="st-speech-display" id="speechDisplay" contenteditable="true" spellcheck="false">
          <span class="st-speech-placeholder">Speak clearly into your microphone. Your spoken words will appear here in real-time...</span>
        </div>`;

const newSpeechHtml = `        <!-- Live Transcribed Speech (Real-time Speech Recognition & Manual Edit Backup) -->
        <div class="st-speech-display" id="speechDisplay" contenteditable="true" spellcheck="false" data-placeholder="🎙️ Speak clearly into your microphone... Your spoken words will appear here in real-time (or click here to type your answer)"></div>`;

if (html.includes(oldSpeechHtml)) {
  html = html.replace(oldSpeechHtml, newSpeechHtml);
}

// Add wave bars to recStatusBadge
const oldRecBadge = `<div class="st-rec-status" id="recStatusBadge">
            <span class="st-rec-dot"></span>
            <span id="recStatusText">Microphone Active</span>
          </div>`;

const newRecBadge = `<div class="st-rec-status" id="recStatusBadge">
            <span class="st-rec-dot"></span>
            <span id="recStatusText">Microphone Active</span>
            <div class="mic-wave-bars" id="micWaveBars" style="display:inline-flex; align-items:center; gap:2px; margin-left:6px;">
              <span class="mwb" style="width:3px; height:6px; background:#10b981; border-radius:2px; transition:height 0.1s ease;"></span>
              <span class="mwb" style="width:3px; height:12px; background:#10b981; border-radius:2px; transition:height 0.1s ease;"></span>
              <span class="mwb" style="width:3px; height:8px; background:#10b981; border-radius:2px; transition:height 0.1s ease;"></span>
              <span class="mwb" style="width:3px; height:14px; background:#10b981; border-radius:2px; transition:height 0.1s ease;"></span>
            </div>
          </div>`;

if (html.includes(oldRecBadge)) {
  html = html.replace(oldRecBadge, newRecBadge);
}

// 3. Replace speech recognition and recording functions with rock-solid implementation
const oldSpeechFunctions = `    // Speech Recognition
    function initSpeechRecognition() {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) return;

      recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }

        const disp = document.getElementById('speechDisplay');
        if (disp) {
          if (disp.querySelector('.st-speech-placeholder')) disp.innerHTML = '';
          disp.textContent = transcript;
        }
      };
    }

    function startRecording() {
      speakingTimeSeconds = 0;
      updateSpeakingTimer();
      clearInterval(speakingTimerInterval);
      speakingTimerInterval = setInterval(() => {
        speakingTimeSeconds++;
        updateSpeakingTimer();
      }, 1000);

      const disp = document.getElementById('speechDisplay');
      disp.innerHTML = '<span class="st-speech-placeholder">Listening to your voice... Speak clearly into your microphone.</span>';

      document.getElementById('recStatusBadge').style.display = 'inline-flex';
      setExaminerVisualState('listening');

      if (recognition) {
        try { recognition.start(); isRecognizing = true; } catch(e){}
      }
    }

    function stopRecording() {
      clearInterval(speakingTimerInterval);
      document.getElementById('recStatusBadge').style.display = 'none';

      if (recognition && isRecognizing) {
        try { recognition.stop(); isRecognizing = false; } catch(e){}
      }

      const disp = document.getElementById('speechDisplay');
      return disp ? disp.textContent.trim() : '';
    }

    function updateSpeakingTimer() {
      const m = String(Math.floor(speakingTimeSeconds / 60)).padStart(2, '0');
      const s = String(speakingTimeSeconds % 60).padStart(2, '0');
      document.getElementById('speakingTimeVal').textContent = \`\${m}:\${s}\`;
    }

    // Start Exam Flow
    async function startSpeakingExam() {
      if (!appSettingsLoaded) {
        await fetchSystemPhase();
      }
      if (isSpeakingSessionLocked(testId, selectedMode)) {
        openTestUnlockModal();
        return;
      }
      document.getElementById('introScreen').style.display = 'none';
      document.getElementById('examScreen').style.display = 'flex';
      initSpeechRecognition();

      if (selectedMode === '2') {
        setupPart2();
      } else if (selectedMode === '3') {
        setupPart3();
      } else {
        setupPart1();
      }
    }`;

const newSpeechFunctions = `    // Audio Level Meter & Live Microphone Setup
    let audioCtx = null;
    let analyserNode = null;
    let micMediaStream = null;
    let isRecordingState = false;
    let currentAccumulatedSpeech = '';

    async function requestMicrophonePermission() {
      try {
        if (!micMediaStream) {
          micMediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        }
        if (!audioCtx) {
          const AudioContextClass = window.AudioContext || window.webkitAudioContext;
          if (AudioContextClass) {
            audioCtx = new AudioContextClass();
            const source = audioCtx.createMediaStreamSource(micMediaStream);
            analyserNode = audioCtx.createAnalyser();
            analyserNode.fftSize = 64;
            source.connect(analyserNode);
          }
        }
        if (audioCtx && audioCtx.state === 'suspended') {
          await audioCtx.resume();
        }
        return true;
      } catch (err) {
        console.warn('Microphone permission notice:', err);
        return false;
      }
    }

    function monitorMicAudioLevel() {
      if (!analyserNode) return;
      const dataArray = new Uint8Array(analyserNode.frequencyBinCount);
      const bars = document.querySelectorAll('.mic-wave-bars .mwb');

      function updateMeter() {
        if (!isRecordingState) {
          bars.forEach(b => { b.style.height = '4px'; b.style.background = '#94a3b8'; });
          return;
        }
        analyserNode.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
        const avg = sum / dataArray.length;

        bars.forEach((b, idx) => {
          const h = Math.max(4, Math.min(22, (avg * (0.35 + idx * 0.18))));
          b.style.height = h + 'px';
          b.style.background = avg > 8 ? '#10b981' : '#94a3b8';
        });

        const statusText = document.getElementById('recStatusText');
        if (statusText) {
          statusText.textContent = (avg > 8) ? 'Voice Detected 🎙️' : 'Listening to your voice...';
        }

        requestAnimationFrame(updateMeter);
      }
      updateMeter();
    }

    // Web Speech Recognition Engine
    function initSpeechRecognition() {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        console.warn('Web Speech API not available in this browser. Candidates can type their responses directly.');
        return;
      }

      try {
        if (recognition) {
          try { recognition.abort(); } catch(e){}
        }
        recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
          let interim = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              currentAccumulatedSpeech += event.results[i][0].transcript + ' ';
            } else {
              interim += event.results[i][0].transcript;
            }
          }

          const combined = (currentAccumulatedSpeech + interim).trim();
          const disp = document.getElementById('speechDisplay');
          if (disp && combined) {
            disp.textContent = combined;
          }
        };

        recognition.onerror = (event) => {
          console.warn('Speech recognition status:', event.error);
          if (event.error === 'not-allowed') {
            const stText = document.getElementById('recStatusText');
            if (stText) stText.textContent = 'Mic Blocked (Check Address Bar)';
          }
        };

        recognition.onend = () => {
          // If question is still active, automatically resume recognition
          if (isRecordingState && recognition) {
            try { recognition.start(); } catch(e){}
          }
        };
      } catch (e) {
        console.warn('Speech recognition init error:', e);
      }
    }

    function startRecording() {
      isRecordingState = true;
      currentAccumulatedSpeech = '';
      speakingTimeSeconds = 0;
      updateSpeakingTimer();
      clearInterval(speakingTimerInterval);
      speakingTimerInterval = setInterval(() => {
        speakingTimeSeconds++;
        updateSpeakingTimer();
      }, 1000);

      const disp = document.getElementById('speechDisplay');
      if (disp) {
        disp.textContent = ''; // empty triggers CSS :empty::before placeholder
      }

      const badge = document.getElementById('recStatusBadge');
      if (badge) badge.style.display = 'inline-flex';
      const statusText = document.getElementById('recStatusText');
      if (statusText) statusText.textContent = 'Listening to your voice...';

      setExaminerVisualState('listening');

      if (recognition) {
        try { recognition.start(); } catch(e){}
      }
      if (analyserNode) {
        monitorMicAudioLevel();
      }
    }

    function stopRecording() {
      isRecordingState = false;
      clearInterval(speakingTimerInterval);
      const badge = document.getElementById('recStatusBadge');
      if (badge) badge.style.display = 'none';

      if (recognition) {
        try { recognition.stop(); } catch(e){}
      }

      const disp = document.getElementById('speechDisplay');
      let answer = disp ? disp.textContent.trim() : '';

      // Strict filter: never return UI placeholder strings
      if (
        answer.includes('Speak clearly into your microphone') ||
        answer.includes('Listening to your voice') ||
        answer.includes('Your spoken words will appear here')
      ) {
        answer = '';
      }

      return answer;
    }

    function updateSpeakingTimer() {
      const m = String(Math.floor(speakingTimeSeconds / 60)).padStart(2, '0');
      const s = String(speakingTimeSeconds % 60).padStart(2, '0');
      document.getElementById('speakingTimeVal').textContent = \`\${m}:\${s}\`;
    }

    // Start Exam Flow
    async function startSpeakingExam() {
      if (!appSettingsLoaded) {
        await fetchSystemPhase();
      }
      if (isSpeakingSessionLocked(testId, selectedMode)) {
        openTestUnlockModal();
        return;
      }

      // Prompt for microphone access upfront
      const micGranted = await requestMicrophonePermission();
      if (!micGranted) {
        console.warn('Microphone permission not granted or mic unavailable. Candidate may type responses.');
      }

      document.getElementById('introScreen').style.display = 'none';
      document.getElementById('examScreen').style.display = 'flex';
      initSpeechRecognition();

      if (selectedMode === '2') {
        setupPart2();
      } else if (selectedMode === '3') {
        setupPart3();
      } else {
        setupPart1();
      }
    }`;

if (html.includes(oldSpeechFunctions)) {
  html = html.replace(oldSpeechFunctions, newSpeechFunctions);
  console.log('Replaced speech functions');
} else {
  console.warn('Could not find oldSpeechFunctions directly');
}

// 4. Update submitCurrentAnswer to warn if no speech detected
const oldSubmitFn = `    // Submit Answer & Transition
    function submitCurrentAnswer() {
      const answer = stopRecording();

      if (currentStage === 'part1') {
        candidateAnswers[\`p1_q\${currentQIndex}\`] = answer;
        currentQIndex++;
        if (currentQIndex < currentTest.part1.questions.length) {
          presentPart1Question();
        } else {
          if (selectedMode === '1') {
            finishSpeakingTest();
          } else {
            setupPart2();
          }
        }
      } else if (currentStage === 'part2_speak') {
        candidateAnswers['p2_response'] = answer;
        if (selectedMode === '2') {
          finishSpeakingTest();
        } else {
          setupPart3();
        }
      } else if (currentStage === 'part3') {
        candidateAnswers[\`p3_q\${currentQIndex}\`] = answer;
        currentQIndex++;
        if (currentQIndex < currentTest.part3.questions.length) {
          presentPart3Question();
        } else {
          finishSpeakingTest();
        }
      }
    }`;

const newSubmitFn = `    // Submit Answer & Transition
    function submitCurrentAnswer() {
      const answer = stopRecording();

      if (!answer || answer.trim().length < 3) {
        const proceed = confirm(
          "⚠️ No spoken answer was detected for this question.\\n\\n" +
          "• If your microphone was muted, speak clearly or type your answer directly in the box.\\n\\n" +
          "Click 'OK' to proceed without an answer, or 'Cancel' to record or type your response now."
        );
        if (!proceed) {
          startRecording();
          return;
        }
      }

      if (currentStage === 'part1') {
        candidateAnswers[\`p1_q\${currentQIndex}\`] = answer;
        currentQIndex++;
        if (currentQIndex < currentTest.part1.questions.length) {
          presentPart1Question();
        } else {
          if (selectedMode === '1') {
            finishSpeakingTest();
          } else {
            setupPart2();
          }
        }
      } else if (currentStage === 'part2_speak') {
        candidateAnswers['p2_response'] = answer;
        if (selectedMode === '2') {
          finishSpeakingTest();
        } else {
          setupPart3();
        }
      } else if (currentStage === 'part3') {
        candidateAnswers[\`p3_q\${currentQIndex}\`] = answer;
        currentQIndex++;
        if (currentQIndex < currentTest.part3.questions.length) {
          presentPart3Question();
        } else {
          finishSpeakingTest();
        }
      }
    }`;

if (html.includes(oldSubmitFn)) {
  html = html.replace(oldSubmitFn, newSubmitFn);
  console.log('Replaced submitCurrentAnswer function');
}

fs.writeFileSync(filePath, html, 'utf8');
console.log('Updated speaking-test.html with robust speech & audio visualizer');
