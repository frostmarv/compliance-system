// ✅ FIX 1: Import types dengan keyword 'type'
import { computeQuizStatus, getStatusMessage, checkFactoryAccess } from '@/lib/quiz-status'
import type { QuizSchedule, QuizStatus } from '@/lib/quiz-status'

interface NIKFormProps {
  // ── Quiz Context ──────────────────────────────────────────────
  quizName: string                        // Nama quiz
  quizSchedule: QuizSchedule | null       // Data schedule
  scheduleLoading?: boolean               // State loading schedule
  
  // ── NIK Logic ─────────────────────────────────────────────────
  nik: string
  onChange: (nik: string) => void
  onSubmit?: (nik: string) => void        // Callback saat NIK valid (auto-trigger)
  onFactoryMismatch?: (reason: string) => void // Callback jika factory tidak cocok
  userFactory?: number                    // Factory user (untuk validasi opsional di sini)
  
  // ── UI States ─────────────────────────────────────────────────
  searching?: boolean
  found?: boolean
  error?: string
  disabled?: boolean
}

export const NIKForm = ({ 
  quizName,
  quizSchedule,
  scheduleLoading = false,
  nik,
  onChange,
  onSubmit,
  onFactoryMismatch,
  userFactory,
  searching = false, 
  found = false,
  error,
  disabled = false
}: NIKFormProps) => {
  
  // ─ Compute Status (Hanya cek waktu & manual lock) ─────────────
  let status: QuizStatus = 'LOCKED'
  
  if (scheduleLoading) {
    status = 'LOCKED' // Tampil locked sementara saat fetch
  } else if (quizSchedule !== null) {
    status = computeQuizStatus(quizSchedule)
  }

  const isTimeValid = status === 'OPEN' && !disabled
  const message = getStatusMessage(status, quizName)
  
  // ── Handlers ─────────────────────────────────────────────────
  const handleNikChange = (val: string) => {
    const clean = val.replace(/\D/g, '').slice(0, 8)
    onChange(clean)
    
    // ✅ AUTO-SUBMIT: Jika NIK 8 digit + waktu valid + belum searching
    if (clean.length === 8 && isTimeValid && !searching && onSubmit) {
      
      // Optional: Factory check di sini (jika userFactory sudah tersedia)
      if (found && userFactory && quizSchedule && onFactoryMismatch) {
        const access = checkFactoryAccess(quizSchedule, userFactory)
        if (!access.allowed) {
          onFactoryMismatch(access.reason || 'Anda tidak diizinkan mengambil quiz ini karena perbedaan pabrik.')
          return // Stop auto-submit
        }
      }
      
      // Trigger parent handler
      onSubmit(clean)
    }
  }

  // ── Tone-based Styles ────────────────────────────────────────
  const toneStyles: Record<typeof message.tone, { bg: string; border: string; text: string; icon: string }> = {
    success: { bg: '#f0fdfa', border: '#329F96', text: '#065f46', icon: '#329F96' },
    info:    { bg: '#f0f9ff', border: '#0ea5e9', text: '#075985', icon: '#0ea5e9' },
    warning: { bg: '#fffbeb', border: '#f59e0b', text: '#92400e', icon: '#f59e0b' },
    error:   { bg: '#fef2f2', border: '#ef4444', text: '#b91c1c', icon: '#ef4444' },
  }
  const tone = toneStyles[message.tone]

  // ── Loading Skeleton UI (Saat fetch schedule) ─────────────────
  if (scheduleLoading) {
    return (
      <div className="card nik-card" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '40px 0' }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#e2e8f0', animation: 'pulse 1.5s infinite' }} />
          <p style={{ color: '#64748b', fontSize: 14, fontWeight: 500 }}>Memuat jadwal quiz...</p>
        </div>
      </div>
    )
  }

  // ── Main UI ──────────────────────────────────────────────────
  return (
    <div className="card nik-card" style={{ 
      border: `1px solid ${tone.border}`, 
      background: tone.bg,
      transition: 'border-color 0.2s, background 0.2s'
    }}>
      
      {/* ─ Status Badge ─────────────────────────────────────── */}
      <div style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: 6, 
        padding: '6px 12px', 
        borderRadius: 99, 
        background: 'white', 
        border: `1px solid ${tone.border}`,
        marginBottom: 16,
        fontSize: 12,
        fontWeight: 600,
        color: tone.text
      }}>
        <span style={{ 
          width: 8, height: 8, borderRadius: '50%', 
          background: tone.icon,
          animation: status === 'OPEN' ? 'pulse 2s infinite' : 'none'
        }} />
        {status === 'OPEN' ? '🟢 Aktif' : 
         status === 'UPCOMING' ? '🕐 Akan Datang' :
         status === 'EXPIRED' ? '🔒 Kedaluwarsa' : '🚫 Terkunci'}
      </div>

      {/* ── Header ───────────────────────────────────────────── */}
      <div className="nik-icon-wrap" style={{ color: tone.icon }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2" />
        </svg>
      </div>
      
      <div className="nik-title" style={{ color: tone.text }}>{quizName}</div>
      <div className="nik-subtitle" style={{ color: tone.text, opacity: 0.8 }}>
        {message.title}
      </div>

      {/* ── Info Message ─────────────────────────────────────── */}
      <div style={{ 
        margin: '16px 0', 
        padding: '12px 16px', 
        borderRadius: 12, 
        background: 'white',
        border: `1px solid ${tone.border}`,
        fontSize: 13,
        color: tone.text,
        lineHeight: 1.4
      }}>
        {message.description}
      </div>
  
      {/* ── NIK Input (Active if Time Valid) ─────────────────── */}
      <span className="nik-label" style={{ 
        color: isTimeValid ? tone.text : '#9ca3af',
        opacity: isTimeValid ? 1 : 0.6
      }}>
        Nomor Induk Karyawan
      </span>
      
      <div className="nik-input-wrap">
        <input
          className="nik-input"
          type="text"
          inputMode="numeric"
          placeholder={isTimeValid ? "Contoh: 12345678" : "Quiz tidak tersedia"}
          value={nik}
          maxLength={8}
          autoFocus={isTimeValid}
          disabled={!isTimeValid || searching}
          onChange={e => handleNikChange(e.target.value)}
          style={{ 
            opacity: isTimeValid ? 1 : 0.5,
            cursor: isTimeValid ? 'text' : 'not-allowed'
          }}
        />
        
        {/* Spinner saat searching */}
        {searching && <div className="nik-spinner" />}
        
        {/* Checkmark saat found + valid */}
        {!searching && found && isTimeValid && (
          <div className="nik-check" style={{ color: tone.icon }}>
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
  
      {/* ── Progress Dots ────────────────────────────────────── */}
      <div className="nik-dots" style={{ opacity: isTimeValid ? 1 : 0.3 }}>
        {Array.from({length: 8}).map((_, i) => (
          <div key={i} className={`nik-dot${i < nik.length ? ' filled' : ''}`} 
               style={{ background: i < nik.length ? tone.icon : '#e2e8f0' }} />
        ))}
      </div>
      
      {/* ── Hint Text ───────────────────────────────────────── */}
      <div className="nik-hint" style={{ color: isTimeValid ? '#64748b' : '#9ca3af' }}>
        {nik.length}/8 digit — {isTimeValid ? 'otomatis lanjut' : 'quiz tidak tersedia'}
      </div>
  
      {/* ─ Loading Skeleton (Saat verifikasi NIK) ───────────── */}
      {searching && (
        <div style={{marginTop:20,display:'flex',flexDirection:'column',gap:8}}>
          {[0.7,0.5,0.6].map((w,i) => (
            <div key={i} style={{height:10,borderRadius:99,background:'#F0F1F5',width:`${w*100}%`,animation:'pulse 1.5s ease-in-out infinite',animationDelay:`${i*0.15}s`}} />
          ))}
        </div>
      )}
  
      {/* ── Error Message ────────────────────────────────────── */}
      {error && !searching && (
        <div style={{
          marginTop:16,
          padding:'12px 16px',
          background:'#FEF2F2',
          border:'1px solid #FECACA',
          borderRadius:12,
          color:'#B91C1C',
          fontSize:13
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* ✅ NO SUBMIT BUTTON - Auto-proceed when NIK complete */}
      {/* ✅ FIX: HAPUS hint "memproses" yang muncul sebelum searching */}
    </div>
  )
}