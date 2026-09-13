import { useState, useRef, useEffect } from 'react';
import { FACIAL_MARKER_STATES } from '../data/mockData';

// Change this if your backend runs somewhere else later (e.g. after deployment)
const API_BASE = 'http://127.0.0.1:8000';

const CAPTURE_INTERVAL_MS = 1200; // how often we grab a frame and check for a sign
const MIN_CONFIDENCE = 0.5;       // ignore predictions the model isn't confident about

/**
 * Captures the current video frame as an image file, ready to send
 * to our backend (which expects a multipart file upload, same as
 * we tested manually in /docs).
 */
function captureFrameAsBlob(videoEl) {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = videoEl.videoWidth;
    canvas.height = videoEl.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoEl, 0, 0);
    canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.8);
  });
}

async function callPredictSign(blob) {
  const formData = new FormData();
  formData.append('file', blob, 'frame.jpg');
  const res = await fetch(`${API_BASE}/predict-sign`, { method: 'POST', body: formData });
  return res.json();
}

async function callDetectFacialMarker(blob) {
  const formData = new FormData();
  formData.append('file', blob, 'frame.jpg');
  const res = await fetch(`${API_BASE}/detect-facial-marker`, { method: 'POST', body: formData });
  return res.json();
}

async function callCalibrateFace(blob) {
  const formData = new FormData();
  formData.append('file', blob, 'frame.jpg');
  const res = await fetch(`${API_BASE}/calibrate-face`, { method: 'POST', body: formData });
  return res.json();
}

async function callTranslateSession(words, signConfidences, facialLabel, facialConfidence) {
  const res = await fetch(`${API_BASE}/translate-session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      words,
      sign_confidences: signConfidences,
      facial_context: facialLabel,
      facial_confidence: facialConfidence,
    }),
  });
  return res.json();
}

export function useLiveScreening(isActive, videoRef) {
  const [currentSign, setCurrentSign] = useState(null);
  const [detectedSigns, setDetectedSigns] = useState([]);
  const [facialMarkers, setFacialMarkers] = useState(FACIAL_MARKER_STATES[0]); // neutral
  const [facialLabel, setFacialLabel] = useState('neutral');
  const [facialConfidence, setFacialConfidence] = useState(0.8); // approximate for now
  const [sentence, setSentence] = useState('');
  const [signConfidence, setSignConfidence] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [handDetected, setHandDetected] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);

  const intervalRef = useRef(null);
  const calibratedRef = useRef(false);
  const lastAddedSignRef = useRef(null);
  const signConfidencesRef = useRef([]);

  // --- Start camera stream when active ---
  useEffect(() => {
    if (!isActive) return;

    let stream;
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((s) => {
        stream = s;
        if (videoRef.current) videoRef.current.srcObject = s;
      })
      .catch((err) => console.error('Camera access failed:', err));

    return () => {
      if (stream) stream.getTracks().forEach((track) => track.stop());
    };
  }, [isActive, videoRef]);

  // --- Main detection loop ---
  useEffect(() => {
    if (!isActive) return;

    intervalRef.current = setInterval(async () => {
      const videoEl = videoRef.current;
      if (!videoEl || videoEl.videoWidth === 0) return;

      const blob = await captureFrameAsBlob(videoEl);

      // First frame of the session: calibrate the "neutral face" baseline
      if (!calibratedRef.current) {
        await callCalibrateFace(blob);
        calibratedRef.current = true;
        return; // skip prediction on this same frame, calibration only
      }

      // Run sign prediction and facial marker detection
      const [signResult, facialResult] = await Promise.all([
        callPredictSign(blob),
        callDetectFacialMarker(blob),
      ]);

      setHandDetected(signResult.detected);
      setFaceDetected(facialResult.detected);

      if (signResult.detected && signResult.confidence >= MIN_CONFIDENCE) {
        setCurrentSign({ label: signResult.sign });
        setSignConfidence(signResult.confidence);

        // Only add to the sequence if it's different from the last one added -
        // avoids spamming the same sign every 1.2 seconds while it's held
        if (signResult.sign !== lastAddedSignRef.current) {
          lastAddedSignRef.current = signResult.sign;
          signConfidencesRef.current.push(signResult.confidence);
          setDetectedSigns((prev) => [
            ...prev,
            { id: `${signResult.sign}-${prev.length}`, label: signResult.sign, confidence: signResult.confidence },
          ]);
        }
      }

      if (facialResult.detected && facialResult.label !== 'neutral') {
        setFacialLabel(facialResult.label);
        const stateIndex = facialResult.label === 'question' ? 1 : 2;
        setFacialMarkers(FACIAL_MARKER_STATES[stateIndex]);
      }
    }, CAPTURE_INTERVAL_MS);

    return () => clearInterval(intervalRef.current);
  }, [isActive, videoRef]);

  // --- Called when the user ends the session, to get the final sentence ---
  async function finishSession() {
    clearInterval(intervalRef.current);
    const words = detectedSigns.map((s) => s.label);

    if (words.length === 0) {
      return; // nothing detected, nothing to translate
    }

    const result = await callTranslateSession(
      words,
      signConfidencesRef.current,
      facialLabel,
      facialConfidence
    );

    setSentence(result.sentence);
    setIsComplete(true);
    return result;
  }

  return {
    currentSign, detectedSigns, facialMarkers, sentence,
    signConfidence, isComplete, handDetected, faceDetected,
    finishSession,
  };
}