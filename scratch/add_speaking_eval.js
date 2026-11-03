const fs = require('fs');
const path = require('path');

const evalPath = path.join(__dirname, '../routes/evaluate.js');
let content = fs.readFileSync(evalPath, 'utf8');

const speakingPrompt = `
const SPEAKING_SYSTEM_PROMPT = \`You are an Official Senior Certified IELTS Speaking Examiner trained under Cambridge Assessment English / British Council / IDP marking standards.

Your task is to evaluate the candidate's spoken interview performance fairly, realistically, and accurately based on the 4 OFFICIAL IELTS SPEAKING CRITERIA:
1. Fluency and Coherence (FC): Ability to speak at a steady pace without abnormal hesitation, logical sequencing of ideas, natural use of discourse markers and cohesive connectors.
2. Lexical Resource (LR): Breadth and precision of vocabulary, use of collocations, idioms, paraphrasing, and avoidance of inappropriate word choices.
3. Grammatical Range and Accuracy (GRA): Use of a mix of simple and complex sentence structures, accurate tense usage, subject-verb agreement, and prepositions.
4. Pronunciation & Delivery (PR): Clarity of expression, natural phrasing/chunking, conversational cadence, and rhythm.

### CALIBRATION STANDARDS:
- Band 8.0-9.0: Fluent with only rare hesitation; wide lexical resource with sophisticated collocations; predominantly error-free complex grammar.
- Band 7.0-7.5: Speaks at length without noticeable effort; uses some less common and idiomatic vocabulary; frequently produces complex sentences with good control (occasional minor slips allowed).
- Band 6.0-6.5: Willing to speak at length though with some repetition or hesitation; sufficient vocabulary to discuss topics though inappropriate choices occur; uses a mix of simple and complex forms but with frequent grammatical inaccuracies.
- Band 5.0-5.5: Noticeable pauses, basic vocabulary, simple structures dominate with frequent errors.

Always return a strictly valid JSON object matching this schema:
{
  "fluency_coherence": {
    "score": 7.0,
    "comment": "Analysis of fluency, pacing, connectives, and topic extension."
  },
  "lexical_resource": {
    "score": 7.0,
    "comment": "Analysis of vocabulary range, precision, and collocations."
  },
  "grammar": {
    "score": 6.5,
    "comment": "Analysis of grammatical accuracy, sentence variety, and structures."
  },
  "pronunciation": {
    "score": 7.0,
    "comment": "Analysis of speech delivery, natural phrasing, and cadence."
  },
  "overall_band": 7.0,
  "summary_feedback": "A comprehensive 2-3 paragraph examiner assessment highlighting where the candidate excels and where marks were dropped.",
  "strengths": [
    "Used idiomatic expressions like 'off the beaten track' appropriately.",
    "Extended answers well in Part 2 without significant pauses."
  ],
  "corrections": [
    {
      "original": "I have went there last year",
      "improved": "I went there last year / I had the opportunity to visit last year",
      "reason": "Past simple tense required for a specific past time frame."
    }
  ],
  "recommended_vocabulary": [
    {
      "term": "Picturesque landscape",
      "meaning": "Visually charming or quaint scenery",
      "example": "My hometown is renowned for its picturesque landscapes."
    }
  ]
}
\`;

async function evaluateSpeakingInterview(speakingData) {
  const speakingTests = require("../data/speakingTests");
  const { testId = 1, answers = {} } = speakingData || {};
  const testInfo = speakingTests.find(t => t.id === Number(testId)) || speakingTests[0];

  // Compile formatted prompt of all spoken responses
  const sections = [];
  sections.push("### IELTS SPEAKING TEST PERFORMANCE TRANSCRIPT ###");
  sections.push(\`Test Title: \${testInfo.title}\`);

  // Part 1
  sections.push("\\n--- PART 1: INTRODUCTION & INTERVIEW ---");
  (testInfo.part1.questions || []).forEach((q, idx) => {
    const a = answers[\`p1_q\${idx}\`] || "(No response recorded)";
    sections.push(\`Examiner: \${q}\\nCandidate: \${a}\\n\`);
  });

  // Part 2
  sections.push("--- PART 2: CUE CARD (INDIVIDUAL LONG TURN) ---");
  sections.push(\`Topic: \${testInfo.part2.topic}\`);
  sections.push(\`Prompts: \${testInfo.part2.cueCard.join(", ")}\`);
  const p2Ans = answers["p2_response"] || "(No response recorded)";
  sections.push(\`Candidate Spoken Response (up to 2 min):\\n\${p2Ans}\\n\`);

  // Part 3
  sections.push("--- PART 3: TWO-WAY DISCUSSION ---");
  (testInfo.part3.questions || []).forEach((q, idx) => {
    const a = answers[\`p3_q\${idx}\`] || "(No response recorded)";
    sections.push(\`Examiner: \${q}\\nCandidate: \${a}\\n\`);
  });

  const fullPrompt = sections.join("\\n");

  // 1. Primary Engine: Groq Llama 3.3 70B
  const groqModels = ["openai/gpt-oss-120b", "llama-3.3-70b-versatile"];
  for (const modelName of groqModels) {
    try {
      const completion = await groq.chat.completions.create({
        model: modelName,
        temperature: 0.25,
        messages: [
          { role: "system", content: SPEAKING_SYSTEM_PROMPT },
          { role: "user", content: fullPrompt }
        ],
        response_format: { type: "json_object" }
      });
      const parsed = JSON.parse(completion.choices[0].message.content);
      return normalizeSpeakingEvaluation(parsed);
    } catch (groqErr) {
      console.warn(\`Groq Speaking (\${modelName}) failed:\`, groqErr.message);
    }
  }

  // 2. Fallback Engine: Gemini 2.5 Flash
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: SPEAKING_SYSTEM_PROMPT,
    generationConfig: {
      temperature: 0.25,
      responseMimeType: "application/json"
    }
  });
  const result = await model.generateContent(fullPrompt);
  return normalizeSpeakingEvaluation(JSON.parse(result.response.text()));
}

function normalizeSpeakingEvaluation(raw) {
  const fc = snapHalfBand(raw?.fluency_coherence?.score, 6.0);
  const lr = snapHalfBand(raw?.lexical_resource?.score, 6.0);
  const gr = snapHalfBand(raw?.grammar?.score, 6.0);
  const pr = snapHalfBand(raw?.pronunciation?.score, 6.0);

  const avg = (fc + lr + gr + pr) / 4;
  const overall = snapHalfBand(avg, snapHalfBand(raw?.overall_band, 6.0));

  return {
    fluency_coherence: {
      score: fc,
      comment: String(raw?.fluency_coherence?.comment || "Assessed based on speech continuity, rate, and logical linking.")
    },
    lexical_resource: {
      score: lr,
      comment: String(raw?.lexical_resource?.comment || "Assessed based on lexical range, collocations, and idiomatic appropriateness.")
    },
    grammar: {
      score: gr,
      comment: String(raw?.grammar?.comment || "Assessed based on complex structure variety and accuracy.")
    },
    pronunciation: {
      score: pr,
      comment: String(raw?.pronunciation?.comment || "Assessed based on sentence rhythm, stress, and clarity.")
    },
    overall_band: overall,
    summary_feedback: String(raw?.summary_feedback || ""),
    strengths: Array.isArray(raw?.strengths) ? raw.strengths.filter(Boolean).slice(0, 4) : [],
    corrections: Array.isArray(raw?.corrections) ? raw.corrections.filter(c => c && (c.original || c.improved)).slice(0, 5) : [],
    recommended_vocabulary: Array.isArray(raw?.recommended_vocabulary) ? raw.recommended_vocabulary.slice(0, 5) : []
  };
}
`;

// Routes to append before module.exports = router;
const routesToAppend = `
// ==========================================
// SPEAKING TEST & EVALUATION API
// ==========================================
router.get("/api/speaking-tests", (req, res) => {
  try {
    const speakingTests = require("../data/speakingTests");
    res.json({ success: true, tests: speakingTests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post(["/evaluate-speaking", "/api/evaluate-speaking"], async (req, res) => {
  try {
    const { testId, answers } = req.body || {};
    if (!answers || Object.keys(answers).length === 0) {
      return res.status(400).json({ success: false, message: "No speaking answers provided." });
    }

    const evaluation = await evaluateSpeakingInterview({ testId, answers });
    res.json({ success: true, data: evaluation });
  } catch (error) {
    console.error("Speaking Evaluation Error:", error);
    res.status(500).json({ success: false, message: error.message || "Speaking evaluation failed." });
  }
});
`;

if (!content.includes('SPEAKING_SYSTEM_PROMPT')) {
  // insert speakingPrompt before module.exports
  const exportIdx = content.lastIndexOf('module.exports = router;');
  content = content.substring(0, exportIdx) + speakingPrompt + '\n' + routesToAppend + '\n' + content.substring(exportIdx);
  fs.writeFileSync(evalPath, content, 'utf8');
  console.log('routes/evaluate.js updated with Speaking evaluation engine!');
} else {
  console.log('routes/evaluate.js already contains SPEAKING_SYSTEM_PROMPT');
}
