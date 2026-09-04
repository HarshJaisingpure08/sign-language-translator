import { motion } from 'framer-motion';

/**
 * ConfidenceMetric — horizontal bar metric with animated fill.
 *
 * Props:
 *   label: string
 *   value: number (0 – 1)
 *   accent: 'clay' | 'mustard' | 'sage'
 *   showPercent: boolean
 */
export default function ConfidenceMetric({ label, value = 0, accent = 'clay', showPercent = true }) {
  const pct = Math.round(value * 100);
  const fillColor = accent === 'mustard' ? 'var(--mustard)'
                  : accent === 'sage'    ? 'var(--sage)'
                  : 'var(--clay)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px' }}>
        <span className="label-mono text-ink-60">{label}</span>
        {showPercent && (
          <span className="label-mono" style={{ color: fillColor }}>
            {pct}%
          </span>
        )}
      </div>
      <div className="confidence-bar-track" role="meter" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${label}: ${pct}%`}>
        <motion.div
          className="confidence-bar-fill"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          style={{ background: fillColor }}
        />
      </div>
    </div>
  );
}
