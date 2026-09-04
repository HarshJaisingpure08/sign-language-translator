import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Settings, User, Menu, X } from 'lucide-react';
import { useState } from 'react';

// SVG logo mark: two hands forming a gesture
function LogoMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <circle cx="14" cy="14" r="13" stroke="#17221F" strokeWidth="1.5"/>
      {/* Left hand suggestion */}
      <path d="M8 16 C8 16, 8 11, 10 10 C11 9.5, 11 11, 11 12 L11 14 C11 14, 12 12, 12.5 11 C13 10, 14 10.5, 13.5 12 L13 14 C13 14, 14 12, 14.5 11.5 C15 11, 15.8 11.5, 15.5 13 L15 15" 
        stroke="#C86B4A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Right dots suggestion */}
      <circle cx="19" cy="12" r="1.2" fill="#D6B45A"/>
      <circle cx="19" cy="15.5" r="1.2" fill="#D6B45A" opacity="0.6"/>
      <circle cx="19" cy="19" r="1.2" fill="#D6B45A" opacity="0.3"/>
    </svg>
  );
}

const NAV_LINKS = [
  { to: '/',          label: 'Product' },
  { to: '/screening', label: 'Screening' },
  { to: '/translate', label: 'Translate' },
  { to: '/speak',     label: 'Speak' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="navbar" role="banner">
      <div className="container navbar-inner">
        {/* Logo */}
        <Link to="/" className="logo-mark" aria-label="Sign Translator home">
          <LogoMark />
          <span className="wordmark">Sign Translator</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hide-mobile" aria-label="Main navigation">
          <ul style={{ display: 'flex', alignItems: 'center', gap: '2rem', listStyle: 'none' }}>
            {NAV_LINKS.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <NavLink
            to="/settings"
            className={({ isActive }) => `btn btn-ghost btn-icon hide-mobile ${isActive ? 'text-clay' : ''}`}
            aria-label="Settings"
          >
            <Settings size={18} />
          </NavLink>
          <Link to="/auth" className="btn btn-primary btn-sm hide-mobile">
            Get started
          </Link>

          {/* Mobile hamburger */}
          <button
            className="btn btn-ghost btn-icon show-mobile-only"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
          style={{
            background: 'var(--ivory)',
            borderTop: '1px solid var(--ink-10)',
            padding: '1rem var(--container-pad, 1.25rem)',
          }}
        >
          <nav aria-label="Mobile navigation">
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {NAV_LINKS.map(({ to, label }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={to === '/'}
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    style={{ display: 'block', padding: '0.6rem 0' }}
                    onClick={() => setMenuOpen(false)}
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
              <li style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--ink-10)' }}>
                <Link to="/auth" className="btn btn-primary" style={{ width: '100%' }} onClick={() => setMenuOpen(false)}>
                  Get started
                </Link>
              </li>
            </ul>
          </nav>
        </motion.div>
      )}
    </header>
  );
}
