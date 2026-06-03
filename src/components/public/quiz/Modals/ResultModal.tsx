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
  result: ScoreResult
  employee: Employee | null
}

const getFactoryName = (f: number | null) => f ? FACTORY_NAMES[f] ?? 'Unknown' : '-'

// SVG Icons (menggunakan currentColor agar mengikuti warna CSS parent)
const TrophyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
    <path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
  </svg>
)

const TrainingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
    <path d="M9 12h6"/><path d="M9 16h6"/>
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

export const ResultModal = ({ isOpen, onClose, onReset, result, employee }: ResultModalProps) => {
  if (!isOpen) return null

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: 440 }}>
        <div className="result-modal-header">
          <div className="result-trophy"><TrophyIcon /></div>
          <div className="result-modal-title">Ujian Selesai!</div>
          <div className="result-modal-sub">Hasil telah disimpan ke server</div>
        </div>
        
        <div className="result-modal-body">
          <div className="result-score-ring">
            <div className="result-score-val">{result.score.toFixed(0)}</div>
            <div className="result-score-unit">poin</div>
          </div>
          
          <div className="result-breakdown">
            <div className="breakdown-item">
              <div className="breakdown-val correct">{result.correct}</div>
              <div className="breakdown-label">Benar</div>
            </div>
            <div className="breakdown-item">
              <div className="breakdown-val incorrect">{result.total - result.correct}</div>
              <div className="breakdown-label">Salah</div>
            </div>
          </div>

          {/* Blok verdict (Lulus/Remedial) telah dihapus */}

          <div className="result-stats">
            {[
              { icon: <TrainingIcon />, label: 'Training', value: '5S' },
              { icon: <UserIcon />, label: 'Peserta', value: employee?.nama ?? '-' },
              { icon: <FactoryIcon />, label: 'Pabrik', value: getFactoryName(employee?.factory ?? null) },
              { icon: <ClockIcon />, label: 'Waktu', value: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) },
            ].map(({ icon, label, value }) => (
              <div key={label} className="result-stat">
                <div className="result-stat-icon">{icon}</div>
                <div className="result-stat-label">{label}</div>
                <div className="result-stat-val">{value}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="result-modal-actions">
          <button className="modal-btn secondary" onClick={onReset}>Ujian Lain</button>
          <button className="modal-btn primary" onClick={onClose}>Tutup</button>
        </div>
      </div>
    </div>
  )
}