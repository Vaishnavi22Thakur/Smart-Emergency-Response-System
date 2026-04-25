/**
 * hooks/useEmergencyAPI.js
 *
 * Custom React hook for all API calls to the backend.
 * Keeps API logic out of components — components just call
 * `submitEmergency(text)` and get back structured data.
 *
 * Usage:
 *   const { response, isLoading, error, isOffline, submitEmergency, conversationHistory, reset } = useEmergencyAPI();
 */

import { useState, useCallback } from "react";

function useEmergencyAPI() {
  const [response, setResponse] = useState(null);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOffline, setIsOffline] = useState(false);

  const submitEmergency = useCallback(async (situation) => {
    if (!situation?.trim()) return;

    setIsLoading(true);
    setError(null);
    setIsOffline(false);

    try {
      const res = await fetch("/api/emergency", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ situation, conversationHistory }),
      });

      const result = await res.json();

      if (result.success) {
        setResponse(result.data);
        setConversationHistory(result.conversationHistory);
      } else {
        // Partial failure: offline fallback data available
        if (result.data) {
          setResponse(result.data);
          setIsOffline(true);
        }
        setError(result.error || "Something went wrong.");
      }
    } catch {
      setError("Cannot reach server. Is the backend running on port 5000?");
    } finally {
      setIsLoading(false);
    }
  }, [conversationHistory]);

  const reset = () => {
    setResponse(null);
    setConversationHistory([]);
    setError(null);
    setIsOffline(false);
  };

  return {
    response,
    conversationHistory,
    isLoading,
    error,
    isOffline,
    submitEmergency,
    reset,
  };
}

export default useEmergencyAPI;
