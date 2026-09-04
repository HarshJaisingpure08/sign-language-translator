import { useState } from 'react';
import { motion } from 'framer-motion';
import { MOCK_USER } from '../data/mockData';
import { User, Camera, Mic, Languages, SlidersHorizontal, Accessibility, Sun } from 'lucide-react';

function SettingSection({ icon, title, children }) {
  return (
    <div style={{
      padding: '1.5rem',
      background: 'var(--white)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--ink-10)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.25rem' }}>
        <div style={{
          width: 32, height: 32, borderRadius: 'var(--radius-sm)',
          background: 'var(--ink-10)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          {icon}
        </div>
        <h2 className="heading-sm">{title}</h2>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {children}
      </div>
    </div>
  );
}

function Toggle({ id, label, description, defaultChecked, onChange }) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
      <div>
        <label className="form-label" htmlFor={id} style={{ cursor: 'pointer', marginBottom: 2 }}>{label}</label>
        {description && <p className="body-sm text-ink-60" style={{ fontSize: '0.8rem' }}>{description}</p>}
      </div>
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={() => { setChecked(!checked); onChange?.(!checked); }}
        style={{
          flexShrink: 0,
          width: 40, height: 22, borderRadius: 99,
          background: checked ? 'var(--clay)' : 'var(--ink-10)',
          border: 'none', cursor: 'pointer', position: 'relative',
          transition: 'background 0.2s',
        }}
        aria-label={label}
      >
        <span style={{
          position: 'absolute', top: 3, left: checked ? 21 : 3,
          width: 16, height: 16, borderRadius: '50%',
          background: 'var(--white)',
          transition: 'left 0.2s',
          boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
        }} />
      </button>
    </div>
  );
}

function Select({ id, label, options, defaultValue }) {
  return (
    <div>
      <label className="form-label" htmlFor={id}>{label}</label>
      <select
        id={id}
        defaultValue={defaultValue}
        style={{
          width: '100%', padding: '0.65rem 1rem',
          border: '1.5px solid var(--ink-10)', borderRadius: 'var(--radius-md)',
          background: 'var(--white)', fontFamily: 'var(--font-sans)',
          fontSize: '0.9rem', color: 'var(--ink)', outline: 'none',
          cursor: 'pointer',
          appearance: 'auto',
        }}
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

const SECTIONS = [
  {
    id: 'profile',
    icon: <User size={16} style={{ color: 'var(--ink-60)' }} />,
    title: 'Profile',
  },
  {
    id: 'camera',
    icon: <Camera size={16} style={{ color: 'var(--ink-60)' }} />,
    title: 'Camera',
  },
  {
    id: 'microphone',
    icon: <Mic size={16} style={{ color: 'var(--ink-60)' }} />,
    title: 'Microphone',
  },
  {
    id: 'language',
    icon: <Languages size={16} style={{ color: 'var(--ink-60)' }} />,
    title: 'Language',
  },
  {
    id: 'translation',
    icon: <SlidersHorizontal size={16} style={{ color: 'var(--ink-60)' }} />,
    title: 'Translation preferences',
  },
  {
    id: 'accessibility',
    icon: <Accessibility size={16} style={{ color: 'var(--ink-60)' }} />,
    title: 'Accessibility',
  },
  {
    id: 'appearance',
    icon: <Sun size={16} style={{ color: 'var(--ink-60)' }} />,
    title: 'Appearance',
  },
];

export default function Settings() {
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div style={{ background: 'var(--ivory)', minHeight: 'calc(100vh - 60px)' }}>
      <div className="container" style={{ padding: 'clamp(1.5rem,3vw,2.5rem) clamp(1.25rem,5vw,3rem)', maxWidth: 860 }}>

        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <span className="label-mono text-clay" style={{ display: 'block', marginBottom: '0.4rem' }}>
            Settings
          </span>
          <h1 className="heading-lg">Preferences.</h1>
          <p className="body-sm text-ink-60" style={{ marginTop: '0.3rem' }}>
            Configure your camera, language, and translation settings.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

          {/* Profile */}
          <SettingSection icon={<User size={16} style={{ color: 'var(--ink-60)' }} />} title="Profile">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: '1rem' }}>
              <div>
                <label className="form-label" htmlFor="settings-name">Display name</label>
                <input id="settings-name" type="text" className="form-input" defaultValue={MOCK_USER.name} />
              </div>
              <div>
                <label className="form-label" htmlFor="settings-email">Email</label>
                <input id="settings-email" type="email" className="form-input" placeholder="you@example.com" />
              </div>
            </div>
          </SettingSection>

          {/* Camera */}
          <SettingSection icon={<Camera size={16} style={{ color: 'var(--ink-60)' }} />} title="Camera">
            <Select
              id="settings-camera"
              label="Camera device"
              defaultValue="default"
              options={[
                { value: 'default', label: 'System default' },
                { value: 'facetime', label: 'FaceTime HD Camera' },
                { value: 'external', label: 'External USB camera' },
              ]}
            />
            <Toggle
              id="toggle-mirror"
              label="Mirror preview"
              description="Flip the camera preview horizontally."
              defaultChecked={true}
            />
          </SettingSection>

          {/* Microphone */}
          <SettingSection icon={<Mic size={16} style={{ color: 'var(--ink-60)' }} />} title="Microphone">
            <Select
              id="settings-mic"
              label="Microphone device"
              defaultValue="default"
              options={[
                { value: 'default', label: 'System default' },
                { value: 'built-in', label: 'Built-in microphone' },
              ]}
            />
          </SettingSection>

          {/* Language */}
          <SettingSection icon={<Languages size={16} style={{ color: 'var(--ink-60)' }} />} title="Language">
            <Select
              id="settings-sign-lang"
              label="Sign language"
              defaultValue="ASL"
              options={[
                { value: 'ASL', label: 'American Sign Language (ASL)' },
                { value: 'BSL', label: 'British Sign Language (BSL)' },
                { value: 'ISL', label: 'Indian Sign Language (ISL)' },
                { value: 'Auslan', label: 'Australian Sign Language (Auslan)' },
              ]}
            />
            <Select
              id="settings-output-lang"
              label="Text output language"
              defaultValue="en"
              options={[
                { value: 'en', label: 'English' },
                { value: 'es', label: 'Spanish' },
                { value: 'fr', label: 'French' },
              ]}
            />
          </SettingSection>

          {/* Translation preferences */}
          <SettingSection icon={<SlidersHorizontal size={16} style={{ color: 'var(--ink-60)' }} />} title="Translation preferences">
            <Select
              id="settings-trans-mode"
              label="Translation mode"
              defaultValue="sentence"
              options={[
                { value: 'sentence', label: 'Sentence-level (recommended)' },
                { value: 'word', label: 'Word-by-word' },
              ]}
            />
            <Toggle
              id="toggle-confidence"
              label="Show confidence scores"
              description="Display recognition confidence percentages in the UI."
              defaultChecked={MOCK_USER.showConfidenceScores}
            />
            <Toggle
              id="toggle-facial"
              label="Enable facial grammar analysis"
              description="Track non-manual markers — eyebrows, expression, head movement."
              defaultChecked={MOCK_USER.showFacialMarkers}
            />
          </SettingSection>

          {/* Accessibility */}
          <SettingSection icon={<Accessibility size={16} style={{ color: 'var(--ink-60)' }} />} title="Accessibility">
            <Toggle
              id="toggle-reduced-motion"
              label="Reduce motion"
              description="Minimise animations throughout the interface."
              defaultChecked={false}
            />
            <Toggle
              id="toggle-high-contrast"
              label="High contrast text"
              description="Increase text contrast for improved readability."
              defaultChecked={false}
            />
            <Toggle
              id="toggle-focus-indicators"
              label="Enhanced focus indicators"
              description="Show prominent keyboard focus rings on all elements."
              defaultChecked={true}
            />
          </SettingSection>

          {/* Appearance */}
          <SettingSection icon={<Sun size={16} style={{ color: 'var(--ink-60)' }} />} title="Appearance">
            <div>
              <p className="form-label" style={{ marginBottom: '0.6rem' }}>Theme</p>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {['Light', 'Dark', 'System'].map(t => (
                  <button
                    key={t}
                    className={`btn btn-sm ${t === 'Light' ? 'btn-ink' : 'btn-secondary'}`}
                    style={{ minWidth: 80 }}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <p className="body-sm text-ink-30" style={{ marginTop: '0.5rem', fontSize: '0.78rem' }}>
                Dark mode coming soon.
              </p>
            </div>
          </SettingSection>

          {/* Save */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0.5rem 0' }}>
            <button
              className="btn btn-primary"
              onClick={handleSave}
              style={{ minWidth: 120 }}
            >
              {saved ? '✓ Saved' : 'Save changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
