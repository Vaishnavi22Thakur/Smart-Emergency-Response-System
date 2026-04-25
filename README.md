# 🚨 AI Smart Emergency Response System

An AI-powered web application that provides real-time, step-by-step guidance during emergencies.

---

## 📁 Project Structure

```
ai-emergency-response/
│
├── backend/                    # Node.js + Express API server
│   ├── server.js               # Main server (all routes + AI logic)
│   ├── package.json            # Backend dependencies
│   └── .env.example            # Environment variable template
│
├── frontend/                   # React frontend
│   ├── public/
│   │   └── index.html          # HTML entry point
│   └── src/
│       ├── App.js              # Root component (state management)
│       ├── index.js            # React entry point
│       ├── components/
│       │   ├── EmergencyInput.js   # Text + voice input
│       │   ├── ResponseCard.js     # AI response display (3 cards)
│       │   ├── VoiceHandler.js     # Text-to-speech reader
│       │   ├── SOSButton.js        # SOS alert sender
│       │   └── FollowUpPanel.js    # Context-aware follow-ups
│       └── styles/
│           ├── App.css             # Global styles + design tokens
│           ├── EmergencyInput.css
│           ├── ResponseCard.css
│           ├── SOSButton.css
│           ├── VoiceHandler.css
│           └── FollowUpPanel.css
│
└── README.md                   # This file
```

---

## ⚡ Quick Start

### Prerequisites
- **Node.js** v18 or higher — [Download here](https://nodejs.org/)
- **Anthropic API Key** — [Get one here](https://console.anthropic.com/)

---

### Step 1 — Set up the Backend

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create your .env file
cp .env.example .env
```

Now open `.env` and add your API key:
```
ANTHROPIC_API_KEY=sk-ant-your-key-here
PORT=5000
```

Start the backend:
```bash
node server.js
# OR for auto-restart on file changes:
npm run dev
```

You should see:
```
🚨 Emergency Response API running on http://localhost:5000
```

---

### Step 2 — Set up the Frontend

Open a **new terminal window**:

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start the React app
npm start
```

The app will open automatically at **http://localhost:3000**

---

## 🔑 Environment Variables

| Variable | Where | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | backend/.env | Your Anthropic Claude API key |
| `PORT` | backend/.env | Backend port (default: 5000) |

---

## 🌟 Features

| Feature | How It Works |
|---|---|
| **Emergency Input** | Type or speak your emergency situation |
| **AI Guidance** | Claude generates Immediate Action + Steps + Do Not list |
| **Voice Input** | Web Speech API (Chrome/Edge) |
| **Voice Output** | Web Speech Synthesis reads instructions aloud |
| **Follow-up Questions** | AI asks 1-2 clarifying questions to refine advice |
| **SOS Button** | Sends your location + situation to a simulated alert system |
| **Quick Chips** | One-click common emergencies (Fire, Accident, etc.) |
| **Offline Fallback** | Pre-written guidance for Fire, Accident, Heart Attack if API fails |
| **Error Handling** | Graceful degradation with helpful error messages |

---

## 🏗️ API Endpoints

### `POST /api/emergency`
Send an emergency situation, get AI guidance.

**Request body:**
```json
{
  "situation": "fire in the kitchen",
  "conversationHistory": []
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "immediateAction": "Get everyone out immediately...",
    "steps": ["Call 112", "Close doors", "..."],
    "doNot": ["Do NOT use elevator", "..."],
    "followUpQuestions": ["Is anyone trapped?"],
    "severity": "critical",
    "callEmergencyServices": true,
    "emergencyNumber": "112"
  },
  "conversationHistory": [...]
}
```

### `POST /api/sos`
Send a simulated SOS alert.

**Request body:**
```json
{
  "location": { "lat": "28.61", "lng": "77.20", "address": "New Delhi" },
  "message": "fire in kitchen",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### `GET /api/health`
Check if the server is running.

---

## 🛠️ Customization

### Change AI Behavior
Edit the `SYSTEM_PROMPT` in `backend/server.js` to adjust how Claude responds.

### Add More Offline Fallbacks
In `backend/server.js`, add more `if` conditions in the `getFallbackResponse()` function.

### Style the App
All CSS uses CSS variables defined in `frontend/src/styles/App.css` under `:root { }`. Change colors there to retheme the whole app.

### Add More Quick Chips
In `frontend/src/App.js`, add items to the quick chip array:
```js
{ icon: "⚡", label: "Electric Shock" }
```

---

## 🚧 Known Limitations & Next Steps

- **SOS is simulated** — integrate Twilio for real SMS alerts
- **No database** — add MongoDB/PostgreSQL to log emergencies
- **No auth** — add user accounts for emergency contact management
- **Voice recognition** — only works in Chrome/Edge (not Safari/Firefox)
- **Single language** — add i18n for multilingual support

---

## ⚠️ Disclaimer

This app provides AI-generated guidance as a supplement only. **Always call your local emergency number (112, 911, 999, etc.) for life-threatening emergencies.** AI can make mistakes. This tool is not a replacement for professional emergency services.

---

## 📝 License

MIT — free to use, modify, and distribute.
