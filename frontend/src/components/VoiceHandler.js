/**
 * VoiceHandler.js — Text-to-Speech component
 *
 * Reads the AI response aloud using the Web Speech API.
 * Users can play/pause the voice reading.
 * Falls back gracefully if TTS is not supported.
 */

import React, { useState, useEffect, useRef } from "react";
import "../styles/VoiceHandler.css";

function VoiceHandler({ textToRead }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [ttsSupported, setTtsSupported] = useState(false);
  const utteranceRef = useRef(null);

  // ─── Check TTS Support ─────────────────────────────────────────────────────
  useEffect(() => {
    if ("speechSynthesis" in window) {
      setTtsSupported(true);
    }

    // Stop speech when component unmounts or text changes
    return () => {
      window.speechSynthesis?.cancel();
      setIsPlaying(false);
    };
  }, [textToRead]);

  // ─── Play / Pause ──────────────────────────────────────────────────────────
  const togglePlay = () => {
    if (!ttsSupported) return;

    if (isPlaying) {
      // Stop speaking
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      // Start speaking
      window.speechSynthesis.cancel(); // Cancel any previous

      utteranceRef.current = new SpeechSynthesisUtterance(textToRead);
      utteranceRef.current.rate = 0.9; // Slightly slower — easier to follow
      utteranceRef.current.pitch = 1;
      utteranceRef.current.volume = 1;

      // When speech finishes
      utteranceRef.current.onend = () => setIsPlaying(false);
      utteranceRef.current.onerror = () => setIsPlaying(false);

      window.speechSynthesis.speak(utteranceRef.current);
      setIsPlaying(true);
    }
  };

  // Don't render if TTS not supported
  if (!ttsSupported) return null;

  return (
    <div className="voice-handler">
      <button
        className={`btn-tts ${isPlaying ? "btn-tts--playing" : ""}`}
        onClick={togglePlay}
        title={isPlaying ? "Stop reading" : "Read instructions aloud"}
      >
        {isPlaying ? (
          <>⏹ Stop Reading</>
        ) : (
          <>🔊 Read Instructions Aloud</>
        )}
      </button>
      {isPlaying && (
        <span className="tts-indicator">
          <span className="tts-dot" />
          Reading aloud...
        </span>
      )}
    </div>
  );
}

export default VoiceHandler;
