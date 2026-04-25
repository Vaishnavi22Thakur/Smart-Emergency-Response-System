/**
 * utils/formatResponse.js
 *
 * Small utility functions used across components.
 * Keeps helper logic out of components and makes testing easier.
 */

/**
 * Convert a severity string to a human-readable label + color.
 * @param {string} severity — "low" | "medium" | "high" | "critical"
 */
export function getSeverityMeta(severity) {
  const map = {
    low:      { label: "LOW",      color: "#22c55e", emoji: "🟢" },
    medium:   { label: "MEDIUM",   color: "#f59e0b", emoji: "🟡" },
    high:     { label: "HIGH",     color: "#f97316", emoji: "🟠" },
    critical: { label: "CRITICAL", color: "#ef4444", emoji: "🔴" },
  };
  return map[severity] || map.medium;
}

/**
 * Build a plain-text string from the AI response for TTS reading.
 * @param {object} response — the AI response object
 * @returns {string}
 */
export function buildTTSText(response) {
  if (!response) return "";
  const parts = [];

  if (response.immediateAction) {
    parts.push(`Immediate action: ${response.immediateAction}`);
  }
  if (response.steps?.length) {
    parts.push("Follow these steps.");
    response.steps.forEach((step, i) => parts.push(`Step ${i + 1}: ${step}`));
  }
  if (response.doNot?.length) {
    parts.push("Important warnings.");
    response.doNot.forEach((d) => parts.push(d));
  }

  return parts.join(" ");
}

/**
 * Format a timestamp for display (e.g. "2:34 PM")
 * @param {Date|string} date
 * @returns {string}
 */
export function formatTime(date) {
  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Truncate text for display (e.g. in notifications)
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export function truncate(text, maxLength = 80) {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "…";
}
