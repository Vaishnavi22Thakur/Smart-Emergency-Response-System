/**
 * EmergencyInput.js — The main text/voice input component
 *
 * Features:
 * - Text input for describing emergency
 * - Microphone button (Web Speech API)
 * - Submit button
 * - Falls back to text if voice not supported
 */

import React, { useState, useRef, useEffect } from "react";
import "../styles/EmergencyInput.css";

function EmergencyInput({ onSubmit, isLoading, inputText, setInputText, onVoiceTranscript }) {
  const [isListening, setIsListening] = useState(false); // Is mic active?
  const [voiceSupported, setVoiceSupported] = useState(false); // Browser supports voice?
  const recognitionRef = useRef(null); // Speech recognition instance

  // ─── Check Voice Support on Mount ─────────────────────────────────────────
  useEffect(() => {
    // Check if Web Speech API is available in this browser
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setVoiceSupported(true);
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      // When speech is recognized, update input
      recognitionRef.current.onresult = (event) => {
        const spokenText = event.results[0][0].transcript;
        setInputText(spokenText);
        onVoiceTranscript(spokenText);
        setIsListening(false);
      };

      // Handle errors
      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      // When recognition ends
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    // Cleanup on unmount
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [setInputText, onVoiceTranscript]);

  // ─── Toggle Voice Recognition ──────────────────────────────────────────────
  const toggleVoice = () => {
    if (!voiceSupported) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setInputText(""); // Clear input before speaking
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  // ─── Handle Form Submit ────────────────────────────────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim() && !isLoading) {
      onSubmit(inputText.trim());
    }
  };

  // ─── Handle Enter Key ─────────────────────────────────────────────────────
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="emergency-input-container">
      <form onSubmit={handleSubmit} className="emergency-form">
        <div className="input-row">
          {/* Text Area */}
          <textarea
            className={`emergency-textarea ${isListening ? "listening" : ""}`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isListening
                ? "🎙️ Listening... speak now"
                : "Describe your emergency... (e.g., 'fire in the kitchen', 'someone collapsed')"
            }
            disabled={isLoading || isListening}
            rows={3}
          />

          {/* Action Buttons Column */}
          <div className="input-actions">
            {/* Microphone Button */}
            {voiceSupported ? (
              <button
                type="button"
                className={`btn-mic ${isListening ? "btn-mic--active" : ""}`}
                onClick={toggleVoice}
                disabled={isLoading}
                title={isListening ? "Stop listening" : "Speak your emergency"}
              >
                {isListening ? "⏹" : "🎙️"}
              </button>
            ) : (
              <div className="voice-not-supported" title="Voice not supported in this browser">
                🎙️✕
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="btn-submit"
              disabled={isLoading || !inputText.trim()}
            >
              {isLoading ? <span className="btn-spinner" /> : "GET HELP"}
            </button>
          </div>
        </div>

        {/* Voice not supported fallback notice */}
        {!voiceSupported && (
          <p className="voice-fallback-notice">
            ⓘ Voice input not available in this browser. Please type your emergency.
          </p>
        )}
      </form>
    </div>
  );
}

export default EmergencyInput;
