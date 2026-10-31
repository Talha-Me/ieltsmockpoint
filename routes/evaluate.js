const express = require("express");
const router = express.Router();
const Groq = require("groq-sdk");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `You are a Senior Certified IELTS Writing Examiner trained under official IDP / British Council / Cambridge Assessment English marking standards.

Your job is to evaluate the candidate's writing fairly, realistically, and accurately—calibrated to real IELTS exam results (neither artificially harsh nor artificially generous).

### OFFICIAL IELTS BAND CALIBRATION GUIDE (CRITICAL):
- **Band 8.0–9.0:** Fully addresses all parts of the prompt with well-developed, extended, relevant ideas (Task 2) or a crystal-clear overview and skilful key comparisons (Task 1). Natural cohesion, wide vocabulary with precise collocations (Band 8 allows *occasional* inaccuracies in word choice/collocation), and a wide range of complex structures where the majority of sentences are error-free.
- **Band 7.0–7.5:** Addresses all parts of the task with a clear position throughout (Task 2) or a clear overview of main trends/stages/differences (Task 1). Logical paragraphing and cohesive devices (even with minor under-/over-use). Sufficient vocabulary range including some less common lexical items—**official Band 7 explicitly ALLOWS occasional errors in word choice, spelling, and/or word formation**. Uses a variety of complex structures with **frequent error-free sentences, even though a few grammar/article/preposition/punctuation errors occur** without impeding meaning.
- **Band 6.0–6.5:** Addresses the task (some parts more fully than others), relevant main ideas though some may be underdeveloped or repetitive. Coherent overall progression, though linking may feel mechanical. Adequate vocabulary and a mix of simple + complex sentences with **some grammar/spelling errors that rarely reduce communication**.
- **Band 5.0–5.5:** Partially addresses the task, unclear position or missing overview in Task 1, limited idea development, repetitive/basic vocabulary, limited complex sentences, and frequent grammatical errors that cause some difficulty for the reader.
- **Band 4.0 or below:** Tangential/minimal response, memorized/unrelated text, or severe language breakdown.

### MANDATORY EXAMINER GUARDRAILS (DO NOT VIOLATE):
1. **Do NOT Over-Penalize Minor Slips:** In real IELTS, a well-argued 250+ word Task 2 essay (or 150+ word Task 1 report) that has 3–5 minor slips (e.g., an article, plural, preposition, or a discourse marker typo) while keeping the majority of sentences complex and clear STILL earns **Band 7.0** in Grammar/Lexis—do NOT drop it to 5.5 or 6.0 unless errors are frequent across most sentences.
2. **Independent Criterion Marking:** Score each of the 4 criteria independently. Never lower Task Response/Achievement or Coherence & Cohesion because of a few grammar or spelling mistakes.
3. **No Fabricated Statistics Requirement (Task 2):** Never penalize a candidate for not citing academic studies or statistics. Relevant logical reasoning and everyday/general examples fully satisfy Band 7–9 Task Response.
4. **Task 1 Visual Chart / Diagram / Map Fairness:** You only receive the text prompt, not the chart/diagram image. **NEVER penalize or claim that the candidate omitted diagram details or misread chart figures** unless their own sentences contradict each other. Assume their reported figures/stages match the visual, and grade Task Achievement on: (a) presence of a clear Overview, (b) selecting & comparing key features rather than mechanical listing, (c) formal objective tone, and (d) meeting the 150-word minimum. Note: **Task 1 does NOT require a separate conclusion paragraph** if an Overview is included.
5. **Word Count Proportionality:** Task 1 minimum is 150 words; Task 2 minimum is 250 words. Only apply a length penalty to Task Achievement/Response if noticeably under-length (< 135 words for Task 1 or < 225 words for Task 2; heavier penalty if < 100 words).

### OUTPUT FORMAT:
Return ONLY a valid JSON object with this exact schema (use realistic 0.5-step band scores from 0.0 to 9.0, e.g., 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5):
{
  "task_response": {
    "score": "<number 0.0-9.0>",
    "comment": "<2-3 specific sentences citing how well the prompt, overview/position, and idea development met official IELTS descriptors>"
  },
  "coherence_cohesion": {
    "score": "<number 0.0-9.0>",
    "comment": "<2-3 specific sentences on paragraphing, logical progression, referencing, and cohesive devices>"
  },
  "lexical_resource": {
    "score": "<number 0.0-9.0>",
    "comment": "<2-3 specific sentences quoting actual strong collocations/vocabulary used and noting any word-choice or spelling slips>"
  },
  "grammar": {
    "score": "<number 0.0-9.0>",
    "comment": "<2-3 specific sentences on sentence variety, complex structures, and exact grammatical accuracy>"
  },
  "overall_band": "<number: arithmetic mean of the 4 scores rounded to nearest 0.5>",
  "summary_feedback": "<2-3 encouraging, honest examiner sentences explaining why the response achieved this band and what separates it from the next band>",
  "strengths": [
    "<Specific strength 1 quoting or referencing the candidate's writing>",
    "<Specific strength 2 quoting or referencing the candidate's writing>"
  ],
  "corrections": [
    {
      "original": "<exact phrase or sentence from the candidate's text>",
      "improved": "<natural Band 8+ corrected or upgraded version>",
      "reason": "<brief explanation of the grammar, lexical, or style improvement>"
    }
  ],
  "key_improvements": [
    "<Concrete, actionable improvement step 1 tailored to this script>",
    "<Concrete, actionable improvement step 2 tailored to this script>",
    "<Concrete, actionable improvement step 3 tailored to this script>"
  ]
}`;

function inferTaskType(topic, explicitTaskType) {
  if (explicitTaskType) {
    const t = String(explicitTaskType).toLowerCase();
    if (t.includes("1") || t === "task1") return "task1";
    if (t.includes("2") || t === "task2") return "task2";
  }
  const q = String(topic || "").toLowerCase();
  if (
    /\b(chart|graph|table|diagram|map|maps|process|pie|bar|line graph|summarise the information|summarize the information|write a letter|dear sir|task 1)\b/.test(q)
  ) {
    return "task1";
  }
  return "task2";
}

function snapHalfBand(val, fallback = 0) {
  const num = Number(val);
  if (!Number.isFinite(num)) return fallback;
  const clamped = Math.min(9, Math.max(0, num));
  return Math.round(clamped * 2) / 2;
}

function buildEmptyEvaluation(taskLabel) {
  return {
    not_submitted: true,
    task_response: { score: 0, comment: `No ${taskLabel} response was submitted.` },
    coherence_cohesion: { score: 0, comment: "Not applicable — no text submitted." },
    lexical_resource: { score: 0, comment: "Not applicable — no text submitted." },
    grammar: { score: 0, comment: "Not applicable — no text submitted." },
    overall_band: 0,
    summary_feedback: `You did not submit an answer for ${taskLabel}. Write at least the minimum required words to receive an IELTS band assessment.`,
    strengths: [],
    corrections: [],
    key_improvements: [`Complete ${taskLabel} within the recommended time limit.`]
  };
}

function normalizeEvaluation(raw) {
  const tr = snapHalfBand(raw?.task_response?.score, 0);
  const cc = snapHalfBand(raw?.coherence_cohesion?.score, 0);
  const lr = snapHalfBand(raw?.lexical_resource?.score, 0);
  const gr = snapHalfBand(raw?.grammar?.score, 0);

  const avg = (tr + cc + lr + gr) / 4;
  const computedOverall = snapHalfBand(avg, snapHalfBand(raw?.overall_band, 0));

  return {
    task_response: {
      score: tr,
      comment: String(raw?.task_response?.comment || "Evaluated based on official Task Response / Achievement descriptors.")
    },
    coherence_cohesion: {
      score: cc,
      comment: String(raw?.coherence_cohesion?.comment || "Evaluated based on paragraphing, progression, and cohesion.")
    },
    lexical_resource: {
      score: lr,
      comment: String(raw?.lexical_resource?.comment || "Evaluated based on vocabulary range, precision, and spelling.")
    },
    grammar: {
      score: gr,
      comment: String(raw?.grammar?.comment || "Evaluated based on complex sentence structures and grammatical control.")
    },
    overall_band: computedOverall,
    summary_feedback: String(raw?.summary_feedback || ""),
    strengths: Array.isArray(raw?.strengths) ? raw.strengths.filter(Boolean).slice(0, 4) : [],
    corrections: Array.isArray(raw?.corrections)
      ? raw.corrections
          .filter((c) => c && (c.original || c.improved))
          .slice(0, 5)
          .map((c) => ({
            original: String(c.original || ""),
            improved: String(c.improved || ""),
            reason: String(c.reason || "")
          }))
      : [],
    key_improvements: Array.isArray(raw?.key_improvements) ? raw.key_improvements.filter(Boolean).slice(0, 5) : []
  };
}

async function evaluateSingleEssay(topic, essay, explicitTaskType) {
  const cleanEssay = String(essay || "").trim();
  const wordCount = cleanEssay ? cleanEssay.split(/\s+/).filter(Boolean).length : 0;
  const taskType = inferTaskType(topic, explicitTaskType);
  const isTask1 = taskType === "task1";
  const taskLabel = isTask1 ? "IELTS Writing Task 1" : "IELTS Writing Task 2";
  const minWords = isTask1 ? 150 : 250;

  if (wordCount < 8) {
    return buildEmptyEvaluation(taskLabel);
  }

  const prompt = [
    `Task Type: ${taskLabel} (Minimum requirement: ${minWords} words${isTask1 ? "; Academic/General Task 1 — assess Overview & key features; NO conclusion or personal opinion needed; visual chart/diagram image is not attached so trust candidate's cited figures/stages" : "; Essay — assess clear position throughout, extended arguments, and conclusion"})`,
    `Candidate Exact Word Count: ${wordCount} words`,
    `Prompt / Question:\n${topic || taskLabel}`,
    `Candidate Submission:\n${cleanEssay}`,
    `Provide up to 4 specific sentence-level corrections/upgrades from the candidate's actual text in "corrections", 2-3 specific strengths in "strengths", and calibrate scores faithfully to real IELTS official band descriptors.`
  ].join("\n\n");

  // 1. Primary Groq Engine (low temperature for consistent examiner calibration)
  const groqModels = ["openai/gpt-oss-120b", "llama-3.3-70b-versatile"];
  for (const modelName of groqModels) {
    try {
      const completion = await groq.chat.completions.create({
        model: modelName,
        temperature: 0.2,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" }
      });
      const parsed = JSON.parse(completion.choices[0].message.content);
      return normalizeEvaluation(parsed);
    } catch (groqErr) {
      console.warn(`Groq (${modelName}) failed:`, groqErr.message);
    }
  }

  // 2. Fallback: Gemini 2.5 Flash
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: SYSTEM_PROMPT,
    generationConfig: {
      temperature: 0.2,
      responseMimeType: "application/json"
    }
  });
  const result = await model.generateContent(prompt);
  return normalizeEvaluation(JSON.parse(result.response.text()));
}

// Single Task Evaluation Route (Practice Hub & Single Cambridge Task)
router.post(["/evaluate-essay", "/api/evaluate-essay"], async (req, res) => {
  try {
    const { topic, essay, taskType } = req.body;
    if (!essay || String(essay).trim().length < 5) {
      return res.status(400).json({ success: false, message: "Essay is too short." });
    }

    const evaluation = await evaluateSingleEssay(topic || "IELTS Writing Task", essay, taskType);
    res.json({ success: true, data: evaluation });
  } catch (error) {
    console.error("Single Evaluate Route Error:", error);
    res.status(500).json({ success: false, message: error.message || "Evaluation failed." });
  }
});

// Full Mock / Full Cambridge Writing Evaluation Route
router.post(["/evaluate-writing-all", "/api/evaluate-writing-all"], async (req, res) => {
  try {
    const { task1 = {}, task2 = {} } = req.body || {};
    const [eval1, eval2] = await Promise.all([
      evaluateSingleEssay(task1.question, task1.essay, "task1"),
      evaluateSingleEssay(task2.question, task2.essay, "task2")
    ]);

    let finalWritingBand = 0;
    if (!eval1.not_submitted && !eval2.not_submitted && eval1.overall_band > 0 && eval2.overall_band > 0) {
      // Official IELTS Writing weighting: Task 2 carries twice the weight of Task 1
      const raw = (eval1.overall_band + eval2.overall_band * 2) / 3;
      finalWritingBand = Math.round(raw * 2) / 2;
    } else if (!eval2.not_submitted && eval2.overall_band > 0) {
      finalWritingBand = eval2.overall_band;
    } else if (!eval1.not_submitted && eval1.overall_band > 0) {
      finalWritingBand = eval1.overall_band;
    }

    res.json({
      success: true,
      data: {
        final_band: finalWritingBand,
        task1: eval1,
        task2: eval2
      }
    });
  } catch (err) {
    console.error("Full Mock Route Error:", err);
    res.status(500).json({ success: false, message: "AI evaluation failed" });
  }
});

module.exports = router;
