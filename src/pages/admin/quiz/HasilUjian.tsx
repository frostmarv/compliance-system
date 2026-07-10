import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { generatePdf, viewPdf, downloadZip } from '@/services/pdfService'
import { useAuth, isOwner } from '@/hooks/useAuth'

// ── Types ────────────────────────────────────────────────────────────────────
interface TrainingType {
  id: string
  code: string
  name: string
  is_active: boolean
}

interface TestResult {
  id: string
  score: number
  correct_count: number
  total_questions: number
  submitted_at: string
  pdf_id: string | null
  status: 'passed' | 'failed'
}

interface ParticipantRow {
  nik: string
  participant_name: string
  department: string | null
  factory: number | null
  pre: TestResult | null
  post: TestResult | null
  isOrphan: boolean
}

// Raw row from Supabase

const FACTORIES = [
  { key: 'all', label: 'Semua Factory',                    short: 'Semua' },
  { key: '1',   label: 'Zinus Global Indonesia',            short: 'ZGI'   },
  { key: '2',   label: 'Zinus Global Indonesia - Karawang', short: 'ZGK'   },
  { key: '3',   label: 'Zinus Dream Indonesia',             short: 'ZDI'   },
] as const
type FactoryKey = typeof FACTORIES[number]['key']

const PASSING = 70

// ── Tiny badge atoms ──────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: 'passed' | 'failed' | null }) {
  if (!status)
    return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-gray-100 text-gray-400">—</span>
  return status === 'passed' ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />Lulus
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-rose-50 text-rose-600 border border-rose-100">
      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />Tidak Lulus
    </span>
  )
}

function TestStatusCell({ result }: { result: TestResult | null }) {
  if (!result)
    return (
      <div className="flex flex-col items-center gap-0.5">
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-gray-100 text-gray-400">Belum</span>
      </div>
    )
  return (
    <div className="flex flex-col items-center gap-1">
      <StatusBadge status={result.status} />
      <span className={`text-xs font-bold ${result.status === 'passed' ? 'text-emerald-600' : 'text-rose-500'}`}>
        {result.score}%
      </span>
      <span className="text-[10px] text-gray-400">{result.correct_count}/{result.total_questions} benar</span>
    </div>
  )
}

const FACTORY_CHIP_STYLE: Record<number, { label: string; className: string }> = {
  1: { label: 'ZGI', className: 'bg-teal-50 text-teal-600 border-teal-100' },
  2: { label: 'ZGK', className: 'bg-sky-50 text-sky-600 border-sky-100' },
  3: { label: 'ZDI', className: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
}

function FactoryChip({ factory }: { factory: number | null }) {
  if (factory == null)
    return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-gray-100 text-gray-500">—</span>
  const style = FACTORY_CHIP_STYLE[factory]
  if (!style)
    return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-gray-100 text-gray-500">F{factory}</span>
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border ${style.className}`}>
      {style.label}
    </span>
  )
}

function OrphanBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      NIK Tidak Ditemukan
    </span>
  )
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <tr className="border-b border-gray-50">
      {[32, 100, 140, 80, 90, 90, 80, 70].map((w, i) => (
        <td key={i} className="px-4 py-4">
          <div className="h-3 bg-gray-100 rounded-full animate-pulse mx-auto" style={{ width: w }} />
        </td>
      ))}
    </tr>
  )
}

// ── Score Ring ────────────────────────────────────────────────────────────────
function ScoreRing({ score, size = 72 }: { score: number; size?: number }) {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const pct = Math.min(score, 100) / 100
  const ok = score >= PASSING
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f1f5f9" strokeWidth="6" />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={ok ? '#10b981' : '#f43f5e'} strokeWidth="6"
        strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
      />
    </svg>
  )
}

// ── Detail Modal ──────────────────────────────────────────────────────────────
function ModalDetail({
  row,
  onClose,
  onGeneratePdf,
  onViewPdf,
  pdfLoadingId,
  viewLoadingId,
}: {
  row: ParticipantRow
  onClose: () => void
  onGeneratePdf: (id: string) => void
  onViewPdf: (pdfId: string) => void
  pdfLoadingId: string | null
  viewLoadingId: string | null
}) {
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

  const TestCard = ({ type, result }: { type: 'pre' | 'post'; result: TestResult | null }) => {
    const label = type === 'pre' ? 'Pre Test' : 'Post Test'
    const badgeStyle = type === 'pre'
      ? { bg: 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-100' }
      : { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100' }

    if (!result) {
      return (
        <div className={`p-4 rounded-xl border border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center gap-2 min-h-[140px]`}>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold border ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}>{label}</span>
          <p className="text-xs text-gray-400">Belum mengikuti ujian</p>
        </div>
      )
    }

    const isLoading = pdfLoadingId === result.id
    const isViewLoading = viewLoadingId === result.pdf_id

    return (
      <div className={`p-4 rounded-xl border bg-white ${result.status === 'passed' ? 'border-emerald-100' : 'border-rose-100'}`}>
        <div className="flex items-center justify-between mb-3">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold border ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}>{label}</span>
          <StatusBadge status={result.status} />
        </div>

        <div className="flex items-center gap-4">
          {/* Score ring */}
          <div className="relative shrink-0">
            <ScoreRing score={result.score} />
            <div className="absolute inset-0 flex items-center justify-center" style={{ transform: 'none' }}>
              <span className={`text-sm font-bold ${result.status === 'passed' ? 'text-emerald-600' : 'text-rose-500'}`}>{result.score}%</span>
            </div>
          </div>

          <div className="flex-1 space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400 text-xs">Benar</span>
              <span className="font-semibold text-gray-700">{result.correct_count} soal</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 text-xs">Salah</span>
              <span className="font-semibold text-gray-700">{result.total_questions - result.correct_count} soal</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 text-xs">Total</span>
              <span className="font-semibold text-gray-700">{result.total_questions} soal</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 text-xs">Tanggal</span>
              <span className="font-semibold text-gray-700 text-[11px]">{fmt(result.submitted_at)}</span>
            </div>
          </div>
        </div>

        {/* PDF actions */}
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2">
          {result.pdf_id && (
            <button
              onClick={() => onViewPdf(result.pdf_id!)}
              disabled={!!isViewLoading}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
              style={{ background: '#eff6ff', color: '#2563eb' }}
            >
              {isViewLoading ? <SpinIcon /> : <EyeIcon />}
              Lihat PDF
            </button>
          )}
          <button
            onClick={() => onGeneratePdf(result.id)}
            disabled={!!isLoading}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold text-white transition-opacity disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #1a7a73, #329F96)' }}
          >
            {isLoading ? <SpinIcon /> : <DocIcon />}
            {result.pdf_id ? 'Regenerate' : 'Generate PDF'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'modalIn 0.2s ease both', maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between sticky top-0 z-10"
          style={{ background: 'linear-gradient(135deg, #1a7a73, #329F96)' }}>
          <div>
            <p className="text-white/60 text-xs font-medium uppercase tracking-wider">Detail Peserta</p>
            <p className="text-white font-bold text-base mt-0.5">{row.participant_name}</p>
          </div>
          <div className="flex items-center gap-2">
            <FactoryChip factory={row.factory} />
            <button onClick={onClose}
              className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="px-6 py-5 space-y-5">
          {row.isOrphan && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-50 border border-amber-100">
              <svg className="w-4 h-4 text-amber-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-xs text-amber-700">
                <span className="font-semibold">NIK {row.nik} tidak ditemukan</span> di data master karyawan — nama & departemen tidak bisa ditampilkan.
              </p>
            </div>
          )}

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            {[
              { label: 'NIK',        value: row.nik },
              { label: 'Departemen', value: row.department ?? '—' },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">{label}</p>
                <p className="text-gray-700 font-medium">{value}</p>
              </div>
            ))}
          </div>

          {/* Passing grade notice */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-50 border border-amber-100">
            <svg className="w-4 h-4 text-amber-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-xs text-amber-700">
              <span className="font-semibold">Passing Grade: {PASSING}%</span> — Peserta lulus jika nilai ≥ {PASSING}%
            </p>
          </div>

          {/* Test cards */}
          <div className="grid grid-cols-2 gap-3">
            <TestCard type="pre"  result={row.pre}  />
            <TestCard type="post" result={row.post} />
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button onClick={onClose}
            className="px-5 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors">
            Tutup
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Icon helpers ──────────────────────────────────────────────────────────────
const SpinIcon = () => (
  <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
  </svg>
)
const EyeIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
)
const DocIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
)

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function HasilUjian() {
  const { staff, loading: authLoading } = useAuth()
  const canSwitchFactory = isOwner(staff)

  // Admin dikunci ke factory miliknya; Owner mulai dari 'all'
  const defaultFactory: FactoryKey =
    !canSwitchFactory && staff?.factory
      ? (String(staff.factory) as FactoryKey)
      : 'all'

  const [trainingTypes, setTrainingTypes]   = useState<TrainingType[]>([])
  const [activeTab, setActiveTab]           = useState<string>('')
  const [activeFactory, setActiveFactory]   = useState<FactoryKey>(defaultFactory)
  const [rows, setRows]                     = useState<ParticipantRow[]>([])
  const [loadingTabs, setLoadingTabs]       = useState(true)
  const [loadingResults, setLoadingResults] = useState(false)
  const [selectedRow, setSelectedRow]       = useState<ParticipantRow | null>(null)

  // PDF states
  const [pdfLoadingId, setPdfLoadingId]   = useState<string | null>(null)
  const [viewLoadingId, setViewLoadingId] = useState<string | null>(null)
  const [bulkLoading, setBulkLoading]     = useState(false)
  const genAllLoading = false
  const [toast, setToast]                 = useState<{ type: 'success' | 'error'; msg: string } | null>(null)

  // Filters
  const [search, setSearch]             = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'passed' | 'failed' | 'incomplete'>('all')
  const [filterDept, setFilterDept]     = useState<string>('all')
  const [showOrphansOnly, setShowOrphansOnly] = useState(false)

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg })
    setTimeout(() => setToast(null), 4000)
  }

  // Sync factory lock once staff data arrives
  useEffect(() => {
    if (!authLoading && !canSwitchFactory && staff?.factory) {
      setActiveFactory(String(staff.factory) as FactoryKey)
    }
  }, [authLoading, canSwitchFactory, staff?.factory])

  // 1. Fetch training types
  useEffect(() => {
    supabase
      .from('training_types')
      .select('id, code, name, is_active')
      .eq('is_active', true)
      .order('name')
      .then(({ data }) => {
        if (data?.length) { setTrainingTypes(data); setActiveTab(data[0].id) }
        setLoadingTabs(false)
      })
  }, [])

  // 2. Fetch & merge pre+post per participant
  useEffect(() => {
    if (!activeTab) return
    const fetch = async () => {
      setLoadingResults(true)
      setRows([])

      // PENTING: kalau lagi filter factory spesifik, join karyawan HARUS
      // pakai `!inner`. Tanpa itu, filter `.eq('karyawan.factory', ...)`
      // cuma bikin hasil join-nya jadi null untuk baris yang gak cocok —
      // baris hasil_ujian-nya sendiri TETAP muncul (PostgREST gak exclude
      // parent row pada left-join embed). Efeknya: pilih filter "Dream"
      // tapi baris "Global" tetap nongol, cuma nama/departemen-nya jadi
      // kosong (ketuker seolah-olah "data rusak").
      // Saat "Semua Factory" dipilih, tetap pakai left join biasa supaya
      // baris yang NIK-nya benar2 gak ada di master karyawan (orphan)
      // tetap kelihatan untuk ditelusuri, bukan didiemin begitu saja.
      const karyawanEmbed = activeFactory !== 'all' ? 'karyawan:nik!inner' : 'karyawan:nik'

      let query = supabase
        .from('hasil_ujian')
        .select(`
          id, nik, training_type_id, score, correct_count,
          total_questions, user_answers, submitted_at, test_type,
          pdf_id,
          ${karyawanEmbed} ( nama, department, factory )
        `)
        .eq('training_type_id', activeTab)
        .order('submitted_at', { ascending: false })

      if (activeFactory !== 'all') {
        query = query.eq('karyawan.factory', parseInt(activeFactory))
      }

      const { data, error } = await query
      if (error) { console.error(error); setLoadingResults(false); return }

      // Group by NIK
      const map = new Map<string, ParticipantRow>()
      ;(data ?? []).forEach((item: any) => {
        const k = item.karyawan as { nama: string; department: string | null; factory: number | null } | null
        const nik = item.nik as string
        if (!map.has(nik)) {
          map.set(nik, {
            nik,
            participant_name: k?.nama ?? nik,
            department: k?.department ?? null,
            factory: k?.factory ?? null,
            pre: null,
            post: null,
            isOrphan: !k,
          })
        }
        const row = map.get(nik)!
        const result: TestResult = {
          id:             item.id,
          score:          item.score ?? 0,
          correct_count:  item.correct_count ?? 0,
          total_questions:item.total_questions ?? 0,
          submitted_at:   item.submitted_at,
          pdf_id:         item.pdf_id ?? null,
          status:         (item.score ?? 0) >= PASSING ? 'passed' : 'failed',
        }
        if (item.test_type === 'pre')  row.pre  = result
        if (item.test_type === 'post') row.post = result
      })

      setRows(Array.from(map.values()))
      setLoadingResults(false)
    }
    fetch()
  }, [activeTab, activeFactory])

  // Derived departments list for dropdown
  const departments = Array.from(new Set(rows.map((r) => r.department).filter(Boolean) as string[])).sort()
  const orphanCount = rows.filter((r) => r.isOrphan).length

  // Derived filter
  const filtered = rows.filter((r) => {
    const q = search.toLowerCase()
    const matchSearch =
      r.participant_name.toLowerCase().includes(q) ||
      r.nik.toLowerCase().includes(q)

    const matchDept = filterDept === 'all' || r.department === filterDept

    const matchStatus =
      filterStatus === 'all'        ? true :
      filterStatus === 'incomplete' ? (!r.pre || !r.post) :
      filterStatus === 'passed'     ? (r.post?.status === 'passed') :
                                      (r.post?.status === 'failed')

    const matchOrphan = !showOrphansOnly || r.isOrphan

    return matchSearch && matchDept && matchStatus && matchOrphan
  })

  const activeTraining = trainingTypes.find((t) => t.id === activeTab)

  const stats = {
    total:      filtered.length,
    complete:   filtered.filter((r) => r.pre && r.post).length,
    passed:     filtered.filter((r) => r.post?.status === 'passed').length,
    avgPost:    filtered.filter((r) => r.post).length
      ? Math.round(filtered.filter((r) => r.post).reduce((a, r) => a + r.post!.score, 0) / filtered.filter((r) => r.post).length)
      : 0,
  }

  // ── PDF handlers ──────────────────────────────────────────────────────────
  const handleGenerateSingle = useCallback(async (hasilId: string) => {
    setPdfLoadingId(hasilId)
    try {
      const result = await generatePdf(hasilId)
      showToast('success', 'PDF berhasil dibuat!')
      setRows((prev) => prev.map((r) => {
        let changed = false
        const next = { ...r }
        if (r.pre?.id === hasilId)  { next.pre  = { ...r.pre!,  pdf_id: result.pdf_id }; changed = true }
        if (r.post?.id === hasilId) { next.post = { ...r.post!, pdf_id: result.pdf_id }; changed = true }
        return changed ? next : r
      }))
      setSelectedRow((prev) => {
        if (!prev) return prev
        if (prev.pre?.id === hasilId)  return { ...prev, pre:  { ...prev.pre!,  pdf_id: result.pdf_id } }
        if (prev.post?.id === hasilId) return { ...prev, post: { ...prev.post!, pdf_id: result.pdf_id } }
        return prev
      })
    } catch (e: any) {
      showToast('error', e.message ?? 'Gagal generate PDF')
    } finally {
      setPdfLoadingId(null)
    }
  }, [])

  const handleViewPdf = useCallback(async (pdfId: string) => {
    setViewLoadingId(pdfId)
    try {
      await viewPdf(pdfId)
    } catch (e: any) {
      showToast('error', e.message ?? 'Gagal membuka PDF')
    } finally {
      setViewLoadingId(null)
    }
  }, [])

  const handleBulkDownload = useCallback(async () => {
    if (!activeTraining) return
    setBulkLoading(true)
    try {
      const now = new Date()
      await downloadZip({
        year:          now.getFullYear(),
        semester:      now.getMonth() < 6 ? 1 : 2,
        training_type: activeTraining.code,
        factory:       activeFactory !== 'all' ? `Factory_${activeFactory}` : undefined,
      })
      showToast('success', 'ZIP sedang didownload…')
    } catch (e: any) {
      showToast('error', e.message ?? 'Gagal download ZIP')
    } finally {
      setBulkLoading(false)
    }
  }, [activeTraining, activeFactory])

  const handleGenerateAll = useCallback(async () => {
    // TODO: implement generateBulkPdf in pdfService when ready
    showToast("error", "Fitur generate bulk belum tersedia")
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const resetFilters = () => {
    setSearch(''); setFilterStatus('all'); setFilterDept('all'); setShowOrphansOnly(false)
  }

  // ── Render ────────────────────────────────────────────────────────────────
  if (authLoading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex items-center gap-3 text-gray-400 text-sm">
        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        Memuat data pengguna…
      </div>
    </div>
  )

  return (
    <>
      <style>{`
        @keyframes fadein  { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
        @keyframes modalIn { from { opacity:0; transform:scale(0.96); } to { opacity:1; transform:scale(1); } }
        @keyframes slideDown { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:none; } }
        .anim-fadein { animation: fadein 0.3s ease both; }
      `}</style>

      {/* Toast */}
      {toast && (
        <div
          className="fixed top-5 right-5 z-[100] flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium"
          style={{
            animation: 'slideDown 0.25s ease both',
            background: toast.type === 'success' ? '#ecfdf5' : '#fef2f2',
            color: toast.type === 'success' ? '#065f46' : '#991b1b',
            border: `1px solid ${toast.type === 'success' ? '#a7f3d0' : '#fecaca'}`,
          }}
        >
          {toast.type === 'success'
            ? <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            : <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          }
          {toast.msg}
        </div>
      )}

      <div className="min-h-screen bg-gray-50">

        {/* ── Top: Factory selector + title ── */}
        <div className="bg-white border-b border-gray-100 px-7 pt-6 pb-0">
          <div className="anim-fadein flex items-end justify-between mb-5">
            <div>
              <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#1a7a73' }}>Hasil Ujian</h1>
              <p className="text-gray-400 text-sm mt-0.5">Pantau hasil pre & post test seluruh peserta</p>
            </div>

            {/* Factory selector — owner bisa switch, admin hanya lihat badge */}
            {canSwitchFactory ? (
              <div className="flex items-center bg-gray-100 rounded-xl p-1 gap-1">
                {FACTORIES.map((f) => (
                  <button key={f.key}
                    onClick={() => { setActiveFactory(f.key); resetFilters() }}
                    className="px-4 py-2 rounded-lg text-xs font-bold transition-all duration-150 whitespace-nowrap"
                    style={activeFactory === f.key
                      ? { background: 'white', color: '#1a7a73', boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }
                      : { color: '#9ca3af' }}>
                    {f.short}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Factory</span>
                {activeFactory !== 'all' && (
                  <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold bg-teal-50 text-teal-600 border border-teal-100">
                    {FACTORIES.find((f) => f.key === activeFactory)?.label ?? `Factory ${activeFactory}`}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Training type tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-px">
            {loadingTabs
              ? [1,2,3,4].map((i) => <div key={i} className="h-9 w-36 rounded-t-lg bg-gray-100 animate-pulse" />)
              : trainingTypes.map((t) => (
                  <button key={t.id}
                    onClick={() => { setActiveTab(t.id); resetFilters() }}
                    className="relative px-5 py-2.5 text-sm font-semibold rounded-t-xl transition-all duration-150 whitespace-nowrap"
                    style={activeTab === t.id
                      ? { background: 'white', color: '#329F96', borderTop: '2px solid #329F96', borderLeft: '1px solid #e5e7eb', borderRight: '1px solid #e5e7eb', marginBottom: '-1px', zIndex: 2 }
                      : { color: '#9ca3af' }}>
                    {t.name}
                    <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded-full font-bold"
                      style={activeTab === t.id
                        ? { background: '#329F9620', color: '#329F96' }
                        : { background: '#f1f5f9', color: '#94a3b8' }}>
                      {activeTab === t.id ? filtered.length : '—'}
                    </span>
                  </button>
                ))}
          </div>
        </div>

        <div className="px-7 py-6 space-y-4">

          {/* ── Stats ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 anim-fadein">
            {[
              { label: 'Total Peserta',    value: stats.total,          color: '#64748b' },
              { label: 'Selesai Keduanya', value: stats.complete,       color: '#0891b2' },
              { label: 'Lulus Post Test',  value: stats.passed,         color: '#059669' },
              { label: 'Rata-rata Post',   value: `${stats.avgPost}%`,  color: '#329F96' },
            ].map((s, i) => (
              <div key={i} className="p-4 rounded-xl border bg-white" style={{ borderColor: '#f1f5f9' }}>
                <p className="text-xs text-gray-400 uppercase tracking-wider">{s.label}</p>
                <p className="text-2xl font-bold mt-1" style={{ color: s.color }}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* ── Orphan warning banner ── */}
          {orphanCount > 0 && (
            <button
              onClick={() => setShowOrphansOnly((v) => !v)}
              className="w-full anim-fadein flex items-center gap-3 p-3 rounded-xl border text-left transition-colors"
              style={showOrphansOnly
                ? { background: '#fffbeb', borderColor: '#fde68a' }
                : { background: '#fffbeb', borderColor: '#fef3c7' }}
            >
              <svg className="w-4 h-4 text-amber-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-xs text-amber-700 flex-1">
                <span className="font-semibold">{orphanCount} baris</span> punya NIK yang tidak ditemukan di data master karyawan — nama & departemen tidak bisa ditampilkan.
              </p>
              <span className="text-[11px] font-semibold text-amber-700 underline shrink-0">
                {showOrphansOnly ? 'Tampilkan semua' : 'Tampilkan yang ini saja'}
              </span>
            </button>
          )}

          {/* ── Toolbar ── */}
          <div className="flex flex-wrap items-center gap-3 anim-fadein">
            {/* Search */}
            <div className="relative flex-1 min-w-[180px]">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
              </svg>
              <input type="text" placeholder="Cari nama, NIK, departemen…" value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 transition"
                style={{ '--tw-ring-color': '#329F96' } as React.CSSProperties} />
            </div>

            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-600 focus:outline-none cursor-pointer">
              <option value="all">Semua Status</option>
              <option value="passed">Post Test Lulus</option>
              <option value="failed">Post Test Tidak Lulus</option>
              <option value="incomplete">Belum Lengkap</option>
            </select>

            <select value={filterDept} onChange={(e) => setFilterDept(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-600 focus:outline-none cursor-pointer">
              <option value="all">Semua Departemen</option>
              {departments.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            {/* Bulk actions */}
            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={handleGenerateAll}
                disabled={genAllLoading || filtered.length === 0}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-opacity disabled:opacity-50"
                style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' }}
              >
                {genAllLoading ? <SpinIcon /> : <DocIcon />}
                Generate Semua PDF
              </button>

              <button
                onClick={handleBulkDownload}
                disabled={bulkLoading || filtered.length === 0}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center gap-2 transition-opacity disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #1a7a73, #329F96)' }}
              >
                {bulkLoading ? (
                  <><SpinIcon />Menyiapkan…</>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download ZIP
                    {filtered.length > 0 && (
                      <span className="bg-white/20 text-[10px] font-bold px-1.5 py-0.5 rounded-full">{filtered.length}</span>
                    )}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ── Table ── */}
          <div className="bg-white rounded-2xl overflow-hidden anim-fadein"
            style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.07), 0 8px 24px rgba(0,0,0,0.05)' }}>

            {/* Table header info */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-700">{activeTraining?.name ?? '—'}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {activeTraining?.code} •{' '}
                  {activeFactory === 'all' ? 'Semua Factory' : FACTORIES.find(f => f.key === activeFactory)?.label}
                </p>
              </div>
              <span className="text-xs text-gray-400">{filtered.length} peserta</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider text-left w-10">No.</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider text-left">NIK</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider text-left">Nama Peserta</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider text-center">Factory</th>
                    {/* Split pre/post header */}
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-center"
                      style={{ color: '#7c3aed' }}>Pre Test</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-center"
                      style={{ color: '#2563eb' }}>Post Test</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider text-left">Tanggal</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider text-center">Aksi</th>
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
                          <p className="text-sm">Belum ada data ujian untuk training ini</p>
                        </td>
                      </tr>
                    )
                    : filtered.map((r, i) => {
                        const latestDate = [r.pre?.submitted_at, r.post?.submitted_at]
                          .filter(Boolean)
                          .sort()
                          .at(-1)
                        return (
                          <tr key={r.nik}
                            className="hover:bg-gray-50/70 transition-colors anim-fadein"
                            style={{
                              animationDelay: `${i * 20}ms`, animationFillMode: 'both',
                              background: r.isOrphan ? '#fffbeb' : undefined,
                            }}>

                            <td className="px-4 py-4 text-gray-400 text-xs font-medium">{i + 1}</td>

                            <td className="px-4 py-4">
                              <span className="text-gray-500 text-xs font-mono">{r.nik}</span>
                            </td>

                            <td className="px-4 py-4">
                              {r.isOrphan ? (
                                <OrphanBadge />
                              ) : (
                                <>
                                  <p className="text-gray-700 font-medium text-sm">{r.participant_name}</p>
                                  {r.department && <p className="text-gray-400 text-[11px] mt-0.5">{r.department}</p>}
                                </>
                              )}
                            </td>

                            <td className="px-4 py-4 text-center">
                              <FactoryChip factory={r.factory} />
                            </td>

                            {/* Pre test cell */}
                            <td className="px-4 py-4 text-center">
                              <TestStatusCell result={r.pre} />
                            </td>

                            {/* Post test cell */}
                            <td className="px-4 py-4 text-center">
                              <TestStatusCell result={r.post} />
                            </td>

                            <td className="px-4 py-4 text-xs text-gray-500">
                              {latestDate
                                ? new Date(latestDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
                                : '—'}
                            </td>

                            <td className="px-4 py-4 text-center">
                              <button
                                onClick={() => setSelectedRow(r)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                                style={{ background: '#329F9615', color: '#329F96' }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = '#329F9625')}
                                onMouseLeave={(e) => (e.currentTarget.style.background = '#329F9615')}
                              >
                                <EyeIcon />
                                Detail
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedRow && (
        <ModalDetail
          row={selectedRow}
          onClose={() => setSelectedRow(null)}
          onGeneratePdf={handleGenerateSingle}
          onViewPdf={handleViewPdf}
          pdfLoadingId={pdfLoadingId}
          viewLoadingId={viewLoadingId}
        />
      )}
    </>
  )
}