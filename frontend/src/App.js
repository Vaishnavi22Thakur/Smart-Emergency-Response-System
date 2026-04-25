/**
 * App.js — Root component for AI Smart Emergency Response System
 *
 * Uses custom hooks:
 *   - useEmergencyAPI  → handles all fetch/state for AI responses
 *
 * Coordinates all child components and passes data down as props.
 */

import React, { useState } from "react";
import EmergencyInput from "./components/EmergencyInput";
import ResponseCard from "./components/ResponseCard";
import SOSButton from "./components/SOSButton";
import VoiceHandler from "./components/VoiceHandler";
import FollowUpPanel from "./components/FollowUpPanel";
import useEmergencyAPI from "./hooks/useEmergencyAPI";
import { buildTTSText } from "./utils/formatResponse";
import "./styles/App.css";

function App() {
  // ─── Custom Hook: all API state in one place ──────────────────────────────
  const {
    response,
    conversationHistory,
    isLoading,
    error,
    isOffline,
    submitEmergency,
    reset,
  } = useEmergencyAPI();

  // ─── Local UI state ───────────────────────────────────────────────────────
  const [inputText, setInputText]   = useState("");
  const [transcript, setTranscript] = useState("");

  // ─── Handlers ─────────────────────────────────────────────────────────────
  const handleSubmit = (situation) => {
    submitEmergency(situation);
  };

  const handleVoiceTranscript = (text) => {
    setTranscript(text);
    setInputText(text);
  };

  const handleFollowUp = (answer) => {
    submitEmergency(answer);
  };

  const handleReset = () => {
    reset();
    setInputText("");
    setTranscript("");
  };

  return (
    <div className="app">

      {/* ── Header ── */}
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">🚨</span>
            <div>
              <h1>AI Emergency Response</h1>
              <p>Real-time AI guidance when it matters most</p>
            </div>
          </div>
          <SOSButton conversationHistory={conversationHistory} />
        </div>
      </header>

      {/* ── Main ── */}
      <main className="app-main">

        {isOffline && (
          <div className="banner banner-warning">
            ⚠️ AI unavailable — showing offline guidance. Always call <strong>112</strong> in real emergencies.
          </div>
        )}

        {error && !isOffline && (
          <div className="banner banner-error">❌ {error}</div>
        )}

        <EmergencyInput
          onSubmit={handleSubmit}
          isLoading={isLoading}
          inputText={inputText}
          setInputText={setInputText}
          onVoiceTranscript={handleVoiceTranscript}
        />

        {transcript && (
          <div className="transcript-box">
            <span className="transcript-label">🎙️ You said:</span>
            <span className="transcript-text">"{transcript}"</span>
          </div>
        )}

        {isLoading && (
          <div className="loading-container">
            <div className="loading-spinner" />
            <p>Analyzing emergency situation...</p>
          </div>
        )}

        {response && !isLoading && (
          <>
            <ResponseCard response={response} />

            {response.followUpQuestions?.length > 0 && (
              <FollowUpPanel
                questions={response.followUpQuestions}
                onAnswer={handleFollowUp}
              />
            )}

            <VoiceHandler textToRead={buildTTSText(response)} />

            <button className="btn-reset" onClick={handleReset}>
              ↺ Start New Emergency
            </button>
          </>
        )}

        {!response && !isLoading && (
          <div className="welcome-state">
            <div className="welcome-grid">
              {[
                { icon: "🔥", label: "Fire" },
                { icon: "🚗", label: "Accident" },
                { icon: "❤️", label: "Heart Attack" },
                { icon: "🌊", label: "Flooding" },
                { icon: "⚡", label: "Electric Shock" },
                { icon: "🍽️", label: "Choking" },
              ].map(({ icon, label }) => (
                <button
                  key={label}
                  className="quick-chip"
                  onClick={() => {
                    setInputText(label);
                    handleSubmit(label);
                  }}
                >
                  {icon} {label}
                </button>
              ))}
            </div>
            <p className="welcome-hint">Or type / speak your emergency above ↑</p>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>
          🆘 Always call <strong>112</strong> for life-threatening emergencies ·
          AI guidance is supplementary only
        </p>
      </footer>
    </div>
  );
}

export default App;
