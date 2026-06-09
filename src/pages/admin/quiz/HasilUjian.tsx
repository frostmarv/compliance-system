import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { generatePdf, downloadZip } from '@/services/pdfService'

// ── Types ────────────────────────────────────────────────────────────────────
interface TrainingType {
  id: string
  code: string
  name: string
  is_active: boolean
}

interface QuizResult {
  id: string
  nik: string
  training_type_id: string
  score: number
  correct_count: number
  total_questions: number
  user_answers: Record<string, string>
  submitted_at: string
  test_type: 'pre' | 'post'
  karyawan?: {
    nama: string
    department: string | null
    factory: number | null
  }
  status: 'passed' | 'failed'
  participant_name: string
  participant_nik: string
  department: string | null
  factory: number | null
}

// ── Pill / Badge helpers ─────────────────────────────────────────────────────
function StatusBadge({ status }: { status: 'passed' | 'failed' }) {
  return status === 'passed' ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
      Lulus
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-rose-50 text-rose-600 border border-rose-100">
      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block" />
      Tidak Lulus
    </span>
  )
}

function FactoryBadge({ factory }: { factory: number | null }) {
  if (factory == null)
    return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-gray-100 text-gray-500">Global</span>
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-teal-50 text-teal-600 border border-teal-100">
      F{factory}
    </span>
  )
}

function ScoreBadge({ score, passing = 70 }: { score: number; passing?: number }) {
  const ok = score >= passing
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-bold ${ok ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
      {score}%
    </span>
  )
}

function TestTypeBadge({ type }: { type: 'pre' | 'post' }) {
  return type === 'pre' ? (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-violet-50 text-violet-600 border border-violet-100">
      PRE
    </span>
  ) : (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-blue-50 text-blue-600 border border-blue-100">
      POST
    </span>
  )
}

// ── Skeleton ─────────────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <tr className="border-b border-gray-50">
      {[40, 180, 60, 60, 80, 90, 100].map((w, i) => (
        <td key={i} className="px-5 py-4">
          <div className="h-3 bg-gray-100 rounded-full animate-pulse" style={{ width: w }} />
        </td>
      ))}
    </tr>
  )
}

// ── Modal Detail ─────────────────────────────────────────────────────────────
function ModalDetail({
  result,
  onClose,
  onGeneratePdf,
  pdfLoading,
}: {
  result: QuizResult
  onClose: () => void
  onGeneratePdf: (id: string) => void
  pdfLoading: boolean
}) {
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'modalIn 0.2s ease both' }}
      >
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between" style={{ background: 'linear-gradient(135deg, #1a7a73, #329F96)' }}>
          <div>
            <p className="text-white/60 text-xs font-medium uppercase tracking-wider">Detail Hasil Ujian</p>
            <p className="text-white font-bold text-sm mt-0.5">{result.participant_name}</p>
          </div>
          <div className="flex items-center gap-2">
            <TestTypeBadge type={result.test_type} />
            <StatusBadge status={result.status} />
            <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          <div className="grid grid-cols-2 gap-4 text-sm">
            {[
              { label: 'Nama Peserta', value: result.participant_name },
              { label: 'NIK', value: result.participant_nik },
              { label: 'Departemen', value: result.department ?? '—' },
              { label: 'Tanggal Ujian', value: fmt(result.submitted_at) },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">{label}</p>
                <p className="text-gray-700 font-medium">{value}</p>
              </div>
            ))}
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Factory</p>
              <FactoryBadge factory={result.factory} />
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Tipe Ujian</p>
              <TestTypeBadge type={result.test_type} />
            </div>
          </div>

          {/* Score */}
          <div className="p-4 rounded-xl border bg-slate-50 border-slate-200">
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-3">Ringkasan Nilai</p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold" style={{ color: '#329F96' }}>{result.score}%</p>
                <p className="text-xs text-gray-400 mt-1">Nilai Akhir</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-700">{result.correct_count}</p>
                <p className="text-xs text-gray-400 mt-1">Benar</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-700">{result.total_questions - result.correct_count}</p>
                <p className="text-xs text-gray-400 mt-1">Salah</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-50 border border-amber-100">
            <svg className="w-5 h-5 text-amber-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-xs text-amber-700">
              <span className="font-semibold">Passing Grade: 70%</span> — Peserta dinyatakan lulus jika mencapai nilai minimal 70%
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors">
            Tutup
          </button>
          <button
            onClick={() => onGeneratePdf(result.id)}
            disabled={pdfLoading}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white flex items-center gap-2 transition-opacity disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #1a7a73, #329F96)' }}
          >
            {pdfLoading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Generating…
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Generate PDF
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function HasilUjian() {
  const [trainingTypes, setTrainingTypes]   = useState<TrainingType[]>([])
  const [activeTab, setActiveTab]           = useState<string>('')
  const [activeTestType, setActiveTestType] = useState<'pre' | 'post'>('post')
  const [results, setResults]               = useState<QuizResult[]>([])
  const [loadingTabs, setLoadingTabs]       = useState(true)
  const [loadingResults, setLoadingResults] = useState(false)
  const [selectedResult, setSelectedResult] = useState<QuizResult | null>(null)

  // PDF states
  const [pdfLoadingId, setPdfLoadingId]     = useState<string | null>(null)  // satuan
  const [bulkLoading, setBulkLoading]       = useState(false)
  const [pdfToast, setPdfToast]             = useState<{ type: 'success' | 'error'; msg: string } | null>(null)

  // Filters
  const [search, setSearch]               = useState('')
  const [filterFactory, setFilterFactory] = useState<'all' | '1' | '2'>('all')
  const [filterStatus, setFilterStatus]   = useState<'all' | 'passed' | 'failed'>('all')
  const [filterDate, setFilterDate]       = useState<'all' | 'today' | 'week' | 'month'>('all')

  const PASSING = 70

  // Toast helper
  const showToast = (type: 'success' | 'error', msg: string) => {
    setPdfToast({ type, msg })
    setTimeout(() => setPdfToast(null), 4000)
  }

  // 1. Fetch training types
  useEffect(() => {
    supabase
      .from('training_types')
      .select('id, code, name, is_active')
      .eq('is_active', true)
      .order('name')
      .then(({ data }) => {
        if (data?.length) {
          setTrainingTypes(data)
          setActiveTab(data[0].id)
        }
        setLoadingTabs(false)
      })
  }, [])

  // 2. Fetch hasil ujian
  useEffect(() => {
    if (!activeTab) return
    const fetchResults = async () => {
      setLoadingResults(true)
      setResults([])

      let query = supabase
        .from('hasil_ujian')
        .select(`
          id, nik, training_type_id, score, correct_count,
          total_questions, user_answers, submitted_at, test_type,
          karyawan:nik ( nama, department, factory )
        `)
        .eq('training_type_id', activeTab)
        .eq('test_type', activeTestType)           // ← filter pre / post
        .order('submitted_at', { ascending: false })

      if (filterFactory !== 'all') query = query.eq('karyawan.factory', parseInt(filterFactory))

      if (filterDate !== 'all') {
        const now = new Date()
        const start =
          filterDate === 'today' ? new Date(new Date().setHours(0, 0, 0, 0)) :
          filterDate === 'week'  ? new Date(now.setDate(now.getDate() - 7)) :
                                   new Date(now.setMonth(now.getMonth() - 1))
        query = query.gte('submitted_at', start.toISOString())
      }

      const { data, error } = await query
      if (error) { console.error(error); setLoadingResults(false); return }

      setResults(
        (data ?? []).map((item: any): QuizResult => {
          const k = item.karyawan as { nama: string; department: string | null; factory: number | null } | null
          return {
            id: item.id,
            nik: item.nik,
            training_type_id: item.training_type_id,
            score: item.score ?? 0,
            correct_count: item.correct_count ?? 0,
            total_questions: item.total_questions ?? 0,
            user_answers: item.user_answers ?? {},
            submitted_at: item.submitted_at,
            test_type: item.test_type ?? 'post',
            karyawan: k ?? undefined,
            status: (item.score ?? 0) >= PASSING ? 'passed' : 'failed',
            participant_name: k?.nama ?? item.nik,
            participant_nik: item.nik,
            department: k?.department ?? null,
            factory: k?.factory ?? null,
          }
        })
      )
      setLoadingResults(false)
    }
    fetchResults()
  }, [activeTab, activeTestType, filterFactory, filterDate])

  // Client-side filter
  const filtered = results.filter((r) => {
    const q = search.toLowerCase()
    const matchSearch =
      r.participant_name.toLowerCase().includes(q) ||
      r.participant_nik.toLowerCase().includes(q) ||
      (r.department ?? '').toLowerCase().includes(q)
    const matchStatus = filterStatus === 'all' || r.status === filterStatus
    return matchSearch && matchStatus
  })

  const activeTraining = trainingTypes.find((t) => t.id === activeTab)

  const stats = {
    total:    filtered.length,
    passed:   filtered.filter((r) => r.status === 'passed').length,
    failed:   filtered.filter((r) => r.status === 'failed').length,
    avgScore: filtered.length ? Math.round(filtered.reduce((a, r) => a + r.score, 0) / filtered.length) : 0,
  }

  // ── PDF handlers ──────────────────────────────────────────────────────────
  const handleGenerateSingle = useCallback(async (hasilId: string) => {
    setPdfLoadingId(hasilId)
    try {
      await generatePdf(hasilId)
      showToast('success', 'PDF berhasil dibuat!')
      setSelectedResult(null)
    } catch (e: any) {
      showToast('error', e.message ?? 'Gagal generate PDF')
    } finally {
      setPdfLoadingId(null)
    }
  }, [])

  const handleBulkDownload = useCallback(async () => {
    if (!activeTraining) return
    setBulkLoading(true)
    try {
      const year = new Date().getFullYear()
      const semester = new Date().getMonth() < 6 ? 1 : 2
      await downloadZip({
        year,
        semester,
        training_type: activeTraining.code,
        factory: filterFactory !== 'all' ? `Factory_${filterFactory}` : undefined,
      })
      showToast('success', 'ZIP sedang didownload…')
    } catch (e: any) {
      showToast('error', e.message ?? 'Gagal download ZIP')
    } finally {
      setBulkLoading(false)
    }
  }, [activeTraining, filterFactory])

  const resetTab = () => {
    setSearch('')
    setFilterFactory('all')
    setFilterStatus('all')
    setFilterDate('all')
    setActiveTestType('post')
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @keyframes fadein  { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
        @keyframes modalIn { from { opacity:0; transform:scale(0.96); } to { opacity:1; transform:scale(1); } }
        @keyframes slideDown { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:none; } }
        .anim-fadein { animation: fadein 0.3s ease both; }
      `}</style>

      {/* Toast */}
      {pdfToast && (
        <div
          className="fixed top-5 right-5 z-[100] flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium"
          style={{ animation: 'slideDown 0.25s ease both', background: pdfToast.type === 'success' ? '#ecfdf5' : '#fef2f2', color: pdfToast.type === 'success' ? '#065f46' : '#991b1b', border: `1px solid ${pdfToast.type === 'success' ? '#a7f3d0' : '#fecaca'}` }}
        >
          {pdfToast.type === 'success'
            ? <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            : <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          }
          {pdfToast.msg}
        </div>
      )}

      <div className="min-h-screen bg-gray-50">

        {/* ── Page Header + Tabs ──────────────────────────────── */}
        <div className="bg-white border-b border-gray-100 px-7 pt-7 pb-0">
          <div className="anim-fadein">
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#1a7a73' }}>Hasil Ujian</h1>
            <p className="text-gray-400 text-sm mt-0.5 mb-5">Pantau hasil dan performa peserta ujian</p>
          </div>

          {/* Training Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-px">
            {loadingTabs
              ? [1,2,3,4,5,6].map((i) => <div key={i} className="h-9 w-32 rounded-t-lg bg-gray-100 animate-pulse" />)
              : trainingTypes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => { setActiveTab(t.id); resetTab() }}
                    className="relative px-5 py-2.5 text-sm font-semibold rounded-t-xl transition-all duration-150 whitespace-nowrap"
                    style={
                      activeTab === t.id
                        ? { background: 'white', color: '#329F96', borderTop: '2px solid #329F96', borderLeft: '1px solid #e5e7eb', borderRight: '1px solid #e5e7eb', marginBottom: '-1px', zIndex: 2 }
                        : { color: '#9ca3af' }
                    }
                  >
                    {t.name}
                    <span
                      className="ml-2 text-[10px] px-1.5 py-0.5 rounded-full font-bold"
                      style={activeTab === t.id ? { background: '#329F9620', color: '#329F96' } : { background: '#f1f5f9', color: '#94a3b8' }}
                    >
                      {activeTab === t.id ? filtered.length : '—'}
                    </span>
                  </button>
                ))}
          </div>
        </div>

        {/* ── Content ────────────────────────────────────────── */}
        <div className="px-7 py-6 space-y-4">

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 anim-fadein">
            {[
              { label: 'Total Peserta', value: stats.total,    color: '#64748b' },
              { label: 'Lulus',         value: stats.passed,   color: '#059669' },
              { label: 'Tidak Lulus',   value: stats.failed,   color: '#dc2626' },
              { label: 'Rata-rata',     value: `${stats.avgScore}%`, color: '#329F96' },
            ].map((s, i) => (
              <div key={i} className="p-4 rounded-xl border bg-white" style={{ borderColor: '#f1f5f9' }}>
                <p className="text-xs text-gray-400 uppercase tracking-wider">{s.label}</p>
                <p className="text-2xl font-bold mt-1" style={{ color: s.color }}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Pre / Post toggle + Toolbar */}
          <div className="flex flex-wrap items-center gap-3 anim-fadein">

            {/* PRE / POST toggle */}
            <div className="flex items-center bg-gray-100 rounded-xl p-1 gap-1">
              {(['pre', 'post'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveTestType(type)}
                  className="px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-150"
                  style={
                    activeTestType === type
                      ? { background: 'white', color: type === 'pre' ? '#7c3aed' : '#2563eb', boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }
                      : { color: '#9ca3af' }
                  }
                >
                  {type.toUpperCase()} Test
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative flex-1 min-w-[180px]">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
              </svg>
              <input
                type="text"
                placeholder="Cari nama, NIK, departemen…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 transition"
                style={{ '--tw-ring-color': '#329F96' } as React.CSSProperties}
              />
            </div>

            {/* Filter Factory */}
            <select value={filterFactory} onChange={(e) => setFilterFactory(e.target.value as any)} className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-600 focus:outline-none cursor-pointer">
              <option value="all">Semua Factory</option>
              <option value="1">Factory 1</option>
              <option value="2">Factory 2</option>
            </select>

            {/* Filter Status */}
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as any)} className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-600 focus:outline-none cursor-pointer">
              <option value="all">Semua Status</option>
              <option value="passed">Lulus</option>
              <option value="failed">Tidak Lulus</option>
            </select>

            {/* Filter Date */}
            <select value={filterDate} onChange={(e) => setFilterDate(e.target.value as any)} className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-600 focus:outline-none cursor-pointer">
              <option value="all">Semua Waktu</option>
              <option value="today">Hari Ini</option>
              <option value="week">7 Hari Terakhir</option>
              <option value="month">30 Hari Terakhir</option>
            </select>

            {/* Bulk ZIP download */}
            <button
              onClick={handleBulkDownload}
              disabled={bulkLoading || filtered.length === 0}
              className="ml-auto px-4 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center gap-2 transition-opacity disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #1a7a73, #329F96)' }}
            >
              {bulkLoading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Menyiapkan ZIP…
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download ZIP
                  {filtered.length > 0 && (
                    <span className="bg-white/20 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {filtered.length}
                    </span>
                  )}
                </>
              )}
            </button>
          </div>

          {/* ── Table ──────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl overflow-hidden anim-fadein" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.07), 0 8px 24px rgba(0,0,0,0.05)' }}>
            {/* Table top bar */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-sm font-bold text-gray-700">{activeTraining?.name ?? '—'}</p>
                  <p className="text-xs text-gray-400">{activeTraining?.code} • {activeTestType === 'pre' ? 'Pre Test' : 'Post Test'}</p>
                </div>
                <TestTypeBadge type={activeTestType} />
              </div>
              <span className="text-xs text-gray-400">{filtered.length} data</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {['No.', 'Peserta', 'Factory', 'Tipe', 'Nilai', 'Status', 'Tanggal', 'Aksi'].map((h, i) => (
                      <th key={i} className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider text-left first:w-12 last:text-center">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loadingResults
                    ? Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
                    : filtered.length === 0
                    ? (
                      <tr>
                        <td colSpan={8} className="text-center py-16 text-gray-300">
                          <svg className="w-10 h-10 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          <p className="text-sm">Belum ada hasil {activeTestType === 'pre' ? 'pre test' : 'post test'} untuk training ini</p>
                        </td>
                      </tr>
                    )
                    : filtered.map((r, i) => (
                      <tr key={r.id} className="hover:bg-gray-50/70 transition-colors anim-fadein" style={{ animationDelay: `${i * 25}ms`, animationFillMode: 'both' }}>
                        <td className="px-5 py-4 text-gray-400 text-xs font-medium">{i + 1}</td>
                        <td className="px-5 py-4">
                          <p className="text-gray-700 font-medium text-sm">{r.participant_name}</p>
                          <p className="text-gray-400 text-xs">NIK: {r.participant_nik}</p>
                          {r.department && <p className="text-gray-400 text-[10px] mt-0.5">{r.department}</p>}
                        </td>
                        <td className="px-5 py-4"><FactoryBadge factory={r.factory} /></td>
                        <td className="px-5 py-4"><TestTypeBadge type={r.test_type} /></td>
                        <td className="px-5 py-4 text-center"><ScoreBadge score={r.score} /></td>
                        <td className="px-5 py-4 text-center"><StatusBadge status={r.status} /></td>
                        <td className="px-5 py-4 text-xs text-gray-500">
                          {new Date(r.submitted_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* Detail */}
                            <button
                              onClick={() => setSelectedResult(r)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                              style={{ background: '#329F9615', color: '#329F96' }}
                              onMouseEnter={(e) => (e.currentTarget.style.background = '#329F9625')}
                              onMouseLeave={(e) => (e.currentTarget.style.background = '#329F9615')}
                              title="Lihat detail"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              Detail
                            </button>

                            {/* Generate PDF satuan */}
                            <button
                              onClick={() => handleGenerateSingle(r.id)}
                              disabled={pdfLoadingId === r.id}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                              style={{ background: '#eff6ff', color: '#2563eb' }}
                              onMouseEnter={(e) => { if (!pdfLoadingId) e.currentTarget.style.background = '#dbeafe' }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = '#eff6ff' }}
                              title="Generate PDF"
                            >
                              {pdfLoadingId === r.id ? (
                                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                </svg>
                              ) : (
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              )}
                              PDF
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedResult && (
        <ModalDetail
          result={selectedResult}
          onClose={() => setSelectedResult(null)}
          onGeneratePdf={handleGenerateSingle}
          pdfLoading={pdfLoadingId === selectedResult.id}
        />
      )}
    </>
  )
}