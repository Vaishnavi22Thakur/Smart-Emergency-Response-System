/**
 * utils/offlineFallbacks.js
 *
 * Client-side offline fallback responses.
 * Used when BOTH the AI API and the backend server are unreachable
 * (e.g. the user has no internet at all).
 *
 * The backend has its own fallbacks too — these are a last resort.
 */

const OFFLINE_RESPONSES = {
  fire: {
    immediateAction: "Get everyone out of the building NOW. Do not use elevators.",
    steps: [
      "Shout 'FIRE!' to alert everyone nearby",
      "Evacuate using the nearest staircase — never the elevator",
      "Close all doors behind you to slow fire spread",
      "Call 112 (fire department) from outside",
      "Do NOT go back inside for any belongings",
    ],
    doNot: [
      "Do NOT use the elevator",
      "Do NOT open hot doors — feel with the back of your hand first",
      "Do NOT go back inside once you're out",
    ],
    followUpQuestions: ["Is everyone out of the building?", "Is anyone trapped?"],
    severity: "critical",
    callEmergencyServices: true,
    emergencyNumber: "112",
  },

  accident: {
    immediateAction: "Ensure the scene is safe, then call 112 immediately.",
    steps: [
      "Check for danger — oncoming traffic, fuel leaks, etc.",
      "Call 112 and describe location and number of injured",
      "Do NOT move anyone with a possible spinal injury",
      "Apply firm pressure to any actively bleeding wounds",
      "Keep the person warm and calm until help arrives",
    ],
    doNot: [
      "Do NOT move someone with a suspected neck or back injury",
      "Do NOT leave the injured person alone",
      "Do NOT give anything to eat or drink",
    ],
    followUpQuestions: ["Is the person conscious?", "Is there heavy bleeding?"],
    severity: "high",
    callEmergencyServices: true,
    emergencyNumber: "112",
  },

  choking: {
    immediateAction: "If they cannot speak or breathe, perform the Heimlich maneuver immediately.",
    steps: [
      "Ask: 'Are you choking?' — if they can speak, encourage coughing",
      "Stand behind them, wrap arms around their waist",
      "Make a fist just above the navel, below the ribs",
      "Give 5 sharp upward thrusts",
      "Repeat until object is dislodged or they lose consciousness",
      "If unconscious, call 112 and begin CPR",
    ],
    doNot: [
      "Do NOT do back blows on adults (use only for infants)",
      "Do NOT do blind finger sweeps in the mouth",
      "Do NOT leave them alone",
    ],
    followUpQuestions: ["How old is the person?", "Are they still conscious?"],
    severity: "critical",
    callEmergencyServices: true,
    emergencyNumber: "112",
  },
};

/**
 * Match user input to a known offline scenario.
 * Returns null if no match found.
 *
 * @param {string} situation — the user's input text
 * @returns {object|null} — offline response object or null
 */
export function getOfflineFallback(situation) {
  const lower = situation.toLowerCase();

  if (lower.includes("fire") || lower.includes("smoke") || lower.includes("burning")) {
    return OFFLINE_RESPONSES.fire;
  }
  if (
    lower.includes("accident") ||
    lower.includes("crash") ||
    lower.includes("collision") ||
    lower.includes("injury") ||
    lower.includes("bleeding")
  ) {
    return OFFLINE_RESPONSES.accident;
  }
  if (lower.includes("chok") || lower.includes("can't breathe") || lower.includes("throat")) {
    return OFFLINE_RESPONSES.choking;
  }

  return null; // No match — caller should show a generic message
}

export default OFFLINE_RESPONSES;
