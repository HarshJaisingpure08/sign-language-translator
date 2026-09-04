import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic, MicOff, Play, Pause, SkipBack, SkipForward,
  ArrowRight, Hand, ChevronRight, ChevronLeft,
} from 'lucide-react';
import SignVideoCard from '../components/SignVideoCard';
import { SPEAK_OUTPUT_EXAMPLE } from '../data/mockData';

// ── Playback hook ──────────────────────────────────────────────
function useSignPlayback(signs, isPlaying) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!isPlaying || !signs.length) {
      clearTimeout(timerRef.current);
      return;
    }
    if (activeIndex >= signs.length) { return; }

    const idx = activeIndex < 0 ? 0 : activeIndex;
    setActiveIndex(idx);

    timerRef.current = setTimeout(() => {
      if (idx + 1 < signs.length) {
        setActiveIndex(idx + 1);
      }
    }, (signs[idx]?.duration || 1) * 1000);

    return () => clearTimeout(timerRef.current);
  }, [isPlaying, activeIndex, signs]);

  function reset() { clearTimeout(timerRef.current); setActiveIndex(-1); }
  function prev()  { setActiveIndex(i => Math.max(0, i - 1)); }
  function next()  { setActiveIndex(i => Math.min(signs.length - 1, i + 1)); }

  return { activeIndex, reset, prev, next };
}

export default function Speak() {
  const [activeTab, setActiveTab] = useState('text'); // 'text' | 'voice'
  const [inputText, setInputText]   = useState('');
  const [translated, setTranslated] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying]   = useState(false);
  const signs = SPEAK_OUTPUT_EXAMPLE.signs;

  const { activeIndex, reset, prev, next } = useSignPlayback(
    translated ? signs : [],
    isPlaying
  );

  function handleTranslate() {
    if (!inputText.trim()) return;
    setTranslated(true);
    setIsPlaying(false);
    reset();
  }

  function handleMicToggle() {
    setIsRecording(r => {
      if (!r) {
        // Simulate voice input filling text
        setTimeout(() => {
          setInputText(SPEAK_OUTPUT_EXAMPLE.inputText);
          setIsRecording(false);
        }, 2000);
      }
      return !r;
    });
  }

  function handlePlay() {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      reset();
      setTimeout(() => setIsPlaying(true), 50);
    }
  }

  const progressPct = translated && signs.length > 0
    ? ((activeIndex + 1) / signs.length) * 100
    : 0;

  return (
    <div style={{ background: 'var(--ivory)', minHeight: 'calc(100vh - 60px)' }}>
      <div className="container" style={{ padding: 'clamp(1.5rem,3vw,2.5rem) clamp(1.25rem,5vw,3rem)' }}>

        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <span className="label-mono text-clay" style={{ display: 'block', marginBottom: '0.4rem' }}>
            Speak → sign
          </span>
          <h1 className="heading-lg">Speak back.</h1>
          <p className="body-sm text-ink-60" style={{ marginTop: '0.3rem', maxWidth: '480px' }}>
            Type or speak your message. We'll turn your words into sign language.
          </p>
        </div>

        {/* Two-column layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem',
          alignItems: 'start',
        }}>

          {/* ── LEFT: Input area ──────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* Tab switcher */}
            <div style={{
              display: 'flex', gap: 0,
              border: '1.5px solid var(--ink-10)',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              background: 'var(--white)',
            }}>
              {['text', 'voice'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`btn ${activeTab === tab ? 'btn-ink' : 'btn-ghost'}`}
                  style={{ flex: 1, borderRadius: 0, border: 'none', textTransform: 'capitalize' }}
                >
                  {tab === 'text' ? 'Text' : 'Voice'}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'text' ? (
                <motion.div
                  key="text-input"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    background: 'var(--white)',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid var(--ink-10)',
                    overflow: 'hidden',
                  }}
                >
                  <textarea
                    id="speak-text-input"
                    value={inputText}
                    onChange={e => { setInputText(e.target.value); setTranslated(false); }}
                    placeholder="Type your message here…"
                    rows={5}
                    aria-label="Message to translate to sign language"
                    style={{
                      width: '100%', padding: '1rem',
                      border: 'none', outline: 'none',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '1rem', color: 'var(--ink)',
                      background: 'transparent',
                      resize: 'vertical',
                      lineHeight: 1.6,
                    }}
                  />
                  <div style={{
                    padding: '0.6rem 1rem',
                    borderTop: '1px solid var(--ink-10)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}>
                    <span className="body-sm text-ink-30">{inputText.length} chars</span>
                    <button
                      onClick={() => { setInputText(''); setTranslated(false); }}
                      className="btn btn-ghost btn-sm"
                      style={{ fontSize: '0.78rem', color: 'var(--ink-30)' }}
                    >
                      Clear
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="voice-input"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    background: 'var(--white)',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid var(--ink-10)',
                    padding: '2rem',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem',
                    textAlign: 'center',
                  }}
                >
                  <motion.button
                    onClick={handleMicToggle}
                    aria-label={isRecording ? 'Stop recording' : 'Start recording'}
                    style={{
                      width: 72, height: 72, borderRadius: '50%',
                      background: isRecording ? 'var(--clay)' : 'var(--ink-10)',
                      border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'background 0.2s',
                    }}
                    animate={isRecording ? {
                      boxShadow: [
                        '0 0 0 0 rgba(200,107,74,0.4)',
                        '0 0 0 16px rgba(200,107,74,0)',
                      ],
                    } : {}}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    {isRecording
                      ? <MicOff size={28} style={{ color: 'var(--ivory)' }} />
                      : <Mic size={28} style={{ color: 'var(--ink)' }} />
                    }
                  </motion.button>
                  <p className="body-sm text-ink-60">
                    {isRecording ? 'Recording… tap to stop' : 'Tap to start speaking'}
                  </p>
                  {inputText && (
                    <div style={{
                      padding: '0.75rem 1rem', background: 'var(--ink-10)',
                      borderRadius: 'var(--radius-sm)', width: '100%', textAlign: 'left',
                    }}>
                      <p className="body-sm text-ink-60" style={{ fontStyle: 'italic' }}>{inputText}</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Translate button */}
            <button
              className="btn btn-primary"
              onClick={handleTranslate}
              disabled={!inputText.trim()}
              style={{ opacity: inputText.trim() ? 1 : 0.5 }}
            >
              Translate to signs
              <ArrowRight size={16} />
            </button>

            {/* Example prompt */}
            {!inputText && (
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => { setInputText(SPEAK_OUTPUT_EXAMPLE.inputText); setTranslated(false); }}
                style={{ color: 'var(--clay)', justifyContent: 'flex-start', paddingLeft: 0 }}
              >
                Try: "{SPEAK_OUTPUT_EXAMPLE.inputText}"
              </button>
            )}
          </div>

          {/* ── RIGHT: Sign output ────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* Sign sequence player */}
            <div style={{
              padding: '1.25rem',
              background: 'var(--white)',
              borderRadius: 'var(--radius-md)',
              border: `1.5px solid ${translated ? 'var(--ink-10)' : 'var(--ink-10)'}`,
              minHeight: 200,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <p className="label-sm text-ink-60">Sign output</p>
                {translated && (
                  <span className="label-mono text-clay" style={{ fontSize: '0.65rem' }}>
                    {signs.length} signs · {SPEAK_OUTPUT_EXAMPLE.totalDuration}s
                  </span>
                )}
              </div>

              {translated ? (
                <>
                  {/* Sign cards row */}
                  <div style={{
                    display: 'flex', flexWrap: 'wrap', gap: '0.75rem',
                    marginBottom: '1.25rem',
                  }}>
                    {signs.map((sign, i) => (
                      <SignVideoCard
                        key={sign.id}
                        sign={sign}
                        isActive={i === activeIndex}
                        index={i}
                      />
                    ))}
                  </div>

                  {/* Progress bar */}
                  <div style={{ marginBottom: '0.75rem' }}>
                    <div style={{ height: 3, background: 'var(--ink-10)', borderRadius: 99, overflow: 'hidden' }}>
                      <motion.div
                        style={{ height: '100%', background: 'var(--clay)', borderRadius: 99 }}
                        animate={{ width: `${progressPct}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>

                  {/* Playback controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                    <button
                      className="btn btn-icon btn-ghost"
                      onClick={prev}
                      aria-label="Previous sign"
                    >
                      <SkipBack size={16} />
                    </button>
                    <button
                      className="btn btn-primary btn-icon"
                      onClick={handlePlay}
                      aria-label={isPlaying ? 'Pause' : 'Play'}
                      style={{ borderRadius: '50%', width: 40, height: 40 }}
                    >
                      {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                    </button>
                    <button
                      className="btn btn-icon btn-ghost"
                      onClick={next}
                      aria-label="Next sign"
                    >
                      <SkipForward size={16} />
                    </button>
                  </div>
                </>
              ) : (
                <div style={{
                  minHeight: 160, display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', gap: 12,
                  color: 'var(--ink-30)',
                }}>
                  <Hand size={32} style={{ opacity: 0.3 }} />
                  <p className="body-sm text-ink-30" style={{ textAlign: 'center' }}>
                    Enter a message and tap<br />"Translate to signs"
                  </p>
                </div>
              )}
            </div>

            {/* Avatar area — future rendering surface */}
            <div style={{
              padding: '1.5rem',
              background: 'var(--white)',
              borderRadius: 'var(--radius-md)',
              border: '1.5px dashed var(--ink-10)',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              textAlign: 'center', gap: '0.75rem',
              minHeight: 200, justifyContent: 'center',
            }}>
              {/* Intentionally designed rendering surface — not unfinished */}
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                border: '1.5px solid var(--ink-10)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'var(--ivory)',
              }}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <circle cx="14" cy="10" r="6" stroke="var(--sage)" strokeWidth="1.5"/>
                  <path d="M4 24 C4 24, 5 18, 14 18 C23 18, 24 24, 24 24" stroke="var(--sage)" strokeWidth="1.5" strokeLinecap="round"/>
                  {/* hands */}
                  <path d="M8 17 L5 14 M20 17 L23 14" stroke="var(--clay)" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <p className="label-sm text-ink" style={{ marginBottom: 4 }}>Sign avatar</p>
                <p className="body-sm text-ink-30" style={{ fontSize: '0.8rem', lineHeight: 1.5 }}>
                  Real-time 3D avatar rendering will appear here once the
                  animation backend is connected.
                </p>
              </div>
              <span className="label-mono text-ink-30" style={{ fontSize: '0.6rem', marginTop: 4 }}>
                UPCOMING FEATURE
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
