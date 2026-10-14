import dotenv from "dotenv";
dotenv.config();

import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are a certified IELTS Writing examiner. 
Evaluate the essay strictly according to the 4 criteria:
1. Task Response
2. Coherence and Cohesion
3. Lexical Resource
4. Grammatical Range and Accuracy

Return ONLY a valid JSON object matching this structure:
{
  "task_response": { "score": 7.0, "comment": "..." },
  "coherence_cohesion": { "score": 6.5, "comment": "..." },
  "lexical_resource": { "score": 7.0, "comment": "..." },
  "grammar": { "score": 6.5, "comment": "..." },
  "overall_band": 7.0,
  "summary_feedback": "...",
  "key_improvements": ["...", "..."]
}`;

async function evaluate(topic, essay) {
  const content = `Topic: ${topic}\n\nEssay: ${essay}`;

  // ১. প্রথমে Google Gemini দিয়ে চেষ্টা
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-3.8-flash",
      systemInstruction: SYSTEM_PROMPT,
      generationConfig: { responseMimeType: "application/json" }
    });
    const result = await model.generateContent(content);
    return JSON.parse(result.response.text());
  } catch (geminiErr) {
    console.warn("Gemini unavailable/busy, switching to Groq...", geminiErr.message);

    // ২. ফলব্যাক: Groq
    const groqModels = ["openai/gpt-oss-120b", "openai/gpt-oss-20b", "qwen/qwen3.8-27b"];
    for (const modelName of groqModels) {
      try {
        console.log(`Evaluating using Groq model: ${modelName}`);
        const completion = await groq.chat.completions.create({
          model: modelName,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: content }
          ],
          response_format: { type: "json_object" }
        });
        return JSON.parse(completion.choices[0].message.content);
      } catch (groqErr) {
        console.warn(`Groq model ${modelName} failed: ${groqErr.message}. Trying next...`);
      }
    }
  }

  throw new Error("All AI engines failed to generate response.");
}

async function run() {
  const sampleTopic = "Some people think that universities should provide graduates with the knowledge and skills needed in the workplace. Others think that the true function of a university should be to give access to knowledge for its own sake, regardless of whether the course is useful to an employer. Discuss both views and give your opinion.";
  const sampleEssay = "Education is crucial for personal and national growth. While some argue that universities must prepare students for jobs, others believe education should focus on pure knowledge. In my opinion, practical training is more important in modern competitive society because it prepares graduates for real-life challenges.";

  console.log("Evaluating essay...");
  const result = await evaluate(sampleTopic, sampleEssay);
  console.log("\n--- Evaluation Result ---\n", JSON.stringify(result, null, 2));
}

run();