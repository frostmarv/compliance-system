import { useEffect, useRef, useState } from 'react'
import { computeQuizStatus, getStatusMessage } from '@/lib/quiz-status'
import type { QuizSchedule, QuizStatus } from '@/lib/quiz-status'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import type { DotLottie } from '@lottiefiles/dotlottie-react'
import idCardAnimation from '@/assets/animations/ID-Card.lottie'
import idVerifiedAnimation from '@/assets/animations/ID-Verified.lottie'

interface NIKFormProps {
  // ── Quiz Context ──────────────────────────────────────────────
  quizName: string                        // Nama quiz
  quizSchedule: QuizSchedule | null       // Data schedule
  scheduleLoading?: boolean               // State loading schedule

  // ── NIK Config ────────────────────────────────────────────────
  // Default NIK_MIN=8, NIK_MAX=8 (untuk quiz umum, NIK 8 digit fix)
  // Untuk CTPAT: nikMin=8, nikMax=15 (NIK bisa 8–15 digit)
  nikMin?: number
  nikMax?: number

  // ── NIK Logic ─────────────────────────────────────────────────
  nik: string
  onChange: (nik: string) => void
  onSubmit?: (nik: string) => void        // Callback saat NIK valid (auto-trigger)
  // ── UI States ─────────────────────────────────────────────────
  searching?: boolean
  found?: boolean
  error?: string
  disabled?: boolean
  /** Dipanggil sekali setelah popup verifikasi selesai animasi & ketutup.
   *  Parent bisa pakai ini untuk baru menampilkan ErrorModal-nya sendiri,
   *  supaya gak nongol bareng/nembus di belakang popup verifikasi. */
  onVerificationDone?: () => void
}

export const NIKForm = ({
  quizName,
  quizSchedule,
  scheduleLoading = false,
  nikMin = 8,
  nikMax = 8,
  nik,
  onChange,
  onSubmit,
  searching = false,
  found = false,
  error,
  disabled = false,
  onVerificationDone,
}: NIKFormProps) => {

  // ─ Compute Status (Hanya cek waktu & manual lock) ─────────────
  let status: QuizStatus = 'LOCKED'

  if (scheduleLoading) {
    status = 'LOCKED'
  } else if (quizSchedule !== null) {
    status = computeQuizStatus(quizSchedule)
  }

  const isTimeValid = status === 'OPEN' && !disabled
  const message = getStatusMessage(status, quizName)

  // ── Handlers ─────────────────────────────────────────────────
  const handleNikChange = (val: string) => {
    const clean = val.replace(/\D/g, '').slice(0, nikMax)
    onChange(clean)

    // AUTO-SUBMIT:
    // - Jika nikMin === nikMax (misal 8): trigger tepat di 8 digit
    // - Jika nikMin < nikMax (misal 8–15, kasus CTPAT): trigger di nikMax (15)
    //   karena user dengan NIK 8 digit harus mengetik sampai 15 baru dicari,
    //   KECUALI kita ingin support submit di nikMax saja untuk CTPAT.
    //
    // Lihat fetchEmployee di CtpatQuiz.tsx — ia menerima NIK 8–15 dan akan
    // mencari ke DB dengan panjang berapa pun asalkan >= nikMin. Jadi kita
    // tambahkan tombol "Cari" sebagai fallback untuk nikMin < nikMax.
    //
    // Untuk auto-submit: trigger di nikMax (selalu konsisten).
    if (clean.length === nikMax && onSubmit) {
      onSubmit(clean)
    }
  }

  // Tombol "Cari Manual" muncul jika:
  //   - nikMin < nikMax (variabel-length NIK, misal CTPAT)
  //   - nik sudah >= nikMin dan < nikMax (belum capai auto-trigger)
  //   - tidak sedang searching
  const showManualSearch =
    nikMin < nikMax &&
    nik.length >= nikMin &&
    nik.length < nikMax &&
    !searching &&
    isTimeValid

  const handleManualSearch = () => {
    if (onSubmit && nik.length >= nikMin) {
      onSubmit(nik)
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

  // ── Sinkronisasi popup verifikasi dengan durasi animasi ────────
  // `searching` bisa berubah false kapan aja (tergantung kecepatan DB),
  // tapi kita gak mau motong animasi ID-Verified.lottie di tengah jalan.
  // Jadi: popup baru beneran ketutup begitu animasi nyampe akhir loop
  // (`onComplete`), bukan langsung pas `searching` jadi false.
  const [popupVisible, setPopupVisible] = useState(false)
  const dotLottieRef = useRef<DotLottie | null>(null)
  const pendingCloseRef = useRef(false)
  const [loopDurationMs, setLoopDurationMs] = useState(2500) // fallback sebelum durasi asli kebaca

  useEffect(() => {
    if (searching) {
      pendingCloseRef.current = false
      setPopupVisible(true)
    } else {
      // Tandai "boleh ditutup setelah loop ini selesai"
      pendingCloseRef.current = true
    }
  }, [searching])

  const closePopup = () => {
    pendingCloseRef.current = false
    setPopupVisible(false)
    onVerificationDone?.()
  }

  const handleAnimationComplete = () => {
    if (pendingCloseRef.current) {
      closePopup()
    }
  }

  // Attach event listener manual ke instance dotLottie.
  // PENTING: dengan loop=true, event yang fire tiap 1 putaran selesai
  // itu 'loop' — bukan 'complete' ('complete' cuma fire kalau loop=false
  // atau pas animasi player di-stop). Jadi kita dengarin dua-duanya.
  //
  // Kita juga baca durasi ASLI animasi (totalFrames / frameRate) begitu
  // player selesai load, biar safety-timeout di bawah gak nebak-nebak dan
  // gak motong animasi sebelum sempat nyampe akhir loop.
  const handleDotLottieRef = (instance: DotLottie | null) => {
    if (dotLottieRef.current) {
      dotLottieRef.current.removeEventListener('complete', handleAnimationComplete)
      dotLottieRef.current.removeEventListener('loop', handleAnimationComplete)
    }
    dotLottieRef.current = instance
    if (instance) {
      instance.addEventListener('complete', handleAnimationComplete)
      instance.addEventListener('loop', handleAnimationComplete)
      instance.addEventListener('load', () => {
        // Akses via `as any` karena nama properti (frameRate/totalFrames/duration)
        // bisa beda antar versi @lottiefiles/dotlottie-react.
        const inst = instance as any
        const frames = inst.totalFrames ?? 0
        const fps = inst.frameRate ?? inst.frameRate?.() ?? 30
        const durationSec = inst.duration ?? (frames > 0 && fps > 0 ? frames / fps : 0)
        if (durationSec > 0) {
          setLoopDurationMs(Math.ceil(durationSec * 1000))
        }
      })
    }
  }

  // Safety net: begitu searching selesai (pendingClose jadi true), kasih
  // jendela selama 1 durasi loop penuh (+ buffer) buat nunggu event
  // loop/complete nutup popup dengan mulus. Kalau lewat itu (mis. animasi
  // gagal load), paksa tutup — supaya popup gak nyangkut selamanya.
  useEffect(() => {
    if (searching || !popupVisible) return
    const safety = setTimeout(() => {
      if (pendingCloseRef.current) closePopup()
    }, loopDurationMs + 300)
    return () => clearTimeout(safety)
  }, [searching, popupVisible, loopDurationMs])

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
        {status === 'OPEN'     ? '🟢 Aktif' :
         status === 'UPCOMING' ? '🕐 Akan Datang' :
         status === 'EXPIRED'  ? '🔒 Kedaluwarsa' : '🚫 Terkunci'}
      </div>

      {/* ── Header ───────────────────────────────────────────── */}
      <div className="nik-icon-wrap" style={{ width: 88, height: 88, margin: '0 auto', color: tone.icon }}>
        <DotLottieReact
          src={idCardAnimation}
          autoplay
          loop
          style={{ width: '100%', height: '100%' }}
        />
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
          placeholder={isTimeValid ? "Contoh: 1234567899" : "Quiz tidak tersedia"}
          value={nik}
          maxLength={nikMax}
          autoFocus={isTimeValid}
          disabled={!isTimeValid || searching}
          onChange={e => handleNikChange(e.target.value)}
          style={{
            opacity: isTimeValid ? 1 : 0.5,
            cursor: isTimeValid ? 'text' : 'not-allowed'
          }}
        />

        {/* Checkmark saat found + valid */}
        {!searching && found && isTimeValid && (
          <div className="nik-check" style={{ color: tone.icon }}>
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>

      {/* ── Progress Dots ─────────────────────────────────────── */}
      {/* Render nikMax slot. Jika nikMin < nikMax, beri gap visual setelah dot ke-nikMin */}
      <div className="nik-dots" style={{ opacity: isTimeValid ? 1 : 0.3 }}>
        {Array.from({ length: nikMax }).map((_, i) => (
          <div
            key={i}
            className={`nik-dot${i < nik.length ? ' filled' : ''}`}
            style={{
              background: i < nik.length ? tone.icon : '#e2e8f0',
              // Gap visual setelah digit ke-nikMin sebagai penanda "NIK minimum tercapai"
              // Hanya ditampilkan jika nikMin < nikMax (NIK variabel)
              marginRight: nikMin < nikMax && i === nikMin - 1 ? 8 : undefined,
            }}
          />
        ))}
      </div>

      {/* ── Hint Text ───────────────────────────────────────── */}
      <div className="nik-hint" style={{ color: isTimeValid ? '#64748b' : '#9ca3af' }}>
        {!isTimeValid
          ? `${nik.length}/${nikMax} digit — quiz tidak tersedia`
          : nik.length === nikMax
          ? `${nik.length}/${nikMax} digit — otomatis mencari...`
          : nik.length >= nikMin
          ? nikMin < nikMax
            // NIK variabel (misal CTPAT): sudah valid, bisa lanjut atau tekan Cari
            ? `${nik.length}/${nikMax} digit — NIK valid, tekan Cari atau lanjut mengetik`
            // NIK fix tapi entah kenapa belum nikMax (edge case)
            : `${nik.length}/${nikMax} digit — lanjutkan mengetik`
          : `${nik.length}/${nikMax} digit — minimal ${nikMin} digit`}
      </div>

      {/* ── Tombol Cari Manual ────────────────────────────────── */}
      {/* Hanya muncul untuk quiz dengan NIK variabel (nikMin < nikMax) */}
      {/* dan saat NIK sudah >= nikMin tapi belum nikMax */}
      {showManualSearch && (
        <button
          onClick={handleManualSearch}
          style={{
            marginTop: 14,
            width: '100%',
            padding: '11px 0',
            borderRadius: 12,
            border: `1.5px solid ${tone.border}`,
            background: tone.icon,
            color: 'white',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <circle cx="11" cy="11" r="8" />
            <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
          </svg>
          Cari NIK
        </button>
      )}

      {/* ── Error Message ────────────────────────────────────── */}
      {error && !searching && !popupVisible && (
        <div style={{
          marginTop: 16,
          padding: '12px 16px',
          background: '#FEF2F2',
          border: '1px solid #FECACA',
          borderRadius: 12,
          color: '#B91C1C',
          fontSize: 13
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* ── Popup Verifikasi NIK (menggantikan spinner & skeleton lama) ── */}
      {popupVisible && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15,45,42,0.45)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
          }}
        >
          <div
            style={{
              background: 'white',
              borderRadius: 22,
              padding: '32px 28px',
              maxWidth: 300,
              width: '90%',
              textAlign: 'center',
              boxShadow: '0 24px 60px -12px rgba(15,45,42,0.35)',
            }}
          >
            <div style={{ width: 140, height: 140, margin: '0 auto' }}>
              <DotLottieReact
                dotLottieRefCallback={handleDotLottieRef}
                src={idVerifiedAnimation}
                autoplay
                loop
                style={{ width: '100%', height: '100%' }}
              />
            </div>
            <p style={{ margin: '4px 0 4px', fontWeight: 700, fontSize: 15, color: '#0d2220' }}>
              Memverifikasi NIK...
            </p>
            <p style={{ margin: 0, fontSize: 12.5, color: '#7a9997' }}>
              Mohon tunggu sebentar
            </p>
          </div>
        </div>
      )}
    </div>
  )
}