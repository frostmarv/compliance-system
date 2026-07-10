// pages/public/view/TrainingDeptViewPage.tsx
import { useState, useEffect, useCallback, useMemo } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import * as XLSX from 'xlsx'

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

interface RawRow {
  nik: string
  nama: string
  department: string | null
  test_type: 'pre' | 'post' | null
}

interface EmployeeRow {
  nik: string
  nama: string
  hasPre: boolean
  hasPost: boolean
}

// Supabase/PostgREST caps a single request at 1000 rows by default.
// The old code paginated with .range() directly on the RAW rows table
// (one row per NIK per test_type), which caused two separate bugs:
//   1. "count: exact" counted test-attempt rows, not unique employees —
//      an employee who did both pre & post was counted twice.
//   2. .range() could cut a single employee's rows across two pages,
//      so their pre-row and post-row didn't always end up merged
//      together — showing incomplete/inconsistent status.
// Fix: always fetch ALL rows for the department first (looping past
// the 1000-row cap if needed), merge into unique employees, and only
// THEN apply search / filter / pagination — all at the employee level.
const FETCH_CHUNK = 1000

// Department string dinormalisasi (trim + uppercase) supaya "BONDING",
// "Bonding ", dan " bonding" dianggap sama — konsisten dengan cara
// TrainingViewPage mengelompokkan department di halaman summary.
// Karena itu kita TIDAK filter department di query (exact match bisa
// meleset kalau ada perbedaan spasi/kapitalisasi), tapi ambil semua baris
// factory+training lalu filter di client pakai normalizeDept().
const normalizeDept = (d: string | null | undefined) => (d ?? '').trim().toUpperCase()

async function fetchAllDeptRows(
  factoryId: number,
  trainingCode: string,
): Promise<RawRow[]> {
  let all: RawRow[] = []
  let from = 0

  while (true) {
    const { data, error } = await supabase
      .from('v_status_quiz_pegawai')
      .select('nik, nama, department, test_type')
      .eq('factory', factoryId)
      .eq('training_code', trainingCode.toUpperCase())
      .order('nik', { ascending: true })
      .range(from, from + FETCH_CHUNK - 1)

    if (error) {
      console.error('fetchAllDeptRows error:', error)
      break
    }

    const chunk = data ?? []
    all = all.concat(chunk)

    if (chunk.length < FETCH_CHUNK) break // last page reached
    from += FETCH_CHUNK
  }

  return all
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
const IconFolder = ({ color }: { color: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M3 7C3 5.9 3.9 5 5 5H10L12 7H19C20.1 7 21 7.9 21 9V18C21 19.1 20.1 20 19 20H5C3.9 20 3 19.1 3 18V7Z" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
)
const IconDownload = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v12m0 0l-4-4m4 4l4-4M4 19h16" />
  </svg>
)

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

// ── Main ──────────────────────────────────────────────────────────────────────
export default function TrainingDeptViewPage() {
  const { trainingCode = '', department = '' } = useParams<{ trainingCode: string; department: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const factoryId = Number(searchParams.get('factory') ?? 1)
  const deptName = decodeURIComponent(department)

  const fac  = FACTORY_MAP[factoryId]
  const meta = TRAINING_META[trainingCode.toLowerCase()] ?? { label: trainingCode.toUpperCase(), color: '#329F96' }

  // Semua karyawan di department ini (sudah digabung per NIK, lengkap pre+post)
  const [allEmployees, setAllEmployees] = useState<EmployeeRow[]>([])
  const [page, setPage]       = useState(1)
  const [search, setSearch]   = useState('')
  const [filter, setFilter]   = useState<'all' | 'done' | 'pre' | 'none'>('all')
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    setLoading(true)

    const raw = await fetchAllDeptRows(factoryId, trainingCode)
    const targetKey = normalizeDept(deptName)
    const deptRows = raw.filter(r => normalizeDept(r.department) === targetKey)

    // Gabungkan per NIK dulu — baru setelah ini statusnya "benar" utuh,
    // gak akan ada kasus post nyala tapi pre kepotong ke halaman lain.
    const byNik: Record<string, EmployeeRow> = {}
    for (const r of deptRows) {
      if (!byNik[r.nik]) {
        byNik[r.nik] = { nik: r.nik, nama: r.nama, hasPre: false, hasPost: false }
      }
      if (r.test_type === 'pre')  byNik[r.nik].hasPre  = true
      if (r.test_type === 'post') byNik[r.nik].hasPost = true
    }

    const list = Object.values(byNik).sort((a, b) => a.nama.localeCompare(b.nama))
    setAllEmployees(list)
    setLoading(false)
  }, [factoryId, trainingCode, deptName])

  useEffect(() => { fetchData() }, [fetchData])

  const handleSearch = (q: string) => { setSearch(q); setPage(1) }
  const handleFilter = (f: typeof filter) => { setFilter(f); setPage(1) }

  // Total karyawan asli di department ini — dihitung dari daftar unik per
  // NIK yang sudah digabung, jadi jumlahnya sesuai dengan jumlah karyawan
  // sebenarnya, bukan jumlah baris pre/post.
  const total = allEmployees.length
  const bothDoneCount = allEmployees.filter(r => r.hasPre && r.hasPost).length
  const donePct = total > 0 ? Math.round((bothDoneCount / total) * 100) : 0

  // Search + filter dijalankan di atas daftar karyawan yang sudah tergabung
  const searchedFiltered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return allEmployees.filter(r => {
      if (q && !r.nama.toLowerCase().includes(q) && !r.nik.toLowerCase().includes(q)) return false
      if (filter === 'done') return r.hasPre && r.hasPost
      if (filter === 'pre')  return r.hasPre && !r.hasPost
      if (filter === 'none') return !r.hasPre && !r.hasPost
      return true
    })
  }, [allEmployees, search, filter])

  // Export sesuai tab filter yang lagi aktif (Semua / Pre & Post / Pre Saja
  // / Belum Ujian) dan search yang lagi diketik — jadi user bisa download
  // "yang sudah" atau "yang belum" tinggal pilih tab-nya dulu.
  const handleDownloadExcel = () => {
    const rows = searchedFiltered.map((r, i) => ({
      No: i + 1,
      NIK: r.nik,
      Nama: r.nama,
      Pre: r.hasPre ? 'Sudah' : 'Belum',
      Post: r.hasPost ? 'Sudah' : 'Belum',
      Status: r.hasPre && r.hasPost ? 'Selesai' : r.hasPre ? 'Pre Saja' : 'Belum Ujian',
    }))

    const ws = XLSX.utils.json_to_sheet(rows)
    ws['!cols'] = [{ wch: 5 }, { wch: 14 }, { wch: 28 }, { wch: 10 }, { wch: 10 }, { wch: 14 }]

    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, deptName.slice(0, 31) || 'Data')

    const filterLabel = filterTabs.find(t => t.key === filter)?.label.replace(/\s+/g, '') ?? 'Semua'
    const fileName = `${meta.label.replace(/\s+/g, '_')}_${deptName.replace(/\s+/g, '_')}_${filterLabel}.xlsx`
    XLSX.writeFile(wb, fileName)
  }

  const totalPages = Math.max(1, Math.ceil(searchedFiltered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageStart = (safePage - 1) * PAGE_SIZE
  const filteredRows = searchedFiltered.slice(pageStart, pageStart + PAGE_SIZE)

  const getPages = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const pages: (number | '...')[] = [1]
    if (safePage > 3) pages.push('...')
    for (let i = Math.max(2, safePage - 1); i <= Math.min(totalPages - 1, safePage + 1); i++) pages.push(i)
    if (safePage < totalPages - 2) pages.push('...')
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

        .tdv-root { min-height: 100vh; font-family: 'Sora', sans-serif; background: #f0f4f8; }

        .skel {
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 800px 100%;
          animation: shimmer 1.4s infinite;
          border-radius: 6px;
        }

        .tdv-search:focus {
          outline: none;
          border-color: ${meta.color} !important;
          box-shadow: 0 0 0 3px ${meta.color}22;
        }

        .tdv-table {
          background: white;
          border-radius: 14px;
          overflow: hidden;
          border: 1px solid #f1f5f9;
          box-shadow: 0 1px 4px rgba(0,0,0,0.05);
          animation: fadeUp 0.3s ease both;
        }
        .tdv-thead {
          display: flex; align-items: center; gap: 0;
          padding: 10px 18px; background: #fafcfc;
          border-bottom: 1px solid #f1f5f9;
          font-size: 10px; font-weight: 700; color: #b0bec5;
          text-transform: uppercase; letter-spacing: 0.8px;
        }
        .tdv-row {
          display: flex; align-items: center; gap: 0;
          padding: 12px 18px;
          transition: background 0.1s;
          font-size: 13px; color: #475569;
        }
        .tdv-row:hover { background: #f8fdfc; }
        .tdv-nik {
          font-family: 'DM Mono', monospace;
          font-size: 11px; font-weight: 500;
          background: #f1f5f9; color: #64748b;
          padding: 2px 7px; border-radius: 5px;
        }

        .pgbtn:hover:not(:disabled) { background: #f1f5f9 !important; }

        @media (max-width: 700px) {
          .tdv-topbar { padding: 0 16px !important; }
          .tdv-main   { padding: 20px 16px !important; }
        }
      `}</style>

      <div className="tdv-root">

        {/* ── Sticky top bar ──────────────────────────────────── */}
        <div
          className="tdv-topbar"
          style={{
            background: 'white', borderBottom: '1px solid #f1f5f9',
            padding: '0 40px', position: 'sticky', top: 0, zIndex: 20,
            display: 'flex', alignItems: 'center', height: 60,
            boxShadow: '0 2px 12px rgba(0,0,0,0.05)', gap: 0, flexWrap: 'wrap',
          }}
        >
          <button
            onClick={() => navigate(`/view/${trainingCode}?factory=${factoryId}`)}
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

          <svg width="13" height="13" fill="none" stroke="#cbd5e1" strokeWidth="2" viewBox="0 0 24 24" style={{ margin: '0 5px' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>

          <span style={{ fontSize: 12, fontWeight: 700, color: '#0d2220' }}>{deptName}</span>
        </div>

        {/* ── Main content ─────────────────────────────────────── */}
        <div className="tdv-main" style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 40px' }}>

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
                <IconFolder color={meta.color} />
              </div>
              <div>
                <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0d1f1e', margin: 0 }}>{deptName}</h1>
                <p style={{ fontSize: 13, color: '#7a9997', margin: '3px 0 0' }}>
                  {meta.label} · {fac?.short ?? 'F' + factoryId}
                </p>
              </div>
            </div>

            {!loading && total > 0 && (
              <div style={{ display: 'flex', gap: 10 }}>
                {[
                  { label: 'Total',      val: total.toLocaleString('id-ID'), bg: 'white', col: '#0d2220', shadow: '0 1px 4px rgba(0,0,0,0.07)' },
                  { label: 'Pre & Post', val: `${donePct}%`,                 bg: meta.color, col: 'white', shadow: `0 4px 14px ${meta.color}40` },
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

            <div style={{ position: 'relative', flex: 1, maxWidth: 300 }}>
              <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                <IconSearch />
              </span>
              <input
                className="tdv-search"
                type="text"
                placeholder="Cari NIK atau nama…"
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

            <span style={{ fontSize: 12, color: '#94a3b8', marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5 }}>
              <IconUsers /> {searchedFiltered.length.toLocaleString('id-ID')} karyawan
            </span>

            <button
              onClick={handleDownloadExcel}
              disabled={loading || searchedFiltered.length === 0}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '9px 14px', borderRadius: 10, border: 'none',
                fontFamily: 'inherit', fontSize: 12.5, fontWeight: 700,
                background: loading || searchedFiltered.length === 0 ? '#f1f5f9' : meta.color,
                color: loading || searchedFiltered.length === 0 ? '#cbd5e1' : 'white',
                cursor: loading || searchedFiltered.length === 0 ? 'not-allowed' : 'pointer',
                boxShadow: loading || searchedFiltered.length === 0 ? 'none' : `0 4px 12px ${meta.color}40`,
                transition: 'all 0.15s', flexShrink: 0,
              }}
            >
              <IconDownload /> Download Excel
            </button>
          </div>

          {/* Employee table */}
          <div className="tdv-table" style={{ animation: 'fadeUp 0.4s 0.12s ease both' }}>
            {loading ? (
              <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="skel" style={{ height: 16, width: `${60 + (i % 3) * 20}%` }} />
                ))}
              </div>
            ) : filteredRows.length === 0 ? (
              <div style={{ padding: '56px 16px', textAlign: 'center' }}>
                <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: '#cbd5e1' }}>
                  {search ? `Tidak ada hasil untuk "${search}"` : 'Belum ada karyawan di department ini'}
                </p>
              </div>
            ) : (
              <>
                <div className="tdv-thead">
                  <span style={{ width: 28, textAlign: 'center' }}>#</span>
                  <span style={{ width: 100 }}>NIK</span>
                  <span style={{ flex: 1 }}>Nama</span>
                  <span style={{ width: 60, textAlign: 'center' }}>Pre</span>
                  <span style={{ width: 60, textAlign: 'center' }}>Post</span>
                </div>
                {filteredRows.map((row, i) => (
                  <div
                    key={row.nik}
                    className="tdv-row"
                    style={{ borderBottom: i < filteredRows.length - 1 ? '1px solid #f8fdfc' : 'none' }}
                  >
                    <span style={{ width: 28, textAlign: 'center', fontSize: 11, color: '#d1d5db', fontWeight: 600 }}>
                      {pageStart + i + 1}
                    </span>
                    <span style={{ width: 100 }}>
                      <code className="tdv-nik">{row.nik}</code>
                    </span>
                    <span style={{ flex: 1, fontWeight: 600, fontSize: 13, color: '#1a2e2d', display: 'flex', alignItems: 'center', gap: 7 }}>
                      <IconProfile color={meta.color} />
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
              </>
            )}
          </div>

          {/* Pagination */}
          {!loading && searchedFiltered.length > PAGE_SIZE && (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginTop: 20, flexWrap: 'wrap', gap: 10,
              animation: 'fadeUp 0.4s 0.15s ease both',
            }}>
              <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>
                Halaman <strong style={{ color: '#475569' }}>{safePage}</strong> dari{' '}
                <strong style={{ color: '#475569' }}>{totalPages}</strong>
              </p>
              <div style={{ display: 'flex', gap: 4 }}>
                <button
                  className="pgbtn"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={safePage === 1}
                  style={{
                    width: 34, height: 34, borderRadius: 9, border: 'none',
                    background: safePage === 1 ? '#f8fafc' : 'white',
                    color: safePage === 1 ? '#cbd5e1' : '#475569',
                    boxShadow: safePage === 1 ? 'none' : '0 1px 4px rgba(0,0,0,0.08)',
                    cursor: safePage === 1 ? 'not-allowed' : 'pointer',
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
                        background: safePage === p ? meta.color : 'white',
                        color: safePage === p ? 'white' : '#475569',
                        fontFamily: 'inherit', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                        boxShadow: safePage === p ? `0 4px 12px ${meta.color}40` : '0 1px 4px rgba(0,0,0,0.08)',
                        transition: 'all 0.15s',
                      }}
                    >{p}</button>
                  )
                )}

                <button
                  className="pgbtn"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={safePage === totalPages}
                  style={{
                    width: 34, height: 34, borderRadius: 9, border: 'none',
                    background: safePage === totalPages ? '#f8fafc' : 'white',
                    color: safePage === totalPages ? '#cbd5e1' : '#475569',
                    boxShadow: safePage === totalPages ? 'none' : '0 1px 4px rgba(0,0,0,0.08)',
                    cursor: safePage === totalPages ? 'not-allowed' : 'pointer',
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