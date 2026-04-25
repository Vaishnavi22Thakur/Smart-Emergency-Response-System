const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const SYSTEM_PROMPT = `You are an AI Emergency Response Assistant. Respond ONLY with valid JSON, no markdown, no backticks, no extra text.

{
  "immediateAction": "most critical thing to do RIGHT NOW",
  "steps": ["Step 1", "Step 2", "Step 3", "Step 4"],
  "doNot": ["Do NOT...", "Do NOT..."],
  "followUpQuestions": ["Question 1?", "Question 2?"],
  "severity": "low|medium|high|critical",
  "callEmergencyServices": true,
  "emergencyNumber": "112"
}`;

async function callGemini(messages) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not set in .env file");

  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents,
        generationConfig: { maxOutputTokens: 1024, temperature: 0.3 },
      }),
    }
  );

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || "Gemini API error");
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

app.post("/api/emergency", async (req, res) => {
  const { situation, conversationHistory = [] } = req.body;

  if (!situation?.trim()) {
    return res.status(400).json({ error: "Please describe your emergency." });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.json({
      success: false,
      error: "GEMINI_API_KEY not found in .env file",
      data: getFallbackResponse(situation),
    });
  }

  const messages = [
    ...conversationHistory,
    { role: "user", content: `Emergency: ${situation}` },
  ];

  try {
    const rawText = await callGemini(messages);
    const cleaned = rawText.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = getFallbackResponse(situation);
    }

    res.json({
      success: true,
      data: parsed,
      conversationHistory: [...messages, { role: "assistant", content: rawText }],
    });
  } catch (error) {
    console.error("Gemini Error:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      data: getFallbackResponse(situation),
    });
  }
});

app.post("/api/sos", async (req, res) => {
  const { location, message, timestamp } = req.body;
  console.log("SOS ALERT:", { location, message, timestamp });
  await new Promise((r) => setTimeout(r, 1000));
  res.json({ success: true, alertId: `SOS-${Date.now()}`, timestamp: new Date().toISOString() });
});

app.get("/", (req, res) => {
  res.send("🚀 AI Emergency Response Backend is running!");
});
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Backend is running" });
});
function getFallbackResponse(situation) {
  const s = situation.toLowerCase();
  if (s.includes("fire") || s.includes("smoke")) {
    return {
      immediateAction: "Get everyone out of the building immediately. Do NOT use elevators.",
      steps: ["Shout FIRE to alert everyone", "Use nearest staircase to evacuate", "Close doors behind you", "Call 112 once outside", "Do NOT go back inside"],
      doNot: ["Do NOT use elevators", "Do NOT open hot doors", "Do NOT go back inside"],
      followUpQuestions: ["Is anyone trapped?", "How big is the fire?"],
      severity: "critical", callEmergencyServices: true, emergencyNumber: "112",
    };
  }
  if (s.includes("accident") || s.includes("injury") || s.includes("bleeding")) {
    return {
      immediateAction: "Ensure scene is safe, then call 112 immediately.",
      steps: ["Check for danger", "Call 112 with your location", "Do NOT move anyone with spinal injury", "Apply pressure to bleeding wounds", "Keep person warm and calm"],
      doNot: ["Do NOT move neck/back injury", "Do NOT leave them alone", "Do NOT give food or water"],
      followUpQuestions: ["Is the person conscious?", "Is there heavy bleeding?"],
      severity: "high", callEmergencyServices: true, emergencyNumber: "112",
    };
  }
  return {
    immediateAction: "Stay calm. Call 112 if there is immediate danger to life.",
    steps: ["Assess the situation", "Call 112 if needed", "Move to safety", "Help others if safe", "Wait for emergency services"],
    doNot: ["Do NOT panic", "Do NOT put yourself in danger"],
    followUpQuestions: ["What happened?", "Is anyone injured?"],
    severity: "medium", callEmergencyServices: true, emergencyNumber: "112",
  };
}
console.log("ENV CHECK:", process.env.GEMINI_API_KEY);
app.listen(PORT, () => {
  console.log(`\n🚨 Server running → http://localhost:${PORT}`);
  console.log(`   Health check  → http://localhost:${PORT}/api/health\n`);

  if (process.env.GEMINI_API_KEY) {
    console.log("✅ GEMINI_API_KEY loaded successfully");
  } else {
    console.log("❌ GEMINI_API_KEY is missing!");
    console.log("👉 Add it in Render → Environment Variables");
  }
});