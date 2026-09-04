import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, CameraOff, Mic, MicOff, Pause, Play, Square, Volume2 } from 'lucide-react';
import WebcamFrame from '../components/WebcamFrame';
import FacialMarkerPanel from '../components/FacialMarkerPanel';
import SignSequence from '../components/SignSequence';
import ConfidenceMetric from '../components/ConfidenceMetric';
import StatusBadge from '../components/StatusBadge';
import {
  DEMO_SEQUENCE, FACIAL_MARKER_STATES,
  HAND_LANDMARKS_LEFT, FACE_LANDMARKS,
} from '../data/mockData';

// ── Simulation hook ────────────────────────────────────────────
/**
 * useScreeningSimulation
 *
 * Drives the demo. Replace the simulation logic here with real
 * WebSocket / WebRTC inference callbacks from the backend.
 *
 * Returns the same shape as a real ML inference stream would:
 *   { currentSign, detectedSigns, facialMarkers, sentence, signConfidence, isComplete }
 */
function useScreeningSimulation(isActive) {
  const [currentSign, setCurrentSign]   = useState(null);
  const [detectedSigns, setDetectedSigns] = useState([]);
  const [facialMarkers, setFacialMarkers] = useState(FACIAL_MARKER_STATES[0]);
  const [sentence, setSentence]           = useState('');
  const [signConfidence, setSignConfidence] = useState(0);
  const [isComplete, setIsComplete]       = useState(false);
  const timerRef = useRef([]);

  useEffect(() => {
    if (!isActive) return;

    // Reset
    setCurrentSign(null);
    setDetectedSigns([]);
    setFacialMarkers(FACIAL_MARKER_STATES[0]);
    setSentence('');
    setSignConfidence(0);
    setIsComplete(false);
    timerRef.current.forEach(clearTimeout);
    timerRef.current = [];

    // Facial markers shift early
    const t0 = setTimeout(() => setFacialMarkers(FACIAL_MARKER_STATES[1]), 1500);

    // Sign sequence
    DEMO_SEQUENCE.forEach(({ sign, delay }) => {
      const t = setTimeout(() => {
        setCurrentSign(sign);
        setSignConfidence(sign.confidence);
        setDetectedSigns(prev => {
          const already = prev.find(s => s.id === sign.id);
          return already ? prev : [...prev, sign];
        });
      }, delay);
      timerRef.current.push(t);
    });

    // Final sentence
    const tSentence = setTimeout(() => {
      setSentence('Hello, I need help finding some water.');
      setFacialMarkers(FACIAL_MARKER_STATES[2]);
      setIsComplete(true);
    }, 7000);

    timerRef.current.push(t0, tSentence);
    return () => timerRef.current.forEach(clearTimeout);
  }, [isActive]);

  return { currentSign, detectedSigns, facialMarkers, sentence, signConfidence, isComplete };
}

// ── Sentence word-by-word reveal ───────────────────────────────
function SentenceReveal({ sentence }) {
  const words = sentence ? sentence.split(' ') : [];
  return (
    <span>
      <AnimatePresence initial={false}>
        {words.map((word, i) => (
          <motion.span
            key={`${word}-${i}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.08 }}
            style={{ display: 'inline-block', marginRight: '0.3em' }}
          >
            {word}
          </motion.span>
        ))}
      </AnimatePresence>
    </span>
  );
}

// ── Control button ─────────────────────────────────────────────
function CtrlBtn({ icon, label, active, danger, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className="btn btn-icon"
      style={{
        background: danger ? 'rgba(200,107,74,0.12)' : active ? 'var(--ink-10)' : 'transparent',
        border: `1.5px solid ${danger ? 'rgba(200,107,74,0.3)' : 'var(--ink-10)'}`,
        color: danger ? 'var(--clay)' : active ? 'var(--ink)' : 'var(--ink-60)',
      }}
    >
      {icon}
    </button>
  );
}

// ── Detection status rows ──────────────────────────────────────
function DetectionStatus({ handActive, faceActive }) {
  const rows = [
    { label: 'Hand detection', status: handActive ? 'active' : 'inactive' },
    { label: 'Face tracking',  status: faceActive ? 'active' : 'inactive' },
    { label: 'Non-manual markers', status: faceActive ? 'active' : 'inactive' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {rows.map(({ label, status }) => (
        <div key={label} className="detection-row">
          <span className="body-sm text-ink-60">{label}</span>
          <StatusBadge status={status} label={status === 'active' ? 'Active' : 'Inactive'} />
        </div>
      ))}
    </div>
  );
}

export default function Screening() {
  const [cameraOn, setCameraOn]   = useState(true);
  const [micOn, setMicOn]         = useState(true);
  const [paused, setPaused]       = useState(false);
  const [sessionKey, setSessionKey] = useState(0); // increment to restart simulation

  const isActive = cameraOn && !paused;
  const {
    currentSign, detectedSigns, facialMarkers,
    sentence, signConfidence, isComplete,
  } = useScreeningSimulation(isActive ? sessionKey : -1);

  function handleRestart() {
    setSessionKey(k => k + 1);
    setPaused(false);
    setCameraOn(true);
  }

  return (
    <div style={{ background: 'var(--ivory)', minHeight: 'calc(100vh - 60px)' }}>
      <div className="container" style={{ padding: 'clamp(1.5rem,3vw,2.5rem) clamp(1.25rem,5vw,3rem)' }}>

        {/* Page header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="label-mono text-clay" style={{ display: 'block', marginBottom: '0.4rem' }}>
                Live session
              </span>
              <h1 className="heading-lg">Sign screening</h1>
              <p className="body-sm text-ink-60" style={{ marginTop: '0.3rem', maxWidth: '520px' }}>
                Position yourself inside the frame. Sign Translator will follow your hands, face and movement.
              </p>
            </div>
            <StatusBadge status="demo" label="Demo mode" />
          </div>
        </div>

        {/* Main two-column layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem',
          alignItems: 'start',
        }}>

          {/* ── LEFT: Webcam + controls ────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <WebcamFrame
              handDetection={{ active: isActive, landmarks: HAND_LANDMARKS_LEFT }}
              faceDetection={{ active: isActive, landmarks: FACE_LANDMARKS }}
              currentSign={currentSign}
              isActive={isActive}
            />

            {/* Bottom controls */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
              padding: '0.75rem',
              background: 'var(--white)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--ink-10)',
            }}>
              <CtrlBtn
                icon={cameraOn ? <Camera size={18} /> : <CameraOff size={18} />}
                label={cameraOn ? 'Turn camera off' : 'Turn camera on'}
                active={cameraOn}
                onClick={() => setCameraOn(c => !c)}
              />
              <CtrlBtn
                icon={micOn ? <Mic size={18} /> : <MicOff size={18} />}
                label={micOn ? 'Mute microphone' : 'Unmute microphone'}
                active={micOn}
                onClick={() => setMicOn(m => !m)}
              />
              <CtrlBtn
                icon={paused ? <Play size={18} /> : <Pause size={18} />}
                label={paused ? 'Resume screening' : 'Pause screening'}
                active={!paused}
                onClick={() => setPaused(p => !p)}
              />
              <div style={{ flex: 1 }} />
              <CtrlBtn
                icon={<Square size={18} />}
                label="End session"
                danger
                onClick={handleRestart}
              />
            </div>

            {/* Detection status */}
            <div style={{
              padding: '1rem 1.25rem',
              background: 'var(--white)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--ink-10)',
            }}>
              <p className="label-sm text-ink-60" style={{ marginBottom: '0.6rem' }}>Detection status</p>
              <DetectionStatus handActive={isActive} faceActive={isActive} />
            </div>
          </div>

          {/* ── RIGHT: Interpretation panel ───────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* Current sign */}
            <div style={{
              padding: '1.25rem',
              background: 'var(--white)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--ink-10)',
            }}>
              <p className="label-sm text-ink-60" style={{ marginBottom: '0.75rem' }}>Live interpretation</p>

              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <AnimatePresence mode="wait">
                  {currentSign ? (
                    <motion.span
                      key={currentSign.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.22 }}
                      className="display-md"
                      style={{ color: 'var(--clay)', lineHeight: 1 }}
                    >
                      {currentSign.label}
                    </motion.span>
                  ) : (
                    <motion.span
                      key="waiting"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="heading-lg text-ink-30"
                      style={{ fontStyle: 'italic' }}
                    >
                      Listening…
                    </motion.span>
                  )}
                </AnimatePresence>

                {signConfidence > 0 && (
                  <motion.span
                    className="label-mono"
                    style={{ color: 'var(--sage)', fontSize: '0.8rem' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {Math.round(signConfidence * 100)}%
                  </motion.span>
                )}
              </div>

              {signConfidence > 0 && (
                <ConfidenceMetric
                  label="Sign confidence"
                  value={signConfidence}
                  accent="clay"
                />
              )}
            </div>

            {/* Detected sequence */}
            <div style={{
              padding: '1.25rem',
              background: 'var(--white)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--ink-10)',
            }}>
              <p className="label-sm text-ink-60" style={{ marginBottom: '0.75rem' }}>Detected sequence</p>
              <SignSequence
                signs={detectedSigns}
                activeIndex={detectedSigns.length - 1}
              />
            </div>

            {/* Facial grammar — KEY DIFFERENTIATOR */}
            <div style={{
              padding: '1.25rem',
              background: 'var(--white)',
              borderRadius: 'var(--radius-md)',
              border: `1.5px solid ${facialMarkers?.grammaticalRole ? 'var(--mustard)' : 'var(--ink-10)'}`,
              transition: 'border-color 0.4s',
            }}>
              <FacialMarkerPanel markers={facialMarkers} />
            </div>

            {/* Sentence output */}
            <div style={{
              padding: '1.25rem',
              background: isComplete ? 'var(--ink)' : 'var(--white)',
              borderRadius: 'var(--radius-md)',
              border: `1.5px solid ${isComplete ? 'var(--ink)' : 'var(--ink-10)'}`,
              transition: 'background 0.4s, border-color 0.4s',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <p className="label-sm" style={{ color: isComplete ? 'var(--sage)' : 'var(--ink-60)' }}>
                  {isComplete ? 'Natural language output' : 'Building your sentence…'}
                </p>
                {isComplete && (
                  <span className="label-mono" style={{ color: 'var(--clay)', fontSize: '0.65rem' }}>91%</span>
                )}
              </div>

              <div className="body-lg" style={{
                color: isComplete ? 'var(--ivory)' : 'var(--ink-30)',
                fontStyle: isComplete ? 'normal' : 'italic',
                minHeight: '2rem',
                lineHeight: 1.5,
              }}>
                {sentence ? (
                  <SentenceReveal sentence={sentence} />
                ) : (
                  <span>Interpreting signs…</span>
                )}
              </div>

              {isComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem', flexWrap: 'wrap' }}
                >
                  <Link to="/translate" className="btn btn-primary btn-sm">
                    Review translation
                  </Link>
                  <button className="btn btn-sm" style={{
                    background: 'transparent', color: 'var(--ivory)',
                    border: '1.5px solid rgba(245,241,232,0.2)',
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}>
                    <Volume2 size={14} />
                    Speak
                  </button>
                  <button
                    className="btn btn-sm"
                    onClick={handleRestart}
                    style={{
                      background: 'transparent', color: 'rgba(245,241,232,0.5)',
                      border: '1.5px solid rgba(245,241,232,0.12)',
                    }}
                  >
                    Restart
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
