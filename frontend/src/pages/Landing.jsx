import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import WebcamFrame from '../components/WebcamFrame';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: [0.4, 0, 0.2, 1] },
};

function Section({ children, style, className }) {
  return (
    <section className={`section ${className || ''}`} style={style}>
      <div className="container">{children}</div>
    </section>
  );
}

// ── Meaning equation component ─────────────────────────────────
function MeaningEquation() {
  const items = [
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M4 12 C4 12, 4 7, 6 6 C7.5 5.5, 7.5 7, 7.5 8.5 L7.5 10 C7.5 10, 9 8, 9.5 7 C10 6, 11 6.5, 10.5 8 L10 10 C10 10, 11.5 8, 12 7.5 C12.5 7, 13.5 7.5, 13 9 L12.5 11 L16 10" 
            stroke="#C86B4A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      bg: 'var(--clay-10)',
      label: 'Hand Shape',
      description: 'Handform, palm orientation, movement',
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <ellipse cx="10" cy="8" rx="5" ry="6" stroke="#D6B45A" strokeWidth="1.5"/>
          <path d="M7 10 Q10 13 13 10" stroke="#D6B45A" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M7.5 6.5 Q7 5.5, 8 5" stroke="#D6B45A" strokeWidth="1.2" strokeLinecap="round"/>
          <path d="M12.5 6.5 Q13 5.5, 12 5" stroke="#D6B45A" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      ),
      bg: 'var(--mustard-20)',
      label: 'Facial Expression',
      description: 'Eyebrows, mouth, eyes — grammatical markers',
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="8" r="4.5" stroke="#8FA99A" strokeWidth="1.5"/>
          <path d="M10 12.5 L10 16" stroke="#8FA99A" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M8 15 L10 17 L12 15" stroke="#8FA99A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      bg: 'var(--sage-20)',
      label: 'Head Movement',
      description: 'Nods, tilts, and turns shift meaning',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {items.map((item, i) => (
        <div key={item.label}>
          <motion.div
            className="meaning-row"
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <div className="meaning-icon-box" style={{ background: item.bg }}>
              {item.icon}
            </div>
            <div>
              <p className="heading-sm">{item.label}</p>
              <p className="body-sm text-ink-60" style={{ marginTop: 2 }}>{item.description}</p>
            </div>
          </motion.div>
          {i < items.length - 1 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '2px 0 2px 20px' }}>
              <div style={{ width: 1, height: 20, background: 'var(--ink-10)', marginLeft: 19 }} />
              <span className="label-mono text-ink-30" style={{ fontSize: '0.6rem' }}>+</span>
            </div>
          )}
        </div>
      ))}

      {/* Equals → meaning */}
      <div style={{
        marginTop: '1.25rem',
        padding: '1rem 1.25rem',
        background: 'var(--ink)',
        borderRadius: 'var(--radius-md)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <p className="label-mono" style={{ color: 'var(--sage)', marginBottom: 4 }}>Interpreted as</p>
          <p className="heading-sm" style={{ color: 'var(--ivory)' }}>MEANING</p>
        </div>
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          background: 'var(--clay)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <ArrowRight size={18} style={{ color: 'var(--ivory)' }} />
        </div>
      </div>
    </div>
  );
}

// ── Feature blocks ─────────────────────────────────────────────
const FEATURES = [
  {
    num: '01',
    title: 'Understand',
    copy: 'Recognise hand shapes, palm orientations and movement paths — alongside raised eyebrows, head tilts, and facial grammar.',
    accent: 'var(--clay)',
  },
  {
    num: '02',
    title: 'Translate',
    copy: 'Turn a sequence of detected signs and markers into a fluid, natural‑language sentence — not a word list.',
    accent: 'var(--mustard)',
  },
  {
    num: '03',
    title: 'Respond',
    copy: 'Convert speech or typed text back into sign — with video clips, sign cards, or a future avatar renderer.',
    accent: 'var(--sage)',
  },
];

// ── Communication loop ─────────────────────────────────────────
const LOOP_STEPS = ['SIGN', 'UNDERSTAND', 'TRANSLATE', 'RESPOND'];

export default function Landing() {
  return (
    <div>
      {/* ── HERO ──────────────────────────────────────────────── */}
      <section style={{
        padding: 'clamp(4rem,8vw,8rem) 0 clamp(3rem,6vw,6rem)',
        borderBottom: '1px solid var(--ink-10)',
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 'clamp(3rem, 6vw, 6rem)',
            alignItems: 'center',
          }}>
            {/* Left — copy */}
            <div>
              <motion.div {...fadeUp} transition={{ duration: 0.45 }}>
                <span className="label-mono text-clay" style={{ marginBottom: '1.25rem', display: 'block' }}>
                  Two-way sign language assistant
                </span>
              </motion.div>

              <motion.h1
                className="display-xl"
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.08 }}
              >
                Communication,<br />
                <span style={{ fontStyle: 'italic', color: 'var(--clay)' }}>without barriers.</span>
              </motion.h1>

              <motion.p
                className="body-lg text-ink-60"
                style={{ marginTop: '1.5rem', maxWidth: '480px' }}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.18 }}
              >
                Understand sign language beyond the hands. Translate gestures,
                facial grammar and context into natural conversation.
              </motion.p>

              <motion.div
                style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '2rem' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <Link to="/screening" className="btn btn-primary btn-lg">
                  Start communicating
                  <ArrowRight size={18} />
                </Link>
                <a href="#how-it-works" className="btn btn-secondary btn-lg">
                  See how it works
                </a>
              </motion.div>

              {/* Small trust line */}
              <motion.div
                style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: '2.5rem' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <div style={{ display: 'flex', gap: 4 }}>
                  {['var(--clay)', 'var(--mustard)', 'var(--sage)'].map((c, i) => (
                    <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />
                  ))}
                </div>
                <p className="body-sm text-ink-60">
                  Hand signs · Facial grammar · Natural language
                </p>
              </motion.div>
            </div>

            {/* Right — webcam visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <div style={{ position: 'relative' }}>
                <WebcamFrame
                  isActive={true}
                  currentSign={{ label: 'HELLO' }}
                />
                {/* Floating annotation chips */}
                <motion.div
                  style={{
                    position: 'absolute', bottom: -16, left: -16,
                    background: 'var(--ivory)',
                    border: '1.5px solid var(--ink-10)',
                    borderRadius: 'var(--radius-md)',
                    padding: '10px 14px',
                    boxShadow: 'var(--shadow-md)',
                  }}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.55 }}
                >
                  <p className="label-mono text-clay" style={{ marginBottom: 2, fontSize: '0.6rem' }}>Detected</p>
                  <p className="heading-sm">HELLO</p>
                </motion.div>

                <motion.div
                  style={{
                    position: 'absolute', top: -12, right: -12,
                    background: 'var(--ink)',
                    borderRadius: 'var(--radius-md)',
                    padding: '8px 12px',
                    boxShadow: 'var(--shadow-md)',
                  }}
                  initial={{ opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                >
                  <span className="label-mono" style={{ color: 'rgba(245,241,232,0.7)', textTransform: 'uppercase', fontSize: '0.6rem' }}>SIGN TRANSLATOR CAM</span>
                  <p className="body-sm" style={{ color: 'var(--ivory)', fontWeight: 600 }}>Raised brows</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll cue */}
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <motion.a
            href="#meaning"
            style={{ color: 'var(--ink-30)', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
          >
            <span className="label-mono" style={{ fontSize: '0.6rem' }}>SCROLL</span>
            <ChevronDown size={16} />
          </motion.a>
        </div>
      </section>

      {/* ── SECTION 2: Meaning beyond hands ───────────────────── */}
      <Section id="meaning" style={{ background: 'var(--ivory)' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'clamp(3rem, 6vw, 6rem)',
          alignItems: 'start',
        }}>
          <div>
            <motion.span
              className="label-mono text-clay"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              style={{ display: 'block', marginBottom: '1rem' }}
            >
              Non-manual markers
            </motion.span>
            <motion.h2
              className="display-md"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Sign language is more than hands.
            </motion.h2>
            <motion.p
              className="body-lg text-ink-60"
              style={{ marginTop: '1rem', maxWidth: '420px' }}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              Meaning lives in movement, expression and context.
              Raised eyebrows can turn a statement into a question.
              A head tilt shifts emphasis. Sign Translator reads all of it.
            </motion.p>

            <motion.div
              style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--sage-20)', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--sage)' }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <p className="body-sm text-ink-60" style={{ lineHeight: 1.5 }}>
                <strong style={{ color: 'var(--ink)', fontWeight: 600 }}>Example:</strong> The sign for WATER signed with raised eyebrows and a forward head tilt
                is likely a question — "Do you have water?" — not just the word water.
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <MeaningEquation />
          </motion.div>
        </div>
      </Section>

      <hr className="divider" />

      {/* ── SECTION 3: Feature blocks ─────────────────────────── */}
      <Section id="how-it-works">
        <motion.div
          style={{ marginBottom: '3.5rem' }}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="label-mono text-clay" style={{ display: 'block', marginBottom: '0.75rem' }}>How it works</span>
          <h2 className="display-md">Three capabilities,<br />one seamless loop.</h2>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1px',
          background: 'var(--ink-10)',
          border: '1px solid var(--ink-10)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
        }}>
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.num}
              style={{
                padding: 'clamp(1.5rem, 3vw, 2.5rem)',
                background: 'var(--ivory)',
                display: 'flex', flexDirection: 'column', gap: '1rem',
              }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <span className="feature-number">{f.num}</span>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: f.accent }} />
              </div>
              <div>
                <h3 className="heading-lg" style={{ marginBottom: '0.5rem' }}>{f.title}</h3>
                <p className="body-md text-ink-60">{f.copy}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      <hr className="divider" />

      {/* ── SECTION 4: Communication loop ─────────────────────── */}
      <Section style={{ background: 'var(--ink)', color: 'var(--ivory)' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'clamp(3rem, 6vw, 6rem)',
          alignItems: 'center',
        }}>
          <div>
            <span className="label-mono" style={{ color: 'var(--sage)', display: 'block', marginBottom: '1rem' }}>
              The full loop
            </span>
            <h2 className="display-md" style={{ color: 'var(--ivory)' }}>
              Communication<br />flows both ways.
            </h2>
            <p className="body-lg" style={{ color: 'rgba(245,241,232,0.6)', marginTop: '1rem', maxWidth: '400px' }}>
              Sign Translator doesn't just interpret — it responds. Speak or type, and your words
              become signs. Every conversation can flow in both directions.
            </p>
            <Link to="/screening" className="btn btn-primary btn-lg" style={{ marginTop: '2rem', display: 'inline-flex' }}>
              Try it now
              <ArrowRight size={18} />
            </Link>
          </div>

          {/* Loop diagram */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="comm-loop" style={{ width: '100%', maxWidth: 260 }}>
              {LOOP_STEPS.map((step, i) => (
                <div key={step} className="comm-step" style={{ width: '100%' }}>
                  <motion.div
                    className="comm-step-box"
                    style={{
                      background: i === 0 ? 'var(--clay)' : i === 3 ? 'var(--mustard)' : 'rgba(245,241,232,0.08)',
                      border: `1.5px solid ${i === 0 ? 'var(--clay)' : i === 3 ? 'var(--mustard)' : 'rgba(245,241,232,0.12)'}`,
                      width: '100%',
                    }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.12, duration: 0.35 }}
                  >
                    <p className="label-mono" style={{
                      color: i === 0 || i === 3 ? 'var(--ivory)' : 'rgba(245,241,232,0.7)',
                      textAlign: 'center',
                    }}>
                      {step}
                    </p>
                  </motion.div>
                  {i < LOOP_STEPS.length - 1 && (
                    <div className="comm-arrow" style={{ background: 'rgba(245,241,232,0.15)' }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ── SECTION 5: Final CTA ───────────────────────────────── */}
      <section style={{ padding: 'clamp(5rem,10vw,10rem) 0' }}>
        <div className="container-narrow" style={{ textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <span className="label-mono text-clay" style={{ display: 'block', marginBottom: '1.25rem' }}>
              Get started
            </span>
            <h2 className="display-lg">
              Start a conversation.
            </h2>
            <p className="body-lg text-ink-60" style={{ marginTop: '1.25rem', maxWidth: '480px', margin: '1.25rem auto 0' }}>
              Sign to text, text to sign. Sign Translator is built for people who need communication
              that actually works in both directions.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', marginTop: '2.5rem' }}>
              <Link to="/auth" className="btn btn-ink btn-lg">
                Create account
                <ArrowRight size={18} />
              </Link>
              <Link to="/screening" className="btn btn-secondary btn-lg">
                Try as guest
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--ink-10)',
        padding: '1.75rem 0',
        background: 'var(--ivory)',
      }}>
        <div className="container flex-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <span className="body-sm text-ink-30">© 2025 Sign Translator. Built for communication.</span>
          <span className="label-mono text-ink-30" style={{ fontSize: '0.65rem' }}>
            Frontend demo · No backend yet
          </span>
        </div>
      </footer>
    </div>
  );
}
