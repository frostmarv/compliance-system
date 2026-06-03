// pages/public/view/TrainingViewPage.tsx
// Generic page — dipakai untuk semua training (5S, LIMBAH, dll)
// Route: /view/:trainingCode?factory=1
import { useState, useEffect, useCallback } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

const PAGE_SIZE = 20

const FACTORY_MAP: Record<number, { name: string; short: string; color: string; bg: string }> = {
  1: { name: 'Zinus Global Indonesia',            short: 'ZGI', color: '#329F96', bg: '#e6f7f6' },
  2: { name: 'Zinus Global Indonesia – Karawang', short: 'ZGK', color: '#0ea5e9', bg: '#e0f2fe' },
  3: { name: 'Zinus Dream Indonesia',             short: 'ZDI', color: '#8b5cf6', bg: '#f3f0ff' },
}

const TRAINING_META: Record<string, { label: string; icon: string; color: string }> = {
  '5s':     { label: 'Training 5S',    icon: '🏭', color: '#329F96' },
  'limbah': { label: 'Limbah B3',      icon: '♻️', color: '#0ea5e9' },
}

interface StatusRow {
  nik: string
  nama: string
  department: string | null
  sudah_ujian: boolean
  nilai_terakhir: number | null
}

// ── Score badge ───────────────────────────────────────────────────────────────
function ScoreBadge({ nilai }: { nilai: number | null }) {
  if (nilai === null) return <span style={{ color: '#cbd5e1', fontSize: 13 }}>—</span>
  const color = nilai >= 80 ? '#10b981' : nilai >= 60 ? '#f59e0b' : '#ef4444'
  const bg    = nilai >= 80 ? '#d1fae5' : nilai >= 60 ? '#fef3c7' : '#fee2e2'
  return (
    <span style={{
      display: 'inline-block', padding: '3px 10px', borderRadius: 50,
      background: bg, color, fontWeight: 700, fontSize: 13,
      fontFamily: "'DM Mono', monospace",
    }}>{nilai}</span>
  )
}

// ── Chevron icons ─────────────────────────────────────────────────────────────
const IconLeft = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
)
const IconRight = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
)
const IconBack = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M5 12l7-7M5 12l7 7" />
  </svg>
)
const IconSearch = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
  </svg>
)

// ── Main ──────────────────────────────────────────────────────────────────────
export default function TrainingViewPage() {
  const { trainingCode = '' } = useParams<{ trainingCode: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const factoryId = Number(searchParams.get('factory') ?? 1)

  const fac  = FACTORY_MAP[factoryId]
  const meta = TRAINING_META[trainingCode.toLowerCase()] ?? { label: trainingCode.toUpperCase(), icon: '📋', color: '#329F96' }

  const [rows, setRows]         = useState<StatusRow[]>([])
  const [total, setTotal]       = useState(0)
  const [page, setPage]         = useState(1)
  const [search, setSearch]     = useState('')
  const [filter, setFilter]     = useState<'all' | 'done' | 'pending'>('all')
  const [loading, setLoading]   = useState(true)
  const [trainingId, setTrainingId] = useState<string | null>(null)

  // Resolve training_type_id from code
  useEffect(() => {
    supabase
      .from('training_types')
      .select('id')
      .ilike('code', trainingCode)
      .single()
      .then(({ data }) => setTrainingId(data?.id ?? null))
  }, [trainingCode])

  const fetchData = useCallback(async (pg: number, q: string, fil: string) => {
    if (!trainingId) return
    setLoading(true)

    const from = (pg - 1) * PAGE_SIZE
    const to   = from + PAGE_SIZE - 1

    // Build query using the view
    let query = supabase
      .from('v_status_quiz_pegawai')
      .select('nik, nama, department, sudah_ujian, nilai_terakhir', { count: 'exact' })
      .eq('factory', factoryId)
      .eq('training_code', trainingCode.toUpperCase())
      .order('nama')
      .range(from, to)

    if (q.trim()) {
      query = query.or(`nama.ilike.%${q.trim()}%,nik.ilike.%${q.trim()}%,department.ilike.%${q.trim()}%`)
    }
    if (fil === 'done')    query = query.eq('sudah_ujian', true)
    if (fil === 'pending') query = query.eq('sudah_ujian', false)

    const { data, count } = await query
    setRows(data ?? [])
    setTotal(count ?? 0)
    setLoading(false)
  }, [trainingId, factoryId, trainingCode])

  useEffect(() => { fetchData(page, search, filter) }, [trainingId, page, search, filter, fetchData])

  const handleSearch = (q: string) => { setSearch(q); setPage(1) }
  const handleFilter = (f: typeof filter) => { setFilter(f); setPage(1) }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const donePct = total > 0 ? Math.round((rows.filter(r => r.sudah_ujian).length / rows.length) * 100) : 0

  // Page numbers with ellipsis
  const getPages = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const pages: (number | '...')[] = [1]
    if (page > 3) pages.push('...')
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i)
    if (page < totalPages - 2) pages.push('...')
    pages.push(totalPages)
    return pages
  }

  const filterTabs: { key: typeof filter; label: string }[] = [
    { key: 'all',     label: 'Semua' },
    { key: 'done',    label: 'Sudah Ujian' },
    { key: 'pending', label: 'Belum Ujian' },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        @keyframes fadeUp   { from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none} }
        @keyframes shimmer  { 0%{background-position:-400px 0}100%{background-position:400px 0} }
        .tvp-root { min-height:100vh; font-family:'Sora',sans-serif; background:#f0f4f8; }
        .skel { background:linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%); background-size:800px 100%; animation:shimmer 1.4s infinite; border-radius:6px; }
        .row-hover:hover { background:#f8fdfc !important; }
        .pgbtn:hover:not(:disabled) { background:#f1f5f9 !important; }
        input:focus { outline:none; border-color:${meta.color} !important; box-shadow:0 0 0 3px ${meta.color}22; }
      `}</style>

      <div className="tvp-root">

        {/* ── Top bar ─────────────────────────────────────────── */}
        <div style={{
          background: 'white', borderBottom: '1px solid #f1f5f9',
          padding: '0 40px', position: 'sticky', top: 0, zIndex: 20,
          display: 'flex', alignItems: 'center', height: 60,
          boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
        }}>
          <button
            onClick={() => navigate('/view')}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#64748b', fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
              padding: '6px 12px', borderRadius: 8, transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
          >
            <IconBack /> Kembali
          </button>

          <div style={{ width: 1, height: 20, background: '#e2e8f0', margin: '0 16px' }} />

          {/* Breadcrumb */}
          <span style={{ fontSize: 13, color: '#94a3b8' }}>Status Ujian</span>
          <svg width="14" height="14" fill="none" stroke="#cbd5e1" strokeWidth="2" viewBox="0 0 24 24" style={{ margin: '0 6px' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <span style={{
            fontSize: 13, fontWeight: 700,
            padding: '3px 10px', borderRadius: 50,
            background: fac?.bg ?? '#f1f5f9',
            color: fac?.color ?? '#64748b',
          }}>{fac?.short ?? 'F'+factoryId}</span>
          <svg width="14" height="14" fill="none" stroke="#cbd5e1" strokeWidth="2" viewBox="0 0 24 24" style={{ margin: '0 6px' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <span style={{ fontSize: 13, fontWeight: 700, color: meta.color }}>{meta.label}</span>
        </div>

        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 40px' }}>

          {/* ── Page Header ─────────────────────────────────────── */}
          <div style={{ marginBottom: 28, animation: 'fadeUp 0.4s ease both' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
              <div style={{
                width: 52, height: 52, borderRadius: 14, flexShrink: 0,
                background: meta.color + '18', fontSize: 26,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {meta.icon}
              </div>
              <div>
                <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0d1f1e', margin: 0 }}>
                  {meta.label}
                </h1>
                <p style={{ fontSize: 13, color: '#7a9997', margin: '3px 0 0' }}>
                  {fac?.name ?? 'Factory ' + factoryId} · {fac?.short}
                </p>
              </div>

              {/* Summary pill */}
              {!loading && total > 0 && (
                <div style={{
                  marginLeft: 'auto', display: 'flex', gap: 12, alignItems: 'center',
                  animation: 'fadeUp 0.4s 0.1s ease both', animationFillMode: 'both',
                }}>
                  <div style={{
                    padding: '10px 18px', borderRadius: 12,
                    background: 'white', boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
                    textAlign: 'center',
                  }}>
                    <p style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, margin: 0 }}>Total</p>
                    <p style={{ fontSize: 22, fontWeight: 800, color: '#0d2220', margin: 0 }}>{total.toLocaleString('id-ID')}</p>
                  </div>
                  <div style={{
                    padding: '10px 18px', borderRadius: 12,
                    background: meta.color, boxShadow: `0 4px 14px ${meta.color}40`,
                    textAlign: 'center',
                  }}>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, margin: 0 }}>Selesai</p>
                    <p style={{ fontSize: 22, fontWeight: 800, color: 'white', margin: 0 }}>{donePct}%</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Toolbar ─────────────────────────────────────────── */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            marginBottom: 16, flexWrap: 'wrap',
            animation: 'fadeUp 0.4s 0.08s ease both', animationFillMode: 'both',
          }}>
            {/* Filter tabs */}
            <div style={{ display: 'flex', gap: 4, background: '#f1f5f9', borderRadius: 10, padding: 3 }}>
              {filterTabs.map((t) => (
                <button key={t.key} onClick={() => handleFilter(t.key)} style={{
                  padding: '7px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
                  fontFamily: 'inherit', fontSize: 12, fontWeight: 600, transition: 'all 0.15s',
                  background: filter === t.key ? meta.color : 'transparent',
                  color: filter === t.key ? 'white' : '#64748b',
                  boxShadow: filter === t.key ? `0 2px 8px ${meta.color}40` : 'none',
                }}>{t.label}</button>
              ))}
            </div>

            {/* Search */}
            <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
              <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                <IconSearch />
              </span>
              <input
                type="text"
                placeholder="Cari NIK, nama, departemen…"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                style={{
                  width: '100%', paddingLeft: 34, paddingRight: 14, paddingTop: 9, paddingBottom: 9,
                  border: '1.5px solid #e2e8f0', borderRadius: 10,
                  fontSize: 13, fontFamily: 'inherit', color: '#1a2e2d',
                  background: 'white', boxSizing: 'border-box',
                  transition: 'border-color 0.15s, box-shadow 0.15s',
                }}
              />
            </div>

            <span style={{ fontSize: 12, color: '#94a3b8', marginLeft: 'auto' }}>
              {total.toLocaleString('id-ID')} karyawan
            </span>
          </div>

          {/* ── Table ───────────────────────────────────────────── */}
          <div style={{
            background: 'white', borderRadius: 20, overflow: 'hidden',
            boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
            animation: 'fadeUp 0.4s 0.12s ease both', animationFillMode: 'both',
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#f8fdfc' }}>
                  {['#', 'NIK', 'Nama', 'Departemen', 'Status', 'Nilai'].map((h, i) => (
                    <th key={h} style={{
                      padding: '11px 16px',
                      textAlign: i >= 4 ? 'center' : i === 0 ? 'center' : 'left',
                      fontSize: 11, fontWeight: 700, color: '#94a3b8',
                      textTransform: 'uppercase', letterSpacing: 0.6,
                      borderBottom: '1px solid #f1f5f9',
                      width: i === 0 ? 48 : i === 4 ? 120 : i === 5 ? 80 : 'auto',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: PAGE_SIZE }).map((_, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f8fdfc' }}>
                      {[32, 90, 180, 140, 100, 60].map((w, j) => (
                        <td key={j} style={{ padding: '14px 16px', textAlign: j === 0 || j >= 4 ? 'center' : 'left' }}>
                          <div className="skel" style={{ height: 12, width: w, display: 'inline-block' }} />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '56px 16px', color: '#cbd5e1' }}>
                      <div style={{ fontSize: 40, marginBottom: 10 }}>📋</div>
                      <p style={{ margin: 0, fontWeight: 600 }}>
                        {search ? `Tidak ada hasil untuk "${search}"` : 'Belum ada data'}
                      </p>
                    </td>
                  </tr>
                ) : (
                  rows.map((row, i) => {
                    const rowNum = (page - 1) * PAGE_SIZE + i + 1
                    return (
                      <tr key={row.nik} className="row-hover" style={{
                        borderBottom: '1px solid #f8fdfc', transition: 'background 0.12s',
                        animation: `fadeUp 0.25s ${i * 18}ms ease both`, animationFillMode: 'both',
                      }}>
                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                          <span style={{ fontSize: 11, color: '#d1d5db', fontWeight: 600 }}>{rowNum}</span>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <code style={{
                            fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: 500,
                            background: '#f1f5f9', color: '#475569',
                            padding: '3px 8px', borderRadius: 6,
                          }}>{row.nik}</code>
                        </td>
                        <td style={{ padding: '12px 16px', fontWeight: 600, color: '#1a2e2d' }}>{row.nama}</td>
                        <td style={{ padding: '12px 16px', color: '#64748b' }}>
                          {row.department ?? <span style={{ color: '#cbd5e1' }}>—</span>}
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                          {row.sudah_ujian ? (
                            <span style={{
                              display: 'inline-flex', alignItems: 'center', gap: 5,
                              padding: '4px 10px', borderRadius: 50,
                              background: '#d1fae5', color: '#059669',
                              fontSize: 12, fontWeight: 700,
                            }}>
                              <span style={{ fontSize: 10 }}>✓</span> Sudah
                            </span>
                          ) : (
                            <span style={{
                              display: 'inline-flex', alignItems: 'center', gap: 5,
                              padding: '4px 10px', borderRadius: 50,
                              background: '#fef3c7', color: '#d97706',
                              fontSize: 12, fontWeight: 700,
                            }}>
                              <span style={{ fontSize: 10 }}>○</span> Belum
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                          <ScoreBadge nilai={row.nilai_terakhir} />
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>

            {/* ── Pagination ─────────────────────────────────── */}
            {!loading && total > 0 && (
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 20px', borderTop: '1px solid #f1f5f9', flexWrap: 'wrap', gap: 10,
              }}>
                <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>
                  Halaman <strong style={{ color: '#475569' }}>{page}</strong> dari{' '}
                  <strong style={{ color: '#475569' }}>{totalPages}</strong>
                </p>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button
                    className="pgbtn"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    style={{
                      width: 32, height: 32, borderRadius: 8, border: 'none',
                      background: page === 1 ? '#f8fafc' : 'white',
                      color: page === 1 ? '#cbd5e1' : '#475569',
                      boxShadow: page === 1 ? 'none' : '0 1px 4px rgba(0,0,0,0.08)',
                      cursor: page === 1 ? 'not-allowed' : 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'background 0.15s',
                    }}
                  ><IconLeft /></button>

                  {getPages().map((p, i) =>
                    p === '...' ? (
                      <span key={`e${i}`} style={{ color: '#cbd5e1', fontSize: 13, lineHeight: '32px', padding: '0 4px' }}>…</span>
                    ) : (
                      <button
                        key={p}
                        className="pgbtn"
                        onClick={() => setPage(p as number)}
                        style={{
                          minWidth: 32, height: 32, padding: '0 4px', borderRadius: 8, border: 'none',
                          background: page === p ? meta.color : 'white',
                          color: page === p ? 'white' : '#475569',
                          fontFamily: 'inherit', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                          boxShadow: page === p ? `0 4px 12px ${meta.color}40` : '0 1px 4px rgba(0,0,0,0.08)',
                          transition: 'all 0.15s',
                        }}
                      >{p}</button>
                    )
                  )}

                  <button
                    className="pgbtn"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    style={{
                      width: 32, height: 32, borderRadius: 8, border: 'none',
                      background: page === totalPages ? '#f8fafc' : 'white',
                      color: page === totalPages ? '#cbd5e1' : '#475569',
                      boxShadow: page === totalPages ? 'none' : '0 1px 4px rgba(0,0,0,0.08)',
                      cursor: page === totalPages ? 'not-allowed' : 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'background 0.15s',
                    }}
                  ><IconRight /></button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}