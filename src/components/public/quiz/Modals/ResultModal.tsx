import type { Employee, ScoreResult } from '../types'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import trophyAnimation from '@/assets/animations/Trophy.lottie'

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

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
)

const FactoryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 20h20"/><path d="M4 20V8l4-3 4 3v12"/><path d="M12 20V5l4-3 4 3v15"/>
    <path d="M8 12h.01"/><path d="M8 16h.01"/><path d="M12 9h.01"/><path d="M12 13h.01"/><path d="M12 17h.01"/><path d="M16 9h.01"/><path d="M16 13h.01"/><path d="M16 17h.01"/>
  </svg>
)

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
)

// ── Palette ──
const PALETTE = {
  primary: '#0F766E',      // teal-700
  primaryLight: '#14B8A6', // teal-500
  primarySoft: '#CCFBF1',  // teal-100
  ink: '#0F2D2A',
  muted: '#6B8B87',
  border: '#DCEDEA',
  surface: '#F5FBFA',
}

// ── Score Card (reusable untuk pre & post) ──
function ScoreCard({
  label,
  result,
  variant,
}: {
  label: string
  result: ScoreResult
  variant: 'pre' | 'post'
}) {
  const incorrect = result.total - result.correct
  const isPost = variant === 'post'

  return (
    <div style={{
      flex: 1,
      background: isPost
        ? `linear-gradient(160deg, ${PALETTE.primary} 0%, ${PALETTE.primaryLight} 100%)`
        : '#FFFFFF',
      border: isPost ? 'none' : `1px solid ${PALETTE.border}`,
      borderRadius: 16,
      padding: '18px 14px',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: isPost
        ? '0 8px 20px -6px rgba(15,118,110,0.45)'
        : '0 1px 3px rgba(15,45,42,0.04)',
    }}>
      {/* Label */}
      <div style={{
        fontSize: 10, fontWeight: 700, letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: isPost ? 'rgba(255,255,255,0.85)' : PALETTE.muted,
        marginBottom: 10,
      }}>
        {label}
      </div>

      {/* Score */}
      <div style={{
        fontSize: 40, fontWeight: 800, lineHeight: 1,
        color: isPost ? '#FFFFFF' : PALETTE.ink, marginBottom: 4,
        fontVariantNumeric: 'tabular-nums',
      }}>
        {result.score.toFixed(0)}
      </div>
      <div style={{
        fontSize: 11,
        color: isPost ? 'rgba(255,255,255,0.75)' : PALETTE.muted,
        marginBottom: 14,
      }}>
        poin
      </div>

      {/* Benar / Salah */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
        <div style={{
          flex: 1,
          background: isPost ? 'rgba(255,255,255,0.16)' : '#ECFDF5',
          border: isPost ? '1px solid rgba(255,255,255,0.25)' : '1px solid #A7F3D0',
          borderRadius: 10, padding: '8px 4px',
        }}>
          <div style={{
            fontSize: 19, fontWeight: 700, lineHeight: 1,
            color: isPost ? '#FFFFFF' : '#059669',
          }}>
            {result.correct}
          </div>
          <div style={{
            fontSize: 10, marginTop: 3,
            color: isPost ? 'rgba(255,255,255,0.8)' : '#34D399',
          }}>
            Benar
          </div>
        </div>
        <div style={{
          flex: 1,
          background: isPost ? 'rgba(255,255,255,0.16)' : '#FEF2F2',
          border: isPost ? '1px solid rgba(255,255,255,0.25)' : '1px solid #FECACA',
          borderRadius: 10, padding: '8px 4px',
        }}>
          <div style={{
            fontSize: 19, fontWeight: 700, lineHeight: 1,
            color: isPost ? '#FFFFFF' : '#DC2626',
          }}>
            {incorrect}
          </div>
          <div style={{
            fontSize: 10, marginTop: 3,
            color: isPost ? 'rgba(255,255,255,0.8)' : '#F87171',
          }}>
            Salah
          </div>
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
    <div
      className="modal-backdrop"
      onClick={onClose}
      style={{ background: 'rgba(15,45,42,0.55)', backdropFilter: 'blur(3px)' }}
    >
      <div
        className="modal-card"
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: 460,
          borderRadius: 22,
          overflow: 'hidden',
          padding: 0,
          border: 'none',
          boxShadow: '0 24px 60px -12px rgba(15,45,42,0.35)',
        }}
      >

        {/* ── Header ── */}
        <div style={{
          background: `linear-gradient(155deg, ${PALETTE.primary} 0%, #115E59 55%, #0B4844 100%)`,
          padding: '30px 24px 26px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Decorative glow */}
          <div style={{
            position: 'absolute', top: -60, right: -40, width: 160, height: 160,
            borderRadius: '50%', background: 'rgba(255,255,255,0.08)',
          }} />
          <div style={{
            position: 'absolute', bottom: -50, left: -30, width: 120, height: 120,
            borderRadius: '50%', background: 'rgba(255,255,255,0.06)',
          }} />

          <div style={{
            width: 84, height: 84,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 6px', position: 'relative',
          }}>
            <DotLottieReact
              src={trophyAnimation}
              autoplay
              loop
              style={{ width: '100%', height: '100%' }}
            />
          </div>
          <div style={{
            fontSize: 19, fontWeight: 800, color: '#FFFFFF',
            marginBottom: 4, position: 'relative',
          }}>
            Training Selesai!
          </div>
          <div style={{
            fontSize: 12.5, color: 'rgba(255,255,255,0.75)', position: 'relative',
          }}>
            Pre-test & Post-test telah disimpan
          </div>
        </div>

        <div style={{ padding: '22px 22px 8px', background: PALETTE.surface }}>

          {/* ── Score Comparison ── */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
            {preResult && (
              <ScoreCard label="Pre-Test" result={preResult} variant="pre" />
            )}
            <ScoreCard label="Post-Test" result={result} variant="post" />
          </div>

          {/* ── Delta / Peningkatan ── */}
          {delta !== null && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '11px 16px',
              borderRadius: 12,
              marginBottom: 16,
              background: delta >= 0 ? PALETTE.primarySoft : '#FEE2E2',
              border: `1px solid ${delta >= 0 ? '#99E6DC' : '#FECACA'}`,
              fontSize: 13,
              fontWeight: 600,
              color: delta >= 0 ? PALETTE.primary : '#B91C1C',
            }}>
              <span style={{ fontSize: 17 }}>{delta >= 0 ? '↑' : '↓'}</span>
              <span>
                {delta >= 0
                  ? `Peningkatan ${delta.toFixed(0)} poin dari pre-test`
                  : `Penurunan ${Math.abs(delta).toFixed(0)} poin dari pre-test`}
              </span>
            </div>
          )}

          {/* ── Info Karyawan ── */}
          <div style={{
            display: 'flex',
            background: '#FFFFFF',
            border: `1px solid ${PALETTE.border}`,
            borderRadius: 14,
            overflow: 'hidden',
            marginBottom: 20,
          }}>
            {[
              { icon: <UserIcon />,    label: 'Peserta', value: employee?.nama ?? '-' },
              { icon: <FactoryIcon />, label: 'Pabrik',  value: getFactoryName(employee?.factory ?? null) },
              { icon: <ClockIcon />,   label: 'Waktu',   value: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) },
            ].map(({ icon, label, value }, idx) => (
              <div
                key={label}
                style={{
                  flex: 1,
                  padding: '14px 8px',
                  textAlign: 'center',
                  borderLeft: idx > 0 ? `1px solid ${PALETTE.border}` : 'none',
                }}
              >
                <div style={{
                  width: 30, height: 30, borderRadius: 9,
                  background: PALETTE.primarySoft, color: PALETTE.primary,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 8px',
                }}>
                  {icon}
                </div>
                <div style={{ fontSize: 10, color: PALETTE.muted, marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                  {label}
                </div>
                <div style={{
                  fontSize: 12, fontWeight: 700, color: PALETTE.ink,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Actions: hanya Tutup ── */}
        <div style={{ padding: '0 22px 22px' }}>
          <button
            onClick={onClose}
            style={{
              width: '100%',
              padding: '13px 0',
              borderRadius: 13,
              border: 'none',
              background: `linear-gradient(135deg, ${PALETTE.primary}, #115E59)`,
              color: '#FFFFFF',
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 6px 16px -4px rgba(15,118,110,0.5)',
              transition: 'transform 0.12s ease, box-shadow 0.12s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  )
}