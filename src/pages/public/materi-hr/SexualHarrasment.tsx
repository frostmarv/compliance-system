/**
 * pages/public/materi-hr/SexualHarassment.tsx
 *
 * PPTX Viewer — Sexual Harassment Training
 * - Employee prop (NIK-based login, no Supabase Auth)
 * - Signed URL dari private bucket hr-training-materi/training-sexual-harassment/
 * - Watermark canvas: NIK + Nama + Dept + Factory + Timestamp, centered tile
 * - Anti-screenshot: blur on alt-tab, block klik kanan & keyboard shortcuts
 * - Top bar: logo Zinus + Hyundai (sama seperti Materi5R)
 */

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import logoZinus   from '@/assets/zinus-tulisan-putih-contour.webp'
import logoHyundai from '@/assets/hyundai-ori-hitam.png'

// ─── TYPES ────────────────────────────────────────────────────────────────────

export interface Employee {
  nik:        string
  nama:       string
  department: string
  factory:    number | string
}

interface SexualHarassmentProps {
  employee:     Employee
  totalSlides?: number
  onSelesai?:   () => void
}

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const DEFAULT_TOTAL_SLIDES = 30
const BUCKET_NAME          = 'hr-training-materi'
const SLIDE_FOLDER         = 'training-sexual-harassment'
const SIGNED_URL_EXPIRES   = 120

// ─── FACTORY LABEL ───────────────────────────────────────────────────────────

function getFactoryLabel(factory: number | string): string {
  const val = Number(factory)
  if (val === 3) return 'Zinus Dream Indonesia'
  return 'Zinus Global Indonesia' // 1 atau 2
}

// ─── WATERMARK CANVAS ─────────────────────────────────────────────────────────
// Canvas 600×400 — cukup besar sehingga saat di-tile, teks muncul di TENGAH
// area slide, bukan hanya di sudut kiri atas.

function buildWatermarkDataUri(
  nik:       string,
  nama:      string,
  dept:      string,
  factory:   string,
  timestamp: string,
): string {
  // Tile 280x200 → desktop ~3 tile horizontal, mobile ~1-2 tile
  const W = 280, H = 200
  const canvas = document.createElement('canvas')
  canvas.width  = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!

  ctx.clearRect(0, 0, W, H)
  ctx.save()
  ctx.translate(W / 2, H / 2)
  ctx.rotate(-Math.PI / 6) // -30°

  ctx.shadowColor  = 'rgba(255,255,255,0.5)'
  ctx.shadowBlur   = 1.5
  ctx.textAlign    = 'center'
  ctx.textBaseline = 'middle'

  const lines = [
    `NIK: ${nik}`,
    nama.toUpperCase(),
    dept.toUpperCase(),
    factory.toUpperCase(),
    timestamp,
    '— CONFIDENTIAL —',
  ]
  const lineH  = 17
  const totalH = lines.length * lineH
  const startY = -totalH / 2 + lineH / 2

  lines.forEach((line, i) => {
    if (line.includes('CONFIDENTIAL')) {
      ctx.font      = 'bold 8px "Plus Jakarta Sans", Arial, sans-serif'
      ctx.fillStyle = 'rgba(180, 0, 0, 0.28)'
    } else {
      ctx.font      = 'bold 10px "Plus Jakarta Sans", Arial, sans-serif'
      ctx.fillStyle = 'rgba(0, 0, 0, 0.22)'
    }
    ctx.fillText(line, 0, startY + i * lineH)
  })

  ctx.restore()
  return canvas.toDataURL('image/png')
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export default function SexualHarassment({
  employee,
  totalSlides = DEFAULT_TOTAL_SLIDES,
  onSelesai,
}: SexualHarassmentProps) {

  const [slide,        setSlide]        = useState(0)
  const [slideUrl,     setSlideUrl]     = useState<string | null>(null)
  const [slideLoading, setSlideLoading] = useState(true)
  const [slideError,   setSlideError]   = useState(false)
  const [visited,      setVisited]      = useState<Set<number>>(new Set([0]))
  const [isBlurred,    setIsBlurred]    = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const urlCache     = useRef<Map<number, { url: string; expires: number }>>(new Map())
  const blurTimer    = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ─── Watermark — sekali build dari prop ───────────────────────────────────
  const watermarkUri = useMemo(() => {
    const ts = new Date().toLocaleDateString('id-ID', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
    const factoryLabel = getFactoryLabel(employee.factory)
    return buildWatermarkDataUri(
      employee.nik, employee.nama, employee.department, factoryLabel, ts
    )
  }, [employee.nik, employee.nama, employee.department, employee.factory])

  // ─── Signed URL ───────────────────────────────────────────────────────────
  const getSlideUrl = useCallback(async (index: number): Promise<string | null> => {
    const now    = Date.now()
    const cached = urlCache.current.get(index)
    if (cached && cached.expires > now + 10_000) return cached.url

    try {
      const padded   = String(index + 1).padStart(2, '0')
      const filePath = `${SLIDE_FOLDER}/slide${padded}.png`

      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .createSignedUrl(filePath, SIGNED_URL_EXPIRES)

      if (error || !data?.signedUrl) throw new Error(error?.message ?? 'No URL')

      urlCache.current.set(index, {
        url:     data.signedUrl,
        expires: now + SIGNED_URL_EXPIRES * 1000,
      })
      return data.signedUrl

    } catch (err) {
      console.error('getSlideUrl error:', err)
      return null
    }
  }, [])

  // ─── Load slide ───────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false
    setSlideLoading(true)
    setSlideError(false)
    setSlideUrl(null)
    setVisited(prev => new Set([...prev, slide]))

    getSlideUrl(slide).then(url => {
      if (cancelled) return
      if (url) setSlideUrl(url)
      else     setSlideError(true)
      setSlideLoading(false)
    })

    if (slide < totalSlides - 1) getSlideUrl(slide + 1).catch(() => {})
    return () => { cancelled = true }
  }, [slide, getSlideUrl, totalSlides])

  // ─── Anti-screenshot ──────────────────────────────────────────────────────
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const blockCtx  = (e: MouseEvent)    => e.preventDefault()
    const blockKeys = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey
      if (
        e.key === 'PrintScreen' ||
        (ctrl && ['s','p','c','u','a'].includes(e.key.toLowerCase()))
      ) { e.preventDefault(); e.stopPropagation() }
    }
    const onVisibility = () => {
      if (!document.hidden) return
      setIsBlurred(true)
      if (blurTimer.current) clearTimeout(blurTimer.current)
      blurTimer.current = setTimeout(() => setIsBlurred(false), 3000)
    }

    el.addEventListener('contextmenu', blockCtx)
    document.addEventListener('keydown', blockKeys, true)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      el.removeEventListener('contextmenu', blockCtx)
      document.removeEventListener('keydown', blockKeys, true)
      document.removeEventListener('visibilitychange', onVisibility)
      if (blurTimer.current) clearTimeout(blurTimer.current)
    }
  }, [])

  // ─── Retry ────────────────────────────────────────────────────────────────
  const handleRetry = useCallback(() => {
    urlCache.current.delete(slide)
    setSlideError(false)
    setSlideLoading(true)
    getSlideUrl(slide).then(url => {
      if (url) setSlideUrl(url)
      else     setSlideError(true)
      setSlideLoading(false)
    })
  }, [slide, getSlideUrl])

  const progress  = Math.round((visited.size / totalSlides) * 100)
  const canFinish = visited.size >= totalSlides
  const goNext    = () => setSlide(s => Math.min(s + 1, totalSlides - 1))
  const goPrev    = () => setSlide(s => Math.max(s - 1, 0))

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        .sh-root * { font-family: 'Plus Jakarta Sans', sans-serif; box-sizing: border-box; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
        @keyframes sh-spin { to { transform: rotate(360deg); } }
        .sh-spin { animation: sh-spin 1s linear infinite; }
        @keyframes sh-pulse { 0%,100%{opacity:1} 50%{opacity:.75} }
      `}</style>

      <div
        className="sh-root flex flex-col"
        style={{
          minHeight: '100dvh',
          background: '#F0FAF9',
          userSelect: 'none',
          WebkitUserSelect: 'none',
        } as React.CSSProperties}
      >

        {/* ── TOP BAR — logo Zinus + Hyundai + progress ─────────────────── */}
        <div
          className="sticky top-0 z-50 flex items-center justify-between gap-2 bg-white px-3"
          style={{ height: 56, borderBottom: '1px solid #D4EDE9' }}
        >
          {/* Logos — sama persis dengan Materi5R */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <img
              src={logoZinus}
              alt="Zinus"
              style={{ height: 28, width: 'auto', objectFit: 'contain', maxWidth: 80 }}
              loading="eager"
            />
            <div style={{ width: 1, height: 20, background: '#D4EDE9', flexShrink: 0 }} />
            <img
              src={logoHyundai}
              alt="Hyundai"
              style={{ height: 28, width: 'auto', objectFit: 'contain', maxWidth: 80 }}
              loading="eager"
            />
          </div>

          {/* Progress */}
          <div style={{ flex: 1, minWidth: 0, maxWidth: 130 }}>
            <div style={{ height: 4, borderRadius: 99, background: '#D4EDE9', overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 99, background: '#329F96',
                width: `${progress}%`, transition: 'width 0.3s ease',
              }} />
            </div>
            <p style={{
              fontSize: 10, fontWeight: 600, color: '#329F96',
              textAlign: 'right', marginTop: 2, whiteSpace: 'nowrap',
            }}>
              Slide {slide + 1} / {totalSlides}
            </p>
          </div>
        </div>

        {/* ── SLIDE AREA ────────────────────────────────────────────────── */}
        <div
          ref={containerRef}
          className="flex-1 relative flex items-center justify-center overflow-hidden"
          style={{ height: 'calc(100dvh - 56px - 68px)', background: '#1A1A1A' }}
        >
          {/* Loading */}
          {slideLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="sh-spin w-8 h-8 rounded-full border-2"
                style={{ borderColor: '#329F96', borderTopColor: 'transparent' }} />
            </div>
          )}

          {/* Error */}
          {slideError && !slideLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 gap-3">
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>Gagal memuat slide</p>
              <button onClick={handleRetry}
                style={{ background: '#329F96', color: 'white', fontSize: 12,
                  fontWeight: 600, padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer' }}>
                Coba lagi
              </button>
            </div>
          )}

          {/* Slide image */}
          {slideUrl && (
            <img
              key={slideUrl}
              src={slideUrl}
              alt={`Slide ${slide + 1}`}
              draggable={false}
              onLoad={() => setSlideLoading(false)}
              style={{
                maxWidth: '100%', maxHeight: '100%',
                objectFit: 'contain', display: 'block',
                pointerEvents: 'none',
                filter: isBlurred ? 'blur(24px) brightness(0.4)' : 'none',
                transition: 'filter 0.15s ease',
              }}
            />
          )}

          {/* ── WATERMARK — centered tile, 1 watermark per 600×400 tile ── */}
          <div
            style={{
              position: 'absolute', inset: 0,
              pointerEvents: 'none', zIndex: 20,
              backgroundImage: `url(${watermarkUri})`,
              backgroundRepeat: 'repeat',
              backgroundSize: '280px 200px',
              // geser 50% supaya teks muncul di tengah area, bukan di sudut
              backgroundPosition: 'center center',
              mixBlendMode: 'multiply',
              animation: isBlurred ? 'sh-pulse 1.2s ease infinite' : 'none',
            }}
          />

          {/* Blur notice */}
          {isBlurred && (
            <div style={{
              position: 'absolute', inset: 0, zIndex: 30,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{
                background: 'rgba(13,61,58,0.92)', borderRadius: 16,
                padding: '16px 24px', maxWidth: 260, textAlign: 'center',
              }}>
                <p style={{ color: 'white', fontWeight: 600, fontSize: 14, marginBottom: 4 }}>
                  Konten disembunyikan
                </p>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>
                  Konten muncul kembali saat layar aktif
                </p>
              </div>
            </div>
          )}

          {/* Drag blocker */}
          <div
            style={{ position: 'absolute', inset: 0, zIndex: 25, background: 'transparent' }}
            onDragStart={e => e.preventDefault()}
          />
        </div>

        {/* ── BOTTOM NAV ────────────────────────────────────────────────── */}
        <div
          className="sticky bottom-0 z-50 flex items-center justify-between gap-2 bg-white px-4 no-scrollbar"
          style={{
            height: 68, borderTop: '1px solid #D4EDE9',
            paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          }}
        >
          {/* PREV */}
          <button onClick={goPrev} disabled={slide === 0} aria-label="Slide sebelumnya"
            style={{
              flexShrink: 0, width: 44, height: 44, borderRadius: '50%', border: 'none',
              cursor: slide === 0 ? 'not-allowed' : 'pointer',
              background: slide === 0 ? '#C8E6E4' : '#329F96',
              boxShadow: slide === 0 ? 'none' : '0 2px 8px rgba(50,159,150,0.35)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.15s',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="11,4 6,9 11,14" />
            </svg>
          </button>

          {/* Dots */}
          <div className="no-scrollbar flex-1 flex items-center justify-center gap-1.5 overflow-x-auto px-1">
            {Array.from({ length: totalSlides }).map((_, i) => (
              <button key={i} onClick={() => setSlide(i)} aria-label={`Slide ${i + 1}`}
                style={{
                  flexShrink: 0,
                  width: slide === i ? 20 : 8, height: 8,
                  borderRadius: 99, border: 'none', cursor: 'pointer', padding: 0,
                  background: slide === i ? '#329F96' : visited.has(i) ? '#9CCEC9' : '#C8E6E4',
                  transition: 'all 0.2s ease',
                }}
              />
            ))}
          </div>

          {/* NEXT or FINISH */}
          {slide < totalSlides - 1 ? (
            <button onClick={goNext} aria-label="Slide berikutnya"
              style={{
                flexShrink: 0, width: 44, height: 44, borderRadius: '50%', border: 'none',
                cursor: 'pointer', background: '#329F96',
                boxShadow: '0 2px 8px rgba(50,159,150,0.35)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.15s',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="7,4 12,9 7,14" />
              </svg>
            </button>
          ) : (
            <button
              onClick={canFinish ? onSelesai : undefined}
              disabled={!canFinish}
              style={{
                flexShrink: 0, height: 44, borderRadius: 22, border: 'none',
                paddingInline: 16,
                cursor: canFinish ? 'pointer' : 'not-allowed',
                background: canFinish ? '#329F96' : '#C8E6E4',
                color: 'white', fontSize: 12, fontWeight: 700,
                boxShadow: canFinish ? '0 2px 8px rgba(50,159,150,0.35)' : 'none',
                transition: 'all 0.2s', whiteSpace: 'nowrap',
              }}
            >
              {canFinish ? 'Selesai →' : `${progress}%`}
            </button>
          )}
        </div>

      </div>
    </>
  )
}