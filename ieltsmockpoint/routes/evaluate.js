const express = require("express");
const router = express.Router();
const Groq = require("groq-sdk");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `You are a certified IELTS Writing examiner. 
Evaluate strictly based on the 4 official criteria:
1. Task Achievement / Task Response
2. Coherence and Cohesion
3. Lexical Resource
4. Grammatical Range and Accuracy

Return ONLY a valid JSON object matching this structure:
{
  "task_response": { "score": 6.5, "comment": "..." },
  "coherence_cohesion": { "score": 6.0, "comment": "..." },
  "lexical_resource": { "score": 6.0, "comment": "..." },
  "grammar": { "score": 6.5, "comment": "..." },
  "overall_band": 6.5,
  "summary_feedback": "...",
  "key_improvements": ["...", "..."]
}`;

async function evaluateSingleEssay(topic, essay) {
  const prompt = `Topic/Question: ${topic}\n\nCandidate Submission:\n${essay}`;

  // ১. সরাসরি দ্রুততম Groq ইঞ্জিন
  try {
    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });
    return JSON.parse(completion.choices[0].message.content);
  } catch (groqErr) {
    console.warn("Groq failed, trying Gemini Flash...", groqErr.message);

    // ২. ফলব্যাক: Gemini
    const model = genAI.getGenerativeModel({
      model: "gemini-3.8-flash",
      systemInstruction: SYSTEM_PROMPT,
      generationConfig: { responseMimeType: "application/json" }
    });
    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text());
  }
}

// এই রাউটটিই আপনার প্র্যাকটিস পেজের ফ্রন্টএন্ড কল করে
router.post("/evaluate-essay", async (req, res) => {
  try {
    const { topic, essay } = req.body;
    if (!essay || essay.trim().length < 5) {
      return res.status(400).json({ success: false, message: "Essay is too short." });
    }

    const evaluation = await evaluateSingleEssay(topic || "IELTS Writing Task", essay);
    res.json({ success: true, data: evaluation });
  } catch (error) {
    console.error("Single Evaluate Route Error:", error);
    res.status(500).json({ success: false, message: error.message || "Evaluation failed." });
  }
});

// ফুল মকের রাউট
router.post("/evaluate-writing-all", async (req, res) => {
  try {
    const { task1, task2 } = req.body;
    const [eval1, eval2] = await Promise.all([
      evaluateSingleEssay(task1.question, task1.essay),
      evaluateSingleEssay(task2.question, task2.essay)
    ]);

    let finalWritingBand = 0;
    if (eval1.overall_band > 0 && eval2.overall_band > 0) {
      const raw = (eval1.overall_band + (eval2.overall_band * 2)) / 3;
      finalWritingBand = Math.round(raw * 2) / 2;
    } else {
      finalWritingBand = eval2.overall_band || eval1.overall_band;
    }

    res.json({ success: true, data: { final_band: finalWritingBand, task1: eval1, task2: eval2 } });
  } catch (err) {
    console.error("Full Mock Route Error:", err);
    res.status(500).json({ success: false, message: "AI evaluation failed" });
  }
});

module.exports = router;