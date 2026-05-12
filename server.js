import cors from "cors";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 8787);
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

const ANALYZE_SYSTEM_PROMPT = `You are Samsung Guardian, a relationship safety AI.
Analyze conversation text for manipulation patterns.
Return only JSON with this schema:
{
  "label": "one of: Gaslighting | Love Bombing | Guilt-tripping | Silent Treatment | Boundary Pushing | Healthy",
  "confidence": <number 0-100>,
  "risk_score": <number 0-100>,
  "explanation": "<2-3 sentence plain English explanation>",
  "signals": ["<signal 1>", "<signal 2>", "<signal 3>"],
  "recommendation": "<1 sentence actionable advice>"
}`;

const COACH_SYSTEM_PROMPT = `You are Samsung Guardian's Reply Coach.
Rewrite a user's reply to be safer and boundary-reinforcing.
Return only JSON with this schema:
{
  "coached_reply": "<balanced rewritten reply>",
  "boundary_reply": "<firmer boundary-setting alternative>",
  "why": "<1-2 sentences why this is safer>",
  "tone_notes": "<brief note on tone preservation>"
}`;

function parseAssistantJson(text) {
  const cleaned = text.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
}

async function callAnthropic({ systemPrompt, userPrompt }) {
  if (!ANTHROPIC_API_KEY) {
    throw new Error("Server missing ANTHROPIC_API_KEY.");
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Anthropic API error: ${response.status} ${message}`);
  }

  const payload = await response.json();
  const textBlock = payload.content?.find((block) => block.type === "text");
  if (!textBlock?.text) throw new Error("Anthropic returned no text payload.");
  return parseAssistantJson(textBlock.text);
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/analyze", async (req, res) => {
  const conversation = req.body?.conversation;
  if (!conversation || typeof conversation !== "string") {
    return res.status(400).json({ error: "conversation is required." });
  }

  try {
    const result = await callAnthropic({
      systemPrompt: ANALYZE_SYSTEM_PROMPT,
      userPrompt: `Conversation:\n${conversation}`,
    });
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message || "Analysis failed." });
  }
});

app.post("/api/coach", async (req, res) => {
  const rawReply = req.body?.rawReply;
  const analysisContext = req.body?.analysisContext || null;
  if (!rawReply || typeof rawReply !== "string") {
    return res.status(400).json({ error: "rawReply is required." });
  }

  try {
    const contextText = analysisContext
      ? `Context label: ${analysisContext.label}\nContext explanation: ${analysisContext.explanation}\nRisk score: ${analysisContext.risk_score}`
      : "No prior analysis context provided.";
    const result = await callAnthropic({
      systemPrompt: COACH_SYSTEM_PROMPT,
      userPrompt: `${contextText}\n\nRaw reply:\n${rawReply}`,
    });
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message || "Coaching failed." });
  }
});

app.listen(PORT, () => {
  console.log(`Samsung Guardian API running on http://localhost:${PORT}`);
});
