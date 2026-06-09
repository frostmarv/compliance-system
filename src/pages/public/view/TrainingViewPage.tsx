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
  '5s':         { label: 'Training 5S',         color: '#329F96' },
  'limbah':     { label: 'Limbah B3',            color: '#0ea5e9' },
  'ctpat':      { label: 'C-TPAT',              color: '#329F96' },
  'conduct':    { label: 'Code of Conduct',      color: '#8b5cf6' },
  'profile':    { label: 'Company Profile',      color: '#f59e0b' },
  'lingkungan': { label: 'Kesadaran Lingkungan', color: '#10b981' },
}

// One raw row per test_type entry
interface RawRow {
  nik: string
  nama: string
  department: string | null
  test_type: 'pre' | 'post' | null
}

// Merged per-employee
interface EmployeeRow {
  nik: string
  nama: string
  department: string
  hasPre: boolean
  hasPost: boolean
}

// ── Icons ─────────────────────────────────────────────────────────────────────
const IconBack = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
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
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
)
const IconChevRight = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
)
const IconChevDown = ({ open }: { open: boolean }) => (
  <svg
    width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
    style={{ transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0)' }}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
)
const IconTraining = ({ color }: { color: string }) => (
  <svg width="22" height="22" fill="none" stroke={color} strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
    <rect x="9" y="3" width="6" height="4" rx="1" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6M9 16h4" />
  </svg>
)
const IconUsers = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
  </svg>
)
const IconCheck = () => (
  <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
)
const IconMinus = () => (
  <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
  </svg>
)
const IconProfile = ({ color }: { color: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="3.5" fill={color} fillOpacity="0.18" stroke={color} strokeWidth="1.6"/>
    <path d="M4.5 19.5C4.5 16.46 7.96 14 12 14C16.04 14 19.5 16.46 19.5 19.5" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
)

// ── Test type badge ───────────────────────────────────────────────────────────
const TestBadge = ({ type, done }: { type: 'pre' | 'post'; done: boolean }) => {
  const isGreen = done
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '3px 9px', borderRadius: 50, fontSize: 11, fontWeight: 700,
      background: isGreen ? (type === 'pre' ? '#dcfce7' : '#dbeafe') : '#f1f5f9',
      color: isGreen ? (type === 'pre' ? '#16a34a' : '#2563eb') : '#94a3b8',
      border: `1.5px solid ${isGreen ? (type === 'pre' ? '#bbf7d0' : '#bfdbfe') : '#e2e8f0'}`,
    }}>
      {done ? <IconCheck /> : <IconMinus />}
      {type === 'pre' ? 'Pre' : 'Post'}
    </span>
  )
}

// ── Department Accordion ──────────────────────────────────────────────────────
function DeptAccordion({
  dept, rows, color, defaultOpen,
}: {
  dept: string
  rows: EmployeeRow[]
  color: string
  defaultOpen: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)

  const bothDone    = rows.filter(r => r.hasPre && r.hasPost).length
  const preOnly     = rows.filter(r => r.hasPre && !r.hasPost).length
  const noneYet     = rows.filter(r => !r.hasPre && !r.hasPost).length
  const pct         = rows.length > 0 ? Math.round((bothDone / rows.length) * 100) : 0

  useEffect(() => { setOpen(defaultOpen) }, [defaultOpen])

  return (
    <div className="tvp-dept">
      {/* Header row */}
      <button
        className="tvp-dept-header"
        onClick={() => setOpen(v => !v)}
      >
        {/* Left: chevron + dept name */}
        <span className="tvp-dept-chev" style={{ color }}>
          <IconChevDown open={open} />
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <span className="tvp-dept-name">{dept}</span>
          <span className="tvp-dept-count">{rows.length} karyawan</span>
        </div>

        {/* Progress */}
        <div className="tvp-dept-progress">
          <div className="tvp-dept-progress-bar">
            <div style={{
              height: '100%', borderRadius: 50, transition: 'width 0.6s ease',
              background: pct === 100 ? '#10b981' : color,
              width: `${pct}%`,
            }} />
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, color, minWidth: 32, textAlign: 'right' }}>
            {pct}%
          </span>
        </div>

        {/* Mini badges */}
        <div className="tvp-dept-badges">
          <span className="tvp-stat-pill tvp-pill-green">{bothDone} selesai</span>
          {preOnly > 0 && <span className="tvp-stat-pill tvp-pill-blue">{preOnly} pre</span>}
          {noneYet > 0 && <span className="tvp-stat-pill tvp-pill-gray">{noneYet} belum</span>}
        </div>
      </button>

      {/* Employee list */}
      {open && (
        <div className="tvp-emp-list">
          {/* thead */}
          <div className="tvp-emp-thead">
            <span style={{ width: 28, textAlign: 'center' }}>#</span>
            <span style={{ width: 90 }}>NIK</span>
            <span style={{ flex: 1 }}>Nama</span>
            <span style={{ width: 60, textAlign: 'center' }}>Pre</span>
            <span style={{ width: 60, textAlign: 'center' }}>Post</span>
          </div>

          {rows.map((row, i) => (
            <div
              key={row.nik}
              className="tvp-emp-row"
              style={{ borderBottom: i < rows.length - 1 ? '1px solid #f8fdfc' : 'none' }}
            >
              <span style={{ width: 28, textAlign: 'center', fontSize: 11, color: '#d1d5db', fontWeight: 600 }}>
                {i + 1}
              </span>
              <span style={{ width: 90 }}>
                <code className="tvp-nik">{row.nik}</code>
              </span>
              <span style={{ flex: 1, fontWeight: 600, fontSize: 13, color: '#1a2e2d', display: 'flex', alignItems: 'center', gap: 7 }}>
                <IconProfile color={color} />
                {row.nama}
              </span>
              <span style={{ width: 60, textAlign: 'center' }}>
                <TestBadge type="pre" done={row.hasPre} />
              </span>
              <span style={{ width: 60, textAlign: 'center' }}>
                <TestBadge type="post" done={row.hasPost} />
              </span>
            </div>
          ))}
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

  const [allRows, setAllRows]   = useState<EmployeeRow[]>([])
  const [total, setTotal]       = useState(0)
  const [page, setPage]         = useState(1)
  const [search, setSearch]     = useState('')
  const [filter, setFilter]     = useState<'all' | 'done' | 'pre' | 'none'>('all')
  const [loading, setLoading]   = useState(true)
  const [openAll, setOpenAll]   = useState(true)

  const fetchData = useCallback(async (pg: number, q: string, fil: string) => {
    setLoading(true)
    const from = (pg - 1) * PAGE_SIZE
    const to   = from + PAGE_SIZE - 1

    // Fetch raw rows (each row = one test_type entry per employee)
    let query = supabase
      .from('v_status_quiz_pegawai')
      .select('nik, nama, department, test_type', { count: 'exact' })
      .eq('factory', factoryId)
      .eq('training_code', trainingCode.toUpperCase())
      .order('department', { ascending: true })
      .order('nama',       { ascending: true })
      .range(from, to)

    if (q.trim()) {
      query = query.or(`nama.ilike.%${q.trim()}%,nik.ilike.%${q.trim()}%,department.ilike.%${q.trim()}%`)
    }

    const { data, count } = await query
    const raw: RawRow[] = data ?? []

    // Merge rows by NIK
    const byNik: Record<string, EmployeeRow> = {}
    for (const r of raw) {
      if (!byNik[r.nik]) {
        byNik[r.nik] = {
          nik: r.nik,
          nama: r.nama,
          department: r.department ?? 'Tidak Terdaftar',
          hasPre: false,
          hasPost: false,
        }
      }
      if (r.test_type === 'pre')  byNik[r.nik].hasPre  = true
      if (r.test_type === 'post') byNik[r.nik].hasPost = true
    }

    let merged = Object.values(byNik)

    // Client-side filter after merge
    if (fil === 'done') merged = merged.filter(r => r.hasPre && r.hasPost)
    if (fil === 'pre')  merged = merged.filter(r => r.hasPre && !r.hasPost)
    if (fil === 'none') merged = merged.filter(r => !r.hasPre && !r.hasPost)

    setAllRows(merged)
    setTotal(count ?? 0)
    setLoading(false)
  }, [factoryId, trainingCode])

  useEffect(() => { fetchData(page, search, filter) }, [page, search, filter, fetchData])

  const handleSearch = (q: string) => { setSearch(q); setPage(1) }
  const handleFilter = (f: typeof filter) => { setFilter(f); setPage(1) }

  // Group by department
  const grouped = allRows.reduce<Record<string, EmployeeRow[]>>((acc, row) => {
    if (!acc[row.department]) acc[row.department] = []
    acc[row.department].push(row)
    return acc
  }, {})
  const deptKeys = Object.keys(grouped).sort()

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const bothDoneCount = allRows.filter(r => r.hasPre && r.hasPost).length
  const donePct = allRows.length > 0 ? Math.round((bothDoneCount / allRows.length) * 100) : 0

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
    { key: 'all',  label: 'Semua'       },
    { key: 'done', label: 'Pre & Post'  },
    { key: 'pre',  label: 'Pre Saja'    },
    { key: 'none', label: 'Belum Ujian' },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');

        @keyframes fadeUp  { from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none} }
        @keyframes shimmer { 0%{background-position:-400px 0}100%{background-position:400px 0} }

        .tvp-root {
          min-height: 100vh;
          font-family: 'Sora', sans-serif;
          background: #f0f4f8;
        }

        /* Skeleton */
        .skel {
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 800px 100%;
          animation: shimmer 1.4s infinite;
          border-radius: 6px;
        }

        /* Dept accordion */
        .tvp-dept {
          background: white;
          border-radius: 14px;
          overflow: hidden;
          border: 1px solid #f1f5f9;
          box-shadow: 0 1px 4px rgba(0,0,0,0.05);
          animation: fadeUp 0.3s ease both;
        }
        .tvp-dept-header {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 13px 16px;
          background: none;
          border: none;
          cursor: pointer;
          font-family: inherit;
          text-align: left;
          transition: background 0.12s;
        }
        .tvp-dept-header:hover { background: #f8fdfc; }
        .tvp-dept-chev { flex-shrink: 0; display: flex; align-items: center; }
        .tvp-dept-name {
          font-size: 13.5px;
          font-weight: 700;
          color: #1a2e2d;
          margin-right: 8px;
        }
        .tvp-dept-count {
          font-size: 11px;
          color: #94a3b8;
        }
        .tvp-dept-progress {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 110px;
          flex-shrink: 0;
        }
        .tvp-dept-progress-bar {
          flex: 1;
          height: 5px;
          border-radius: 50px;
          background: #f1f5f9;
          overflow: hidden;
        }
        .tvp-dept-badges {
          display: flex;
          gap: 5px;
          flex-shrink: 0;
        }
        .tvp-stat-pill {
          font-size: 11px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 50px;
        }
        .tvp-pill-green { background: #dcfce7; color: #16a34a; }
        .tvp-pill-blue  { background: #dbeafe; color: #2563eb; }
        .tvp-pill-gray  { background: #f1f5f9; color: #94a3b8; }

        /* Employee list */
        .tvp-emp-list {
          border-top: 1px solid #f1f5f9;
        }
        .tvp-emp-thead {
          display: flex;
          align-items: center;
          gap: 0;
          padding: 8px 16px;
          background: #fafcfc;
          border-bottom: 1px solid #f1f5f9;
          font-size: 10px;
          font-weight: 700;
          color: #b0bec5;
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }
        .tvp-emp-row {
          display: flex;
          align-items: center;
          gap: 0;
          padding: 10px 16px;
          transition: background 0.1s;
          font-size: 13px;
          color: #475569;
        }
        .tvp-emp-row:hover { background: #f8fdfc; }
        .tvp-nik {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          font-weight: 500;
          background: #f1f5f9;
          color: #64748b;
          padding: 2px 7px;
          border-radius: 5px;
        }

        /* Toolbar input */
        .tvp-search:focus {
          outline: none;
          border-color: ${meta.color} !important;
          box-shadow: 0 0 0 3px ${meta.color}22;
        }

        /* Pagination button */
        .pgbtn:hover:not(:disabled) { background: #f1f5f9 !important; }

        @media (max-width: 700px) {
          .tvp-dept-progress { display: none; }
          .tvp-dept-badges { display: none; }
          .tvp-topbar { padding: 0 16px !important; }
          .tvp-main   { padding: 20px 16px !important; }
        }
      `}</style>

      <div className="tvp-root">

        {/* ── Sticky top bar ──────────────────────────────────── */}
        <div
          className="tvp-topbar"
          style={{
            background: 'white', borderBottom: '1px solid #f1f5f9',
            padding: '0 40px', position: 'sticky', top: 0, zIndex: 20,
            display: 'flex', alignItems: 'center', height: 60,
            boxShadow: '0 2px 12px rgba(0,0,0,0.05)', gap: 0,
          }}
        >
          <button
            onClick={() => navigate('/view')}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#64748b', fontFamily: 'inherit',
              fontSize: 13, fontWeight: 600,
              padding: '6px 10px', borderRadius: 8, transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}
          >
            <IconBack /> Kembali
          </button>

          <div style={{ width: 1, height: 20, background: '#e2e8f0', margin: '0 14px' }} />

          <span style={{ fontSize: 12, color: '#94a3b8' }}>Status Ujian</span>

          <svg width="13" height="13" fill="none" stroke="#cbd5e1" strokeWidth="2" viewBox="0 0 24 24" style={{ margin: '0 5px' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>

          <span style={{
            fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 50,
            background: fac?.bg ?? '#f1f5f9', color: fac?.color ?? '#64748b',
          }}>
            {fac?.short ?? 'F' + factoryId}
          </span>

          <svg width="13" height="13" fill="none" stroke="#cbd5e1" strokeWidth="2" viewBox="0 0 24 24" style={{ margin: '0 5px' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>

          <span style={{ fontSize: 12, fontWeight: 700, color: meta.color }}>{meta.label}</span>
        </div>

        {/* ── Main content ─────────────────────────────────────── */}
        <div
          className="tvp-main"
          style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 40px' }}
        >

          {/* Page header */}
          <div style={{
            display: 'flex', alignItems: 'flex-start',
            justifyContent: 'space-between', marginBottom: 28,
            flexWrap: 'wrap', gap: 16,
            animation: 'fadeUp 0.4s ease both',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 50, height: 50, borderRadius: 14, flexShrink: 0,
                background: meta.color + '18',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <IconTraining color={meta.color} />
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
                  { label: 'Total',    val: allRows.length.toLocaleString('id-ID'), bg: 'white',          col: '#0d2220', shadow: '0 1px 4px rgba(0,0,0,0.07)' },
                  { label: 'Dept',     val: deptKeys.length,                        bg: fac?.bg ?? '#f1f5f9', col: fac?.color ?? '#64748b', shadow: 'none' },
                  { label: 'Pre & Post', val: `${donePct}%`,                        bg: meta.color,       col: 'white',   shadow: `0 4px 14px ${meta.color}40` },
                ].map(s => (
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

          {/* Toolbar */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            marginBottom: 14, flexWrap: 'wrap',
            animation: 'fadeUp 0.4s 0.07s ease both',
          }}>
            {/* Filter tabs */}
            <div style={{ display: 'flex', gap: 3, background: '#f1f5f9', borderRadius: 10, padding: 3 }}>
              {filterTabs.map(t => (
                <button
                  key={t.key}
                  onClick={() => handleFilter(t.key)}
                  style={{
                    padding: '7px 13px', borderRadius: 8, border: 'none', cursor: 'pointer',
                    fontFamily: 'inherit', fontSize: 12, fontWeight: 600, transition: 'all 0.15s',
                    background: filter === t.key ? meta.color : 'transparent',
                    color: filter === t.key ? 'white' : '#64748b',
                    boxShadow: filter === t.key ? `0 2px 8px ${meta.color}40` : 'none',
                  }}
                >{t.label}</button>
              ))}
            </div>

            {/* Search */}
            <div style={{ position: 'relative', flex: 1, maxWidth: 300 }}>
              <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                <IconSearch />
              </span>
              <input
                className="tvp-search"
                type="text"
                placeholder="Cari NIK, nama, departemen…"
                value={search}
                onChange={e => handleSearch(e.target.value)}
                style={{
                  width: '100%', paddingLeft: 34, paddingRight: 14,
                  paddingTop: 9, paddingBottom: 9,
                  border: '1.5px solid #e2e8f0', borderRadius: 10,
                  boxSizing: 'border-box', fontSize: 13, fontFamily: 'inherit',
                  color: '#1a2e2d', background: 'white',
                  transition: 'border-color 0.15s, box-shadow 0.15s',
                }}
              />
            </div>

            {/* Expand / collapse */}
            <button
              onClick={() => setOpenAll(v => !v)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 13px', borderRadius: 10,
                border: '1.5px solid #e2e8f0', background: 'white',
                color: '#64748b', fontFamily: 'inherit',
                fontSize: 12, fontWeight: 600, cursor: 'pointer',
                transition: 'border-color 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = meta.color}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#e2e8f0'}
            >
              <IconChevDown open={openAll} />
              {openAll ? 'Tutup Semua' : 'Buka Semua'}
            </button>

            <span style={{ fontSize: 12, color: '#94a3b8', marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5 }}>
              <IconUsers /> {allRows.length.toLocaleString('id-ID')} karyawan
            </span>
          </div>

          {/* Department accordions */}
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 8,
            animation: 'fadeUp 0.4s 0.12s ease both',
          }}>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} style={{
                  background: 'white', borderRadius: 14, padding: '14px 16px',
                  display: 'flex', alignItems: 'center', gap: 12,
                  border: '1px solid #f1f5f9',
                }}>
                  <div className="skel" style={{ width: 13, height: 13, borderRadius: 3, flexShrink: 0 }} />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div className="skel" style={{ height: 13, width: `${100 + i * 40}px` }} />
                    <div className="skel" style={{ height: 10, width: 70 }} />
                  </div>
                  <div className="skel" style={{ width: 110, height: 5, borderRadius: 50 }} />
                </div>
              ))
            ) : deptKeys.length === 0 ? (
              <div style={{
                background: 'white', borderRadius: 16, padding: '56px 16px',
                textAlign: 'center', border: '1px solid #f1f5f9',
              }}>
                <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: '#cbd5e1' }}>
                  {search ? `Tidak ada hasil untuk "${search}"` : 'Belum ada data'}
                </p>
              </div>
            ) : (
              deptKeys.map(dept => (
                <DeptAccordion
                  key={dept}
                  dept={dept}
                  rows={grouped[dept]}
                  color={meta.color}
                  defaultOpen={openAll}
                />
              ))
            )}
          </div>

          {/* Pagination */}
          {!loading && total > PAGE_SIZE && (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginTop: 20, flexWrap: 'wrap', gap: 10,
              animation: 'fadeUp 0.4s 0.15s ease both',
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
                    width: 34, height: 34, borderRadius: 9, border: 'none',
                    background: page === 1 ? '#f8fafc' : 'white',
                    color: page === 1 ? '#cbd5e1' : '#475569',
                    boxShadow: page === 1 ? 'none' : '0 1px 4px rgba(0,0,0,0.08)',
                    cursor: page === 1 ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
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
                        minWidth: 34, height: 34, padding: '0 6px',
                        borderRadius: 9, border: 'none',
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