import { motion } from 'framer-motion';
import { Hand } from 'lucide-react';

/**
 * SignVideoCard — placeholder sign output card.
 * Represents a single sign in the speak → sign output sequence.
 *
 * Props:
 *   sign: { id, label, duration, placeholder }
 *   isActive: boolean
 *   index: number
 */
export default function SignVideoCard({ sign, isActive = false, index = 0 }) {
  return (
    <motion.div
      className={`sign-card ${isActive ? 'active' : ''}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: [0.4, 0, 0.2, 1] }}
      style={{ minWidth: '100px', maxWidth: '130px' }}
    >
      {/* Video/avatar placeholder */}
      <div className="sign-card-video">
        <div style={{
          width: 40, height: 40,
          borderRadius: '50%',
          background: isActive ? 'var(--clay-20)' : 'var(--ink-10)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.2s',
        }}>
          <Hand size={18} style={{ color: isActive ? 'var(--clay)' : 'var(--ink-30)' }} />
        </div>
        <span className="label-mono text-ink-30" style={{ fontSize: '0.6rem' }}>
          {sign.duration}s
        </span>
        {sign.placeholder && (
          <span className="label-mono" style={{ fontSize: '0.55rem', color: 'var(--sage)', opacity: 0.7 }}>
            PREVIEW
          </span>
        )}
      </div>

      {/* Label */}
      <div className="sign-card-label">
        <span
          className="label-mono"
          style={{
            fontSize: '0.68rem',
            color: isActive ? 'var(--clay)' : 'var(--ink)',
          }}
        >
          {sign.label}
        </span>
      </div>
    </motion.div>
  );
}
