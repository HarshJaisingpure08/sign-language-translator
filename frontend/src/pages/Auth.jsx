import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}

export default function Auth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    // Simulate auth — replace with real auth later
    setTimeout(() => {
      setLoading(false);
      navigate('/screening');
    }, 900);
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    }}>
      {/* Left — brand panel */}
      <div style={{
        background: 'var(--ink)',
        padding: 'clamp(3rem,6vw,6rem)',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        minHeight: '420px',
      }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <span className="wordmark" style={{ color: 'var(--ivory)', fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: '1.15rem', letterSpacing: '-0.03em' }}>
            Sign Translator
          </span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <h1 className="display-md" style={{ color: 'var(--ivory)', marginBottom: '1.5rem' }}>
            Every conversation<br />
            <span style={{ fontStyle: 'italic', color: 'var(--clay)' }}>deserves to be heard.</span>
          </h1>
          <p className="body-md" style={{ color: 'rgba(245,241,232,0.55)', maxWidth: '380px' }}>
            Sign Translator bridges the gap between sign language users and the hearing world —
            using full-context understanding, not just hand shape recognition.
          </p>

          <div style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { dot: 'var(--clay)', text: 'Hand sign detection' },
              { dot: 'var(--mustard)', text: 'Facial grammar & expression' },
              { dot: 'var(--sage)', text: 'Natural language output' },
            ].map(({ dot, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: dot, flexShrink: 0 }} />
                <p className="body-sm" style={{ color: 'rgba(245,241,232,0.6)' }}>{text}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <p className="body-sm" style={{ color: 'rgba(245,241,232,0.25)' }}>
          © 2025 Sign Translator
        </p>
      </div>

      {/* Right — auth form */}
      <div style={{
        background: 'var(--ivory)',
        padding: 'clamp(3rem,6vw,6rem)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
      }}>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          style={{ maxWidth: 380, width: '100%', margin: '0 auto' }}
        >
          {/* Mode toggle */}
          <div style={{
            display: 'flex', gap: 0,
            border: '1.5px solid var(--ink-10)',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            marginBottom: '2rem',
          }}>
            {['signin', 'signup'].map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`btn ${mode === m ? 'btn-ink' : 'btn-ghost'}`}
                style={{ flex: 1, borderRadius: 0, border: 'none' }}
              >
                {m === 'signin' ? 'Sign in' : 'Create account'}
              </button>
            ))}
          </div>

          <h2 className="heading-lg" style={{ marginBottom: '0.4rem' }}>
            {mode === 'signin' ? 'Welcome back.' : 'Get started.'}
          </h2>
          <p className="body-sm text-ink-60" style={{ marginBottom: '1.75rem' }}>
            {mode === 'signin'
              ? 'Sign in to access your conversations.'
              : 'Create an account to save your sessions.'}
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label className="form-label" htmlFor="auth-email">Email</label>
              <input
                id="auth-email"
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div>
              <label className="form-label" htmlFor="auth-password">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="auth-password"
                  type={showPass ? 'text' : 'password'}
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                  required
                  style={{ paddingRight: '2.75rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                  style={{
                    position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-30)',
                    display: 'flex', alignItems: 'center',
                  }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ marginTop: '0.5rem', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Continuing…' : 'Continue'}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '1.25rem 0' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--ink-10)' }} />
            <span className="body-sm text-ink-30">or</span>
            <div style={{ flex: 1, height: 1, background: 'var(--ink-10)' }} />
          </div>

          {/* Google sign-in placeholder */}
          <button
            className="btn btn-secondary"
            style={{ width: '100%', gap: 10 }}
            onClick={() => navigate('/screening')}
            type="button"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          {/* Guest access */}
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <button
              className="btn btn-ghost"
              style={{ width: '100%', color: 'var(--clay)' }}
              onClick={() => navigate('/screening')}
              type="button"
            >
              Continue as guest
            </button>
            <p className="body-sm text-ink-30" style={{ marginTop: '0.5rem', fontSize: '0.78rem' }}>
              No account needed. Sessions won't be saved.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
