import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

/**
 * FacialMarkerPanel — displays facial grammar / non-manual markers.
 *
 * This is a key differentiator. Make it visually distinct.
 *
 * Props:
 *   markers: {
 *     eyebrows: { label: string, value: number },
 *     head:     { label: string, value: number },
 *     expression: { label: string, value: number },
 *     grammaticalRole: string | null
 *   }
 */
export default function FacialMarkerPanel({ markers }) {
  if (!markers) return null;

  const rows = [
    { key: 'eyebrows',   label: 'Eyebrows',   ...markers.eyebrows },
    { key: 'head',       label: 'Head',        ...markers.head },
    { key: 'expression', label: 'Expression',  ...markers.expression },
  ];

  return (
    <div>
      {/* Section header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        marginBottom: '0.75rem',
        paddingBottom: '0.5rem',
        borderBottom: '1px solid var(--ink-10)',
      }}>
        <div style={{
          width: 8, height: 8, borderRadius: '50%',
          background: 'var(--mustard)',
          boxShadow: '0 0 0 3px var(--mustard-20)',
        }} />
        <span className="label-sm text-ink">Facial grammar</span>
      </div>

      {/* Marker rows */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {rows.map(({ key, label, label: valueLabel, value }, i) => (
          <div key={key} className="facial-marker-row">
            <span className="body-sm text-ink-60" style={{ fontWeight: 500, fontSize: '0.8rem' }}>
              {label}
            </span>
            <div>
              <div className="facial-marker-track">
                <motion.div
                  className="facial-marker-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${value * 100}%` }}
                  transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                />
              </div>
            </div>
            <AnimatePresence mode="wait">
              <motion.span
                key={markers[key === 'eyebrows' ? 'eyebrows' : key === 'head' ? 'head' : 'expression']?.label}
                initial={{ opacity: 0, x: 6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="label-mono"
                style={{
                  color: 'var(--mustard)',
                  fontSize: '0.65rem',
                  whiteSpace: 'nowrap',
                }}
              >
                {markers[key === 'eyebrows' ? 'eyebrows' : key === 'head' ? 'head' : 'expression']?.label}
              </motion.span>
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Grammatical role interpretation */}
      <AnimatePresence>
        {markers.grammaticalRole && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            style={{
              marginTop: '0.75rem',
              padding: '0.6rem 0.75rem',
              background: 'var(--mustard-20)',
              borderRadius: 'var(--radius-sm)',
              borderLeft: '3px solid var(--mustard)',
              display: 'flex', gap: 8, alignItems: 'flex-start',
            }}
          >
            <AlertCircle size={13} style={{ color: '#8a6a10', flexShrink: 0, marginTop: 2 }} />
            <span className="body-sm" style={{ color: '#6b4e08', fontSize: '0.78rem', lineHeight: 1.4 }}>
              {markers.grammaticalRole}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
