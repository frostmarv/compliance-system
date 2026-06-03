// pages/public/view/TrainingViewPage.tsx
import { useState, useEffect, useCallback } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

const PAGE_SIZE = 20

const FACTORY_MAP: Record<number, { name: string; short: string; color: string; bg: string }> = {
  1: { name: 'Zinus Global Indonesia',            short: 'ZGI', color: '#329F96', bg: '#e6f7f6' },
  2: { name: 'Zinus Global Indonesia – Karawang', short: 'ZGK', color: '#0ea5e9', bg: '#e0f2fe' },
  3: { name: 'Zinus Dream Indonesia',             short: 'ZDI', color: '#8b5cf6', bg: '#f3f0ff' },
}

const TRAINING_META: Record<string, { label: string; color: string }> = {
  '5s':     { label: 'Training 5S',  color: '#329F96' },
  'limbah': { label: 'Limbah B3',    color: '#0ea5e9' },
}

interface StatusRow {
  nik: string
  nama: string
  department: string | null
  sudah_ujian: boolean
}

// ── Icons ─────────────────────────────────────────────────────────────────────
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
const IconChevLeft = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
)
const IconChevRight = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
)
const IconChevDown = ({ open }: { open: boolean }) => (
  <svg
    width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
    style={{ transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
)
const IconFolder = ({ color }: { color: string }) => (
  <svg width="18" height="18" fill="none" stroke={color} strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
  </svg>
)
const IconTraining = () => (
  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
    <rect x="9" y="3" width="6" height="4" rx="1" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6M9 16h4" />
  </svg>
)
const IconCheck = () => (
  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
)
const IconClock = () => (
  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
  </svg>
)
const IconUsers = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
  </svg>
)

// ── Department Folder ─────────────────────────────────────────────────────────
function DepartmentFolder({
  dept, rows, color, defaultOpen
}: {
  dept: string
  rows: StatusRow[]
  color: string
  defaultOpen: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  const done    = rows.filter(r => r.sudah_ujian).length
  const pending = rows.length - done
  const pct     = rows.length > 0 ? Math.round((done / rows.length) * 100) : 0

  return (
    <div style={{
      background: 'white', borderRadius: 16, overflow: 'hidden',
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      border: '1px solid #f1f5f9',
      animation: 'fadeUp 0.3s ease both',
    }}>
      {/* Folder Header */}
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 12,
          padding: '14px 18px', background: 'none', border: 'none',
          cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
          transition: 'background 0.15s',
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = '#f8fdfc'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
      >
        {/* Folder icon */}
        <div style={{
          width: 36, height: 36, borderRadius: 10, flexShrink: 0,
          background: color + '15',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <IconFolder color={color} />
        </div>

        {/* Dept name */}
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: '#1a2e2d' }}>{dept}</p>
          <p style={{ margin: 0, fontSize: 11, color: '#94a3b8', marginTop: 1 }}>
            {rows.length} karyawan
          </p>
        </div>

        {/* Progress bar */}
        <div style={{ width: 100, flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 10, color: '#94a3b8' }}>Selesai</span>
            <span style={{ fontSize: 10, fontWeight: 700, color }}>
              {pct}%
            </span>
          </div>
          <div style={{ height: 5, borderRadius: 50, background: '#f1f5f9' }}>
            <div style={{
              height: '100%', borderRadius: 50,
              background: pct === 100 ? '#10b981' : color,
              width: `${pct}%`, transition: 'width 0.6s ease',
            }} />
          </div>
        </div>

        {/* Badges */}
        <div style={{ display: 'flex', gap: 6, flexShrink: 0, margin: '0 8px' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '3px 8px', borderRadius: 50,
            background: '#d1fae5', color: '#059669',
            fontSize: 11, fontWeight: 700,
          }}>
            <IconCheck /> {done}
          </span>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '3px 8px', borderRadius: 50,
            background: '#fef3c7', color: '#d97706',
            fontSize: 11, fontWeight: 700,
          }}>
            <IconClock /> {pending}
          </span>
        </div>

        <IconChevDown open={open} />
      </button>

      {/* Folder Content */}
      {open && (
        <div style={{ borderTop: '1px solid #f8fdfc' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#fafcfc' }}>
                {['#', 'NIK', 'Nama', 'Status'].map((h, i) => (
                  <th key={h} style={{
                    padding: '9px 16px',
                    textAlign: i >= 3 ? 'center' : i === 0 ? 'center' : 'left',
                    fontSize: 10, fontWeight: 700, color: '#b0bec5',
                    textTransform: 'uppercase', letterSpacing: 0.6,
                    borderBottom: '1px solid #f1f5f9',
                    width: i === 0 ? 40 : i === 3 ? 120 : 'auto',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row.nik}
                  style={{
                    borderBottom: i < rows.length - 1 ? '1px solid #f8fdfc' : 'none',
                    transition: 'background 0.12s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fdfc')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '')}
                >
                  <td style={{ padding: '10px 16px', textAlign: 'center' }}>
                    <span style={{ fontSize: 11, color: '#d1d5db', fontWeight: 600 }}>{i + 1}</span>
                  </td>
                  <td style={{ padding: '10px 16px' }}>
                    <code style={{
                      fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: 500,
                      background: '#f1f5f9', color: '#64748b',
                      padding: '2px 7px', borderRadius: 5,
                    }}>{row.nik}</code>
                  </td>
                  <td style={{ padding: '10px 16px', fontWeight: 600, color: '#1a2e2d' }}>{row.nama}</td>
                  <td style={{ padding: '10px 16px', textAlign: 'center' }}>
                    {row.sudah_ujian ? (
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 5,
                        padding: '4px 10px', borderRadius: 50,
                        background: '#d1fae5', color: '#059669',
                        fontSize: 12, fontWeight: 700,
                      }}>
                        <IconCheck /> Sudah
                      </span>
                    ) : (
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 5,
                        padding: '4px 10px', borderRadius: 50,
                        background: '#fef3c7', color: '#d97706',
                        fontSize: 12, fontWeight: 700,
                      }}>
                        <IconClock /> Belum
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function TrainingViewPage() {
  const { trainingCode = '' } = useParams<{ trainingCode: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const factoryId = Number(searchParams.get('factory') ?? 1)

  const fac  = FACTORY_MAP[factoryId]
  const meta = TRAINING_META[trainingCode.toLowerCase()] ?? { label: trainingCode.toUpperCase(), color: '#329F96' }

  const [allRows, setAllRows]     = useState<StatusRow[]>([])
  const [total, setTotal]         = useState(0)
  const [page, setPage]           = useState(1)
  const [search, setSearch]       = useState('')
  const [filter, setFilter]       = useState<'all' | 'done' | 'pending'>('all')
  const [loading, setLoading]     = useState(true)
  const [openAll, setOpenAll]     = useState(true)

  // Fetch ALL rows for current page (we group by dept client-side per page)
  const fetchData = useCallback(async (pg: number, q: string, fil: string) => {
    setLoading(true)
    const from = (pg - 1) * PAGE_SIZE
    const to   = from + PAGE_SIZE - 1

    let query = supabase
      .from('v_status_quiz_pegawai')
      .select('nik, nama, department, sudah_ujian', { count: 'exact' })
      .eq('factory', factoryId)
      .eq('training_code', trainingCode.toUpperCase())
      .order('department', { ascending: true })
      .order('nama', { ascending: true })
      .range(from, to)

    if (q.trim()) {
      query = query.or(`nama.ilike.%${q.trim()}%,nik.ilike.%${q.trim()}%,department.ilike.%${q.trim()}%`)
    }
    if (fil === 'done')    query = query.eq('sudah_ujian', true)
    if (fil === 'pending') query = query.eq('sudah_ujian', false)

    const { data, count } = await query
    setAllRows(data ?? [])
    setTotal(count ?? 0)
    setLoading(false)
  }, [factoryId, trainingCode])

  useEffect(() => { fetchData(page, search, filter) }, [page, search, filter, fetchData])

  const handleSearch = (q: string) => { setSearch(q); setPage(1) }
  const handleFilter = (f: typeof filter) => { setFilter(f); setPage(1) }

  // Group by department
  const grouped = allRows.reduce<Record<string, StatusRow[]>>((acc, row) => {
    const dept = row.department ?? 'Tidak Terdaftar'
    if (!acc[dept]) acc[dept] = []
    acc[dept].push(row)
    return acc
  }, {})
  const deptKeys = Object.keys(grouped).sort()

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const donePct    = total > 0
    ? Math.round((allRows.filter(r => r.sudah_ujian).length / allRows.length) * 100)
    : 0

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
        @keyframes fadeUp  { from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none} }
        @keyframes shimmer { 0%{background-position:-400px 0}100%{background-position:400px 0} }
        .tvp-root { min-height:100vh; font-family:'Sora',sans-serif; background:#f0f4f8; }
        .skel { background:linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%); background-size:800px 100%; animation:shimmer 1.4s infinite; border-radius:6px; }
        .pgbtn:hover:not(:disabled) { background:#f1f5f9 !important; }
        input:focus { outline:none; border-color:${meta.color} !important; box-shadow:0 0 0 3px ${meta.color}22; }
      `}</style>

      <div className="tvp-root">

        {/* ── Sticky top bar ──────────────────────────────────── */}
        <div style={{
          background: 'white', borderBottom: '1px solid #f1f5f9',
          padding: '0 40px', position: 'sticky', top: 0, zIndex: 20,
          display: 'flex', alignItems: 'center', height: 60,
          boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
        }}>
          <button
            onClick={() => navigate('/view')}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, background: 'none',
              border: 'none', cursor: 'pointer', color: '#64748b',
              fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
              padding: '6px 12px', borderRadius: 8, transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
          >
            <IconBack /> Kembali
          </button>
          <div style={{ width: 1, height: 20, background: '#e2e8f0', margin: '0 16px' }} />
          <span style={{ fontSize: 13, color: '#94a3b8' }}>Status Ujian</span>
          <svg width="14" height="14" fill="none" stroke="#cbd5e1" strokeWidth="2" viewBox="0 0 24 24" style={{ margin: '0 6px' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <span style={{
            fontSize: 13, fontWeight: 700, padding: '3px 10px', borderRadius: 50,
            background: fac?.bg ?? '#f1f5f9', color: fac?.color ?? '#64748b',
          }}>{fac?.short ?? 'F' + factoryId}</span>
          <svg width="14" height="14" fill="none" stroke="#cbd5e1" strokeWidth="2" viewBox="0 0 24 24" style={{ margin: '0 6px' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <span style={{ fontSize: 13, fontWeight: 700, color: meta.color }}>{meta.label}</span>
        </div>

        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 40px' }}>

          {/* ── Page header ─────────────────────────────────────── */}
          <div style={{
            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
            marginBottom: 28, flexWrap: 'wrap', gap: 16,
            animation: 'fadeUp 0.4s ease both',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 50, height: 50, borderRadius: 14, flexShrink: 0,
                background: meta.color + '18', color: meta.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <IconTraining />
              </div>
              <div>
                <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0d1f1e', margin: 0 }}>{meta.label}</h1>
                <p style={{ fontSize: 13, color: '#7a9997', margin: '3px 0 0' }}>
                  {fac?.name ?? 'Factory ' + factoryId} · {fac?.short}
                </p>
              </div>
            </div>

            {/* Summary pills */}
            {!loading && total > 0 && (
              <div style={{ display: 'flex', gap: 10 }}>
                {[
                  { label: 'Total', val: total.toLocaleString('id-ID'), bg: 'white', col: '#0d2220', shadow: '0 1px 4px rgba(0,0,0,0.07)' },
                  { label: 'Dept', val: deptKeys.length, bg: fac?.bg ?? '#f1f5f9', col: fac?.color ?? '#64748b', shadow: 'none' },
                  { label: 'Selesai', val: `${donePct}%`, bg: meta.color, col: 'white', shadow: `0 4px 14px ${meta.color}40` },
                ].map((s) => (
                  <div key={s.label} style={{
                    padding: '10px 18px', borderRadius: 12, textAlign: 'center',
                    background: s.bg, boxShadow: s.shadow,
                  }}>
                    <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, margin: 0, color: s.col === 'white' ? 'rgba(255,255,255,0.7)' : '#94a3b8' }}>{s.label}</p>
                    <p style={{ fontSize: 20, fontWeight: 800, color: s.col, margin: 0 }}>{s.val}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Toolbar ─────────────────────────────────────────── */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16,
            flexWrap: 'wrap', animation: 'fadeUp 0.4s 0.07s ease both', animationFillMode: 'both',
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
            <div style={{ position: 'relative', flex: 1, maxWidth: 300 }}>
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
                  border: '1.5px solid #e2e8f0', borderRadius: 10, boxSizing: 'border-box',
                  fontSize: 13, fontFamily: 'inherit', color: '#1a2e2d',
                  background: 'white', transition: 'border-color 0.15s, box-shadow 0.15s',
                }}
              />
            </div>

            {/* Expand/Collapse all */}
            <button
              onClick={() => setOpenAll(v => !v)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 14px', borderRadius: 10, border: '1.5px solid #e2e8f0',
                background: 'white', color: '#64748b', fontFamily: 'inherit',
                fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'border-color 0.15s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = meta.color}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
            >
              <IconFolder color="#94a3b8" />
              {openAll ? 'Tutup Semua' : 'Buka Semua'}
            </button>

            <span style={{ fontSize: 12, color: '#94a3b8', marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5 }}>
              <IconUsers /> {total.toLocaleString('id-ID')} karyawan
            </span>
          </div>

          {/* ── Department Folders ───────────────────────────────── */}
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 10,
            animation: 'fadeUp 0.4s 0.12s ease both', animationFillMode: 'both',
          }}>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} style={{
                  background: 'white', borderRadius: 16, padding: '16px 18px',
                  display: 'flex', alignItems: 'center', gap: 12,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                }}>
                  <div className="skel" style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0 }} />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div className="skel" style={{ height: 13, width: `${120 + i * 30}px` }} />
                    <div className="skel" style={{ height: 10, width: 80 }} />
                  </div>
                  <div className="skel" style={{ width: 100, height: 8, borderRadius: 50 }} />
                </div>
              ))
            ) : deptKeys.length === 0 ? (
              <div style={{
                background: 'white', borderRadius: 20, padding: '56px 16px', textAlign: 'center',
                color: '#cbd5e1', boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              }}>
                <div style={{ color: '#e2e8f0', display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
                  <IconFolder color="#e2e8f0" />
                </div>
                <p style={{ margin: 0, fontWeight: 600, fontSize: 14 }}>
                  {search ? `Tidak ada hasil untuk "${search}"` : 'Belum ada data'}
                </p>
              </div>
            ) : (
              deptKeys.map((dept) => (
                <DepartmentFolder
                  key={dept}
                  dept={dept}
                  rows={grouped[dept]}
                  color={meta.color}
                  defaultOpen={openAll}
                />
              ))
            )}
          </div>

          {/* ── Pagination ───────────────────────────────────────── */}
          {!loading && total > PAGE_SIZE && (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginTop: 20, flexWrap: 'wrap', gap: 10,
              animation: 'fadeUp 0.4s 0.15s ease both', animationFillMode: 'both',
            }}>
              <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>
                Halaman <strong style={{ color: '#475569' }}>{page}</strong> dari{' '}
                <strong style={{ color: '#475569' }}>{totalPages}</strong> ·{' '}
                Total <strong style={{ color: '#475569' }}>{total.toLocaleString('id-ID')}</strong> karyawan
              </p>
              <div style={{ display: 'flex', gap: 4 }}>
                <button
                  className="pgbtn"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  style={{
                    width: 34, height: 34, borderRadius: 9, border: 'none',
                    background: page === 1 ? '#f8fafc' : 'white',
                    color: page === 1 ? '#cbd5e1' : '#475569',
                    boxShadow: page === 1 ? 'none' : '0 1px 4px rgba(0,0,0,0.08)',
                    cursor: page === 1 ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'background 0.15s',
                  }}
                ><IconChevLeft /></button>

                {getPages().map((p, i) =>
                  p === '...' ? (
                    <span key={`e${i}`} style={{ color: '#cbd5e1', fontSize: 13, lineHeight: '34px', padding: '0 4px' }}>…</span>
                  ) : (
                    <button
                      key={p}
                      className="pgbtn"
                      onClick={() => setPage(p as number)}
                      style={{
                        minWidth: 34, height: 34, padding: '0 6px', borderRadius: 9, border: 'none',
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
                    width: 34, height: 34, borderRadius: 9, border: 'none',
                    background: page === totalPages ? '#f8fafc' : 'white',
                    color: page === totalPages ? '#cbd5e1' : '#475569',
                    boxShadow: page === totalPages ? 'none' : '0 1px 4px rgba(0,0,0,0.08)',
                    cursor: page === totalPages ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'background 0.15s',
                  }}
                ><IconChevRight /></button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}