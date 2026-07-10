// pages/public/view/TrainingViewPage.tsx
import { useState, useEffect, useCallback } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

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
  department: string | null
  test_type: 'pre' | 'post' | null
}

interface DeptSummary {
  dept: string
  total: number
  bothDone: number
  preOnly: number
  noneYet: number
  pct: number
}

// Supabase/PostgREST caps a single request at 1000 rows by default.
// If we don't page through results explicitly, rows silently get
// truncated — which is exactly what caused "post sudah nyala tapi
// pre-nya masih abu-abu": the missing pre-test row just never arrived.
const FETCH_CHUNK = 1000

async function fetchAllRows(factoryId: number, trainingCode: string): Promise<RawRow[]> {
  let all: RawRow[] = []
  let from = 0

  while (true) {
    const { data, error } = await supabase
      .from('v_status_quiz_pegawai')
      .select('nik, department, test_type')
      .eq('factory', factoryId)
      .eq('training_code', trainingCode.toUpperCase())
      .order('nik', { ascending: true })
      .range(from, from + FETCH_CHUNK - 1)

    if (error) {
      console.error('fetchAllRows error:', error)
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
const IconChevRight = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
)
const IconTraining = ({ color }: { color: string }) => (
  <svg width="22" height="22" fill="none" stroke={color} strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
    <rect x="9" y="3" width="6" height="4" rx="1" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6M9 16h4" />
  </svg>
)
const IconFolder = ({ color }: { color: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M3 7C3 5.9 3.9 5 5 5H10L12 7H19C20.1 7 21 7.9 21 9V18C21 19.1 20.1 20 19 20H5C3.9 20 3 19.1 3 18V7Z" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
)

// ── Main ──────────────────────────────────────────────────────────────────────
export default function TrainingViewPage() {
  const { trainingCode = '' } = useParams<{ trainingCode: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const factoryId = Number(searchParams.get('factory') ?? 1)

  const fac  = FACTORY_MAP[factoryId]
  const meta = TRAINING_META[trainingCode.toLowerCase()] ?? { label: trainingCode.toUpperCase(), color: '#329F96' }

  const [depts, setDepts]     = useState<DeptSummary[]>([])
  const [search, setSearch]   = useState('')
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    setLoading(true)

    const raw = await fetchAllRows(factoryId, trainingCode)

    // Merge per NIK dulu — satu karyawan bisa punya baris 'pre' dan 'post'
    // terpisah, jadi status pre/post-nya harus digabung dulu sebelum
    // dikelompokkan per department, biar gak ada yang "setengah" data.
    // department juga di-trim, dan kalau baris pertama untuk NIK itu
    // kebetulan department-nya kosong/null, tetap coba ambil dari baris
    // berikutnya yang punya nilai — supaya karyawan gak "hilang" ke bucket
    // Tidak Terdaftar gara-gara satu baris doang yang null.
    const byNik: Record<string, { department: string; hasPre: boolean; hasPost: boolean }> = {}
    for (const r of raw) {
      const rawDept = (r.department ?? '').trim()
      if (!byNik[r.nik]) {
        byNik[r.nik] = { department: rawDept, hasPre: false, hasPost: false }
      } else if (!byNik[r.nik].department && rawDept) {
        byNik[r.nik].department = rawDept
      }
      if (r.test_type === 'pre')  byNik[r.nik].hasPre  = true
      if (r.test_type === 'post') byNik[r.nik].hasPost = true
    }

    // Group jadi summary per department. Dikelompokkan pakai key yang
    // dinormalisasi (trim + uppercase) supaya "BONDING", "Bonding ", dan
    // " bonding" dianggap department yang SAMA, bukan tiga bucket
    // berbeda yang bikin total per-department jadi salah/kepecah.
    const byDept: Record<string, DeptSummary> = {}
    for (const emp of Object.values(byNik)) {
      const label = emp.department || 'Tidak Terdaftar'
      const key = label.toUpperCase()
      if (!byDept[key]) byDept[key] = { dept: label, total: 0, bothDone: 0, preOnly: 0, noneYet: 0, pct: 0 }
      byDept[key].total++
      if (emp.hasPre && emp.hasPost) byDept[key].bothDone++
      else if (emp.hasPre) byDept[key].preOnly++
      else byDept[key].noneYet++
    }

    const list = Object.values(byDept)
      .map(d => ({ ...d, pct: d.total > 0 ? Math.round((d.bothDone / d.total) * 100) : 0 }))
      .sort((a, b) => a.dept.localeCompare(b.dept))

    setDepts(list)
    setLoading(false)
  }, [factoryId, trainingCode])

  useEffect(() => { fetchData() }, [fetchData])

  const filteredDepts = depts.filter(d => d.dept.toLowerCase().includes(search.trim().toLowerCase()))
  const totalEmployees = depts.reduce((sum, d) => sum + d.total, 0)
  const totalDone = depts.reduce((sum, d) => sum + d.bothDone, 0)
  const donePct = totalEmployees > 0 ? Math.round((totalDone / totalEmployees) * 100) : 0

  const goToDept = (dept: string) => {
    navigate(`/view/${trainingCode}/${encodeURIComponent(dept)}?factory=${factoryId}`)
  }

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

        .skel {
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 800px 100%;
          animation: shimmer 1.4s infinite;
          border-radius: 6px;
        }

        .tvp-search:focus {
          outline: none;
          border-color: ${meta.color} !important;
          box-shadow: 0 0 0 3px ${meta.color}22;
        }

        .tvp-dept-card {
          background: white;
          border-radius: 14px;
          border: 1px solid #f1f5f9;
          box-shadow: 0 1px 4px rgba(0,0,0,0.05);
          animation: fadeUp 0.3s ease both;
          width: 100%;
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px 18px;
          cursor: pointer;
          text-align: left;
          font-family: inherit;
          transition: box-shadow 0.15s, transform 0.15s, border-color 0.15s;
        }
        .tvp-dept-card:hover {
          box-shadow: 0 6px 18px rgba(0,0,0,0.08);
          transform: translateY(-1px);
          border-color: ${meta.color}55;
        }

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
            {!loading && totalEmployees > 0 && (
              <div style={{ display: 'flex', gap: 10 }}>
                {[
                  { label: 'Total',      val: totalEmployees.toLocaleString('id-ID'), bg: 'white',          col: '#0d2220', shadow: '0 1px 4px rgba(0,0,0,0.07)' },
                  { label: 'Dept',       val: depts.length,                           bg: fac?.bg ?? '#f1f5f9', col: fac?.color ?? '#64748b', shadow: 'none' },
                  { label: 'Pre & Post', val: `${donePct}%`,                          bg: meta.color,       col: 'white',   shadow: `0 4px 14px ${meta.color}40` },
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

          {/* Search department */}
          <div style={{
            position: 'relative', maxWidth: 320, marginBottom: 16,
            animation: 'fadeUp 0.4s 0.07s ease both',
          }}>
            <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
              <IconSearch />
            </span>
            <input
              className="tvp-search"
              type="text"
              placeholder="Cari department…"
              value={search}
              onChange={e => setSearch(e.target.value)}
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

          {/* Department folder list */}
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 8,
            animation: 'fadeUp 0.4s 0.12s ease both',
          }}>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} style={{
                  background: 'white', borderRadius: 14, padding: '16px 18px',
                  display: 'flex', alignItems: 'center', gap: 14,
                  border: '1px solid #f1f5f9',
                }}>
                  <div className="skel" style={{ width: 40, height: 40, borderRadius: 10, flexShrink: 0 }} />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div className="skel" style={{ height: 13, width: `${100 + i * 40}px` }} />
                    <div className="skel" style={{ height: 10, width: 70 }} />
                  </div>
                  <div className="skel" style={{ width: 110, height: 5, borderRadius: 50 }} />
                </div>
              ))
            ) : filteredDepts.length === 0 ? (
              <div style={{
                background: 'white', borderRadius: 16, padding: '56px 16px',
                textAlign: 'center', border: '1px solid #f1f5f9',
              }}>
                <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: '#cbd5e1' }}>
                  {search ? `Tidak ada department untuk "${search}"` : 'Belum ada data'}
                </p>
              </div>
            ) : (
              filteredDepts.map(d => (
                <button
                  key={d.dept}
                  className="tvp-dept-card"
                  onClick={() => goToDept(d.dept)}
                >
                  <span style={{
                    width: 42, height: 42, borderRadius: 11, flexShrink: 0,
                    background: meta.color + '14',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <IconFolder color={meta.color} />
                  </span>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: '#0d2220' }}>{d.dept}</p>
                    <p style={{ margin: '2px 0 0', fontSize: 11.5, color: '#94a3b8' }}>{d.total} karyawan</p>
                  </div>

                  {/* Progress */}
                  <div className="tvp-dept-progress" style={{ display: 'flex', alignItems: 'center', gap: 8, width: 110, flexShrink: 0 }}>
                    <div style={{ flex: 1, height: 5, borderRadius: 50, background: '#f1f5f9', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', borderRadius: 50,
                        background: d.pct === 100 ? '#10b981' : meta.color,
                        width: `${d.pct}%`,
                      }} />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: meta.color, minWidth: 32, textAlign: 'right' }}>
                      {d.pct}%
                    </span>
                  </div>

                  {/* Badges */}
                  <div className="tvp-dept-badges" style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 50, background: '#dcfce7', color: '#16a34a' }}>
                      {d.bothDone} selesai
                    </span>
                    {d.preOnly > 0 && (
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 50, background: '#dbeafe', color: '#2563eb' }}>
                        {d.preOnly} pre
                      </span>
                    )}
                    {d.noneYet > 0 && (
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 50, background: '#f1f5f9', color: '#94a3b8' }}>
                        {d.noneYet} belum
                      </span>
                    )}
                  </div>

                  <span style={{ color: '#cbd5e1', flexShrink: 0 }}>
                    <IconChevRight />
                  </span>
                </button>
              ))
            )}
          </div>

        </div>
      </div>
    </>
  )
}