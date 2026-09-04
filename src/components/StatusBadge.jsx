/**
 * StatusBadge — shows detection/system status with a pulsing dot.
 *
 * Props:
 *   status: 'active' | 'demo' | 'inactive'
 *   label: string
 */
export default function StatusBadge({ status = 'inactive', label }) {
  return (
    <span className={`status-badge ${status}`} role="status" aria-label={`${label}: ${status}`}>
      <span className="dot" aria-hidden="true" />
      {label}
    </span>
  );
}
