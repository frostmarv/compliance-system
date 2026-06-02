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

export const ResultModal = ({ isOpen, onClose, onReset, result, employee }: ResultModalProps) => {
  if (!isOpen) return null

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{maxWidth:440}}>
        <div className="result-modal-header">
          <div className="result-trophy">🏆</div>
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
          <div className={`result-verdict${result.score >= 70 ? ' pass' : ' fail'}`}>
            {result.score >= 70 ? '✅ LULUS' : '📝 PERLU REMEDIAL'}
          </div>
          <div className="result-stats">
            {[
              { icon: '📋', label: 'Training', value: '5S' },
              { icon: '👤', label: 'Peserta', value: employee?.nama ?? '-' },
              { icon: '🏭', label: 'Pabrik', value: getFactoryName(employee?.factory ?? null) },
              { icon: '🕐', label: 'Waktu', value: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) },
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