/**
 * hooks/useVoiceInput.js
 *
 * Custom React hook that encapsulates all Web Speech API logic
 * for speech-to-text. Extracted from EmergencyInput so it can
 * be reused anywhere in the app.
 *
 * Usage:
 *   const { isListening, isSupported, startListening, stopListening } = useVoiceInput({ onResult, onError });
 */

import { useState, useRef, useEffect } from "react";

function useVoiceInput({ onResult, onError }) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check browser support
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    setIsSupported(true);

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      onResult(text);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech error:", event.error);
      if (onError) onError(event.error);
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
    };
  }, [onResult, onError]);

  const startListening = () => {
    if (!isSupported || isListening) return;
    recognitionRef.current.start();
    setIsListening(true);
  };

  const stopListening = () => {
    if (!isListening) return;
    recognitionRef.current.stop();
    setIsListening(false);
  };

  return { isListening, isSupported, startListening, stopListening };
}

export default useVoiceInput;
