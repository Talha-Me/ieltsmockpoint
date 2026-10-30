/**
 * services/practiceReadingNormalizer.js
 * Normalizes documents from 'reading-practices' collection to Cambridge V2 Engine Schema
 */

function romanize(num) {
  const lookup = { m: 1000, cm: 900, d: 500, cd: 400, c: 100, xc: 90, l: 50, xl: 40, x: 10, ix: 9, v: 5, iv: 4, i: 1 };
  let roman = '', i;
  for (i in lookup) {
    while (num >= lookup[i]) {
      roman += i;
      num -= lookup[i];
    }
  }
  return roman.toLowerCase();
}

function normalizePracticeReadingDoc(doc) {
  if (!doc) return null;
  const r = doc.reading || {};
  const rawPassages = r.passages || [];

  // 1. Passages Normalization
  const passages = rawPassages.map((p, pIdx) => {
    let paras = [];
    const pc = p["paragraph-content"] || p.paragraphContent || p["paragraph_content"] || [];
    const pMarks = p["paragraph-Mark"] || p.paragraphMark || p.paragraphs || [];

    if (Array.isArray(pc) && pc.length > 0) {
      paras = pc.map((item, idx) => {
        let text = "";
        if (Array.isArray(item)) {
          text = item.join("\n\n").trim();
        } else if (typeof item === "object" && item !== null) {
          text = (item.text || item.content || "").trim();
        } else {
          text = String(item || "").trim();
        }
        const label = (pMarks && pMarks[idx]) || String.fromCharCode(65 + idx);
        return { label, text };
      }).filter(x => x.text);
    } else if (Array.isArray(p.paragraphs) && p.paragraphs.length > 0) {
      const isLettersOnly = p.paragraphs.every(x => typeof x === "string" && x.trim().length <= 2);
      if (!isLettersOnly) {
        paras = p.paragraphs.map((item, idx) => {
          if (typeof item === "object" && item !== null) {
            return {
              label: item.label || String.fromCharCode(65 + idx),
              text: (item.text || item.content || "").trim()
            };
          }
          const str = String(item || "").trim();
          const m = str.match(/^([A-Z])[\.\s\:\-]+(.*)$/s);
          if (m) {
            return { label: m[1], text: m[2].trim() };
          }
          return { label: String.fromCharCode(65 + idx), text: str };
        }).filter(x => x.text);
      }
    }

    return {
      title: p.title || `Reading Passage ${pIdx + 1}`,
      paragraphs: paras,
      paragraphContent: paras
    };
  });

  const rawGroups = r.questions || [];
  const cleanAnswers = {};
  const rawAnswers = r.answers || {};

  // 2. Question Groups Normalization
  const questionGroups = rawGroups.map((g, gIdx) => {
    const normG = { ...g };
    const qIds = Array.isArray(g.id) ? g.id.map(Number) : (g.id ? [Number(g.id)] : []);
    normG.part = 1;
    normG.passage = 1;
    normG.groupNumber = gIdx + 1;

    const gType = String(g.type || doc.type || '').toLowerCase();

    // A. Multiple Choice (mcq-one-choice)
    if (gType.includes('mcq') || gType.includes('choice') || (g.questions && g.options)) {
      normG.type = 'mcq-one-choice';
      normG.title = g.title || 'Multiple Choice Questions';
      normG.instruction = g.instruction || 'Choose the correct letter, A, B, C or D.';
      if (Array.isArray(g.questions) && Array.isArray(g.options)) {
        normG.items = qIds.map((id, i) => {
          const rawOpts = g.options[i] || [];
          const opts = rawOpts.map((opt, oIdx) => ({
            letter: String.fromCharCode(65 + oIdx),
            text: typeof opt === 'object' ? (opt.text || opt.label) : String(opt)
          }));
          return {
            id,
            text: g.questions[i],
            options: opts
          };
        });
      }
      // Answer map: "1" => "A", "2" => "B", etc.
      qIds.forEach(id => {
        const rawAns = rawAnswers[String(id)] || rawAnswers[id];
        const val = Array.isArray(rawAns) ? rawAns[0] : rawAns;
        if (val) {
          const num = Number(val);
          if (!isNaN(num) && num >= 1 && num <= 4) {
            cleanAnswers[String(id)] = String.fromCharCode(64 + num); // 1->A, 2->B...
          } else {
            cleanAnswers[String(id)] = String(val).toUpperCase();
          }
        }
      });
    }

    // B. True / False / Not Given & Yes / No / Not Given
    else if (gType.includes('t/f') || gType.includes('true') || gType.includes('yes')) {
      const isYesNo = gType.includes('yes');
      normG.type = isYesNo ? 'yes-no-not-given' : 'true-false-not-given';
      normG.title = isYesNo ? 'Questions (Yes / No / Not Given)' : 'Questions (True / False / Not Given)';
      normG.instruction = g.instruction || (isYesNo
        ? 'Do the following statements agree with the claims of the writer? Choose YES, NO, or NOT GIVEN.'
        : 'Do the following statements agree with the information given in the reading passage? Choose TRUE, FALSE, or NOT GIVEN.');
      if (Array.isArray(g.questions)) {
        normG.items = qIds.map((id, i) => ({
          id,
          text: g.questions[i]
        }));
      }
      qIds.forEach(id => {
        const rawAns = rawAnswers[String(id)] || rawAnswers[id];
        const val = Array.isArray(rawAns) ? rawAns[0] : rawAns;
        cleanAnswers[String(id)] = String(val || '').toUpperCase().trim();
      });
    }

    // C. Summary Completion with Word List
    else if (gType.includes('summary') || g['word-list'] || g.summary) {
      normG.type = 'summary-with-list-of-words';
      normG.title = 'Summary Completion';
      normG.summaryTitle = g.title || 'Summary';
      normG.instruction = g.instruction || 'Complete the summary using the list of phrases, A-J, below.';

      const rawWords = g['word-list'] || g.wordList || [];
      const wordMap = {};
      normG.wordList = rawWords.map((w, wIdx) => {
        const letter = String.fromCharCode(65 + wIdx);
        wordMap[w.toLowerCase().trim()] = letter;
        return `${letter}. ${w}`;
      });

      const rawLines = g.summary || g.paragraphs || g.sentences || [];
      let bIdx = 0;
      normG.paragraphs = rawLines.map(line => {
        return line.replace(/\[blank\]/g, () => {
          const qId = qIds[bIdx] || (bIdx + 1);
          bIdx++;
          return `[blank:${qId}]`;
        });
      });

      // Map answers to letter (A, B, C...)
      qIds.forEach(id => {
        const rawAns = rawAnswers[String(id)] || rawAnswers[id];
        const phrase = (Array.isArray(rawAns) ? rawAns[0] : rawAns) || '';
        const letter = wordMap[phrase.toLowerCase().trim()];
        cleanAnswers[String(id)] = letter || phrase;
      });
    }

    // D. Sentence Completion
    else if (gType.includes('sentence')) {
      normG.type = 'sentence-completion';
      normG.title = 'Sentence Completion';
      normG.instruction = g.instruction || 'Complete the sentences below. Choose NO MORE THAN TWO WORDS from the passage for each answer.';
      let bIdx = 0;
      normG.sentences = (g.questions || []).map(line => {
        let clean = line.replace(/^###\s*/, '');
        return clean.replace(/\[blank\]/g, () => {
          const qId = qIds[bIdx] || (bIdx + 1);
          bIdx++;
          return `[blank:${qId}]`;
        });
      });
      qIds.forEach(id => {
        const rawAns = rawAnswers[String(id)] || rawAnswers[id];
        cleanAnswers[String(id)] = (Array.isArray(rawAns) ? rawAns[0] : rawAns) || '';
      });
    }

    // E. Note Completion
    else if (gType.includes('note')) {
      normG.type = 'note-completion';
      normG.title = g.heading || 'Note Completion';
      normG.instruction = g.instruction || 'Complete the notes below. Choose ONE WORD ONLY from the passage for each answer.';
      let bIdx = 0;
      if (Array.isArray(g.paragraphs)) {
        normG.sections = (g.subheadings || []).map((sh, sIdx) => {
          const pts = (g.paragraphs[sIdx] || []).map(line => {
            return line.replace(/\[blank\]/g, () => {
              const qId = qIds[bIdx] || (bIdx + 1);
              bIdx++;
              return `[blank:${qId}]`;
            });
          });
          return { subheading: sh, points: pts };
        });
      }
      qIds.forEach(id => {
        const rawAns = rawAnswers[String(id)] || rawAnswers[id];
        cleanAnswers[String(id)] = (Array.isArray(rawAns) ? rawAns[0] : rawAns) || '';
      });
    }

    // F. List of Headings
    else if (gType.includes('heading')) {
      normG.type = 'list-of-headings';
      normG.title = 'Matching Headings';
      normG.instruction = g.instruction || 'The reading passage has several paragraphs, A-G. Choose the correct heading for each paragraph from the list of headings below.';
      const headingMap = {};
      normG.headings = (g.headings || []).map((h, hIdx) => {
        const roman = romanize(hIdx + 1);
        headingMap[h.toLowerCase().trim()] = roman;
        return {
          id: roman,
          text: h
        };
      });

      const paraLetters = g.paragraphs || ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
      normG.items = qIds.map((id, i) => ({
        id,
        text: `Paragraph ${paraLetters[i] || String.fromCharCode(65 + i)}`,
        paraLetter: paraLetters[i] || String.fromCharCode(65 + i)
      }));

      qIds.forEach(id => {
        const rawAns = rawAnswers[String(id)] || rawAnswers[id];
        const hText = (Array.isArray(rawAns) ? rawAns[0] : rawAns) || '';
        const roman = headingMap[hText.toLowerCase().trim()];
        cleanAnswers[String(id)] = roman || hText;
      });
    }

    // G. Matching Features
    else if (gType.includes('feature')) {
      normG.type = 'matching-features';
      normG.title = 'Matching Features';
      normG.instruction = g.instruction || 'Look at the following statements and the list of researchers below. Match each statement with the correct researcher, A-E.';
      normG.items = qIds.map((id, i) => ({
        id,
        text: (g.statements || [])[i] || ''
      }));
      normG.features = (g.features || []).map((f, fIdx) => ({
        id: String.fromCharCode(65 + fIdx),
        name: f.replace(/^[A-Z]\.?\s*/, '')
      }));
      qIds.forEach(id => {
        const rawAns = rawAnswers[String(id)] || rawAnswers[id];
        const val = Array.isArray(rawAns) ? rawAns[0] : rawAns;
        cleanAnswers[String(id)] = String(val || '').toUpperCase().trim();
      });
    }

    // H. Matching Information
    else if (gType.includes('table') || gType.includes('info') || gType.includes('matrix')) {
      normG.type = 'matching-matrix';
      normG.title = 'Matching Information';
      normG.instruction = g.instruction || 'The reading passage has several paragraphs. Which paragraph contains the following information? Choose the correct letter, A-H.';
      normG.items = qIds.map((id, i) => ({
        id,
        text: (g.information || [])[i] || ''
      }));
      normG.options = g.paragraphs || ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
      qIds.forEach(id => {
        const rawAns = rawAnswers[String(id)] || rawAnswers[id];
        const val = Array.isArray(rawAns) ? rawAns[0] : rawAns;
        cleanAnswers[String(id)] = String(val || '').toUpperCase().trim();
      });
    }

    return normG;
  });

  const setNum = doc.pracNumber ? Number(doc.pracNumber.replace(/\D/g, '')) : 1;

  // Clean evidenceHighlights into uniform structure
  const cleanHighlights = {};
  Object.entries(r.evidenceHighlights || {}).forEach(([q, ev]) => {
    if (typeof ev === 'object' && ev !== null) {
      cleanHighlights[q] = ev.text || ev;
    } else {
      cleanHighlights[q] = ev;
    }
  });

  return {
    source: 'Practice Bank',
    book: 'Practice Bank',
    testNo: setNum,
    pracNumber: doc.pracNumber || `Practice-${setNum}`,
    pracType: doc.type,
    title: `${doc.type} • Set ${setNum}`,
    passages,
    questionGroups,
    evidenceHighlights: cleanHighlights,
    answerExplanations: r.answerExplanations || {},
    answers: cleanAnswers
  };
}

module.exports = {
  romanize,
  normalizePracticeReadingDoc
};
