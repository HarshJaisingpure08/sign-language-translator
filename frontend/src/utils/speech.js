/**
 * Speaks the given text out loud using the browser's built-in
 * text-to-speech engine. No API key, no backend call needed.
 */
export function speakText(text) {
  if (!text) return;

  // Cancel any currently playing speech first, so multiple clicks
  // don't overlap and talk over each other
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1;
  utterance.pitch = 1;

  window.speechSynthesis.speak(utterance);
}