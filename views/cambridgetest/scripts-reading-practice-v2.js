/**
 * scripts-reading-practice-v2.js
 * Cambridge IELTS Reading Practice Engine V2 - IELTS Mockpoint
 * Fully Responsive, Split-Screen Layout + Multi-Passage Switching + Evidence Highlights + Explanations & Traps
 */

(function () {
  "use strict";

  // -------------------------------------------------------------
  // State Variables
  // -------------------------------------------------------------
  let testData = null;

  // ==========================================
  // PHASE & ACCESS CONTROL ENGINE (Phase 2 & Phase 3)
  // ==========================================
  let appPhase = 1;
  let appSettings = {};
  let appSettingsLoaded = false;

  async function fetchSystemPhase() {
    try {
      const res = await fetch('/api/system-settings');
      const data = await res.json();
      if (data && data.success && data.settings) {
        appPhase = Number(data.settings.currentPhase) || 1;
        appSettings = data.settings || {};
        appSettingsLoaded = true;
      }
    } catch(e) {
      console.warn('Could not fetch system settings, default to phase 1:', e);
    }
  }

  function getUserAccessState() {
    try {
      const u = JSON.parse(localStorage.getItem('user') || 'null');
      if (!u || (!u.email && !u.name)) {
        return { isLoggedIn: false, isPremium: false };
      }
      const isPremium = !!(u.isPremium || u.role === 'admin' || u.plan === 'premium');
      return { isLoggedIn: true, isPremium };
    } catch(e) {
      return { isLoggedIn: false, isPremium: false };
    }
  }

  function isSectionLocked(gIdx) {
    if (appPhase === 1) return false;
    const user = getUserAccessState();
    const testNum = Number(testParam) || 1;
    const freeTestQuota = appSettings.freeFullMocksCount !== undefined ? Number(appSettings.freeFullMocksCount) : 1;

    if (appPhase === 2) {
      if (user.isLoggedIn) return false;
      if (testNum > freeTestQuota) return true;
      const allowed = appSettings.freeQuestionTypesPerTest !== undefined ? Number(appSettings.freeQuestionTypesPerTest) : 0;
      return gIdx >= allowed;
    }

    if (appPhase === 3) {
      if (user.isPremium) return false;
      if (testNum > freeTestQuota) return true;
      const allowed = appSettings.freeQuestionTypesPerTest !== undefined ? Number(appSettings.freeQuestionTypesPerTest) : 0;
      return gIdx >= allowed;
    }

    return false;
  }

  function isCurrentSessionLocked() {
    if (appPhase === 1) return false;
    const user = getUserAccessState();
    if (appPhase === 2 && user.isLoggedIn) return false;
    if (appPhase === 3 && user.isPremium) return false;

    const testNum = Number(testParam) || 1;
    const freeTestsAllowed = appSettings.freeFullMocksCount !== undefined ? Number(appSettings.freeFullMocksCount) : 1;
    if (testNum > freeTestsAllowed) return true;

    if (practiceMode === 'part') {
      const partIdx = (targetPart || 1) - 1;
      const freePartsAllowed = appSettings.freePartsPerTest !== undefined ? Number(appSettings.freePartsPerTest) : 1;
      if (partIdx >= freePartsAllowed) return true;
    } else if (practiceMode === 'section') {
      const groups = testData.questionGroups || [];
      const gIdx = groups.indexOf(targetGroup);
      const freeSecAllowed = appSettings.freeQuestionTypesPerTest !== undefined ? Number(appSettings.freeQuestionTypesPerTest) : 0;
      if (gIdx >= freeSecAllowed) return true;
    }

    return false;
  }

  function openTestUnlockModal(triggerReason) {
    const modal = document.getElementById('psUnlockModal');
    if (!modal) return;

    const iconWrap = document.getElementById('psUnlockIconWrap');
    const tagBadge = document.getElementById('psUnlockBadge');
    const titleEl = document.getElementById('psUnlockTitle');
    const descEl = document.getElementById('psUnlockDesc');
    const primaryBtn = document.getElementById('psUnlockPrimaryBtn');
    const backBtn = document.getElementById('psUnlockBackBtn');
    const secondaryAction = document.getElementById('psUnlockSecondaryAction');

    const currUrl = encodeURIComponent(window.location.pathname + window.location.search);
    const isSessionBlocked = isCurrentSessionLocked();

    if (backBtn) {
      if (isSessionBlocked) {
        backBtn.textContent = 'Back to Cambridge Tests';
        backBtn.onclick = () => { window.location.href = window.location.pathname.includes('reading') ? '/cambridge-reading.html' : '/cambridge-listening.html'; };
      } else {
        backBtn.textContent = 'Cancel / Keep Practicing';
        backBtn.onclick = () => { closeTestUnlockModal(); };
      }
    }

    if (appPhase === 3) {
      // Phase 3: Paid / Premium
      if (iconWrap) {
        iconWrap.style.background = 'rgba(224, 32, 45, 0.08)';
        iconWrap.style.borderColor = 'rgba(224, 32, 45, 0.28)';
        iconWrap.style.color = '#e0202d';
        iconWrap.innerHTML = '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>';
      }
      if (tagBadge) {
        tagBadge.style.display = 'inline-block';
        tagBadge.style.background = '#fee2e2';
        tagBadge.style.color = '#b91c1c';
        tagBadge.style.border = '1px solid #fca5a5';
        tagBadge.textContent = 'PREMIUM PLAN REQUIRED';
      }
      if (titleEl) titleEl.textContent = 'Unlock with Premium Access';
      if (descEl) descEl.textContent = 'Upgrade to IELTS Mockpoint Premium to access all Cambridge tests, individual section practices, and full audio transcripts with explanations.';
      if (primaryBtn) {
        primaryBtn.style.background = '#e0202d';
        primaryBtn.href = '/pricing';
        primaryBtn.innerHTML = '<span>Upgrade to Premium / Buy Pass</span> &rarr;';
      }
      if (secondaryAction) {
        const u = getUserAccessState();
        if (!u.isLoggedIn) {
          secondaryAction.innerHTML = `<a href="/login?redirect=${currUrl}" style="font-size:0.86rem; color:#1565c9; text-decoration:none; font-weight:600;">Already have a paid account? <span style="text-decoration:underline;">Sign In</span></a>`;
          secondaryAction.style.display = 'block';
        } else {
          secondaryAction.style.display = 'none';
        }
      }
    } else {
      // Phase 2: Candidate Free Account
      if (iconWrap) {
        iconWrap.style.background = '#fdecee';
        iconWrap.style.borderColor = 'rgba(224, 32, 45, 0.28)';
        iconWrap.style.color = '#e0202d';
        iconWrap.innerHTML = '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#e0202d" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>';
      }
      if (tagBadge) {
        tagBadge.style.display = 'inline-block';
        tagBadge.style.background = '#fdecee';
        tagBadge.style.color = '#e0202d';
        tagBadge.style.border = '1px solid rgba(224, 32, 45, 0.25)';
        tagBadge.textContent = 'FREE CANDIDATE ACCOUNT';
      }
      if (titleEl) titleEl.textContent = 'Sign In Required to Unlock';
      if (descEl) descEl.textContent = 'Please sign in or create a free candidate account to practice this section and save your progress to your personal dashboard.';
      if (primaryBtn) {
        primaryBtn.style.background = '#e0202d';
        primaryBtn.href = `/login?redirect=${currUrl}`;
        primaryBtn.innerHTML = '<span>Sign In / Register Free</span> &rarr;';
      }
      if (secondaryAction) {
        secondaryAction.style.display = 'none';
      }
    }

    modal.classList.add('open');
  }

  function closeTestUnlockModal() {
    if (isCurrentSessionLocked()) {
      window.location.href = window.location.pathname.includes('reading') ? '/cambridge-reading.html' : '/cambridge-listening.html';
      return;
    }
    const m = document.getElementById('psUnlockModal');
    if (m) m.classList.remove('open');
  }

  window.openTestUnlockModal = openTestUnlockModal;
  window.closeTestUnlockModal = closeTestUnlockModal;

  let activePassage = 1; // 1, 2, or 3
  let userAnswers = {};
  let isSubmitted = false;
  let currentFocusedQ = 1;

  const urlParams = new URLSearchParams(window.location.search);
  const bookParam = Number(urlParams.get("book") || 21);
  const testParam = Number(urlParams.get("test") || 1);
  const passageParam = (urlParams.get("passage") || urlParams.get("part"))
    ? Number(urlParams.get("passage") || urlParams.get("part"))
    : null;
  const sectionParam = urlParams.get("section") || urlParams.get("group") || urlParams.get("q") || null;

  let practiceMode = "full"; // "full", "passage", or "section"
  let targetPassage = 1;
  let targetGroup = null;
  let targetQIds = [];
  let showAllPassageParas = false;

  // Timer Variables
  let timerInterval = null;
  let remainingSeconds = 60 * 60; // 60 minutes countdown for full test
  let practiceSeconds = 0; // countup timer for single section / passage

  // DOM Elements
  const passageCol = document.getElementById("passageCol");
  const questionsCol = document.getElementById("questionsCol");
  const testBookBadge = document.getElementById("testBookBadge");
  const testTitleBadge = document.getElementById("testTitleBadge");
  const readingModeText = document.getElementById("readingModeText");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");
  const finishBtn = document.getElementById("finishBtn");
  const submitModal = document.getElementById("submitModal");
  const confirmSubmitBtn = document.getElementById("confirmSubmitBtn");
  const cancelSubmitBtn = document.getElementById("cancelSubmitBtn");
  const scorecardModal = document.getElementById("scorecardModal");

  // Cambridge 21 Academic Reading Test 1 Passage 3 (Q31-36) Official Word List
  const c21Test1SummaryOptions = [
    { letter: "A", text: "national governments" },
    { letter: "B", text: "agricultural developments" },
    { letter: "C", text: "less wealthy nations" },
    { letter: "D", text: "untrained workers" },
    { letter: "E", text: "small-scale cultivation" },
    { letter: "F", text: "outdated methods" },
    { letter: "G", text: "financial controls" },
    { letter: "H", text: "migrant workers" },
    { letter: "I", text: "powerful individuals and businesses" }
  ];

  // Comprehensive Explanations & Traps for Cambridge 21 Test 1 (All 40 Questions)
  const c21Explanations = {
    1: "Grandfather David Davies amassed a fortune in the shipping and mining industries. Paraphrase: 'fortune came from [mining] and transportation (shipping) businesses.'",
    2: "The sisters' education was rigorously geared toward art and cultural pursuits, filling the gap of having no family history of collecting.",
    3: "Their school in London focused on cultural rather than academic study, encouraging art gallery visits.",
    4: "Their preference for Old Master paintings was directly revealed in their journals, though initially such works were too expensive for them.",
    5: "Their first purchase of French Impressionist art took place in October 1912 (scenes of Venice by Claude Monet).",
    6: "Both sisters volunteered at a troop canteen in Troyes, northern France, during the First World War.",
    7: "They were described as unlikely pioneer collectors because they lived in rural Wales and did not make friends with artists or gallery owners.",
    8: "TRUE: Paragraph A states their religious upbringing in rural Wales gave them a deep sense of social responsibility, leading them to use their inheritance for cultural and philanthropic purposes.",
    9: "NOT GIVEN: Paragraph D states they bought paintings by French artist Jean-Baptiste-Camille Corot, but DOES NOT mention whether they were bought from a gallery in France or elsewhere.",
    10: "FALSE: Paragraph E states Hugh Blaker, as a champion of contemporary French art, 'had a hand in the decision' to buy Impressionist art. He encouraged it, rather than opposing it.",
    11: "FALSE: Paragraph G states the Cézanne paintings acquired at Bernheim-Jeune Gallery were 'shipped directly to Bath, England' (not directly to Wales).",
    12: "TRUE: Paragraph H states Gwendoline stopped buying art because of poverty and social upheaval following WWI, redirecting her resources to social causes and Gregynog Hall.",
    13: "TRUE: Paragraph I states the sisters collected French Impressionist paintings 'at a time when such art was routinely ignored by individuals and institutions alike' (very few people were doing so).",
    14: "C: Paragraph C details noise-reduction actions taken by various cities: quieter buses in London, noise-reducing road coatings, Washington DC's leaf blower ban, and NYC's fines on noisy vehicles.",
    15: "B: Paragraph B cites an official report from the European Environment Agency stating at least 1 in 5 Europeans are exposed to noise levels harmful to health.",
    16: "A: Paragraph A explains that from an evolutionary perspective, sounds gave vital cues to avoid danger, altering internal chemistry (blood pressure, fight-or-flight hormones).",
    17: "G: Paragraph G cites Eric Pfeifer's study showing participants experienced more relaxation and less boredom in an outdoor garden compared with a completely silent room.",
    18: "breath: Feinstein explains that in a flotation tank, 'it is the ability to focus on the breath that helps people reach a relaxed or meditative state.'",
    19: "questionnaire: Participants were given a questionnaire to complete prior to and following a flotation session.",
    20: "wellbeing: Participants reported an increase in feelings of relaxation and overall wellbeing.",
    21: "depression: Float sessions uniquely decreased activity in the default mode network (DMN), a collection of brain regions linked with depression.",
    22: "C: Tal Dotan Ben-Soussan explains: 'When people do not want silence, it can be very distressing.' (Reluctance leads to distress).",
    23: "A: Nick Antonio says: 'People are seeing the benefits of these more quiet environments in their cities. I expect we will see much more of this in the future.'",
    24: "B: Justin Feinstein notes that subtle humming and visual perceptions in flotation tanks are 'benign and do not detract from the benefits of the experience.'",
    25: "D: Eric Pfeifer states: 'It is likely better to have more frequency of silence for a few minutes at a time than a longer period of silence only once a week.'",
    26: "C: Tal Dotan Ben-Soussan states quiet allows us to 'provide [a more] adequate response' to our surroundings.",
    27: "B: Paragraph A explains beet sugar was heavily subsidised and sold at artificially low prices, threatening the livelihood of traditional cane sugar producers.",
    28: "D: Paragraph B traces British sugar imports chronologically from Caribbean colonial plantations, to Cuba and Brazil, then European beet, and finally domestic beet (imported from different areas at different times).",
    29: "A: Paragraph C refutes the idea that sugar was only grown on large plantations owned by rich men, showing that in Java, sugar was grown by small farmers alongside rice.",
    30: "A: Paragraph H praises the book as a 'wonderfully rich book, a model of global history' and notes that Bosma 'avoids outbursts of emotion, celebratory or critical' (admiring objectivity and coverage).",
    31: "H: German beet fields used Polish workers, while US sugar relied on Mexican and Sicilian workers (migrant workers).",
    32: "E: In South Asia and Latin America, sugar production was characterized by traditional methods on small farms (small-scale cultivation).",
    33: "I: Sugar production involved capitalists, dynasties, and large corporations (powerful individuals and businesses).",
    34: "G: The sugar bourgeoisie exercised major political influence, ensuring their interests were protected by trade barriers and subsidies (financial controls).",
    35: "C: In conflicts over market control, 'it was inevitably the poor countries which came off worse' (less wealthy nations).",
    36: "B: Rapid diffusion occurred for 'Particular varieties of cane sugar and beet sugar' across different regions (agricultural developments).",
    37: "YES: Paragraph G confirms that new farming techniques, fertilisers, and irrigation transformed sugar into a 'ubiquitous chemical' (common and widespread).",
    38: "NO: Paragraph G explicitly states that sugar was 'Once regarded as a luxury', and only later promoted as an energy source. It was not first used as an energy source.",
    39: "NOT GIVEN: Paragraph G outlines how the sugar industry attacked critics and blamed fats and exercise, but DOES NOT state whether these public relations campaigns were successful.",
    40: "YES: Paragraph G states high-fructose corn syrup is 'now widely consumed, having been adopted in the making of soft drinks and a large number of processed foods'."
  };

  const c21Traps = {
    1: "Distinguish David Davies' source of wealth (shipping and mining) from where the granddaughters later spent their inheritance (art and philanthropy).",
    2: "The sisters lacked a 'family history' of art collecting, but their formal 'education' compensated for it.",
    3: "Do not write 'academic'. The text specifically states their school prioritized cultural pursuits over academic study.",
    4: "Do not confuse their personal 'journals' with the notes taken with Jane Blaker or advice from dealer Hugh Blaker.",
    5: "1908 was their initial art acquisition year, but October 1912 was their first French Impressionist purchase (Monet).",
    6: "Their initial wartime contribution was funding Belgian artists; only later did they physically volunteer at a troop canteen.",
    7: "Despite consulting trusted advisers, they lived secluded in Wales and never made close friends with artists or gallery owners.",
    8: "Do not confuse their grandfather's industrialist mindset with the sisters' religious rural upbringing.",
    9: "Common trap: Corot was a French artist, but the passage never states where the purchase took place. Never assume location.",
    10: "Hugh Blaker was a champion of French Impressionism and encouraged them. Opposition contradicts the text.",
    11: "Watch the destination: the Cézannes were delivered to Bath, England, not to Wales.",
    12: "Her cessation of art purchases was prompted by post-WWI poverty and a deliberate shift in moral priorities.",
    13: "'Ignored by individuals and institutions alike' directly paraphrases 'very few people were doing so'.",
    14: "Look for multiple specific municipal initiatives across different international cities (London, DC, NYC).",
    15: "Check the source: European Environment Agency report is an official institutional assessment.",
    16: "Evolutionary flight-or-flight reactions are biological survival mechanisms, contrasting with chronic modern noise illness.",
    17: "The garden vs silent room experiment specifically demonstrates the viability of outdoor silence.",
    18: "Feinstein highlights breath awareness as the central mechanism for entering a meditative state.",
    19: "Both pre-float and post-float evaluations were administered via a questionnaire.",
    20: "Wellbeing is paired with relaxation as reported positive psychological outcomes.",
    21: "The default mode network (DMN) is explicitly correlated with depressive symptoms.",
    22: "Involuntary silence causes distress, according to Ben-Soussan.",
    23: "Antonio expresses optimistic expectations regarding future city noise regulations.",
    24: "Feinstein characterizes sensory distortions during floatation as benign rather than pathological.",
    25: "Pfeifer emphasizes brief, frequent intervals of quiet over occasional lengthy sessions.",
    26: "Inner calmness enables measured and appropriate responses to situational demands.",
    27: "Subsidized European beet sugar depressed world market prices, undermining tropical cane economies.",
    28: "Trace the temporal sequence of suppliers: British colonies, then foreign slave states, then European beet, then domestic beet.",
    29: "Java's intercropped smallholder rice-sugar model refutes the plantation-only stereotype.",
    30: "The author praises Bosma's measured, non-sensationalist historical tone.",
    31: "Polish, Mexican, and Sicilian labourers were all temporary/migrant workforces in industrialized sugar fields.",
    32: "South Asian and Latin American smallholders represent traditional small-scale cultivation.",
    33: "Bourgeois dynasties and corporate cartels represent powerful commercial entities.",
    34: "State-enacted protective tariffs and subventions constitute financial controls.",
    35: "Vulnerable developing economies were disproportionately harmed in global sugar disputes.",
    36: "Diffusion of adapted cane and beet cultivars represents agricultural innovations.",
    37: "Industrialization transformed an exclusive luxury into an omnipresent commodity.",
    38: "Sugar began as an aristocratic status symbol before nutritional marketing repositioned it as energy.",
    39: "Aggressive defensive PR campaigns do not imply measurable public acceptance or success.",
    40: "Broad industrial adoption in confections and beverages confirms extensive commercial usage."
  };

  // -------------------------------------------------------------
  // 1. Initialization
  // -------------------------------------------------------------
  async function initTest() {
    try {
      const isPracticeBank = urlParams.get("practice") === "bank" || urlParams.has("set") || urlParams.has("pracNumber");
      let apiUrl = `/api/cambridge-reading-v2/${bookParam}/${testParam}`;
      if (isPracticeBank) {
        const pType = urlParams.get("type") || urlParams.get("pracType") || "Summary Completion";
        const pSet = (urlParams.get("set") || urlParams.get("pracNumber") || "1").replace(/\D/g, "") || "1";
        apiUrl = `/api/reading-practice-v2/${encodeURIComponent(pType)}/${pSet}`;
      }

      const res = await fetch(apiUrl);
      const json = await res.json();
      if (!res.ok || !json.success || !json.data) {
        throw new Error(json.message || "Failed to load reading test data");
      }
      testData = json.data;

      determinePracticeMode();
      setupHeaderTitle();

      renderBottomNavigation();
      switchPassage(activePassage);

      startTimer();
      initSplitResizer();
      initTextHighlighting();

    } catch (err) {
      console.error("Init reading test error:", err);
      if (passageCol) {
        passageCol.innerHTML = `
          <div style="text-align:center; padding: 60px 20px; color: var(--red);">
            <h2>Failed to load reading test</h2>
            <p>${err.message}</p>
          </div>
        `;
      }
      if (questionsCol) questionsCol.innerHTML = "";
    }
  }

  function determinePracticeMode() {
    const isPracticeBank = urlParams.get("practice") === "bank" || urlParams.has("set") || urlParams.has("pracNumber") || (testData && testData.source === "Practice Bank");
    const groups = testData.questionGroups || [];

    if (isPracticeBank) {
      practiceMode = "section";
      targetPassage = 1;
      activePassage = 1;
      targetGroup = groups[0] || null;
      targetQIds = targetGroup ? getGroupQuestionIds(targetGroup) : [1, 2, 3, 4, 5];
      currentFocusedQ = targetQIds[0] || 1;
      return;
    }

    if (sectionParam) {
      practiceMode = "section";
      const cleanSec = String(sectionParam).trim().replace(/^q/i, "");
      const m = cleanSec.match(/^(\d+)-(\d+)$/);

      if (m) {
        const qStart = Number(m[1]);
        const qEnd = Number(m[2]);
        targetGroup = groups.find(g => {
          const ids = getGroupQuestionIds(g);
          return ids[0] === qStart && ids[ids.length - 1] === qEnd;
        }) || groups.find(g => {
          const ids = getGroupQuestionIds(g);
          return ids.includes(qStart);
        });
      } else if (!isNaN(Number(cleanSec))) {
        const idx = Number(cleanSec);
        targetGroup = groups.find(g => getGroupQuestionIds(g).includes(idx));
      }

      if (targetGroup) {
        targetPassage = Number(targetGroup.part) || Number(targetGroup.passage) || 1;
        targetQIds = getGroupQuestionIds(targetGroup);
        activePassage = targetPassage;
      } else {
        practiceMode = "full";
        activePassage = 1;
        targetQIds = Array.from({ length: 40 }, (_, i) => i + 1);
      }
    } else if (passageParam && passageParam >= 1 && passageParam <= 3) {
      practiceMode = "passage";
      targetPassage = passageParam;
      activePassage = targetPassage;
      const startQ = (targetPassage === 1) ? 1 : (targetPassage === 2 ? 14 : 27);
      const endQ = (targetPassage === 1) ? 13 : (targetPassage === 2 ? 26 : 40);
      targetQIds = [];
      for (let q = startQ; q <= endQ; q++) targetQIds.push(q);
    } else {
      practiceMode = "full";
      activePassage = 1;
      targetQIds = Array.from({ length: 40 }, (_, i) => i + 1);
    }

    currentFocusedQ = targetQIds[0] || 1;
  }

  function getGroupQuestionIds(g) {
    if (g.questionIds && g.questionIds.length) return g.questionIds.map(Number);
    if (g.ids && g.ids.length) return g.ids.map(Number);

    const ids = [];
    if (g.items) {
      g.items.forEach(it => {
        if (Array.isArray(it.ids)) {
          it.ids.forEach(id => ids.push(Number(id)));
        } else {
          const val = it.id || it.questionNumber || it.qNo;
          if (val) ids.push(Number(val));
        }
      });
    }
    if (g.features) {
      g.features.forEach(f => {
        const val = f.id || f.questionNumber || f.qNo;
        if (val) ids.push(Number(val));
      });
    }
    if (g.statements) {
      g.statements.forEach(st => {
        const val = st.id || st.questionNumber || st.qNo;
        if (val) ids.push(Number(val));
      });
    }
    if (g.sentences) {
      g.sentences.forEach(s => {
        const matches = String(s).match(/\[(?:blank|drop):(\d+)\]/g) || [];
        matches.forEach(m => ids.push(Number(m.replace(/\D/g, ''))));
      });
    }
    if (g.sections) {
      g.sections.forEach(sec => {
        (sec.points || []).forEach(p => {
          const matches = String(p).match(/\[(?:blank|drop):(\d+)\]/g) || [];
          matches.forEach(m => ids.push(Number(m.replace(/\D/g, ''))));
        });
      });
    }
    if (g.steps) {
      g.steps.forEach(st => {
        const matches = String(st).match(/\[(?:blank|drop):(\d+)\]/g) || [];
        matches.forEach(m => ids.push(Number(m.replace(/\D/g, ''))));
      });
    }
    if (g.paragraphs) {
      g.paragraphs.forEach(para => {
        const matches = String(para).match(/\[(?:blank|drop):(\d+)\]/g) || [];
        matches.forEach(m => ids.push(Number(m.replace(/\D/g, ''))));
      });
    }
    if (g.tableData && g.tableData.rows) {
      g.tableData.rows.forEach(row => {
        (row || []).forEach(cell => {
          const matches = String(cell).match(/\[(?:blank|drop):(\d+)\]/g) || [];
          matches.forEach(m => ids.push(Number(m.replace(/\D/g, ''))));
        });
      });
    }
    if (ids.length === 0 && g.title) {
      const m = g.title.match(/(\d+)\s*[-–—]\s*(\d+)/);
      if (m) {
        for (let i = Number(m[1]); i <= Number(m[2]); i++) ids.push(i);
      }
    }
    return Array.from(new Set(ids)).sort((a, b) => a - b);
  }

  function setupHeaderTitle() {
    const isPracticeBank = urlParams.get("practice") === "bank" || urlParams.has("set") || urlParams.has("pracNumber") || (testData && testData.source === "Practice Bank");

    if (isPracticeBank) {
      if (testBookBadge) testBookBadge.textContent = "Practice Bank";
      if (testTitleBadge) {
        const qRange = targetQIds && targetQIds.length ? `Questions ${targetQIds[0]}–${targetQIds[targetQIds.length - 1]}` : 'Questions';
        const typeName = targetGroup ? getFriendlyGroupType(targetGroup.type) : (testData.pracType || 'Practice');
        testTitleBadge.textContent = `Set ${testData.testNo || 1} • ${qRange} (${typeName})`;
      }
      if (readingModeText) readingModeText.textContent = `Practice Hub Bank (Set ${testData.testNo || 1})`;
      return;
    }

    if (testBookBadge) {
      testBookBadge.textContent = `Cambridge ${bookParam}`;
    }

    if (testTitleBadge) {
      if (practiceMode === "section" && targetGroup) {
        const qRange = `Questions ${targetQIds[0]}–${targetQIds[targetQIds.length - 1]}`;
        const typeName = getFriendlyGroupType(targetGroup.type);
        testTitleBadge.textContent = `Test ${testParam} • ${qRange} (${typeName})`;
        if (readingModeText) readingModeText.textContent = `Section Practice (${typeName})`;
      } else if (practiceMode === "passage") {
        testTitleBadge.textContent = `Test ${testParam} • Passage ${targetPassage} (Q${targetQIds[0]}–${targetQIds[targetQIds.length - 1]})`;
        if (readingModeText) readingModeText.textContent = `Passage ${targetPassage} Practice`;
      } else {
        testTitleBadge.textContent = `Academic Reading Test ${testParam}`;
        if (readingModeText) readingModeText.textContent = `Full Reading Mock Test (60 Mins)`;
      }
    }
  }

  function getFriendlyGroupType(type) {
    if (!type) return "Questions";
    const t = String(type).toLowerCase();
    if (t.includes("true-false") || t.includes("true_false")) return "True / False / Not Given";
    if (t.includes("yes-no") || t.includes("yes_no")) return "Yes / No / Not Given";
    if (t.includes("note")) return "Note Completion";
    if (t.includes("summary")) return "Summary Completion";
    if (t.includes("sentence-ending")) return "Matching Sentence Endings";
    if (t.includes("sentence")) return "Sentence Completion";
    if (t.includes("table")) return "Table Completion";
    if (t.includes("flow")) return "Flow-chart Completion";
    if (t.includes("heading")) return "Matching Headings";
    if (t.includes("info")) return "Matching Information";
    if (t.includes("name") || t.includes("peop") || t.includes("feature")) return "Matching Features";
    if (t.includes("matrix")) return "Matching Information";
    if (t.includes("two-choice") || t.includes("multiple-choice-two")) return "Two Choices";
    if (t.includes("one-choice") || t.includes("mcq")) return "One Choice";
    if (t.includes("matching")) return "Matching";
    if (t.includes("diagram") || t.includes("map")) return "Diagram Labelling";
    return "Reading Questions";
  }

  // -------------------------------------------------------------
  // 2. Timer Control
  let elapsedSeconds = 0;
  let hasShownOneHourAlert = false;

  function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      elapsedSeconds++;
      const m = Math.floor(elapsedSeconds / 60);
      const s = elapsedSeconds % 60;
      if (minutesEl) minutesEl.textContent = String(m).padStart(2, "0");
      if (secondsEl) secondsEl.textContent = String(s).padStart(2, "0");

// Time limit interruption disabled: Cambridge practice is untimed
    }, 1000);
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function showOneHourModal() {
    // Interruption modal removed: Cambridge tests have no time limits
  }

  function continueAfterOneHour() {
    const modal = document.getElementById("oneHourModal");
    if (modal) modal.style.display = "none";
  }

  function submitFromOneHour() {
    const modal = document.getElementById("oneHourModal");
    if (modal) modal.style.display = "none";
    submitTest();
  }

  // 3. Render Passage (Left Column)
  // -------------------------------------------------------------
  function sanitizeAllowedHtml(str) {
    if (str == null) return '';
    let s = String(str);
    s = s.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    s = s.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
    s = s.replace(/on\w+="[^"]*"/gi, '');
    s = s.replace(/on\w+='[^']*'/gi, '');
    return s;
  }

  function getHeadingQuestionForParagraph(headingGroup, paraLetter, paraIndex, startQ) {
    if (!headingGroup) return null;
    const pLetterUpper = String(paraLetter).toUpperCase();
    if (Array.isArray(headingGroup.items) && headingGroup.items.length) {
      const item = headingGroup.items.find(it => {
        const txt = String(it.text || it.name || '').toUpperCase();
        return txt.endsWith(' ' + pLetterUpper) || txt.endsWith(pLetterUpper) || txt === pLetterUpper;
      });
      if (item) return Number(item.id || item.questionNumber || item.qNo);
      if (headingGroup.items[paraIndex]) return Number(headingGroup.items[paraIndex].id || headingGroup.items[paraIndex].questionNumber || headingGroup.items[paraIndex].qNo);
    }
    if (Array.isArray(headingGroup.paragraphsMap) && headingGroup.paragraphsMap.length) {
      const pm = headingGroup.paragraphsMap.find(m => {
        const sec = String(m.section || m.paragraph || '').toUpperCase();
        return sec.endsWith(' ' + pLetterUpper) || sec.endsWith(pLetterUpper) || sec === pLetterUpper;
      });
      if (pm) return Number(pm.id);
      if (headingGroup.paragraphsMap[paraIndex]) return Number(headingGroup.paragraphsMap[paraIndex].id);
    }
    if (Array.isArray(headingGroup.ids) && headingGroup.ids.length) {
      if (paraIndex < headingGroup.ids.length) {
        return Number(headingGroup.ids[paraIndex]);
      }
    }
    return null;
  }

  function getPassageParagraphs(passage) {
    if (!passage) return [];
    const pc = passage.paragraphContent || passage["paragraph-content"] || passage["paragraph_content"];
    const pMarks = passage["paragraph-Mark"] || passage.paragraphMark || passage.paragraphs;
    if (Array.isArray(pc) && pc.length > 0) {
      return pc.map((item, idx) => {
        let text = "";
        if (Array.isArray(item)) {
          text = item.join("\n\n").trim();
        } else if (typeof item === "object" && item !== null) {
          text = (item.text || item.content || "").trim();
        } else {
          text = String(item || "").trim();
        }
        const label = (pMarks && pMarks[idx] && typeof pMarks[idx] === "string" && pMarks[idx].length <= 2)
          ? pMarks[idx]
          : (item && item.label ? item.label : String.fromCharCode(65 + idx));
        return { label, text };
      }).filter(p => p.text);
    }
    if (Array.isArray(passage.paragraphs) && passage.paragraphs.length > 0) {
      const isLettersOnly = passage.paragraphs.every(x => typeof x === 'string' && x.trim().length <= 2);
      if (!isLettersOnly) {
        return passage.paragraphs.map((item, idx) => {
          if (typeof item === 'object') {
            return {
              label: item.label || item.id || String.fromCharCode(65 + idx),
              text: (item.text || item.content || '').trim()
            };
          }
          const str = String(item || '').trim();
          const m = str.match(/^([A-G])[\.\s]+(.*)$/s);
          if (m) {
            return { label: m[1], text: m[2].trim() };
          }
          return { label: String.fromCharCode(65 + idx), text: str };
        }).filter(p => p.text);
      }
    }
    if (passage.content || passage.text || passage.body) {
      const raw = String(passage.content || passage.text || passage.body).trim();
      const splitParas = raw.split(/\n\s*\n/);
      return splitParas.map((t, idx) => {
        const str = t.trim();
        const m = str.match(/^([A-G])[\.\s]+(.*)$/s);
        if (m) {
          return { label: m[1], text: m[2].trim() };
        }
        return { label: String.fromCharCode(65 + idx), text: str };
      }).filter(p => p.text);
    }
    return [];
  }

  function getRelevantParaIndicesForSection(paragraphs) {
    if (!testData || !targetQIds || !targetQIds.length) {
      return [];
    }
    const isHeading = targetGroup && String(targetGroup.type || '').toLowerCase().includes('heading');
    if (isHeading) {
      return paragraphs.map((_, i) => i);
    }

    const highlights = testData.evidenceHighlights || {};
    const normParas = paragraphs.map((pObj, i) => {
      let pureText = pObj.text || "";
      const paraLetter = pObj.label || String.fromCharCode(65 + i);
      pureText = pureText.replace(new RegExp('^\\s*' + paraLetter + '\\.?\\s*'), '');
      return normalizeForSearch(pureText);
    });

    const relevantIndices = new Set();
    targetQIds.forEach(q => {
      const evObj = highlights[String(q)] || highlights[q];
      if (!evObj) return;
      const rawText = typeof evObj === "object" ? evObj.text : evObj;
      if (!rawText || rawText.length < 5) return;
      const normEv = normalizeForSearch(rawText);

      let bestScore = 0;
      let bestIdx = -1;
      normParas.forEach((normPara, pIdx) => {
        const match = findBestMatchInPara(normPara, normEv);
        if (match && match.score > bestScore) {
          bestScore = match.score;
          bestIdx = pIdx;
        }
      });
      if (bestIdx !== -1) {
        relevantIndices.add(bestIdx);
      }
    });

    return Array.from(relevantIndices).sort((a, b) => a - b);
  }

  function renderPassage(passageNum) {
    if (!testData || !testData.passages) return;

    const pIndex = passageNum - 1;
    const passage = testData.passages[pIndex] || testData.passages[String(pIndex)] || testData.passages[passageNum] || {};

    const startQ = (practiceMode === "section" && targetQIds.length)
      ? targetQIds[0]
      : ((passageNum === 1) ? 1 : (passageNum === 2 ? 14 : 27));
    const endQ = (practiceMode === "section" && targetQIds.length)
      ? targetQIds[targetQIds.length - 1]
      : ((passageNum === 1) ? 13 : (passageNum === 2 ? 26 : 40));

    let html = `
      <div class="cr-passage-notice">
        You should spend about 20 minutes on Questions ${startQ}–${endQ}, which are based on ${passage.title ? escapeHtml(passage.title) : `Reading Passage ${passageNum}`} below.
      </div>
      <h2 class="cr-passage-title">${escapeHtml(passage.title || `Reading Passage ${passageNum}`)}</h2>
    `;

    const paragraphs = getPassageParagraphs(passage);

    // Filter relevant paragraphs when practicing a single section / question type
    let filteredParas = paragraphs.map((p, idx) => ({ pObj: p, origIndex: idx }));
    let relIndices = [];
    if (practiceMode === "section" && targetQIds && targetQIds.length) {
      relIndices = getRelevantParaIndicesForSection(paragraphs);
      if (relIndices.length > 0 && !showAllPassageParas) {
        filteredParas = relIndices.map(idx => ({ pObj: paragraphs[idx], origIndex: idx }));
      }
    }

    // Check if there are list-of-headings questions for this passage
    const headingGroup = (testData.questionGroups || []).find(g => {
      const p = Number(g.part) || Number(g.passage) || 1;
      return p === passageNum && String(g.type || '').toLowerCase().includes('heading');
    });

    if (practiceMode === "section" && relIndices.length > 0) {
      const shownLetters = relIndices.map(idx => paragraphs[idx].label || String.fromCharCode(65 + idx)).join(', ');
      html += `
        <div class="cr-section-para-info">
          <div class="cr-section-para-info-text">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
            <span>${!showAllPassageParas 
              ? `Showing only relevant paragraph${relIndices.length > 1 ? 's' : ''} (<strong>Paragraph ${shownLetters}</strong>) for Questions ${targetQIds[0]}–${targetQIds[targetQIds.length - 1]}`
              : `Showing all paragraphs (full passage mode)`}</span>
          </div>
          <button type="button" class="cr-toggle-paras-btn" onclick="window.crV2.toggleFullPassageParas()">
            ${!showAllPassageParas ? 'Show Full Passage' : `Show Only Relevant Paragraphs (${shownLetters})`}
          </button>
        </div>
      `;
    }

    html += `<div class="cr-passage-body" id="passageBody-${passageNum}">`;

    filteredParas.forEach(({ pObj, origIndex }) => {
      const paraLetter = pObj.label || String.fromCharCode(65 + origIndex); // A, B, C...
      const paraId = `para-${passageNum}-${paraLetter}`;

      // Dropzone for list of headings (matching Heading matching drag and drop.jpg)
      if (headingGroup) {
        const qId = getHeadingQuestionForParagraph(headingGroup, paraLetter, origIndex, startQ);
        if (qId) {
          const val = userAnswers[qId] || '';
          const headings = headingGroup.headings || [];
          const matchedHeading = headings.find(h => String(h.id || h.letter).toUpperCase() === String(val).toUpperCase());
          const matchedText = matchedHeading ? matchedHeading.text : '';

          html += `
            <div class="cr-heading-dropzone ${val ? 'filled' : ''}" id="headingDrop-${qId}" data-qid="${qId}" data-para="${paraLetter}" onclick="window.crV2.handleHeadingDropzoneClick(${qId})">
              <span class="cr-qnum-badge" id="badge-q-${qId}">${qId}</span>
              <span class="cr-heading-drop-text" id="headingDropText-${qId}">
                ${val ? `<strong class="cr-heading-val">${escapeHtml(val)}.</strong> ${escapeHtml(matchedText)}` : 'Drop heading here'}
              </span>
              ${val ? `<button type="button" class="cr-heading-remove-btn" onclick="window.crV2.clearHeadingChoice(${qId}, event)" title="Remove heading">✕</button>` : ''}
              <span class="cr-q-review-box" id="reviewBox-${qId}"></span>
            </div>
          `;
        }
      }

      let letterHtml = `<strong class="cr-para-letter">${paraLetter}.</strong> `;
      html += `<p id="${paraId}">${letterHtml}${escapeHtml(pObj.text)}</p>`;
    });

    html += `</div>`;
    passageCol.innerHTML = html;
    passageCol.scrollTop = 0;

    // Attach listeners for heading drag-and-drop
    if (headingGroup) {
      initHeadingDragAndDrop();
    }

    // If already submitted, apply evidence highlights
    if (isSubmitted) {
      applyEvidenceHighlightsOnPassage(passageNum);
    }
  }

  function renderQuestionsForPassage(passageNum) {
    if (!testData || !testData.questionGroups) return;

    let groupsToRender = testData.questionGroups;

    if (practiceMode === "section" && targetGroup) {
      groupsToRender = [targetGroup];
    } else {
      // In full mode or passage mode: render ONLY groups for this active passage
      groupsToRender = groupsToRender.filter(g => {
        const p = Number(g.part) || Number(g.passage) || 1;
        return p === passageNum;
      });
    }

    let html = "";
    groupsToRender.forEach((g, gIdx) => {
      html += renderQuestionGroup(g, gIdx);
    });

    questionsCol.innerHTML = html;
    questionsCol.scrollTop = 0;
    attachInputListeners();

    // If already submitted, populate review boxes on newly rendered questions
    if (isSubmitted) {
      renderReviewBoxesForPassage(passageNum);
    }
  }

  function renderQuestionGroup(g, gIdx) {
    const qIds = getGroupQuestionIds(g);
    if (!qIds.length) return '';

    const qStart = qIds[0];
    const qEnd = qIds[qIds.length - 1];
    const type = String(g.type || '').toLowerCase();

    const groupTitle = g.title ? g.title : `Questions ${qStart}–${qEnd}`;

    // "Practice this section only" pill (hidden for Practice Bank sets, which have no book/test)
    const isBankSet = urlParams.get("practice") === "bank" || urlParams.has("set") || urlParams.has("pracNumber") || (testData && testData.source === "Practice Bank");
    let sectionPillHtml = "";
    if (!isBankSet) {
      if (practiceMode === "section") {
        sectionPillHtml = `<span class="cr-section-practice-badge active-mode"><i class="bi bi-record-circle"></i> Section Practice Mode</span>`;
      } else {
        sectionPillHtml = `<a href="/cambridge-reading-v2?book=${bookParam}&test=${testParam}&section=${qStart}-${qEnd}" target="_blank" rel="noopener" class="cr-section-practice-badge" title="Practice Questions ${qStart}–${qEnd} in a new tab"><i class="bi bi-box-arrow-up-right"></i> Practice this section only</a>`;
      }
    }

    let html = `
      <div class="cr-q-group" id="group-${gIdx}">
        <div class="cr-group-head">
          <h3 class="cr-group-title">${escapeHtml(groupTitle)}</h3>
          ${sectionPillHtml}
        </div>
        ${g.instruction ? `<div class="cr-group-instruction">${formatInstruction(g.instruction)}</div>` : ''}
    `;

    // 1. Table Completion
    if (type.includes('table')) {
      html += renderTableCompletionGroup(g);
    }
    // 2. Flow-chart Completion
    else if (type.includes('flow')) {
      html += renderFlowChartGroup(g);
    }
    // 3. List of Headings Questions Overview
    else if (type.includes('heading')) {
      html += renderListOfHeadingsQuestionsGroup(g);
    }
    // 4. MCQ Two Choices (including multiple choice with ids pair)
    else if (type.includes('two-choice') || type.includes('multiple-choice-two') || (g.items && g.items.some(it => Array.isArray(it.ids) && it.ids.length >= 2))) {
      html += renderMcqTwoChoicesGroup(g);
    }
    // 5. Summary Completion with Word List or Blanks
    else if (type.includes('summary') || (type.includes('sentence') && g.options)) {
      html += renderSummaryWithWordListGroup(g, qStart, qEnd);
    }
    // 6. Note / Sentence / Generic Completion (Fill in the blanks)
    else if (type.includes('note') || type.includes('sentence') || type.includes('completion') || g.sentences || g.sections) {
      html += renderNoteCompletionGroup(g);
    }
    // 7. True / False / Not Given & Yes / No / Not Given
    else if (type.includes('true-false') || type.includes('yes-no') || type.includes('true_false') || type.includes('yes_no') || type.includes('true') || type.includes('yes')) {
      html += renderTfngGroup(g, type.includes('yes'));
    }
    // 8. MCQ One Choice
    else if (type.includes('mcq') || type.includes('one-choice') || type.includes('choice')) {
      html += renderMcqOneChoiceGroup(g);
    }
    // 9. Name / Feature Matching Matrix (e.g. Q22-26, feature-matching-drag-drop)
    else if (type.includes('name') || type.includes('peop') || type.includes('feature')) {
      html += renderNameMatchingMatrixGroup(g);
    }
    // 10. Matching Matrix (Sections A-G matching, e.g. Q14-17)
    else if (type.includes('matching') || type.includes('matrix')) {
      html += renderMatchingMatrixGroup(g);
    }
    // Fallback: Generic Question Items
    else {
      html += renderGenericQuestionsGroup(g);
    }

    html += `</div>`;
    return html;
  }

  // 1. Note Completion (Supporting both sections and flat sentences)
  function renderNoteCompletionGroup(g) {
    let out = '<div class="cr-notes-wrap" style="line-height:2.0; font-size:0.95rem;">';

    if (g.heading) {
      out += `<div style="font-family:'Sora',sans-serif; font-weight:800; color:var(--navy); margin-bottom:12px; font-size:1.05rem;">${sanitizeAllowedHtml(g.heading)}</div>`;
    }

    // Structured sections (e.g. Book 12 Test 1)
    if (Array.isArray(g.sections) && g.sections.length > 0) {
      g.sections.forEach(sec => {
        if (sec.subheading) {
          out += `<div style="font-family:'Sora',sans-serif; font-weight:700; color:var(--navy); margin:14px 0 6px; font-size:1.02rem;">${sanitizeAllowedHtml(sec.subheading)}</div>`;
        }
        (sec.points || []).forEach(pt => {
          let parsedLine = sanitizeAllowedHtml(pt).replace(/\[(?:blank|drop):(\d+)\]/g, (match, qId) => {
            const val = userAnswers[qId] || '';
            return `
              <span class="cr-inline-q" id="qItem-${qId}">
                <span class="cr-qnum-badge" id="badge-q-${qId}">${qId}</span>
                <input type="text" class="cr-blank-input" data-qid="${qId}" value="${escapeAttr(val)}" autocomplete="off" spellcheck="false" placeholder="">
                <span class="cr-q-review-box" id="reviewBox-${qId}"></span>
              </span>
            `;
          });
          out += `<div class="cr-note-line" style="margin-bottom:8px; line-height:1.9;">• ${parsedLine}</div>`;
        });
      });
    }
    // Flat sentences or paragraphs
    else {
      const sentences = g.sentences || g.paragraphs || [];
      sentences.forEach((line) => {
        const text = String(line || '').trim();
        if (!text) return;

        const isSubheading = text.length < 50 && !text.includes('[blank:') && !text.includes('[drop:') && !text.startsWith('•') && !text.startsWith('-');
        if (isSubheading) {
          out += `<div style="font-family:'Sora',sans-serif; font-weight:700; color:var(--navy); margin:12px 0 6px; font-size:1.02rem;">${sanitizeAllowedHtml(text)}</div>`;
          return;
        }

        let parsedLine = sanitizeAllowedHtml(text).replace(/\[(?:blank|drop):(\d+)\]/g, (match, qId) => {
          const val = userAnswers[qId] || '';
          return `
            <span class="cr-inline-q" id="qItem-${qId}">
              <span class="cr-qnum-badge" id="badge-q-${qId}">${qId}</span>
              <input type="text" class="cr-blank-input" data-qid="${qId}" value="${escapeAttr(val)}" autocomplete="off" spellcheck="false" placeholder="">
              <span class="cr-q-review-box" id="reviewBox-${qId}"></span>
            </span>
          `;
        });

        out += `<div class="cr-note-line" style="margin-bottom:8px; line-height:1.9;">• ${parsedLine}</div>`;
      });
    }

    out += '</div>';
    return out;
  }

  // 2. Table Completion (e.g. Book 12 Test 2 Q27-31, Book 13 Test 1 Q1-7)
  function renderTableCompletionGroup(g) {
    const table = g.tableData;
    if (!table || !table.rows) return renderNoteCompletionGroup(g);

    let out = '<div class="cr-table-completion-wrap">';
    if (table.caption) {
      out += `<div class="cr-table-caption">${sanitizeAllowedHtml(table.caption)}</div>`;
    }

    out += '<div class="cr-matrix-table-wrap" style="margin-top:0;"><table class="cr-matrix-table"><thead><tr>';
    (table.headers || []).forEach(h => {
      out += `<th style="text-align:left; padding:10px 14px; font-size:14px; background:#f8fafc; font-weight:700; color:var(--navy);">${sanitizeAllowedHtml(h)}</th>`;
    });
    out += '</tr></thead><tbody>';

    (table.rows || []).forEach(row => {
      out += '<tr>';
      (row || []).forEach(cell => {
        let cellHtml = sanitizeAllowedHtml(String(cell || ''));
        cellHtml = cellHtml.replace(/\[(?:blank|drop):(\d+)\]/g, (match, qId) => {
          const val = userAnswers[qId] || '';
          return `
            <span class="cr-inline-q" id="qItem-${qId}">
              <span class="cr-qnum-badge" id="badge-q-${qId}">${qId}</span>
              <input type="text" class="cr-blank-input" data-qid="${qId}" value="${escapeAttr(val)}" autocomplete="off" spellcheck="false" placeholder="">
              <span class="cr-q-review-box" id="reviewBox-${qId}"></span>
            </span>
          `;
        });
        out += `<td style="padding:12px 14px; font-size:14px; vertical-align:top; line-height:1.9;">${cellHtml}</td>`;
      });
      out += '</tr>';
    });

    out += '</tbody></table></div></div>';
    return out;
  }

  // 3. Flow-chart Completion (e.g. Book 21 Test 4 Q8-10)
  function renderFlowChartGroup(g) {
    let out = '<div class="cr-flowchart-wrap">';
    if (g.subheading) {
      out += `<div style="font-family:'Sora',sans-serif; font-weight:700; color:var(--navy); font-size:1rem; margin-bottom:8px;">${sanitizeAllowedHtml(g.subheading)}</div>`;
    }

    (g.steps || []).forEach((st, idx) => {
      let stepHtml = sanitizeAllowedHtml(String(st || '')).replace(/\[(?:blank|drop):(\d+)\]/g, (match, qId) => {
        const val = userAnswers[qId] || '';
        return `
          <span class="cr-inline-q" id="qItem-${qId}">
            <span class="cr-qnum-badge" id="badge-q-${qId}">${qId}</span>
            <input type="text" class="cr-blank-input" data-qid="${qId}" value="${escapeAttr(val)}" autocomplete="off" spellcheck="false" placeholder="">
            <span class="cr-q-review-box" id="reviewBox-${qId}"></span>
          </span>
        `;
      });

      out += `
        <div class="cr-flowchart-step">
          <strong style="color:var(--blue); margin-right:8px; font-family:'Sora',sans-serif;">Step ${idx + 1}:</strong>
          <span style="line-height:1.9;">${stepHtml}</span>
        </div>
      `;

      if (idx < (g.steps || []).length - 1) {
        out += '<div style="text-align:center; color:var(--blue); font-size:18px; font-weight:bold; margin: -4px 0;">↓</div>';
      }
    });

    out += '</div>';
    return out;
  }

  // 4. Summary Completion with Word Bank or Drag-Drop (matching Summary completation.jpg)
  function renderSummaryWithWordListGroup(g, qStart, qEnd) {
    let out = '<div class="cr-summary-wrap" style="line-height:2.1; font-size:0.96rem;">';

    if (g.summaryTitle) {
      out += `<h4 style="font-family:'Sora',sans-serif; font-weight:800; color:var(--navy); margin-bottom:12px; font-size:1.05rem;">${sanitizeAllowedHtml(g.summaryTitle)}</h4>`;
    }

    // Build wordOptions from g.wordList OR g.options
    let wordOptions = [];
    if (Array.isArray(g.wordList) && g.wordList.length) {
      wordOptions = g.wordList.map(item => {
        const str = String(item).trim();
        const m = str.match(/^([A-Z])[\.\s]+(.*)$/);
        if (m) {
          return { letter: m[1], text: m[2].trim() };
        }
        return { letter: str.charAt(0), text: str.slice(1).trim() };
      });
    } else if (Array.isArray(g.options) && g.options.length) {
      wordOptions = g.options;
    } else {
      wordOptions = c21Test1SummaryOptions;
    }

    const sentences = g.paragraphs || g.sentences || [];

    sentences.forEach(line => {
      const text = String(line || '').trim();
      if (!text) return;

      const isSubheading = text.length < 50 && !text.includes('[blank:') && !text.includes('[drop:') && !text.startsWith('•') && !text.startsWith('-');
      if (isSubheading) {
        out += `<div style="font-family:'Sora',sans-serif; font-weight:700; color:var(--navy); margin:12px 0 6px; font-size:1.02rem;">${sanitizeAllowedHtml(text)}</div>`;
        return;
      }

      let parsedLine = sanitizeAllowedHtml(text);
      parsedLine = parsedLine.replace(/\[(?:blank|drop):(\d+)\]/g, (match, qId) => {
        const uLetter = (userAnswers[qId] || '').toUpperCase();
        const matchedOpt = wordOptions.find(o => o.letter === uLetter);
        const optText = matchedOpt ? `${matchedOpt.letter}. ${matchedOpt.text}` : '';

        return `
          <span class="cr-inline-q" id="qItem-${qId}">
            <div class="cr-drop-blank ${uLetter ? 'filled' : ''}" id="dropBlank-${qId}" data-qid="${qId}" onclick="window.crV2.clearWordChoice(${qId})">
              <span class="cr-qnum-badge" id="badge-q-${qId}">${qId}</span>
              <span class="cr-blank-text" id="blankText-${qId}">${optText || 'Drop answer here'}</span>
              ${uLetter ? `<button type="button" class="cr-clear-btn" onclick="window.crV2.clearWordChoice(${qId}, event)">✕</button>` : ''}
            </div>
            <span class="cr-q-review-box" id="reviewBox-${qId}"></span>
          </span>
        `;
      });

      out += `<p style="margin-bottom:12px;">${parsedLine}</p>`;
    });

    // Word Bank Card (matching Summary completation.jpg)
    if (wordOptions.length > 0) {
      out += `
        <div class="cr-word-bank-card">
          <div class="cr-word-bank-title" style="font-style:italic; font-size:13px; color:#64748b; margin-bottom:10px;">Drag and drop an option to fill in each blank.</div>
          <div class="cr-word-chips-grid">
      `;

      wordOptions.forEach(opt => {
        const letter = opt.letter || opt.key || opt.id || '';
        const labelText = opt.text || opt.name || opt.label || opt;
        out += `
          <div class="cr-word-chip" draggable="true" data-letter="${letter}" data-text="${escapeAttr(labelText)}" onclick="window.crV2.selectWordChip('${letter}', this)">
            <strong style="color:var(--blue);">${letter}.</strong> ${escapeHtml(labelText)}
          </div>
        `;
      });

      out += '</div></div>';
    }

    out += '</div>';
    return out;
  }

  // 5. List of Headings in Right Column (matching Heading matching drag and drop.jpg)
  function renderListOfHeadingsQuestionsGroup(g) {
    const headings = g.headings || [];
    const hasDragTextInInstruction = (g.instruction || '').toLowerCase().includes('drag and drop');
    let out = `
      <div class="cr-headings-group-wrap">
        ${!hasDragTextInInstruction ? `
          <div class="cr-heading-drag-instruction">
            Drag and drop the headings to the correct paragraphs in the passage on the left.
          </div>
        ` : ''}

        <div class="cr-headings-draggable-cards">
    `;

    headings.forEach(h => {
      const hid = h.id || h.letter || '';
      const isUsed = Object.values(userAnswers).includes(hid);
      out += `
        <div class="cr-heading-card ${isUsed ? 'used' : ''}" draggable="true" data-heading-id="${escapeAttr(hid)}" data-heading-text="${escapeAttr(h.text || '')}" id="headingCard-${hid}" onclick="window.crV2.selectHeadingCard('${hid}', this)">
          <span class="cr-heading-card-roman">${escapeHtml(hid)}.</span>
          <span class="cr-heading-card-text">${escapeHtml(h.text || '')}</span>
        </div>
      `;
    });

    out += `
        </div>
      </div>
    `;

    return out;
  }

  function renderTfngGroup(g, isYesNo) {
    let out = '<div class="cr-tfng-wrap">';
    const items = g.items || [];
    const optLabels = isYesNo
      ? [ { letter: "A", val: "YES", label: "YES" }, { letter: "B", val: "NO", label: "NO" }, { letter: "C", val: "NOT GIVEN", label: "NOT GIVEN" } ]
      : [ { letter: "A", val: "TRUE", label: "TRUE" }, { letter: "B", val: "FALSE", label: "FALSE" }, { letter: "C", val: "NOT GIVEN", label: "NOT GIVEN" } ];

    items.forEach(it => {
      const qId = it.id || it.questionNumber || it.qNo;
      const uVal = (userAnswers[qId] || "").toUpperCase();

      out += `
        <div class="cr-q-item" id="qItem-${qId}">
          <div class="cr-q-prompt-row">
            <span class="cr-qnum-badge" id="badge-q-${qId}">${qId}</span>
            <div class="cr-q-text">${escapeHtml(it.text || "")}</div>
          </div>
          <div class="cr-options-col">
      `;

      optLabels.forEach(opt => {
        const checked = (uVal === opt.val) ? "checked" : "";
        out += `
          <label class="cr-option-label">
            <input type="radio" name="cr_q_${qId}" data-qid="${qId}" value="${opt.val}" ${checked}>
            <span class="cr-opt-letter">${opt.letter}</span>
            <span>${opt.label}</span>
          </label>
        `;
      });

      out += `
          </div>
          <div class="cr-q-review-box" id="reviewBox-${qId}"></div>
        </div>
      `;
    });

    out += '</div>';
    return out;
  }

  // 4. MCQ One Choice
  function renderMcqOneChoiceGroup(g) {
    let out = '<div class="cr-mcq-wrap">';
    const items = g.items || [];

    items.forEach(it => {
      const qId = it.id || it.questionNumber || it.qNo;
      const uVal = (userAnswers[qId] || "").toUpperCase();
      const options = it.options || [];

      out += `
        <div class="cr-q-item" id="qItem-${qId}">
          <div class="cr-q-prompt-row">
            <span class="cr-qnum-badge" id="badge-q-${qId}">${qId}</span>
            <div class="cr-q-text">${escapeHtml(it.text || "")}</div>
          </div>
          <div class="cr-options-col">
      `;

      options.forEach(opt => {
        const letter = (opt.letter || "").toUpperCase();
        const checked = (uVal === letter) ? "checked" : "";
        out += `
          <label class="cr-option-label">
            <input type="radio" name="cr_q_${qId}" data-qid="${qId}" value="${letter}" ${checked}>
            <span class="cr-opt-letter">${letter}</span>
            <span>${escapeHtml(opt.text || "")}</span>
          </label>
        `;
      });

      out += `
          </div>
          <div class="cr-q-review-box" id="reviewBox-${qId}"></div>
        </div>
      `;
    });

    out += '</div>';
    return out;
  }

  // 5. MCQ Two Choices (matching Two choice.jpg)
  function renderMcqTwoChoicesGroup(g) {
    let out = '<div class="cr-mcq-wrap">';

    // If g has an array of items (e.g. Book 14 Test 1 where items have ids: [19, 20])
    if (Array.isArray(g.items) && g.items.length > 0 && g.items.some(it => Array.isArray(it.ids))) {
      g.items.forEach(it => {
        const qIds = it.ids || [it.id];
        const q1 = qIds[0];
        const q2 = qIds[1] || (q1 + 1);
        const options = it.options || [];
        const promptText = it.text || it.question || g.prompt || 'Choose TWO letters.';

        out += `
          <div class="cr-q-item" id="qItem-${q1}" style="margin-bottom:20px;">
            <div class="cr-q-prompt-row">
              <div style="display:inline-flex; gap:6px; align-items:center;">
                <span class="cr-qnum-badge" id="badge-q-${q1}">${q1}</span>
                <span class="cr-qnum-badge" id="badge-q-${q2}">${q2}</span>
              </div>
              <div class="cr-q-text">${sanitizeAllowedHtml(promptText)}</div>
            </div>
            <div class="cr-options-col">
        `;

        options.forEach(opt => {
          const letter = (opt.letter || opt.id || '').toUpperCase();
          const uAnsList = [userAnswers[q1], userAnswers[q2]].map(x => String(x || '').toUpperCase());
          const checked = uAnsList.includes(letter) ? 'checked' : '';

          out += `
            <label class="cr-option-label">
              <input type="checkbox" data-qid-pair="${q1},${q2}" value="${letter}" ${checked}>
              <span class="cr-opt-letter">${letter}</span>
              <span>${sanitizeAllowedHtml(opt.text || opt.label || '')}</span>
            </label>
          `;
        });

        out += `
            </div>
            <div class="cr-q-review-box" id="reviewBox-${q1}"></div>
            <div class="cr-q-review-box" id="reviewBox-${q2}"></div>
          </div>
        `;
      });
    } else {
      const qIds = g.ids || g.questionIds || getGroupQuestionIds(g);
      const q1 = qIds[0];
      const q2 = qIds[1] || (q1 + 1);
      const options = g.options || [];
      const promptText = g.prompt || g.question || g.title || 'Choose TWO letters.';

      out += `
        <div class="cr-q-item" id="qItem-${q1}">
          <div class="cr-q-prompt-row">
            <div style="display:inline-flex; gap:6px; align-items:center;">
              <span class="cr-qnum-badge" id="badge-q-${q1}">${q1}</span>
              <span class="cr-qnum-badge" id="badge-q-${q2}">${q2}</span>
            </div>
            <div class="cr-q-text">${sanitizeAllowedHtml(promptText)}</div>
          </div>
          <div class="cr-options-col">
      `;

      options.forEach(opt => {
        const letter = (opt.letter || opt.id || '').toUpperCase();
        const uAnsList = [userAnswers[q1], userAnswers[q2]].map(x => String(x || '').toUpperCase());
        const checked = uAnsList.includes(letter) ? 'checked' : '';

        out += `
          <label class="cr-option-label">
            <input type="checkbox" data-qid-pair="${q1},${q2}" value="${letter}" ${checked}>
            <span class="cr-opt-letter">${letter}</span>
            <span>${sanitizeAllowedHtml(opt.text || opt.label || '')}</span>
          </label>
        `;
      });

      out += `
          </div>
          <div class="cr-q-review-box" id="reviewBox-${q1}"></div>
          <div class="cr-q-review-box" id="reviewBox-${q2}"></div>
        </div>
      `;
    }

    out += '</div>';
    return out;
  }

  // 6. Name / Feature Matching Matrix (e.g. Q22-26, Q4-9, feature-matching-drag-drop)
  function renderNameMatchingMatrixGroup(g) {
    let out = '<div class="cr-name-matrix-wrap">';
    
    // Resolve categories/people list from all possible keys
    const rawList = g.categories || g.peopleList || g.researchers || (g.statements || g.items ? g.features : null) || g.people || [];
    let categories = [];

    if (Array.isArray(rawList) && rawList.length > 0) {
      categories = rawList.map((item, idx) => {
        if (typeof item === 'string') {
          const letter = (g.columns && g.columns[idx]) ? g.columns[idx] : String.fromCharCode(65 + idx);
          return { letter, name: item };
        }
        const letter = item.letter || item.id || item.key || ((g.columns && g.columns[idx]) ? g.columns[idx] : String.fromCharCode(65 + idx));
        const name = item.name || item.text || item.label || item.title || '';
        return { letter, name };
      });
    } else if (Array.isArray(g.columns) && g.columns.length > 0) {
      categories = g.columns.map((col, idx) => {
        if (typeof col === 'object') {
          return {
            letter: col.letter || col.id || String.fromCharCode(65 + idx),
            name: col.name || col.text || ''
          };
        }
        return { letter: String(col), name: '' };
      });
    } else if (Array.isArray(g.options) && g.options.length > 0) {
      categories = g.options.map((opt, idx) => {
        if (typeof opt === 'object') {
          return {
            letter: opt.letter || opt.id || String.fromCharCode(65 + idx),
            name: opt.name || opt.text || ''
          };
        }
        return { letter: String(opt), name: '' };
      });
    }

    let statements = g.statements || g.items || [];
    if (!statements.length) {
      if (g.features && rawList !== g.features) {
        statements = g.features;
      } else if (g.questions) {
        statements = g.questions;
      }
    }
    const hasNames = categories.some(c => c.name && c.name.trim().length > 0);
    const boxTitle = (g.peopleList || (g.instruction || '').toLowerCase().includes('people') || (g.instruction || '').toLowerCase().includes('person'))
      ? 'List of People:'
      : ((g.features || (g.instruction || '').toLowerCase().includes('feature')) ? 'List of Features:' : 'Researchers / Features:');

    if (hasNames) {
      out += `
        <div class="cr-categories-box" style="margin-bottom:14px; background:#ffffff; border:1px solid var(--line); border-radius:8px; padding:10px 14px;">
          <strong style="color:var(--navy); font-size:0.86rem; display:block; margin-bottom:6px;">${boxTitle}</strong>
          <div style="display:flex; flex-wrap:wrap; gap:12px; font-size:0.86rem;">
      `;
      categories.forEach(cat => {
        out += `<div><strong style="color:var(--blue);">${escapeHtml(cat.letter)}.</strong> ${escapeHtml(cat.name || '')}</div>`;
      });
      out += `</div></div>`;
    }

    out += `
      <div class="cr-matrix-table-wrap">
        <table class="cr-matrix-table">
          <thead>
            <tr>
              <th style="width:40px;">#</th>
              <th style="text-align:left;">Statements</th>
    `;
    categories.forEach(cat => {
      out += `<th style="width:40px;">${escapeHtml(cat.letter)}</th>`;
    });
    out += `</tr></thead><tbody>`;

    statements.forEach(st => {
      const qId = st.id || st.questionNumber || st.qNo;
      const uVal = (userAnswers[qId] || "").toUpperCase();

      out += `
        <tr id="qRow-${qId}">
          <td><span class="cr-qnum-badge" id="badge-q-${qId}">${qId}</span></td>
          <td class="cr-statement-cell">
            ${escapeHtml(st.text || "")}
            <div class="cr-q-review-box" id="reviewBox-${qId}"></div>
          </td>
      `;

      categories.forEach(cat => {
        const checked = (uVal === cat.letter) ? "checked" : "";
        out += `
          <td>
            <input type="radio" name="cr_q_${qId}" data-qid="${qId}" value="${escapeAttr(cat.letter)}" ${checked}>
          </td>
        `;
      });

      out += `</tr>`;
    });

    out += `</tbody></table></div></div>`;
    return out;
  }

  // 7. Matching Matrix (Sections A-G, or Options A-E)
  function renderMatchingMatrixGroup(g) {
    let out = '<div class="cr-matching-matrix-wrap">';
    
    // Resolve raw list of categories/options if available
    const rawList = g.peopleList || g.categories || g.researchers || g.features || [];
    let categories = [];

    if (Array.isArray(rawList) && rawList.length > 0) {
      categories = rawList.map((item, idx) => {
        if (typeof item === 'string') {
          const letter = (g.columns && g.columns[idx]) ? g.columns[idx] : String.fromCharCode(65 + idx);
          return { letter, name: item };
        }
        const letter = item.letter || item.id || item.key || ((g.columns && g.columns[idx]) ? g.columns[idx] : String.fromCharCode(65 + idx));
        const name = item.name || item.text || item.label || item.title || '';
        return { letter, name };
      });
    }

    let options = [];
    if (categories.length > 0) {
      options = categories.map(c => c.letter);
    } else if (Array.isArray(g.columns) && g.columns.length > 0) {
      options = g.columns.map(c => typeof c === 'object' ? (c.letter || c.name) : String(c));
    } else if (Array.isArray(g.options) && g.options.length > 0) {
      options = g.options.map(o => typeof o === 'object' ? (o.letter || o.id || o.name) : String(o));
    } else {
      options = ["A", "B", "C", "D", "E", "F", "G"];
    }

    const items = g.items || g.statements || [];

    // If we have categories with descriptions, show the overview box
    if (categories.length > 0 && categories.some(c => c.name)) {
      const boxTitle = (g.peopleList || (g.instruction || '').toLowerCase().includes('people') || (g.instruction || '').toLowerCase().includes('person'))
        ? 'List of People:'
        : 'List of Options:';

      out += `
        <div class="cr-categories-box" style="margin-bottom:14px; background:#ffffff; border:1px solid var(--line); border-radius:8px; padding:10px 14px;">
          <strong style="color:var(--navy); font-size:0.86rem; display:block; margin-bottom:6px;">${boxTitle}</strong>
          <div style="display:flex; flex-wrap:wrap; gap:12px; font-size:0.86rem;">
      `;
      categories.forEach(cat => {
        out += `<div><strong style="color:var(--blue);">${escapeHtml(cat.letter)}.</strong> ${escapeHtml(cat.name || '')}</div>`;
      });
      out += `</div></div>`;
    }

    out += `
      <div class="cr-matrix-table-wrap">
        <table class="cr-matrix-table">
          <thead>
            <tr>
              <th style="width:40px;">#</th>
              <th style="text-align:left;">Information</th>
    `;
    options.forEach(opt => {
      out += `<th style="width:40px;">${escapeHtml(opt)}</th>`;
    });
    out += `</tr></thead><tbody>`;

    items.forEach(it => {
      const qId = it.id || it.questionNumber || it.qNo;
      const uVal = (userAnswers[qId] || "").toUpperCase();

      out += `
        <tr id="qRow-${qId}">
          <td><span class="cr-qnum-badge" id="badge-q-${qId}">${qId}</span></td>
          <td class="cr-statement-cell">
            ${escapeHtml(it.text || "")}
            <div class="cr-q-review-box" id="reviewBox-${qId}"></div>
          </td>
      `;

      options.forEach(opt => {
        const checked = (uVal === opt) ? "checked" : "";
        out += `
          <td>
            <input type="radio" name="cr_q_${qId}" data-qid="${qId}" value="${escapeAttr(opt)}" ${checked}>
          </td>
        `;
      });

      out += `</tr>`;
    });

    out += `</tbody></table></div></div>`;
    return out;
  }

  function renderGenericQuestionsGroup(g) {
    if (g.sentences || g.sections) return renderNoteCompletionGroup(g);
    let out = '<div class="cr-generic-wrap">';
    const items = g.items || g.questions || g.statements || g.features || [];
    items.forEach(it => {
      const qId = it.id || it.questionNumber || it.qNo;
      const val = userAnswers[qId] || "";
      out += `
        <div class="cr-q-item" id="qItem-${qId}">
          <div class="cr-q-prompt-row">
            <span class="cr-qnum-badge" id="badge-q-${qId}">${qId}</span>
            <div class="cr-q-text">${escapeHtml(it.text || "")}</div>
          </div>
          <div style="margin-top:8px;">
            <input type="text" class="cr-blank-input" data-qid="${qId}" value="${escapeAttr(val)}" style="width:100%; max-width:280px;" placeholder="">
          </div>
          <div class="cr-q-review-box" id="reviewBox-${qId}"></div>
        </div>
      `;
    });
    out += '</div>';
    return out;
  }

  // -------------------------------------------------------------
  // 5. Input Listeners & State Updates
  // -------------------------------------------------------------
  function attachInputListeners() {
    // Text inputs
    questionsCol.querySelectorAll("input.cr-blank-input").forEach(input => {
      input.addEventListener("input", e => {
        const qId = Number(e.target.dataset.qid);
        userAnswers[qId] = e.target.value.trim();
        updateButtonStatus(qId);
      });
      input.addEventListener("focus", e => {
        const qId = Number(e.target.dataset.qid);
        setFocusedQuestion(qId);
      });
    });

    // Radio inputs
    questionsCol.querySelectorAll("input[type='radio']").forEach(radio => {
      radio.addEventListener("change", e => {
        const qId = Number(e.target.dataset.qid);
        userAnswers[qId] = e.target.value;
        updateButtonStatus(qId);
        setFocusedQuestion(qId);
      });
    });

    // Checkbox pairs (two-choices)
    questionsCol.querySelectorAll("input[type='checkbox'][data-qid-pair]").forEach(cb => {
      cb.addEventListener("change", e => {
        const [q1, q2] = e.target.dataset.qidPair.split(",").map(Number);
        const parent = e.target.closest(".cr-options-col");
        const checkedList = Array.from(parent.querySelectorAll("input[type='checkbox']:checked")).map(x => x.value);

        if (checkedList.length > 2) {
          e.target.checked = false;
          return;
        }

        userAnswers[q1] = checkedList[0] || "";
        userAnswers[q2] = checkedList[1] || "";
        updateButtonStatus(q1);
        updateButtonStatus(q2);
        setFocusedQuestion(q1);
      });
    });

    // Word Bank dropzones
    initWordBankDragAndDrop();

    // List of Headings dropzones & cards
    initHeadingDragAndDrop();
  }

  let selectedWordLetter = null;
  function selectWordChip(letter, el) {
    selectedWordLetter = letter;
    document.querySelectorAll(".cr-word-chip").forEach(c => c.classList.remove("selected"));
    if (el) el.classList.add("selected");
  }

  function clearWordChoice(qId, e) {
    if (e) e.stopPropagation();
    if (isSubmitted) return;
    if (selectedWordLetter) {
      userAnswers[qId] = selectedWordLetter;
      const blankEl = document.getElementById(`dropBlank-${qId}`);
      const blankTextEl = document.getElementById(`blankText-${qId}`);
      if (blankEl) blankEl.classList.add('filled');
      if (blankTextEl) {
        const chip = questionsCol ? questionsCol.querySelector(`.cr-word-chip[data-letter="${selectedWordLetter}"]`) : null;
        const chipText = chip ? chip.textContent.trim() : '';
        const fallbackOpt = c21Test1SummaryOptions.find(o => o.letter === selectedWordLetter);
        blankTextEl.textContent = chipText || (fallbackOpt ? `${fallbackOpt.letter}. ${fallbackOpt.text}` : selectedWordLetter);
      }
      updateButtonStatus(qId);
      setFocusedQuestion(qId);
      selectedWordLetter = null;
      if (questionsCol) questionsCol.querySelectorAll('.cr-word-chip').forEach(c => c.classList.remove('selected'));
    } else {
      delete userAnswers[qId];
      const blankEl = document.getElementById(`dropBlank-${qId}`);
      const blankTextEl = document.getElementById(`blankText-${qId}`);
      if (blankEl) blankEl.classList.remove('filled');
      if (blankTextEl) blankTextEl.textContent = 'Drop answer here';
      updateButtonStatus(qId);
    }
  }

  function initWordBankDragAndDrop() {
    if (!questionsCol) return;
    const chips = questionsCol.querySelectorAll('.cr-word-chip');
    const dropBlanks = questionsCol.querySelectorAll('.cr-drop-blank');

    chips.forEach(chip => {
      chip.addEventListener('dragstart', e => {
        e.dataTransfer.setData('text/plain', chip.dataset.letter);
      });
    });

    dropBlanks.forEach(blank => {
      blank.addEventListener('dragover', e => {
        e.preventDefault();
        blank.classList.add('dragover');
      });
      blank.addEventListener('dragleave', () => {
        blank.classList.remove('dragover');
      });
      blank.addEventListener('drop', e => {
        e.preventDefault();
        blank.classList.remove('dragover');
        const letter = e.dataTransfer.getData('text/plain');
        if (!letter) return;

        const qId = Number(blank.dataset.qid);
        userAnswers[qId] = letter.toUpperCase();
        blank.classList.add('filled');

        const textEl = document.getElementById(`blankText-${qId}`);
        if (textEl) {
          const chip = questionsCol.querySelector(`.cr-word-chip[data-letter="${letter}"]`);
          const chipText = chip ? chip.textContent.trim() : '';
          const fallbackOpt = c21Test1SummaryOptions.find(o => o.letter === letter);
          textEl.textContent = chipText || (fallbackOpt ? `${fallbackOpt.letter}. ${fallbackOpt.text}` : letter);
        }

        updateButtonStatus(qId);
        setFocusedQuestion(qId);
      });
    });
  }

  // List of Headings Drag & Drop (matching Heading matching drag and drop.jpg)
  let selectedHeadingId = null;
  let hasInitHeadingDelegation = false;
  let currentDraggedHeading = null;

  function initHeadingDragAndDrop() {
    if (!hasInitHeadingDelegation) {
      hasInitHeadingDelegation = true;

      // 1. Drag Start on Heading Card
      document.addEventListener('dragstart', (e) => {
        const card = e.target.closest('.cr-heading-card');
        if (card) {
          const hid = card.dataset.headingId;
          const text = card.dataset.headingText || '';
          currentDraggedHeading = { hid, text };
          try {
            e.dataTransfer.setData('text/plain', hid);
            e.dataTransfer.effectAllowed = 'copyMove';
          } catch (err) {}
          card.classList.add('dragging');
        }
      });

      // 2. Drag End
      document.addEventListener('dragend', (e) => {
        const card = e.target.closest('.cr-heading-card');
        if (card) card.classList.remove('dragging');
        document.querySelectorAll('.cr-heading-dropzone').forEach(dz => dz.classList.remove('dragover'));
        currentDraggedHeading = null;
      });

      // 3. Drag Over Dropzone
      document.addEventListener('dragover', (e) => {
        const dropzone = e.target.closest('.cr-heading-dropzone');
        if (dropzone) {
          e.preventDefault();
          if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
          dropzone.classList.add('dragover');
        }
      });

      // 4. Drag Leave Dropzone
      document.addEventListener('dragleave', (e) => {
        const dropzone = e.target.closest('.cr-heading-dropzone');
        if (dropzone && (!e.relatedTarget || !dropzone.contains(e.relatedTarget))) {
          dropzone.classList.remove('dragover');
        }
      });

      // 5. Drop onto Dropzone
      document.addEventListener('drop', (e) => {
        const dropzone = e.target.closest('.cr-heading-dropzone');
        if (dropzone) {
          e.preventDefault();
          e.stopPropagation();
          dropzone.classList.remove('dragover');

          let hid = currentDraggedHeading ? currentDraggedHeading.hid : null;
          let text = currentDraggedHeading ? currentDraggedHeading.text : '';

          if (!hid && e.dataTransfer) {
            try {
              const raw = e.dataTransfer.getData('text/plain');
              if (raw) {
                if (raw.startsWith('{')) {
                  const p = JSON.parse(raw);
                  hid = p.hid;
                  text = p.text;
                } else {
                  hid = raw;
                }
              }
            } catch (err) {}
          }

          if (!hid) return;

          const qId = Number(dropzone.dataset.qid);
          if (!qId) return;

          assignHeadingToQuestion(qId, hid, text);
          currentDraggedHeading = null;
        }
      });
    }

    updateHeadingCardsState();
  }

  function assignHeadingToQuestion(qId, hid, text) {
    if (isSubmitted || !qId || !hid) return;

    // Resolve heading text if not present
    if (!text) {
      const hGroup = getHeadingGroupForPassage(activePassage);
      if (hGroup && hGroup.headings) {
        const found = hGroup.headings.find(h => String(h.id || h.letter).toUpperCase() === String(hid).toUpperCase());
        if (found) text = found.text;
      }
    }
    if (!text && questionsCol) {
      const card = questionsCol.querySelector(`.cr-heading-card[data-heading-id="${hid}"]`);
      if (card) text = card.dataset.headingText || '';
    }

    // Deduplicate: If this heading was assigned to another question, clear that dropzone
    Object.keys(userAnswers).forEach(existingQ => {
      const eq = Number(existingQ);
      if (eq !== qId && userAnswers[eq] === hid) {
        clearHeadingChoice(eq);
      }
    });

    userAnswers[qId] = hid;

    const dropzone = document.getElementById(`headingDrop-${qId}`);
    if (dropzone) {
      dropzone.classList.add('filled');
      const textEl = document.getElementById(`headingDropText-${qId}`);
      if (textEl) {
        textEl.innerHTML = `<strong class="cr-heading-val">${escapeHtml(hid)}.</strong> ${escapeHtml(text || '')}`;
      }
      let rmBtn = dropzone.querySelector('.cr-heading-remove-btn');
      if (!rmBtn) {
        rmBtn = document.createElement('button');
        rmBtn.type = 'button';
        rmBtn.className = 'cr-heading-remove-btn';
        rmBtn.title = 'Remove heading';
        rmBtn.innerHTML = '✕';
        rmBtn.onclick = (e) => clearHeadingChoice(qId, e);
        dropzone.appendChild(rmBtn);
      }
    }

    updateHeadingCardsState();
    updateButtonStatus(qId);
    setFocusedQuestion(qId);
    selectedHeadingId = null;
    if (questionsCol) {
      questionsCol.querySelectorAll('.cr-heading-card').forEach(c => c.classList.remove('selected'));
    }
  }

  function clearHeadingChoice(qId, e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (isSubmitted || !qId) return;
    delete userAnswers[qId];

    const dropzone = document.getElementById(`headingDrop-${qId}`);
    if (dropzone) {
      dropzone.classList.remove('filled');
      const textEl = document.getElementById(`headingDropText-${qId}`);
      if (textEl) textEl.textContent = 'Drop heading here';
      const rmBtn = dropzone.querySelector('.cr-heading-remove-btn');
      if (rmBtn) rmBtn.remove();
    }

    updateHeadingCardsState();
    updateButtonStatus(qId);
  }

  function selectHeadingCard(hid, el) {
    if (isSubmitted) return;
    if (selectedHeadingId === hid) {
      selectedHeadingId = null;
      if (questionsCol) {
        questionsCol.querySelectorAll('.cr-heading-card').forEach(c => c.classList.remove('selected'));
      }
      return;
    }
    selectedHeadingId = hid;
    if (questionsCol) {
      questionsCol.querySelectorAll('.cr-heading-card').forEach(c => c.classList.remove('selected'));
    }
    if (el) el.classList.add('selected');
  }

  function handleHeadingDropzoneClick(qId) {
    if (isSubmitted || !qId) return;
    if (selectedHeadingId) {
      const card = questionsCol ? questionsCol.querySelector(`.cr-heading-card[data-heading-id="${selectedHeadingId}"]`) : null;
      const text = card ? card.dataset.headingText : '';
      assignHeadingToQuestion(qId, selectedHeadingId, text);
    }
  }

  function updateHeadingCardsState() {
    if (!questionsCol) return;
    const answeredHeadingIds = Object.values(userAnswers);
    questionsCol.querySelectorAll('.cr-heading-card').forEach(card => {
      const hid = card.dataset.headingId;
      card.classList.toggle('used', answeredHeadingIds.includes(hid));
    });
  }

  function renderBottomNavigation() {
    for (let p = 1; p <= 3; p++) {
      const card = document.getElementById(`bottomPassageCard-${p}`);
      const numsContainer = document.getElementById(`passageNums-${p}`);
      if (!numsContainer || !card) continue;

      // Handle Practice by Part / Section visibility
      if (practiceMode === "passage") {
        if (p === targetPassage) {
          card.style.display = "";
          card.classList.add("active");
        } else {
          card.style.display = "none";
          continue;
        }
      } else if (practiceMode === "section") {
        if (p === targetPassage) {
          card.style.display = "";
          card.classList.add("active");
        } else {
          card.style.display = "none";
          continue;
        }
      } else {
        card.style.display = "";
        card.classList.toggle("active", p === activePassage);
      }

      const startQ = (p === 1) ? 1 : (p === 2 ? 14 : 27);
      const endQ = (p === 1) ? 13 : (p === 2 ? 26 : 40);

      let btnsHtml = "";
      for (let q = startQ; q <= endQ; q++) {
        // If section practice, show only relevant section questions
        if (practiceMode === "section" && !targetQIds.includes(q)) continue;
        btnsHtml += `<button type="button" class="cl-q-btn" id="qBtn-${q}" onclick="window.crV2.goToQuestion(${q})">${q}</button>`;
      }
      numsContainer.innerHTML = btnsHtml;
    }

    updateAllButtons();
  }

  function updateAllButtons() {
    targetQIds.forEach(q => {
      updateButtonStatus(q);
    });
    setFocusedQuestion(currentFocusedQ);
  }

  function updateButtonStatus(qId) {
    const btn = document.getElementById(`qBtn-${qId}`);
    if (!btn) return;

    const val = userAnswers[qId];
    const isAnswered = (val != null && String(val).trim() !== "");

    if (!isSubmitted) {
      btn.classList.toggle("answered", isAnswered);
    } else {
      btn.classList.remove("answered");
      const isCorrect = checkAnswerCorrectness(qId);
      btn.classList.toggle("correct", isCorrect);
      btn.classList.toggle("wrong", !isCorrect);
    }
  }

  function setFocusedQuestion(qId) {
    currentFocusedQ = qId;
    document.querySelectorAll(".cl-q-btn").forEach(b => b.classList.remove("current-focus"));
    const btn = document.getElementById(`qBtn-${qId}`);
    if (btn) btn.classList.add("current-focus");
  }

  // -------------------------------------------------------------
  // 7. Passage & Question Navigation (Full Interactivity)
  // -------------------------------------------------------------
  function switchPassage(passageNum) {
    if (practiceMode === "passage" && passageNum !== targetPassage) return;
    if (practiceMode === "section" && passageNum !== targetPassage) return;

    activePassage = passageNum;

    // Update bottom passage cards
    if (practiceMode === "full") {
      for (let p = 1; p <= 3; p++) {
        const card = document.getElementById(`bottomPassageCard-${p}`);
        if (card) card.classList.toggle("active", p === passageNum);
      }
    }

    // Render Left Passage & Right Questions for this passage
    renderPassage(passageNum);
    renderQuestionsForPassage(passageNum);
    initHeadingDragAndDrop();
    updateAllButtons();
  }

  function goToQuestion(qId) {
    const p = (qId <= 13) ? 1 : (qId <= 26 ? 2 : 3);
    if (activePassage !== p) {
      switchPassage(p);
    }

    setFocusedQuestion(qId);

    // Scroll right questions column to question item
    setTimeout(() => {
      const qTarget = document.getElementById(`badge-q-${qId}`)
        || document.getElementById(`qItem-${qId}`)
        || document.getElementById(`qRow-${qId}`)
        || document.querySelector(`[data-qid="${qId}"]`);

      if (qTarget) {
        qTarget.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 60);
  }

  function navigatePrev() {
    const idx = targetQIds.indexOf(currentFocusedQ);
    if (idx > 0) {
      goToQuestion(targetQIds[idx - 1]);
    } else {
      goToQuestion(targetQIds[targetQIds.length - 1]);
    }
  }

  function navigateNext() {
    const idx = targetQIds.indexOf(currentFocusedQ);
    if (idx !== -1 && idx < targetQIds.length - 1) {
      goToQuestion(targetQIds[idx + 1]);
    } else {
      goToQuestion(targetQIds[0]);
    }
  }

  // -------------------------------------------------------------
  // 8. Middle Split Resizer
  // -------------------------------------------------------------
  function initSplitResizer() {
    const resizer = document.getElementById("splitResizer");
    if (!resizer || !passageCol || !questionsCol) return;

    let isDragging = false;

    resizer.addEventListener("mousedown", e => {
      isDragging = true;
      resizer.classList.add("active");
      document.body.style.cursor = "col-resize";
      e.preventDefault();
    });

    window.addEventListener("mousemove", e => {
      if (!isDragging) return;
      const totalWidth = window.innerWidth;
      const leftPercent = (e.clientX / totalWidth) * 100;

      if (leftPercent >= 20 && leftPercent <= 80) {
        passageCol.style.width = `calc(${leftPercent}% - 8px)`;
        questionsCol.style.width = `calc(${100 - leftPercent}% - 8px)`;
      }
    });

    window.addEventListener("mouseup", () => {
      if (isDragging) {
        isDragging = false;
        resizer.classList.remove("active");
        document.body.style.cursor = "";
      }
    });
  }

  // -------------------------------------------------------------
  // 9. Text Highlighting Tool in Passage & Questions
  // -------------------------------------------------------------
  let activeTargetHighlight = null;
  let savedSelectionRange = null;

  function initTextHighlighting() {
    const tooltip = document.getElementById("crHighlightTooltip");
    const doHlBtn = document.getElementById("crDoHighlightBtn");
    const doUnhlBtn = document.getElementById("crDoUnhighlightBtn");
    if (!tooltip) return;

    // Listen for text selection changes
    document.addEventListener("mouseup", handleSelectionChange);
    document.addEventListener("keyup", handleSelectionChange);

    // Listen for click on existing custom highlights or outside tooltip
    document.addEventListener("click", (e) => {
      // Check if user clicked on an existing custom highlight
      const hlMark = e.target.closest(".cr-user-hl, .cr-user-highlight");
      if (hlMark) {
        e.stopPropagation();
        showUnhighlightTooltip(hlMark);
        return;
      }

      // Hide tooltip if clicked outside tooltip
      if (!e.target.closest("#crHighlightTooltip")) {
        hideHighlightTooltip();
      }
    });

    if (doHlBtn) {
      doHlBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        highlightCurrentSelection();
      });
    }

    if (doUnhlBtn) {
      doUnhlBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (activeTargetHighlight) {
          removeUserHighlight(activeTargetHighlight);
        } else if (savedSelectionRange) {
          removeHighlightsInSelection(savedSelectionRange);
        }
      });
    }
  }

  function handleSelectionChange(e) {
    if (e && e.target && e.target.closest("#crHighlightTooltip")) return;

    setTimeout(() => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || !sel.rangeCount) {
        if (!activeTargetHighlight) hideHighlightTooltip();
        return;
      }

      const text = sel.toString().trim();
      if (text.length === 0) {
        if (!activeTargetHighlight) hideHighlightTooltip();
        return;
      }

      const range = sel.getRangeAt(0);
      const splitWrap = document.querySelector(".cr-main-split") || document.body;
      if (!splitWrap.contains(range.commonAncestorContainer)) {
        hideHighlightTooltip();
        return;
      }

      const rect = range.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) return;

      savedSelectionRange = range.cloneRange();
      activeTargetHighlight = null;

      // Check if selection contains or is inside existing highlight
      const commonNode = range.commonAncestorContainer;
      const enclosingHighlight = commonNode.nodeType === 1 ? commonNode.closest(".cr-user-hl, .cr-user-highlight") : (commonNode.parentElement ? commonNode.parentElement.closest(".cr-user-hl, .cr-user-highlight") : null);

      const doHlBtn = document.getElementById("crDoHighlightBtn");
      const doUnhlBtn = document.getElementById("crDoUnhighlightBtn");

      if (enclosingHighlight) {
        activeTargetHighlight = enclosingHighlight;
        if (doHlBtn) doHlBtn.style.display = "none";
        if (doUnhlBtn) doUnhlBtn.style.display = "inline-flex";
      } else {
        // Check if range contains any highlights inside
        const fragment = range.cloneContents();
        const hasHighlightsInside = fragment.querySelector && fragment.querySelector(".cr-user-hl, .cr-user-highlight");
        if (hasHighlightsInside) {
          if (doHlBtn) doHlBtn.style.display = "inline-flex";
          if (doUnhlBtn) doUnhlBtn.style.display = "inline-flex";
        } else {
          if (doHlBtn) doHlBtn.style.display = "inline-flex";
          if (doUnhlBtn) doUnhlBtn.style.display = "none";
        }
      }

      positionTooltip(rect);
    }, 30);
  }

  function positionTooltip(rect) {
    const tooltip = document.getElementById("crHighlightTooltip");
    if (!tooltip) return;
    tooltip.style.display = "flex";
    const tipWidth = tooltip.offsetWidth || 150;
    const left = Math.max(10, Math.min(window.innerWidth - tipWidth - 10, rect.left + rect.width / 2 - tipWidth / 2));
    const top = Math.max(10, rect.top - 46);

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
  }

  function showUnhighlightTooltip(hlMark) {
    activeTargetHighlight = hlMark;
    savedSelectionRange = null;
    const rect = hlMark.getBoundingClientRect();
    const doHlBtn = document.getElementById("crDoHighlightBtn");
    const doUnhlBtn = document.getElementById("crDoUnhighlightBtn");
    if (doHlBtn) doHlBtn.style.display = "none";
    if (doUnhlBtn) doUnhlBtn.style.display = "inline-flex";
    positionTooltip(rect);
  }

  function hideHighlightTooltip() {
    const tooltip = document.getElementById("crHighlightTooltip");
    if (tooltip) tooltip.style.display = "none";
    activeTargetHighlight = null;
  }

  function highlightCurrentSelection() {
    const sel = window.getSelection();
    let range = savedSelectionRange;
    if (sel && !sel.isCollapsed && sel.rangeCount) {
      range = sel.getRangeAt(0);
    }
    if (!range) return;

    const text = range.toString().trim();
    if (!text) return;

    try {
      const mark = document.createElement("mark");
      mark.className = "cr-user-hl cr-user-highlight";
      mark.title = "Click to remove highlight";
      range.surroundContents(mark);
    } catch (e) {
      try {
        const fragment = range.extractContents();
        const mark = document.createElement("mark");
        mark.className = "cr-user-hl cr-user-highlight";
        mark.title = "Click to remove highlight";
        mark.appendChild(fragment);
        range.insertNode(mark);
      } catch (err) {
        console.warn("Could not wrap selection:", err);
      }
    }

    if (sel) sel.removeAllRanges();
    savedSelectionRange = null;
    hideHighlightTooltip();
  }

  function removeUserHighlight(markEl) {
    if (!markEl || !markEl.parentNode) return;
    const parent = markEl.parentNode;
    while (markEl.firstChild) {
      parent.insertBefore(markEl.firstChild, markEl);
    }
    parent.removeChild(markEl);
    parent.normalize();
    hideHighlightTooltip();
  }

  function removeHighlightsInSelection(range) {
    if (!range) return;
    const commonNode = range.commonAncestorContainer;
    const root = commonNode.nodeType === 1 ? commonNode : (commonNode.parentElement || document.body);
    const marks = root.querySelectorAll(".cr-user-hl, .cr-user-highlight");
    marks.forEach(m => {
      try {
        if (range.intersectsNode(m)) {
          removeUserHighlight(m);
        }
      } catch (e) {
        removeUserHighlight(m);
      }
    });
    const sel = window.getSelection();
    if (sel) sel.removeAllRanges();
    savedSelectionRange = null;
    hideHighlightTooltip();
  }

  // -------------------------------------------------------------
  // 10. Submission, Scoring & Review Mode
  // -------------------------------------------------------------
  if (finishBtn) {
    finishBtn.addEventListener("click", () => {
      if (submitModal) submitModal.style.display = "flex";
    });
  }

  if (cancelSubmitBtn) {
    cancelSubmitBtn.addEventListener("click", () => {
      if (submitModal) submitModal.style.display = "none";
    });
  }

  if (confirmSubmitBtn) {
    confirmSubmitBtn.addEventListener("click", () => {
      if (submitModal) submitModal.style.display = "none";
      submitTest();
    });
  }

  function submitTest() {
    isSubmitted = true;
    stopTimer();

    // Check answers & compute score
    let correctCount = 0;
    targetQIds.forEach(q => {
      if (checkAnswerCorrectness(q)) correctCount++;
    });

    const totalCount = targetQIds.length;
    const bandScore = calculateBandScore(correctCount, totalCount);

    showScorecard(correctCount, totalCount, bandScore);

    // Apply Evidence Highlights to the currently active passage
    applyEvidenceHighlightsOnPassage(activePassage);

    // Render review boxes on currently active questions
    renderReviewBoxesForPassage(activePassage);

    // Update bottom navigation bar with green/red states
    updateAllButtons();

    // Automatically record student practice in dashboard
    try {
      const u = JSON.parse(localStorage.getItem('user') || 'null');
      const isPracticeBank = urlParams.get("practice") === "bank" || urlParams.has("set") || urlParams.has("pracNumber");
      const pType = urlParams.get("type") || urlParams.get("pracType") || "Question Type Practice";
      const pSet = (urlParams.get("set") || urlParams.get("pracNumber") || "1").replace(/\D/g, "") || "1";
      
      let testTitle = `Cambridge ${bookParam} Academic Reading Test ${testParam}`;
      if (isPracticeBank) {
        testTitle = `${pType} Practice (Set ${pSet})`;
      } else if (practiceMode === "section") {
        testTitle = `Cambridge ${bookParam} Reading Test ${testParam} (Q${sectionStart}-${sectionEnd})`;
      } else if (practiceMode === "passage") {
        testTitle = `Cambridge ${bookParam} Reading Test ${testParam} (Passage ${targetPassage})`;
      }

      fetch('/api/student/record-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: u ? u.email : '',
          testType: isPracticeBank ? 'Practice Hub' : (practiceMode === 'full' ? 'Cambridge Reading' : 'Cambridge Reading Practice'),
          module: 'reading',
          testId: isPracticeBank ? `practice-reading-${encodeURIComponent(pType)}-set-${pSet}` : `cambridge-reading-${bookParam}-${testParam}-${practiceMode}`,
          title: testTitle,
          totalQuestions: totalCount,
          readingScore: correctCount,
          readingBand: Number(bandScore) || (totalCount > 0 ? Math.round((correctCount / totalCount) * 9 * 2) / 2 : 0),
          overallBand: Number(bandScore) || (totalCount > 0 ? Math.round((correctCount / totalCount) * 9 * 2) / 2 : 0),
          answers: userAnswers
        })
      }).catch(err => console.warn('Record sync error:', err));
    } catch(e) {}

    if (finishBtn) {
      finishBtn.textContent = "Test Completed";
      finishBtn.style.background = "#10b981";
      finishBtn.disabled = true;
    }
  }

  function checkAnswerCorrectness(qId) {
    const rawOfficial = (testData.answers || {})[qId] || (testData.answers || {})[String(qId)];
    if (!rawOfficial) return false;

    const uVal = String(userAnswers[qId] || "").trim().toLowerCase();
    if (!uVal) return false;

    let acceptable = [];
    if (Array.isArray(rawOfficial)) {
      acceptable = rawOfficial.map(x => String(x).trim().toLowerCase());
    } else {
      acceptable = [String(rawOfficial).trim().toLowerCase()];
    }

    // Support True/False / Yes/No aliases
    if (acceptable.includes("true")) acceptable.push("t");
    if (acceptable.includes("false")) acceptable.push("f");
    if (acceptable.includes("not given")) acceptable.push("ng");
    if (acceptable.includes("yes")) acceptable.push("y");
    if (acceptable.includes("no")) acceptable.push("n");

    return acceptable.includes(uVal);
  }

  function calculateBandScore(correct, total) {
    if (total === 40) {
      if (correct >= 39) return "9.0";
      if (correct >= 37) return "8.5";
      if (correct >= 35) return "8.0";
      if (correct >= 33) return "7.5";
      if (correct >= 30) return "7.0";
      if (correct >= 27) return "6.5";
      if (correct >= 23) return "6.0";
      if (correct >= 19) return "5.5";
      if (correct >= 15) return "5.0";
      if (correct >= 13) return "4.5";
      if (correct >= 10) return "4.0";
      if (correct >= 8) return "3.5";
      return "3.0";
    }

    // Scaled score for passage / section practice
    const ratio = correct / total;
    if (ratio >= 0.95) return "9.0";
    if (ratio >= 0.90) return "8.5";
    if (ratio >= 0.85) return "8.0";
    if (ratio >= 0.80) return "7.5";
    if (ratio >= 0.72) return "7.0";
    if (ratio >= 0.65) return "6.5";
    if (ratio >= 0.55) return "6.0";
    if (ratio >= 0.45) return "5.5";
    if (ratio >= 0.35) return "5.0";
    return "4.0";
  }

  function showScorecard(correct, total, band) {
    if (!scorecardModal) return;

    const bandEl = document.getElementById("resBandScore");
    const numEl = document.getElementById("resCorrectNum");
    const totalEl = document.getElementById("resTotalNum");
    const timeEl = document.getElementById("resTimeTaken");

    if (bandEl) bandEl.textContent = band;
    if (numEl) numEl.textContent = correct;
    if (totalEl) totalEl.textContent = total;

    if (timeEl) {
      if (practiceMode === "full") {
        const spent = 3600 - remainingSeconds;
        const m = Math.floor(spent / 60);
        const s = spent % 60;
        timeEl.textContent = `${m}m ${s}s`;
      } else {
        const m = Math.floor(practiceSeconds / 60);
        const s = practiceSeconds % 60;
        timeEl.textContent = `${m}m ${s}s`;
      }
    }

    scorecardModal.style.display = "flex";
  }

  // -------------------------------------------------------------
  // 11. Review Box Rendering for Right Column Questions
  // -------------------------------------------------------------
  function renderReviewBoxesForPassage(passageNum) {
    const startQ = (passageNum === 1) ? 1 : (passageNum === 2 ? 14 : 27);
    const endQ = (passageNum === 1) ? 13 : (passageNum === 2 ? 26 : 40);

    const questionsInPassage = targetQIds.filter(q => q >= startQ && q <= endQ);

    questionsInPassage.forEach(q => {
      const isCorrect = checkAnswerCorrectness(q);
      const rawOfficial = (testData.answers || {})[q] || (testData.answers || {})[String(q)];
      const officialStr = Array.isArray(rawOfficial) ? rawOfficial.join(' / ') : String(rawOfficial || '');
      const userStr = userAnswers[q] || 'No Answer';

      // Heading dropzone border color styling
      const headingDrop = document.getElementById(`headingDrop-${q}`);
      if (headingDrop) {
        if (isCorrect) {
          headingDrop.style.borderColor = '#16a34a';
          headingDrop.style.background = '#f0fdf4';
        } else {
          headingDrop.style.borderColor = '#dc2626';
          headingDrop.style.background = '#fef2f2';
        }
      }

      const box = document.getElementById(`reviewBox-${q}`);
      if (!box) return;

      const explanationText = (testData.answerExplanations && (testData.answerExplanations[q] || testData.answerExplanations[String(q)]))
        || (testData.explanations && (testData.explanations[q] || testData.explanations[String(q)]))
        || (bookParam === 21 && testParam === 1 ? c21Explanations[q] : '')
        || '';

      const trapText = (testData.traps && (testData.traps[q] || testData.traps[String(q)]))
        || (bookParam === 21 && testParam === 1 ? c21Traps[q] : '')
        || '';

      box.style.display = 'block';
      box.innerHTML = `
        <div class="cr-review-status-row">
          <span class="cr-status-tag ${isCorrect ? 'correct' : 'wrong'}">
            <i class="bi ${isCorrect ? 'bi-check-circle-fill' : 'bi-x-circle-fill'}"></i>
            ${isCorrect ? 'Correct' : 'Incorrect'}
          </span>
          <span class="cr-official-ans"><strong>Official:</strong> ${escapeHtml(officialStr)}</span>
          ${!isCorrect ? `<span class="cr-user-ans"><strong>Your Answer:</strong> ${escapeHtml(userStr)}</span>` : ''}
        </div>
        <div class="cr-review-btn-group">
          ${explanationText ? `
            <button type="button" class="cr-explain-btn" onclick="window.crV2.toggleExpand('exp-${q}')">
              Explain more ▶
            </button>
          ` : ''}
          ${trapText ? `
            <button type="button" class="cr-trap-btn" onclick="window.crV2.toggleExpand('trap-${q}')">
              What's the trap? 💡
            </button>
          ` : ''}
          <button type="button" class="cr-locate-btn" onclick="window.crV2.locateEvidence(${q})">
            🔍 Locate in Passage
          </button>
        </div>
        ${explanationText ? `
          <div class="cr-expand-box cr-explain-box" id="exp-${q}">
            <strong>💡 Explanation:</strong> ${escapeHtml(explanationText)}
          </div>
        ` : ''}
        ${trapText ? `
          <div class="cr-expand-box cr-trap-box" id="trap-${q}">
            <strong>⚠️ Trap Alert:</strong> ${escapeHtml(trapText)}
          </div>
        ` : ''}
      `;
    });
  }

  function normalizeForSearch(str) {
    if (!str) return "";
    return String(str)
      .replace(/[\u2018\u2019\u201B']/g, "'")
      .replace(/[\u201C\u201D\u201F"]/g, '"')
      .replace(/[\u2013\u2014–—]/g, "-")
      .replace(/\s*-\s*/g, "-")
      .replace(/\s+/g, " ")
      .trim();
  }

  function findBestMatchInPara(normPara, normEv) {
    if (!normPara || !normEv) return null;
    const lowerPara = normPara.toLowerCase();
    const lowerEv = normEv.toLowerCase();

    // 1. Direct exact match (first 30 characters)
    const probeLen = Math.min(30, lowerEv.length);
    const p30 = lowerEv.slice(0, probeLen);
    let idx = lowerPara.indexOf(p30);
    if (idx !== -1) {
      const len = Math.min(normPara.length - idx, normEv.length);
      return { start: idx, len, score: 500 + len };
    }

    // 2. Try stripping leading answer / label artifacts (e.g. "/ answer /", "word / word", "(tag)")
    const stripped = lowerEv.replace(/^(\s*[\/\(\w\s-]+\s*\/\s*)+/, '').trim();
    if (stripped.length >= 15 && stripped !== lowerEv) {
      const pStrip = stripped.slice(0, Math.min(30, stripped.length));
      idx = lowerPara.indexOf(pStrip);
      if (idx !== -1) {
        const len = Math.min(normPara.length - idx, stripped.length);
        return { start: idx, len, score: 300 + len };
      }
    }

    // 3. Multi-word chunk probe (4-5 word sliding search)
    const words = lowerEv.replace(/[^a-z0-9\s-]/gi, ' ').split(/\s+/).filter(w => w.length > 2);
    for (let wCount = 5; wCount >= 4; wCount--) {
      for (let i = 0; i <= words.length - wCount; i++) {
        const phrase = words.slice(i, i + wCount).join(' ');
        const cleanPara = lowerPara.replace(/[^a-z0-9\s-]/gi, ' ');
        const cleanIdx = cleanPara.indexOf(phrase);
        if (cleanIdx !== -1) {
          const approxStart = Math.max(0, cleanIdx);
          const approxLen = Math.min(normPara.length - approxStart, Math.max(phrase.length, normEv.length));
          return { start: approxStart, len: approxLen, score: 50 + phrase.length };
        }
      }
    }

    return null;
  }

  function expandToSentenceBoundary(para, matchStart, matchEnd) {
    if (!para || matchStart < 0) return { start: matchStart, end: matchEnd };

    let s = matchStart;
    while (s > 0) {
      const prevChar = para[s - 1];
      const prevPrev = s >= 2 ? para[s - 2] : '';
      if ((prevPrev === '.' || prevPrev === '!' || prevPrev === '?') && /\s/.test(prevChar)) {
        break;
      }
      if (prevChar === '\n' || prevChar === '\r') {
        break;
      }
      s--;
    }
    while (s < matchStart && /\s/.test(para[s])) {
      s++;
    }

    let e = matchEnd;
    while (e < para.length) {
      const char = para[e];
      const nextChar = e + 1 < para.length ? para[e + 1] : '';
      if ((char === '.' || char === '!' || char === '?') && (/\s/.test(nextChar) || nextChar === '”' || nextChar === '"' || nextChar === '’' || e === para.length - 1)) {
        e++;
        while (e < para.length && (para[e] === '"' || para[e] === '”' || para[e] === '’' || para[e] === "'")) {
          e++;
        }
        break;
      }
      e++;
    }

    return { start: Math.max(0, s), end: Math.min(para.length, e) };
  }

  function applyEvidenceHighlightsOnPassage(passageNum) {
    const passageBody = document.getElementById(`passageBody-${passageNum}`);
    if (!passageBody || !testData.evidenceHighlights) return;

    const startQ = (passageNum === 1) ? 1 : (passageNum === 2 ? 14 : 27);
    const endQ = (passageNum === 1) ? 13 : (passageNum === 2 ? 26 : 40);

    const highlights = testData.evidenceHighlights || {};

    // Collect all highlights relevant to this passage
    const passageHls = [];
    for (let q = startQ; q <= endQ; q++) {
      if (practiceMode === "section" && targetQIds && targetQIds.length && !targetQIds.includes(q)) {
        continue;
      }
      const evObj = highlights[String(q)] || highlights[q];
      if (!evObj) continue;
      const rawText = typeof evObj === "object" ? evObj.text : evObj;
      if (rawText && rawText.length >= 5) {
        passageHls.push({ qId: q, text: rawText });
      }
    }

    const paragraphs = passageBody.querySelectorAll("p");
    const normParas = [];
    paragraphs.forEach((p) => {
      let pureText = p.textContent || "";
      const letterEl = p.querySelector(".cr-para-letter");
      if (letterEl) {
        pureText = pureText.replace(/^\s*[A-Z]\.?\s*/, '');
      }
      normParas.push(normalizeForSearch(pureText));
    });

    // Best paragraph assignment for each question to avoid duplicate or weak matches
    const bestParaForQ = {};
    passageHls.forEach(({ qId, text }) => {
      const normEv = normalizeForSearch(text);
      let bestScore = 0;
      let bestIdx = -1;
      let bestMatch = null;

      normParas.forEach((normPara, pIdx) => {
        const match = findBestMatchInPara(normPara, normEv);
        if (match && match.score > bestScore) {
          bestScore = match.score;
          bestIdx = pIdx;
          bestMatch = match;
        }
      });

      if (bestIdx !== -1 && bestMatch) {
        bestParaForQ[qId] = { pIndex: bestIdx, match: bestMatch, text };
      }
    });

    paragraphs.forEach((p, pIndex) => {
      const paraLetter = String.fromCharCode(65 + pIndex);
      const normPara = normParas[pIndex];
      const matchedSpans = [];

      passageHls.forEach(({ qId }) => {
        const item = bestParaForQ[qId];
        if (item && item.pIndex === pIndex) {
          const match = item.match;
          const expanded = expandToSentenceBoundary(normPara, match.start, match.start + match.len);
          matchedSpans.push({
            qId,
            start: expanded.start,
            end: expanded.end,
            rawText: item.text
          });
        }
      });

      if (!matchedSpans.length) return;

      // Sort spans by start index
      matchedSpans.sort((a, b) => a.start - b.start || b.end - a.end);

      // Merge overlapping or identical spans (e.g. two-choice questions sharing evidence)
      const mergedSpans = [];
      matchedSpans.forEach(span => {
        if (!mergedSpans.length) {
          mergedSpans.push({
            start: span.start,
            end: span.end,
            qIds: [span.qId],
            rawText: span.rawText
          });
          return;
        }

        const prev = mergedSpans[mergedSpans.length - 1];
        if (span.start < prev.end) {
          if (!prev.qIds.includes(span.qId)) prev.qIds.push(span.qId);
          prev.end = Math.max(prev.end, span.end);
        } else {
          mergedSpans.push({
            start: span.start,
            end: span.end,
            qIds: [span.qId],
            rawText: span.rawText
          });
        }
      });

      // Build highlighted HTML without overwriting sibling highlights
      let newHtml = "";
      let lastIdx = 0;

      mergedSpans.forEach(span => {
        if (span.start >= lastIdx) {
          newHtml += escapeHtml(normPara.slice(lastIdx, span.start));
          const snippet = normPara.slice(span.start, span.end);

          // Render tags for all questions in this span
          const tagsHtml = span.qIds
            .map(qid => `<span id="evHighlight-${qid}" class="cr-ev-tag" onclick="window.crV2.goToQuestion(${qid})">Q${qid}</span>`)
            .join(' ');
          const dataQids = span.qIds.join(',');

          newHtml += `<mark class="cr-evidence-hl" data-qids="${dataQids}">${tagsHtml} ${escapeHtml(snippet)}</mark>`;
          lastIdx = span.end;
        }
      });
      newHtml += escapeHtml(normPara.slice(lastIdx));

      // Preserve paragraph letter tag
      const letterHtml = `<strong class="cr-para-letter">${paraLetter}.</strong> `;
      p.innerHTML = letterHtml + newHtml;
    });
  }

  function locateEvidence(qId) {
    const p = (qId <= 13) ? 1 : (qId <= 26 ? 2 : 3);
    if (activePassage !== p) {
      switchPassage(p);
    }

    setTimeout(() => {
      let el = document.getElementById(`evHighlight-${qId}`);
      if (!el) {
        el = document.querySelector(`.cr-evidence-hl[data-qids*="${qId}"]`);
      }
      if (el) {
        const targetEl = el.closest('.cr-evidence-hl') || el;
        targetEl.scrollIntoView({ behavior: "smooth", block: "center" });
        targetEl.style.outline = "3px solid #ca8a04";
        targetEl.style.outlineOffset = "2px";
        setTimeout(() => { targetEl.style.outline = ""; }, 2500);
      }
    }, 120);
  }

  function toggleExpand(id) {
    const el = document.getElementById(id);
    if (el) el.classList.toggle("open");
  }

  // -------------------------------------------------------------
  // Helpers
  // -------------------------------------------------------------
  function escapeHtml(str) {
    if (str == null) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function escapeAttr(str) {
    if (str == null) return "";
    return String(str)
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function formatInstruction(str) {
    if (!str) return "";
    return str
      .replace(/\n/g, "<br>")
      .replace(/TRUE|FALSE|NOT GIVEN|YES|NO/g, match => `<strong>${match}</strong>`)
      .replace(/ONE WORD ONLY|TWO WORDS|NO MORE THAN/g, match => `<strong>${match}</strong>`);
  }

  // -------------------------------------------------------------
  // Public Namespace
  // -------------------------------------------------------------
  window.crV2 = {
    switchPassage,
    goToQuestion,
    locateEvidence,
    toggleExpand,
    selectWordChip,
    clearWordChoice,
    selectHeadingCard,
    clearHeadingChoice,
    handleHeadingDropzoneClick,
    navigatePrev,
    navigateNext,
    showOneHourModal,
    continueAfterOneHour,
    submitFromOneHour,
    toggleFullPassageParas: function() {
      showAllPassageParas = !showAllPassageParas;
      renderPassage(activePassage);
    },
    getElapsedSeconds: () => elapsedSeconds,
    setElapsedSeconds: (s) => { elapsedSeconds = s; }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTest);
  } else {
    initTest();
  }
})();
