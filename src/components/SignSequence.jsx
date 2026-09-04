import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

/**
 * SignSequence — displays the raw sign token sequence.
 *
 * Props:
 *   signs: Array<{ id, label, confidence }>
 *   activeIndex: number (-1 = none)
 */
export default function SignSequence({ signs = [], activeIndex = -1 }) {
  if (!signs.length) {
    return (
      <p className="body-sm text-ink-30" style={{ fontStyle: 'italic' }}>
        Waiting for signs…
      </p>
    );
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px' }}>
      <AnimatePresence initial={false}>
        {signs.map((sign, i) => (
          <motion.div
            key={sign.id || `${sign.label}-${i}`}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            initial={{ opacity: 0, x: -10, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.05 * i }}
          >
            <span
              className="label-mono"
              style={{
                padding: '4px 10px',
                borderRadius: '4px',
                background: i === activeIndex ? 'var(--clay)' : 'var(--ink-10)',
                color: i === activeIndex ? 'var(--ivory)' : 'var(--ink)',
                fontSize: '0.72rem',
                transition: 'background 0.2s, color 0.2s',
              }}
            >
              {sign.label}
            </span>
            {i < signs.length - 1 && (
              <ArrowRight size={12} style={{ color: 'var(--ink-30)', flexShrink: 0 }} />
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
