const fs = require('fs');
const path = require('path');

const evalPath = path.join(__dirname, '../routes/evaluate.js');
let content = fs.readFileSync(evalPath, 'utf8');

const oldEvaluateFuncStart = 'async function evaluateSpeakingInterview(speakingData) {';
const oldEvaluateFuncEnd = 'function normalizeSpeakingEvaluation(raw) {';

const newEvaluateFunc = `async function evaluateSpeakingInterview(speakingData) {
  const speakingTests = require("../data/speakingTests");
  const { testId = 1, part = "all", answers = {} } = speakingData || {};
  const testInfo = speakingTests.find(t => t.id === Number(testId)) || speakingTests[0];

  const targetPart = String(part).toLowerCase();

  // Compile formatted prompt of spoken responses based on practice mode
  const sections = [];
  sections.push("### IELTS SPEAKING TEST PERFORMANCE TRANSCRIPT ###");
  sections.push(\`Test Title: \${testInfo.title}\`);
  sections.push(\`Practice Mode: \${targetPart === "all" ? "Full Test (Parts 1, 2 & 3)" : "Part " + targetPart + " Practice"}\`);

  if (targetPart === "all" || targetPart === "1" || targetPart === "part1") {
    sections.push("\\n--- PART 1: INTRODUCTION & INTERVIEW ---");
    (testInfo.part1.questions || []).forEach((q, idx) => {
      const a = answers[\`p1_q\${idx}\`] || "(No response recorded)";
      sections.push(\`Examiner: \${q}\\nCandidate: \${a}\\n\`);
    });
  }

  if (targetPart === "all" || targetPart === "2" || targetPart === "part2") {
    sections.push("\\n--- PART 2: CUE CARD (INDIVIDUAL LONG TURN) ---");
    sections.push(\`Topic: \${testInfo.part2.topic}\`);
    sections.push(\`Prompts: \${testInfo.part2.cueCard.join(", ")}\`);
    const p2Ans = answers["p2_response"] || "(No response recorded)";
    sections.push(\`Candidate Spoken Response (up to 2 min):\\n\${p2Ans}\\n\`);
  }

  if (targetPart === "all" || targetPart === "3" || targetPart === "part3") {
    sections.push("\\n--- PART 3: TWO-WAY DISCUSSION ---");
    (testInfo.part3.questions || []).forEach((q, idx) => {
      const a = answers[\`p3_q\${idx}\`] || "(No response recorded)";
      sections.push(\`Examiner: \${q}\\nCandidate: \${a}\\n\`);
    });
  }

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

`;

const sIdx = content.indexOf(oldEvaluateFuncStart);
const eIdx = content.indexOf(oldEvaluateFuncEnd);

if (sIdx !== -1 && eIdx !== -1) {
  content = content.substring(0, sIdx) + newEvaluateFunc + content.substring(eIdx);
  // Also update route handler to pass 'part'
  content = content.replace(
    'const { testId, answers } = req.body || {};',
    'const { testId, part, answers } = req.body || {};'
  );
  content = content.replace(
    'const evaluation = await evaluateSpeakingInterview({ testId, answers });',
    'const evaluation = await evaluateSpeakingInterview({ testId, part, answers });'
  );
  fs.writeFileSync(evalPath, content, 'utf8');
  console.log('routes/evaluate.js updated with part-by-part evaluation support!');
} else {
  console.warn('Could not find evaluateSpeakingInterview in routes/evaluate.js');
}
