/**
 * ResponseCard.js — Displays the AI emergency guidance
 *
 * Shows three cards:
 * 1. 🚨 Immediate Action (most urgent)
 * 2. 📋 Step-by-Step Instructions
 * 3. ⚠️ Do NOT Do
 *
 * Also shows severity badge and emergency services callout.
 */

import React from "react";
import "../styles/ResponseCard.css";

// Severity badge colors and labels
const SEVERITY_CONFIG = {
  low: { label: "LOW", color: "#22c55e" },
  medium: { label: "MEDIUM", color: "#f59e0b" },
  high: { label: "HIGH", color: "#f97316" },
  critical: { label: "CRITICAL", color: "#ef4444" },
};

function ResponseCard({ response }) {
  const {
    immediateAction,
    steps = [],
    doNot = [],
    severity = "medium",
    callEmergencyServices,
    emergencyNumber,
  } = response;

  const severityConfig = SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.medium;

  return (
    <div className="response-container">
      {/* Severity Badge */}
      <div className="severity-badge" style={{ borderColor: severityConfig.color }}>
        <span style={{ color: severityConfig.color }}>
          ● {severityConfig.label} SEVERITY
        </span>
        {callEmergencyServices && (
          <a
            href={`tel:${emergencyNumber || "112"}`}
            className="call-now-link"
          >
            📞 Call {emergencyNumber || "112"} NOW
          </a>
        )}
      </div>

      {/* ── Card 1: Immediate Action ── */}
      <div className="response-card card-immediate">
        <div className="card-header">
          <span className="card-icon">🚨</span>
          <h2 className="card-title">Immediate Action</h2>
          <span className="card-badge">DO THIS NOW</span>
        </div>
        <p className="immediate-text">{immediateAction}</p>
      </div>

      {/* ── Card 2: Step-by-Step ── */}
      {steps.length > 0 && (
        <div className="response-card card-steps">
          <div className="card-header">
            <span className="card-icon">📋</span>
            <h2 className="card-title">Step-by-Step Guide</h2>
          </div>
          <ol className="steps-list">
            {steps.map((step, index) => (
              <li key={index} className="step-item">
                <span className="step-number">{index + 1}</span>
                <span className="step-text">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* ── Card 3: Do NOT Do ── */}
      {doNot.length > 0 && (
        <div className="response-card card-donot">
          <div className="card-header">
            <span className="card-icon">⚠️</span>
            <h2 className="card-title">Do NOT Do</h2>
          </div>
          <ul className="donot-list">
            {doNot.map((item, index) => (
              <li key={index} className="donot-item">
                <span className="donot-x">✕</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ResponseCard;
