import { useState, useCallback } from "react";

const API_URL = process.env.REACT_APP_API_URL;

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
      const res = await fetch(`${API_URL}/api/emergency`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ situation, conversationHistory }),
      });

      const result = await res.json();

      if (result.success) {
        setResponse(result.data);
        setConversationHistory(result.conversationHistory);
      } else {
        if (result.data) {
          setResponse(result.data);
          setIsOffline(true);
        }
        setError(result.error || "Something went wrong.");
      }
    } catch (err) {
      console.error("API ERROR:", err);
      setError("Cannot reach backend server.");
      setIsOffline(true);
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