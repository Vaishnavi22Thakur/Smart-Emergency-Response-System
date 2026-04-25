/**
 * SOSButton.js — SOS Alert Button
 *
 * When clicked:
 * 1. Gets user's geolocation (or uses mock)
 * 2. Sends SOS to backend API
 * 3. Shows confirmation UI
 *
 * In a real app this would notify emergency contacts via SMS/push notification.
 */

import React, { useState } from "react";
import "../styles/SOSButton.css";

function SOSButton({ conversationHistory }) {
  const [sosState, setSosState] = useState("idle"); // idle | locating | sending | sent | error
  const [alertId, setAlertId] = useState(null);
  const [locationInfo, setLocationInfo] = useState(null);

  // ─── Handle SOS Click ──────────────────────────────────────────────────────
  const handleSOS = async () => {
    // Don't trigger if already sending
    if (sosState !== "idle") return;

    // Confirm before sending
    const confirmed = window.confirm(
      "🚨 Send SOS Alert?\n\nThis will share your location and emergency details with emergency contacts."
    );
    if (!confirmed) return;

    setSosState("locating");

    let location = { lat: null, lng: null, address: "Location unavailable" };

    // ── Try to get real GPS location ──────────────────────────────────────
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 5000,
          maximumAge: 0,
        });
      });
      location = {
        lat: position.coords.latitude.toFixed(6),
        lng: position.coords.longitude.toFixed(6),
        address: `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`,
      };
    } catch {
      // GPS failed — use mock location (common in development)
      location = {
        lat: "28.6139",
        lng: "77.2090",
        address: "New Delhi (approximate — GPS unavailable)",
      };
    }

    setLocationInfo(location);
    setSosState("sending");

    // ── Build emergency message from conversation ─────────────────────────
    const lastUserMessage = conversationHistory
      .filter((m) => m.role === "user")
      .slice(-1)[0]?.content || "Unknown emergency";

    // ── Send to backend ───────────────────────────────────────────────────
    try {
      const response = await fetch("/api/sos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location,
          message: lastUserMessage,
          timestamp: new Date().toISOString(),
        }),
      });

      const result = await response.json();

      if (result.success) {
        setAlertId(result.alertId);
        setSosState("sent");
      } else {
        setSosState("error");
      }
    } catch {
      setSosState("error");
    }
  };

  // ─── Reset SOS State ───────────────────────────────────────────────────────
  const handleReset = () => {
    setSosState("idle");
    setAlertId(null);
    setLocationInfo(null);
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  if (sosState === "sent") {
    return (
      <div className="sos-confirmation">
        <div className="sos-confirmation-inner">
          <span className="sos-check">✓</span>
          <div>
            <strong>SOS Alert Sent!</strong>
            <p>ID: {alertId}</p>
            {locationInfo && <p>📍 {locationInfo.address}</p>}
          </div>
          <button className="sos-reset-btn" onClick={handleReset}>✕</button>
        </div>
      </div>
    );
  }

  return (
    <button
      className={`sos-button sos-button--${sosState}`}
      onClick={handleSOS}
      disabled={sosState !== "idle"}
    >
      {sosState === "idle" && "🆘 SOS"}
      {sosState === "locating" && "📍..."}
      {sosState === "sending" && "📡..."}
      {sosState === "error" && "❌ Retry"}
    </button>
  );
}

export default SOSButton;
