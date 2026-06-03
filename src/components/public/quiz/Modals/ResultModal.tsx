import type { Employee, ScoreResult } from '../types'

const FACTORY_NAMES: Record<number, string> = {
  1: 'Zinus Global Indonesia',
  2: 'Zinus Global Indonesia – Karawang',
  3: 'Zinus Dream Indonesia',
}

interface ResultModalProps {
  isOpen: boolean
  onClose: () => void
  onReset: () => void
  result: ScoreResult        // post-test result
  preResult?: ScoreResult | null  // ← pre-test result (opsional)
  employee: Employee | null
}

const getFactoryName = (f: number | null) => f ? FACTORY_NAMES[f] ?? 'Unknown' : '-'

const TrophyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
    <path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
  </svg>
)

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
)

const FactoryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 20h20"/><path d="M4 20V8l4-3 4 3v12"/><path d="M12 20V5l4-3 4 3v15"/>
    <path d="M8 12h.01"/><path d="M8 16h.01"/><path d="M12 9h.01"/><path d="M12 13h.01"/><path d="M12 17h.01"/><path d="M16 9h.01"/><path d="M16 13h.01"/><path d="M16 17h.01"/>
  </svg>
)

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
)

// ── Score Card (reusable untuk pre & post) ──
function ScoreCard({
  label,
  result,
  accent,
}: {
  label: string
  result: ScoreResult
  accent: string
}) {
  const incorrect = result.total - result.correct

  return (
    <div style={{
      flex: 1,
      background: '#FAFAF8',
      border: `1px solid #E8E0D5`,
      borderRadius: 12,
      padding: '16px 14px',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Top accent line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: 3, background: accent, borderRadius: '12px 12px 0 0',
      }} />

      {/* Label */}
      <div style={{
        fontSize: 10, fontWeight: 700, letterSpacing: '0.12em',
        textTransform: 'uppercase', color: accent, marginBottom: 10,
      }}>
        {label}
      </div>

      {/* Score */}
      <div style={{
        fontSize: 40, fontWeight: 800, lineHeight: 1,
        color: '#1C1917', marginBottom: 4,
        fontVariantNumeric: 'tabular-nums',
      }}>
        {result.score.toFixed(0)}
      </div>
      <div style={{ fontSize: 11, color: '#9C8D7E', marginBottom: 14 }}>poin</div>

      {/* Benar / Salah */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
        <div style={{
          flex: 1, background: '#F0FDF4', border: '1px solid #BBF7D0',
          borderRadius: 8, padding: '8px 4px',
        }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#16A34A', lineHeight: 1 }}>
            {result.correct}
          </div>
          <div style={{ fontSize: 10, color: '#4ADE80', marginTop: 2 }}>Benar</div>
        </div>
        <div style={{
          flex: 1, background: '#FFF1F2', border: '1px solid #FECDD3',
          borderRadius: 8, padding: '8px 4px',
        }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#DC2626', lineHeight: 1 }}>
            {incorrect}
          </div>
          <div style={{ fontSize: 10, color: '#F87171', marginTop: 2 }}>Salah</div>
        </div>
      </div>
    </div>
  )
}

export const ResultModal = ({ isOpen, onClose, result, preResult, employee }: ResultModalProps) => {
  if (!isOpen) return null

  // Hitung delta score pre → post
  const delta = preResult ? result.score - preResult.score : null

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: 460 }}>

        {/* ── Header ── */}
        <div className="result-modal-header">
          <div className="result-trophy"><TrophyIcon /></div>
          <div className="result-modal-title">Training Selesai!</div>
          <div className="result-modal-sub">Pre-test & Post-test telah disimpan</div>
        </div>

        <div className="result-modal-body">

          {/* ── Score Comparison ── */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            {preResult && (
              <ScoreCard label="Pre-Test" result={preResult} accent="#9C8D7E" />
            )}
            <ScoreCard label="Post-Test" result={result} accent="#E85D26" />
          </div>

          {/* ── Delta / Peningkatan ── */}
          {delta !== null && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '10px 16px',
              borderRadius: 10,
              marginBottom: 16,
              background: delta >= 0 ? '#F0FDF4' : '#FFF1F2',
              border: `1px solid ${delta >= 0 ? '#BBF7D0' : '#FECDD3'}`,
              fontSize: 13,
              fontWeight: 600,
              color: delta >= 0 ? '#16A34A' : '#DC2626',
            }}>
              <span style={{ fontSize: 18 }}>{delta >= 0 ? '↑' : '↓'}</span>
              <span>
                {delta >= 0
                  ? `Peningkatan ${delta.toFixed(0)} poin dari pre-test`
                  : `Penurunan ${Math.abs(delta).toFixed(0)} poin dari pre-test`}
              </span>
            </div>
          )}

          {/* ── Info Karyawan ── */}
          <div className="result-stats">
            {[
              { icon: <UserIcon />,    label: 'Peserta', value: employee?.nama ?? '-' },
              { icon: <FactoryIcon />, label: 'Pabrik',  value: getFactoryName(employee?.factory ?? null) },
              { icon: <ClockIcon />,   label: 'Waktu',   value: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) },
            ].map(({ icon, label, value }) => (
              <div key={label} className="result-stat">
                <div className="result-stat-icon">{icon}</div>
                <div className="result-stat-label">{label}</div>
                <div className="result-stat-val">{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Actions: hanya Tutup ── */}
        <div className="result-modal-actions">
          <button className="modal-btn primary" style={{ width: '100%' }} onClick={onClose}>
            Tutup
          </button>
        </div>

      </div>
    </div>
  )
}