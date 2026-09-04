import { motion, AnimatePresence } from 'framer-motion';
import { HAND_LANDMARKS_LEFT, FACE_LANDMARKS } from '../data/mockData';

/**
 * WebcamFrame — simulated webcam with hand/face landmark overlays.
 *
 * Props (all replaceable by real ML inference later):
 *   handDetection: { active: boolean, landmarks: Array<{x,y}> }
 *   faceDetection: { active: boolean, landmarks: Array<{x,y}> }
 *   currentSign: { label: string } | null
 *   isActive: boolean
 *   children: ReactNode  (extra overlay layers)
 */
export default function WebcamFrame({
  handDetection = { active: true, landmarks: HAND_LANDMARKS_LEFT },
  faceDetection  = { active: true, landmarks: FACE_LANDMARKS },
  currentSign    = null,
  isActive       = true,
  children,
}) {
  return (
    <div className="webcam-frame" style={{ aspectRatio: '4/3' }}>
      {/* Dark background simulating camera */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(160deg, #1a2825 0%, #0e1614 60%, #141c1a 100%)',
      }} />

      {/* Subtle scanline texture */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.012) 3px, rgba(255,255,255,0.012) 4px)',
        pointerEvents: 'none',
      }} />

      {/* Person silhouette */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        pointerEvents: 'none',
      }}>
        <svg width="55%" viewBox="0 0 200 280" fill="none" style={{ opacity: 0.18 }}>
          {/* Head */}
          <ellipse cx="100" cy="40" rx="34" ry="38" fill="#8FA99A"/>
          {/* Neck */}
          <rect x="88" y="74" width="24" height="20" rx="6" fill="#8FA99A"/>
          {/* Torso */}
          <path d="M50 94 C50 94, 70 90, 100 90 C130 90, 150 94, 150 94 L158 200 L42 200 Z" fill="#8FA99A"/>
          {/* Left arm */}
          <path d="M55 108 L20 170 L34 176 L62 124" fill="#8FA99A"/>
          {/* Right arm — raised in sign position */}
          <path d="M145 108 L172 150 L160 158 L138 120" fill="#8FA99A"/>
          {/* Left hand */}
          <ellipse cx="26" cy="180" rx="14" ry="10" fill="#8FA99A"/>
          {/* Right hand — signing */}
          <ellipse cx="167" cy="162" rx="14" ry="10" fill="#8FA99A" transform="rotate(-20 167 162)"/>
        </svg>
      </div>

      {/* Hand landmark overlay */}
      {handDetection.active && handDetection.landmarks.map((pt, i) => (
        <motion.div
          key={`h-${i}`}
          className="landmark-dot hand"
          style={{ left: `${pt.x * 100}%`, top: `${pt.y * 100}%` }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.85, scale: 1 }}
          transition={{ delay: i * 0.025, duration: 0.3 }}
        />
      ))}

      {/* Face landmark overlay */}
      {faceDetection.active && faceDetection.landmarks.map((pt, i) => (
        <motion.div
          key={`f-${i}`}
          className="landmark-dot face"
          style={{ left: `${pt.x * 100}%`, top: `${pt.y * 100}%` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.4 + i * 0.03, duration: 0.3 }}
        />
      ))}

      {/* Corner markers */}
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

      {/* Detection labels (HAND / FACE / HEAD) */}
      <div style={{
        position: 'absolute', top: '42%', right: 16,
        display: 'flex', flexDirection: 'column', gap: '6px',
        pointerEvents: 'none',
      }}>
        {[
          { label: 'HAND', active: handDetection.active, color: 'var(--clay)' },
          { label: 'FACE', active: faceDetection.active, color: 'var(--mustard)' },
          { label: 'HEAD', active: faceDetection.active, color: 'var(--sage)' },
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

      {/* Extra children (e.g. grid overlay, etc.) */}
      {children}
    </div>
  );
}
