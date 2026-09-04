/**
 * Mock data layer for Sign Translator — Sign Language Communication Platform
 *
 * All values here are designed to be drop-in replaceable by:
 *   - REST API responses
 *   - WebSocket stream payloads
 *   - WebRTC data channel messages
 *
 * Replace the simulation logic in useScreeningSimulation() with
 * real inference callbacks when the backend is ready.
 */

// ─────────────────────────────────────────────
// Sign detection snapshots
// ─────────────────────────────────────────────
export const SIGN_LIBRARY = [
  { id: "hello",  label: "HELLO",  confidence: 0.97, duration: 1200 },
  { id: "help",   label: "HELP",   confidence: 0.94, duration: 980  },
  { id: "water",  label: "WATER",  confidence: 0.91, duration: 1050 },
  { id: "i",      label: "I",      confidence: 0.99, duration: 600  },
  { id: "need",   label: "NEED",   confidence: 0.88, duration: 870  },
  { id: "find",   label: "FIND",   confidence: 0.85, duration: 920  },
  { id: "thank",  label: "THANK",  confidence: 0.96, duration: 750  },
  { id: "you",    label: "YOU",    confidence: 0.98, duration: 680  },
];

// ─────────────────────────────────────────────
// Demo sign sequence for screening simulation
// ─────────────────────────────────────────────
export const DEMO_SEQUENCE = [
  { sign: SIGN_LIBRARY[0], delay: 2000 },   // HELLO
  { sign: SIGN_LIBRARY[1], delay: 3500 },   // HELP
  { sign: SIGN_LIBRARY[2], delay: 5000 },   // WATER
];

// ─────────────────────────────────────────────
// Facial / non-manual markers
// ─────────────────────────────────────────────
export const FACIAL_MARKER_STATES = [
  {
    id: "neutral",
    eyebrows: { label: "Neutral",   value: 0.1 },
    head:     { label: "Centered",  value: 0.0 },
    expression:{ label: "Neutral",  value: 0.1 },
    grammaticalRole: null,
  },
  {
    id: "question",
    eyebrows: { label: "Raised",    value: 0.82 },
    head:     { label: "Slight tilt", value: 0.55 },
    expression:{ label: "Concerned", value: 0.74 },
    grammaticalRole: "Possible question / request",
  },
  {
    id: "emphasis",
    eyebrows: { label: "Furrowed",  value: 0.67 },
    head:     { label: "Forward",   value: 0.48 },
    expression:{ label: "Emphatic", value: 0.71 },
    grammaticalRole: "Emphasis / strong statement",
  },
];

// ─────────────────────────────────────────────
// Translated sentences
// ─────────────────────────────────────────────
export const TRANSLATION_RESULTS = [
  {
    id: "t1",
    rawSequence: ["HELLO", "HELP", "WATER"],
    facialContext: "Concerned expression",
    sentence: "Hello, I need help finding some water.",
    signConfidence: 0.94,
    facialConfidence: 0.88,
    sentenceConfidence: 0.91,
    timestamp: new Date(Date.now() - 5000).toISOString(),
  },
];

// ─────────────────────────────────────────────
// Sign-output sequence (Speak → Sign page)
// ─────────────────────────────────────────────
export const SPEAK_OUTPUT_EXAMPLE = {
  inputText: "I can help you find the water.",
  signs: [
    { id: "so-1", label: "I",    duration: 0.6, placeholder: true },
    { id: "so-2", label: "CAN",  duration: 0.8, placeholder: true },
    { id: "so-3", label: "HELP", duration: 1.0, placeholder: true },
    { id: "so-4", label: "YOU",  duration: 0.7, placeholder: true },
    { id: "so-5", label: "FIND", duration: 0.9, placeholder: true },
    { id: "so-6", label: "WATER",duration: 1.1, placeholder: true },
  ],
  totalDuration: 5.1,
};

// ─────────────────────────────────────────────
// User / settings mock
// ─────────────────────────────────────────────
export const MOCK_USER = {
  name: "Guest",
  email: "",
  language: "ASL",
  theme: "light",
  reducedMotion: false,
  cameraDevice: "default",
  micDevice: "default",
  translationMode: "sentence", // "word" | "sentence"
  showConfidenceScores: true,
  showFacialMarkers: true,
};

// ─────────────────────────────────────────────
// Hand landmark points (simulated overlay)
// ─────────────────────────────────────────────
export const HAND_LANDMARKS_LEFT = [
  { x: 0.32, y: 0.68 }, { x: 0.30, y: 0.60 }, { x: 0.28, y: 0.52 },
  { x: 0.27, y: 0.46 }, { x: 0.26, y: 0.41 }, { x: 0.33, y: 0.44 },
  { x: 0.33, y: 0.37 }, { x: 0.33, y: 0.32 }, { x: 0.33, y: 0.27 },
  { x: 0.36, y: 0.44 }, { x: 0.37, y: 0.36 }, { x: 0.37, y: 0.31 },
  { x: 0.37, y: 0.26 }, { x: 0.39, y: 0.45 }, { x: 0.40, y: 0.37 },
  { x: 0.40, y: 0.32 }, { x: 0.40, y: 0.27 }, { x: 0.42, y: 0.47 },
  { x: 0.43, y: 0.40 }, { x: 0.43, y: 0.35 }, { x: 0.43, y: 0.30 },
];

export const FACE_LANDMARKS = [
  { x: 0.50, y: 0.20 }, { x: 0.44, y: 0.22 }, { x: 0.56, y: 0.22 },
  { x: 0.44, y: 0.28 }, { x: 0.56, y: 0.28 }, { x: 0.50, y: 0.30 },
  { x: 0.46, y: 0.35 }, { x: 0.54, y: 0.35 }, { x: 0.50, y: 0.38 },
  { x: 0.47, y: 0.42 }, { x: 0.53, y: 0.42 }, { x: 0.50, y: 0.45 },
];
