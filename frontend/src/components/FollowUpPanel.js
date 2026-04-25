/**
 * FollowUpPanel.js — Context-aware follow-up questions
 *
 * Shows 1-2 follow-up questions from the AI.
 * User can click a quick answer or type a custom one.
 * Answers are sent back as a new emergency query to refine guidance.
 */

import React, { useState } from "react";
import "../styles/FollowUpPanel.css";

// Quick answer options for common follow-ups
// The AI might ask "Is the fire small or large?" — these help users answer fast
const QUICK_ANSWERS = {
  default: ["Yes", "No", "I'm not sure", "It's getting worse"],
  size: ["Small", "Large / Spreading", "I can't tell"],
  consciousness: ["Conscious and alert", "Unconscious", "Semi-conscious / confused"],
  injury: ["Minor injury", "Severe injury / bleeding", "No visible injury"],
};

function FollowUpPanel({ questions, onAnswer }) {
  const [customAnswer, setCustomAnswer] = useState("");
  const [answeredIndex, setAnsweredIndex] = useState(null); // Which question was answered

  const handleQuickAnswer = (question, answer) => {
    // Combine the question with the answer for context
    onAnswer(`${question}: ${answer}`);
    setAnsweredIndex(0); // Mark as answered
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (customAnswer.trim()) {
      onAnswer(customAnswer.trim());
      setCustomAnswer("");
      setAnsweredIndex(0);
    }
  };

  // If already answered, show a waiting message
  if (answeredIndex !== null) {
    return (
      <div className="followup-panel followup-panel--answered">
        <p>⏳ Updating guidance based on your answer...</p>
      </div>
    );
  }

  return (
    <div className="followup-panel">
      <div className="followup-header">
        <span className="followup-icon">💬</span>
        <h3>Help us give better advice</h3>
      </div>

      {/* Show first follow-up question (keep it to 1 at a time) */}
      {questions.slice(0, 1).map((question, index) => (
        <div key={index} className="followup-question">
          <p className="question-text">{question}</p>

          {/* Quick answer buttons */}
          <div className="quick-answers">
            {QUICK_ANSWERS.default.map((answer) => (
              <button
                key={answer}
                className="quick-answer-btn"
                onClick={() => handleQuickAnswer(question, answer)}
              >
                {answer}
              </button>
            ))}
          </div>

          {/* Custom answer input */}
          <form onSubmit={handleCustomSubmit} className="custom-answer-form">
            <input
              type="text"
              value={customAnswer}
              onChange={(e) => setCustomAnswer(e.target.value)}
              placeholder="Or type your own answer..."
              className="custom-answer-input"
            />
            <button
              type="submit"
              disabled={!customAnswer.trim()}
              className="custom-answer-submit"
            >
              Send
            </button>
          </form>
        </div>
      ))}
    </div>
  );
}

export default FollowUpPanel;
