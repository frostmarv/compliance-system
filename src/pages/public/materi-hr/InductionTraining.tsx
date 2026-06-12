/**
 * pages/public/materi-hr/InductionTraining.tsx
 *
 * PPTX Viewer with:
 * - Supabase signed URL (private bucket, expires per slide)
 * - Dynamic watermark (NIK + Nama + Departemen + timestamp)
 * - Anti-screenshot layer (blur on visibility change, disable right-click, etc.)
 * - Slide rendered as <img> — PPTX never touches the client
 *
 * SETUP:
 * 1. Supabase private bucket "hr-training-materi"
 * 2. Slides disimpan di folder: hr-training-materi/training-induction/
 * 3. Edge Function "get-slide" returns signed URL per slide
 * 4. User object must have: nik, full_name, department
 *
 * See bottom of this file for complete setup guide.
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

// ─── TYPES ────────────────────────────────────────────────────────────────────

interface UserProfile {
  nik: string
  full_name: string
  department: string
}

interface InductionTrainingProps {
  /** Jumlah total slide dalam PPTX. Update sesuai file aktual. */
  totalSlides?: number
  onSelesai?: () => void
}

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const DEFAULT_TOTAL_SLIDES = 20
const BUCKET_NAME = 'hr-training-materi'
const SLIDE_FOLDER = 'training-induction'
const SIGNED_URL_EXPIRES = 120 // seconds — cukup untuk render 1 slide

// ─── WATERMARK CANVAS GENERATOR ──────────────────────────────────────────────
// Render watermark sebagai CSS background-image (data URI) agar tidak bisa
// diseleksi / di-inspect-element dengan mudah.

function buildWatermarkDataUri(
  nik: string,
  name: string,
  dept: string,
  timestamp: string,
): string {
  const canvas = document.createElement('canvas')
  canvas.width = 420
  canvas.height = 280
  const ctx = canvas.getContext('2d')!

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.save()
  ctx.translate(canvas.width / 2, canvas.height / 2)
  ctx.rotate(-Math.PI / 6) // -30°

  ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif'
  ctx.fillStyle = 'rgba(0, 0, 0, 0.11)'
  ctx.textAlign = 'center'

  const lines = [
    `NIK: ${nik}`,
    name.toUpperCase(),
    dept.toUpperCase(),
    timestamp,
    '— CONFIDENTIAL —',
  ]
  const lineH = 22
  const startY = -(lines.length / 2) * lineH + lineH / 2

  lines.forEach((line, i) => {
    ctx.fillText(line, 0, startY + i * lineH)
  })
  ctx.restore()

  return canvas.toDataURL('image/png')
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export default function InductionTraining({
  totalSlides = DEFAULT_TOTAL_SLIDES,
  onSelesai,
}: InductionTrainingProps) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [slide, setSlide] = useState(0)
  const [slideUrl, setSlideUrl] = useState<string | null>(null)
  const [slideLoading, setSlideLoading] = useState(true)
  const [slideError, setSlideError] = useState(false)
  const [visited, setVisited] = useState<Set<number>>(new Set([0]))
  const [isBlurred, setIsBlurred] = useState(false)
  const [watermarkUri, setWatermarkUri] = useState<string>('')

  const containerRef = useRef<HTMLDivElement>(null)
  const urlCache = useRef<Map<number, { url: string; expires: number }>>(new Map())
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ─── Load user profile ──────────────────────────────────────────────────────
  useEffect(() => {
    const loadUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) { setLoading(false); return }

      const { data: profile } = await supabase
        .from('employees')           // ganti sesuai table kamu
        .select('nik, full_name, department')
        .eq('user_id', authUser.id)
        .single()

      if (profile) {
        setUser(profile)
        const ts = new Date().toLocaleDateString('id-ID', {
          day: '2-digit', month: 'short', year: 'numeric',
          hour: '2-digit', minute: '2-digit',
        })
        setWatermarkUri(
          buildWatermarkDataUri(profile.nik, profile.full_name, profile.department, ts)
        )
      }
      setLoading(false)
    }
    loadUser()
  }, [])

  // ─── Get signed URL for a slide ─────────────────────────────────────────────
  // Langsung generate signed URL dari Supabase Storage.
  // File path: hr-training-materi/training-induction/slide-000.png
  // File PPTX TIDAK pernah dikirim ke browser.
  const getSlideUrl = useCallback(async (index: number): Promise<string | null> => {
    const now = Date.now()
    const cached = urlCache.current.get(index)
    if (cached && cached.expires > now + 10_000) return cached.url

    try {
      const paddedIndex = String(index).padStart(3, '0')
      const filePath = `${SLIDE_FOLDER}/slide-${paddedIndex}.png`

      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .createSignedUrl(filePath, SIGNED_URL_EXPIRES)

      if (error || !data?.signedUrl) throw new Error(error?.message ?? 'No URL')

      urlCache.current.set(index, {
        url: data.signedUrl,
        expires: now + SIGNED_URL_EXPIRES * 1000,
      })
      return data.signedUrl

    } catch (err) {
      console.error('getSlideUrl error:', err)
      return null
    }
  }, [])

  // ─── Load slide on index change ──────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false
    setSlideLoading(true)
    setSlideError(false)
    setSlideUrl(null)
    setVisited(prev => new Set([...prev, slide]))

    getSlideUrl(slide).then(url => {
      if (cancelled) return
      if (url) setSlideUrl(url)
      else setSlideError(true)
      setSlideLoading(false)
    })

    // Prefetch next slide quietly
    if (slide < totalSlides - 1) {
      getSlideUrl(slide + 1).catch(() => {})
    }

    return () => { cancelled = true }
  }, [slide, getSlideUrl, totalSlides])

  // ─── Anti-screenshot: disable context menu, keyboard shortcuts ───────────────
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const blockCtx = (e: MouseEvent) => e.preventDefault()

    const blockKeys = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      const ctrl = e.ctrlKey || e.metaKey
      if (
        e.key === 'PrintScreen' ||
        (ctrl && ['s', 'p', 'c', 'u', 'a'].includes(key))
      ) {
        e.preventDefault()
        e.stopPropagation()
      }
    }

    const onVisibility = () => {
      if (document.hidden) {
        setIsBlurred(true)
        if (blurTimer.current) clearTimeout(blurTimer.current)
        blurTimer.current = setTimeout(() => setIsBlurred(false), 3000)
      }
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

  const progress = Math.round((visited.size / totalSlides) * 100)
  const canFinish = visited.size >= totalSlides

  const goNext = () => setSlide(s => Math.min(s + 1, totalSlides - 1))
  const goPrev = () => setSlide(s => Math.max(s - 1, 0))

  // ─── Loading state ────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F0FAF9' }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#329F96', borderTopColor: 'transparent' }} />
          <p className="font-jakarta text-sm" style={{ color: '#5A8A86' }}>Memuat profil...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#F0FAF9' }}>
        <div className="text-center">
          <p className="font-jakarta text-sm font-semibold mb-1" style={{ color: '#0D3D3A' }}>Sesi tidak ditemukan</p>
          <p className="font-jakarta text-xs" style={{ color: '#5A8A86' }}>Silakan login ulang untuk mengakses materi ini.</p>
        </div>
      </div>
    )
  }

  // ─── MAIN RENDER ──────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; box-sizing: border-box; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
        @keyframes pulse-blur {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.85; }
        }
        .blurred-overlay {
          animation: pulse-blur 1.2s ease infinite;
        }
      `}</style>

      <div
        className="flex flex-col"
        style={{ minHeight: '100dvh', background: '#F0FAF9', userSelect: 'none', WebkitUserSelect: 'none' } as React.CSSProperties}
      >

        {/* ── TOP BAR ─────────────────────────────────────────────────────── */}
        <div
          className="sticky top-0 z-50 flex items-center justify-between gap-3 bg-white px-4"
          style={{ height: 56, borderBottom: '1px solid #D4EDE9' }}
        >
          {/* User badge */}
          <div className="flex items-center gap-2 min-w-0">
            <div
              className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ background: '#329F96' }}
            >
              {user.full_name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold truncate leading-tight" style={{ color: '#0D3D3A' }}>
                {user.full_name}
              </p>
              <p className="text-[10px] truncate leading-tight" style={{ color: '#5A8A86' }}>
                {user.nik} · {user.department}
              </p>
            </div>
          </div>

          {/* Progress */}
          <div style={{ minWidth: 100, maxWidth: 130 }}>
            <div style={{ height: 4, borderRadius: 99, background: '#D4EDE9', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%', borderRadius: 99,
                  background: '#329F96',
                  width: `${progress}%`,
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
            <p className="text-[10px] font-semibold text-right mt-0.5" style={{ color: '#329F96' }}>
              Slide {slide + 1} / {totalSlides}
            </p>
          </div>
        </div>

        {/* ── SLIDE AREA ──────────────────────────────────────────────────── */}
        <div
          ref={containerRef}
          className="flex-1 relative flex items-center justify-center overflow-hidden"
          style={{
            height: 'calc(100dvh - 56px - 68px)',
            background: '#1A1A1A',
          }}
        >
          {/* Slide image */}
          {slideLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div
                className="spin w-8 h-8 rounded-full border-2"
                style={{ borderColor: '#329F96', borderTopColor: 'transparent' }}
              />
            </div>
          )}

          {slideError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 gap-2">
              <p className="text-white/60 text-sm">Gagal memuat slide</p>
              <button
                onClick={() => { setSlideError(false); setSlide(s => s) }}
                className="text-xs px-4 py-2 rounded-lg"
                style={{ background: '#329F96', color: 'white' }}
              >
                Coba lagi
              </button>
            </div>
          )}

          {slideUrl && (
            <img
              key={slideUrl}
              src={slideUrl}
              alt={`Slide ${slide + 1}`}
              draggable={false}
              onLoad={() => setSlideLoading(false)}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                display: 'block',
                pointerEvents: 'none',
                // blur triggered by visibility change (alt-tab / screen capture)
                filter: isBlurred ? 'blur(24px) brightness(0.4)' : 'none',
                transition: 'filter 0.15s ease',
              }}
            />
          )}

          {/* ── WATERMARK OVERLAY ────────────────────────────────────────── */}
          {/* Tile the canvas-generated watermark across the slide */}
          {watermarkUri && (
            <div
              className={isBlurred ? 'blurred-overlay' : ''}
              style={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                zIndex: 20,
                backgroundImage: `url(${watermarkUri})`,
                backgroundRepeat: 'repeat',
                backgroundSize: '420px 280px',
                mixBlendMode: 'multiply',
              }}
            />
          )}

          {/* ── BLUR NOTICE (when screen hidden) ────────────────────────── */}
          {isBlurred && (
            <div
              style={{
                position: 'absolute', inset: 0, zIndex: 30,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <div
                className="text-center px-6 py-4 rounded-2xl"
                style={{ background: 'rgba(13,61,58,0.9)', maxWidth: 260 }}
              >
                <p className="text-white font-semibold text-sm mb-1">Konten disembunyikan</p>
                <p className="text-white/60 text-xs">Konten muncul kembali saat layar aktif</p>
              </div>
            </div>
          )}

          {/* ── TRANSPARENT DRAG BLOCKER ─────────────────────────────────── */}
          <div
            style={{
              position: 'absolute', inset: 0, zIndex: 25,
              background: 'transparent',
            }}
            onDragStart={e => e.preventDefault()}
          />
        </div>

        {/* ── BOTTOM NAV ──────────────────────────────────────────────────── */}
        <div
          className="sticky bottom-0 z-50 flex items-center justify-between gap-2 bg-white px-4"
          style={{
            height: 68,
            borderTop: '1px solid #D4EDE9',
            paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          }}
        >
          {/* PREV */}
          <button
            onClick={goPrev}
            disabled={slide === 0}
            aria-label="Slide sebelumnya"
            style={{
              flexShrink: 0, width: 44, height: 44,
              borderRadius: '50%', border: 'none', cursor: slide === 0 ? 'not-allowed' : 'pointer',
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

          {/* Dots — scrollable */}
          <div
            className="no-scrollbar flex-1 flex items-center justify-center gap-1.5 overflow-x-auto px-1"
            style={{ maxWidth: 'calc(100% - 120px)' }}
          >
            {Array.from({ length: totalSlides }).map((_, i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                aria-label={`Slide ${i + 1}`}
                style={{
                  flexShrink: 0,
                  width: slide === i ? 20 : 8,
                  height: 8,
                  borderRadius: 99,
                  border: 'none',
                  cursor: 'pointer',
                  background: slide === i ? '#329F96' : visited.has(i) ? '#9CCEC9' : '#C8E6E4',
                  transition: 'all 0.2s ease',
                  padding: 0,
                }}
              />
            ))}
          </div>

          {/* NEXT or FINISH */}
          {slide < totalSlides - 1 ? (
            <button
              onClick={goNext}
              aria-label="Slide berikutnya"
              style={{
                flexShrink: 0, width: 44, height: 44,
                borderRadius: '50%', border: 'none', cursor: 'pointer',
                background: '#329F96',
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
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
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


// ═══════════════════════════════════════════════════════════════════════════════
// PANDUAN SETUP SUPABASE — baca ini sebelum deploy
// ═══════════════════════════════════════════════════════════════════════════════
//
// ── LANGKAH 1: Buat Private Storage Bucket ────────────────────────────────────
//
//   Di Supabase Dashboard → Storage → New Bucket
//     Name    : hr-training-materi
//     Public  : OFF (private)
//
//   Policy — hanya authenticated user bisa READ:
//   (jalankan di SQL Editor)
//
//   CREATE POLICY "authenticated_read" ON storage.objects
//     FOR SELECT
//     TO authenticated
//     USING (bucket_id = 'hr-training-materi');
//
//
// ── LANGKAH 2: Struktur folder di bucket ──────────────────────────────────────
//
//   hr-training-materi/
//   └── training-induction/
//       ├── slide-000.png
//       ├── slide-001.png
//       ├── slide-002.png
//       └── ... dst
//
//   REKOMENDASI: Pre-convert PPTX → PNG di lokal, lalu upload ke folder ini.
//
//
// ── LANGKAH 3: Convert PPTX → PNG ─────────────────────────────────────────────
//
//   LibreOffice (gratis):
//     libreoffice --headless --convert-to png --outdir ./slides induction.pptx
//     # Hasil: slide-0.png, slide-1.png, dst
//
//   Rename supaya zero-padded (slide-000.png, slide-001.png, ...):
//     Python:
//       import os, glob
//       files = sorted(glob.glob("slides/*.png"))
//       for i, f in enumerate(files):
//           os.rename(f, f"slides/slide-{str(i).zfill(3)}.png")
//
//   Lalu upload semua ke:
//     hr-training-materi/training-induction/
//
//
// ── LANGKAH 4: Hubungkan ke React ─────────────────────────────────────────────
//
//   .env:
//     VITE_SUPABASE_URL=https://xxx.supabase.co
//     VITE_SUPABASE_ANON_KEY=eyJ...
//
//   lib/supabase.ts:
//     import { createClient } from '@supabase/supabase-js'
//     export const supabase = createClient(
//       import.meta.env.VITE_SUPABASE_URL,
//       import.meta.env.VITE_SUPABASE_ANON_KEY,
//     )
//
//   Panggil komponen:
//     <InductionTraining
//       totalSlides={20}
//       onSelesai={() => navigate('/post-test')}
//     />
//
// ═══════════════════════════════════════════════════════════════════════════════