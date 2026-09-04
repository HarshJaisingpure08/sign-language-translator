import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Copy, Pencil, RotateCcw, Volume2, ArrowLeft, CheckCircle } from 'lucide-react';
import ConfidenceMetric from '../components/ConfidenceMetric';
import SignSequence from '../components/SignSequence';
import { TRANSLATION_RESULTS } from '../data/mockData';

const RESULT = TRANSLATION_RESULTS[0];

// ── Timeline item ──────────────────────────────────────────────
function TimelineItem({ type, label, sub, isLast, isHighlight }) {
  const dotColor = type === 'sign'  ? 'var(--clay)'
                 : type === 'face'  ? 'var(--mustard)'
                 : 'var(--slate)';

  return (
    <div className="timeline-item" style={{ marginBottom: isLast ? 0 : '1.5rem' }}>
      {/* Connector line */}
      {!isLast && (
        <div style={{
          position: 'absolute', left: 11, top: 28, bottom: -16,
          width: 2, background: 'var(--ink-10)',
        }} />
      )}

      {/* Dot */}
      <div style={{
        width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
        border: `2px solid ${dotColor}`,
        background: isHighlight ? dotColor : 'var(--ivory)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', zIndex: 1,
      }}>
        {isHighlight && (
          <CheckCircle size={12} style={{ color: 'var(--ivory)' }} />
        )}
      </div>

      {/* Content */}
      <div style={{
        paddingTop: 2,
        paddingBottom: isLast ? '0' : '0.25rem',
      }}>
        <p className="label-mono" style={{ color: dotColor, fontSize: '0.62rem', marginBottom: 3 }}>
          {label}
        </p>
        {isHighlight ? (
          <motion.p
            className="display-md"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ marginBottom: '0.25rem' }}
          >
            {sub}
          </motion.p>
        ) : (
          <p className="heading-sm">{sub}</p>
        )}
      </div>
    </div>
  );
}

export default function Translate() {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(RESULT.sentence).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const timelineItems = [
    ...RESULT.rawSequence.map((sign, i) => ({
      type: 'sign',
      label: 'User signed',
      sub: sign,
      isLast: false,
      isHighlight: false,
    })),
    {
      type: 'face',
      label: 'Facial context',
      sub: RESULT.facialContext,
      isLast: false,
      isHighlight: false,
    },
    {
      type: 'final',
      label: 'Translated sentence',
      sub: RESULT.sentence,
      isLast: true,
      isHighlight: true,
    },
  ];

  return (
    <div style={{ background: 'var(--ivory)', minHeight: 'calc(100vh - 60px)' }}>
      <div className="container" style={{ padding: 'clamp(1.5rem,3vw,2.5rem) clamp(1.25rem,5vw,3rem)' }}>

        {/* Back link */}
        <Link
          to="/screening"
          className="btn btn-ghost btn-sm"
          style={{ display: 'inline-flex', marginBottom: '1.5rem', paddingLeft: 0 }}
        >
          <ArrowLeft size={15} />
          Back to screening
        </Link>

        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <span className="label-mono text-clay" style={{ display: 'block', marginBottom: '0.4rem' }}>
            Session result
          </span>
          <h1 className="heading-lg">Your conversation.</h1>
          <p className="body-sm text-ink-60" style={{ marginTop: '0.3rem' }}>
            From signs to natural language.
          </p>
        </div>

        {/* Two-column layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          alignItems: 'start',
        }}>

          {/* LEFT: Translation timeline */}
          <div>
            <div style={{
              padding: '1.5rem 1.75rem',
              background: 'var(--white)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--ink-10)',
            }}>
              <p className="label-sm text-ink-60" style={{ marginBottom: '1.5rem' }}>Translation path</p>

              <div style={{ position: 'relative' }}>
                {timelineItems.map((item, i) => (
                  <motion.div
                    key={`${item.label}-${item.sub}-${i}`}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.12 }}
                  >
                    <TimelineItem {...item} isLast={i === timelineItems.length - 1} />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Controls */}
            <div style={{
              marginTop: '1rem',
              display: 'flex', flexWrap: 'wrap', gap: '0.75rem',
              padding: '1rem',
              background: 'var(--white)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--ink-10)',
            }}>
              <button className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <RotateCcw size={14} />
                Replay
              </button>
              <button className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Pencil size={14} />
                Edit
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={handleCopy}
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
              >
                {copied ? <CheckCircle size={14} style={{ color: 'var(--sage)' }} /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Volume2 size={14} />
                Speak
              </button>
              <Link to="/screening" className="btn btn-ghost btn-sm">
                Start again
              </Link>
            </div>
          </div>

          {/* RIGHT: Quality metrics + raw data */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* Translation quality */}
            <div style={{
              padding: '1.25rem 1.5rem',
              background: 'var(--white)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--ink-10)',
            }}>
              <p className="label-sm text-ink-60" style={{ marginBottom: '1.25rem' }}>Translation quality</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <ConfidenceMetric label="Sign recognition" value={RESULT.signConfidence} accent="clay" />
                <ConfidenceMetric label="Facial context" value={RESULT.facialConfidence} accent="mustard" />
                <ConfidenceMetric label="Sentence confidence" value={RESULT.sentenceConfidence} accent="sage" />
              </div>
            </div>

            {/* Raw sequence */}
            <div style={{
              padding: '1.25rem 1.5rem',
              background: 'var(--white)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--ink-10)',
            }}>
              <p className="label-sm text-ink-60" style={{ marginBottom: '0.75rem' }}>Raw sign sequence</p>
              <SignSequence
                signs={RESULT.rawSequence.map((s, i) => ({ id: `r-${i}`, label: s, confidence: RESULT.signConfidence }))}
                activeIndex={-1}
              />
            </div>

            {/* Facial context */}
            <div style={{
              padding: '1.25rem 1.5rem',
              background: 'var(--white)',
              borderRadius: 'var(--radius-md)',
              border: '1.5px solid var(--mustard)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.75rem' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--mustard)' }} />
                <p className="label-sm text-ink">Facial context used</p>
              </div>
              <p className="body-sm text-ink-60" style={{ lineHeight: 1.55 }}>
                Raised eyebrows and concerned expression indicated a question or request,
                contributing to the natural language interpretation.
              </p>
            </div>

            {/* Proceed to speak */}
            <div style={{
              padding: '1.25rem 1.5rem',
              background: 'var(--ink)',
              borderRadius: 'var(--radius-md)',
            }}>
              <p className="heading-sm" style={{ color: 'var(--ivory)', marginBottom: '0.4rem' }}>
                Respond in signs?
              </p>
              <p className="body-sm" style={{ color: 'rgba(245,241,232,0.55)', marginBottom: '1rem' }}>
                Type or speak your response and Sign Translator will translate it back into sign language.
              </p>
              <Link to="/speak" className="btn btn-primary btn-sm">
                Go to Speak
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
