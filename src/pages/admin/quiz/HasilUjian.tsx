import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

// ── Types ────────────────────────────────────────────────────────────────────
interface TrainingType {
  id: string
  code: string
  name: string
  is_active: boolean
}

// Interface sesuai tabel 'hasil_ujian' + join 'karyawan'
interface QuizResult {
  id: string
  nik: string
  training_type_id: string
  score: number
  correct_count: number
  total_questions: number
  user_answers: Record<string, string>
  submitted_at: string
  
  // Fields dari join tabel karyawan
  karyawan?: {
    nama: string
    department: string | null
    factory: number | null
  }
  
  // Computed fields
  status: 'passed' | 'failed'
  participant_name: string
  participant_email: string
  participant_nik: string
  department: string | null
  factory: number | null
}

// ── Badge helpers ────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: 'passed' | 'failed' }) {
  const styles = {
    passed: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', label: 'Lulus' },
    failed: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100', label: 'Tidak Lulus' },
  }
  const s = styles[status]
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border ${s.bg} ${s.text} ${s.border}`}>
      {s.label}
    </span>
  )
}

function FactoryBadge({ factory }: { factory: number | null }) {
  if (factory == null) return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-gray-100 text-gray-500">
      Global
    </span>
  )
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-teal-50 text-teal-600 border border-teal-100">
      F{factory}
    </span>
  )
}

function ScoreBadge({ score, passingGrade = 70 }: { score: number; passingGrade?: number }) {
  const isPassed = score >= passingGrade
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-bold ${
        isPassed ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
      }`}
    >
      {score}%
    </span>
  )
}

// ── Skeleton loader ──────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <tr className="border-b border-gray-50">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <td key={i} className="px-5 py-4">
          <div className="h-3 bg-gray-100 rounded-full animate-pulse" style={{ width: `${30 + i * 12}%` }} />
        </td>
      ))}
    </tr>
  )
}

// ── Modal Detail Hasil ───────────────────────────────────────────────────────
function ModalDetail({ result, onClose }: { result: QuizResult; onClose: () => void }) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    })
  }

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
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{ background: 'linear-gradient(135deg, #1a7a73, #329F96)' }}
        >
          <div>
            <p className="text-white/60 text-xs font-medium uppercase tracking-wider">
              Detail Hasil Ujian
            </p>
            <p className="text-white font-bold text-sm mt-0.5">{result.participant_name}</p>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={result.status} />
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          {/* Participant Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Nama Peserta</p>
              <p className="text-gray-700 font-medium">{result.participant_name}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">NIK</p>
              <p className="text-gray-700 font-medium">{result.participant_nik}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Departemen</p>
              <p className="text-gray-700 font-medium">{result.department ?? '—'}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Factory</p>
              <FactoryBadge factory={result.factory} />
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Tanggal Ujian</p>
              <p className="text-gray-700 font-medium">{formatDate(result.submitted_at)}</p>
            </div>
          </div>

          {/* Score Summary */}
          <div
            className="p-4 rounded-xl border"
            style={{ background: '#f8fafc', borderColor: '#e2e8f0' }}
          >
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

          {/* Passing Grade Info */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-50 border border-amber-100">
            <svg className="w-5 h-5 text-amber-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-xs text-amber-700">
              <span className="font-semibold">Passing Grade: 70%</span> • Peserta dinyatakan lulus jika mencapai nilai minimal 70%
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors"
          >
            Tutup
          </button>
          <button
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-colors"
            style={{ background: 'linear-gradient(135deg, #1a7a73, #329F96)' }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            📄 Export PDF
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function HasilUjian() {
  const [trainingTypes, setTrainingTypes] = useState<TrainingType[]>([])
  const [activeTab, setActiveTab] = useState<string>('')
  const [results, setResults] = useState<QuizResult[]>([])
  const [loadingTabs, setLoadingTabs] = useState(true)
  const [loadingResults, setLoadingResults] = useState(false)
  const [selectedResult, setSelectedResult] = useState<QuizResult | null>(null)
  
  // Filters
  const [search, setSearch] = useState('')
  const [filterFactory, setFilterFactory] = useState<'all' | '1' | '2' | 'null'>('all')
  const [filterStatus, setFilterStatus] = useState<'all' | 'passed' | 'failed'>('all')
  const [filterDate, setFilterDate] = useState<'all' | 'today' | 'week' | 'month'>('all')

  const PASSING_GRADE = 70

  // 1. Fetch training types untuk Tabs
  useEffect(() => {
    supabase
      .from('training_types')
      .select('id, code, name, is_active')
      .eq('is_active', true)
      .order('name')
      .then(({ data }) => {
        if (data && data.length > 0) {
          setTrainingTypes(data)
          setActiveTab(data[0].id)
        }
        setLoadingTabs(false)
      })
  }, [])

  // 2. Fetch hasil ujian + join karyawan sesuai training_type_id
  useEffect(() => {
    if (!activeTab) return
    
    const fetchResults = async () => {
      setLoadingResults(true)
      setResults([])
      
      // Base query: ambil dari tabel 'hasil_ujian' + join 'karyawan'
      let query = supabase
        .from('hasil_ujian')
        .select(`
          id,
          nik,
          training_type_id,
          score,
          correct_count,
          total_questions,
          user_answers,
          submitted_at,
          karyawan:nik (
            nama,
            department,
            factory
          )
        `)
        .eq('training_type_id', activeTab) // ⭐ FILTER UTAMA: sesuai training
        .order('submitted_at', { ascending: false })

      // Apply filter Factory
      if (filterFactory !== 'all') {
        if (filterFactory === 'null') {
          // Filter: factory IS NULL (global)
          query = query.is('karyawan.factory', null)
        } else {
          // Filter: factory = 1 atau 2
          query = query.eq('karyawan.factory', parseInt(filterFactory))
        }
      }

      // Apply filter Status (computed from score)
      if (filterStatus !== 'all') {
        // Note: filter status dilakukan di frontend karena computed field
      }

      // Apply filter Date
      if (filterDate !== 'all') {
        const now = new Date()
        let startDate: Date
        switch (filterDate) {
          case 'today':
            startDate = new Date(now.setHours(0, 0, 0, 0))
            break
          case 'week':
            startDate = new Date(now.setDate(now.getDate() - 7))
            break
          case 'month':
            startDate = new Date(now.setMonth(now.getMonth() - 1))
            break
          default:
            startDate = new Date(0)
        }
        query = query.gte('submitted_at', startDate.toISOString())
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching results:', error)
        setLoadingResults(false)
        return
      }

      // Transform data: mapping + computed fields
      const transformed = (data ?? []).map((item: any): QuizResult => {
        const karyawan = item.karyawan as { nama: string; department: string | null; factory: number | null } | null
        const score = item.score ?? 0
        const status = score >= PASSING_GRADE ? 'passed' : 'failed'
        
        return {
          id: item.id,
          nik: item.nik,
          training_type_id: item.training_type_id,
          score,
          correct_count: item.correct_count ?? 0,
          total_questions: item.total_questions ?? 0,
          user_answers: item.user_answers ?? {},
          submitted_at: item.submitted_at,
          karyawan: karyawan ?? undefined,
          
          // Computed / flattened fields untuk kemudahan UI
          status,
          participant_name: karyawan?.nama ?? item.nik,
          participant_email: '', // Tidak ada field email di tabel karyawan
          participant_nik: item.nik,
          department: karyawan?.department ?? null,
          factory: karyawan?.factory ?? null,
        }
      })

      setResults(transformed)
      setLoadingResults(false)
    }

    fetchResults()
  }, [activeTab, filterFactory, filterDate])

  // 3. Filter client-side: search + status
  const filtered = results.filter((r) => {
    // Search: nama, NIK, departemen
    const matchSearch = 
      r.participant_name.toLowerCase().includes(search.toLowerCase()) ||
      r.participant_nik.toLowerCase().includes(search.toLowerCase()) ||
      (r.department ?? '').toLowerCase().includes(search.toLowerCase())
    
    // Status filter (computed)
    const matchStatus = filterStatus === 'all' || r.status === filterStatus
    
    return matchSearch && matchStatus
  })

  const activeTraining = trainingTypes.find((t) => t.id === activeTab)

  // Stats summary
  const stats = {
    total: filtered.length,
    passed: filtered.filter(r => r.status === 'passed').length,
    failed: filtered.filter(r => r.status === 'failed').length,
    avgScore: filtered.length > 0 
      ? Math.round(filtered.reduce((acc, r) => acc + r.score, 0) / filtered.length) 
      : 0,
  }

  return (
    <>
      <style>{`
        @keyframes fadein { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:none; } }
        @keyframes modalIn { from { opacity:0; transform:scale(0.96); } to { opacity:1; transform:scale(1); } }
        .animate-fadein { animation: fadein 0.35s ease both; }
      `}</style>

      <div className="min-h-screen bg-gray-50">

        {/* ── Page Header ──────────────────────────────────────── */}
        <div className="bg-white border-b border-gray-100 px-7 pt-7 pb-0">
          <div className="animate-fadein">
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#1a7a73' }}>
              Hasil Ujian
            </h1>
            <p className="text-gray-400 text-sm mt-0.5 mb-4">
              Pantau hasil dan performa peserta ujian
            </p>
          </div>

          {/* ── Tabs: Dynamic dari training_types ────────────────── */}
          <div className="flex items-center gap-1 overflow-x-auto pb-px">
            {loadingTabs ? (
              [1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-9 w-32 rounded-t-lg bg-gray-100 animate-pulse" />
              ))
            ) : (
              trainingTypes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => { 
                    setActiveTab(t.id)
                    setSearch('')
                    setFilterFactory('all')
                    setFilterStatus('all')
                    setFilterDate('all')
                  }}
                  className="relative px-5 py-2.5 text-sm font-semibold rounded-t-xl transition-all duration-150 whitespace-nowrap"
                  style={
                    activeTab === t.id
                      ? { background: 'white', color: '#329F96', borderTop: '2px solid #329F96', borderLeft: '1px solid #e5e7eb', borderRight: '1px solid #e5e7eb', marginBottom: '-1px', zIndex: 2 }
                      : { color: '#9ca3af', background: 'transparent' }
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
              ))
            )}
          </div>
        </div>

        {/* ── Content ──────────────────────────────────────────── */}
        <div className="px-7 py-6 space-y-4">

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 animate-fadein">
            {[
              { label: 'Total Peserta', value: stats.total, color: '#64748b', bg: '#f1f5f9' },
              { label: 'Lulus', value: stats.passed, color: '#059669', bg: '#dcfce7' },
              { label: 'Tidak Lulus', value: stats.failed, color: '#dc2626', bg: '#fee2e2' },
              { label: 'Rata-rata Nilai', value: `${stats.avgScore}%`, color: '#329F96', bg: '#f0fdfa' },
            ].map((stat, i) => (
              <div
                key={i}
                className="p-4 rounded-xl border"
                style={{ background: 'white', borderColor: '#f1f5f9' }}
              >
                <p className="text-xs text-gray-400 uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-bold mt-1" style={{ color: stat.color }}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-3 animate-fadein">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
              </svg>
              <input
                type="text"
                placeholder="Cari nama, NIK, atau departemen…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm
                           focus:outline-none focus:ring-2 transition"
                style={{ '--tw-ring-color': '#329F96' } as React.CSSProperties}
              />
            </div>

            {/* Filter Factory */}
            <select
              value={filterFactory}
              onChange={(e) => setFilterFactory(e.target.value as any)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-600 focus:outline-none focus:ring-2 transition cursor-pointer"
              style={{ '--tw-ring-color': '#329F96' } as React.CSSProperties}
            >
              <option value="all">Semua Factory</option>
              <option value="null">Global</option>
              <option value="1">Factory 1</option>
              <option value="2">Factory 2</option>
            </select>

            {/* Filter Status */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-600 focus:outline-none focus:ring-2 transition cursor-pointer"
              style={{ '--tw-ring-color': '#329F96' } as React.CSSProperties}
            >
              <option value="all">Semua Status</option>
              <option value="passed">Lulus</option>
              <option value="failed">Tidak Lulus</option>
            </select>

            {/* Filter Date */}
            <select
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value as any)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-600 focus:outline-none focus:ring-2 transition cursor-pointer"
              style={{ '--tw-ring-color': '#329F96' } as React.CSSProperties}
            >
              <option value="all">Semua Waktu</option>
              <option value="today">Hari Ini</option>
              <option value="week">7 Hari Terakhir</option>
              <option value="month">30 Hari Terakhir</option>
            </select>

            {/* Export Button */}
            <button
              className="ml-auto px-4 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center gap-2 transition-opacity"
              style={{ background: 'linear-gradient(135deg, #1a7a73, #329F96)' }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export
            </button>
          </div>

          {/* ── Table ──────────────────────────────────────────── */}
          <div
            className="bg-white rounded-2xl overflow-hidden animate-fadein"
            style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.07), 0 8px 24px rgba(0,0,0,0.05)', animationDelay: '80ms', animationFillMode: 'both' }}
          >
            {/* Table header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-700">{activeTraining?.name ?? '—'}</p>
                <p className="text-xs text-gray-400">{activeTraining?.code}</p>
              </div>
              <span className="text-xs text-gray-400">
                {filtered.length} data ditemukan
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider w-12">No.</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Peserta</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider w-24">Factory</th>
                    <th className="text-center px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider w-24">Nilai</th>
                    <th className="text-center px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider w-28">Status</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider w-36">Tanggal</th>
                    <th className="text-center px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider w-20">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loadingResults
                    ? Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
                    : filtered.length === 0
                    ? (
                      <tr>
                        <td colSpan={7} className="text-center py-16 text-gray-300">
                          <svg className="w-10 h-10 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          <p className="text-sm">Belum ada hasil ujian untuk kategori ini</p>
                        </td>
                      </tr>
                    )
                    : filtered.map((result, i) => (
                      <tr
                        key={result.id}
                        className="hover:bg-gray-50/70 transition-colors animate-fadein"
                        style={{ animationDelay: `${i * 30}ms`, animationFillMode: 'both' }}
                      >
                        {/* Nomor */}
                        <td className="px-5 py-4">
                          <span className="text-gray-400 text-xs font-medium">{i + 1}</span>
                        </td>

                        {/* Peserta Info */}
                        <td className="px-5 py-4">
                          <div className="min-w-[180px]">
                            <p className="text-gray-700 font-medium text-sm">{result.participant_name}</p>
                            <p className="text-gray-400 text-xs">NIK: {result.participant_nik}</p>
                            {result.department && (
                              <p className="text-gray-400 text-[10px] mt-0.5">{result.department}</p>
                            )}
                          </div>
                        </td>

                        {/* Factory */}
                        <td className="px-5 py-4">
                          <FactoryBadge factory={result.factory} />
                        </td>

                        {/* Score */}
                        <td className="px-5 py-4 text-center">
                          <ScoreBadge score={result.score} passingGrade={PASSING_GRADE} />
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4 text-center">
                          <StatusBadge status={result.status} />
                        </td>

                        {/* Date */}
                        <td className="px-5 py-4">
                          <span className="text-gray-500 text-xs">
                            {new Date(result.submitted_at).toLocaleDateString('id-ID', { 
                              day: '2-digit', month: 'short', year: 'numeric' 
                            })}
                          </span>
                        </td>

                        {/* Aksi */}
                        <td className="px-5 py-4 text-center">
                          <button
                            onClick={() => setSelectedResult(result)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                            style={{ background: '#329F9615', color: '#329F96' }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = '#329F9625')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = '#329F9615')}
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            Detail
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* ── Modal ──────────────────────────────────────────────── */}
      {selectedResult && (
        <ModalDetail result={selectedResult} onClose={() => setSelectedResult(null)} />
      )}
    </>
  )
}