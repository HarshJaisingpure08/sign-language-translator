import { motion, AnimatePresence } from 'framer-motion';

/**
 * WebcamFrame — now shows a REAL live camera feed via a <video> element,
 * instead of the simulated gradient background + landmark dots.
 *
 * New prop: videoRef — a ref (from useRef()) that gets attached to the
 * <video> element, so the parent component can access the live stream
 * to capture frames from it.
 *
 * handDetected / faceDetected — simple booleans (not landmark arrays
 * anymore) telling us whether a hand/face was found in the LAST captured
 * frame, just to drive the status indicators.
 */
export default function WebcamFrame({
  videoRef,
  handDetected = false,
  faceDetected = false,
  currentSign    = null,
  isActive       = true,
  children,
}) {
  return (
    <div className="webcam-frame" style={{ aspectRatio: '4/3', position: 'relative', overflow: 'hidden' }}>
      {/* REAL live video feed */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover',
          transform: 'scaleX(-1)', // mirror, feels more natural (like a real mirror)
          background: '#0e1614',
        }}
      />

      {/* Corner markers - kept for visual polish */}
      {['tl', 'tr', 'bl', 'br'].map(pos => (
        <div key={pos} className={`corner-marker ${pos}`} aria-hidden="true" />
      ))}

      {/* Top status bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        padding: '12px 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'linear-gradient(to bottom, rgba(23,34,31,0.6), transparent)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <motion.div
            style={{
              width: 8, height: 8, borderRadius: '50%',
              background: isActive ? '#4caf50' : '#888',
            }}
            animate={isActive ? {
              boxShadow: [
                '0 0 0 0 rgba(76,175,80,0.4)',
                '0 0 0 6px rgba(76,175,80,0)',
              ]
            } : {}}
            transition={{ repeat: Infinity, duration: 2 }}
          />
          <span className="label-mono" style={{ color: 'rgba(245,241,232,0.8)', fontSize: '0.65rem' }}>
            {isActive ? 'CAMERA READY' : 'CAMERA OFF'}
          </span>
        </div>
        <span className="label-mono" style={{ color: 'rgba(245,241,232,0.4)', fontSize: '0.6rem' }}>
          SIGN TRANSLATOR
        </span>
      </div>

      {/* Active sign badge */}
      <AnimatePresence mode="wait">
        {currentSign && (
          <motion.div
            key={currentSign.label}
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            style={{
              position: 'absolute', bottom: 56, left: '50%', transform: 'translateX(-50%)',
              background: 'var(--clay)',
              color: 'var(--ivory)',
              padding: '6px 16px',
              borderRadius: '99px',
              fontFamily: 'var(--font-sans)',
              fontWeight: 700,
              fontSize: '0.9rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}
            aria-live="polite"
            aria-atomic="true"
          >
            {currentSign.label}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detection labels (HAND / FACE) - now driven by REAL detection state */}
      <div style={{
        position: 'absolute', top: '42%', right: 16,
        display: 'flex', flexDirection: 'column', gap: '6px',
        pointerEvents: 'none',
      }}>
        {[
          { label: 'HAND', active: handDetected, color: 'var(--clay)' },
          { label: 'FACE', active: faceDetected, color: 'var(--mustard)' },
        ].map(({ label, active, color }) => (
          <div key={label} style={{
            display: 'flex', alignItems: 'center', gap: 5,
            opacity: active ? 1 : 0.35,
          }}>
            <div style={{ width: 4, height: 4, borderRadius: '50%', background: color, flexShrink: 0 }} />
            <span style={{
              fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em',
              color: 'rgba(245,241,232,0.7)', textTransform: 'uppercase',
            }}>
              {label}
            </span>
          </div>
        ))}
      </div>

      {children}
    </div>
  );
}